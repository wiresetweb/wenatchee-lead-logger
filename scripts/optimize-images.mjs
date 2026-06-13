/**
 * One-off image optimizer: takes the high-res source photos in /images and emits
 * web-sized, compressed variants into /public/images. Run with:
 *   node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "images";
const OUT = "public/images";

// name -> output basename + target widths (px, long-edge capped by `width`)
const PLAN = [
  { src: "wenatchee-landscape.jpg", out: "hero-wenatchee", widths: [1600, 900] },
  { src: "the-enchantments-leavenworth.jpg", out: "enchantments", widths: [1600, 900] },
  { src: "closeup_mans_toolbag.jpg", out: "toolbag", widths: [1800, 1000] },
  { src: "close_up_dewalt_drill_in_holster.jpg", out: "drill-holster", widths: [1200, 700] },
  { src: "closeup_makita_drill_installing_doorknob.jpg", out: "doorknob-install", widths: [1800, 1000] },
  { src: "close_up_men_setting_pavers.jpg", out: "pavers", widths: [1200, 700] },
];

await mkdir(OUT, { recursive: true });

for (const item of PLAN) {
  for (const width of item.widths) {
    const dest = path.join(OUT, `${item.out}-${width}.webp`);
    const info = await sharp(path.join(SRC, item.src))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(dest);
    console.log(`${dest}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  }
}
console.log("done");
