import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Locale } from "@/features/i18n/lib/config";
import { normalizeLocale } from "@/features/i18n/lib/config";
import { extractHeadings } from "@/shared/markdown/headings";
import type { Post } from "../types";

const postsRoot = path.join(process.cwd(), "content", "posts");

type ParsePostInput = {
  source: string;
  slug: string;
  locale: Locale;
};

type FrontmatterRecord = Record<string, unknown>;

function asString(value: unknown, fallback = ""): string {
  if (value instanceof Date) return value.toISOString();
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return new Date();
}

function getPostFilePaths(locale: Locale): string[] {
  const localeDir = path.join(postsRoot, locale);
  if (!fs.existsSync(localeDir)) return [];

  return fs
    .readdirSync(localeDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(localeDir, entry.name));
}

export function parsePostMarkdown({ source, slug, locale }: ParsePostInput): Post {
  const parsed = matter(source);
  const data = parsed.data as FrontmatterRecord;
  const markdown = parsed.content.trim();
  const stats = readingTime(markdown);
  const frontmatterLang = asString(data.lang, locale);
  const normalizedLocale = normalizeLocale(frontmatterLang || locale);
  const published = asDate(data.published);
  const maybeUpdated = data.updated ? asDate(data.updated) : undefined;

  return {
    slug,
    locale: normalizedLocale,
    title: asString(data.title, slug),
    description: asString(data.description),
    image: asString(data.image),
    tags: asStringArray(data.tags),
    category: asString(data.category),
    lang: frontmatterLang,
    translationKey: asString(data.translationKey, slug),
    draft: asBoolean(data.draft),
    pinned: asBoolean(data.pinned),
    published,
    ...(maybeUpdated ? { updated: maybeUpdated } : {}),
    readingTime: {
      text: stats.text,
      minutes: Math.max(1, Math.ceil(stats.minutes)),
      words: stats.words,
    },
    headings: extractHeadings(markdown),
    markdown,
  };
}

export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort((left, right) => {
    if (left.pinned !== right.pinned) return left.pinned ? -1 : 1;
    return right.published.getTime() - left.published.getTime();
  });
}

export function getAllPosts(locale?: Locale): Post[] {
  const locales: Locale[] = locale ? [locale] : ["zh", "en"];
  const posts = locales.flatMap((currentLocale) =>
    getPostFilePaths(currentLocale).map((filePath) => {
      const source = fs.readFileSync(filePath, "utf8");
      const slug = path.basename(filePath, ".md");
      return parsePostMarkdown({ source, slug, locale: currentLocale });
    }),
  );

  const visiblePosts = posts.filter((post) => !post.draft);
  return sortPosts(visiblePosts);
}

export function getPostBySlug(locale: Locale, slug: string): Post | null {
  const filePath = path.join(postsRoot, locale, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const post = parsePostMarkdown({
    source: fs.readFileSync(filePath, "utf8"),
    slug,
    locale,
  });

  if (post.draft) return null;
  return post;
}

export function getPostStaticParams(): Array<{ locale: Locale; slug: string }> {
  return getAllPosts().map((post) => ({ locale: post.locale, slug: post.slug }));
}
