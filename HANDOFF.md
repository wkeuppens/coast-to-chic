# Follow the Coast — Developer Handoff Document

## 1. Project Overview

Follow the Coast is a long-distance running relay tracing the European coastline from Knokke (Belgium) to Athens (Greece). Runners complete individual ~100 km stages, passing the journey forward. This website serves as the project's digital home — showcasing events, selling books, managing registrations, and maintaining a living archive of every completed stage.

**Published URL:** https://ftc-web.lovable.app  
**Entity:** Cercatrova BV, Kammenstraat 68, 2000 Antwerp, Belgium  
**Contact:** hello@followthecoast.com

---

## 2. Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18.3.x |
| Build | Vite (SWC plugin) | 5.x |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS + CSS custom properties | v3 |
| Routing | react-router-dom | 6.30.x |
| Animation | framer-motion | 12.x |
| UI Components | shadcn/ui (Radix primitives) — minimal subset | Latest |
| SEO | react-helmet-async | Latest |
| Icons | lucide-react | 0.454.x |
| State | React local state only (no global store) | — |
| Data fetching | @tanstack/react-query (configured, ready for API use) | 5.83.x |

**Architecture:** Single-Page Application (SPA) with client-side routing. All pages client-rendered. No SSR/SSG.

---

## 3. Folder Structure

```
├── index.html                    # Entry HTML (SEO meta, font preloads, OG tags)
├── vite.config.ts                # Vite config with path aliases
├── tailwind.config.ts            # Tailwind theme (design tokens, brand colours)
├── public/
│   ├── fonts/                    # Custom fonts (GT Pressura, Beausite Classic)
│   ├── og-image.jpg              # Default Open Graph image
│   ├── sitemap.xml               # XML sitemap
│   ├── robots.txt                # Crawler directives
│   ├── route-map.svg             # SVG coastline path (fetched at runtime, cached)
│   └── favicon.ico
├── src/
│   ├── main.tsx                  # React entry point
│   ├── App.tsx                   # Router + providers (lazy-loaded secondary pages)
│   ├── index.css                 # Design system (CSS variables, @font-face, tokens)
│   ├── assets/                   # Images (imported as ES modules)
│   ├── data/
│   │   ├── stages.ts             # ★ 168 stage records (single source of truth)
│   │   └── shoreholders.ts       # Derived from stages.ts
│   ├── components/
│   │   ├── Navigation.tsx        # Fixed nav with scroll-aware dark/light theme
│   │   ├── Footer.tsx            # Site footer (deep blue bg, inverted tokens)
│   │   ├── HeroSection.tsx       # Full-viewport hero with TextReveal + CTAs
│   │   ├── BookSection.tsx       # Book showcase with "Explore the books" CTA
│   │   ├── EventsSection.tsx     # Side routes grid (Home Run, FTK, TMB)
│   │   ├── HowItWorksSection.tsx # 3-step process with pricing breakdown
│   │   ├── NewsletterSection.tsx  # Email capture (no submit handler yet)
│   │   ├── StagesSection.tsx     # Available registration types
│   │   ├── SupportSection.tsx    # Support CTA linking to /support
│   │   ├── PartnersSection.tsx   # Partner names display
│   │   ├── PhotoGallery.tsx      # Horizontal scroll gallery (parallax)
│   │   ├── PullQuote.tsx         # Scroll-driven word-by-word text reveal
│   │   ├── LoadingScreen.tsx     # First-visit route map trace animation
│   │   ├── MarqueeTicker.tsx     # Interactive auto-scrolling stats ticker
│   │   ├── RouteMap.tsx          # Animated SVG coastline with pin markers
│   │   ├── MagneticButton.tsx    # Magnetic hover effect button
│   │   ├── TextReveal.tsx        # Word-by-word entrance animation
│   │   ├── CountUp.tsx           # In-view animated counter
│   │   ├── ScrollToTop.tsx       # Route-change scroll reset
│   │   ├── EditorialArrow.tsx    # Custom SVG arrow icon
│   │   ├── SEO.tsx               # Per-route <head> metadata
│   │   ├── GalleryTile.tsx       # Archive canvas tile with hover metadata
│   │   └── ui/                   # shadcn/ui primitives (button, toast, tooltip, sonner)
│   ├── hooks/
│   │   ├── useCanvasCamera.ts    # 2D canvas camera (pan, zoom, momentum, keyboard)
│   │   ├── useCurrentDistance.ts  # Live distance + stats counter
│   │   ├── useNavTheme.ts        # Nav dark/light detection via background sampling
│   │   └── use-toast.ts          # Toast notification state
│   ├── lib/
│   │   ├── apiClient.ts          # Typed fetch wrapper (GET/POST/PUT/DELETE)
│   │   ├── endpoints.ts          # API endpoint path constants
│   │   ├── distanceCalculator.ts # Date-based distance calculation (100km/day)
│   │   ├── counterCalculator.ts  # Milestone-based counter logic
│   │   ├── pathSmoothing.ts      # Catmull-Rom SVG path smoothing
│   │   ├── svgCache.ts           # SVG fetch + parse cache
│   │   └── utils.ts              # cn() class merger
│   ├── types/
│   │   └── api.ts                # API request/response TypeScript types
│   └── pages/                    # All route components (lazy-loaded)
```

