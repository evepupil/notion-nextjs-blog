import { describe, expect, test } from "bun:test";
import { buildPostJsonLd, buildPostMetadata, getPostAlternates, getPostSitemapEntries } from "../features/posts/lib/seo";
import { parsePostMarkdown } from "../features/posts/lib/content";

const zhPost = parsePostMarkdown({
  slug: "hello-chaosyn",
  locale: "zh",
  source: `---
title: 'Hello Chaosyn Lab'
published: 2026-04-27
description: '中文描述'
image: ''
tags: ["Next.js", "SEO"]
draft: false
lang: 'zh-CN'
translationKey: 'hello-chaosyn'
category: '技术'
---

# Hello
`,
});

describe("post SEO helpers", () => {
  test("builds canonical and language alternates for a translated post", () => {
    const alternates = getPostAlternates(zhPost, [zhPost]);

    expect(alternates.canonical).toBe("/zh/posts/hello-chaosyn/");
    expect(alternates.languages).toEqual({
      zh: "/zh/posts/hello-chaosyn/",
      "x-default": "/zh/posts/hello-chaosyn/",
    });
  });

  test("builds metadata from a post", () => {
    const metadata = buildPostMetadata(zhPost, [zhPost]);

    expect(metadata.title).toBe("Hello Chaosyn Lab");
    expect(metadata.description).toBe("中文描述");
    expect(metadata.alternates?.canonical).toBe("/zh/posts/hello-chaosyn/");
  });

  test("builds BlogPosting JSON-LD", () => {
    const jsonLd = buildPostJsonLd(zhPost);

    expect(jsonLd["@type"]).toBe("BlogPosting");
    expect(jsonLd.headline).toBe("Hello Chaosyn Lab");
    expect(jsonLd.mainEntityOfPage).toBe("https://blog.chaosyn.com/zh/posts/hello-chaosyn/");
    expect(jsonLd.inLanguage).toBe("zh-CN");
  });

  test("includes canonical article URLs in sitemap entries", () => {
    const entries = getPostSitemapEntries([zhPost]);

    expect(entries).toEqual([
      expect.objectContaining({
        url: "https://blog.chaosyn.com/zh/posts/hello-chaosyn/",
        priority: 0.7,
      }),
    ]);
  });
});
