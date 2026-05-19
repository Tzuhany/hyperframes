# Section 03 — Easing Variety

CSS animation and easing variety reference. The 7 production easings live in [`_shared/easing-glossary.md`](../_shared/easing-glossary.md); this section's scenes are the visual proof of what each easing FEELS like.

**When to study this section:** any time you find yourself defaulting to `power2.out` on every tween. Open these scenes to see what 17+ pure-CSS animations + GSAP easings look like side-by-side.

---

## Scenes

| Scene | Duration | Technique | Why study |
|-------|----------|-----------|-----------|
| [`scene-01-css-animation-grid/`](scene-01-css-animation-grid/) | 3.5s | 6×3 grid of pure-CSS animations (spinners, pulses, morphs, waves, orbits, gradient cycles, flip cards, bars, bounces) on warm cream paper background. Each cell runs independently. | Demonstrates what CSS alone can do without GSAP. Shows 17 distinct motion types in one frame so you can pattern-match easing to intent. |

---

## QC log

- scene-01: **PASS** — 6 frames; cells in distinctly different states across frames (morph cycles red → green → blue → orange → teal, flip card flipping, orbit dots in 4 angular configurations, pulse rings expanding, scale grid mid-ripple). Extended source's 1.71s timeline to 3.5s so snapshot intervals land on visibly different motion states. Lifted from `launch-video/compositions/flex-css.html`.
