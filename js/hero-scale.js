/* danheale.com — hero photo scale + parallax on scroll.
   A restrained, non-pinned scroll effect on the static hero photo: it starts at
   108% scale and settles to 100% as the user scrolls through the hero, with a
   slight parallax drift, tied smoothly to scroll position via ScrollTrigger scrub.
   No pin, no scroll-jacking — the hero scrolls away at normal speed like every
   other section. Desktop only, the same convention the About/Work parallax in
   motion.js already uses; phones and reduced motion just see the still image.

   Replaces three earlier hero treatments in order: a scroll-pinned CSS zoom, a
   looping background video, a rotating 3D sculpture, and a scroll-assembled
   particle system. The video and sculpture are kept dormant in index.html; the
   particle system was removed entirely — it read as a gimmick, not cinematic. */
(function () {
  'use strict';

  var img = document.querySelector('.hero-image');
  var heroSection = document.querySelector('.hero');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!img || !heroSection || reduced) return;
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);

  var mm = gsap.matchMedia();
  mm.add('(min-width: 769px)', function () {
    gsap.fromTo(img,
      { scale: 1.08, yPercent: -3 },
      {
        scale: 1, yPercent: 2, ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: function () { return '+=' + Math.round(heroSection.offsetHeight * 0.7); },
          scrub: 0.4
        }
      });
  });
})();
