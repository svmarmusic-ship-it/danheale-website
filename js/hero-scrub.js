/* danheale.com — hero scroll-scrubbed video walkthrough, no pinning.
   .hero sits inside .hero-scroll-container (a plain, 180vh-tall box in normal
   document flow — pure CSS, no JS-computed height) as position: sticky. That's
   what keeps it visually fixed at the top of the viewport while the user
   scrolls through the container's own remaining 80vh; it's a native browser
   mechanism, not GSAP's pin — nothing here reserves scroll distance, wraps
   Services in anything, sets a z-index, or needs cleanup once it lets go.

   This script only reads scroll progress through that same container
   (ScrollTrigger with scrub, no pin property at all) and maps it to two
   things: the video's currentTime, walking the camera through bg-scrub.mp4 —
   the first 8s of the raw studio clip (push-in, orbit), re-encoded
   all-keyframe so seeking is smooth in either direction — and, over the
   final stretch of that same progress, a fade-out of the video and headline.
   The fade has to land inside the scrub's own range, not after it: the
   container's height is exactly what the scrub needs, nothing extra, so once
   it's exhausted .hero unsticks and Services (right after it, untouched)
   begins immediately.

   Desktop + motion-allowed only, same gating as every earlier hero attempt;
   phones and reduced motion get the plain poster — no sticky, no scrub, no
   video (see the matching CSS media query on .hero-scroll-container). */
(function () {
  'use strict';

  var video = document.querySelector('.hero-scrub-video');
  var heroSection = document.querySelector('.hero');
  var heroContainer = document.querySelector('.hero-scroll-container');
  var fadeCover = document.querySelector('.hero-fade-cover');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desktop = window.matchMedia('(min-width: 769px)').matches;

  if (!video || !heroSection || !heroContainer) return;

  if (!desktop || reduced) {
    video.hidden = true;
    return;
  }
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
    video.hidden = true;
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  var SCRUB_DURATION = 8; // seconds — matches bg-scrub.mp4's trim exactly
  var FADE_FRACTION = 0.15; // final 15% of scroll progress fades the hero out

  video.src = video.dataset.src;
  video.load();

  // Exposed for manual debugging in devtools: window.__bgv.currentTime,
  // window.__bgv.readyState, etc.
  window.__bgv = video;

  var started = false;
  function start() {
    if (started) return;
    started = true;

    // The headline/subhead entrance is a CSS `animation: ... forwards`; its
    // forwards-filled value keeps winning the cascade over any inline opacity
    // GSAP sets afterwards (CSS animations outrank inline styles on the same
    // property). Kill the animation and re-pin its resting state inline so the
    // exit fade below can actually take effect.
    document.querySelectorAll('.hero-animate').forEach(function (el) {
      el.style.animation = 'none';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });

    // One timeline, no pin: ScrollTrigger just measures scroll progress
    // through .hero-scroll-container's own natural height (start/end use its
    // real top/bottom, both plain CSS) and scrubs this timeline against it.
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        invalidateOnRefresh: true
      }
    });

    // Video scrub across the first (1 - FADE_FRACTION) of scroll progress —
    // timeline units are fractions of total progress (0 to 1), so a bare
    // duration here doubles as that fraction directly.
    tl.to(video, { currentTime: SCRUB_DURATION, ease: 'none', duration: 1 - FADE_FRACTION }, 0);

    // Then the exit: headline/subhead, the video itself, and the crossfade
    // cover all fade together over the final stretch, finishing exactly as
    // the container's own height runs out — right when Services begins.
    tl.to('.hero-animate', { autoAlpha: 0, y: -14, ease: 'none', duration: FADE_FRACTION }, 1 - FADE_FRACTION);
    tl.to(video, { opacity: 0, ease: 'none', duration: FADE_FRACTION }, 1 - FADE_FRACTION);
    if (fadeCover) {
      tl.to(fadeCover, { opacity: 1, ease: 'none', duration: FADE_FRACTION }, 1 - FADE_FRACTION);
    }
  }

  // Wait for enough of the clip to be buffered that scrubbing won't stall on an
  // un-downloaded byte range; canplaythrough is the right signal for that. The
  // poster shows in the meantime, so there's no broken visual state while waiting.
  if (video.readyState >= 3) {
    start();
  } else {
    video.addEventListener('canplaythrough', start, { once: true });
    setTimeout(start, 4000); // fallback in case that event is slow/never fires
  }
})();
