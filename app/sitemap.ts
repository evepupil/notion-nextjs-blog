import type { MetadataRoute } from "next";
import { locales } from "@/features/i18n/lib/config";
import { getAllPosts } from "@/features/posts/lib/content";
import { getPostSitemapEntries } from "@/features/posts/lib/seo";
import { siteConfig } from "@/shared/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
	const staticEntries = locales.flatMap((locale) => [
		{
			url: `${siteConfig.url}/${locale}/`,
			lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: locale === "zh" ? 1 : 0.8,
    },
    {
      url: `${siteConfig.url}/${locale}/posts/`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
			priority: 0.8,
		},
	]);

	return [...staticEntries, ...getPostSitemapEntries(getAllPosts())];
}
