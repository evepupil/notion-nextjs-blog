import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/features/i18n/lib/config";
import { getPostBySlug, getPostStaticParams } from "@/features/posts/lib/content";
import { getPostPath } from "@/features/posts/lib/routes";
import { PostArticle } from "@/features/posts/components/PostArticle";
import { renderMarkdownToHtml } from "@/shared/markdown/render";
import { siteConfig } from "@/shared/config/site";

export function generateStaticParams() {
	return getPostStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
	const { locale, slug } = await params;
	if (!isLocale(locale)) return {};
	const post = getPostBySlug(locale as Locale, decodeURIComponent(slug));
	if (!post) return {};
	const path = getPostPath(post.locale, post.slug);

	return {
		title: post.title,
		description: post.description,
		alternates: {
			canonical: path,
		},
		openGraph: {
			type: "article",
			title: post.title,
			description: post.description,
			url: `${siteConfig.url}${path}`,
			publishedTime: post.published.toISOString(),
			tags: post.tags,
		},
	};
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
	const { locale, slug } = await params;
	if (!isLocale(locale)) notFound();
	const post = getPostBySlug(locale as Locale, decodeURIComponent(slug));
	if (!post) notFound();
	const html = await renderMarkdownToHtml(post.markdown);

	return <PostArticle post={post} html={html} />;
}