---

## 4. Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Index | Homepage (eagerly loaded) |
| `/register` | Register | Registration with participant guide callout |
| `/homerun` | HomeRun | Home Run Venice (€199) |
| `/follow-the-kust` | FollowTheKust | Belgian coast run (€39/€59) |
| `/tour-du-mont-blanc` | TourDuMontBlanc | TMB expedition (€999/€1,499) |
| `/order-books` | OrderBooks | Book ordering (€55/book, €95 bundle) |
| `/archive` | Gallery | Infinite 2D canvas of stage tiles |
| `/route-map` | RouteMapPage | Interactive segmented coastline map |
| `/shoreholders` | Shoreholders | All stage runners |
| `/timeline` | Timeline | Chronological milestones |
| `/prints` | Prints | Limited edition prints (edition of 11) |
| `/photographers` | Photographers | Photographer profiles |
| `/support` | SupportTheProject | Partnership info (image grid + cards) |
| `/participant-handbook` | ParticipantHandbook | Runner guide (16 sections) |
| `/privacy` | Privacy | Privacy policy |
| `/checkout` | Checkout | Order summary (payment pending) |
| `/eu-stages` | EUStages | Coming soon |
| `/all-stages` | AllStages | Coming soon |
| `/gallery` | → `/archive` | Redirect |
| `*` | NotFound | 404 |

---

## 5. Where Content Is Managed

| Content | Location |
|---------|----------|
| Page copy | Inline in `src/pages/` components |
| Book prices | `OrderBooks.tsx` (€55/book), `BookSection.tsx` |
| Event prices | `HomeRun.tsx` (€199), `FollowTheKust.tsx` (€39/€59), `TourDuMontBlanc.tsx` (€999/€1,499) |
| Registration tiers | `Register.tsx` (€699/€999/€1,299), `HowItWorksSection.tsx` |
| Navigation | `Navigation.tsx`, `Footer.tsx` |
| Images | `src/assets/` (imported as ES modules) |
| Static assets | `public/` (fonts, favicon, OG image, sitemap, SVG) |
| Design tokens | `src/index.css` + `tailwind.config.ts` |

---

## 6. Design System

### Fonts

| Font | Usage | CSS Class |
|------|-------|-----------|
| GT Pressura | Display / headings / captions | `font-display` |
| Beausite Classic | Body text | `font-body` (default) |

Both are preloaded in `index.html` for fast rendering.

### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | Bone (40 27% 95%) | Page background |
| `--foreground` | Charcoal (210 7% 18%) | Primary text |
| `--primary` | Deep blue (203 92% 15%) | Hero/footer bg, nav on dark sections |
| `--accent` | Terracotta (10 54% 46%) | CTAs, highlights (≤10% usage) |
| `--secondary` | Linen (40 20% 91%) | Alternate section backgrounds |
| `--muted-foreground` | Blue-grey (206 17% 45%) | Secondary text |
| `--border` | Warm grey (36 6% 80%) | Borders, rules |

**Rule:** Terracotta accent is never used as a dominant background. Deep blue is reserved for the footer and hero overlays.

### Dark Section Tokens (Footer, Hero)

Inverted tokens (`inv-*`) for dark sections — avoids hardcoded `text-white/XX`:
- `inv-foreground`, `inv-muted`, `inv-subtle`, `inv-faint`, `inv-border`

### Utility Classes

| Class | Purpose |
|-------|---------|
| `text-caption` | Tracked-out uppercase small labels (Pressura GT, 11px) |
| `text-label` | Section orientation markers (Beausite, 13px) |
| `rule` / `rule-inv` | Thin editorial rules |
| `mask-fade-bottom` | Gradient mask (bottom fade) |

---

## 7. Key Architectural Patterns

### Code Splitting
All secondary pages are lazy-loaded via `React.lazy()` in `App.tsx`. Only `Index` is eagerly loaded for fast initial paint.

### Image Loading Strategy
- All images in `src/assets/` are imported as ES modules (Vite handles hashing/optimization)
- `loading="lazy"` on all below-fold images
- Gallery tiles use `decoding="async"` and `loading="lazy"`
- Placeholder gradients (hue-derived from tile ID) for unloaded/errored images

### SVG Caching
`src/lib/svgCache.ts` ensures the route map SVG is fetched once and shared between `LoadingScreen` and `RouteMap` components.

### Live Counters
`src/lib/distanceCalculator.ts` and `src/lib/counterCalculator.ts` compute distance, countries, runners, and books based on the current date — no API required. Active date ranges and milestones are configured as constants. These update on a 60-second interval via `useCurrentDistance`.

### Canvas Gallery
The Archive page (`/archive`) uses a custom 2D canvas camera (`useCanvasCamera`) with:
- Pointer drag with momentum + friction
- Scroll-to-pan and pinch-to-zoom
- Keyboard navigation (arrow keys, +/-)
- Viewport culling (only renders tiles in view + buffer)
- Deep-linking via `?stage=NNN` URL parameter

