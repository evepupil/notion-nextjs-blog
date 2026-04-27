import { describe, expect, test } from "bun:test";
import { getLegacyPostRedirect, getPostPath } from "../features/posts/lib/routes";

describe("post route helpers", () => {
  test("builds canonical localized post paths", () => {
    expect(getPostPath("zh", "开源自用的博客系统notion-fuwari")).toBe("/zh/posts/开源自用的博客系统notion-fuwari/");
    expect(getPostPath("en", "cloudflare-worker-guide")).toBe("/en/posts/cloudflare-worker-guide/");
  });

  test("redirects legacy article links only", () => {
    expect(getLegacyPostRedirect("zh", "hello-world")).toBe("/zh/posts/hello-world/");
    expect(getLegacyPostRedirect("en", "hello-world")).toBe("/en/posts/hello-world/");
  });
});
