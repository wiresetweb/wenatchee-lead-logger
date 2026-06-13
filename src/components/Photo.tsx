/**
 * Static responsive photo. We pre-generate two webp sizes per image
 * (scripts/optimize-images.mjs) and serve them with a srcset — no runtime image
 * optimizer needed, fully cacheable at the edge.
 */

const VARIANTS: Record<string, { large: number; small: number }> = {
  "hero-wenatchee": { large: 1600, small: 900 },
  enchantments: { large: 1600, small: 900 },
  toolbag: { large: 1800, small: 1000 },
  "drill-holster": { large: 1200, small: 700 },
  "doorknob-install": { large: 1800, small: 1000 },
  pavers: { large: 1200, small: 700 },
};

export function photoSrc(name: keyof typeof VARIANTS, size: "large" | "small" = "large") {
  return `/images/${name}-${VARIANTS[name][size]}.webp`;
}

export function Photo({
  name,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
}: {
  name: keyof typeof VARIANTS;
  alt: string;
  className?: string;
  /** The `sizes` attribute, e.g. "(min-width: 1024px) 50vw, 100vw" */
  sizes?: string;
  /** Eager-load + high priority (above-the-fold images only). */
  priority?: boolean;
}) {
  const v = VARIANTS[name];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static srcset, no optimizer needed
    <img
      src={`/images/${name}-${v.large}.webp`}
      srcSet={`/images/${name}-${v.small}.webp ${v.small}w, /images/${name}-${v.large}.webp ${v.large}w`}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
    />
  );
}
