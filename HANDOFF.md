# Follow The Coast — Developer Handoff

> Last updated: March 2026 · Based on current codebase analysis

---

## 1. Project Overview

**Follow The Coast** is a photography-driven running project website documenting a multi-year journey along the European coastline from Knokke, Belgium to Athens, Greece — 100 km at a time.

The site has been redesigned around an **editorial photobook design language**: cinematic pacing, structural whitespace, photography-first layouts, and quiet typography. Every page is structured like the opening of a documentary book — full-bleed photographs, pull quotes as chapter epigraphs, data strips as colophon entries, and sections that breathe.

The previous card-heavy, gradient-accented UI has been replaced with a restrained, warm-toned system built on two custom typefaces and a paper-white palette.

---

## 2. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | ^18.3.1 |
| Language | TypeScript | ^5.8.3 |
| Build tool | Vite | ^5.4.19 |
| Bundler plugin | @vitejs/plugin-react-swc | ^3.11.0 |
| Routing | react-router-dom | ^6.30.1 |
| Styling | Tailwind CSS | ^3.4.17 |
| Animation | Framer Motion | ^12.30.0 |
| Component primitives | Radix UI (Toast, Tooltip, Slot) | various |
| Class merging | tailwind-merge + clsx + cva | ^2.6.0 / ^2.1.1 / ^0.7.1 |
| Icons | Lucide React | ^0.454.0 |
| SEO | react-helmet-async | ^2.0.5 |
| Toast notifications | sonner | ^1.7.4 |
| CSS animation plugin | tailwindcss-animate | ^1.0.7 |
| Testing | Vitest + @testing-library/react + jsdom | ^3.2.4 |
| Linting | ESLint + typescript-eslint | ^9.32.0 |
| Dev tagging | lovable-tagger | ^1.1.13 |

### Package Manager

Bun (lockfiles: `bun.lock`, `bun.lockb`).

---

## 3. Project Structure

```
├── public/
│   ├── fonts/                  # Custom typefaces (TTF)
│   ├── route-map.svg           # SVG coastline path (parsed at runtime)
│   ├── og-image.jpg            # Open Graph share image
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── assets/                 # Static images (imported as ES modules)
│   ├── components/
│   │   ├── editorial/          # Reusable editorial layout primitives
│   │   │   ├── FullBleedImage.tsx
│   │   │   ├── ImagePair.tsx
│   │   │   ├── ImageWithCaption.tsx
│   │   │   └── index.ts        # Barrel export
│   │   ├── layouts/            # Page-level layout wrappers
│   │   │   └── SideRouteLayout.tsx
│   │   ├── ui/                 # shadcn/ui primitives (button, toast, tooltip)
│   │   └── *.tsx               # Feature components (Navigation, Hero, etc.)
│   ├── data/                   # Static data sources (stages, shoreholders)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions and services
│   ├── pages/                  # Route-level page components
│   ├── types/                  # TypeScript type definitions
│   ├── test/                   # Test setup and test files
│   ├── App.tsx                 # Router + providers
│   ├── main.tsx                # Entry point
│   └── index.css               # Design system tokens + base styles
├── index.html                  # HTML shell with font preloads + OG meta
├── tailwind.config.ts          # Extended theme with design tokens
├── vite.config.ts              # Vite config with SWC + path aliases
├── .env.example                # Environment variable template
└── package.json
```

### Directory Responsibilities

| Directory | Purpose |
|---|---|
| `components/editorial/` | Image layout primitives modeled after book spreads (FullBleedImage, ImagePair, ImageWithCaption) |
| `components/layouts/` | Page-level wrappers for recurring page structures (e.g., side route event pages) |
| `components/ui/` | shadcn/ui base components — button, toast, tooltip |
| `components/` (root) | Feature sections: Navigation, HeroSection, JourneySection, StagesSection, BookSection, etc. |
| `data/` | Static data: 168-stage archive (`stages.ts`), shoreholder runner data (`shoreholders.ts`) |
| `hooks/` | `useNavTheme` (adaptive nav color), `useCanvasCamera` (archive canvas), `useCurrentDistance` (live counter) |
| `lib/` | `apiClient.ts` (fetch wrapper), `endpoints.ts` (API paths), `distanceCalculator.ts`, `counterCalculator.ts`, `pathSmoothing.ts`, `svgCache.ts` |
| `pages/` | One file per route — lazy-loaded except Index |
| `types/` | Shared API request/response interfaces (`api.ts`) |

---

