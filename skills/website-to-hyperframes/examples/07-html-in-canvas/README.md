# Section 07 — HTML in Canvas

Compositions that draw to `<canvas>` — WebGL fragment shaders, Canvas 2D procedural art, HTML-in-canvas VFX patterns. The category that makes HyperFrames distinct from a slideshow tool.

**When to study this section:** any beat where you want generative texture, organic motion that CSS can't do, or cinematic VFX over composed HTML.

---

## Scenes

| Scene | Duration | Technique | Why study |
|-------|----------|-----------|-----------|
| [`scene-01-webgl-shader/`](scene-01-webgl-shader/) | 1.2s | WebGL fragment shader with domain-warp FBM noise + cosine palette. Canvas 2D fallback (animated multi-stop radial + linear iridescent sweep) for headless / no-WebGL contexts. | The pattern for shader-based generative art with a graceful fallback. Both branches present so the scene renders even when WebGL isn't available. |

---

## QC log

- scene-01: **PASS** — 6 frames; vibrant iridescent domain-warp pattern with magenta/cyan/lime/orange swirls. WebGL branch fired in snapshot run (Canvas 2D fallback ready if needed). Lifted from `launch-video/compositions/flex-shader.html`; Canvas 2D fallback upgraded from static gradient to animated so it's a good pattern to copy.
