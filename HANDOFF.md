# Follow the Coast — Technical Handoff Document

## 1. Framework & Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18.3.x |
| Build | Vite (SWC plugin) | Latest |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS + CSS custom properties | v3 |
| Routing | react-router-dom | 6.30.x |
| Animation | framer-motion | 12.30.x |
| UI Components | shadcn/ui (Radix primitives) | Latest |
| State | React local state only (no global store) | — |
| Data fetching | @tanstack/react-query (configured, unused) | 5.83.x |

**Architecture**: Single-Page Application (SPA) with client-side routing. All pages are client-rendered. No SSR/SSG.

---

## 2. Project Structure

```
├── index.html                    # Entry HTML (SEO meta tags)
├── vite.config.ts                # Vite config with path aliases
├── tailwind.config.ts            # Tailwind theme (design tokens)
├── public/
│   ├── fonts/                    # Custom fonts (GT Pressura, Beausite Classic)
│   ├── route-map.svg             # SVG coastline path (fetched at runtime)
│   └── favicon.ico
├── src/
│   ├── main.tsx                  # React entry point
│   ├── App.tsx                   # Router + providers
│   ├── index.css                 # Design system (CSS variables, @font-face)
│   ├── assets/                   # Images (imported as ES modules)
│   ├── data/
│   │   └── stages.ts             # ★ Single source of truth: 168 stages with coordinates
│   ├── components/
│   │   ├── Navigation.tsx        # Fixed nav with scroll progress + theme detection
│   │   ├── HeroSection.tsx       # Landing hero with text reveal animation
│   │   ├── JourneySection.tsx    # Stats + route map
│   │   ├── HowItWorksSection.tsx # 3-step breakdown + pricing
│   │   ├── StagesSection.tsx     # Registration CTAs
│   │   ├── BookSection.tsx       # Book listings
│   │   ├── EventsSection.tsx     # Side route cards
│   │   ├── PhotoGallery.tsx      # Horizontal parallax gallery (links to /gallery)
│   │   ├── GalleryTile.tsx       # ★ Canvas tile: GPU-composited, lazy-loaded, placeholder-aware
│   │   ├── NewsletterSection.tsx # Email capture form
│   │   ├── PartnersSection.tsx   # Partner logos
│   │   ├── Footer.tsx            # Site footer with navigation
│   │   ├── CustomCursor.tsx      # Custom cursor with trail
│   │   ├── LoadingScreen.tsx     # Route map animation + curtain reveal
│   │   ├── MarqueeTicker.tsx     # Physics-based horizontal scroller
│   │   ├── RouteMap.tsx          # Animated SVG coastline map
│   │   ├── MagneticButton.tsx    # Hover-follow button effect
│   │   ├── CountUp.tsx           # Scroll-triggered number animation
│   │   ├── TextReveal.tsx        # Slide-up word animation
│   │   ├── PullQuote.tsx         # Kinetic scroll-reveal quote
│   │   └── ui/                   # shadcn/ui primitives (Radix-based)
│   ├── hooks/
│   │   ├── useCanvasCamera.ts    # ★ 2D camera: drag, scroll, zoom, momentum, keyboard
│   │   ├── useCurrentDistance.ts # Live distance counter (date-based)
│   │   └── useNavTheme.ts       # Detects dark/light nav background
│   ├── lib/
│   │   ├── distanceCalculator.ts # Distance logic with pause days & date ranges
│   │   ├── pathSmoothing.ts      # Ramer-Douglas-Peucker + Catmull-Rom SVG smoothing
│   │   ├── svgCache.ts           # SVG fetch + parse cache
│   │   └── utils.ts              # cn() classname merger
│   └── pages/
│       ├── Index.tsx             # Homepage (composition of sections)
│       ├── Gallery.tsx           # ★ Infinite canvas: virtualized viewport + lightbox
│       ├── HomeRun.tsx           # Home Run Venice event page
│       ├── FollowTheKust.tsx     # Belgian coast run page
│       ├── TourDuMontBlanc.tsx   # TMB expedition page
│       ├── Register.tsx          # Multi-tier registration page
│       ├── OrderBooks.tsx        # Book ordering page
│       ├── AllStages.tsx         # Coming soon placeholder
│       ├── EUStages.tsx          # Coming soon placeholder
│       ├── USStages.tsx          # Coming soon placeholder
│       └── NotFound.tsx          # 404 page
```

---

## 3. Gallery Canvas Architecture

### How It Works

The gallery is a **pannable infinite 2D canvas** (not a scrolling page). Users explore a spatial world of stage tiles by dragging, scrolling, or using keyboard arrows.

