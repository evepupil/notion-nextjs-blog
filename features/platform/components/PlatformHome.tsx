import Link from "next/link";
import type { Locale } from "@/features/i18n/lib/config";

const modules = [
  ["posts", "文章", "技术文章、长文笔记、多语言内容与 SEO-first 阅读体验。"],
  ["ask", "AI 助手", "基于站内内容检索，回答时带来源，像一个可对话的知识库。"],
  ["books", "图书", "翻译、读书计划、章节目录和长期学习项目。"],
  ["lab", "实验室", "Cloudflare Workers、工具箱、项目展示和各种想缝的东西。"],
] as const;

export function PlatformHome({ locale }: { locale: Locale }) {
  return (
    <main>
      <section className="shell" style={{ minHeight: "calc(100svh - 90px)", display: "grid", alignItems: "center", padding: "72px 0" }}>
        <div style={{ maxWidth: 820 }}>
          <p style={{ color: "var(--muted)", margin: 0 }}>技术探索 · 个人知识库 · Edge 实验室</p>
          <h1 style={{ margin: "18px 0", fontSize: "clamp(52px, 9vw, 112px)", lineHeight: 0.92, letterSpacing: "-0.085em" }}>
            温柔地<br />构建未来。
          </h1>
          <p style={{ maxWidth: 620, color: "var(--muted)", fontSize: 20, lineHeight: 1.8 }}>
            这里不是一个普通博客，而是缝合文章、项目、工具、AI 搜索和阅读计划的个人平台。
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
            <Link href={`/${locale}/posts/`} style={{ color: "white", background: "var(--deep)", borderRadius: 999, padding: "13px 18px", fontWeight: 700 }}>
              开始阅读
            </Link>
            <Link href={`/${locale}/lab/`} style={{ border: "1px solid var(--line)", borderRadius: 999, padding: "13px 18px", fontWeight: 700 }}>
              看看实验室
            </Link>
          </div>
        </div>
      </section>
      <section className="shell" style={{ padding: "40px 0 96px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 1, overflow: "hidden", borderRadius: 34, border: "1px solid var(--line)", background: "var(--line)", boxShadow: "0 24px 80px rgba(54, 43, 32, 0.14)" }}>
          {modules.map(([href, title, description], index) => (
            <Link key={href} href={`/${locale}/${href}/`} style={{ minHeight: 230, padding: 26, background: "var(--paper)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted)", fontSize: 13 }}>{String(index + 1).padStart(2, "0")}</span>
              <span>
                <strong style={{ display: "block", fontSize: 26, marginBottom: 10 }}>{title}</strong>
                <span style={{ color: "var(--muted)", lineHeight: 1.65 }}>{description}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
