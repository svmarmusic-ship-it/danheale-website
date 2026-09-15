/* danheale.com — hero pinned scroll-scrubbed video walkthrough.
   Pins the hero while the user scrolls through it and maps scroll progress
   directly to the video's currentTime, so scrolling "walks" the camera through
   bg-scrub.mp4 — the first 8s of the raw studio clip (push-in, orbit), re-encoded
   all-keyframe so seeking is smooth in either direction. The rest of the ~15s
   source is cut, so no scroll distance is spent past the clearest camera motion,
   and the pinned range stays short — about 1 viewport height, roughly 2-3 normal
   scroll actions, not five.

   Headline, subhead, and the video itself all fade out together over the final
   stretch of the scrub, so nothing is left lingering alone on screen — the text
   doesn't disappear early into a mostly-empty panning shot, and the video doesn't
   keep playing after the text is gone. A solid near-black cover fades in over
   that same window, so unpinning lands on a plain dark frame that matches the
   next section's own background — a soft crossfade into it, not a hard cut.

   Desktop + motion-allowed only, same gating as every earlier hero attempt;
   phones and reduced motion get the plain poster — no pin, no scrub, no video. */
(function () {
  'use strict';

  var video = document.querySelector('.hero-scrub-video');
  var heroSection = document.querySelector('.hero');
  var fadeCover = document.querySelector('.hero-fade-cover');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desktop = window.matchMedia('(min-width: 769px)').matches;

  if (!video || !heroSection) return;

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
  var PIN_VH_MULTIPLE = 1.0; // how many viewport-heights of scroll the walkthrough takes

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
    // scrub timeline's fade-out below can actually take effect.
    document.querySelectorAll('.hero-animate').forEach(function (el) {
      el.style.animation = 'none';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: function () { return '+=' + Math.round(window.innerHeight * PIN_VH_MULTIPLE); },
        pin: true,
        // The sitewide 3D reveal system puts `perspective` on <body> for the card-tilt
        // effects; that makes body a containing block for `position: fixed`, which
        // breaks ScrollTrigger's default fixed-position pin (the pinned element tracks
        // scroll instead of holding still). Transform-based pinning sidesteps that
        // entirely without touching the sitewide perspective setup.
        pinType: 'transform',
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // The video plays across the whole pinned range, start to finish. Timeline
    // units are seconds of footage, so this tween's own duration doubles as the
    // total timeline length everything else below is positioned against.
    tl.to(video, { currentTime: SCRUB_DURATION, ease: 'none', duration: SCRUB_DURATION }, 0);

    // Headline/subhead, the video itself, and the crossfade cover all fade
    // together over the final quarter of the scrub — one exit, not the text
    // leaving early while the video pans on alone into an empty frame.
    var EXIT_DURATION = SCRUB_DURATION * 0.25;
    var exitStart = SCRUB_DURATION - EXIT_DURATION;
    tl.to('.hero-animate', { autoAlpha: 0, y: -14, ease: 'none', duration: EXIT_DURATION }, exitStart);
    tl.to(video, { opacity: 0, ease: 'none', duration: EXIT_DURATION }, exitStart);
    if (fadeCover) {
      tl.to(fadeCover, { opacity: 1, ease: 'none', duration: EXIT_DURATION }, exitStart);
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
