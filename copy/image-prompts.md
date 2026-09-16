# Image prompts and generation log

All stills are generated through Higgsfield MCP with GPT Image 2.5 (`gpt_image_2_5`, flare variant).
Always pass `quality: "high"` and `resolution: "2k"`. The model defaults to low / 1k.

Direction as of 2026-09-14: violet/blue electronic studio. See `copy/brand-kit.md`.

## 1. Hero studio — `assets/images/hero-studio.png`

Master reference for every other asset. Primary hero, poster/fallback image, and video reference.

Generated 2026-09-14. Job `2ac9cc52-3b7b-4d50-a86a-d9d378a4e3bc`. 2688 x 1520, 16:9, quality
high, 2k.

Known contents beyond the brief: two small plants (one on the rack, one at the left edge) and a
mug at bottom left. Accepted as working clutter.

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
```

## 2. Session layers reference — `assets/images/studio-layers-reference.png`

Generated 2026-09-14. Job `d3fef15a-5525-4ee3-b224-83cabdcc4791`. 2688 x 1520, 16:9, quality
high, 2k. Reference: hero job `2ac9cc52-3b7b-4d50-a86a-d9d378a4e3bc` passed as
`image_references` (the hero file on disk is that job's untouched download, so the job ID is
equivalent to uploading it). Awaiting review.

Defines the "session-built-up" motif used in the scroll video: the same studio, gear unchanged,
but the DAW screen shows a much fuller session. This image's only job is the screen. Nothing
separates, floats, or deconstructs. The earlier "deconstructed gear" concept is gone for good.

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

## 3. Gear detail macro — `assets/images/gear-detail.png`

Generated 2026-09-14. Job `c8535c06-c85f-4902-a0a8-4ace9d46596a`. 2688 x 1520, 16:9, quality
high, 2k. Reference: hero job `2ac9cc52-3b7b-4d50-a86a-d9d378a4e3bc` as `image_references`.
Awaiting review.

A first pass (job `35fabe4e-265f-4a02-b6ed-e818e2ef8f7a`) had faint text-like markings on the
console surface. Kept as `assets/images/superseded/gear-detail-v1-markings-superseded.png`. The
prompt below adds an explicit ban on markings, which fixed it.

```txt
Create a premium cinematic macro image of a mixing console: close-up on faders, knobs, and VU
meters, same studio and lighting style as the reference hero image — near-black background, deep
violet and blue rim light, shallow depth of field, realistic texture and reflections. No text, no
logos, no hands, no people. No text, no lettering, no markings or engravings resembling text or
numerals on any surface.
```

## 4. Controller detail — `assets/images/controller-detail.png`

Generated 2026-09-14. Job `9749ad0a-dd08-4bc5-a99f-9e90b7b59ffb`. 2688 x 1520, 16:9, quality
high, 2k. Reference: hero job `2ac9cc52-3b7b-4d50-a86a-d9d378a4e3bc` as `image_references`.
Replaces the earlier turntable-detail asset, which conflicted with the no-vinyl direction.
Awaiting review.

```txt
Create a premium cinematic image of a MIDI pad controller and keyboard on the desk, three-quarter
angle, pads glowing, same studio and lighting style as the reference hero image — near-black
background, deep violet and blue light catching the keys and pad edges, shallow depth of field.
No text, no logos, no hands, no people.
```

---

## Suno Reproduction hero — `assets/images/hero-video-poster.jpg` (reused, not generated)

Decided 2026-09-16. The Suno Reproduction page hero reuses the existing `hero-video-poster.jpg`
(first frame of `bg.mp4`, same studio, same violet/blue direction as `hero-studio.png`, a
different specific camera moment so this page doesn't look like a duplicate of the homepage) with
the same scale + parallax treatment (`js/hero-scale.js`) as the homepage — no pin, no
scroll-hijacking, same lesson learned there. No new generation needed for this.

## Superseded: waveform-split concept (Suno Reproduction hero)

Tried 2026-09-16, replaced by the reused studio still above the same day. Kept for the record
only. Do not use as reference or revive without approval.

The concept: a waveform splitting into two paths — one rough/glitchy/artifact-heavy (the
AI-generated demo) resolving into a clean, polished waveform (the human-rebuilt master). Two
generations were made:

- `assets/images/superseded/suno-hero-waveform-split-v1-warm-superseded.png` — job
  `a65f19f8-a4c0-4ded-a4da-050be2e9b8ee`, 2688 x 1520, quality high, 2k. Rejected: a warm
  orange/amber glow dominated the "clean" path, directly against the no-gold/warm-tones rule that
  drove the earlier full palette pivot away from gold (see the superseded warm-gold hero
  direction below).
- `assets/images/superseded/suno-hero-waveform-split-v2-cool-superseded.png` — job
  `cdfdfff9-3822-421b-a297-e128af73cf19`, 2688 x 1520, quality high, 2k. Fixed the color (verified
  by direct pixel sampling: zero warm-leaning pixels across all lit areas) but the concept itself
  was dropped in favor of reusing an existing studio still, for consistency with the homepage's
  visual language and to avoid maintaining a second, unrelated visual motif.

Prompt used for v2 (the color-corrected version; v1 was identical except for the color section):

```txt
Cinematic abstract visualization of a sound waveform splitting into two diverging paths, in a
moody studio-adjacent atmosphere.