## 4. Design System

### Philosophy

**Editorial photobook** — photography is the content, typography is secondary, whitespace creates rhythm. Inspired by documentary art books: cinematic pacing, structural silence, warm materiality.

### Design Tokens (defined in `src/index.css`)

#### Color Palette (HSL)

| Token | Light Mode | Purpose |
|---|---|---|
| `--background` | `40 20% 97%` | Warm paper white |
| `--foreground` | `0 0% 8%` | Near-black (not pure) |
| `--primary` | `0 0% 8%` | Text IS the accent (editorial) |
| `--secondary` | `40 10% 93%` | Tinted warm grey |
| `--muted` | `40 8% 88%` | Muted surfaces |
| `--muted-foreground` | `0 0% 42%` | Secondary text |
| `--accent` | `12 45% 48%` | Terracotta — sparingly used |
| `--border` | `40 8% 85%` | Subtle warm grey borders |
| `--coast-charcoal` | `0 0% 8%` | Brand charcoal |
| `--coast-paper` | `40 20% 97%` | Brand paper |
| `--coast-rust` | `12 45% 48%` | Brand terracotta |

Dark mode tokens are defined under `.dark` class.

**Inverted tokens** (for dark sections like footer):

| Token | Value | Purpose |
|---|---|---|
| `--inv-foreground` | `40 20% 97%` | Light text on dark bg |
| `--inv-muted` | `40 20% 97% / 0.55` | Muted light text |
| `--inv-subtle` | `40 20% 97% / 0.35` | Subtle labels |
| `--inv-faint` | `40 20% 97% / 0.18` | Very faint text |
| `--inv-border` | `40 20% 97% / 0.1` | Faint borders |

#### Typography

| Token | Value | Usage |
|---|---|---|
| `--font-display` | `'Pressura GT', 'Helvetica Neue', sans-serif` | Labels, wordmark, uppercase text |
| `--font-body` | `'Beausite Classic', 'Georgia', serif` | Body copy, headings, reading |

Custom font files loaded from `public/fonts/` with `font-display: swap`.

Headings use the body font (editorial convention). Display font is reserved for small uppercase labels and the wordmark.

#### Spacing Rhythm

| Token | Value | Usage |
|---|---|---|
| `--space-section` | `clamp(6rem, 12vw, 10rem)` | Between major sections |
| `--space-chapter` | `clamp(8rem, 16vw, 14rem)` | Between chapters (larger) |
| `--space-block` | `clamp(2rem, 4vw, 3.5rem)` | Between blocks within sections |
| `--space-element` | `clamp(1rem, 2vw, 1.5rem)` | Between elements within blocks |

#### Content Widths

| Token | Value | Purpose |
|---|---|---|
| `--width-text` | `38rem` (~600px) | Reading column max-width |
| `--width-content` | `64rem` (~1024px) | Standard content max |
| `--width-wide` | `80rem` (~1280px) | Wide content (quotes, galleries) |

#### Page Margins

| Token | Value |
|---|---|
| `--margin-page` | `clamp(1.5rem, 5vw, 6rem)` |

#### Border Radius

All radii set to `0px` — sharp edges, editorial precision.

### Tailwind Utility Classes (custom)

Defined in `@layer utilities` in `index.css`:

| Class | Purpose |
|---|---|
| `.font-display` | Apply display typeface |
| `.font-body` | Apply body typeface |
| `.text-caption` | 10px uppercase tracked text (editorial captions) |
| `.text-label` | 11px uppercase tracked muted text (section labels) |
| `.rule` | Thin 15% opacity horizontal rule |
| `.rule-dark` | Full opacity horizontal rule |
| `.rule-inv` | Inverted (light) horizontal rule |
| `.px-page` | Responsive page margins |
| `.py-section` | Section vertical padding |
| `.py-chapter` | Chapter vertical padding (larger) |
| `.mb-block` | Block bottom margin |
| `.mb-element` | Element bottom margin |
| `.max-w-text` | Reading width constraint |
| `.max-w-content` | Content width constraint |
| `.max-w-wide` | Wide content constraint |
| `.mask-fade-bottom` | CSS mask for bottom fade |

### Section Label Pattern

Every section uses a consistent label pattern:
```tsx
<p className="text-label mb-element">
  <span className="inline-block w-2.5 h-px bg-accent mr-2 align-middle" />
  Section Name
</p>
```
A small terracotta dash followed by uppercase text.

---

## 5. Component Architecture

### Editorial Primitives (`components/editorial/`)

