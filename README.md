# Mansi Tukadekar — Personal Portfolio

A premium, responsive one-page portfolio built with **plain HTML5, CSS3 and vanilla JavaScript**.
No frameworks, no build tools, no npm — just open `index.html` in a browser.

## Project structure

```
My-Portfolio/
├── index.html            # Single page (hero, about, skills, projects, experience, education, contact)
├── css/
│   └── style.css         # Design tokens, components, sections, responsive, dark mode
├── js/
│   └── main.js           # Theme, sticky nav, mobile menu, reveal, certificate lightbox, contact form
├── assets/
│   ├── profile.png        # Your photo (hero + about)
│   ├── resume.pdf         # Your résumé (Download buttons)
│   └── certificates/
│       ├── hackerrank-sql-advanced.pdf
│       ├── hackerrank-sql-intermediate.pdf
│       ├── hackerrank-rest-api-intermediate.pdf
│       └── labmentix-lcat.pdf
└── README.md
```

## Where the assets go

| Asset | Exact path used in the code |
|-------|-----------------------------|
| Photo | `assets/profile.png` |
| Résumé | `assets/resume.pdf` |
| HackerRank — SQL (Advanced) | `assets/certificates/hackerrank-sql-advanced.pdf` |
| HackerRank — SQL (Intermediate) | `assets/certificates/hackerrank-sql-intermediate.pdf` |
| HackerRank — REST API (Intermediate) | `assets/certificates/hackerrank-rest-api-intermediate.pdf` |
| Labmentix — LCAT | `assets/certificates/labmentix-lcat.pdf` |

Keep these file names exactly as they are. Each certificate card's **View Certificate** button opens
its file in a new tab. If you swap a certificate for a **PNG/JPG** version, the lightbox preview
turns on automatically for it (the script reads the file extension); PDFs simply open in a new tab.

## How to run

No installation needed.

1. **Option A:** Double-click `index.html` to open it directly in your browser.
2. **Option B (recommended):** Serve the folder locally so every feature behaves as in production.

   ```bash
   # Python 3
   python -m http.server 5173

   # or Node (if installed)
   npx serve .
   ```

   Then visit `http://localhost:5173`.

> The site works offline except for the Google Font (Plus Jakarta Sans). Without internet the
> browser falls back to a system sans-serif font — everything still works.

## Features

- **Light / dark theme** with a toggle. The first visit respects your OS `prefers-color-scheme`; the
  choice is then remembered in `localStorage`.
- **Sticky header** that gains a blurred background on scroll, with active-section highlighting via
  `IntersectionObserver`.
- **Accessible mobile menu** (closes on link click, Escape, outside click), skip-to-content link,
  visible focus styles and ARIA labels throughout.
- **Scroll reveal** animations that respect `prefers-reduced-motion`.
- **Certificate lightbox** for image certificates (auto-detected by file extension).
- **Contact form** with inline validation, accessible error messages and a success state.
- SEO meta tags (Open Graph, Twitter), `theme-color` and an inline SVG favicon.
- No horizontal scroll at 375px, 768px or 1280px+.

## Placeholders you must replace

| # | What | Where | Notes |
|---|------|-------|-------|
| 1 | GitHub links on the 5 project cards | `index.html` — search `TODO: replace with the real repository URL` | Currently `href="#"`. |
| 2 | Live Demo links on the 5 project cards | `index.html` — search `TODO: replace with the live demo URL` | Currently `href="#"`. |
| 3 | NexaNova Pro Tech work details | `index.html` — search `EDIT: add real work details here` | Only the three honest bullets are shown. Add real details if you have them; do not invent. |
| 4 | Contact form endpoint | `js/main.js` — the `>>> FORM ENDPOINT <<<` block (`FORM_ENDPOINT`, `WEB3FORMS_ACCESS_KEY`) | Until set, the form falls back to a prefilled `mailto:` link. |
| 5 | Canonical / `og:url` domain | `index.html` (`<link rel="canonical">`, `og:url`) | Replace `https://mansitukadekar.example/` once deployed. |

All four certificate files were found in `assets/certificates/` and are wired up — no certificate
buttons are disabled.

### Plugging in the contact form

In `js/main.js`, find the block marked `>>> FORM ENDPOINT <<<`:

- **Formspree:** create a form, then set `var FORM_ENDPOINT = "https://formspree.io/f/YOUR_ID";`
- **Web3Forms:** set `var FORM_ENDPOINT = "https://api.web3forms.com/submit";` and
  `var WEB3FORMS_ACCESS_KEY = "YOUR-ACCESS-KEY";`

Once set, the form posts via `fetch()` and shows an inline success message.

## Deploy for free

### Vercel
1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Framework Preset: **Other**. Leave build command empty and output directory as root.
4. Deploy.

### Netlify
1. Go to [netlify.com](https://netlify.com) → **Add new site** → **Deploy manually** and drag the
   folder in.
2. Or connect the GitHub repo with an empty build command and publish directory `.`.

### GitHub Pages
1. Push the folder to a GitHub repository (branch `main`).
2. Repo → **Settings** → **Pages**.
3. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save and open the published URL.

## Customisation

All colours, radii, shadows and spacing live as CSS variables under `:root` (and `[data-theme="dark"]`)
at the top of `css/style.css`. Change `--accent` to shift the single accent colour across buttons,
links, chips and highlights. Portfolio content is written plainly in `index.html` so it is easy to
find and edit.

---

© 2026 Mansi Tukadekar
