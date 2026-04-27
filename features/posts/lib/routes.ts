import type { Locale } from "@/features/i18n/lib/config";
import { withLocale } from "@/features/i18n/lib/config";

export function normalizeSlug(slug: string): string {
  return slug.replace(/^\/+|\/+$/g, "");
}

export function getPostPath(locale: Locale, slug: string): string {
  return withLocale(locale, `/posts/${normalizeSlug(slug)}/`);
}

export function getLegacyPostRedirect(locale: Locale, slug: string): string {
  return getPostPath(locale, slug);
}