| Component | Purpose | Key Props |
|---|---|---|
| `FullBleedImage` | Edge-to-edge photograph with fade-in on scroll | `src`, `alt`, `aspectRatio`, `caption`, `priority` |
| `ImagePair` | Two side-by-side images (book spread) — stacks on mobile | `left`, `right` (each: `src`, `alt`, `caption`), `gap` |
| `ImageWithCaption` | Contained image with optional caption | `src`, `alt`, `caption`, `aspectRatio`, `className` |

### Feature Components

| Component | Purpose | Notes |
|---|---|---|
| `Navigation` | Fixed top nav with scroll progress bar | Adapts text color via `useNavTheme` (light text on dark bg, dark text on light bg). Animated hamburger menu on mobile. Scroll progress bar using `framer-motion`. |
| `HeroSection` | Full-viewport photograph with title overlay | Ken Burns zoom-in on load. CTAs: Register (accent fill) + Newsletter (ghost). Uses `MagneticButton`. |
| `LoadingScreen` | First-visit loading animation | Route SVG path traces as progress indicator. Curtain reveal transition. Session-gated via `sessionStorage`. |
| `MarqueeTicker` | Stats strip (km, countries, runners, books) | Uses `CountUp` for animated numbers. Data from `useCurrentDistance` hook. |
| `JourneySection` | Story introduction + animated route map | Two-column: editorial prose + `RouteMap` SVG that draws itself on scroll. |
| `PullQuote` | Large serif text with word-by-word scroll reveal | `text` + `variant` (light/dark bg). Each word fades in based on scroll position. |
| `HowItWorksSection` | Three numbered steps + pricing metadata | Clean editorial list with horizontal rules. |
| `StagesSection` | Registration list — table-of-contents style | No cards — quiet rows with hover opacity transitions. Links to registration. |
| `PhotoGallery` | Horizontal scroll gallery | Scroll-linked parallax (`useTransform`). Large cinematic images. Hover captions. |
| `BookSection` | Full-bleed book photograph + text | 16:9 image + two-column text below with CTA. |
| `EventsSection` | Side route event cards | Three-column grid with 4:3 images. Subtle hover scale. |
| `SupportSection` | Support CTA — centered text block | Minimal, editorial. Uses `MagneticButton`. |
| `PartnersSection` | Partner names (text only, no logos) | Colophon-style acknowledgment. |
| `NewsletterSection` | Email signup form | Underline input, no background. Backend integration point. |
| `Footer` | Dark-background colophon | Four-column link grid + copyright. Uses inverted tokens (`text-inv-*`). |

### Interaction Components

| Component | Purpose |
|---|---|
| `MagneticButton` | Spring-physics cursor-following button (Framer Motion) |
| `CountUp` | Animated number counter triggered on scroll into view |
| `RouteMap` | SVG coastline path with draw animation + location pins |
| `GalleryTile` | Archive canvas tile with hover metadata reveal |
| `EditorialArrow` | Small directional arrow icon |
| `ScrollToTop` | Scrolls to top on route change |
| `SEO` | `<Helmet>` wrapper for per-page meta tags |

### Component Composition (Homepage)

The homepage follows a chapter structure:

```
LoadingScreen (first visit only)
Navigation (fixed)
├── Chapter 1: Opening
│   ├── HeroSection (full-viewport plate)
│   └── MarqueeTicker (data strip)
├── Chapter 2: The Story
│   ├── JourneySection (text + route map)
│   └── PullQuote
├── Chapter 3: Participation
│   ├── HowItWorksSection
│   └── FullBleedImage (visual breath)
├── Chapter 4: Stages
│   └── StagesSection
├── Chapter 5: Photography
│   └── PhotoGallery (horizontal scroll)
├── Chapter 6: The Books
│   ├── BookSection
│   └── PullQuote
├── Chapter 7: Side Routes
│   └── EventsSection
├── Chapter 8: Support
│   ├── FullBleedImage
│   ├── SupportSection
│   └── PartnersSection
├── Chapter 9: Stay Connected
│   └── NewsletterSection
└── Colophon
    └── Footer
```

---

## 6. Page Templates

### Routes (defined in `App.tsx`)

