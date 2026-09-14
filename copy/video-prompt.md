# Scroll background video prompt

Model: Seedance 2.0 through Higgsfield MCP.
References: `assets/images/hero-studio.png` (assembled studio) and
`assets/images/studio-layers-reference.png` (deconstructed layers).
Raw output: `assets/videos/danheale-scroll-background-raw.mp4`.
Production file: re-encoded all-keyframe H.264 via `scripts/swap-bg-video.sh` to the site's
static `bg.mp4`.

Mirrors item 5 of the danheale-motion-website skill's asset plan. If the two disagree, fix both.

Motion direction updated 2026-09-14.

```txt
Create a cinematic scroll-driven background video for a ghost producer and mixing engineer's
landing page. This video will be used as a full-screen website background controlled by scroll
progress with GSAP ScrollTrigger, Lenis, and frame-by-frame video scrubbing. Motion must be slow,
stable, smooth, and readable when manually scrubbed.

Use the provided reference images:
1. The studio hero reference (the session on the DAW screen at its starting state)
2. The session layers reference (the same studio, with the DAW screen showing a much fuller
   session — more tracks, more clip blocks, more colour)

Camera and motion direction: Open close on the pad controller, then pull back and rise slightly
to reveal the full studio. Midway, glide laterally across the desk. Foreground, midground, and
background elements should shift at different rates as the camera moves, creating real parallax
depth. Rack unit LEDs pulse and flicker subtly at different times. The pad controller's pads
light up in a rhythmic, sequential pattern — as if notes or steps are being triggered — rather
than flickering randomly. Keep this subtle and musical-feeling, not strobing or glitchy. Fine
haze and dust particles drift slowly through the light beams. The DAW screen stays soft-focus
throughout except for one brief moment where focus pulls slightly sharper on it as the session
appears to fill with more colour and layers (matching the layers reference), then falls back out
of focus as the camera continues past. End on a wider, calmer frame than the opening shot.

Keep all of this smooth, slow, and stable enough for scroll scrubbing — no shake, no fast cuts,
no chaotic motion.

Visual style: cinematic, dark studio aesthetic, deep violet and blue highlights, near-black background,
realistic materials, shallow depth of field but the subject stays readable, premium website hero
background. One continuous uninterrupted shot — no cuts, no scene changes, no jump cuts.

Important constraints:
- Use only the two reference images for identity — do not add or change gear
- No text, no logos, no people, no hands
- No fast cuts, no camera shake, no strobing or glitching, no chaotic motion
- Keep enough dark negative space around the gear for website text and UI overlays

Duration: 12 to 16 seconds. Aspect ratio: 16:9. Quality: high.
```
