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
│   ├── route-map.svg             # SVG coastline path (fetched at runtime)
│   └── favicon.ico
├── src/
│   ├── main.tsx                  # React entry point
│   ├── App.tsx                   # Router + providers
│   ├── index.css                 # Design system (CSS variables, @font-face, tokens)
│   ├── assets/                   # Images (imported as ES modules)
│   ├── data/
│   │   ├── stages.ts             # ★ 168 stage records (single source of truth)
│   │   └── shoreholders.ts       # Derived from stages.ts
│   ├── components/
│   │   ├── Navigation.tsx        # Fixed nav with scroll progress + theme detection
│   │   ├── Footer.tsx            # Site footer
│   │   ├── HeroSection.tsx       # Landing hero
│   │   ├── BookSection.tsx       # 3-book grid with "See the books" CTA
│   │   ├── EventsSection.tsx     # Side routes + "Download info pack"
│   │   ├── HowItWorksSection.tsx # 3-step process (on secondary bg, not dark)
│   │   ├── NewsletterSection.tsx # Email capture (on secondary bg, not dark)
│   │   ├── StagesSection.tsx     # Stage overview with registration CTA
│   │   ├── SupportSection.tsx    # Support CTA
│   │   ├── PartnersSection.tsx   # Partner names
│   │   ├── PhotoGallery.tsx      # Horizontal scroll gallery
│   │   ├── PullQuote.tsx         # Kinetic pull quotes
│   │   ├── LoadingScreen.tsx     # First-visit loading animation
│   │   ├── MarqueeTicker.tsx     # Auto-scrolling stats ticker
│   │   ├── RouteMap.tsx          # Animated route map
│   │   ├── MagneticButton.tsx    # Magnetic hover button
│   │   ├── TextReveal.tsx        # Scroll text animation
│   │   ├── CountUp.tsx           # Animated counter
│   │   ├── ScrollToTop.tsx       # Route-change scroll reset
│   │   ├── SEO.tsx               # Per-route metadata
│   │   ├── GalleryTile.tsx       # Archive canvas tile
│   │   └── ui/                   # shadcn/ui primitives
│   ├── hooks/
│   │   ├── useCanvasCamera.ts    # 2D gallery camera
│   │   ├── useCurrentDistance.ts  # Live distance counter
│   │   ├── useNavTheme.ts        # Nav dark/light detection
│   │   └── use-mobile.tsx        # Mobile breakpoint
│   ├── lib/
│   │   ├── apiClient.ts          # Typed fetch wrapper (ready for backend)
│   │   ├── endpoints.ts          # API endpoint constants
│   │   ├── distanceCalculator.ts # Distance logic
│   │   ├── counterCalculator.ts  # Counter logic
│   │   ├── pathSmoothing.ts      # SVG Catmull-Rom smoothing
│   │   ├── svgCache.ts           # SVG fetch cache
│   │   └── utils.ts              # cn() merger
│   ├── types/
│   │   └── api.ts                # API request/response types
│   └── pages/                    # All route components
```

---

## 4. Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Index | Homepage |
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
| `*` | NotFound | 404 |

---

## 5. Where Content Is Managed

| Content | Location |
|---------|----------|
| Page copy | Inline in `src/pages/` components |
| Book prices | `OrderBooks.tsx` (€55/book), `BookSection.tsx` |
| Event prices | `HomeRun.tsx` (€199), `FollowTheKust.tsx` (€39/€59), `TourDuMontBlanc.tsx` (€999/€1,499) |
| Registration tiers | `Register.tsx` (€699/€999/€1,299) |
| Navigation | `Navigation.tsx` (header), `Footer.tsx` (footer) |
| Images | `src/assets/` (imported as ES modules) |
| Static assets | `public/` (fonts, favicon, OG image, sitemap, SVG) |
| Design tokens | `src/index.css` + `tailwind.config.ts` |

---

## 6. Design System

### Fonts

| Font | Usage | CSS Class |
|------|-------|-----------|
| GT Pressura | Display / headings | `font-display` |
| Beausite Classic | Body text | `font-body` |

### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | Bone (40 27% 95%) | Page background |
| `--foreground` | Deep blue (203 92% 15%) | Primary text, footer bg |
| `--accent` | Terracotta (#B44C36 / 10 54% 46%) | CTAs, highlights ≤10% |
| `--secondary` | Linen (40 20% 91%) | Section backgrounds |
| `--muted-foreground` | Blue-grey (206 17% 45%) | Secondary text |
| `--border` | Warm grey (36 6% 80%) | Borders |

**Rule:** Terracotta accent is never used as a dominant background. Deep blue is reserved for the footer and hero overlays — not for large mid-page blocks with CTAs.

### Dark Section Tokens (Footer, Hero)

Inverted tokens (`inv-*`) are used in dark sections to avoid hardcoded `text-white/XX`:

- `--inv-muted`, `--inv-subtle`, `--inv-faint`, `--inv-border`

---

## 7. Backend Integration Points

See `BACKEND_INTEGRATION.md` for full details. Key integration points:

| Feature | Status | File |
|---------|--------|------|
| Newsletter | No backend | `NewsletterSection.tsx` |
| Checkout/Payment | Placeholder | `Checkout.tsx` |
| Stage data | Static `stages.ts` | `src/data/stages.ts` |
| Registration form | Links to WhatsApp | `Register.tsx` |
| Info pack download | Links to email | `EventsSection.tsx` |

---

## 8. Notes for Backend Developer

### SPA Limitations
- No SSR — social crawlers read only static `<meta>` from `index.html`
- Per-route meta via `react-helmet-async` requires JS execution
- Recommend prerender service (Prerender.io, Rendertron) for social previews

### SEO Files
- `public/sitemap.xml` — static, needs manual update when routes change
- `public/robots.txt` — standard allow-all
- OG image: `public/og-image.jpg`

### Hosting
Deploy `dist/` to any static host. All routes must fall back to `index.html` (SPA rewrite).

### Environment Variables
See `.env.example`. No env vars required currently — project is fully client-side.

---

## 9. Placeholder Content (Needs Real Assets)

- Gallery stage images: deterministic placeholder colours
- Photographer profiles: placeholder data
- Print images: `placeholder.svg`
- Book covers: single mockup reused across all 3 volumes
- Stage locations/shoreholder names: generated, not real

---

## 10. Remaining Technical Debt

1. No error boundaries (uncaught errors white-screen the app)
2. No analytics tracking
3. No payment integration
4. `@tanstack/react-query` installed but unused — ready for API integration
5. Info pack download currently links to email (needs real PDF asset)

---

*Document updated: 2026-02-26*  
*Project: Follow the Coast (ftc-web)*
