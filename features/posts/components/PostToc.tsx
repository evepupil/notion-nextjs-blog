import type { PostHeading } from "@/features/posts/types";

export function PostToc({ headings }: { headings: PostHeading[] }) {
  if (headings.length === 0) return null;

  return (
    <nav aria-label="文章目录" style={{ position: "sticky", top: 110, padding: 20, border: "1px solid var(--line)", borderRadius: 24, background: "var(--paper)" }}>
      <strong style={{ display: "block", marginBottom: 12 }}>目录</strong>
      <ol style={{ display: "grid", gap: 8, listStyle: "none", margin: 0, padding: 0 }}>
        {headings.map((heading) => (
          <li key={`${heading.depth}:${heading.slug}`} style={{ paddingLeft: Math.max(0, heading.depth - 1) * 12 }}>
            <a href={`#${heading.slug}`} style={{ color: "var(--muted)", fontSize: 14 }}>{heading.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