| Path | Page | Loading |
|---|---|---|
| `/` | Index (homepage) | Eager |
| `/register` | Register | Lazy |
| `/order-books` | OrderBooks | Lazy |
| `/all-stages` | AllStages | Lazy |
| `/eu-stages` | EUStages | Lazy |
| `/homerun` | HomeRun | Lazy |
| `/follow-the-kust` | FollowTheKust | Lazy |
| `/tour-du-mont-blanc` | TourDuMontBlanc | Lazy |
| `/archive` | Gallery (infinite canvas) | Lazy |
| `/gallery` | → Redirect to `/archive` | — |
| `/shoreholders` | Shoreholders | Lazy |
| `/route-map` | RouteMapPage | Lazy |
| `/timeline` | Timeline | Lazy |
| `/participant-handbook` | ParticipantHandbook | Lazy |
| `/privacy` | Privacy | Lazy |
| `/prints` | Prints | Lazy |
| `/photographers` | Photographers | Lazy |
| `/checkout` | Checkout | Lazy |
| `/support` | SupportTheProject | Lazy |
| `*` | NotFound | Lazy |

### Template Patterns

**Homepage**: Chapter-paced scroll through full-bleed images, data strips, editorial text blocks, horizontal galleries, and pull quotes. No repeating card grids — each section has a distinct rhythm.

**Side Route Pages** (HomeRun, FollowTheKust, TourDuMontBlanc): Use `SideRouteLayout` wrapper. Hero image + editorial content + registration CTA.

**Archive Page**: Full-viewport infinite canvas with draggable/zoomable tile grid (168 stages). Uses `useCanvasCamera` hook for pan/zoom/momentum. `GalleryTile` for each stage.

**Content Pages** (Privacy, Handbook): Simple text pages with `max-w-text` reading width.

---

## 7. Image Handling System

### Strategy

- **Import method**: Images in `src/assets/` are imported as ES modules (Vite handles hashing/optimization)
- **Public assets**: Route map SVG and fonts in `public/` (served as-is)
- **Formats**: JPG for photographs, SVG for icons/maps, PNG for logos with transparency

### Loading

| Attribute | Value | When |
|---|---|---|
| `loading` | `lazy` | Default for all below-fold images |
| `loading` | `eager` | Hero image, priority editorial images |
| `decoding` | `async` | Default |
| `decoding` | `sync` | Priority images |

### Responsive Images

Currently using CSS `object-cover` with `object-position` for focal point control on the hero. No `srcset` / `<picture>` elements yet — this is a future improvement area.

### Performance Patterns

- Images fade in on scroll via `useInView` + Framer Motion opacity transition
- Gallery images use `will-change-transform` for GPU compositing
- Aspect ratios set via inline `style={{ aspectRatio }}` to prevent layout shift

### Adding New Images

1. Place the file in `src/assets/`
2. Import it: `import myImage from '@/assets/my-image.jpg';`
3. Use with an editorial component:
   ```tsx
   <FullBleedImage src={myImage} alt="Description" />
   // or
   <ImagePair left={{ src: img1, alt: "..." }} right={{ src: img2, alt: "..." }} />
   ```

---

## 8. Interaction & Motion

### Library

All animation is handled by **Framer Motion** (`framer-motion ^12.30.0`).

### Scroll Behaviors

| Pattern | Implementation | Used In |
|---|---|---|
| Fade-in on scroll | `useInView({ once: true })` → opacity 0→1, y offset | Most sections |
| Word-by-word reveal | `useScroll` + `useTransform` per word | PullQuote |
| Horizontal parallax | `useScroll` + `useTransform` for x offset | PhotoGallery |
| Path drawing | `pathLength` 0→1 animation | RouteMap, LoadingScreen |
| Scroll progress bar | `useScroll` + `useSpring` → scaleX | Navigation |

### Hover States

| Element | Effect |
|---|---|
| Nav links | Color transition + underline border-bottom |
| Gallery images | `scale(1.015)` over 1000ms ease-out |
| Stage rows | Opacity fade to 50% |
| Event cards | Image scale + title opacity fade |
| Footer links | Color transition (inv-muted → inv) |
| MagneticButton | Spring-physics cursor tracking |

### Transitions

| Context | Duration | Easing |
|---|---|---|
| Section fade-in | 0.6–1.2s | easeOut |
| Image scale on hover | 1000ms | ease-out |
| Color transitions | 300–500ms | default ease |
| Route map draw | 4s | easeInOut |
| Loading screen curtain | 800ms | cubic-bezier(0.76, 0, 0.24, 1) |
| Hero Ken Burns | 2.5s | cubic-bezier(0.25, 0.46, 0.45, 0.94) |

### Philosophy

