import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/features/i18n/lib/config";
import { getAllPosts, getPostBySlug, getPostStaticParams } from "@/features/posts/lib/content";
import { buildPostJsonLd, buildPostMetadata } from "@/features/posts/lib/seo";
import { PostArticle } from "@/features/posts/components/PostArticle";
import { renderMarkdownToHtml } from "@/shared/markdown/render";

export function generateStaticParams() {
	return getPostStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
	const { locale, slug } = await params;
	if (!isLocale(locale)) return {};
	const post = getPostBySlug(locale as Locale, decodeURIComponent(slug));
	if (!post) return {};
	return buildPostMetadata(post, getAllPosts());
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
	const { locale, slug } = await params;
	if (!isLocale(locale)) notFound();
	const post = getPostBySlug(locale as Locale, decodeURIComponent(slug));
	if (!post) notFound();
	const html = await renderMarkdownToHtml(post.markdown);

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPostJsonLd(post)) }} />
			<PostArticle post={post} html={html} />
		</>
	);
}
