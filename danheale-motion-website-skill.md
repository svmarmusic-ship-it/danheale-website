---
name: danheale-motion-website
description: >-
  Production workflow and build rules for the danheale.com motion website rebuild, built with
  Claude Code, Higgsfield MCP, GPT Image 2, Seedance 2.0, GSAP and ScrollTrigger on the existing
  static HTML site. Use this skill whenever working on the danheale.com landing page, its
  AI-generated studio images, the looping hero background video, scroll-reveal animations,
  service/about/work sections, video encoding, motion timing, dark premium UI, or asset
  replacement workflow. Triggers: danheale, studio motion website, hero video, scroll reveal,
  Higgsfield MCP, GSAP, ScrollTrigger, Seedance 2.0, GPT Image 2, ghost producer landing page.
---

# danheale.com motion website

A rebuild of danheale.com — a single-page site for Dan Heale, a UK-based ghost producer,
mixing/mastering engineer, and DJ. The site should feel like a premium studio's site, not a
generic AI-generated SaaS template.

**Scope change 2026-09-14.** The original plan was a full-page video scrubbed by scroll position.
That is gone. The hero is now the `hero-studio` still with a short cinematic pull-back (starts
zoomed in, eases to normal scale with a slight upward drift while the hero is briefly pinned),
and every other section uses calmer GSAP ScrollTrigger fade-up/stagger reveals as elements enter
the viewport. The generated studio film and its loop encode are kept in the repo, unused, in
case a video hero is wanted later.

The hero film is one continuous shot through Dan's studio — opening close on the pad controller,
pulling back to reveal the desk, monitors, keyboard, rack and cables, then gliding across the
room — while the DAW session on screen visibly builds up with more layers and colour, mirroring
how a track comes together.

This supersedes the earlier React Three Fiber / GLB approach on this project (the `three-scenes`
Vite project and its dependency). That approach produced AI renders that read as amateur when
isolated from any narrative motion — this video-based approach keeps everything visually
consistent because every asset is chained off one master reference image, and the motion itself
(not separate 3D objects) is what makes the site feel premium.

The workflow runs in **Claude Code** in the existing `danheale-website` repo. Claude Code creates
planning files, generates media through Higgsfield MCP only after explicit approval at each stage,
adds the motion layer to the existing static HTML, encodes the hero loop, and verifies the result
in a real browser at desktop and phone widths before considering the site complete.

The site should be built around one strong idea:

> A producer's studio at work, as the track builds on screen.

---

## Project facts

- **Project type:** Cinematic landing page rebuild (looping hero video + scroll reveals)
- **Site:** danheale.com (existing repo: `svmarmusic-ship-it/danheale-website`)
- **Subject:** Dan Heale — ghost producer, mixing/mastering engineer, DJ
- **Core interaction:** Hero still image with a scroll-driven zoom-out + drift (pinned ~55vh on
  desktop, unpinned on phones); GSAP ScrollTrigger fade-up/stagger reveals on every other section
- **Main video concept:** One continuous camera move through the studio (close on the pad
  controller, pull back and rise to reveal the full desk, glide laterally across it, settle on a
  wider calmer frame) while the DAW session on screen fills up with more layers and colour — the
  track being built, not gear coming apart. Played forward then reversed as a 30 s seamless loop
- **Audience:** prospective ghost production / mixing clients, DJ booking contacts, the existing
  ~13k email list and ~16k/~6k Instagram audiences
- **Website goal:** Move away from the current numbered-card, stat-marquee, generic-SaaS-template
  look toward something that reads as a real working studio's site
- **Build environment:** Claude Code, existing repo, deploys to Vercel via GitHub push
- **Stack:** the existing static HTML pages + vendored GSAP 3 and ScrollTrigger in `js/vendor/`
  + `js/motion.js`. No bundler, no framework, no build step — Vercel serves the repo root as-is
- **Image model:** GPT Image 2 through Higgsfield MCP
- **Video model:** Seedance 2.0 through Higgsfield MCP
- **Background video format:** 16:9 1080p H.264, standard GOP, CRF 27, silent, ping-pong loop (~7 MB)

---

## Suggested project structure (inside the existing repo)

