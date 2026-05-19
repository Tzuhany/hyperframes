# Section 08 — SVG and Path

SVG-driven compositions: stroke-dasharray draw-on, MotionPath, shape morph, particle-field SVG, multi-path orchestration. SVG is HyperFrames' best vector format for crisp infinite-zoom visuals — these scenes show what's possible.

**When to study this section:** any beat with a logo reveal, illustrative diagram, line drawing, or icon system. Also when you need crisp vector motion that scales to 4K.

---

## Scenes

| Scene | Duration | Technique | Why study |
|-------|----------|-----------|-----------|
| [`scene-01-vinyl-record/`](scene-01-vinyl-record/) | 3s | SVG vinyl record with 7 concentric groove circles, orange label, spindle hole, shine ellipse + tonearm pivot/shaft/headshell/cartridge/stylus stack. Record spins, tonearm descends into play position. Warm orange radial-gradient stage. | Multi-layer SVG composition with rotation + cohesive object animation. Demonstrates how `transform-origin` + GSAP rotation creates a believable physical object. |

---

## QC log

- scene-01: **PASS** — 6 frames; empty stage → record + tonearm enter back.out → continuous spin (~360° over 3s) → tonearm holds in play position. SVG concentric grooves visible; orange "SIDE A / 33 RPM" label rotates with the record. Lifted from `launch-video/compositions/flex-music.html`; duration extended from 0.58s to 3s so the spin is visibly continuous across snapshot intervals.