```
┌──────────────────────────────────────────────┐
│  Browser viewport (fixed, overflow:hidden)   │
│  ┌────────────────────────────────────────┐  │
│  │  World layer (single div, translate3d) │  │
│  │                                        │  │
│  │   ┌─────┐     ┌────┐                  │  │
│  │   │Tile │     │Tile│    (only visible  │  │
│  │   │ 026 │     │ 028│     tiles render) │  │
│  │   └─────┘     └────┘                  │  │
│  │        ┌──────┐                        │  │
│  │        │Tile  │                        │  │
│  │        │ 029  │                        │  │
│  │        └──────┘                        │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

### Component Hierarchy

```
Gallery.tsx (page)
├── useCanvasCamera() — returns { camera: {x, y, zoom} }
├── <header> — Back button + tile count
├── <Hint> — "Drag to explore" tooltip
├── <div ref={containerRef}> — event capture surface
│   └── <div style={translate3d}> — world layer (GPU composited)
│       └── {visibleTiles.map → <GalleryTile />} — virtualized
└── <Lightbox /> — AnimatePresence overlay
```

### Data Flow

```
src/data/stages.ts          → STAGES[] (168 entries)
                                ↓
Gallery.tsx                  → visibleTiles = STAGES.filter(inViewport)
                                ↓
GalleryTile.tsx              → renders single tile at (x,y) via translate3d
                                ↓
                             → onError → shows deterministic color placeholder
