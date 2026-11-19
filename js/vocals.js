/* /vocals page: nav, scroll reveals, GA4 pay-click events.
   Prices and Stripe links are handled by /js/currency.js; the before/after
   players by /js/ab-compare.js. */
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
})();
