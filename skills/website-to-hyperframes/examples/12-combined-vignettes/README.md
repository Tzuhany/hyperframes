# Section 12 — Combined Vignettes

Multi-technique scenes where 3-5+ techniques run simultaneously. These are the "real beat" demonstrations — the kind of dense, polished frame a finished video needs.

**When to study this section:** when you want to see how multiple techniques layer in one composition. Especially useful as a stress test for "what does a fully-realized HyperFrames beat actually look like?"

---

## Scenes

| Scene | Duration | Technique | Why study |
|-------|----------|-----------|-----------|
| [`scene-01-techniques-grid/`](scene-01-techniques-grid/) | 4s | 6×4 grid of 24 cells, each running a different visual technique: clock, concentric rings, diagonal stripes, 3D cube, dot grid, QR code, stock chart line draw, liquid blob morph (SVG), particle vortex (feature cell with amber glow), glowing orb, spirograph, DNA helix, neural network with pulsing nodes, radial burst rays, kinetic 3D MOTION word, glitch SYSTEM→RENDER text with RGB chromatic aberration, sine waves (SVG), code editor mockup, loading spinners, binary rain, maze pattern, audio bars, neon globe, weather card. | The single highest-density technique reference in the library. If you're stuck on "what could go in this beat," browse this grid — there are 24 starting points. |

---

## QC log

- scene-01: **PASS** — 8 frames; frame 1 black startup, frames 2-8 fully populated with all 24 cells animating. Each cell in distinctly different states across frames (cube rotation, MOTION word kinetic, SYSTEM→RENDER glitch swap, vortex collapse, spirograph rotation, weather temperature counter climbing, audio bars dynamic). 15+ distinct techniques. Lifted from `claude-design-hyperframes-video/compositions/grid.html` (1621 lines); rebranded CLAUDE→MOTION and DESIGN→RENDER. All 24 cells render from divs/SVG/canvas — zero external image dependencies.
