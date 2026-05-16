// @vitest-environment node
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildSubCompositionHtml } from "./subComposition";

function makeTempProject(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "hf-subcomp-preview-"));
  for (const [rel, content] of Object.entries(files)) {
    const full = join(dir, rel);
    mkdirSync(join(full, ".."), { recursive: true });
    writeFileSync(full, content, "utf-8");
  }
  return dir;
}

describe("buildSubCompositionHtml", () => {
  it("handles full HTML document compositions without nesting <html> in <body>", () => {
    const dir = makeTempProject({
      "index.html": `<!doctype html>
<html><head><title>Host</title></head><body></body></html>`,
      "compositions/map-block.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      .map { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      #root { position: relative; width: 1920px; height: 1080px; overflow: hidden; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="map-block" data-width="1920" data-height="1080">
      <img class="map" src="assets/map.png" alt="" />
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["map-block"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>`,
    });

    const html = buildSubCompositionHtml(
      dir,
      "compositions/map-block.html",
      "/api/runtime.js",
      "/api/projects/demo/preview/",
    );

    expect(html).not.toBeNull();
    // Must not nest a full HTML document inside <body>
    const bodyStart = html!.indexOf("<body>");
    const afterBody = html!.slice(bodyStart);
    expect(afterBody).not.toContain("<html");
    expect(afterBody).not.toContain("<head>");
    // Composition styles must be in <head>, not lost
    expect(html).toContain(".map {");
    expect(html).toContain("#root {");
    // Image src preserved (no ../ rewrite needed for bare relative paths)
    expect(html).toContain('src="assets/map.png"');
    // Base tag for asset resolution
    expect(html).toContain('<base href="/api/projects/demo/preview/">');
    // GSAP from the composition's own <head> must be preserved
    expect(html).toContain("gsap@3.14.2");
    // Body script content preserved
    expect(html).toContain('__timelines["map-block"]');
  });

  it("rewrites sub-composition asset paths against the project root preview base", () => {
    const dir = makeTempProject({
      "index.html": `<!doctype html>
<html><head><title>Test</title></head><body></body></html>`,
      "compositions/hero.html": `<template id="hero-template">
  <div data-composition-id="hero" data-width="1920" data-height="1080">
    <img src="../logo.png" alt="Logo" />
    <div style="background-image: url('../poster.png')"></div>
    <style>
      @font-face {
        font-family: "Brand Sans";
        src: url("../fonts/brand.woff2") format("woff2");
      }
    </style>
  </div>
</template>`,
    });

    const html = buildSubCompositionHtml(
      dir,
      "compositions/hero.html",
      "/api/runtime.js",
      "/api/projects/demo/preview/",
    );

    expect(html).toContain('<base href="/api/projects/demo/preview/">');
    expect(html).toContain('src="logo.png"');
    expect(html).toContain("background-image: url('poster.png')");
    expect(html).toContain('url("fonts/brand.woff2")');
    expect(html).not.toContain('src="../logo.png"');
    expect(html).not.toContain("url('../poster.png')");
    expect(html).not.toContain('url("../fonts/brand.woff2")');
  });
});
