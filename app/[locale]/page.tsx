import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/features/i18n/lib/config";
import { PlatformHome } from "@/features/platform/components/PlatformHome";

export const metadata: Metadata = {
  title: "个人数字实验室",
};

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PlatformHome locale={locale as Locale} />;
}
