import type { PostSummary } from "@/features/posts/types";
import { PostCard } from "./PostCard";

export function PostList({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) {
    return <p style={{ color: "var(--muted)", lineHeight: 1.8 }}>当前语言还没有已发布文章。同步 Notion 内容后会显示在这里。</p>;
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={`${post.locale}:${post.slug}`} post={post} />
      ))}
    </div>
  );
}
