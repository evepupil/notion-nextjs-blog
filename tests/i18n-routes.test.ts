import { describe, expect, test } from "bun:test";
import { defaultLocale, locales, normalizeLocale, withLocale } from "../features/i18n/lib/config";

describe("i18n route config", () => {
  test("uses zh and en with zh as default locale", () => {
    expect(locales).toEqual(["zh", "en"]);
    expect(defaultLocale).toBe("zh");
  });

  test("normalizes locale aliases from existing content", () => {
    expect(normalizeLocale("zh-CN")).toBe("zh");
    expect(normalizeLocale("zh_CN")).toBe("zh");
    expect(normalizeLocale("en")).toBe("en");
    expect(normalizeLocale(undefined)).toBe("zh");
  });

  test("prefixes app routes with the locale", () => {
    expect(withLocale("zh", "/posts/demo/")).toBe("/zh/posts/demo/");
    expect(withLocale("en", "posts/demo")).toBe("/en/posts/demo/");
  });
});