### Navigation Theme
`useNavTheme` samples the computed background color behind the nav bar at scroll position, and switches between light/dark text accordingly. Uses `requestAnimationFrame` for performance.

---

## 8. Backend Integration Points

See `BACKEND_INTEGRATION.md` for detailed instructions.

| Feature | Status | File | Backend Needed |
|---------|--------|------|----------------|
| Stage data | Static `stages.ts` (168 records) | `src/data/stages.ts` | `GET /api/archive/tiles` |
| Newsletter | Form renders, no handler | `NewsletterSection.tsx` | `POST /api/newsletter` |
| Checkout/Payment | Placeholder | `Checkout.tsx` | Stripe integration |
| Registration | Links to WhatsApp | `Register.tsx` | `POST /api/registration` |
| Photographers | 9 placeholder entries | `Photographers.tsx` | `GET /api/photographers` |
| Prints | Placeholder images | `Prints.tsx` | `GET /api/prints` |

**Recommended integration order:** Stage data → Newsletter → Payment → Registration → Photographers/Prints

---

## 9. Media Architecture & Scalability

The project is designed to scale to 10,000+ photos across 200+ stages:

### Current State
- 168 stage tiles with placeholder gradient fallbacks (no real stage photos yet)
- Tiles arranged in a 6-column grid layout computed at build time
- Viewport culling ensures only ~20-30 tiles render at any time

### Scaling Recommendations
1. **Stage images via CDN** — Return URLs in `StageResponse.image`, `GalleryTile` handles loading/error states
2. **Pagination** — For 200+ stages, implement cursor-based pagination in the archive API
3. **Image optimization** — Use responsive `srcset` or image CDN transforms (e.g., Cloudflare Images, imgix)
4. **Thumbnail generation** — Serve 420×280 thumbnails for archive tiles, full resolution for lightbox
5. **Progressive loading** — `GalleryTile` already supports `loading="lazy"`, `decoding="async"`, and error fallbacks

---

## 10. Deployment

### Build
```bash
npm run build   # Outputs to dist/
```

### Hosting Requirements
- Any static host (Vercel, Netlify, Cloudflare Pages, S3+CloudFront)
- **SPA rewrite required:** All routes must fall back to `index.html`
- No server-side rendering needed

### Environment Variables
See `.env.example`:
```
VITE_API_BASE_URL=         # Backend API origin
VITE_STRIPE_PUBLISHABLE_KEY=  # Stripe publishable key (client-safe)
```
No env vars required currently — project is fully client-side with local data.

---

## 11. SEO Notes

- **Static meta** in `index.html` for social crawlers (no JS required)
- **Dynamic meta** via `react-helmet-async` `<SEO>` component per route
- `public/sitemap.xml` — static, needs manual update when routes change
- `public/robots.txt` — standard allow-all
- OG image: `public/og-image.jpg`
- **Recommendation:** Deploy a prerender service (Prerender.io, Rendertron) for reliable social previews

---

## 12. Remaining Dependencies (Production)

| Package | Purpose |
|---------|---------|
| `react`, `react-dom` | Core framework |
| `react-router-dom` | Client-side routing |
| `framer-motion` | Animations + gestures |
| `@tanstack/react-query` | Data fetching (ready, not yet active) |
| `react-helmet-async` | Per-route SEO meta |
| `lucide-react` | Icons |
| `@radix-ui/react-slot` | shadcn button primitive |
| `@radix-ui/react-toast` | Toast notifications |
| `@radix-ui/react-tooltip` | Tooltip provider |
| `class-variance-authority` | Component variants |
| `clsx`, `tailwind-merge` | Class merging utilities |
| `sonner` | Alternative toast system |
| `tailwindcss-animate` | Tailwind animation plugin |

All unused shadcn UI components and their Radix dependencies have been removed.

---

## 13. Known Limitations & Technical Debt

1. **No error boundaries** — uncaught errors white-screen the app
2. **No analytics tracking** — no GA, Plausible, etc.
3. **No payment integration** — Checkout page is a placeholder
4. **Console warnings** — Two harmless React ref warnings from framer-motion (SupportSection, MapPin) — these are cosmetic and will resolve in React 19
5. **No image optimization pipeline** — images are raw JPGs bundled by Vite; production should use a CDN with resize/compress
6. **Newsletter form has no submit handler** — needs backend endpoint
7. **Info pack download links to email** — needs real PDF asset
8. **Placeholder content** — Photographer profiles, print images, stage tile images are all placeholders

---

## 14. Placeholder Content (Needs Real Assets)

| Content | Current State | Replacement |
|---------|---------------|-------------|
| Stage tile images | Gradient fallbacks | CDN URLs via API |
| Photographer profiles | 9 generated entries | Real photographer data |
| Print images | `/placeholder.svg` | Real print photography |
| Book covers | Single mockup reused | Individual volume covers |
| Stage locations/shoreholders | Generated names | Real data from database |

---

*Document updated: 2026-03-08*  
*Project: Follow the Coast (ftc-web)*
