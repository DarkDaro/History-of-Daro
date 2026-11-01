import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExcerptReader, excerptMeta } from "@/components/excerpt-reader";
import { BOOKS, EXCERPTS } from "@/lib/content";

// Для статического экспорта (GitHub Pages) роут должен быть статическим.
export const dynamic = "force-static";

export function generateStaticParams() {
  return EXCERPTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const excerpt = EXCERPTS.find((e) => e.slug === slug);
  if (!excerpt) return {};
  return excerptMeta(excerpt);
}

export default async function ExcerptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const excerpt = EXCERPTS.find((e) => e.slug === slug);
  if (!excerpt) notFound();

  const book = BOOKS.find((b) => b.slug === excerpt.bookSlug);
  if (!book) notFound();

  const idx = EXCERPTS.indexOf(excerpt);
  const prev = EXCERPTS[idx - 1];
  const next = EXCERPTS[idx + 1];

  return (
    <ExcerptReader
      excerpt={excerpt}
      book={book}
      prev={prev ? { href: `/excerpts/${prev.slug}`, title: prev.title } : undefined}
      next={next ? { href: `/excerpts/${next.slug}`, title: next.title } : undefined}
    />
  );
}
