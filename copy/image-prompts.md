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

## 2. Studio layers reference — `assets/images/studio-layers-reference.png`

Not yet generated. Use `hero-studio.png` as `image_references`. Prompt is in the
danheale-motion-website skill, section "Media asset plan", item 2.

## 3. Gear detail macro — `assets/images/gear-detail.png`

Not yet generated. Use `hero-studio.png` as `image_references`. Prompt in skill, item 3.

## 4. Controller detail — `assets/images/controller-detail.png`

Not yet generated. Replaces the earlier turntable-detail asset, which conflicts with the no-vinyl
direction. Use `hero-studio.png` as `image_references`. Prompt in skill, item 4.

---

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
