import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/features/i18n/lib/config";
import { SiteHeader } from "@/shared/layout/SiteHeader";

export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale}>
      <body>
        <SiteHeader locale={locale as Locale} />
        {children}
      </body>
    </html>
  );
}
