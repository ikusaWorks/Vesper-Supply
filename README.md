# Vesper Supply

Marketing site for Vesper Supply — a Texas-based industrial procurement company
supplying US-manufactured instrumentation, automation, electrical equipment,
smart valves, cable and actuators to oil and gas operators in Venezuela and the
wider region.

Static HTML, CSS and vanilla JavaScript. No build step, no dependencies.

## Running it locally

Python 3 is the only requirement:

```bash
python3 serve.py
```

Then open <http://127.0.0.1:4173>.

Opening `index.html` directly by double-clicking also works, but the stylesheet
and script are loaded by relative path, so a server is more reliable.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | The whole page — About Us, Mission & Vision, Solutions, Contact |
| `styles.css` | Design system. All brand colours are tokens in one block at the top |
| `main.js` | Nav, scroll reveals, logo swap, industry carousel, RFQ form |
| `serve.py` | Local preview server |
| `BRANDING/` | Source brand assets as supplied (logo artwork, colour palette) |
| `MEDIA/logo/` | Web-ready logos, cropped to content, with reversed variants for dark backgrounds |
| `MEDIA/fonts/` | Self-hosted Michroma (SIL OFL) |

## Brand colours

Taken from `BRANDING/COLOR PALETTE/`. They live as CSS custom properties under
`BRAND — EDIT HERE` in `styles.css`; nothing else in the file hardcodes a colour.

| Token | Value |
| --- | --- |
| `--brand-ink` | `#252A2E` |
| `--brand-ink-raised` | `#283238` |
| `--brand-steel` | `#42677A` |
| `--brand-sky` | `#75B7D9` |
| `--brand-white` | `#FFFFFF` |

The light blue is only used on dark surfaces (6.6:1). On light surfaces the
steel blue is the text-safe accent (6.1:1). Do not swap them.

## Fonts — read before deploying

The site names three faces:

- **Eurostile** (display) — commercial. Referenced by local family name only, so
  it renders for visitors who happen to have it installed. It is deliberately
  **not** self-hosted: the available file carries `fsType` 4, "print & preview
  only", which does not permit web embedding. Shipping it needs a webfont
  licence from Monotype.
- **Avenir** (body) — commercial, but ships with macOS and iOS, so Apple
  visitors get the real face.
- **Michroma** (display fallback) and **Mulish** (body fallback) — both freely
  licensed. Michroma is self-hosted with `size-adjust: 72%` so it occupies the
  same width as Eurostile and headlines do not reflow.

Known quirk of the current Eurostile file: its em dash is a blank glyph, and its
word space is very tight. Headings therefore avoid em dashes, and everything set
in the display face carries `word-spacing: 0.14em`.

## Still to fill in

- The RFQ form composes a pre-filled email on submit and needs no backend. To
  post to a real form service instead, give the `<form>` an `action` and remove
  its `data-mailto` attribute.
