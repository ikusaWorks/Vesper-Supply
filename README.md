# Vesper Supply

Marketing site for Vesper Supply — a Texas-based industrial procurement company
supplying US-manufactured instrumentation, automation, electrical equipment,
smart valves, cable and actuators to oil and gas operators across Latin
America.

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

## Fonts

Two faces, both fine to serve:

- **Space Grotesk** (headings) — SIL Open Font License, loaded from Google
  Fonts, so every visitor sees it.
- **Avenir** (body) — commercial, but ships with macOS and iOS, so Apple
  visitors get the real face. **Mulish** is the loaded fallback everywhere
  else.

An earlier revision used Eurostile for headings. It was dropped: the only
available file carried `fsType` 4 ("print & preview only"), which does not
permit web embedding, and it had a blank em-dash glyph and a very tight word
space that needed CSS compensation. None of that applies to Space Grotesk.

## Deploying to Cloudflare Pages

No build step. Connect the GitHub repo in the Cloudflare dashboard:

1. **Workers & Pages → Create → Pages → Connect to Git**, choose
   `ikusaWorks/Vesper-Supply`.
2. Build settings:
   - Framework preset: **None**
   - Build command: **leave empty**
   - Build output directory: **`/`**
3. Deploy. Every push to `main` republishes automatically.

`_headers` sets security headers and caching. `index.html`, `styles.css` and
`main.js` are set to revalidate because their filenames never change; anything
under `MEDIA/` is cached for a year.

## Contact form

The RFQ form posts JSON to `/api/contact`, handled by the Pages Function in
`functions/api/contact.js`, which relays it as email through Resend.

Set these under **Pages → Settings → Environment variables** (Production, and
Preview if you want the form live there too):

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | your Resend API key, `re_…` |
| `CONTACT_TO` | `sales@vespersupply.com` |
| `CONTACT_FROM` | a verified sender, e.g. `Vesper Supply <website@vespersupply.com>` |

`CONTACT_FROM` has to be on a domain verified in Resend — that is a DNS step in
the Resend dashboard. Until it is verified, sending will fail.

The key is only ever read inside the Function and never reaches the browser.

**If the endpoint is unreachable** — previewing locally, or before the
variables are set — the form falls back to composing a pre-filled email, so it
is never a dead end. Submissions are validated both in the browser and again in
the Function, and a hidden honeypot field silently discards bot submissions.

## Still to fill in

- The RFQ form composes a pre-filled email on submit and needs no backend. To
  post to a real form service instead, give the `<form>` an `action` and remove
  its `data-mailto` attribute.
