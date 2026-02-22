# Backend Integration Guide

Every integration point in the Follow the Coast frontend is listed below. The project builds and runs cleanly without a backend — all data currently comes from local placeholder files.

---

## 1. API Client

| File | Purpose |
|------|---------|
| `src/lib/apiClient.ts` | Centralized `fetch` wrapper (`api.get`, `api.post`, `api.put`, `api.delete`) |
| `src/lib/endpoints.ts` | All endpoint paths as constants |
| `src/types/api.ts` | TypeScript request/response types for every endpoint |

Set `VITE_API_BASE_URL` in `.env` to point at your backend.

---

## 2. Integration Points

### 2.1 Stage / Archive Data

| What | File | Current source | Backend replacement |
|------|------|---------------|-------------------|
| 168 stage records | `src/data/stages.ts` | `buildStages()` generates placeholder data | `GET /api/archive/tiles` → `StageResponse[]` |
| Shoreholder list | `src/data/shoreholders.ts` | Derived from `stages.ts` | `GET /api/shoreholders` → `ShoreholderResponse[]` |

**Consumers:**
- `src/pages/Gallery.tsx` — Archive canvas
- `src/pages/RouteMapPage.tsx` — Route map segments
- `src/pages/Shoreholders.tsx` — Runner list
- `src/pages/Timeline.tsx` — Year-by-year milestones
- `src/components/JourneySection.tsx` — Stats
- `src/components/MarqueeTicker.tsx` — Live counters
- `src/components/PhotoGallery.tsx` — Random stage gallery

**Data shape:** See `StageTileData` in `src/data/stages.ts` and `StageResponse` in `src/types/api.ts`.

**Key fields to populate:** `image` (currently `/placeholders/stage-NNN.jpg`), `shoreholder`, `startCoord`, `endCoord`.

---

### 2.2 Newsletter Subscription

| File | Current state | Backend needed |
|------|--------------|----------------|
| `src/components/NewsletterSection.tsx` | Form renders, no submit handler | `POST /api/newsletter` with `{ email }` |

**TODO:** Add `onSubmit` handler calling `api.post(ENDPOINTS.NEWSLETTER_SUBSCRIBE, { email })`. Show success/error toast.

---

### 2.3 Registration

| File | Current state | Backend needed |
|------|--------------|----------------|
| `src/pages/Register.tsx` | CTA links to WhatsApp group | `POST /api/registration` with tier + stage + contact info |

**TODO:** Replace WhatsApp CTA with form submission. Stage selection should be dynamic from API.

---

### 2.4 Checkout / Payment

| File | Current state | Backend needed |
|------|--------------|----------------|
| `src/pages/Checkout.tsx` | Placeholder "Payment coming soon" | Stripe integration via `POST /api/checkout` |

**Flow:** Frontend sends product/variant/price → backend creates Stripe Checkout Session → returns `paymentUrl` → frontend redirects.

**Products requiring payment:**
- Book orders (`OrderBooks.tsx`)
- Home Run registration (`HomeRun.tsx`) — €199
- Tour du Mont Blanc (`TourDuMontBlanc.tsx`) — €999 / €1,499
- Stage registration (`Register.tsx`) — €699 / €999 / €1,299
- Prints (`Prints.tsx`) — TBD pricing

---

### 2.5 Photographers

| File | Current state | Backend needed |
|------|--------------|----------------|
| `src/pages/Photographers.tsx` | 9 placeholder entries | `GET /api/photographers` → `PhotographerResponse[]` |

---

### 2.6 Prints

| File | Current state | Backend needed |
|------|--------------|----------------|
| `src/pages/Prints.tsx` | 9 placeholder entries with `/placeholder.svg` images | `GET /api/prints` → `PrintResponse[]` |

---

### 2.7 Live Counters

| File | Current state | Backend needed |
|------|--------------|----------------|
| `src/lib/distanceCalculator.ts` | Date-based calculation (100km/day during active ranges) | Optional: `GET /api/stats` for real-time distance |
| `src/lib/counterCalculator.ts` | Milestone-based (countries, runners, books) | Optional: same endpoint |

These calculators work without a backend. Replace only if real-time accuracy is needed.

---

## 3. Image Assets

Stage tile images currently reference `/placeholders/stage-NNN.jpg` (no files exist — the tile renders a gradient fallback). To populate:

1. Upload images to a CDN or storage bucket
2. Return image URLs in the `image` field of `StageResponse`
3. The `GalleryTile` component handles loading states and error fallbacks automatically

Photographer and print images use `/placeholder.svg` (file exists in `public/`).

---

## 4. Environment Variables

See `.env.example`:

```
VITE_API_BASE_URL=         # Backend API origin
VITE_STRIPE_PUBLISHABLE_KEY=  # Stripe publishable key (client-safe)
```

---

## 5. Recommended Implementation Order

1. **Stage data API** — unlocks real content across Archive, Route Map, Timeline, Shoreholders
2. **Newsletter** — quick win, single endpoint
3. **Payment (Stripe)** — enables book orders and event registrations
4. **Registration form** — replace WhatsApp CTA
5. **Photographers & Prints** — populate placeholder content
6. **Live counters** — optional, current client-side logic works well

---

## 6. Error Handling

The frontend does NOT currently show error states for API failures (there are no API calls yet). When integrating:

- Add error boundaries around route components
- Show toast notifications for failed form submissions
- Add loading skeletons for data-dependent sections
- The `apiClient.ts` throws structured errors with `{ status, message, body }`

---

*Document updated: 2026-02-22*
