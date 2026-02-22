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
| Build | Vite (SWC plugin) | Latest |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS + CSS custom properties | v3 |
| Routing | react-router-dom | 6.30.x |
| Animation | framer-motion | 12.x |
| UI Components | shadcn/ui (Radix primitives) | Latest |
| SEO | react-helmet-async | Latest |
| Icons | lucide-react | 0.454.x |
| State | React local state only (no global store) | — |
| Data fetching | @tanstack/react-query (configured, ready for API use) | 5.83.x |

**Architecture:** Single-Page Application (SPA) with client-side routing. All pages are client-rendered. No SSR/SSG.

---

## 3. Folder Structure

```
├── index.html                    # Entry HTML (SEO meta, font preloads, OG tags)
├── vite.config.ts                # Vite config with path aliases
├── tailwind.config.ts            # Tailwind theme (design tokens, brand colours)
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
│   ├── index.css                 # Design system (CSS variables, @font-face, tokens)
│   ├── assets/                   # Images (imported as ES modules via @/assets/...)
│   ├── data/
│   │   ├── stages.ts             # ★ Single source of truth: 168 stage records
│   │   └── shoreholders.ts       # Derived from stages.ts (decoupled for backend swap)
│   ├── components/
│   │   ├── SEO.tsx               # Per-route <head> metadata (title, OG, Twitter, canonical)
│   │   ├── Navigation.tsx        # Fixed nav with scroll progress bar + theme detection
│   │   ├── Footer.tsx            # Site footer with institutional navigation
│   │   ├── HeroSection.tsx       # Landing hero with animated text reveal
│   │   ├── LoadingScreen.tsx     # Route map animation + logo reveal + curtain transition
│   │   ├── MarqueeTicker.tsx     # Auto-scrolling stats ticker with drag physics
│   │   ├── CustomCursor.tsx      # Custom cursor with trailing effect
│   │   ├── GalleryTile.tsx       # Memoized tile for infinite canvas gallery
│   │   ├── RouteMap.tsx          # Animated route map component (loading screen + scroll)
│   │   ├── PhotoGallery.tsx      # Landing page random-stage photo gallery
│   │   ├── BookSection.tsx       # Book showcase section
│   │   ├── EventsSection.tsx     # Side routes / events section
│   │   ├── StagesSection.tsx     # Stage overview with registration CTA
│   │   ├── NewsletterSection.tsx  # Email capture form (no backend yet)
│   │   ├── PartnersSection.tsx   # Partner logos
│   │   ├── SupportSection.tsx    # Support CTA section
│   │   ├── PullQuote.tsx         # Kinetic pull quotes
│   │   ├── TextReveal.tsx        # Scroll-driven text animation
│   │   ├── CountUp.tsx           # Animated number counter
│   │   ├── MagneticButton.tsx    # Magnetic hover effect button
│   │   └── ui/                   # shadcn/ui primitives (Radix-based)
│   ├── hooks/
│   │   ├── useCanvasCamera.ts    # 2D gallery camera: drag, scroll, zoom, momentum
│   │   ├── useCurrentDistance.ts  # Live distance counter (date-based calculation)
│   │   ├── useNavTheme.ts        # Detects if nav is over dark/light content
│   │   └── use-mobile.tsx        # Mobile breakpoint detection
│   ├── lib/
│   │   ├── distanceCalculator.ts # Distance logic with pause days
│   │   ├── counterCalculator.ts  # Countries/runners/books counter logic
│   │   ├── pathSmoothing.ts      # SVG path Catmull-Rom smoothing
│   │   ├── svgCache.ts           # SVG fetch + parse cache (prevents duplicate requests)
│   │   └── utils.ts              # cn() classname merger (tailwind-merge + clsx)
│   └── pages/                    # All route components (see Routes section)
```

---

## 4. Routes

