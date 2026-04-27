import { describe, expect, test } from "bun:test";
import {
  getImageMarkdownPath,
  getPostMetadata,
  normalizePostLocale,
  resolveContentDir,
  resolvePostFilePath,
} from "../scripts/sync-lib";

function notionPage(properties: Record<string, unknown>) {
  return {
    id: "page-id-1",
    properties,
  };
}

describe("Notion sync rules", () => {
  test("normalizes Notion language values to project locales", () => {
    expect(normalizePostLocale("en")).toEqual({ locale: "en", lang: "en" });
    expect(normalizePostLocale("English")).toEqual({ locale: "en", lang: "en" });
    expect(normalizePostLocale("zh-CN")).toEqual({ locale: "zh", lang: "zh-CN" });
    expect(normalizePostLocale(undefined)).toEqual({ locale: "zh", lang: "zh-CN" });
  });

  test("extracts slug, locale, translation key and description from flexible Notion properties", () => {
    const metadata = getPostMetadata(
      notionPage({
        Title: { title: [{ plain_text: "Hello World" }] },
        Slug: { rich_text: [{ plain_text: "hello-world" }] },
        Language: { select: { name: "en" } },
        "Translation Key": { rich_text: [{ plain_text: "hello-world-key" }] },
        Description: { rich_text: [{ plain_text: "Custom excerpt" }] },
        Tags: { multi_select: [{ name: "Next.js" }, { name: "SEO" }] },
        Category: { select: { name: "Tech" } },
        "Published Date": { date: { start: "2026-04-27" } },
      }),
    );

    expect(metadata.slug).toBe("hello-world");
    expect(metadata.locale).toBe("en");
    expect(metadata.lang).toBe("en");
    expect(metadata.translationKey).toBe("hello-world-key");
    expect(metadata.description).toBe("Custom excerpt");
    expect(metadata.tags).toEqual(["Next.js", "SEO"]);
    expect(metadata.category).toBe("Tech");
  });

  test("resolves language-specific output paths", () => {
    expect(resolveContentDir("D:/repo", "zh")).toBe("D:\\repo\\content\\posts\\zh");
    expect(resolveContentDir("D:/repo", "en")).toBe("D:\\repo\\content\\posts\\en");
    expect(resolvePostFilePath("D:/repo", "en", "hello-world")).toBe("D:\\repo\\content\\posts\\en\\hello-world.md");
  });

  test("uses image paths relative to content/posts/{locale}", () => {
    expect(getImageMarkdownPath("hello-world", "image-1.png")).toBe("../../assets/images/hello-world/image-1.png");
  });
});
