# Section 12 — Combined Vignettes

Multi-technique scenes where 3-5+ techniques run simultaneously. These are the "real beat" demonstrations — the kind of dense, polished frame a finished video needs.

**When to study this section:** when you want to see how multiple techniques layer in one composition. Especially useful as a stress test for "what does a fully-realized HyperFrames beat actually look like?"

---

## Scenes

| Scene | Duration | Technique | Why study |
|-------|----------|-----------|-----------|
| [`scene-01-techniques-grid/`](scene-01-techniques-grid/) | 4s | 6×4 grid of 24 cells, each running a different visual technique: clock, concentric rings, diagonal stripes, 3D cube, dot grid, QR code, stock chart line draw, liquid blob morph (SVG), particle vortex (feature cell with amber glow), glowing orb, spirograph, DNA helix, neural network with pulsing nodes, radial burst rays, kinetic 3D MOTION word, glitch SYSTEM→RENDER text with RGB chromatic aberration, sine waves (SVG), code editor mockup, loading spinners, binary rain, maze pattern, audio bars, neon globe, weather card. | The single highest-density technique reference in the library. If you're stuck on "what could go in this beat," browse this grid — there are 24 starting points. |
| [`scene-02-binary-rain-boot/`](scene-02-binary-rain-boot/) | 7.5s | Matrix-style canvas binary rain in the background + centered terminal type-on boot sequence in the foreground. Boot output progressively reveals (`Initializing renderer... 100%` / `Mounting GPU... OK` / `Loading composition... ready`), then a final cursor pulse. | Demonstrates canvas-behind + DOM-foreground layered composition. The terminal text is real DOM (selectable, accessible) while the rain is canvas — keeps text crisp at any resolution. |
| [`scene-03-product-launch-beat/`](scene-03-product-launch-beat/) | 8s | **6 techniques in one beat:** stroke-draw logo (SVG path), kinetic-center-build headline ("INTRODUCING / ATLAS"), 0→47 counter ("47 teams shipping"), hand-drawn circle marker around "ATLAS", radial particle burst at logo lock-in, breathing pulse on the whole composition during the hold. | **The flagship "what does a polished launch beat look like" reference.** Use as the seed for mode=recombine when a beat needs to combine logo reveal + headline + stat + emphasis all in one screen. Don't ship as-is — customize the wordmark, counter target, and circled word per brand. |

---

## QC log

- scene-01: **PASS** — 8 frames; frame 1 black startup, frames 2-8 fully populated with all 24 cells animating. Each cell in distinctly different states across frames (cube rotation, MOTION word kinetic, SYSTEM→RENDER glitch swap, vortex collapse, spirograph rotation, weather temperature counter climbing, audio bars dynamic). 15+ distinct techniques. Lifted from `claude-design-hyperframes-video/compositions/grid.html` (1621 lines); rebranded CLAUDE→MOTION and DESIGN→RENDER. All 24 cells render from divs/SVG/canvas — zero external image dependencies.
- scene-02: **PASS** — canvas rain layer (z-index 0) + terminal type-on layer (z-index 1) compose cleanly; both seekable. Boot sequence narration-syncable if needed (per-line `tl.set(line, { textContent: "..." })` at distinct timestamps).
- scene-03: **PASS** — 380 lines, 0 errors / 1 warning (file-size). 6-technique recombine demo. Frame samples show: logo path drawing → headline center-locking → counter at 0 → counter at ~28 → counter at 47 with circle marker drawn → particle burst at lock-in. Built from scratch (not lifted), uses patterns from scene-01-soft-blur-in (headline build), scene-02-hand-drawn-circle (marker), scene-03-counter-million-showcase (counter), scene-08-svg-and-path (stroke-draw).
