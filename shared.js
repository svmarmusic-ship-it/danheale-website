/* ══════════════════════════════════════════════════════════
   SHARED SCRIPT — danheale.com
   Loaded by: index.html, /suno-reproduction/

   Verified byte-identical between those two pages: nav scroll
   compact + progress bar (the hero parallax lines are harmless
   on /suno-reproduction/ since its .hero::before doesn't consume
   the --hero-glow-y custom property — it's simply an unused,
   invisible property there), hamburger + mobile menu, the
   .reveal IntersectionObserver, and the cursor glow.

   /dj/ and /production/ are intentionally NOT wired to this file —
   their nav/hamburger JS is close but not identical (different
   aria-label handling, no progress bar, no cursor glow), so forcing
   them onto this script would change their behaviour rather than
   just de-duplicate it. Out of scope for a structural-only refactor.

   Page-specific behaviour stays inline on each page: stats count-up,
   card-reveal stagger, contact form AJAX submit, course waitlist —
   all homepage/suno-reproduction-specific, not shared.
   ══════════════════════════════════════════════════════════ */

var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Nav: compact on scroll + scroll progress ─────────────
var nav = document.getElementById('nav');
var heroEl = document.querySelector('.hero');
var progressBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', function() {
  var y = window.scrollY;

  // Compact nav
  nav.classList.toggle('scrolled', y > 40);

  // Hero parallax glow — shifts the radial-gradient centre down as you scroll
  if (!reducedMotion && heroEl) {
    var heroH = heroEl.offsetHeight;
    var progress = Math.min(y / heroH, 1);
    var glowY = 30 + progress * 22; // 30% → ~52% over the hero height
    heroEl.style.setProperty('--hero-glow-y', glowY + '%');
  }

  // Scroll progress bar
  if (progressBar && !reducedMotion) {
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
  }
}, { passive: true });

// ── Hamburger menu ───────────────────────────────────────
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', function() {
  var isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

mobileMenu.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
  });
});

// ── Scroll reveal ─────────────────────────────────────────
if ('IntersectionObserver' in window) {
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function(el) {
    revealObserver.observe(el);
  });
}

// ── Cursor glow ──────────────────────────────────────────
var cursorGlowEl = document.getElementById('cursor-glow');
if (cursorGlowEl && !reducedMotion) {
  document.addEventListener('mousemove', function(e) {
    cursorGlowEl.style.left = e.clientX + 'px';
    cursorGlowEl.style.top  = e.clientY + 'px';
  }, { passive: true });
}
