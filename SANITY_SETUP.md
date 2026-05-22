# Follow The Coast — Sanity CMS Setup

Everything founders need to edit content without touching code.

---

## What this gives you

| Content | Editable in Sanity |
|---|---|
| All 168 stages (status, photo, description, date) | ✓ |
| Shoreholder runner profiles | ✓ |
| Books (pricing, cover images, descriptions) | ✓ |
| Events / side routes | ✓ |
| Prints catalog | ✓ |
| Photographers | ✓ |
| Hero text, pull quotes, partner list | ✓ |

---

## Part 1 — Create the Sanity project

### 1.1 Install the Sanity CLI

```bash
npm install -g sanity@latest
```

### 1.2 Create a new project at sanity.io

Go to https://sanity.io/manage → New Project.

- Name: `follow-the-coast`
- Dataset: `production`
- Note your **Project ID** — you'll need it in step 1.4.

### 1.3 Set up the Sanity Studio

Copy the `sanity-studio/` folder from this repo into a new directory alongside the main project:

```
/your-workspace/
  coast-to-chic/          ← the React frontend (this repo)
  ftc-sanity-studio/      ← copy sanity-studio/ here
```

Inside `ftc-sanity-studio/`, install dependencies:

```bash
cd ftc-sanity-studio
npm install sanity @sanity/vision
```

### 1.4 Set your project ID

In `ftc-sanity-studio/sanity.config.ts`, replace `YOUR_PROJECT_ID` with your actual project ID:

```ts
const projectId = 'abc123xyz'  // ← your ID from sanity.io/manage
```

Or create a `.env` file in `ftc-sanity-studio/`:

```
SANITY_STUDIO_PROJECT_ID=abc123xyz
SANITY_STUDIO_DATASET=production
```

### 1.5 Start the Studio

```bash
npm run dev
# → http://localhost:3333
```

You'll see the editing interface. Deploy it so founders can access it from anywhere:

```bash
npx sanity deploy
# Choose a studio hostname, e.g. ftc-studio.sanity.studio
```

---

## Part 2 — Connect the React frontend

### 2.1 Install Sanity client packages

In the `coast-to-chic/` React project:

```bash
bun add @sanity/client @sanity/image-url
```

### 2.2 Add environment variables

Create or update `.env` in `coast-to-chic/`:

```
VITE_SANITY_PROJECT_ID=abc123xyz
VITE_SANITY_DATASET=production
```

For a read token (needed only if you want to preview unpublished drafts):
1. Go to sanity.io/manage → your project → API → Tokens
2. Create a token with **Viewer** permissions
3. Add to `.env`:
```
VITE_SANITY_TOKEN=your_token_here
```

### 2.3 Files already added to this repo

| File | Purpose |
|---|---|
| `src/lib/sanityClient.ts` | Configured Sanity client + image URL builder |
| `src/lib/sanityQueries.ts` | All GROQ queries — one per content type |
| `src/hooks/useSanityData.ts` | React hooks: `useStages()`, `useEvents()`, etc. |

### 2.4 Replace static data with Sanity hooks

#### Stages (Archive canvas)

In `src/pages/Gallery.tsx`, replace the static `STAGES` import:

```tsx
// Before
import { STAGES } from '@/data/stages'

// After
import { useStageTiles } from '@/hooks/useSanityData'

// Inside the component:
const { data: stages, loading } = useStageTiles()
if (loading || !stages) return null
```

#### Events Section

In `src/components/EventsSection.tsx`, replace the hardcoded `events` array:

```tsx
// Before
const events = [ { id: 'homerun', ... }, ... ]

// After
import { useEvents } from '@/hooks/useSanityData'

export const EventsSection = () => {
  const { data: events, loading } = useEvents()
  if (loading || !events) return null
  // rest of component unchanged — use event.imageUrl instead of imported image
}
```

#### Partners Section

In `src/components/PartnersSection.tsx`:

```tsx
import { useSiteSettings } from '@/hooks/useSanityData'

export const PartnersSection = () => {
  const { data: settings } = useSiteSettings()
  const partners = settings?.partners ?? []
  // render partners list
}
```

#### Pull Quotes

In `src/pages/Index.tsx`:

```tsx
import { useSiteSettings } from '@/hooks/useSanityData'

const { data: settings } = useSiteSettings()

<PullQuote text={settings?.pullQuote1 ?? 'Sea on the right. Always south.'} />
```

---

## Part 3 — Founder's guide to editing content

### Accessing the Studio

Go to: `https://ftc-studio.sanity.studio` (or wherever you deployed it)

Log in with your Sanity account. Anyone on the project team can be added as an editor at sanity.io/manage → Members.

### Updating a stage

1. Click **Stages** in the left sidebar
2. Find the stage by number (sorted by stage number)
3. Update: Status, Photo, Description, Run Date, Shoreholder reference
4. Click **Publish** — changes go live within seconds

### Marking a stage as completed

1. Open the stage document
2. Change **Status** from `Available` to `Completed`
3. Add the **Run Date**
4. Link the **Shoreholder** (runner) — create their profile first under Shoreholders
5. Upload the **Stage Photo**
6. Publish

### Adding a new shoreholder (runner)

1. Click **Shoreholders** → **Create**
2. Fill in: Name, Nationality, Bio, Photo, Instagram
3. Publish
4. Go back to the stage and reference this shoreholder

### Updating book pricing or description

1. Click **Books** → select the book
2. Update Price, Description, Cover Image
3. Publish — pricing updates reflect immediately on the site

### Editing the hero text or pull quotes

1. Click **Site Settings** (top of sidebar, single document)
2. Update any text fields
3. Publish

---

## Part 4 — Image handling

All images uploaded to Sanity are automatically:
- Delivered via Sanity's global CDN
- Resized on-the-fly (the `urlFor().width(800)` calls in `sanityQueries.ts`)
- Served in WebP format where supported

No manual image optimization needed.

---

## Part 5 — Deploying

### Frontend (Lovable / Netlify / Vercel)

Add the environment variables to your hosting platform:

```
VITE_SANITY_PROJECT_ID=abc123xyz
VITE_SANITY_DATASET=production
```

That's it. The React app will fetch from Sanity on every page load.

### CORS configuration

Allow the frontend domain to query Sanity:
1. sanity.io/manage → your project → API → CORS Origins
2. Add your production domain: `https://followthecoast.com`
3. Add your dev domain: `http://localhost:8080`

---

## Summary — who does what

| Task | Who | Where |
|---|---|---|
| Update stage status / photo | Founders | Sanity Studio |
| Add new shoreholder profile | Founders | Sanity Studio |
| Change book pricing | Founders | Sanity Studio |
| Update event dates | Founders | Sanity Studio |
| Edit pull quotes / hero text | Founders | Sanity Studio |
| Add new page or component | Developer | VS Code / GitHub |
| Change layout or animations | Developer | VS Code / GitHub |
| Stripe / checkout changes | Developer | VS Code / GitHub |
