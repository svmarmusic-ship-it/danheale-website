/* danheale.com — hero video + scroll-reveal motion layer.
   Loaded with `defer` after js/vendor/gsap.min.js and js/vendor/ScrollTrigger.min.js.
   The <html> element carries class "js" (added inline in <head>) so CSS can hide reveal
   targets before this runs. If motion is unavailable for any reason, that class is removed
   and every element is simply visible. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desktop = window.matchMedia('(min-width: 769px)').matches;

  function showEverything() {
    root.classList.remove('js');
  }

  // ── Hero background video (dormant) ───────────────────────
  // The hero is currently the rotating 3D sculpture in js/hero-3d.js. This block
  // is inert — `.hero-video` only exists inside an HTML comment right now — but
  // it's left wired so uncommenting the markup brings the video hero straight
  // back: plays as a simple, constant-scale looping background, no scroll-pin, no
  // scroll-linked zoom, source attached only on desktop with motion allowed.
  var video = document.querySelector('.hero-video');
  if (video) {
    if (desktop && !reduced && video.dataset.src) {
      video.src = video.dataset.src;
      var p = video.play();
      if (p && typeof p.catch === 'function') {
        p.catch(function () { /* autoplay blocked: poster stays, no error surfaced */ });
      }
    } else {
      video.removeAttribute('autoplay');
      video.hidden = true;
    }
  }

  // ── Section cinemagraphs (About / Selected Work / Services) ──
  // Small looping "living photograph" clips. They play everywhere, including phones
  // (each is a few hundred KB), but only when motion is allowed — otherwise they stay
  // paused on their poster frame, same as the hero.
  if (!reduced) {
    var clips = document.querySelectorAll('.about-media video, .work-media video, .services-media video');
    for (var i = 0; i < clips.length; i++) {
      var cp = clips[i].play();
      if (cp && typeof cp.catch === 'function') cp.catch(function () {});
    }
  }

  // ── Scroll reveals ────────────────────────────────────────
  if (reduced || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
    showEverything();
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  // ── Custom cinematic easing ────────────────────────────────
  // A hand-picked cubic-bezier rather than a stock named ease or default
  // linear/ease-out — a decisive, weighty deceleration with no bounce or overshoot,
  // so a blurred, rotated element reads as settling into place, not springing.
  // Implemented directly (Newton–Raphson on the bezier curve) so no CustomEase
  // plugin needs to be vendored.
  function cubicBezierEase(x1, y1, x2, y2) {
    function a(p1, p2) { return 1 - 3 * p2 + 3 * p1; }
    function b(p1, p2) { return 3 * p2 - 6 * p1; }
    function c(p1) { return 3 * p1; }
    function bezier(t, p1, p2) { return ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t; }
    function slope(t, p1, p2) { return 3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1); }
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      var t = x;
      for (var i = 0; i < 6; i++) {
        var s = slope(t, x1, x2);
        if (Math.abs(s) < 1e-6) break;
        t -= (bezier(t, x1, x2) - x) / s;
      }
      return bezier(t, y1, y2);
    };
  }
  var CINEMATIC = cubicBezierEase(0.16, 1, 0.3, 1);

  var DUR_SINGLE = 1.1;
  var DUR_GROUP = 1.0;
  var STAGGER = 0.13;
  var BLUR = 7; // px, softly out of focus at the start of every reveal

  // Single elements: headings, intro copy, embeds, forms, footer. Each tips up out
  // of the page — tilted back on X from its own bottom edge, pulled in smaller and
  // out of focus — then rotates flat, grows to size and sharpens as it lands. The
  // perspective that makes the tilt read as 3D (not a flat skew) comes from each
  // element's actual parent container, set in CSS.
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.fromTo(el,
      {
        autoAlpha: 0, y: 46, scale: 0.9, rotateX: 26,
        transformOrigin: '50% 100%', filter: 'blur(' + BLUR + 'px)'
      },
      {
        autoAlpha: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)',
        duration: DUR_SINGLE, ease: CINEMATIC, overwrite: 'auto',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
  });

  // Groups: direct children turn into place one after another, alternating which
  // side each tilts in from (rotateY sign flips by index) plus a shared upward
  // rotateX, so a row of cards or rows reads as separate objects with weight and
  // depth in the same 3D space, not one flat panel fading up together.
  gsap.utils.toArray('[data-reveal-group]').forEach(function (group) {
    var items = Array.prototype.slice.call(group.children);
    if (!items.length) return;
    gsap.fromTo(items,
      {
        autoAlpha: 0, y: 40, scale: 0.86, rotateX: 10,
        rotateY: function (i) { return i % 2 === 0 ? 26 : -26; },
        transformOrigin: '50% 50%', filter: 'blur(' + BLUR + 'px)'
      },
      {
        autoAlpha: 1, y: 0, scale: 1, rotateX: 0, rotateY: 0, filter: 'blur(0px)',
        duration: DUR_GROUP, ease: CINEMATIC, stagger: STAGGER, overwrite: 'auto',
        scrollTrigger: { trigger: group, start: 'top 85%', once: true }
      });
  });

  // Subtle parallax on the About and Work media (desktop only). Each image/video is
  // taller than its frame and drifts a little slower than the page.
  var mm = gsap.matchMedia();
  mm.add('(min-width: 769px)', function () {
    gsap.utils.toArray('[data-parallax] img, [data-parallax] video').forEach(function (img) {
      gsap.fromTo(img,
        { yPercent: -9 },
        {
          yPercent: 0, ease: 'none',
          scrollTrigger: {
            trigger: img.closest('[data-parallax]'),
            start: 'top bottom', end: 'bottom top', scrub: true
          }
        });
    });
  });

  // Lazy iframes and images change layout after first paint.
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
