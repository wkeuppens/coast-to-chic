## Scope

Structural and typographic redesign of Follow the Coast. Existing color tokens stay locked — only typography, layout, components, interactions, and copy change. Existing routes preserved; components refactored in place.

## 1. Typography swap (global, color-safe)

Replace the current font assignments without touching color tokens.

- Add IBM Plex Sans (Light 300, Regular 400) and IBM Plex Mono (Regular 400, Medium 500) via `<link>` to Google Fonts in `index.html`.
- In `src/index.css`, repoint the existing `--font-body` to `'IBM Plex Sans'` and `--font-display` to a light editorial serif fallback chain (`'Beausite Classic', 'IBM Plex Sans', serif` — display kept rare). Add a new `--font-mono: 'IBM Plex Mono', ui-monospace, monospace`.
- Add `.font-mono` utility, and a `.text-index` utility (mono, 11–12px, tracked +0.04em) for stage numbers / coordinates / distances / dates.
- Body line-height stays generous. Do not modify any `--background`, `--foreground`, `--primary`, `--accent`, etc.

## 2. New shared components

Built under `src/components/system/`. All accept existing tokens, no new colors.

- `CoastLine` — the persistent hairline. Full-bleed (negative margins to viewport edges). Accepts an array of stage nodes with `{ stageNumber, region, distance, coordinates, slug, active? }`. Horizontal scroll/drag scrubs; nodes snap; click navigates. Renders an SVG line + `NodeMarker` instances.
- `NodeMarker` — circular bullseye (outlined default, filled with `hsl(var(--accent))` only when active). Hover emits to `DataPopover`.
- `IndexBlock` — two-column mono table (label left, value right, thin rule above). Used for all metadata.
- `TideLine` — single full-width 1px rule, generous margin above/below. Section divider.
- `StageData` — composed of `IndexBlock`, renders the standard stage record (stage no, region, distance, date, coordinates).
- `EdgePin` — layout helper that crops oversized type/numbers against the viewport edge (left or right).
- `DataPopover` — mono popover for node hover: stage no, region, distance, coordinates. No rounded corners, no shadow — single hairline border on `hsl(var(--foreground))`.

## 3. Page refactors (preserve routing)

- **Home (`Index.tsx` + `HeroSection`)**: full-bleed documentary photo in the upper viewport. Below it: `CoastLine` spanning full width with marker nodes for all stages. Wordmark pinned top-left with a thin rule extending to the right edge. Remove existing centered hero stack if present.
- **Archive (`AllStages.tsx`)**: rebuild as a designed contents list. Mono tabular rows: `№` · region · distance · date · coordinates. Row hover reveals a thumbnail pinned to the side margin. Filter/sort pinned to a corner in mono. Drop any card grid.
- **Stage detail pages (`Book3`, `Iceland`, `CrossingMadeira`, `TourDuMontBlanc`, `TrailRetreatGirona`, `FollowTheKust`, `EUStages`)**: full-bleed hero → `TideLine` → `StageData` block in mono → vertical gallery with one full-width hero and a mixed grid below. Captions in mono, pinned to right edge. Prev/next stage as cropped oversized numbers at left/right viewport edges (`EdgePin`).
- **Map (`RouteMap`, `RouteMapPage`)**: keep functionality. Restyle Leaflet polyline at same hairline weight; markers become bullseye nodes; hover binds `DataPopover` content.
- **Books (`OrderBooks`, `BookSection`)**: row of spines horizontally; the line continues across gaps between spines to form the unbroken trace. Click opens volume detail with region · stage range · page count · pub date in mono.
- **Footer**: hairline bleeding off both edges; below it monospace metadata — studio name, Brussels coordinates `50.8503°N · 04.3517°E`, copyright year, plain-text social links (no icons).

## 4. Interaction & motion rules

Apply project-wide:
- No carousel autoplay, no parallax, no entrance animations beyond opacity fades (≤300ms).
- `CoastLine` scrub: horizontal wheel / drag / arrow keys. Stages snap to nodes. Hover → popover. Click → route.
- Modals (where they exist) become edge-pinned sheets, no chrome, mono labels.

## 5. Copy pass (light)

Rewrite only headings/intros that currently use marketing language. Tone: observational, short sentences, geographic detail. Remove "epic / incredible / journey-of-a-lifetime" phrasing. No em dashes, no "not X but Y", no emojis. Body content (stage descriptions, book copy) stays as-is unless it violates the rules.

## 6. Final verification

- Grep diff to confirm no `--*` color token, no hex value, no `bg-*`/`text-*` color class was added or changed.
- Visual audit on `/`, `/archive` (AllStages), one stage detail, `/order-books`, footer — confirm hairline bleeds to viewport edge, all numbers render mono, edge-pinned crops visible.
- Build passes.

## Technical notes

```text
src/
  components/system/
    CoastLine.tsx
    NodeMarker.tsx
    IndexBlock.tsx
    TideLine.tsx
    StageData.tsx
    EdgePin.tsx
    DataPopover.tsx
    index.ts
```

- `CoastLine` data source: combine `src/data/stages.ts` + `src/data/icelandStages.ts` (already in repo). Cap initial render to viewport-visible nodes for perf; virtualize via the existing canvas-camera pattern if node count exceeds 200.
- Mono utility: `.text-index { font-family: var(--font-mono); font-size: 0.6875rem; letter-spacing: 0.04em; }` — applied to all numeric/index data, replacing existing `.text-caption` usage where the content is numeric.
- Where a design choice has more than one reasonable implementation (e.g. CoastLine scrub via native scroll vs. transform), leave a `// ALT:` code comment.

## Out of scope

- Backend / Supabase / edge functions.
- Color token changes of any kind.
- Adding new pages or removing routes.
- The SEO/JSON-LD layer added in the previous turn — left intact.
