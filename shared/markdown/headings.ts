import type { PostHeading } from "@/features/posts/types";

const headingPattern = /^(#{1,3})\s+(.+)$/gm;

export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[`*_~[\]()]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractHeadings(markdown: string): PostHeading[] {
  const headings: PostHeading[] = [];

  for (const match of markdown.matchAll(headingPattern)) {
    const marker = match[1];
    const rawText = match[2];
    if (!marker || !rawText) continue;

    const text = rawText.replace(/#+$/, "").trim();
    headings.push({
      depth: marker.length,
      text,
      slug: slugifyHeading(text),
    });
  }

  return headings;
}
