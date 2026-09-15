# Follow the Coast × Sierra House — animated lockup

A stacked collaboration lockup that animates on a **fully transparent background**, so it can be
laid over photography, video, a coloured panel or nothing at all. Supplied in **black**, **white**
and the **Sierra House off-white** (`#F4EDE6`).

## The animation

| from | to | what happens |
| --- | --- | --- |
| 0.00s | 1.29s | the five Follow the Coast waves draw in left to right, each starting 85 ms after the one above |
| 1.12s | 1.58s | the ✕ draws outward from its own centre, one arm then the other, settling on a small overshoot |
| 1.50s | 3.87s | the Sierra House checkerboard lands **one square at a time** — 99 squares in a scattered order. The pyramid stays completely transparent, so the mountain reads as a hole in the checkerboard |
| 3.98s | 4.84s | once every square is in place, the pyramid **fills from its base upwards**, like a tide coming in |
| 4.84s | 6.00s | held |

The looping builds add a 0.5 s fade to nothing at the end, so they restart cleanly from an empty frame.

## Which file do I want?

| Folder | Use it for | Notes |
| --- | --- | --- |
| `dist/svg/` | web, decks, anything that scales | Self-contained SMIL animation, no scripts or external files. Works in an `<img>`, `<object>`, or a CSS background. Resolution-independent and ~80 KB. |
| `dist/webm/` | web video, transparent overlay in a browser | VP9 with an alpha channel. Chrome, Edge, Firefox, Opera and Safari 16+. |
| `dist/mov/` | Premiere, After Effects, Final Cut, Resolve | QuickTime Animation (RLE) — **lossless**, straight (un-premultiplied) alpha. Chosen over ProRes 4444 because it is about 5× smaller for flat vector artwork with no quality cost. |
| `dist/apng/` | Slack, chat, README files, anywhere a "GIF" is asked for but real transparency is wanted | Animated PNG, full 8-bit alpha, no fringing. |
| `dist/preview/` | sending someone a quick look | GIF and MP4, **flattened onto a background on purpose** — GIF alpha is 1-bit and would chew the antialiased edges. Not overlay assets. |

`tight` is cropped close to the lockup — use it for overlays. `square` is padded to a square frame —
use it for social posts and anywhere a 1:1 canvas is expected.

Open `preview.html` to see every file over transparent, paper, coast blue, black and a photograph.

### Need something else?

```bash
cd src
node render.mjs --out ../.frames --size 2160 --fps 60 --opts '{"colour":"#000000","fit":"tight"}'   # PNG sequence
node build.mjs --size 2160                                                                          # everything, larger
```
ProRes 4444 instead of RLE, if a workflow insists on it:
```bash
ffmpeg -framerate 60 -i ../.frames/f%05d.png -c:v prores_ks -profile:v 4444 \
       -pix_fmt yuva444p10le -vendor apl0 -alpha_bits 16 out.mov
```

## How the two marks were rebuilt

Neither mark is a bitmap here — both are redrawn as exact vector geometry in `src/geometry.js`, which
is what keeps the animation crisp at any size.

**Sierra House emblem** was decoded from `sierrahouse-emblem-rgb-black.ai`. It is a 29 × 15 grid: a
cell carries ink when `(row + col)` is even, or when it falls inside the stepped pyramid, which spans
columns `14 ± row` from row 1 down. Rebuilt against the original artwork it scores **IoU 0.994**, the
remainder being antialiasing along cell edges.

Because of how that staircase is drawn, only one checker cell — the one directly above the apex —
ever shares an edge with the pyramid. That is why the checkerboard can animate in independently of
the pyramid without leaving seams.

**Follow the Coast wave mark** was fitted to `src/assets/waves-logo.png`, the only version available.
It is five strokes, each 2.5 periods of a cubic-bézier wave whose two control points meet at the
midpoint of every half period, starting on a crest and ending on a trough. Parameters were solved by
optimising the rendered result directly against the original PNG: **IoU 0.989**, mean alpha error
0.42/255, and not one pixel off by more than 100/255.

> If a vector master of the Follow the Coast mark exists, drop its numbers into `WAVE` in
> `src/geometry.js` and everything downstream picks them up.

## Composition

Both marks sit on one shared measure — the wave mark is drawn to the emblem's width, plus 1% optical
overshoot, because the wave's edge is five butt-cut terminals with air between them and reads
slightly narrow against the emblem's hard full-bleed edge. At that width the wave stroke (36.4 units)
and the checker module (34.5 units) land on nearly the same weight, which is what holds the stack
together as one object.

The ✕ is deliberately small but drawn at 0.68 of the wave stroke; at its first weight it disappeared
below about 80 px. The gap below the ✕ is 1.2× the gap above it: the emblem's top edge is dead flat
and crowds the ✕, while the wave's underside is scalloped and its optical edge sits higher than its
bounding box.

All of this lives in `src/lockup.js` and is parameterised — nothing is hard-coded into the exports.

## Verification

Every export is checked against the live scene rather than eyeballed:

| check | result |
| --- | --- |
| shipped WebM decoded back and compared to the source scene | IoU 0.992–1.000, mean alpha error ≤ 0.28/255 |
| SMIL export vs. the frame renderer | mean alpha error 0.015/255 |
| first frame | completely empty — 0 pixels of ink |
| looping build, last frame | completely empty, so it restarts seamlessly |
| alpha type | straight, not premultiplied — partly-transparent edge pixels still carry the ink colour |
| ink colour after encoding | black `#000000` and white `#FFFFFF` survive exactly |
| the brief | at 3.87 s every checker square is in and the pyramid is still 99% transparent; it only fills afterwards |

## Known limits

- **Minimum size.** Below roughly 60 px of lockup height the 29 × 15 checkerboard silvers into flat
  grey and takes the pyramid with it. A reduction cut (fewer wave rows, coarser checker) would be
  needed for favicon or garment-label sizes.
- **Clear space.** Keep at least one checker module — 3.4% of the lockup's width — clear on all four
  sides. The emblem is full-bleed, so anything tighter collides with its silhouette.
- **Safari and transparent video.** WebM alpha needs Safari 16+. For older Safari, use the SVG.
- **Reading WebM alpha with ffmpeg.** VP9 keeps its alpha in a side channel, so ffmpeg's native decoder
  silently drops it and `ffprobe` reports `yuv420p`. Ask for the right decoder:
  `ffmpeg -c:v libvpx-vp9 -i file.webm -pix_fmt rgba out%04d.png`. Browsers and NLEs handle it correctly.
- **The off-white in WebM.** VP9's 4:2:0 round trip lands `#F4EDE6` on `#F2ECE5` — about 1/100 of a step,
  invisible in use. Black and white are unaffected. Use the SVG or a MOV if the value must be exact.
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
  frame.html     the page render.mjs screenshots
dist/            generated — do not hand-edit
preview.html     look at everything over five backgrounds
```

`timeline.js` is the single source of truth for motion: the live scene, the PNG frames and the SMIL
export all read from it, so they cannot drift apart. The SMIL export is verified against the frame
renderer to a mean alpha error of 0.017/255.
