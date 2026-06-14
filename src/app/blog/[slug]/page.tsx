import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { POSTS, getPost, type Block } from "@/content/blog";
import { pageMeta, faqSchema, breadcrumbSchema, articleSchema } from "@/lib/seo";
import { Container, H2, ButtonLink } from "@/components/ui";
import { Breadcrumbs, CtaBand } from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.date,
  });
}

/** Approximate word count from the post body, for Article schema. */
function postWordCount(post: NonNullable<ReturnType<typeof getPost>>): number {
  let words = 0;
  for (const b of post.body) {
    if (b.type === "p" || b.type === "h2" || b.type === "cta") words += b.text.split(/\s+/).length;
    else if (b.type === "ul") words += b.items.join(" ").split(/\s+/).length;
  }
  return words;
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-10 font-display text-2xl font-bold text-ink-900">{block.text}</h2>;
    case "p":
      return <p className="mt-4 leading-relaxed text-ink-700">{block.text}</p>;
    case "ul":
      return (
        <ul className="mt-4 space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-ink-700">
              <span className="mt-1 text-brand-600">•</span>
              {item}
            </li>
          ))}
        </ul>
      );
    case "cta":
      return (
        <div className="mt-8 rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center">
          <p className="font-display text-lg font-bold text-ink-900">{block.text}</p>
          <div className="mt-4">
            <ButtonLink href={block.href} size="lg">
              {block.label}
            </ButtonLink>
          </div>
        </div>
      );
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const path = `/blog/${post.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path },
  ];

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.excerpt,
            path,
            datePublished: post.date,
            section: post.category,
            wordCount: postWordCount(post),
          }),
          breadcrumbSchema(crumbs),
          ...(post.faqs ? [faqSchema(post.faqs)] : []),
        ]}
      />

      <Container className="max-w-3xl py-12">
        <Breadcrumbs items={crumbs} />
        <p className="mt-6 text-sm font-semibold text-brand-700">
          {post.category} · {post.readMins} min read
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-ink-400">
          By the {SITE.name} team · Reviewed for {SITE.regionName} ·{" "}
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <article className="mt-6">
          {post.body.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
        </article>

        {post.faqs && post.faqs.length > 0 && (
          <div className="mt-12">
            <H2 className="!text-2xl">FAQs</H2>
            <dl className="mt-5 space-y-4">
              {post.faqs.map((f) => (
                <div key={f.q} className="rounded-2xl border border-ink-200 bg-white p-5">
                  <dt className="font-display font-bold text-ink-900">{f.q}</dt>
                  <dd className="mt-2 text-ink-600">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="mt-12 border-t border-ink-200 pt-6">
          <p className="text-sm font-semibold text-ink-500">Keep reading</p>
          <ul className="mt-3 space-y-2">
            {post.related.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="font-medium text-brand-700 hover:underline">
                  {r.label} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <CtaBand />
    </>
  );
}
