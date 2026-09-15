/* danheale.com — magnetic 3D tilt on cards.
   How It Works steps, Reviews, Services rows, and Shop cards tilt toward the
   cursor in real 3D (perspective is already set on each one's parent container by
   the reveal-system CSS), lift with a scale-up and shadow, and get a soft glow that
   follows the cursor. Mouse-only: skipped entirely on touch/coarse pointers and
   under prefers-reduced-motion — touch still gets a plain CSS :active scale on tap,
   no JS needed for that (see the :active rule next to .tilt-active in index.html). */
(function () {
  'use strict';

  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reduced) return;

  var MAX_TILT = 7;   // degrees, "a few degrees max"
  var SCALE = 1.03;
  var SETTLE_MS = 520; // must match the .tilt-settling transition duration in CSS
  // The scroll-reveal system (motion.js) finishes each card's entrance animation by
  // leaving `filter: blur(0px)` as an inline style — that's just how GSAP tweens
  // work, they set the final value directly on the element. An inline style always
  // beats a stylesheet rule, so a CSS `.tilt-active { filter: drop-shadow(...) }`
  // could never actually take effect on any of these cards. Setting filter here in
  // JS, the same way transform already is, overwrites that leftover correctly.
  var LIFT_SHADOW = 'drop-shadow(0 20px 28px rgba(0, 0, 0, 0.35)) drop-shadow(0 0 18px rgba(var(--accent-rgb), 0.14))';

  var cards = document.querySelectorAll('.how-step, .review-card, .service-row, .product-card');

  cards.forEach(function (card) {
    var settleTimer = null;

    function onMove(e) {
      var rect = card.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      var rotateY = (px - 0.5) * 2 * MAX_TILT;
      var rotateX = (0.5 - py) * 2 * MAX_TILT;
      // Set directly, no transition — this is what keeps it tracking the cursor
      // instantly instead of lagging behind it.
      card.style.transform =
        'perspective(900px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) scale(' + SCALE + ')';
      card.style.setProperty('--glow-x', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--glow-y', (py * 100).toFixed(1) + '%');
    }

    function onEnter(e) {
      clearTimeout(settleTimer);
      card.classList.remove('tilt-settling');
      card.classList.add('tilt-active');
      card.style.filter = LIFT_SHADOW; // constant per hover session, set once
      onMove(e);
    }

    function onLeave() {
      card.classList.remove('tilt-active');
      card.classList.add('tilt-settling');
      // Let .tilt-settling's transitions ease both of these back to flat.
      card.style.transform = '';
      card.style.filter = '';
      settleTimer = setTimeout(function () {
        card.classList.remove('tilt-settling');
      }, SETTLE_MS);
    }

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });
})();