| Route | Page Component | Description |
|-------|---------------|-------------|
| `/` | Index | Homepage (hero, journey, stages, books, events, newsletter) |
| `/register` | Register | Multi-tier registration (Solo/Duo/Team) with stage selection |
| `/homerun` | HomeRun | Home Run Venice event (100km shared stage, €199) |
| `/follow-the-kust` | FollowTheKust | Belgian coast run (35/75km, Feb 2027) |
| `/tour-du-mont-blanc` | TourDuMontBlanc | TMB expedition (4/7 days, Aug 2026) |
| `/order-books` | OrderBooks | Book ordering (Vol I, II, bundle) |
| `/archive` | Gallery | Infinite pannable 2D canvas of completed stage tiles |
| `/gallery` | — | Redirect → `/archive` (legacy URL) |
| `/route-map` | RouteMapPage | Interactive segmented coastline map |
| `/shoreholders` | Shoreholders | List of all stage runners |
| `/timeline` | Timeline | Chronological project milestones by year |
| `/prints` | Prints | Limited edition photography prints (edition of 11) |
| `/photographers` | Photographers | Photographer profiles (placeholder data) |
| `/support` | SupportTheProject | Partnership information + contact |
| `/participant-handbook` | ParticipantHandbook | Runner guide (16 sections) |
| `/privacy` | Privacy | Privacy policy (Cercatrova BV, GDPR) |
| `/checkout` | Checkout | Order summary (payment integration pending) |
| `/eu-stages` | EUStages | Coming soon placeholder |
| `/all-stages` | AllStages | Coming soon placeholder |
| `*` | NotFound | 404 page |

---

## 5. Where Content Is Edited

| Content | Location |
|---------|----------|
| Page copy | Inline in each page component under `src/pages/` |
| Event data (dates, prices) | `HomeRun.tsx`, `FollowTheKust.tsx`, `TourDuMontBlanc.tsx` |
| Book data | `OrderBooks.tsx` and `BookSection.tsx` |
| Registration tiers + stages | `Register.tsx` |
| Navigation links | `Navigation.tsx` (header), `Footer.tsx` (footer) |
| Images | `src/assets/` (imported as ES modules via `@/assets/...`) |
| Static assets | `public/` (fonts, favicon, OG image, sitemap, route map SVG) |
| Design tokens | `src/index.css` (CSS variables) and `tailwind.config.ts` |

---

## 6. How Archive Data Works

The **Archive** (`/archive`) is a 2D spatial canvas showing all 168 completed stages as tiles.

**Data source:** `src/data/stages.ts`

- Exports `STAGES: StageTileData[]` — an array of 168 entries
- Each entry contains: `id`, `title`, `stageNumber`, `location`, `country`, `year`, `season`, `status`, `shoreholder`, `startCoord?`, `endCoord?`, `image`, `x`, `y`, `width`, `height`, `link`
- Currently generated by `buildStages()` with deterministic placeholder data
- **To replace with real data:** swap `buildStages()` with a database query or static import returning the same `StageTileData[]` shape. The `x`/`y` coordinates define tile positions on the canvas grid.

**Tile rendering:** `GalleryTile.tsx` — memoized component with viewport culling (only visible tiles render).

**Camera:** `useCanvasCamera.ts` — handles drag, scroll, pinch-zoom, momentum physics, and boundary clamping.

**Deep linking:** `/archive?stage=42` centers the camera on stage 42 and opens its lightbox.

---

## 7. How Shoreholder Data Works

**Data source:** `src/data/shoreholders.ts`

- Derives data from `STAGES` (filters completed stages with a shoreholder name)
- Exports `SHOREHOLDERS: ShoreholderEntry[]` with: `stageNumber`, `name`, `location`, `country`, `year`
- **To replace with real data:** either populate the `shoreholder` field in `stages.ts`, or replace the export with a direct database query / CSV import matching the `ShoreholderEntry` interface.

The decoupled file exists specifically so the backend team can swap the data source without touching the presentation layer.

---

## 8. How Route Map Works

**Page:** `src/pages/RouteMapPage.tsx`

1. Fetches `public/route-map.svg` via cached SVG loader (`svgCache.ts`)
2. Applies Catmull-Rom path smoothing (`pathSmoothing.ts`)
3. Splits the path into 168 equal-length segments (88% of total path = completed stages)
4. Each segment is interactive: hover shows stage metadata in a fixed bottom bar, click navigates to `/archive?stage=N`
5. Hover effect includes an SVG glow filter matching the landing page pin style

**Note:** The SVG path has no geographic coordinates. Segments are split by equal path length, not by actual stage distances. When real `startCoord`/`endCoord` data is available, segments could be mapped to geographic positions for greater accuracy.

---

## 9. How to Run Locally

```bash
# Install dependencies
bun install          # or: npm install

# Start dev server (port 8080)
bun run dev          # or: npm run dev

# Run tests
bun run test         # or: npm test

# Production build
bun run build        # or: npm run build

# Preview production build
bun run preview      # or: npm run preview
```

---

## 10. Build Instructions

```bash
bun run build
```

Output: `dist/` directory with hashed assets and `index.html`.

The build uses Vite with SWC for fast compilation. Route-based code splitting via `React.lazy` produces separate chunks for each page.

