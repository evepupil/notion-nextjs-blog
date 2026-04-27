export const locales = ["zh", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function normalizeLocale(value?: string): Locale {
  const normalized = value?.replace(/_/g, "-").toLowerCase();
  return normalized === "en" ? "en" : defaultLocale;
}

export function withLocale(locale: Locale, path: string): string {
	const normalizedPath = path.replace(/^\/+/, "");
	const localizedPath = `/${locale}/${normalizedPath}`.replace(/\/+$/, "");
	return `${localizedPath}/`;
}