```txt
danheale-website/
├─ assets/
│  ├─ images/
│  │  ├─ hero-studio.png
│  │  ├─ studio-layers-reference.png
│  │  ├─ gear-detail.png
│  │  ├─ controller-detail.png
│  │  ├─ hero-poster.jpg              (hero-studio.png as 1920px JPEG — the hero image)
│  │  ├─ hero-poster@2x.jpg           (full 2688px JPEG, served via srcset on retina)
│  │  ├─ hero-video-poster.jpg        (first frame of the raw clip — <video poster>, dormant)
│  │  ├─ gear-detail.jpg              (1600px JPEG served on the page)
│  │  ├─ controller-detail.jpg        (1600px JPEG served on the page)
│  │  └─ superseded/            (archived gold-direction renders, not references)
│  └─ videos/
│     ├─ danheale-scroll-background-raw.mp4   (Seedance output, kept as the source)
│     └─ bg.mp4                               (hero loop — kept, currently unused)
├─ js/
│  ├─ vendor/gsap.min.js, vendor/ScrollTrigger.min.js   (pinned, no CDN)
│  └─ motion.js                       (hero video source gating + all scroll reveals)
├─ copy/
│  ├─ brand-kit.md
│  ├─ asset-plan.md
│  ├─ image-prompts.md
│  ├─ video-prompt.md
│  └─ website-brief.md
├─ scripts/
│  └─ swap-bg-video.sh
└─ (existing site files: index.html, /production/, /dj/, /suno-reproduction/, shared.css)
```

Rules:

- Do not place generated assets in downloads or temp folders — everything final lives in `assets/`.
- Keep raw AI outputs in `assets/` and production-ready files copied into wherever the site serves
  static assets from.
- Keep all prompts in `copy/` so the workflow is reusable for future asset refreshes.
- Do not recreate the `three-scenes` GLB pipeline — remove it once this approach is confirmed working.

---

## Required stack

- The existing static HTML pages, edited in place — no Vite, no React, no bundler
- Plain JavaScript, not TypeScript
- GSAP 3 + ScrollTrigger, vendored under `js/vendor/` and loaded with `defer` before
  `js/motion.js` (all three scripts are deferred, so order is preserved)
- CSS variables for brand tokens in `shared.css` — extend, don't replace
- Higgsfield MCP for GPT Image 2 and Seedance 2.0 generations
- `ffmpeg` for the hero loop encode (`scripts/swap-bg-video.sh`)

There is no production build. "Build" means: serve the repo root locally
(`python3 -m http.server 8765`) and verify in a browser. Vercel deploys the repo root unchanged.

How the motion layer is wired:

- An inline `<script>` in `<head>` adds class `js` to `<html>`. CSS hides `[data-reveal]` and the
  children of `[data-reveal-group]` only under `.js`, so nothing is hidden without JavaScript.
- `motion.js` removes that class and returns if GSAP is missing or `prefers-reduced-motion` is
  set, so every element is simply visible.
- `data-reveal` = single element fades up (0.8 s, power3.out, from 28px, `once: true`, trigger at
  top 88%). `data-reveal-group` = direct children stagger in (0.75 s, 0.11 s apart, trigger at
  top 85%). `data-parallax` = the `<img>` inside drifts slower than scroll on desktop only.
- The hero `<img class="hero-image">` gets `scale(1.13)` from CSS under `.js`, then `motion.js`
  tweens it to scale 1 / `yPercent: -5` with `scrub: 0.6`. Desktop pins the hero for `+=55%`
  of the viewport so the pull-back has room; phones use `end: 'bottom top'` with no pin. The
  headline/subhead keep their existing CSS fade-up on load, layered over the zoom.
- Dormant video path: the `<video class="hero-video">` markup sits commented out in
  `.hero-media`; `motion.js` still gates its `src` on desktop + motion allowed if it is put back.

---

## Claude Code operating rules

Before generating media or spending credits, Claude Code must:

1. Read this skill.
2. Create the copy files and asset plan.
3. Return a short plan listing exactly what it intends to generate.
4. Ask for explicit approval before running any Higgsfield MCP generation tool.

Claude Code must not:

- Generate assets without an approved plan.
- Use credits before approval.
- Generate more variations than requested.
- Bake website text into images or video.
- Introduce a bundler, framework, or build step — the site is static HTML on purpose.
- Tie any animation to scroll position as a timeline (scrubbing). Reveals fire once as elements
  enter the viewport; only the two parallax images use `scrub`.
