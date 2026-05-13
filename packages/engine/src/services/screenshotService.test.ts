// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import { type Page } from "puppeteer-core";
import {
  captureAlphaPng,
  captureAlphaPngBeginFrame,
  cdpSessionCache,
  pageScreenshotCapture,
} from "./screenshotService.js";

// Stub a Page + CDPSession just enough that pageScreenshotCapture can call
// `client.send("Page.captureScreenshot", ...)` and we can inspect the args.
function makeFakePageWithCdp(send: (method: string, params: object) => Promise<unknown>) {
  const fakeSession = { send } as unknown as import("puppeteer-core").CDPSession;
  // Stub a Page object — the WeakMap cache is the only Page-thing used in the
  // path under test, so we can pre-seed it and skip page.createCDPSession().
  const fakePage = {} as Page;
  cdpSessionCache.set(fakePage, fakeSession);
  return fakePage;
}

describe("pageScreenshotCapture supersample plumbing", () => {
  // Minimal 1×1 transparent PNG, base64. The function returns Buffer.from(data, "base64")
  // and we never inspect the bytes — only the params we pass to client.send.
  const ONE_PIXEL_PNG_B64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=";

  it("omits `clip` when deviceScaleFactor is undefined (default 1)", async () => {
    const send = vi.fn().mockResolvedValue({ data: ONE_PIXEL_PNG_B64 });
    const page = makeFakePageWithCdp(send);

    await pageScreenshotCapture(page, {
      width: 1920,
      height: 1080,
      fps: { num: 30, den: 1 },
      format: "jpeg",
      quality: 80,
    });

    expect(send).toHaveBeenCalledWith(
      "Page.captureScreenshot",
      expect.not.objectContaining({ clip: expect.anything() }),
    );
  });

  it("omits `clip` when deviceScaleFactor is exactly 1", async () => {
    const send = vi.fn().mockResolvedValue({ data: ONE_PIXEL_PNG_B64 });
    const page = makeFakePageWithCdp(send);

    await pageScreenshotCapture(page, {
      width: 1920,
      height: 1080,
      fps: { num: 30, den: 1 },
      format: "jpeg",
      deviceScaleFactor: 1,
    });

    const params = send.mock.calls[0]?.[1] as { clip?: unknown };
    expect(params.clip).toBeUndefined();
  });

  it("passes `clip` with `scale = dpr` when deviceScaleFactor > 1 (the supersample contract)", async () => {
    const send = vi.fn().mockResolvedValue({ data: ONE_PIXEL_PNG_B64 });
    const page = makeFakePageWithCdp(send);

    await pageScreenshotCapture(page, {
      width: 1920,
      height: 1080,
      fps: { num: 30, den: 1 },
      format: "jpeg",
      deviceScaleFactor: 2,
    });

    expect(send).toHaveBeenCalledWith(
      "Page.captureScreenshot",
      expect.objectContaining({
        clip: { x: 0, y: 0, width: 1920, height: 1080, scale: 2 },
      }),
    );
  });

  it("propagates a non-2 supersample factor (e.g. 720p → 4K = 3×)", async () => {
    const send = vi.fn().mockResolvedValue({ data: ONE_PIXEL_PNG_B64 });
    const page = makeFakePageWithCdp(send);

    await pageScreenshotCapture(page, {
      width: 1280,
      height: 720,
      fps: { num: 30, den: 1 },
      format: "jpeg",
      deviceScaleFactor: 3,
    });

    const params = send.mock.calls[0]?.[1] as { clip?: { scale: number } };
    expect(params.clip?.scale).toBe(3);
  });

  it("uses the fast PNG encoder path (`optimizeForSpeed: true`) for opaque PNG captures", async () => {
    // Regression guard. The prior code disabled `optimizeForSpeed` on PNG out
    // of an incorrect belief that the fast encoder crushes alpha to 0/255.
    // Both PNG encoder variants in Chromium call
    // gfx::PNGCodec::*EncodeBGRASkBitmap with `discard_transparency=false`;
    // the slow/fast distinction is DEFLATE compression effort only and has
    // no effect on alpha values (verified bit-perfect on Chrome 146+).
    const send = vi.fn().mockResolvedValue({ data: ONE_PIXEL_PNG_B64 });
    const page = makeFakePageWithCdp(send);

    await pageScreenshotCapture(page, {
      width: 1920,
      height: 1080,
      fps: { num: 30, den: 1 },
      format: "png",
    });

    expect(send).toHaveBeenCalledWith(
      "Page.captureScreenshot",
      expect.objectContaining({ format: "png", optimizeForSpeed: true }),
    );
  });
});