---

## 11. Deployment Instructions

Deploy the contents of `dist/` to any static hosting provider.

**Important:** This is an SPA — all routes must fall back to `index.html`.

---

## 12. Required Hosting Rewrites

| Platform | Configuration |
|----------|--------------|
| **Vercel** | `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` |
| **Netlify** | `public/_redirects`: `/* /index.html 200` |
| **Cloudflare Pages** | Enable SPA mode in dashboard |
| **Nginx** | `try_files $uri $uri/ /index.html;` |
| **S3 + CloudFront** | Set error page to `index.html` with 200 status |
| **Apache** | `.htaccess`: `FallbackResource /index.html` |

---

## 13. Environment Variables

No environment variables are currently required. The project runs entirely client-side.

When backend integrations are added (payment, newsletter, database), environment variables should be configured for:
- API endpoints
- Payment provider keys (Stripe, etc.)
- Database connection strings

---

## 14. Known Limitations

### SPA — No Server-Side Rendering

- **SEO:** Search engines can render JS but may index slower than SSR. Social crawlers (Facebook, Twitter) read only static `<meta>` tags from `index.html` — per-route tags via `react-helmet-async` require JS execution. A prerender service (Prerender.io, Rendertron) is recommended for accurate social previews.
- **Initial load:** All route content loads after JS execution. Mitigated by code splitting.

### Placeholder Content

- Gallery stage images use deterministic placeholder colours (no real photos yet)
- Photographer profiles are placeholder data
- Print images use `placeholder.svg`
- Stage locations/shoreholder names are generated, not real

### No Backend Integration

- Newsletter form has no submit handler
- Registration CTA links to WhatsApp group (no form submission)
- Checkout page is a placeholder (no payment integration)
- All data is static (no database)
- `@tanstack/react-query` is installed but unused — ready for API integration

### Other

- No error boundaries (uncaught errors white-screen the app)
- No analytics tracking
- Custom cursor is desktop-only (hidden on touch devices via CSS)

---

## 15. Recommended Future Upgrades

1. **Connect payment:** Integrate Stripe for checkout (books, events, registrations)
2. **Add form backends:** Newsletter subscription, registration form, contact form
3. **Populate real content:** Stage photos, photographer bios, print images, real shoreholder data
4. **Database integration:** Replace static `stages.ts` with a database (Supabase, Postgres) for dynamic content management
5. **Add error boundaries:** Wrap route components to prevent white-screen crashes
6. **Social preview prerendering:** Add a prerender service for accurate per-route OG tags
7. **Analytics:** Add tracking (Plausible, Fathom, or GA4)
8. **Image optimization:** Convert large JPGs to WebP; add `srcset` for responsive images
9. **Mobile route map:** Add tap-to-reveal interaction for touchscreen segment exploration
10. **Search/filter on Shoreholders:** Add search capability as the list grows to thousands
11. **PWA support:** Add service worker + manifest for offline access
12. **i18n:** Consider multi-language support as the project spans multiple countries

---

## Design System

### Fonts

| Font | Usage | File | CSS Class |
|------|-------|------|-----------|
| GT Pressura | Display / headings | `public/fonts/GT_Pressura_Regular.ttf` | `font-display` |
| Beausite Classic | Body text | `public/fonts/Beausite_Classic_Regular.ttf` | `font-body` |

Loaded via `@font-face` in `src/index.css` with `font-display: swap`. Preloaded in `index.html`.

### Colour Tokens

All colours use HSL values defined as CSS custom properties in `src/index.css`:

| Token | Light Mode | Usage |
|-------|-----------|-------|
| `--background` | Bone (40 27% 95%) | Page background |
| `--foreground` | Deep blue (203 92% 15%) | Primary text |
| `--accent` | Rust/clay (21 54% 50%) | CTAs, highlights |
| `--muted-foreground` | Blue-grey (206 17% 45%) | Secondary text |
| `--secondary` | Linen (40 20% 91%) | Section backgrounds |
| `--border` | Warm grey (36 6% 80%) | Borders |

Dark mode is defined but not actively toggled in the UI.

---

## Forms

| Form | Location | Status |
|------|----------|--------|
| Newsletter signup | `NewsletterSection.tsx` | No backend — needs `POST /api/newsletter` |
| Registration | `Register.tsx` | No backend — CTA links to WhatsApp group |
| Checkout | `Checkout.tsx` | Placeholder — needs payment integration |

---

*Document updated: 2026-02-22*  
*Project: Follow the Coast (ftc-web)*
