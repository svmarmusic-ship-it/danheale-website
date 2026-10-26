/* /vocals page: nav, scroll reveals, before/after players, GA4 pay-click events.
   Prices and Stripe links are handled by /js/currency.js. */
(function () {
  // ── Nav: shrink on scroll + mobile menu ─────────────────
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  function setMenu(open) {
    mobileMenu.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  hamburger.addEventListener('click', function () {
    setMenu(!mobileMenu.classList.contains('open'));
  });
  mobileMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  // ── Scroll reveals ──────────────────────────────────────
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // ── GA4: which tier gets clicked ────────────────────────
  document.querySelectorAll('.pay-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (typeof window.gtag !== 'function') return;
      window.gtag('event', 'pay_and_book_click', {
        tier: btn.getAttribute('data-tier'),
        currency: document.documentElement.getAttribute('data-currency') || 'GBP',
        link_url: btn.href,
        transport_type: 'beacon'
      });
    });
  });

  // ── Before / after players ──────────────────────────────
  // Each player has a "before" and an "after" <audio>. Only one plays at a
  // time; switching carries the playback position across so the comparison
  // is the same moment of the song.
  var players = [];

  function fmt(t) {
    if (!isFinite(t)) t = 0;
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function Player(root) {
    var self = this;
    this.root = root;
    this.audio = {
      before: root.querySelector('audio[data-version="before"]'),
      after: root.querySelector('audio[data-version="after"]')
    };
    this.version = 'before';
    this.playBtn = root.querySelector('.ab-play');
    this.timeEl = root.querySelector('.ab-time');
    this.bar = root.querySelector('.ab-bar');
    this.fill = root.querySelector('.ab-fill');
    this.switchBtns = root.querySelectorAll('.ab-switch button');
    this.title = root.querySelector('.ab-title').textContent;

    ['before', 'after'].forEach(function (v) {
      var a = self.audio[v];
      a.addEventListener('timeupdate', function () { if (v === self.version) self.render(); });
      a.addEventListener('loadedmetadata', function () { if (v === self.version) self.render(); });
      a.addEventListener('ended', function () { if (v === self.version) self.setPlaying(false); });
      a.addEventListener('error', function () { self.unavailable(); });
    });
    // A missing file can fail before this script runs, so check now too.
    if (this.audio.before.error || this.audio.after.error ||
        this.audio.before.networkState === 3 || this.audio.after.networkState === 3) {
      setTimeout(function () { self.unavailable(); }, 0);
    }

    this.playBtn.addEventListener('click', function () {
      if (self.playing) self.pause(); else self.play();
    });

    this.switchBtns.forEach(function (btn) {
      btn.addEventListener('click', function () { self.switchTo(btn.getAttribute('data-version')); });
    });

    // Seek by tap/drag on the bar.
    var dragging = false;
    function seekFromEvent(e) {
      var rect = self.bar.getBoundingClientRect();
      var pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      self.seek(pct);
    }
    this.bar.addEventListener('pointerdown', function (e) {
      dragging = true;
      self.bar.setPointerCapture(e.pointerId);
      seekFromEvent(e);
    });
    this.bar.addEventListener('pointermove', function (e) { if (dragging) seekFromEvent(e); });
    this.bar.addEventListener('pointerup', function () { dragging = false; });
    this.bar.addEventListener('pointercancel', function () { dragging = false; });

    this.bar.addEventListener('keydown', function (e) {
      var a = self.current();
      if (!isFinite(a.duration)) return;
      if (e.key === 'ArrowRight') { a.currentTime = Math.min(a.duration, a.currentTime + 5); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { a.currentTime = Math.max(0, a.currentTime - 5); e.preventDefault(); }
      self.render();
    });
  }

  Player.prototype.current = function () { return this.audio[this.version]; };

  Player.prototype.play = function () {
    var self = this;
    players.forEach(function (p) { if (p !== self) p.pause(); });
    var p = this.current().play();
    if (p && p.catch) p.catch(function () { self.setPlaying(false); });
    this.setPlaying(true);
  };

  Player.prototype.pause = function () {
    this.audio.before.pause();
    this.audio.after.pause();
    this.setPlaying(false);
  };

  Player.prototype.setPlaying = function (on) {
    this.playing = on;
    this.root.classList.toggle('is-playing', on);
    this.playBtn.setAttribute('aria-label', (on ? 'Pause ' : 'Play ') + this.title);
  };

  Player.prototype.switchTo = function (version) {
    if (version === this.version) return;
    var from = this.current();
    var to = this.audio[version];
    var t = from.currentTime;
    from.pause();
    this.version = version;
    try { to.currentTime = t; } catch (e) {}
    this.switchBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-version') === version ? 'true' : 'false');
    });
    if (this.playing) this.play();
    this.render();
  };

  Player.prototype.seek = function (pct) {
    var a = this.current();
    if (!isFinite(a.duration)) return;
    a.currentTime = pct * a.duration;
    this.render();
  };

  Player.prototype.render = function () {
    var a = this.current();
    var pct = isFinite(a.duration) && a.duration > 0 ? (a.currentTime / a.duration) * 100 : 0;
    this.fill.style.width = pct + '%';
    this.bar.setAttribute('aria-valuenow', String(Math.round(pct)));
    this.timeEl.textContent = fmt(a.currentTime) + (isFinite(a.duration) ? ' / ' + fmt(a.duration) : '');
  };

  Player.prototype.unavailable = function () {
    if (this.root.classList.contains('is-unavailable')) return;
    this.pause();
    this.root.classList.add('is-unavailable');
    this.timeEl.textContent = 'audio coming soon';
    this.playBtn.disabled = true;
  };

  // The section's `hidden` attribute is the on/off switch. Audio sources sit
  // in data-src so nothing downloads while it's off.
  var abSection = document.getElementById('before-after');
  if (abSection && !abSection.hidden) {
    abSection.querySelectorAll('audio[data-src]').forEach(function (a) {
      a.src = a.getAttribute('data-src');
    });
    abSection.querySelectorAll('.ab-player').forEach(function (el) {
      players.push(new Player(el));
    });
  }
})();
