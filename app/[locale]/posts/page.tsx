import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/features/i18n/lib/config";
import { getAllPosts } from "@/features/posts/lib/content";
import { PostList } from "@/features/posts/components/PostList";

export default async function PostsPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	const posts = getAllPosts(locale as Locale);

	return (
		<main className="shell" style={{ padding: "72px 0 110px" }}>
			<p style={{ color: "var(--muted)", margin: 0 }}>Posts / {locale}</p>
			<h1 style={{ margin: "12px 0 24px", fontSize: "clamp(44px, 7vw, 80px)", letterSpacing: "-0.075em", lineHeight: 1 }}>文章</h1>
			<PostList posts={posts} />
		</main>
	);
}
