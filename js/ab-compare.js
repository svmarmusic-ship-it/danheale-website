/* Before/after vocal players ("Hear the difference" on /vocals).

   Markup (one card per [data-ab]; copy a card to add another):
     [data-ab]                     the card; optional data-dry-gain="1" level-matches the dry file
       audio[data-ab-dry]          dry file  (preload="metadata" playsinline)
       audio[data-ab-fx]           full-FX file, same take, starting at the same moment
       [data-ab-toggle]            pill holding the two buttons below; gets data-active="dry|fx"
         [data-ab-show="dry|fx"]   switches which file is audible
       [data-ab-play]              play/pause button
       [data-ab-seek]              progress bar (tap or drag; arrow keys when focused)
       [data-ab-time]              time readout

   How it works: both files of a card play together and stay in sync. The
   toggle only changes which one you hear, through a GainNode per file
   (Web Audio: one AudioContext, createMediaElementSource → GainNode) with a
   ~30 ms crossfade, so playback never restarts. audio.volume isn't used
   because iOS Safari ignores it. The dry file is the clock: if the FX file
   drifts more than 40 ms from it, it's moved back in line. A card's length
   is the shorter of its two files. Only one card plays at a time. */
(function () {
  'use strict';

  var FADE = 0.03;         // seconds, toggle crossfade
  var MAX_DRIFT = 0.04;    // seconds, resync threshold
  var SYNC_EVERY = 250;    // ms between drift checks while playing
  var SEEK_THROTTLE = 80;  // ms between seeks while dragging

  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  var ctx = null;
  var cards = [];

  // Created on the first play tap: browsers only allow audio to start from a
  // user gesture, and iOS needs the context resumed inside that gesture too.
  function getContext() {
    if (!AudioCtx) return null;
    if (!ctx) {
      try { ctx = new AudioCtx(); } catch (e) { return null; }
      // iOS 17+: let Web Audio play even with the ringer switch on silent.
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    }
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
    return ctx;
  }

  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function rampTo(param, value) {
    var now = ctx.currentTime;
    param.cancelScheduledValues(now);
    param.setValueAtTime(param.value, now);
    param.linearRampToValueAtTime(value, now + FADE);
  }

  function Card(el) {
    var self = this;
    this.el = el;
    this.dry = el.querySelector('audio[data-ab-dry]');
    this.fx = el.querySelector('audio[data-ab-fx]');
    this.toggle = el.querySelector('[data-ab-toggle]');
    this.showBtns = el.querySelectorAll('[data-ab-show]');
    this.playBtn = el.querySelector('[data-ab-play]');
    this.seekEl = el.querySelector('[data-ab-seek]');
    this.timeEl = el.querySelector('[data-ab-time]');

    var g = parseFloat(el.getAttribute('data-dry-gain'));
    this.dryLevel = isFinite(g) && g >= 0 ? g : 1;

    this.active = (this.toggle && this.toggle.getAttribute('data-active') === 'fx') ? 'fx' : 'dry';
    this.playing = false;
    this.graph = null;   // null = not built yet, false = Web Audio unavailable
    this.raf = 0;
    this.lastSync = 0;
    this.label = this.playBtn ? (this.playBtn.getAttribute('aria-label') || 'Play').replace(/^Play\s*/, '') : '';

    // Both files decode metadata only until first play.
    [this.dry, this.fx].forEach(function (a) {
      a.addEventListener('loadedmetadata', function () { self.render(); });
      a.addEventListener('durationchange', function () { self.render(); });
      a.addEventListener('ended', function () { self.reset(); });
      a.addEventListener('error', function () { self.fail(); });
    });
    // Keep sync going even when rAF is throttled (background tab).
    this.dry.addEventListener('timeupdate', function () { if (self.playing) self.sync(false); });
    // Paused from outside (lock screen, interruption): pause the pair together.
    this.dry.addEventListener('pause', function () { if (self.playing && !self.dry.ended) self.pause(); });

    this.playBtn.addEventListener('click', function () {
      if (self.playing) self.pause(); else self.play();
    });

    Array.prototype.forEach.call(this.showBtns, function (btn) {
      btn.addEventListener('click', function () { self.setActive(btn.getAttribute('data-ab-show')); });
    });

    this.bindSeek();
    this.setActive(this.active, true);
    this.render();
  }

  Card.prototype.duration = function () {
    var d = this.dry.duration, f = this.fx.duration;
    if (isFinite(d) && isFinite(f)) return Math.min(d, f);
    return NaN;
  };

  Card.prototype.buildGraph = function () {
    if (this.graph !== null) return;
    var c = getContext();
    if (!c) { this.graph = false; this.applyMuted(); return; }
    try {
      var drySrc = c.createMediaElementSource(this.dry);
      var fxSrc = c.createMediaElementSource(this.fx);
      var dryGain = c.createGain();
      var fxGain = c.createGain();
      dryGain.gain.value = this.active === 'dry' ? this.dryLevel : 0;
      fxGain.gain.value = this.active === 'fx' ? 1 : 0;
      drySrc.connect(dryGain); dryGain.connect(c.destination);
      fxSrc.connect(fxGain); fxGain.connect(c.destination);
      this.graph = { dry: dryGain, fx: fxGain };
    } catch (e) {
      this.graph = false;
    }
    this.applyMuted();
  };

  // Fallback for browsers without Web Audio: mute the inactive file instead.
  // With the gain graph in place, both elements stay unmuted.
  Card.prototype.applyMuted = function () {
    var fallback = this.graph === false;
    this.dry.muted = fallback && this.active !== 'dry';
    this.fx.muted = fallback && this.active !== 'fx';
  };

  Card.prototype.setActive = function (version, initial) {
    if (version !== 'dry' && version !== 'fx') return;
    this.active = version;
    if (this.toggle) this.toggle.setAttribute('data-active', version);
    Array.prototype.forEach.call(this.showBtns, function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-ab-show') === version ? 'true' : 'false');
    });
    if (initial) return;
    if (this.graph) {
      rampTo(this.graph.dry.gain, version === 'dry' ? this.dryLevel : 0);
      rampTo(this.graph.fx.gain, version === 'fx' ? 1 : 0);
    } else if (this.graph === false) {
      this.applyMuted();
    }
    if (this.playing) this.sync(true);
  };

  Card.prototype.play = function () {
    var self = this;
    cards.forEach(function (c) { if (c !== self) c.pause(); });
    this.buildGraph();

    try { this.fx.currentTime = this.dry.currentTime; } catch (e) {}
    this.playing = true;
    this.el.classList.add('is-playing');
    this.playBtn.setAttribute('aria-label', 'Pause ' + this.label);

    var p1 = this.dry.play();
    var p2 = this.fx.play();
    [p1, p2].forEach(function (p) {
      if (p && p.catch) p.catch(function () { if (self.playing) self.pause(); });
    });
    this.loop();
  };

  Card.prototype.pause = function () {
    this.playing = false;
    this.dry.pause();
    this.fx.pause();
    this.el.classList.remove('is-playing');
    this.playBtn.setAttribute('aria-label', 'Play ' + this.label);
    cancelAnimationFrame(this.raf);
    this.render();
  };

  // End of the (shorter) file: back to the start, play icon showing.
  Card.prototype.reset = function () {
    this.pause();
    try { this.dry.currentTime = 0; this.fx.currentTime = 0; } catch (e) {}
    this.render();
  };

  Card.prototype.fail = function () {
    this.pause();
    this.el.classList.add('is-error');
    this.playBtn.disabled = true;
    if (this.timeEl) this.timeEl.textContent = 'unavailable';
  };

  // Keep the FX file locked to the dry file.
  Card.prototype.sync = function (force) {
    var now = Date.now();
    if (!force && now - this.lastSync < SYNC_EVERY) return;
    this.lastSync = now;
    if (this.dry.seeking || this.fx.seeking) return;
    var t = this.dry.currentTime;
    if (isFinite(this.fx.duration) && t >= this.fx.duration) return;
    if (Math.abs(this.fx.currentTime - t) > MAX_DRIFT) {
      try { this.fx.currentTime = t; } catch (e) {}
    }
  };

  Card.prototype.loop = function () {
    var self = this;
    cancelAnimationFrame(this.raf);
    (function tick() {
      if (!self.playing) return;
      var d = self.duration();
      if (isFinite(d) && self.dry.currentTime >= d - 0.02) { self.reset(); return; }
      self.sync(false);
      self.render();
      self.raf = requestAnimationFrame(tick);
    })();
  };

  Card.prototype.seekTo = function (seconds) {
    var d = this.duration();
    if (!isFinite(d)) return;
    var t = Math.max(0, Math.min(d - 0.05, seconds));
    try {
      this.dry.currentTime = t;
      this.fx.currentTime = t;
    } catch (e) {}
    this.render(t);
  };

  Card.prototype.bindSeek = function () {
    var self = this;
    var el = this.seekEl;
    var dragging = false;
    var lastSeek = 0;

    function timeAt(e) {
      var rect = el.getBoundingClientRect();
      var pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      return pct * self.duration();
    }

    el.addEventListener('pointerdown', function (e) {
      if (!isFinite(self.duration())) return;
      dragging = true;
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
      self.seekTo(timeAt(e));
      lastSeek = Date.now();
      e.preventDefault();
    });
    el.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var t = timeAt(e);
      if (Date.now() - lastSeek >= SEEK_THROTTLE) {
        self.seekTo(t);
        lastSeek = Date.now();
      } else {
        self.render(t);
      }
    });
    function end(e) {
      if (!dragging) return;
      dragging = false;
      if (e && e.type === 'pointerup') self.seekTo(timeAt(e));
    }
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);

    el.addEventListener('keydown', function (e) {
      var d = self.duration();
      if (!isFinite(d)) return;
      var t = self.dry.currentTime;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') t += 5;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') t -= 5;
      else if (e.key === 'Home') t = 0;
      else if (e.key === 'End') t = d - 0.1;
      else return;
      e.preventDefault();
      self.seekTo(t);
    });
  };

  Card.prototype.render = function (displayTime) {
    var d = this.duration();
    var t = typeof displayTime === 'number' ? displayTime : this.dry.currentTime;
    var pct = isFinite(d) && d > 0 ? Math.min(100, (t / d) * 100) : 0;
    this.seekEl.style.setProperty('--pct', pct + '%');
    this.seekEl.setAttribute('aria-valuenow', String(Math.round(pct)));
    if (isFinite(d)) this.seekEl.setAttribute('aria-valuetext', fmt(t) + ' of ' + fmt(d));
    if (this.timeEl && !this.el.classList.contains('is-error')) {
      this.timeEl.textContent = isFinite(d) ? fmt(t) + ' / ' + fmt(d) : fmt(t);
    }
  };

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-ab]'), function (el) {
      if (!el.querySelector('audio[data-ab-dry]') || !el.querySelector('audio[data-ab-fx]')) return;
      cards.push(new Card(el));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
