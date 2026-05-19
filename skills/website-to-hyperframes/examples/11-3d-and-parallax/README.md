# Section 11 — 3D and Parallax

CSS 3D transforms (`transform-style: preserve-3d`, `perspective`, rotateX/Y/Z), parallax depth layers, card-stack fan-out, Three.js scenes. Adds dimensionality to compositions without leaving the browser.

**When to study this section:** any beat where flat 2D feels insufficient — premium feel, product showcases, depth metaphors.

---

## Scenes

| Scene | Duration | Technique | Why study |
|-------|----------|-----------|-----------|
| [`scene-01-css-3d-torus/`](scene-01-css-3d-torus/) | 1.2s | 16-segment orbital ring of pastel rounded squares (rose, sage, taupe, mauve) rotating through 3D space. Uses `transform-style: preserve-3d` + `perspective`. Ground shadow follows the rotation. Studio-lit aesthetic on warm cream backdrop. | The pattern for CSS-only 3D objects. No Three.js library required — pure CSS transforms achieve the depth effect. Demonstrates how rotation + perspective + transformY combine. |

---

## QC log

- scene-01: **PASS** — 6 frames; ring tilts and rotates around Y axis. Frame 1 shows 30° Y + 25° X initial tilt; mid-frames show side-on view; final frame shows ~310° rotation (inverse of frame 1). Ground shadow visible. Lifted from `launch-video/compositions/flex-threejs.html` (despite the name, it's pure CSS 3D, not Three.js library).