Animations serve pacing, not decoration. One well-timed entrance is better than scattered micro-interactions. Most sections simply fade in once on scroll. The route map drawing and pull quote word reveal are the two signature moments.

---

## 9. Navigation System

### Structure

Fixed top navigation (`z-50`) with:
- **Left**: "Follow The Coast" wordmark (stacked, 6px uppercase)
- **Right (desktop)**: Archive, Prints, Books, Side Routes, Support, Register
- **Right (mobile)**: Animated hamburger → fullscreen overlay menu

### Color Adaptation

The `useNavTheme` hook samples the background color behind the nav element on every scroll frame:
- **Dark background** (hero, dark sections) → light text (`text-white`)
- **Light background** (paper sections) → dark text (`text-foreground`)

Uses `document.elementsFromPoint()` + luminance calculation.

### Routing

- Standard `<a href>` tags for navigation (not `<Link>`)
- Hash links (e.g., `/#events`) handled with custom `handleHashLink` that navigates then scrolls
- `ScrollToTop` component resets scroll position on route changes
- `Register` link has persistent underline (CTA emphasis)

### Scroll Progress

A 2px terracotta (`bg-accent`) bar at the top of the viewport scales with `scrollYProgress` via a spring-damped `useSpring`.

---

## 10. Performance Strategy

### Code Splitting

- **Homepage** (`Index`): eagerly loaded (critical path)
- **All other pages**: `React.lazy()` with `<Suspense>` fallback (empty background div)

### Font Loading

- Two custom fonts preloaded in `index.html` via `<link rel="preload">`
- `font-display: swap` prevents FOIT

### Image Performance

- Lazy loading on all below-fold images
- Aspect ratios prevent CLS
- `will-change-transform` on interactive elements (gallery tiles)
- `decoding="async"` for non-blocking decode

### SVG Caching

Route map SVG is fetched once and cached in memory (`svgCache.ts`). Shared between `LoadingScreen` and `RouteMap` components.

### Archive Canvas

The infinite canvas archive uses:
- Absolute positioning with `transform: translate3d()` for GPU compositing
- `memo()` on `GalleryTile` to prevent re-renders
- Momentum-based pan with friction coefficient
- Zoom clamped between 0.5× and 1.4×

### Caution Areas

- **Image weight**: The site is photography-heavy. Future optimization should add `srcset` with multiple resolutions and WebP/AVIF formats
- **Archive page**: 168 tiles rendered simultaneously. Consider virtualization if tile count grows significantly
- **Framer Motion bundle**: Large library — currently used extensively. Tree-shaking helps but monitor bundle size

---

## 11. Backend Integration Points

The frontend is currently **fully static** with placeholder data. All backend integration points are prepared but not connected.

### API Client (`src/lib/apiClient.ts`)

Centralized fetch wrapper with `GET`, `POST`, `PUT`, `DELETE` methods. Base URL configurable via `VITE_API_BASE_URL` env var.

### Endpoints (`src/lib/endpoints.ts`)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/archive/tiles` | GET | Stage archive data |
| `/api/shoreholders` | GET | Runner data per stage |
| `/api/newsletter` | POST | Newsletter subscription (`{ email }`) |
| `/api/registration` | POST | Stage registration |
| `/api/checkout` | POST | Payment/checkout flow |
| `/api/photographers` | GET | Photographer profiles |
| `/api/prints` | GET | Print catalog |

### Type Contracts (`src/types/api.ts`)

Full TypeScript interfaces for all request/response shapes:
- `StageResponse`, `ShoreholderResponse`
- `NewsletterSubscribeRequest/Response`
- `RegistrationRequest/Response`
- `CheckoutRequest/Response` (includes Stripe redirect URL)
- `PhotographerResponse`, `PrintResponse`

### Data Sources (current)

| Data | Source | File |
|---|---|---|
| 168 stages | Procedurally generated | `src/data/stages.ts` |
| Shoreholders | Derived from stages | `src/data/shoreholders.ts` |
| Events | Hardcoded in component | `EventsSection.tsx` |
| Partners | Hardcoded array | `PartnersSection.tsx` |
| Stats (km, etc.) | Calculated from date | `lib/distanceCalculator.ts`, `lib/counterCalculator.ts` |

### Integration Checklist

To connect a backend:

1. Set `VITE_API_BASE_URL` in `.env`
2. Replace `data/stages.ts` import with `api.get<StageResponse[]>(ENDPOINTS.ARCHIVE_TILES)`
3. Wire `NewsletterSection` form submit to `api.post(ENDPOINTS.NEWSLETTER_SUBSCRIBE, { email })`
4. Connect `Register` page form to `api.post(ENDPOINTS.REGISTRATION, payload)`
5. Wire `Checkout` page to `api.post(ENDPOINTS.CHECKOUT, payload)` → redirect to `paymentUrl`

---

## 12. Accessibility

### Implemented

- **Semantic HTML**: `<section>`, `<nav>`, `<footer>`, `<figure>`, `<figcaption>`, `<main>`
- **Image alt text**: All images have descriptive `alt` attributes
- **Form labels**: Newsletter input has `<label>` with `sr-only` class
- **ARIA**: Menu toggle has `aria-label="Toggle menu"`, gallery tiles have `aria-label` with stage/location
- **Keyboard navigation**: Archive canvas supports arrow keys and +/- for zoom
- **Focus styles**: Default browser focus rings preserved (no `outline-none` without replacement)
- **Smooth scrolling**: `scroll-behavior: smooth` on `<html>`
- **Font rendering**: Antialiased text rendering

### Areas for Improvement

- Skip-to-content link not yet implemented
- Color contrast should be audited (muted-foreground at 42% lightness may be borderline)
- Mobile menu should trap focus when open
- Reduced motion preference (`prefers-reduced-motion`) not yet respected

---

## 13. Deployment

### Build Process

```bash
# Install dependencies
bun install

# Development server (port 8080)
bun run dev

# Production build
bun run build

# Preview production build
bun run preview
```

### Output

Vite outputs to `dist/` — static HTML + JS + CSS + hashed assets.

### Deployment Platform

Hosted on **Lovable** (preview + production URLs). Static site deployment — no server required.

### Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | No | Backend API base URL (empty = same origin) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key for checkout |
| `VITE_ANALYTICS_ID` | No | Analytics tracking ID |

### SEO Assets

- `public/robots.txt` — crawler rules
- `public/sitemap.xml` — page index
- `public/og-image.jpg` — Open Graph share image
- Per-page meta via `<SEO>` component (title, description, canonical, OG, Twitter cards)

---

## 14. Known Limitations & Future Improvements

### Current Limitations

- **No responsive images**: Single resolution per image. Add `srcset` + WebP/AVIF for production
- **No CMS**: All content is hardcoded. Consider headless CMS for stage data, blog posts
- **Archive virtualization**: All 168 tiles render simultaneously — fine now, may need virtualization at scale
- **No backend**: API client and types are ready but not connected
- **No auth**: Registration and checkout flows are UI-only
- **No i18n**: English only
- **Static data**: Stage/shoreholder data is procedurally generated placeholder data

### Planned Improvements

- Connect Stripe for checkout flow
- Newsletter integration (Mailchimp, ConvertKit, or custom)
- Responsive image pipeline with build-time optimization
- CMS integration for stage photography and stories
- `prefers-reduced-motion` support
- Focus trap for mobile menu
- Skip-to-content landmark link

---

## 15. Developer Onboarding

### Prerequisites

- Node.js 18+ or Bun
- Git

### Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd follow-the-coast

# Install dependencies
bun install

# Copy environment file
cp .env.example .env

# Start development server
bun run dev
# → http://localhost:8080
```

### Commands

| Command | Purpose |
|---|---|
| `bun run dev` | Start dev server with HMR |
| `bun run build` | Production build |
| `bun run build:dev` | Development build (unminified) |
| `bun run preview` | Preview production build |
| `bun run test` | Run tests (Vitest) |
| `bun run test:watch` | Run tests in watch mode |
| `bun run lint` | Run ESLint |

### Path Aliases

`@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

```tsx
import { cn } from '@/lib/utils';
import { HeroSection } from '@/components/HeroSection';
```

### Adding a New Page

1. Create `src/pages/MyPage.tsx` (default export)
2. Add lazy import in `App.tsx`: `const MyPage = lazy(() => import('./pages/MyPage'));`
3. Add route: `<Route path="/my-page" element={<MyPage />} />`
4. Add `<SEO>` component at top of page for meta tags
5. Include `<Navigation />` and `<Footer />` if standalone page
6. Add to `public/sitemap.xml`

### Adding a New Section

1. Create `src/components/MySection.tsx`
2. Use `useInView` + `motion.div` for scroll-triggered fade-in
3. Follow the section label pattern with `text-label` + accent dash
4. Use `px-page py-section` for consistent spacing
5. Constrain content with `max-w-content mx-auto`

---

*End of handoff document.*
