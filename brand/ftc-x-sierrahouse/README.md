# Follow the Coast × Sierra House — animated lockup

A stacked collaboration lockup that animates on a **fully transparent background**, so it can be laid
over photography, video, a coloured panel or nothing at all. Supplied in **black**, **white** and the
**Sierra House off-white** (`#F4EDE6`).

Open `preview.html` to see every delivered file over a transparency grid, paper, black and a
photograph. Nothing has a background baked in — the swatches change what sits *behind* the artwork.

## The animation

7.00 s, 60 fps. Times are the same in every format.

| from | to | what happens |
| --- | --- | --- |
| 0.00s | 1.48s | the five Follow the Coast waves draw in left to right, each starting 95 ms after the one above |
| 1.30s | 1.94s | one leg of the ✕ draws in, swinging into place from an angle |
| 1.56s | 2.20s | the second leg draws across it, swinging in from the other side |
| 1.98s | 4.72s | the Sierra House checkerboard lands **one square at a time** — 98 squares. The pyramid stays completely transparent, so the mountain reads as a hole in the checkerboard |
| 4.88s | 5.93s | once every square is in place, the pyramid **fills from its base upwards**, like a tide coming in. Its single-cell tip is the last thing to arrive |
| 5.93s | 7.00s | held on the finished lockup |

The acts overlap rather than queueing: the ✕ starts while the last wave is still
drawing, and the first squares land while the ✕ is still settling. Nothing in the
piece uses an overshoot or a back-ease — every move is an ease-out or a sine-based
S, which is what keeps it feeling unhurried rather than snappy.

The fill sweeps the pyramid's **area**, not its height. A pyramid's mass is in its base — the
full-width bottom row alone is 13% of its ink — so easing the height dumped that in a single frame
and then crawled up the tip. Inverting a triangle's area spreads it evenly, and the ease is blended
with a linear ramp so it moves on the first frame rather than holding.

The squares are not spread evenly. At a constant rate all 98 land about one frame apart and nothing
reads "checker by checker" at all, so the first few are opened out to roughly 40 ms, the middle
flurries, and the last few settle again — you see the triangular hole close.

The `-loop` builds add a 0.6 s fade to nothing after the hold (7.60 s total), so they restart from an
empty frame with no jump.

## Which file do I want?

| Folder | Use it for | Notes |
| --- | --- | --- |
| `dist/svg/` | web, decks, anything that scales | Self-contained SMIL animation, no scripts or external files. Works in an `<img>`, `<object>` or a CSS background. Resolution-independent, colour-exact, ~80 KB. **The safest default.** |
| `dist/webm/` | transparent video overlay in a browser | VP9 with an alpha channel, 60 fps. **Chrome, Edge, Firefox and Opera — not Safari**, see below. |
| `dist/mov/` | Premiere, After Effects, Final Cut, Resolve | QuickTime Animation (RLE): **lossless**, bit-exact colour, straight (un-premultiplied) alpha, 60 fps. About 5× smaller than ProRes 4444 for flat vector artwork with no quality cost. |
| `dist/apng/` | Slack, chat, a README — anywhere a "GIF" is wanted but with real transparency | Animated PNG, full 8-bit alpha, no fringing. Cut from the looping timeline so it repeats cleanly. |
| `dist/preview/` | sending someone a quick look | GIF and MP4, **flattened onto a transparency checkerboard on purpose** — GIF alpha is 1-bit and would chew the antialiased edges, and a video file has to put *something* behind the artwork. The checkerboard is that something, so nothing implies a colour the real files do not have. Not overlay assets. |

Two crops: **`tight`** (892 × 1440) is cropped close to the lockup — use it for overlays.
**`square`** (1440 × 1440) is padded to 1:1 for social and anywhere a square canvas is expected.

MOV and APNG ship for the tight crop in black and white only. That is not an oversight: the background
is transparent, so padding the tight crop out to 1:1 — or any other aspect — in an editor costs
nothing and loses nothing. Everything else is one command away, below.

## Regenerating

```bash
cd brand/ftc-x-sierrahouse
npm install          # Playwright, which rasterises the scene
npm run build        # everything in dist/, at 1440px
npm run verify -- --video   # re-run every check in the table below
```

```bash
node src/build.mjs --size 2160                                   # larger
node src/render.mjs --out ../.frames --size 2160 --fps 60 \
     --opts '{"colour":"#000000","fit":"square"}'                # PNG sequence
```

ProRes 4444 instead of RLE, if a workflow insists on it:

```bash
ffmpeg -framerate 60 -i ../.frames/f%05d.png -c:v prores_ks -profile:v 4444 \
       -pix_fmt yuva444p10le -vendor apl0 -alpha_bits 16 out.mov
```

Proportions, gaps, the ✕, the order the squares land in and every timing are parameters in
`src/lockup.js` and `src/timeline.js` — nothing is baked into the exports.

## How the two marks were rebuilt

Neither mark is a bitmap here. Both are redrawn as exact vector geometry in `src/geometry.js`, which
is what keeps the animation crisp at any size.

