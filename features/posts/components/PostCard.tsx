import Link from "next/link";
import { getPostPath } from "@/features/posts/lib/routes";
import type { PostSummary } from "@/features/posts/types";

const formatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article
      style={{
        padding: "26px 0",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <Link href={getPostPath(post.locale, post.slug)}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", color: "var(--muted)", fontSize: 14 }}>
          <time dateTime={post.published.toISOString()}>{formatter.format(post.published)}</time>
          <span>{post.readingTime.minutes} min read</span>
          {post.category ? <span>{post.category}</span> : null}
        </div>
        <h2 style={{ margin: "10px 0", fontSize: "clamp(26px, 4vw, 42px)", letterSpacing: "-0.05em", lineHeight: 1.08 }}>
          {post.title}
        </h2>
        {post.description ? <p style={{ margin: 0, maxWidth: 720, color: "var(--muted)", lineHeight: 1.75 }}>{post.description}</p> : null}
        {post.tags.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
            {post.tags.map((tag) => (
              <span key={tag} style={{ border: "1px solid var(--line)", borderRadius: 999, padding: "5px 9px", color: "var(--muted)", fontSize: 13 }}>
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </Link>
    </article>
  );
}
