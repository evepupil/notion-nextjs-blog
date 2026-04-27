import type { Post } from "@/features/posts/types";
import { PostToc } from "./PostToc";

const formatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function PostArticle({ post, html }: { post: Post; html: string }) {
  return (
    <main className="shell" style={{ padding: "72px 0 110px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 260px", gap: 44, alignItems: "start" }}>
        <article style={{ maxWidth: 820 }}>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>
            <time dateTime={post.published.toISOString()}>{formatter.format(post.published)}</time>
            <span> · {post.readingTime.minutes} min read</span>
          </div>
          <h1 style={{ margin: "18px 0", fontSize: "clamp(42px, 7vw, 76px)", lineHeight: 1, letterSpacing: "-0.075em" }}>{post.title}</h1>
          {post.description ? <p style={{ color: "var(--muted)", fontSize: 19, lineHeight: 1.8 }}>{post.description}</p> : null}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "24px 0 42px" }}>
            {post.tags.map((tag) => (
              <span key={tag} style={{ border: "1px solid var(--line)", borderRadius: 999, padding: "6px 10px", color: "var(--muted)", fontSize: 13 }}>
                #{tag}
              </span>
            ))}
          </div>
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
        <aside>
          <PostToc headings={post.headings} />
        </aside>
      </div>
    </main>
  );
}
