import { notFound } from "next/navigation";
import { isLocale } from "@/features/i18n/lib/config";

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return <main className="shell" style={{ padding: "72px 0" }}><p>{locale}</p><h1>{decodeURIComponent(slug)}</h1><p>文章详情将在 Markdown 渲染阶段接入。</p></main>;
}
