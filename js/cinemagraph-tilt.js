/* danheale.com — cursor-tracked tilt on the three section cinemagraphs.
   About's gear-detail-loop, Selected Work's controller-detail-loop, and the
   Services backdrop's fader-macro-loop each tilt (rotateX/rotateY via an inline
   perspective) and scale up slightly toward the cursor. Single-layer: the whole
   element tilts as one rigid unit, no separate foreground/background split.

   The transform lands on .about-media/.work-media (the figure around the video)
   and .services-media (the div around the backdrop video), not the <video>
   elements themselves — those two videos already carry their own scroll-parallax
   transform set directly by motion.js, and writing to the same element's
   transform from two places would have them fight over it. Tilting the
   surrounding box instead reads identically (the video fills it edge to edge)
   without touching that transform at all.

   .services-media sits behind the Services list at z-index:-1, so it never
   receives its own mouse events — the list content on top of it does. The hover
   area there is the whole .services section instead; the transform still lands
   on .services-media.

   Mouse-only (matchMedia hover:hover + pointer:fine), skipped under
   prefers-reduced-motion — same gating as js/card-tilt.js. */
(function () {
  'use strict';

  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reduced) return;

  var MAX_TILT = 5; // degrees — subtle
  var SCALE = 1.03;
  var SETTLE_MS = 500; // must match .cinemagraph-settling's transition duration in CSS

  function wire(hoverArea, target) {
    if (!hoverArea || !target) return;
    var settleTimer = null;

    function onMove(e) {
      var rect = hoverArea.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      var rotateY = (px - 0.5) * 2 * MAX_TILT;
      var rotateX = (0.5 - py) * 2 * MAX_TILT;
      target.style.transform =
        'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) scale(' + SCALE + ')';
    }

    function onEnter(e) {
      clearTimeout(settleTimer);
      target.classList.remove('cinemagraph-settling');
      target.classList.add('cinemagraph-tilting');
      onMove(e);
    }

    function onLeave() {
      target.classList.remove('cinemagraph-tilting');
      target.classList.add('cinemagraph-settling');
      target.style.transform = '';
      settleTimer = setTimeout(function () {
        target.classList.remove('cinemagraph-settling');
      }, SETTLE_MS);
    }

    hoverArea.addEventListener('mouseenter', onEnter);
    hoverArea.addEventListener('mousemove', onMove);
    hoverArea.addEventListener('mouseleave', onLeave);
  }

  var aboutMedia = document.querySelector('.about-media');
  var workMedia = document.querySelector('.work-media');
  var servicesSection = document.querySelector('.services');
  var servicesMedia = document.querySelector('.services-media');

  wire(aboutMedia, aboutMedia);
  wire(workMedia, workMedia);
  wire(servicesSection, servicesMedia);
})();