```

### Performance Strategy

| Technique | Implementation |
|-----------|---------------|
| **Virtualization** | Only tiles within viewport + 400px buffer are in the DOM |
| **GPU compositing** | Single `translate3d` on world layer; individual tile positioning via `translate3d` |
| **Lazy loading** | `loading="lazy" decoding="async"` on all tile images |
| **Momentum inertia** | `requestAnimationFrame` loop with velocity decay (friction: 0.92) |
| **No layout reflow** | All positioning via `transform` and `opacity` only |
| **Memoization** | `GalleryTile` wrapped in `React.memo` |
| **Placeholder fallback** | Deterministic HSL gradient on image error — no layout shift |

### Interaction Model

| Input | Action |
|-------|--------|
| Click + drag | Pan camera |
| Scroll wheel | Pan (deltaX/deltaY) |
| Trackpad pinch (ctrl+wheel) | Zoom (0.4x – 1.6x) |
| Arrow keys | Pan 80px per press |
| +/- keys | Zoom in/out |
| Click tile (< 6px drag) | Open lightbox |
| Touch drag | Pan (mobile) |

---

## 4. State Management

**No global state management.** All state is local React state via `useState` and `useRef`.

| State | Location | Scope |
|-------|----------|-------|
| Loading screen phase | `Index.tsx` | Page-level |
| Mobile menu open | `Navigation.tsx` | Component |
| Canvas camera (x, y, zoom) | `useCanvasCamera.ts` | Hook (pointer/wheel/keyboard) |
| Gallery lightbox state | `Gallery.tsx` | Page-level |
| Gallery viewport size | `Gallery.tsx` | Page-level |
| Nav theme (light/dark) | `useNavTheme.ts` | Hook (DOM sampling) |
| Live distance counter | `useCurrentDistance.ts` | Hook (timer-based) |
| Newsletter email | `NewsletterSection.tsx` | Component |
| Registration tier selection | `Register.tsx` | Component |
| Custom cursor position | `CustomCursor.tsx` | Component |
| Marquee velocity | `MarqueeTicker.tsx` | Component (refs) |

**Context providers in App.tsx:**
- `QueryClientProvider` (react-query — configured but unused, ready for API integration)
- `TooltipProvider` (Radix)

---

## 5. API Readiness — What Needs Backend

### Stage Data (Gallery)

**Current location:** `src/data/stages.ts`

**Current format (replace with API response):**

```typescript
interface StageTileData {
  id: string;       // "stage-001"
  title: string;    // "Stage 001"
  location: string; // "Sagres, Portugal" (currently "TBD")
  image: string;    // URL to cover image
  x: number;        // world-space X coordinate
  y: number;        // world-space Y coordinate
  width: number;    // tile width in px (320–520)
  height: number;   // tile height in px (320–500)
  link: string;     // route path "/stages/stage-001"
}
```

**Expected API endpoint:** `GET /api/gallery/tiles`

**Expected response:**
```json
{
  "stages": [
    {
      "id": "stage-001",
      "title": "Stage 001",
      "location": "Sagres, Portugal",
      "image": "https://cdn.followthecoast.com/stages/001/cover.jpg",
      "x": -2000,
      "y": 800,
      "width": 420,
      "height": 320,
      "link": "/stages/stage-001"
    }
  ]
}
```

**Integration steps:**
1. Replace `import { STAGES } from '@/data/stages'` with a `useQuery` fetch
2. The `Gallery.tsx` component already consumes `StageTileData[]` — just swap the source
3. The virtualization logic works identically with API data

### Stage Photos (Lightbox)

**Current:** `getStagePhotos()` in `Gallery.tsx` returns a single-photo placeholder per tile.

**Expected API endpoint:** `GET /api/stages/:id/photos`

**Expected response:**
```json
{
  "stage": "Stage 001",
  "location": "Sagres, Portugal",
  "photos": [
    { "src": "https://cdn.followthecoast.com/stages/001/photo-1.jpg", "alt": "Cliff bay" },
    { "src": "https://cdn.followthecoast.com/stages/001/photo-2.jpg", "alt": "Trail view" }
  ]
}
```

### All Hardcoded Data (Replace with API)

| Data | Current Location | Backend Endpoint |
|------|-----------------|------------------|
| Stage tile positions + metadata | `src/data/stages.ts` | `GET /api/gallery/tiles` |
| Stage photos | `Gallery.tsx getStagePhotos()` | `GET /api/stages/:id/photos` |
| Stage listings | `Register.tsx` | `GET /api/stages` |
| Stage status (open/taken) | `Register.tsx` | `GET /api/stages/:id/status` |
| Book catalog + pricing | `OrderBooks.tsx` | `GET /api/books` |
| Event details (dates, prices) | `HomeRun.tsx`, `FollowTheKust.tsx`, `TourDuMontBlanc.tsx` | `GET /api/events/:slug` |
| Partner list | `PartnersSection.tsx` | `GET /api/partners` |
| Distance progress | `distanceCalculator.ts` | `GET /api/progress` (or keep client-side) |
| Newsletter subscription | `NewsletterSection.tsx` | `POST /api/newsletter` |
| Book ordering | `OrderBooks.tsx` | `POST /api/orders` (Stripe) |
| Registration submission | `Register.tsx` | `POST /api/registrations` |

---

## 6. Environment Requirements

### Current
None required. The app is entirely client-side with no API keys.

### Future (When Backend Added)
```env
VITE_API_URL=              # Backend API base URL
VITE_STRIPE_PUBLIC_KEY=    # Stripe publishable key
# Server-side only:
STRIPE_SECRET_KEY=         # Stripe secret
RESEND_API_KEY=            # Email service
```

---

## 7. Build & Deployment

```bash
bun install          # Install dependencies
bun run dev          # Dev server on port 8080
bun run build        # Production build → dist/
bun run preview      # Preview production build
bun run test         # Vitest
```

- Static files in `dist/`, assets hashed by Vite
- Route-based code splitting via `React.lazy()` (all secondary pages)
- SPA fallback routing required (all paths → `index.html`)
- Compatible with: Vercel, Netlify, Cloudflare Pages, S3+CloudFront

---

## 8. Design System Reference

### Fonts
- **Display**: GT Pressura (`font-display` class / `--font-display` var)
- **Body**: Beausite Classic (`font-body` class / `--font-body` var)

### Color Tokens (HSL)
| Token | Role | Value |
|-------|------|-------|
| `--background` | Page bg (bone) | `40 27% 95%` |
| `--foreground` | Dark sections / text (Atlantic blue) | `203 92% 15%` |
| `--accent` | CTAs (rust/clay) | `21 54% 50%` |
| `--muted-foreground` | Secondary text | `206 17% 45%` |
| `--border` | Dividers | `36 6% 80%` |

---

## 9. Technical Debt & Known Limitations

| Item | Severity | Notes |
|------|----------|-------|
| All 168 stage locations are "TBD" | High | Backend must populate real location names |
| All stage images are placeholders | High | Backend must serve real cover images via CDN |
| Tile coordinates are deterministic but arbitrary | Medium | Backend may want to supply curated positions |
| No form validation | Medium | Newsletter, registration forms have no validation |
| No error boundaries | Low | App will white-screen on uncaught errors |
| No analytics | Low | No tracking of any kind |
| No sitemap.xml | Low | Needed for SEO |
| WhatsApp-based registration | Medium | Not scalable, no data capture |
| Hardcoded event data | Medium | Price/date changes require code deploys |
| `react-query` configured but unused | Trivial | Ready for API integration |

---

*Document generated: 2026-02-21*
*Project: Follow the Coast (ftc-web)*
*Published URL: https://ftc-web.lovable.app*
