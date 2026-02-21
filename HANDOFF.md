# Follow the Coast — Handoff Document

## Project Overview

Follow the Coast is a running relay project tracing the European coastline from Belgium to Athens. Runners complete individual ~100km stages, passing the journey forward. This website serves as the project's digital home — showcasing events, selling books, and enabling registration.

**Published URL:** https://ftc-web.lovable.app

---

## Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18.3.x |
| Build | Vite (SWC plugin) | Latest |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS + CSS custom properties | v3 |
| Routing | react-router-dom | 6.30.x |
| Animation | framer-motion | 12.x |
| UI Components | shadcn/ui (Radix primitives) | Latest |
| SEO | react-helmet-async | Latest |
| Icons | lucide-react | 0.454.x |
| State | React local state only (no global store) | — |
| Data fetching | @tanstack/react-query (configured, unused) | 5.83.x |

**Architecture:** Single-Page Application (SPA) with client-side routing. All pages are client-rendered. No SSR/SSG.

---

## Repo Structure

```
├── index.html                    # Entry HTML (SEO meta, font preloads, OG tags)
├── vite.config.ts                # Vite config with path aliases
├── tailwind.config.ts            # Tailwind theme (design tokens)
├── public/
│   ├── fonts/                    # Custom fonts (GT Pressura, Beausite Classic)
│   ├── og-image.jpg              # Default Open Graph image for social previews
│   ├── sitemap.xml               # XML sitemap for search engines
│   ├── robots.txt                # Crawler directives
│   ├── route-map.svg             # SVG coastline path (fetched at runtime)
│   └── favicon.ico
├── src/
│   ├── main.tsx                  # React entry point
│   ├── App.tsx                   # Router + providers (HelmetProvider, QueryClient)
│   ├── index.css                 # Design system (CSS variables, @font-face)
│   ├── assets/                   # Images (imported as ES modules)
│   ├── data/
│   │   └── stages.ts             # ★ Single source of truth: 168 gallery stages
│   ├── components/
│   │   ├── SEO.tsx               # Per-route <head> metadata (title, OG, Twitter)
│   │   ├── Navigation.tsx        # Fixed nav with scroll progress + theme detection
│   │   ├── HeroSection.tsx       # Landing hero with text reveal animation
│   │   ├── Footer.tsx            # Site footer with navigation
│   │   ├── NewsletterSection.tsx  # Email capture form
│   │   └── ui/                   # shadcn/ui primitives (Radix-based)
│   ├── hooks/
│   │   ├── useCanvasCamera.ts    # 2D gallery camera: drag, scroll, zoom
│   │   ├── useCurrentDistance.ts  # Live distance counter (date-based)
│   │   └── useNavTheme.ts        # Detects dark/light nav background
│   ├── lib/
│   │   ├── distanceCalculator.ts # Distance logic with pause days
│   │   ├── pathSmoothing.ts      # SVG path smoothing
│   │   ├── svgCache.ts           # SVG fetch cache
│   │   └── utils.ts              # cn() classname merger
│   └── pages/                    # All route components
```

---

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Index | Homepage (hero, journey, stages, books, events, newsletter) |
| `/register` | Register | Multi-tier registration with stage selection |
| `/homerun` | HomeRun | Home Run Venice event (100km, €199) |
| `/follow-the-kust` | FollowTheKust | Belgian coast run (35/75km, Feb 2027) |
| `/tour-du-mont-blanc` | TourDuMontBlanc | TMB expedition (4/7 days, Aug 2026) |
| `/order-books` | OrderBooks | Book ordering (Vol I, II, bundle) |
| `/gallery` | Gallery | Infinite pannable 2D canvas of stage tiles |
| `/prints` | Prints | Limited edition photography prints |
| `/photographers` | Photographers | Photographer profiles |
| `/participant-handbook` | ParticipantHandbook | Runner guide (16 sections) |
| `/privacy` | Privacy | Privacy policy (Cercatrova BV) |
| `/eu-stages` | EUStages | Coming soon placeholder |
| `/all-stages` | AllStages | Coming soon placeholder |
| `/checkout` | Checkout | Placeholder checkout (payment coming soon) |
| `*` | NotFound | 404 page |

