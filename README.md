# VEN Marketing — Website

Single-page marketing website for **VEN Marketing GmbH**. No framework, no build step — open `index.html` in any browser and it works.

## Stack

| Layer | Technology |
|---|---|
| Markup | Semantic HTML5 |
| Styles | Vanilla CSS with custom properties |
| Scripts | Vanilla ES2022 (`type="module"`-free, runs directly) |
| Fonts | Inter + Space Grotesk via Google Fonts |
| Animations | CSS transitions + `IntersectionObserver` + `requestAnimationFrame` |

## Structure

```
VEN-Marketing.com/
├── index.html       # Single page — all sections live here
├── css/
│   └── style.css    # All styles; design tokens in :root at the top
├── js/
│   └── main.js      # Cursor, canvas, scroll reveals, counter, i18n, form
├── images/          # Drop assets here (hero photo, case study images, etc.)
└── fonts/           # Self-hosted font fallback (optional)
```

## Sections

1. **Hero** — animated particle canvas, gradient headline, live stat counters
2. **Marquee** — scrolling service ticker
3. **Services** — 3-column card grid (5 service cards + CTA card)
4. **About** — floating badge cards, brand pillars
5. **Results** — 4 KPI counters + 3 case study cards with progress bars
6. **Process** — 4-step horizontal flow
7. **Testimonials** — 3 quote cards + partner logo strip
8. **Contact** — split layout with form → animated success state
9. **Footer** — 3-column links, legal

## Bilingual (EN / DE)

Every visible string carries both translations as HTML attributes:

```html
<h2 data-en="We grow brands" data-de="Wir entwickeln Marken">We grow brands</h2>
```

The `EN | DE` toggle in the nav reads these and swaps text on click. The chosen language is saved to `localStorage` and restored on next visit.

**To add a new translatable element** — add both attributes to any tag. No JS changes needed.

## Design Tokens

All colors, spacing, and typography live in `:root` inside `css/style.css`:

```css
:root {
  --bg:       #ffffff;
  --surface:  #f4f3ff;
  --accent:   #6040ff;   /* primary purple */
  --gold:     #b87800;   /* dark amber */
  --text:     #0d0c20;
  --text-2:   #4a4878;
  --text-3:   #9896b8;
  --radius:   16px;
  --nav-h:    76px;
  --section-gap: 120px;
}
```

## Customisation

### Replace placeholder content

| What | Where |
|---|---|
| Email / phone / city | `index.html` → `#contact` section |
| Stats (180+, 340%, 12 yrs) | `index.html` → `.hero__stat` and `.result-card` `data-target` attributes |
| Case studies | `index.html` → `.case-card` blocks |
| Testimonials | `index.html` → `.testimonial-card` blocks |
| Partner logos | `index.html` → `.partners__logos` |
| Team / about photo | Replace `.about__image-placeholder` with an `<img>` tag |

### Change accent color

Edit `--accent` in `:root`. All buttons, tags, borders, and gradients update automatically.

### Add a new section

1. Write the HTML block in `index.html` between existing sections
2. Add a `<li>` with `data-en` / `data-de` to `.nav__links` and `.mobile-menu`
3. Add matching styles to `css/style.css`
4. Scroll-reveal is automatic — add `class="reveal-up"` (or `reveal-left` / `reveal-right`) to any element

## Deployment

The site is fully static — deploy to any host:

```bash
# Netlify drag-and-drop, Vercel, GitHub Pages, any static CDN
# No build command, no package.json, no dependencies
```

For GitHub Pages:
1. Push to `main`
2. Settings → Pages → Source: `main` / `/ (root)`
3. Site is live at `https://<username>.github.io/<repo>/`

## Browser Support

All modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).  
Uses: CSS custom properties, `IntersectionObserver`, `canvas`, `backdrop-filter`.