**The Sierra House emblem** was decoded from the supplied `sierrahouse-emblem-rgb-black.ai`. It is a
29 × 15 grid: a cell carries ink when `(row + col)` is even, or when it falls inside the stepped
pyramid, which spans columns `14 ± row` from the single-cell tip at row 0 down to the full-width base.
Rebuilt, it matches the original artwork at **IoU 0.994**, the remainder being antialiasing along cell
edges.

That staircase means **no checker square ever shares an edge with the pyramid** — the cells beside and
above each step always fall on the opposite parity. Which is why the checkerboard can animate
independently of the pyramid without leaving seams where they meet. `npm run verify` checks this
exhaustively.

**The Follow the Coast wave mark** was fitted to `src/assets/waves-logo.png` **in the repository root**
(not this folder), the only version available. It is five strokes, each 2.5 periods of a cubic-bézier
wave whose two control points meet at the midpoint of every half period, starting on a crest and
ending on a trough. The parameters were solved by optimising the rendered result directly against the
original pixels: **IoU 0.989**, mean alpha error 0.42/255, and not one pixel off by more than 100/255.

> If a vector master of the Follow the Coast mark turns up, put its numbers into `WAVE` in
> `src/geometry.js` and every export picks them up.

## Composition

Both marks sit on one shared measure: the wave mark is drawn to the emblem's width plus 1% optical
overshoot, because the wave's edge is five butt-cut terminals with air between them and reads slightly
narrow against the emblem's hard full-bleed edge. At that width the wave stroke (36.4 units) and the
checker module (34.5 units) land on nearly the same weight, which is what holds the stack together as
one object rather than two logos near each other.

The ✕ is deliberately small but drawn at 0.68 of the wave stroke — at its first weight it disappeared
below about 80 px, taking the one element that makes this a collaboration lockup with it. It sits in
135 units of air above and 155 below, on an emblem 1000 units wide. The gap below is the larger of the
two: the emblem's top edge is dead flat and crowds the ✕, while the wave's underside is scalloped and
its optical edge sits above its bounding box.

## Verification

`npm run verify -- --video` re-runs all of this and exits non-zero on any failure.

| check | result |
| --- | --- |
| no checker square shares an edge with the pyramid | 0 shared edges, checked across the whole grid |
| SMIL export vs. the frame renderer | mean alpha error 0.0098/255, worst IoU 0.986 |
| first frame | completely empty — 0 pixels of ink |
| looping build, last frame | completely empty, so it restarts seamlessly |
| alpha type, every colourway | straight, not premultiplied — partly-transparent edge pixels still carry the ink colour |
| black through WebM | 100% of opaque pixels exactly `#000000` |
| white through WebM | 98.8% exact; mean channel error 0.03/255, worst 10/255 |
| off-white through WebM | mean channel error 2.12/255, worst 12/255 — never exact, see below |
| black and white through MOV | every opaque pixel bit-exact — the codec is lossless |
| the brief | at 4.80 s every checker square is in and the pyramid is still completely transparent; it only fills afterwards |
| the fill reads as a fill | no single frame delivers more than 3% of the pyramid's area |

The SVG is exact for all three colourways, being vector.

## Known limits

- **Safari does not do transparent WebM.** Safari plays VP9 but ignores the alpha channel, so a WebM
  overlay lands on an opaque black rectangle there. Safari's transparent-video path is HEVC with
  alpha, which has to be encoded on a Mac. On the web, use the animated SVG: transparent everywhere,
  scales freely, and smaller than the video.
- **Reading WebM alpha with ffmpeg.** VP9 keeps its alpha in a side channel, so ffmpeg's native
  decoder silently drops it and `ffprobe` reports `yuv420p`. Ask for the right decoder:
  `ffmpeg -c:v libvpx-vp9 -i file.webm -pix_fmt rgba out%04d.png`. Browsers and NLEs are fine.
- **Colour through VP9.** The 4:2:0 round trip is exact for black, within one step for white, and
  moves the off-white about two steps — invisible in use, but if a value has to be exact, use the SVG
  or the MOV.
- **Minimum size.** Below roughly 60 px of lockup height the 29 × 15 checkerboard silvers into flat
  grey and takes the pyramid with it. A reduction cut — fewer wave rows, a coarser checker — would be
  needed for favicon or garment-label sizes.
- **Clear space.** Keep at least one checker module — 3.4% of the lockup's width — clear on all four
  sides. The emblem is full-bleed, so anything tighter collides with its silhouette.
- **GIF.** 1-bit alpha only, which is why the GIFs here are matted rather than transparent.

## Layout of this folder

```
src/
  geometry.js    the two marks as exact vector geometry
  lockup.js      composition: proportions, gaps, canvas framing
  timeline.js    the schedule and easing — one pure function of time
  scene.js       live SVG, driven by timeline.js
  build-svg.mjs  self-contained SMIL export
  render.mjs     transparent PNG frames via Chromium
  build.mjs      builds everything in dist/
  verify.mjs     checks the exports against the live scene
  frame.html     the page render.mjs screenshots
dist/            generated — do not hand-edit
preview.html     look at everything over five backgrounds
```

`timeline.js` is the single source of truth for motion. It exports a `when` schedule that the live
scene, the frame renderer and the SMIL export all read, so they cannot drift — which they did, once,
when two of them worked out the timings separately. `verify.mjs` exists to catch that happening again.