Contents: a single glowing audio waveform enters from the left side of the frame, then splits
into two distinct paths that run across the frame toward the right. One path is rough, glitchy,
and artifact-heavy: jagged broken segments, erratic spikes, static-like distortion, a dense
chaotic cluster of fractured light. The other path is smooth, clean, and polished: even confident
curves, a coherent steady glow, gradually resolving into a single refined, settled waveform shape
by the right edge of the frame — as if the rough signal has been rebuilt into a clean one.

Color: strictly cool tones only, throughout the entire image, with no exceptions. Deep violet,
cool blue, and near-black exclusively. Both halves of the image, including all resolution/
settling effects and every glow, highlight, and light trail, must use only these cool tones. Do
not use orange, amber, gold, yellow, or any warm color anywhere in the frame, including as a
"resolution" or "settling" effect on the clean waveform — the clean path should resolve into a
calm, steady violet or blue glow, never a warm one.

Style: cinematic, moody lighting, deep violet and cool blue tones washing across a near-black
background, realistic volumetric light and glow, shallow depth of field, high-end
audio-visualization aesthetic rendered like physical light and energy in a dark space — not a
flat UI mockup, not a screenshot, not a music app interface.

Composition: the waveform split runs roughly through the middle of the frame with dark, empty
negative space above and below so a website headline can sit over it. The glitchy path and the
clean path should read as clearly different from each other at a glance, through shape and
texture (jagged/dense versus smooth/simple), not through warm-versus-cool color — both stay
cool-toned.

Restrictions: no text, no lettering, no logos, no brand marks, no people, no hands, no UI chrome,
no app interface elements, no cartoon or illustration style, no orange, no amber, no gold, no
yellow, no warm colors of any kind anywhere in the image.
```

## Superseded: warm-gold hero direction

Replaced 2026-09-14 by the violet/blue direction above. Kept for the record only. Do not use as
a reference for new assets.

- `assets/images/superseded/hero-studio-gold-superseded.png` — job
  `d7ece939-6be4-45d2-ae70-ba6adbe24e6f`, 2688 x 1520, quality high, 2k.
- `assets/images/superseded/hero-studio-gold-v1-low-superseded.png` — job
  `ca3d146b-f8ee-442f-82dc-7895c0b88409`, 1344 x 752, quality low, 1k. Picked up a lamp, plant,
  candle and chair.

Prompt used for the gold hero:

```txt
Premium cinematic hero photograph of a music production studio at night, for a ghost producer
and mixing engineer's website. The studio feels real and lived-in, not a showroom. The only
objects in the scene are: a mixing desk with rows of faders and knobs, two studio monitor
speakers, tangled XLR cables, a vinyl record leaning against the desk, and a pair of studio
headphones resting on the console. Nothing else on the desk or in the room.

Style: moody, cinematic, dark luxury studio aesthetic. Near-black background, warm gold rim
lighting cutting through darkness, realistic materials and textures, shallow depth of field.
Photorealistic.

Composition: the desk and gear centered or slightly off-center, dark reflective desk surface,
generous empty dark negative space across the top and sides so website headline text can sit
over it. The background wall fades to pure near-black.

Lighting: dramatic low-key lighting from a single warm gold accent source out of frame, not
gold-flooded. Deep shadows, realistic reflections on the desk surface and speaker cabinets.

Restrictions: no text, no lettering, no logos, no brand marks, no people, no hands, no cartoon
or illustration style. No lamps, no plants, no chairs, no candles, no cups, no screens, no
computer, no keyboard, no extra clutter of any kind beyond the listed gear.
```
