# Dan Heale — brand kit

Source of truth for the danheale.com rebuild. Mirrors the "Brand identity" section of the
danheale-motion-website skill. If the two disagree, fix both.

## Identity

- **Name:** Dan Heale
- **Positioning:** UK-based (Newcastle) ghost producer, mixing/mastering engineer, and DJ.
  100M+ streams, major label credits (Universal, Sony, Warner), Fiverr Vetted Pro.
- **Tone:** dry, understated, confident. No manufactured enthusiasm, no emojis in site copy.
- **Avoid:** generic SaaS landing-page patterns (numbered 01–05 cards, scrolling stat marquees,
  3-step "how it works" diagrams, flat testimonial cards with circle initials, gradient-mesh
  blobs, glassmorphism).

## Visual direction

Decided 2026-09-14: the hero is the violet/blue electronic studio image at
`assets/images/hero-studio.png`. The earlier warm-gold direction is superseded, not an
alternative. Its renders are kept only for the record in `assets/images/superseded/`.

The palette follows the hero: near-black with a slight blue-violet tint, off-white text, violet
as the single accent, cool blue as a secondary highlight. There is no gold anywhere in the new
direction.

## Palette tokens

```css
:root {
  --bg: #0B0A10;           /* deep near-black, slight purple tint */
  --text: #F2F0F5;         /* off-white — does most of the visual work */
  --accent: #7C5CFF;       /* violet — logo, primary CTA, thin rules, small labels */
  --accent-2: #4F7CFF;     /* cool blue — secondary rim-light / highlight only */
  --border: rgba(242, 240, 245, 0.08);
}
```

Sampled from `hero-studio.png` (2688 x 1520) to confirm the tokens sit inside the image:

| Region | Average |
| --- | --- |
| Upper third (headline zone) | `#050521` |
| Left wash | `#0A082B` |
| Right wash | `#1A133E` |
| Dominant saturated violet | `#532FBF` |
| Dominant saturated blue | `#2F53BF` |

`--accent` and `--accent-2` are brighter than the image's dominant hues on purpose so the CTA
and labels read against the hero rather than sinking into it.

### Accent discipline

Violet is not a decorative fill. It appears on: the logo, the primary CTA button, thin accent
borders and rules, and small labels. Not on body text, not on every hover state, not as a large
fill. Blue is for glows and rim-light effects behind or beside elements, never for text.

### Where the tokens live

`shared.css` at the repo root, linked from every page (`index.html`, `404.html`, `/production/`,
`/dj/`, `/suno-reproduction/`) as `/shared.css`. It carries the full set the pages use, not just
the four above: `--bg-elevated`, `--bg-subtle`, `--accent-rgb`, `--accent-dim`, `--accent-glow`,
`--accent-2-rgb`, `--text-mid`, `--text-dim`, `--border-hover`.

Never write an accent colour as a literal in page CSS. Use `var(--accent)` for solid colour and
`rgba(var(--accent-rgb), <alpha>)` for translucent glows, borders, and shadows. Inline SVG data
URIs and third-party embed colour parameters (SoundCloud) use the hex `7c5cff` directly since
they cannot read CSS variables.

## Typography

Audited from the live repo. Do not change without approval.

- **Display / headings:** Bebas Neue
- **Body:** DM Sans
- **Labels / prices / technical text:** Space Mono

## Logo and favicon

- `images/Dan Heale Logo (White).png` — white logo, works on the near-black background.
- `images/New Favicon.png`, `images/favicon-512x512.png`, `images/favicon.ico` — current favicon set.

Any gold-tinted version of the logo is out of use.
