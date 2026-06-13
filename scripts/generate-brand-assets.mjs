/**
 * Generates branded assets:
 *   - public/og.png        social share card (1200x630) from the hero photo + overlay
 *   - src/app/apple-icon.png  180x180 app icon
 * Run: node scripts/generate-brand-assets.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public", { recursive: true });

// --- OG card ---------------------------------------------------------------
const W = 1200;
const H = 630;

const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#022c22" stop-opacity="0.92"/>
      <stop offset="0.55" stop-color="#064e3b" stop-opacity="0.75"/>
      <stop offset="1" stop-color="#065f46" stop-opacity="0.45"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <g transform="translate(72,150)">
    <rect x="0" y="0" width="44" height="44" rx="11" fill="#10b981"/>
    <path d="M30 16.5a9 9 0 1 0 0 11" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <text x="60" y="32" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#a7f3d0">Cascade Home Connect</text>
  </g>
  <text x="72" y="300" font-family="Arial, sans-serif" font-size="68" font-weight="800" fill="#ffffff">Skip the phone tag.</text>
  <text x="72" y="378" font-family="Arial, sans-serif" font-size="68" font-weight="800" fill="#6ee7b7">We'll find your pro.</text>
  <text x="72" y="452" font-family="Arial, sans-serif" font-size="30" font-weight="400" fill="#d1fae5">Free quotes from trusted local pros — Wenatchee Valley, WA</text>
  <text x="72" y="540" font-family="Arial, sans-serif" font-size="22" font-weight="600" fill="#34d399">cascadehomeconnect.com</text>
</svg>`);

await sharp("images/wenatchee-landscape.jpg")
  .resize({ width: W, height: H, fit: "cover", position: "top" })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .png({ quality: 90 })
  .toFile("public/og.png");
console.log("wrote public/og.png");

// --- apple icon ------------------------------------------------------------
const icon = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#059669"/>
  <path d="M44 24.5a13 13 0 1 0 0 15" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
</svg>`);
await sharp(icon).resize(180, 180).png().toFile("src/app/apple-icon.png");
console.log("wrote src/app/apple-icon.png");

console.log("done");
