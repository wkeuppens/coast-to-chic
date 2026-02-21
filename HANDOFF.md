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
│   ├── components/
│   │   ├── Navigation.tsx        # Fixed nav with scroll progress + theme detection
│   │   ├── HeroSection.tsx       # Landing hero with text reveal animation
│   │   ├── JourneySection.tsx    # Stats + route map
│   │   ├── HowItWorksSection.tsx # 3-step breakdown + pricing
│   │   ├── StagesSection.tsx     # Registration CTAs
│   │   ├── BookSection.tsx       # Book listings
│   │   ├── EventsSection.tsx     # Side route cards
│   │   ├── PhotoGallery.tsx      # Horizontal parallax gallery (links to /gallery)
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
│   │   ├── useCurrentDistance.ts  # Live distance counter (date-based)
│   │   └── useNavTheme.ts        # Detects dark/light nav background
│   ├── lib/
│   │   ├── distanceCalculator.ts # Distance logic with pause days & date ranges
│   │   ├── pathSmoothing.ts      # Ramer-Douglas-Peucker + Catmull-Rom SVG smoothing
│   │   ├── svgCache.ts           # SVG fetch + parse cache
│   │   └── utils.ts              # cn() classname merger
│   └── pages/
│       ├── Index.tsx             # Homepage (composition of sections)
│       ├── Gallery.tsx          # Masonry photo grid + lightbox (godly-style)
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

## 3. State Management

**No global state management.** All state is local React state via `useState` and `useRef`.

| State | Location | Scope |
|-------|----------|-------|
| Loading screen phase | `Index.tsx` | Page-level |
| Mobile menu open | `Navigation.tsx` | Component |
| Gallery canvas camera (x, y, zoom) | `useCanvasCamera.ts` | Hook (pointer/wheel) |
| Gallery lightbox state | `Gallery.tsx` | Page-level |
| Nav theme (light/dark) | `useNavTheme.ts` | Hook (DOM sampling) |
| Live distance counter | `useCurrentDistance.ts` | Hook (timer-based) |
| Newsletter email | `NewsletterSection.tsx` | Component |
| Registration tier selection | `Register.tsx` | Component |
| Custom cursor position | `CustomCursor.tsx` | Component |
| Marquee velocity | `MarqueeTicker.tsx` | Component (refs) |

**Context providers in App.tsx:**
- `QueryClientProvider` (react-query — configured but unused)
- `TooltipProvider` (Radix)

---

## 4. API Readiness — What Needs Backend

### Currently Hardcoded (Replace with API)

| Data | Current Location | Backend Endpoint Needed |
|------|-----------------|------------------------|
| Stage listings | `Register.tsx` lines 49-59 | `GET /api/stages` |
| Stage status (open/taken) | `Register.tsx` | `GET /api/stages/:id/status` |
| Book catalog + pricing | `OrderBooks.tsx` lines 7-32 | `GET /api/books` |
| Event details (dates, prices) | `HomeRun.tsx`, `FollowTheKust.tsx`, `TourDuMontBlanc.tsx` | `GET /api/events/:slug` |
| Partner list | `PartnersSection.tsx` line 4 | `GET /api/partners` |
| Distance progress | `distanceCalculator.ts` | `GET /api/progress` (or keep client-side) |
| Gallery tile positions & photos | `Gallery.tsx` `STAGE_TILES` + `STAGE_PHOTOS` | `GET /api/gallery/tiles` (returns id, title, region, image, x, y, width, height, link) and `GET /api/stages/:id/photos` |
| Newsletter subscription | `NewsletterSection.tsx` (no submit handler) | `POST /api/newsletter` |
| Book ordering | `OrderBooks.tsx` (button only, no handler) | `POST /api/orders` (Stripe integration) |
| Registration submission | `Register.tsx` (WhatsApp link only) | `POST /api/registrations` |

### Forms Without Handlers (Need Backend)

1. **Newsletter form** — Has email state but no `onSubmit`. Needs email service integration (Mailchimp, Resend, etc.)
2. **Book order buttons** — No click handlers. Needs payment integration (Stripe)
3. **Registration** — Currently links to WhatsApp. Needs proper registration flow if desired

---

## 5. Environment Requirements

### Current Environment Variables
None required. The app is entirely client-side with no API keys.