---

## Where Copy & Images Live

- **Page copy**: Inline in each page component under `src/pages/`. Edit JSX directly.
- **Event data** (dates, prices): Inline in `HomeRun.tsx`, `FollowTheKust.tsx`, `TourDuMontBlanc.tsx`.
- **Book data**: Inline in `OrderBooks.tsx` and `BookSection.tsx`.
- **Stage gallery tiles**: `src/data/stages.ts` — 168 entries with coordinates and placeholder images.
- **Images**: `src/assets/` (imported as ES modules via `@/assets/...`).
- **Static assets**: `public/` (fonts, favicon, OG image, sitemap, route map SVG).

---

## Forms

| Form | Location | Action |
|------|----------|--------|
| Newsletter signup | `NewsletterSection.tsx` | No backend — form has no submit handler yet. Needs `POST /api/newsletter`. |
| Registration | `Register.tsx` | No backend — stage selection is display-only. CTA links to WhatsApp group. |
| Checkout | `Checkout.tsx` | Placeholder — displays order summary from URL params. No payment integration. |

All forms need backend integration to become functional.

---

## Fonts

| Font | Usage | File |
|------|-------|------|
| GT Pressura | Display / headings (`font-display` class) | `public/fonts/GT_Pressura_Regular.ttf` |
| Beausite Classic | Body text (`font-body` class) | `public/fonts/Beausite_Classic_Regular.ttf` |

- Loaded via `@font-face` in `src/index.css` with `font-display: swap`.
- Preloaded in `index.html` via `<link rel="preload">`.
- CSS custom properties: `--font-display` and `--font-body`.

---

## How to Run Locally

```bash
# Install dependencies
bun install

# Start dev server (port 8080)
bun run dev

# Run tests
bun run test

# Production build
bun run build

# Preview production build
bun run preview
```

---

## How to Build and Deploy

```bash
bun run build
```

Output: `dist/` directory with hashed assets and `index.html`.

### Hosting Requirements

This is an SPA — all routes must fall back to `index.html`. Configure your host:

- **Vercel**: Works out of the box with `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
- **Netlify**: Add `public/_redirects`: `/* /index.html 200`
- **Cloudflare Pages**: Enable SPA mode in dashboard
- **Nginx**: `try_files $uri $uri/ /index.html;`
- **S3 + CloudFront**: Set error page to `index.html` with 200 status

---

## Known Limitations

### SPA — No Server-Side Rendering

This site is a client-rendered SPA. Implications:

- **SEO**: Search engine crawlers (Google, Bing) can render JavaScript but may index content slower than SSR sites. Social media crawlers (Facebook, Twitter) rely on static `<meta>` tags in `index.html` — per-route tags set via `react-helmet-async` require JavaScript execution and won't be read by social crawlers unless a prerender service is used.
- **Initial load**: All route-specific content loads after JavaScript execution. Mitigated by code splitting (React.lazy).
- **Social previews**: OG tags are set per-route via react-helmet-async, but social crawlers typically only read the static HTML. The default OG tags in `index.html` serve as fallback.

### Other Limitations

- Gallery stage locations and images are placeholders ("TBD").
- Photographer profiles are placeholder data.
- Print images use `placeholder.svg`.
- No form validation or submission handlers.
- No error boundaries (uncaught errors white-screen the app).
- No analytics tracking.
- `@tanstack/react-query` is installed but unused — ready for API integration.

---

## TODO

1. **Connect payment**: Integrate Stripe for checkout (books, events, registrations).
2. **Add form backends**: Newsletter subscription, registration, contact form.
3. **Populate real content**: Stage locations, photographer bios/photos, print images.
4. **Add error boundaries**: Wrap route components to prevent white-screen crashes.
5. **Social preview prerendering**: Add a prerender service (e.g., Prerender.io, Rendertron) for accurate per-route OG tags with social crawlers.
6. **Analytics**: Add tracking (Plausible, Fathom, or GA).
7. **Image optimization**: Convert large JPGs to WebP; add srcset for responsive images.
8. **Consider removing unused deps**: react-query (if not needed soon), some shadcn components.

---

*Document updated: 2026-02-21*
*Project: Follow the Coast (ftc-web)*
