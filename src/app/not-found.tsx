import { Container, ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] max-w-xl flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink-900">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 text-ink-600">
        The page may have moved. Let&apos;s get you back on track — or start a free quote.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/" variant="secondary">
          Back to home
        </ButtonLink>
        <ButtonLink href="/get-quote">Get a free quote</ButtonLink>
      </div>
    </Container>
  );
}