- Reintroduce React Three Fiber or GLB models for this rebuild.
- Change fonts, palette values, or copy without flagging the change first — see Brand tokens and
  Content to preserve below.

Claude Code should:

- Save prompts and generation notes in `copy/` before running generations.
- Download every Higgsfield MCP result into the correct `assets/` path immediately.
- Run the app locally and verify it (dev server + browser check) before calling anything done.
- Run a production build before considering the project complete.
- Report exactly which files changed after each stage.

---

## Brand identity — use as source of truth, do not deviate without approval

- **Name:** Dan Heale
- **Positioning:** UK-based (Newcastle) ghost producer, mixing/mastering engineer, and DJ.
  100M+ streams, major label credits (Universal, Sony, Warner), Fiverr Vetted Pro.
- **Tone:** dry, understated, confident — no manufactured enthusiasm, no emojis in site copy.
- **Avoid:** generic SaaS landing-page patterns (numbered 01–05 cards, scrolling stat marquees,
  3-step "how it works" diagrams, flat testimonial cards with circle initials, gradient-mesh
  blobs, glassmorphism).

### Brand tokens

Direction decided 2026-09-14: near-black with violet/blue accents, following the violet/blue
electronic-studio hero at `assets/images/hero-studio.png`. The earlier warm-gold palette is
superseded, not an alternative — do not reintroduce gold anywhere. Full detail, including hues
sampled from the hero, is in `copy/brand-kit.md`.

```css
:root {
  --bg: #0B0A10;           /* deep near-black, slight purple tint */
  --text: #F2F0F5;         /* off-white — does most of the visual work */
  --accent: #7C5CFF;       /* violet — logo, primary CTA, thin rules, small labels */
  --accent-2: #4F7CFF;     /* cool blue — secondary rim-light / highlight only */
  --border: rgba(242, 240, 245, 0.08);
}
```

Violet is not a decorative fill. It appears on: the logo, the primary CTA button, thin accent
borders/rules, and small labels — not on body text, not on every hover state, not as a large fill.
Blue is for glows and rim-light effects, never for text.

Tokens live in `shared.css` at the repo root, linked from every page as `/shared.css`. It holds
the full set the pages use (`--bg-rgb`, `--bg-elevated`, `--bg-subtle`, `--accent-rgb`,
`--accent-hover`, `--accent-dim`, `--accent-glow`, `--accent-2-rgb`, `--text-mid`, `--text-dim`,
`--border-hover`) on top of the four above. Never hardcode an accent colour in page CSS: use
`var(--accent)`, `var(--accent-hover)` for hover states, or `rgba(var(--accent-rgb), <alpha>)`. Inline SVG data URIs and SoundCloud embed colour parameters
use the hex `7c5cff` directly.

### Typography — audited from the live repo, do not change without approval

The live site already uses:

- **Display/headings:** Bebas Neue
- **Body:** DM Sans
- **Labels / prices / technical text:** Space Mono

