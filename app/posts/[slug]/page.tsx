import { permanentRedirect } from "next/navigation";
import { getLegacyPostRedirect } from "@/features/posts/lib/routes";

export default async function LegacyZhPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(getLegacyPostRedirect("zh", slug));
}
