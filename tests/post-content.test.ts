import { describe, expect, test } from "bun:test";
import { parsePostMarkdown, sortPosts } from "../features/posts/lib/content";
import { renderMarkdownToHtml } from "../shared/markdown/render";

const sampleMarkdown = `---
title: '测试文章'
published: 2026-04-20
description: '这是一篇用于测试的文章。'
image: ''
tags: ["Next.js", "SEO"]
draft: false
lang: 'zh-CN'
translationKey: 'test-post'
category: '技术'
---

# 一级标题

这是正文第一段。

## 二级标题

- 支持 GFM 列表
- 支持阅读时间
`;

describe("post content parsing", () => {
  test("parses Notion-synced Markdown frontmatter into a typed post", () => {
    const post = parsePostMarkdown({
      source: sampleMarkdown,
      slug: "test-post",
      locale: "zh",
    });

    expect(post.title).toBe("测试文章");
    expect(post.description).toBe("这是一篇用于测试的文章。");
    expect(post.locale).toBe("zh");
    expect(post.lang).toBe("zh-CN");
    expect(post.tags).toEqual(["Next.js", "SEO"]);
    expect(post.draft).toBe(false);
    expect(post.translationKey).toBe("test-post");
    expect(post.category).toBe("技术");
    expect(post.readingTime.minutes).toBeGreaterThan(0);
    expect(post.headings).toEqual([
      { depth: 1, text: "一级标题", slug: "一级标题" },
      { depth: 2, text: "二级标题", slug: "二级标题" },
    ]);
  });

  test("sorts pinned posts before newer published posts", () => {
    const oldPinned = parsePostMarkdown({
      source: sampleMarkdown.replace("draft: false", "draft: false\npinned: true").replace("2026-04-20", "2026-01-01"),
      slug: "old-pinned",
      locale: "zh",
    });
    const newer = parsePostMarkdown({
      source: sampleMarkdown.replace("2026-04-20", "2026-05-01"),
      slug: "newer",
      locale: "zh",
    });

    expect(sortPosts([newer, oldPinned]).map((post) => post.slug)).toEqual(["old-pinned", "newer"]);
  });
});

describe("markdown rendering", () => {
  test("renders headings, paragraphs and GFM lists to HTML", async () => {
    const html = await renderMarkdownToHtml("# 标题\n\n正文。\n\n- A\n- B");

    expect(html).toContain('<h1 id="标题">');
    expect(html).toContain("<p>正文。</p>");
    expect(html).toContain("<li>A</li>");
  });
});
