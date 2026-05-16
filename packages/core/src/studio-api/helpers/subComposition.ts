import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseHTML } from "linkedom";
import {
  rewriteAssetPaths,
  rewriteCssAssetUrls,
  rewriteInlineStyleAssetUrls,
} from "../../compiler/rewriteSubCompPaths.js";

/**
 * Detect whether `html` is a full document (has `<html>`, `<head>`, or
 * `<!doctype`), as opposed to a `<template>`-wrapped fragment.
 */
function isFullHtmlDocument(html: string): boolean {
  return /<!doctype\s|<html[\s>]/i.test(html);
}

/**
 * Parse a full HTML document and extract its head styles/scripts and body
 * content separately, so they can be reassembled into a clean standalone
 * page without nesting `<html>` inside `<body>`.
 */
function extractFullDocumentParts(
  rawHtml: string,
  compPath: string,
): { headStyles: string; headScripts: string; bodyContent: string } {
  const { document: doc } = parseHTML(rawHtml);

  const rewriteTargets = [doc.head, doc.body].filter(Boolean);
  for (const target of rewriteTargets) {
    rewriteAssetPaths(
      target.querySelectorAll("[src], [href]"),
      compPath,
      (el: Element, attr: string) => el.getAttribute(attr),
      (el: Element, attr: string, value: string) => el.setAttribute(attr, value),
    );
    rewriteInlineStyleAssetUrls(
      target.querySelectorAll("[style]"),
      compPath,
      (el: Element) => el.getAttribute("style"),
      (el: Element, value: string) => el.setAttribute("style", value),
    );
    for (const styleEl of target.querySelectorAll("style")) {
      styleEl.textContent = rewriteCssAssetUrls(styleEl.textContent || "", compPath);
    }
  }

  const headStyles = Array.from(doc.head?.querySelectorAll("style") ?? [])
    .map((el) => el.outerHTML)
    .join("\n");

  const headScripts = Array.from(doc.head?.querySelectorAll("script") ?? [])
    .map((el) => el.outerHTML)
    .join("\n");

  const bodyContent = doc.body?.innerHTML ?? "";

  return { headStyles, headScripts, bodyContent };
}

/**
 * Build a standalone HTML page for a sub-composition.
 *
 * Uses the project's own index.html `<head>` so all dependencies (GSAP, fonts,
 * Lottie, reset styles, runtime) are preserved — instead of building a minimal
 * page from scratch that would miss important scripts/styles.
 */
export function buildSubCompositionHtml(
  projectDir: string,
  compPath: string,
  runtimeUrl: string,
  baseHref?: string,
): string | null {
  const compFile = join(projectDir, compPath);
  if (!existsSync(compFile)) return null;

  const rawComp = readFileSync(compFile, "utf-8");

  let compHeadStyles = "";
  let compHeadScripts = "";
  let rewrittenContent: string;

  const templateMatch = rawComp.match(/<template[^>]*>([\s\S]*)<\/template>/i);

  if (templateMatch) {
    // Template-wrapped composition: extract template content and rewrite paths.
    const content = templateMatch[1];
    const { document: contentDoc } = parseHTML(
      `<!DOCTYPE html><html><head></head><body>${content}</body></html>`,
    );

    rewriteAssetPaths(
      contentDoc.querySelectorAll("[src], [href]"),
      compPath,
      (el: Element, attr: string) => el.getAttribute(attr),
      (el: Element, attr: string, value: string) => {
        el.setAttribute(attr, value);
      },
    );
    rewriteInlineStyleAssetUrls(
      contentDoc.querySelectorAll("[style]"),
      compPath,
      (el: Element) => el.getAttribute("style"),
      (el: Element, value: string) => {
        el.setAttribute("style", value);
      },
    );
    for (const styleEl of contentDoc.querySelectorAll("style")) {
      styleEl.textContent = rewriteCssAssetUrls(styleEl.textContent || "", compPath);
    }

    rewrittenContent = contentDoc.body.innerHTML || content!;
  } else if (isFullHtmlDocument(rawComp)) {
    // Full HTML document: parse properly and extract head/body separately
    // to avoid nesting <html> inside <body>.
    const parts = extractFullDocumentParts(rawComp, compPath);
    compHeadStyles = parts.headStyles;
    compHeadScripts = parts.headScripts;
    rewrittenContent = parts.bodyContent;
  } else {
    // Raw fragment (no template, no full document).
    const { document: contentDoc } = parseHTML(
      `<!DOCTYPE html><html><head></head><body>${rawComp}</body></html>`,
    );

    rewriteAssetPaths(
      contentDoc.querySelectorAll("[src], [href]"),
      compPath,
      (el: Element, attr: string) => el.getAttribute(attr),
      (el: Element, attr: string, value: string) => {
        el.setAttribute(attr, value);
      },
    );
    rewriteInlineStyleAssetUrls(
      contentDoc.querySelectorAll("[style]"),
      compPath,
      (el: Element) => el.getAttribute("style"),
      (el: Element, value: string) => {
        el.setAttribute("style", value);
      },
    );
    for (const styleEl of contentDoc.querySelectorAll("style")) {
      styleEl.textContent = rewriteCssAssetUrls(styleEl.textContent || "", compPath);
    }

    rewrittenContent = contentDoc.body.innerHTML || rawComp;
  }

  // Use the project's index.html <head> to preserve all dependencies
  const indexPath = join(projectDir, "index.html");
  let headContent = "";

  if (existsSync(indexPath)) {
    const indexHtml = readFileSync(indexPath, "utf-8");
    const headMatch = indexHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    headContent = headMatch?.[1] ?? "";
  }

  // Inject <base> for relative asset resolution (before other tags)
  if (baseHref && !headContent.includes("<base")) {
    headContent = `<base href="${baseHref}">\n${headContent}`;
  }

  // Append the sub-composition's own <head> styles and scripts so its CSS
  // (backgrounds, positioning, fonts) and libraries (GSAP CDN) are preserved.
  if (compHeadStyles) headContent += `\n${compHeadStyles}`;
  if (compHeadScripts) headContent += `\n${compHeadScripts}`;

  // Ensure runtime is present (might differ from the one in index.html)
  if (
    !headContent.includes("hyperframe.runtime") &&
    !headContent.includes("hyperframes-preview-runtime")
  ) {
    headContent += `\n<script data-hyperframes-preview-runtime="1" src="${runtimeUrl}"></script>`;
  }

  // Fallback: if no index.html head was found, add minimal deps
  if (!headContent.includes("gsap")) {
    headContent += `\n<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>`;
  }

  return `<!DOCTYPE html>
<html>
<head>
${headContent}
</head>
<body>
<script>window.__timelines=window.__timelines||{};</script>
${rewrittenContent}
</body>
</html>`;
}
