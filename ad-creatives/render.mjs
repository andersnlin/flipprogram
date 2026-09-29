// Render Flip ad creatives with headless Chromium.
//   node render.mjs                 -> every static (feed + story PNG) and every video (MP4)
//   node render.mjs statics         -> statics only
//   node render.mjs videos [name]   -> videos only (optionally one, by filename substring)
//   node render.mjs still <file> <t> -> PNG of one video frame at time t (for review)
// ffmpeg: set FFMPEG=/path/to/ffmpeg, otherwise `ffmpeg` on PATH is used
// (pip install imageio-ffmpeg gives you one with libx264).

import { chromium } from "playwright";
import { spawn, execSync } from "node:child_process";
import { readdirSync, mkdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "out");
const FPS = 30;
const SIZES = { feed: [1080, 1350], story: [1080, 1920] };

function findFfmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  try {
    return execSync(`python3 -c "import imageio_ffmpeg as i; print(i.get_ffmpeg_exe())"`, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch { return "ffmpeg"; }
}

const htmlIn = (dir) => readdirSync(join(root, dir)).filter((f) => f.endsWith(".html")).sort();

async function open(browser, file, format, check = true) {
  const [w, h] = SIZES[format];
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(file).href + `?format=${format}`);
  await page.evaluate(() => window.__ready);
  // Flag layouts where content spills past the canvas (it would be cropped in the export).
  const spill = check && await page.evaluate(() => {
    const c = document.querySelector(".canvas");
    const rects = [...c.querySelectorAll("*")].filter((e) => !e.closest(".glow")).map((e) => e.getBoundingClientRect());
    return Math.round(Math.max(Math.max(...rects.map((r) => r.bottom)) - c.clientHeight, -Math.min(...rects.map((r) => r.top))));
  });
  if (spill > 0) console.warn(`⚠ ${basename(file)} [${format}] overflows by ${spill}px`);
  return page;
}

async function renderStatics(browser) {
  mkdirSync(join(out, "statics"), { recursive: true });
  for (const f of htmlIn("statics")) {
    for (const format of Object.keys(SIZES)) {
      const page = await open(browser, join(root, "statics", f), format);
      const dest = join(out, "statics", `${basename(f, ".html")}-${format}.png`);
      await page.screenshot({ path: dest });
      await page.close();
      console.log("✓", dest.replace(root + "/", ""));
    }
  }
}

async function renderVideo(browser, f, ffmpeg) {
  const page = await open(browser, join(root, "videos", f), "story", false);
  const duration = await page.evaluate(() => window.__duration);
  const frames = Math.round(duration * FPS);
  const dest = join(out, "videos", `${basename(f, ".html")}.mp4`);
  const ff = spawn(ffmpeg, [
    "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium", "-movflags", "+faststart", dest,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.__seek(t), i / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on("close", (c) => (c === 0 ? res() : rej(new Error(`ffmpeg exited ${c}`)))));
  await page.close();
  console.log(`✓ ${dest.replace(root + "/", "")}  (${duration}s, ${frames} frames)`);
}

const [mode = "all", arg, arg2] = process.argv.slice(2);
const browser = await chromium.launch();
try {
  if (mode === "still") {
    mkdirSync(join(out, "stills"), { recursive: true });
    const page = await open(browser, join(root, "videos", arg), "story", false);
    await page.evaluate((t) => window.__seek(t), parseFloat(arg2));
    const dest = join(out, "stills", `${basename(arg, ".html")}-${arg2}s.png`);
    await page.screenshot({ path: dest });
    console.log("✓", dest);
  }
  if (mode === "all" || mode === "statics") await renderStatics(browser);
  if (mode === "all" || mode === "videos") {
    mkdirSync(join(out, "videos"), { recursive: true });
    const ffmpeg = findFfmpeg();
    for (const f of htmlIn("videos").filter((f) => !arg || f.includes(arg))) await renderVideo(browser, f, ffmpeg);
  }
} finally {
  await browser.close();
}