describe("captureAlphaPng (Page.captureScreenshot path)", () => {
  // Minimal 1x1 transparent PNG used as the fake CDP screenshot payload.
  const ONE_PIXEL_PNG_B64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=";

  it("passes `optimizeForSpeed: true` so the fast encoder path is used", async () => {
    // Regression guard — see the pageScreenshotCapture test above for the
    // page_handler.cc citation. The slow encoder added ~15ms per 854x480
    // frame for zero alpha-quality benefit.
    const send = vi.fn().mockResolvedValue({ data: ONE_PIXEL_PNG_B64 });
    const page = makeFakePageWithCdp(send);

    await captureAlphaPng(page, 854, 480);

    expect(send).toHaveBeenCalledWith(
      "Page.captureScreenshot",
      expect.objectContaining({
        format: "png",
        fromSurface: true,
        captureBeyondViewport: false,
        optimizeForSpeed: true,
        clip: { x: 0, y: 0, width: 854, height: 480, scale: 1 },
      }),
    );
  });
});

describe("captureAlphaPngBeginFrame", () => {
  // Minimal 1x1 PNG bytes (any non-empty base64 payload works — the function
  // returns Buffer.from(data, "base64") and we only inspect the args we
  // sent into the CDP call + which buffer we got back).
  const ONE_PIXEL_PNG_B64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=";
  const ALT_PIXEL_PNG_B64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8//8/AwAI/AL+XJrScwAAAABJRU5ErkJggg==";

  it("issues a HeadlessExperimental.beginFrame CDP call with png + optimizeForSpeed:true", async () => {
    // Load-bearing: the engine MUST route alpha capture through
    // beginFrame's fast PNG encoder. Reverting either axis (back to
    // Page.captureScreenshot, or back to the slow encoder) sacrifices a
    // measured 5x frame-time speedup for no quality gain (alpha
    // bit-perfect on Chrome 146 and 148 — see PR body).
    const send = vi.fn().mockResolvedValue({
      hasDamage: true,
      screenshotData: ONE_PIXEL_PNG_B64,
    });
    const page = makeFakePageWithCdp(send);

    const buffer = await captureAlphaPngBeginFrame(page, 854, 480, 1000 / 30);

    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(
      "HeadlessExperimental.beginFrame",
      expect.objectContaining({
        interval: 1000 / 30,
        screenshot: expect.objectContaining({ format: "png", optimizeForSpeed: true }),
      }),
    );
    expect(buffer).toEqual(Buffer.from(ONE_PIXEL_PNG_B64, "base64"));
  });

  it("advances frameTimeTicks monotonically per call so multi-scene-per-frame captures don't collide", async () => {
    // The HDR layered composite path captures multiple scenes per logical
    // frame. If two consecutive calls share the same tick value, Chrome's
    // compositor returns hasDamage=false and replays a stale buffer for
    // the second scene — corrupting the composite. Verifies each call
    // submits a strictly-greater tick than the previous on the same page.
    const send = vi.fn().mockResolvedValue({
      hasDamage: true,
      screenshotData: ONE_PIXEL_PNG_B64,
    });
    const page = makeFakePageWithCdp(send);

    await captureAlphaPngBeginFrame(page, 100, 100, 33.333);
    await captureAlphaPngBeginFrame(page, 100, 100, 33.333);
    await captureAlphaPngBeginFrame(page, 100, 100, 33.333);

    const calls = send.mock.calls as Array<[string, { frameTimeTicks: number }]>;
    const ticks = calls.map((c) => c[1].frameTimeTicks);
    expect(ticks).toEqual([33.333, 66.666, 99.999]);
  });

  it("forwards the caller's interval through unchanged", async () => {
    const send = vi.fn().mockResolvedValue({
      hasDamage: true,
      screenshotData: ONE_PIXEL_PNG_B64,
    });
    const page = makeFakePageWithCdp(send);

    await captureAlphaPngBeginFrame(page, 1920, 1080, 33.366);

    expect(send).toHaveBeenCalledWith(
      "HeadlessExperimental.beginFrame",
      expect.objectContaining({ interval: 33.366 }),
    );
  });

  it("replays the last buffer when Chrome reports hasDamage=false (no screenshotData)", async () => {
    // When a beginFrame produces no visible change, Chrome omits
    // `screenshotData` from the result. We must serve the previously
    // captured buffer rather than re-issuing the call against the
    // paused compositor (which would time out).
    const send = vi
      .fn()
      .mockResolvedValueOnce({ hasDamage: true, screenshotData: ONE_PIXEL_PNG_B64 })
      .mockResolvedValueOnce({ hasDamage: false });
    const page = makeFakePageWithCdp(send);

    const first = await captureAlphaPngBeginFrame(page, 100, 100, 33.333);
    const second = await captureAlphaPngBeginFrame(page, 100, 100, 33.333);

    expect(send).toHaveBeenCalledTimes(2);
    expect(first).toEqual(Buffer.from(ONE_PIXEL_PNG_B64, "base64"));
    expect(second).toEqual(first); // hasDamage=false → cached buffer reused
  });

  it("keeps the alpha buffer cache separate from the opaque beginFrameCapture cache", async () => {
    // Two beginFrame streams (opaque via beginFrameCapture, alpha via
    // captureAlphaPngBeginFrame) can run against the same Page during the
    // same render. Their hasDamage=false replay caches must not collide,
    // or a transparent capture would leak the previous opaque frame and
    // vice versa. A regression that merged the two caches would replay
    // the wrong content here.
    const send = vi
      .fn()
      .mockResolvedValueOnce({ hasDamage: true, screenshotData: ALT_PIXEL_PNG_B64 })
      .mockResolvedValueOnce({ hasDamage: false });
    const page = makeFakePageWithCdp(send);

    const first = await captureAlphaPngBeginFrame(page, 100, 100, 33.333);
    const second = await captureAlphaPngBeginFrame(page, 100, 100, 33.333);

    expect(first).toEqual(Buffer.from(ALT_PIXEL_PNG_B64, "base64"));
    expect(second).toEqual(first);
  });

  it("falls back to a small-time-advance beginFrame when cache is empty AND first reply has no damage", async () => {
    // Frame 0 should always report damage; this branch is near-unreachable
    // in production but guards against a compositor that races. The
    // recovery path must issue a second beginFrame with bumped ticks.
    const send = vi
      .fn()
      .mockResolvedValueOnce({ hasDamage: false }) // no screenshotData
      .mockResolvedValueOnce({ hasDamage: true, screenshotData: ONE_PIXEL_PNG_B64 });
    const page = makeFakePageWithCdp(send);

    const buffer = await captureAlphaPngBeginFrame(page, 100, 100, 33.333);

    expect(send).toHaveBeenCalledTimes(2);
    const firstCall = send.mock.calls[0]?.[1] as { frameTimeTicks: number };
    const secondCall = send.mock.calls[1]?.[1] as { frameTimeTicks: number };
    expect(secondCall.frameTimeTicks).toBeCloseTo(firstCall.frameTimeTicks + 0.001, 6);
    expect(buffer).toEqual(Buffer.from(ONE_PIXEL_PNG_B64, "base64"));
  });
});
