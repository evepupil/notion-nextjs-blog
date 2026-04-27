import { notFound } from "next/navigation";
import { isLocale } from "@/features/i18n/lib/config";

export default async function PostsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <main className="shell" style={{ padding: "72px 0" }}><h1>Posts</h1><p>文章列表将在内容迁移阶段接入。</p></main>;
}
