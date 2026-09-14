---
name: danheale-motion-website
description: >-
  Production workflow and build rules for the danheale.com scroll-driven motion website rebuild,
  built with Claude Code, Higgsfield MCP, GPT Image 2, Seedance 2.0, Vite, React, GSAP, Lenis, and
  ScrollTrigger. Use this skill whenever working on the danheale.com landing page, its AI-generated
  studio images, the scroll-scrubbed background video, service/about/work sections, React
  implementation, video encoding, motion timing, dark premium UI, or asset replacement workflow.
  Triggers: danheale, studio motion website, scroll-driven website, Higgsfield MCP, GSAP, Lenis,
  ScrollTrigger, Seedance 2.0, GPT Image 2, ghost producer landing page.
---

# danheale.com scroll-driven motion website

A rebuild of danheale.com — a single-page, scroll-driven site for Dan Heale, a UK-based ghost
producer, mixing/mastering engineer, and DJ. The site should feel like a premium studio's site,
not a generic AI-generated SaaS template.

The main visual hook is an AI-generated studio film used as a full-screen background video. As the
visitor scrolls, the video is scrubbed frame-by-frame with GSAP ScrollTrigger and Lenis, so a
single cinematic shot of Dan's studio setup — desk, monitors, keyboard, rack, cables — slowly separates into
its individual pieces of gear as the user scrolls, mirroring how a producer's kit comes together.

This supersedes the earlier React Three Fiber / GLB approach on this project (the `three-scenes`
Vite project and its dependency). That approach produced AI renders that read as amateur when
isolated from any narrative motion — this video-based approach keeps everything visually
consistent because every asset is chained off one master reference image, and the motion itself
(not separate 3D objects) is what makes the site feel premium.

The workflow runs in **Claude Code** in the existing `danheale-website` repo. Claude Code creates
planning files, generates media through Higgsfield MCP only after explicit approval at each stage,
builds the React/Vite motion layer, encodes the final video for scroll scrubbing, and verifies the
result before considering the site complete.

The site should be built around one strong idea:

> A producer's studio, revealed and deconstructed by the scroll.

---

## Project facts