Do not introduce a different typeface (including Playfair Display, which was a stale plan note,
not what's actually implemented). If a previous session changed these fonts, revert to the three
above before doing anything else.

---

## Content to preserve — word-for-word, no rewriting

Pull directly from the existing repo (`index.html` and `/suno-reproduction/index.html`). This
rebuild changes presentation, not substance.

- **Hero:** "The producer behind 100M streams." + subhead + stats (100M+ streams, 200+ tracks,
  10+ years) — fold stats into prose, not a stat-pill ticker
- **Services:** Ghost Production (from £800), Mixing & Finishing (from £150), Remixes (on
  request), Priority Production (from £2,500), Suno Reproduction (on request, links to
  `/suno-reproduction/`)
- **About / credentials:** "Built on years behind the desk" + 7 credentials (100M+ streams,
  Universal/Sony/Warner credits, UK Silver certified, 5-star rating, DJ residencies, 200+ tracks,
  based in Newcastle)
- **Selected Work:** Spotify playlist embed (id `3lEUOgRppfqjeRlIvy3B3h`)
- **Reviews:** Jase (UK), Sean (UK), Tobi (Germany) — full quotes unchanged
- **Shop:** Free Mixing Template (Gumroad), UK House Essentials Vol. 1 (£20, Gumroad), "From DJ
  to Producer" course waitlist
- **Contact form:** name, email, project type, budget range, message
- **Footer:** Instagram, YouTube, Spotify, TikTok

**Technical — do not break:**

- Formspree endpoint (`action="https://formspree.io/f/xpqokakp"`)
- Both Gumroad product hrefs
- Course waitlist `fetch('/api/course-waitlist')` + honeypot field
- Stable anchor IDs: `#services`, `#about`, `#reviews`, `#shop`, `#contact`, `#work`
- `/suno-reproduction` URL, headings, and copy unchanged (it currently ranks in Google's AI
  Overview for "Suno reproduction" searches — do not risk that citation)

---

## Media asset plan

Four still images, reference-chained off one hero shot, plus one background video generated from
that same hero reference — same discipline as: generate the anchor image first, then chain
everything else off it so nothing looks like a disconnected AI render.

### 1. Hero studio image — `assets/images/hero-studio.png`

Master reference for everything else. Purpose: defines the final studio look, used as hero
backdrop, poster/fallback image, and video reference.

Generated 2026-09-14 (job `2ac9cc52-3b7b-4d50-a86a-d9d378a4e3bc`, 2688 x 1520). Do not regenerate
unless the direction changes; chain every other asset off this file. The superseded warm-gold
renders live in `assets/images/superseded/` and must not be used as references.

Prompt:

```txt
Cinematic hero photograph of a modern electronic music production studio at night. A lived-in
working studio, not a staged product shot.

Contents: a mixing desk with rows of faders and knobs; two studio monitor speakers; a MIDI
keyboard with a pad controller beside it; a rack of outboard gear (compressors, EQ units) with
small glowing LED indicators; tangled cables running between the gear; a computer screen showing
digital audio workstation software with a timeline and waveform blocks visible but completely
blurred and unreadable, no readable text, no real software logos. Gear sits at different depths,
some working clutter, screens glowing.

Style: cool, moody colored lighting. Deep violet and blue tones washing across the space,
near-black background, realistic materials and textures, photorealistic, shallow depth of field
with the desk in focus.

Composition: desk and gear filling most of the frame with clear foreground, midground and
background depth. The upper portion of the frame stays dark and empty so a website headline can
sit over it.

Restrictions: no text, no lettering, no logos, no brand marks, no people, no hands, no guitars,
no vinyl records, no turntables, no drums, no band instruments, no cartoon or illustration style.

Aspect ratio: 16:9. Quality: high. Resolution: 2k.
```

### 2. Session layers reference — `assets/images/studio-layers-reference.png`

Use `hero-studio.png` as the image reference. Defines the "session-built-up" motif used in the
scroll video: the same studio, gear unchanged, but the DAW screen now shows a much fuller session.
This image's only job is the screen. Nothing separates, floats, or deconstructs.

Prompt:

```txt
Using the provided studio image as reference, create a cinematic image of the exact same studio
— same mixing desk, studio monitors, MIDI keyboard, pad controller, outboard rack, cables, same
camera position and framing — where the only change is the computer screen: the digital audio
workstation session on it is now much fuller. Many more clip blocks stacked across many more
tracks, denser waveforms, a richer spread of colour across the timeline, as if the track has been
built up layer by layer since the reference frame.

Keep every physical item, material, and the lighting identical to the reference. Do not add,
move, or remove gear. Do not change the identity of any item.

The screen content stays soft-focus and completely unreadable: no readable text, no real
software logos, no recognisable interface branding. It reads as colour and structure only.

Style: same as reference — moody, cinematic, near-black background, deep violet and blue light,
shallow depth of field, realistic textures. The screen may glow slightly brighter than in the
reference so the fuller session reads at a glance.

Restrictions: no text, no logos, no hands, no people, no floating or separated gear.

Aspect ratio: 16:9. Quality: high. Resolution: 2k.
```

### 3. Gear detail macro — `assets/images/gear-detail.png`

Prompt:

```txt
Create a premium cinematic macro image of a mixing console: close-up on faders, knobs, and VU
meters, same studio and lighting style as the reference hero image — near-black background, deep
violet and blue rim light, shallow depth of field, realistic texture and reflections. No text, no
logos, no hands, no people.

Aspect ratio: 16:9. Quality: high. Resolution: 2k.
```

### 4. Controller detail — `assets/images/controller-detail.png`

Replaces the earlier turntable-detail asset, which conflicts with the no-vinyl direction.

Prompt:

```txt
Create a premium cinematic image of a MIDI pad controller and keyboard on the desk, three-quarter
angle, pads glowing, same studio and lighting style as the reference hero image — near-black
background, deep violet and blue light catching the keys and pad edges, shallow depth of field.
No text, no logos, no hands, no people.

Aspect ratio: 16:9. Quality: high. Resolution: 2k.
```

### 5. Scroll background video

Raw file: `assets/videos/danheale-scroll-background-raw.mp4`
Production file: `assets/videos/bg.mp4`, the ping-pong loop built by `scripts/swap-bg-video.sh`.

The prompt below still says "scroll scrubbing" because it was written before the scope change; it
was the prompt actually used for the approved clip. The stability constraints it asks for are
just as useful for a loop, so leave it as the record of what was generated.

Prompt:

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

---

## Encode the hero loop

The script is `scripts/swap-bg-video.sh`. This site serves static files from the repo root, so
the production file is `assets/videos/bg.mp4`, served at `/assets/videos/bg.mp4`. Requires
ffmpeg (`brew install ffmpeg`; installed 2026-09-14, version 8.1 with libx264).

```bash
scripts/swap-bg-video.sh assets/videos/danheale-scroll-background-raw.mp4
```

What it does: plays the clip forward then reversed (ping-pong) so the loop has no seam — the raw
clip opens on a close-up and ends on a wide frame, so a straight loop would jump-cut every 15 s.
Encodes libx264 at preset slow, CRF 27, GOP 48, yuv420p, no audio, moov atom first. The 30 s
1080p result is about 7 MB. It also writes `assets/images/hero-video-poster.jpg` from the first
frame so playback starts without a visible jump.

Verify in a browser: the hero `<video>` should reach `readyState` 4, report `duration` ≈ 30, and
`currentTime` should advance. On a phone-width viewport or with reduced motion it must have no
`src` attribute at all and the poster background must show instead.

---

## Website section plan (maps onto the existing site's sections)

### `#home` — hero
Full-bleed `hero-poster.jpg` still inside `.hero-media`, under a dark two-axis tint
(`.hero-tint`) that darkens the left where the text sits and the bottom edge. The image starts at
scale 1.13 and pulls back to 1 with a slight upward drift as the user scrolls, with the section
pinned briefly on desktop so the move has room. Headline "The producer behind 100M streams." +
subhead + stats + CTA fade/slide up on load via the existing CSS keyframes; the stats count up
from zero. Reduced motion: no zoom, no pin. Violet CTA button only — everything else
white/off-white on near-black. This is deliberately the only dramatic motion on the page.

### `#process` — how it works
The existing three-step "Brief me / I produce / You own it" block stays as it is; the three steps
stagger in as a `data-reveal-group`. There is no pinned section any more.

### `#services`
The 5 existing services, restyled as cards or a scroll-triggered list — not numbered 01–05. Copy,
pricing, and the `/suno-reproduction/` link stay exactly as they are.

### `#about`
7 credentials rewritten as flowing prose (not a bullet checklist), paired with the gear-detail or
controller-detail still image.

### `#work`
Spotify embed, staged near the controller-detail image.

### `#reviews`
One review at a time instead of a 3-card grid, full text preserved for all three.

### `#shop`
Keep close to as-is — product cards work fine here, Gumroad links preserved exactly.

### `#contact` / footer
Contact form (Formspree preserved), course waitlist (API + honeypot preserved), footer social
links preserved.

---

## Mobile behavior

- Below 769px the hero zoom-out still runs but without pinning, mapped to the hero scrolling
  out of view; the dormant video path would never be given a `src` there either
- Parallax is desktop-only (`gsap.matchMedia('(min-width: 769px)')`); reveals still run on phones
- `prefers-reduced-motion`: no video, no reveals, everything visible immediately
- Test that Formspree and the waitlist form both still submit correctly on mobile

---

## Verification checklist

- [ ] `copy/brand-kit.md`, `asset-plan.md`, `image-prompts.md`, `video-prompt.md`,
      `website-brief.md` exist and match this skill
- [ ] `hero-studio.png` exists and is used as the reference for everything else
- [ ] `studio-layers-reference.png`, `gear-detail.png`, `controller-detail.png` exist
- [ ] Raw Seedance 2.0 video exists in `assets/videos`
- [ ] Ping-pong hero loop exists at `assets/videos/bg.mp4` (~7 MB, 30 s) with its poster JPEG
- [ ] Fonts are Bebas Neue / DM Sans / Space Mono — unchanged from the live audit
- [ ] Palette is near-black / off-white / violet-as-sparing-accent — no gold anywhere, violet
      not flooding the page
- [ ] GSAP + ScrollTrigger load from `js/vendor/`, `motion.js` creates its triggers, no console errors
- [ ] Hero image starts at scale 1.13 and reaches 1 by the end of the short pin; text readable over the tint
- [ ] Every `data-reveal` / group child ends fully visible after scrolling the page
- [ ] Phone width: no pin, zoom-out plays as the hero scrolls away, reveals still work
- [ ] Services, about, work, reviews, shop, contact all present with original copy intact
- [ ] Formspree endpoint, both Gumroad links, waitlist fetch + honeypot all still work
- [ ] `/suno-reproduction` untouched in URL/headings/copy, palette-only inherited via shared.css
- [ ] Nav logo and favicon actually load (fix the pre-existing 404 in this pass)
- [ ] Mobile fallback poster works, `prefers-reduced-motion` respected
- [ ] `three-scenes` R3F/GLB project removed once this approach is confirmed working
- [ ] Page verified in a real browser at 1440px and 390px widths, and with reduced motion
- [ ] No real third-party logos or marks in generated media
- [ ] No text baked into images or video

---

## Preferred build order

1. Install this skill, confirm it's read
2. Create `copy/` planning files only — no generation yet
3. Review and approve planning files
4. Generate the 4 still images (hero first, then reference-chain the rest) — approve before video
5. Generate the background video using the hero + layers reference — approve before build
6. Encode the hero loop with `scripts/swap-bg-video.sh`
7. Add the hero still + tint + pull-back to `#home`, verify the pin and zoom on desktop and the
   unpinned version on phones
8. Add `data-reveal` / `data-reveal-group` / `data-parallax` to each section in turn, preserving
   all copy and integrations
9. Remove the old `three-scenes` R3F project
10. Mobile fallback + reduced-motion pass
11. Browser verification at desktop and phone widths, then push

---

## First prompt for Claude Code

```txt
We are rebuilding danheale.com using a scroll-driven motion approach, replacing the earlier
React Three Fiber / GLB attempt.

Read and follow the danheale-motion-website skill.

Before generating any media or spending Higgsfield credits, create only the planning files:
copy/brand-kit.md, copy/asset-plan.md, copy/image-prompts.md, copy/video-prompt.md,
copy/website-brief.md.

Use the brand identity, tokens, typography, content-to-preserve, and media asset plan from the
skill as the source of truth — don't invent new copy, colors, or fonts.

After creating the files, summarize the planned workflow and wait for approval before running any
Higgsfield MCP generation.
```

## Image generation approval prompt

```txt
The planning files are approved. Use Higgsfield MCP with GPT Image 2 to generate, in this order:
1. assets/images/hero-studio.png
2. assets/images/studio-layers-reference.png (using hero-studio.png as the image reference)
3. assets/images/gear-detail.png
4. assets/images/controller-detail.png

Use the prompts from copy/image-prompts.md exactly. 16:9, quality high, 2k. No extra variations.
Report the saved files and wait for review before generating video.
```

## Video generation approval prompt

```txt
The still images are approved. Use Higgsfield MCP with Seedance 2.0 to generate the background
video using assets/images/hero-studio.png and assets/images/studio-layers-reference.png as
references. Use the prompt from copy/video-prompt.md. 16:9, 12-16 seconds, high quality.

Save as assets/videos/danheale-scroll-background-raw.mp4. Do not build the site yet — report the
path and wait for approval.
```

## Website build prompt

Superseded by the 2026-09-14 scope change. The build that shipped: looping hero video behind
`#home` only, GSAP ScrollTrigger reveals on every other section, all copy and integrations
preserved, verified in a browser at desktop and phone widths. See "Required stack" for how it is
wired.