### Future Environment Variables (When Backend Added)
```env
VITE_API_URL=              # Backend API base URL
VITE_STRIPE_PUBLIC_KEY=    # Stripe publishable key (for book orders)
# Server-side only (edge functions):
STRIPE_SECRET_KEY=         # Stripe secret
RESEND_API_KEY=            # Email service
```

### External Services Used
- **None currently** — all data is hardcoded
- **Planned**: Stripe (payments), email service (newsletter), WhatsApp Business API (optional)

---

## 6. Build & Deployment

### Commands
```bash
# Install dependencies
bun install        # or npm install

# Development
bun run dev        # Starts Vite dev server on port 8080

# Production build
bun run build      # Outputs to dist/

# Preview production build
bun run preview

# Run tests
bun run test       # Vitest
```

### Build Output
- Static files in `dist/`
- All assets hashed and bundled by Vite
- Route-based code splitting via `React.lazy()` (all secondary pages)

### Hosting Assumptions
- Currently deployed on Lovable hosting (static SPA)
- Any static host works: Vercel, Netlify, Cloudflare Pages, S3+CloudFront
- Requires SPA fallback routing (all paths → `index.html`)
- No server-side rendering needed

---

## 7. Backend Integration Notes

### Frontend-Only Components (No Backend Needed)
- All animations (framer-motion)
- Custom cursor, marquee ticker, photo gallery
- Route map SVG rendering + smoothing
- Navigation theme detection
- Loading screen

### Where Backend Endpoints Must Plug In

1. **Stage registration flow** (`Register.tsx`)
   - Replace hardcoded `sampleStages` array with API fetch
   - Add stage selection → payment → confirmation flow
   - Currently uses WhatsApp link as CTA

2. **Book ordering** (`OrderBooks.tsx`)
   - Wire "Order now" and "Order bundle" buttons to Stripe Checkout
   - Add cart/checkout state management

3. **Newsletter** (`NewsletterSection.tsx`)
   - Add `onSubmit` handler to POST email to backend
   - Add success/error toast feedback

4. **Dynamic content** (events, pricing)
   - Stage prices, dates, and availability should come from CMS/DB
   - Event pages could be generated from API data instead of separate page files

### Potential Conflicts

1. **Distance calculator** (`distanceCalculator.ts`) — Uses hardcoded dates and pause days. If the project schedule changes, this needs updating. Consider moving to a backend config endpoint.

2. **Three "Coming Soon" pages** (`AllStages.tsx`, `EUStages.tsx`, `USStages.tsx`) — These are placeholder pages. Backend team should plan the stage directory data model before building these out.

3. **react-query** is installed and configured but unused. Ready for API integration — just add query hooks.

---

## 8. Design System Reference

### Fonts
- **Display**: GT Pressura (via `font-display` class or `--font-display` var)
- **Body**: Beausite Classic (via `font-body` class or `--font-body` var)

### Color Tokens (HSL in CSS variables)
| Token | Role | Light Mode |
|-------|------|-----------|
| `--background` | Page bg (bone/linen) | `40 27% 95%` |
| `--foreground` | Text + dark sections bg (Atlantic blue) | `203 92% 15%` |
| `--accent` | CTAs, highlights (rust/clay) | `21 54% 50%` |
| `--muted-foreground` | Secondary text | `206 17% 45%` |
| `--border` | Dividers | `36 6% 80%` |

### Pattern: Section Background Alternation
Homepage sections alternate `bg-background` (linen) and `bg-foreground` (deep blue) to create visual rhythm.

---

## 9. Technical Debt & Risks

| Item | Severity | Notes |
|------|----------|-------|
| No form validation | Medium | Newsletter, registration forms have no validation |
| No error boundaries | Low | App will white-screen on uncaught errors |
| No analytics | Low | No tracking of any kind |
| No sitemap.xml | Low | Needed for SEO |
| WhatsApp-based registration | Medium | Not scalable, no data capture |
| Hardcoded event data | Medium | Price/date changes require code deploys |
| No image optimization pipeline | Low | Images served at original size |
| `use-mobile.tsx` hook only used by `sidebar.tsx` | Trivial | Both unused by app, kept as shadcn defaults |
| Dark mode defined but unused | Trivial | CSS variables exist but no toggle |
| `@tanstack/react-query` configured but unused | Trivial | Ready for API integration |

---

*Document generated: 2026-02-20*
*Project: Follow the Coast (ftc-web)*
*Published URL: https://ftc-web.lovable.app*
