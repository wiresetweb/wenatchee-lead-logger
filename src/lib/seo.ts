/**
 * SEO helpers: per-page metadata builder and JSON-LD schema builders.
 * Centralizing these keeps titles/canonicals/structured data consistent across the
 * many service and city pages. See docs/SEO_STRATEGY.md.
 */

import type { Metadata } from "next";
import { SITE } from "./site";

interface PageMetaArgs {
  title: string;
  description: string;
  /** Path beginning with "/" — used for the canonical URL. */
  path?: string;
  /** OpenGraph type — use "article" for blog posts/guides. */
  type?: "website" | "article";
  /** Publish date (ISO) — emitted as article:published_time for articles. */
  publishedTime?: string;
}

/** Build per-page Metadata with canonical + OpenGraph defaults. */
export function pageMeta({
  title,
  description,
  path = "/",
  type = "website",
  publishedTime,
}: PageMetaArgs): Metadata {
  const url = new URL(path, SITE.url).toString();
  const fullTitle = path === "/" ? title : `${title} | ${SITE.name}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      locale: "en_US",
      type,
      ...(type === "article" && publishedTime
        ? { publishedTime, authors: [SITE.name] }
        : {}),
      images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/og.png"],
    },
  };
}

/** Organization schema for the site root. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    parentOrganization: { "@type": "Organization", name: SITE.parentCompany },
    areaServed: `${SITE.regionShort}, ${SITE.state}`,
    description: SITE.description,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: SITE.phone,
      email: SITE.email,
      areaServed: "US-WA",
    },
  };
}

/** WebSite schema (enables sitelinks search box eligibility later). */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
  };
}

/** Service schema for a service page. */
export function serviceSchema(args: {
  name: string;
  description: string;
  path: string;
  areaServed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: args.name,
    description: args.description,
    provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
    areaServed: args.areaServed ?? `${SITE.regionShort}, ${SITE.state}`,
    url: new URL(args.path, SITE.url).toString(),
  };
}

/** FAQPage schema from Q/A pairs. */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** ItemList schema for hub/collection pages (services index, blog index). Helps Google
 *  understand the set of items and can earn carousel-style treatment. */
export function itemListSchema(args: {
  name: string;
  items: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: args.name,
    itemListElement: args.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: new URL(item.path, SITE.url).toString(),
    })),
  };
}

/** Article schema for a blog post — richer than the inline minimum (image, section,
 *  word count, language) for better rich-result eligibility. */
export function articleSchema(args: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  section?: string;
  wordCount?: number;
}) {
  const url = new URL(args.path, SITE.url).toString();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    inLanguage: "en-US",
    image: new URL("/og.png", SITE.url).toString(),
    ...(args.section ? { articleSection: args.section } : {}),
    ...(args.wordCount ? { wordCount: args.wordCount } : {}),
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: {
      "@type": "Organization",
      name: SITE.parentCompany,
      logo: { "@type": "ImageObject", url: new URL("/og.png", SITE.url).toString() },
    },
    mainEntityOfPage: url,
    url,
  };
}

/** BreadcrumbList schema. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: new URL(item.path, SITE.url).toString(),
    })),
  };
}
