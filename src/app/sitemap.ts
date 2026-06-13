import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/content/services";
import { CITIES } from "@/content/cities";
import { GUIDES } from "@/content/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();

  const staticPaths = [
    "",
    "/how-it-works",
    "/services",
    "/locations",
    "/guides",
    "/for-contractors",
    "/about",
    "/contact",
    "/get-quote",
    "/privacy",
    "/terms",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/get-quote" ? 0.9 : 0.7,
  }));

  for (const s of SERVICES) {
    entries.push({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
    // Service × city programmatic pages.
    for (const c of CITIES) {
      entries.push({
        url: `${base}/services/${s.slug}/${c.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  for (const c of CITIES) {
    entries.push({
      url: `${base}/locations/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const g of GUIDES) {
    entries.push({
      url: `${base}/guides/${g.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
