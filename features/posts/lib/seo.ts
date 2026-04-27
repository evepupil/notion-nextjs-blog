import type { Metadata, MetadataRoute } from "next";
import type { Locale } from "@/features/i18n/lib/config";
import { getPostPath } from "@/features/posts/lib/routes";
import type { Post } from "@/features/posts/types";
import { siteConfig } from "@/shared/config/site";

type PostAlternates = NonNullable<Metadata["alternates"]>;

type BlogPostingJsonLd = {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: {
    "@type": "Person";
    name: string;
    url: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  mainEntityOfPage: string;
  keywords: string[];
  inLanguage: string;
  image?: string;
};

function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).href;
}

function getLanguageTag(locale: Locale): string {
  return locale === "zh" ? "zh-CN" : "en";
}

export function getPostAlternates(post: Post, allPosts: Post[]): PostAlternates {
  const canonical = getPostPath(post.locale, post.slug);
  const sameTranslationPosts = allPosts.filter((candidate) => candidate.translationKey === post.translationKey);
  const languages: Record<string, string> = {};

  for (const candidate of sameTranslationPosts) {
    languages[candidate.locale] = getPostPath(candidate.locale, candidate.slug);
  }

  languages["x-default"] = languages.zh ?? canonical;

  return {
    canonical,
    languages,
  };
}

export function buildPostMetadata(post: Post, allPosts: Post[]): Metadata {
  const canonical = getPostPath(post.locale, post.slug);
  const imageUrl = post.image ? absoluteUrl(post.image) : undefined;

  return {
    title: post.title,
    description: post.description,
    alternates: getPostAlternates(post, allPosts),
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: absoluteUrl(canonical),
      publishedTime: post.published.toISOString(),
      modifiedTime: (post.updated ?? post.published).toISOString(),
      tags: post.tags,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export function buildPostJsonLd(post: Post): BlogPostingJsonLd {
  const canonical = getPostPath(post.locale, post.slug);
  const imageUrl = post.image ? absoluteUrl(post.image) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.published.toISOString(),
    dateModified: (post.updated ?? post.published).toISOString(),
    author: {
      "@type": "Person",
      name: siteConfig.author,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: absoluteUrl(canonical),
    keywords: post.tags,
    inLanguage: getLanguageTag(post.locale),
    ...(imageUrl ? { image: imageUrl } : {}),
  };
}

export function getPostSitemapEntries(posts: Post[]): MetadataRoute.Sitemap {
  return posts.map((post) => ({
    url: absoluteUrl(getPostPath(post.locale, post.slug)),
    lastModified: post.updated ?? post.published,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
}
