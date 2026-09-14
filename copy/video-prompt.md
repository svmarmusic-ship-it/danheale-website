# Scroll background video prompt

Model: Seedance 2.0 through Higgsfield MCP.
References: `assets/images/hero-studio.png` (assembled studio) and
`assets/images/studio-layers-reference.png` (deconstructed layers).
Raw output: `assets/videos/danheale-scroll-background-raw.mp4`.
Production file: `assets/videos/bg.mp4`, a ping-pong (forward then reversed) 30 s loop at 1080p
CRF 27, built by `scripts/swap-bg-video.sh`. Used as a normal looping hero background, not
scrubbed by scroll (scope change 2026-09-14). The prompt below predates that change.

Mirrors item 5 of the danheale-motion-website skill's asset plan. If the two disagree, fix both.

Motion direction updated 2026-09-14.

## Section cinemagraphs (2026-09-14)

Short "living photograph" loops for the About, Selected Work and Services sections. Seedance 2.0,
std, 720p, 5 s, silent, with the approved still passed as **both** `start_image` and `end_image`
so the clip returns to its opening frame. Encoded by `scripts/encode-loop.sh`, which crossfades
the last 0.5 s into the first 0.5 s for an invisible seam and outputs 1280x720 CRF 30 plus a
poster JPEG. Raw outputs live in `assets/videos/raw/`. The preset the API kept recommending
(`24bae836-2c4a-48e0-89b6-49fcc0b21612`) must be declined or the batch never submits.

| Section | Source still (job) | Clip job | Notes |
| --- | --- | --- | --- |
| About | gear-detail `c8535c06-c85f-4902-a0a8-4ace9d46596a` | `1f260d6c-e246-4ceb-a1d2-70c94a45924e` | v2. v1 (`3f4b0882-6103-46c3-b5f2-8a383a96e078`, kept as `raw/gear-detail-loop-raw-v1-superseded.mp4`) drifted exposure across the whole frame. v2 prompt locks exposure/colour and allows only two LEDs + one haze wisp |
| Selected Work | controller-detail `9749ad0a-dd08-4bc5-a99f-9e90b7b59ffb` | `f17ccdb9-c578-43bd-8317-f43649df43bb` | pads breathe, haze drifts, background LEDs flicker |
| Services | fader-macro `5fcb9214-a33b-4f0f-9663-619e3fd2b507` (new still, chained off hero) | `6edb990b-1698-4f00-adad-418637ac1a4c` | LED pulse + cap highlight shimmer, most subtle of the three |

Prompt pattern (per clip, with the subject and allowed motion swapped in):

```txt
A living photograph, not a video. Locked-off camera, completely static framing, no camera
movement, no zoom, no pan, no drift. [Subject] stays exactly as in the reference frame: nothing
changes position. The only motion is ambient and barely perceptible: [two or three specific light
or haze behaviours]. Subtle enough that at a glance it looks like a still image. Loops
seamlessly: the last frame matches the first frame exactly. No text, no logos, no hands, no
people, no new objects.
```

Hero ultra-wide: `assets/images/hero-studio-21x9.png`, 3168 x 1344, Higgsfield outpaint of the
hero (job `028f5e9a-bd02-4623-a033-2026c8c65a21`) for screens wider than about 2:1.

## Generation log

- 2026-09-14 — job `de80112e-07d4-42a2-adad-926055549042`, `seedance_2_0`, std mode, 15 s,
  16:9, 1080p (1920 x 1080), bitrate high, audio off, genre auto. References passed as
  `image_references` by job ID: hero `2ac9cc52-3b7b-4d50-a86a-d9d378a4e3bc` and session layers
  `d3fef15a-5525-4ee3-b224-83cabdcc4791`. Prompt below used verbatim. Saved to
  `assets/videos/danheale-scroll-background-raw.mp4`. Awaiting review.

Notes for future runs: the model caps duration at 15 s, so "12 to 16 seconds" in the prompt
resolves to 15. Neither image is passed as `start_image`, because the brief opens close on the
pad controller rather than on the hero framing.

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