- **Project type:** Scroll-driven cinematic landing page rebuild
- **Site:** danheale.com (existing repo: `svmarmusic-ship-it/danheale-website`)
- **Subject:** Dan Heale — ghost producer, mixing/mastering engineer, DJ
- **Core interaction:** Scroll-scrubbed AI video background of the studio
- **Main video concept:** An assembled studio setup slowly separates into its individual pieces
  (the keyboard lifts away, the pad controller floats out, rack units slide apart, cables trail
  off, the mixing desk's fader panel detaches) as the user scrolls
- **Audience:** prospective ghost production / mixing clients, DJ booking contacts, the existing
  ~13k email list and ~16k/~6k Instagram audiences
- **Website goal:** Move away from the current numbered-card, stat-marquee, generic-SaaS-template
  look toward something that reads as a real working studio's site
- **Build environment:** Claude Code, existing repo, deploys to Vercel via GitHub push
- **Stack:** Vite + React + GSAP + Lenis + ScrollTrigger — no build step beyond this; drop
  React Three Fiber/GLB entirely
- **Image model:** GPT Image 2 through Higgsfield MCP
- **Video model:** Seedance 2.0 through Higgsfield MCP
- **Background video format:** 16:9, slow, cinematic, all-keyframe H.264 after encoding

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
│  │  └─ superseded/            (archived gold-direction renders, not references)
│  └─ videos/
│     ├─ danheale-scroll-background-raw.mp4
│     └─ danheale-scroll-background-all-keyframe.mp4
├─ copy/
│  ├─ brand-kit.md
│  ├─ asset-plan.md
│  ├─ image-prompts.md
│  ├─ video-prompt.md
│  └─ website-brief.md
├─ scripts/
│  └─ swap-bg-video.sh
└─ (existing site files: index.html, /production/, /dj/, /suno-reproduction/, shared.css, shared.js)
```

Rules:

- Do not place generated assets in downloads or temp folders — everything final lives in `assets/`.
- Keep raw AI outputs in `assets/` and production-ready files copied into wherever the site serves
  static assets from.
- Keep all prompts in `copy/` so the workflow is reusable for future asset refreshes.
- Do not recreate the `three-scenes` GLB pipeline — remove it once this approach is confirmed working.

---

## Required stack

- Vite
- React
- JavaScript, not TypeScript
- GSAP + `gsap/ScrollTrigger`
- Lenis for smooth scrolling
- CSS variables for brand tokens (already exist in `shared.css` — extend, don't replace, unless a
  value is explicitly changed below)
- Higgsfield MCP for GPT Image 2 and Seedance 2.0 generations
- `ffmpeg` for all-keyframe H.264 video encoding

Portable static build:

```bash
npm run build -- --base=./
```

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
- Replace the requested Vite/React/GSAP/Lenis/ScrollTrigger stack with another framework.
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

### 2. Studio layers reference — `assets/images/studio-layers-reference.png`

Use `hero-studio.png` as the image reference. Defines the "deconstructed gear" motif used in the
scroll video.

Prompt:

```txt
Using the provided studio image as reference, create a cinematic image of the same studio gear —
mixing desk, studio monitors, MIDI keyboard, pad controller, outboard rack, screen, cables —
separated and floating in a clean vertical/layered arrangement, as if deconstructed for a premium
product reveal.

Keep the exact same items, materials, and lighting style as the reference — same desk, same
monitors, same keyboard, same rack. Do not add new gear or change the identity of any item.

Style: same as reference — moody, cinematic, near-black background, deep violet and blue light,
shallow depth of field, realistic textures.

Composition: items arranged in a clean, readable, floating layout with dark negative space around
them.

Restrictions: no text, no logos, no hands, no people, no messy or chaotic arrangement — keep it
elegant and readable.

Aspect ratio: 16:9. High quality.
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
Production file: copied into the site's static asset path as `bg.mp4` after encoding.

Prompt:

```txt
Create a cinematic scroll-driven background video for a ghost producer and mixing engineer's
landing page. This video will be used as a full-screen website background controlled by scroll
progress with GSAP ScrollTrigger, Lenis, and frame-by-frame video scrubbing. Motion must be slow,
stable, smooth, and readable when manually scrubbed.

Use the provided reference images:
1. The assembled studio hero reference
2. The deconstructed studio layers reference

Sequence:
1. Start with the studio gear fully assembled — desk, monitors, MIDI keyboard, pad controller,
   outboard rack, screen, cables — in a dark cinematic setup, deep violet and blue light, subtle
   atmosphere.
2. Camera slowly pushes in, then begins a smooth orbit around the desk.
3. In the second half, the gear gently separates — the keyboard lifts away, the pad controller
   floats out, rack units slide apart, cables trail off, the fader panel detaches — into the
   clean floating arrangement shown in the layers reference.
4. End on a centered, readable frame with the gear cleanly separated and floating.

Visual style: cinematic, dark studio aesthetic, deep violet and blue highlights, near-black background,
realistic materials, shallow depth of field but the subject stays readable, premium website hero
background.

Camera: one continuous uninterrupted shot — no cuts, no scene changes, no jump cuts. Push-in,
orbit, controlled rotation, elegant pacing. Energetic but not chaotic.

Important constraints:
- Use only the two reference images for identity — do not add or change gear
- No text, no logos, no people, no hands
- No fast cuts, no camera shake, no flicker, no chaotic motion
- Keep enough dark negative space around the gear for website text and UI overlays

Duration: 12 to 16 seconds. Aspect ratio: 16:9. Quality: high.
```

---

## Re-encode the video for scroll scrubbing

```bash
mkdir -p scripts
cat > scripts/swap-bg-video.sh <<'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail
INPUT="$1"
OUTPUT="path/to/site/static/bg.mp4"   # adjust to wherever this repo serves static assets from
ffmpeg -y -i "$INPUT" -an -c:v libx264 -preset slow -crf 18 \
  -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p \
  -movflags +faststart "$OUTPUT"
echo "Encoded all-keyframe background video to $OUTPUT"
SCRIPT
chmod +x scripts/swap-bg-video.sh
```

After swapping, confirm in the browser console:

```js
window.__bgv.readyState === 4
window.__bgv.duration
```

---

## Website section plan (maps onto the existing site's sections)

### `#home` — hero
Full-screen scroll-controlled background video. Headline "The producer behind 100M streams." +
subhead, off-center, stats folded into prose nearby. Violet CTA button only — everything else
white/off-white on near-black.

### `#split` — pinned "how it's made" moment
This replaces the old standalone "How It Works" 3-step section. Pin this while the background
video plays through its separation phase. Fold the "Brief me / I produce / You own it" copy in
here as short lines that reveal word-by-word as the user scrolls, rather than a generic diagram.

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

Scroll-scrubbed video can be heavy on mobile.

- Use `hero-studio.png` as a fixed poster/background on touch devices instead of the video
- Reduce or remove pinned sections on small screens
- Respect `prefers-reduced-motion` — poster fallback there too
- Test that Formspree and the waitlist form both still submit correctly on mobile

---

## Verification checklist

- [ ] `copy/brand-kit.md`, `asset-plan.md`, `image-prompts.md`, `video-prompt.md`,
      `website-brief.md` exist and match this skill
- [ ] `hero-studio.png` exists and is used as the reference for everything else
- [ ] `studio-layers-reference.png`, `gear-detail.png`, `controller-detail.png` exist
- [ ] Raw Seedance 2.0 video exists in `assets/videos`
- [ ] All-keyframe encoded video exists at the site's static `bg.mp4` path
- [ ] Fonts are Bebas Neue / DM Sans / Space Mono — unchanged from the live audit
- [ ] Palette is near-black / off-white / violet-as-sparing-accent — no gold anywhere, violet
      not flooding the page
- [ ] Vite dev server runs, GSAP/ScrollTrigger/Lenis wired correctly
- [ ] Video scrubs smoothly on scroll, hero text stays readable over it
- [ ] `#split` pinned section works and reads the "how it works" copy correctly
- [ ] Services, about, work, reviews, shop, contact all present with original copy intact
- [ ] Formspree endpoint, both Gumroad links, waitlist fetch + honeypot all still work
- [ ] `/suno-reproduction` untouched in URL/headings/copy, palette-only inherited via shared.css
- [ ] Nav logo and favicon actually load (fix the pre-existing 404 in this pass)
- [ ] Mobile fallback poster works, `prefers-reduced-motion` respected
- [ ] `three-scenes` R3F/GLB project removed once this approach is confirmed working
- [ ] Production build passes
- [ ] No real third-party logos or marks in generated media
- [ ] No text baked into images or video

---

## Preferred build order

1. Install this skill, confirm it's read
2. Create `copy/` planning files only — no generation yet
3. Review and approve planning files
4. Generate the 4 still images (hero first, then reference-chain the rest) — approve before video
5. Generate the background video using the hero + layers reference — approve before build
6. Re-encode video to all-keyframe H.264
7. Build the motion layer (video scrub + pinned split section) first, verify it alone
8. Then rebuild each existing section (services, about, work, reviews, shop, contact) around it,
   preserving all copy and integrations
9. Remove the old `three-scenes` R3F project
10. Mobile fallback + reduced-motion pass
11. Production build, then push

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

```txt
The images and video are approved. Re-encode the background video to all-keyframe H.264 using
scripts/swap-bg-video.sh. Build the motion layer first (fixed scroll-scrubbed video background +
pinned #split section) and let me see it alone before rebuilding the rest of the sections around
it. Preserve all existing copy, the Formspree endpoint, both Gumroad links, the waitlist API, and
the /suno-reproduction page untouched apart from inheriting the shared palette. Remove the
three-scenes R3F project once this is confirmed working. Add mobile/reduced-motion fallback using
hero-studio.png. Run the production build and report any issues.
```
