import { permanentRedirect } from "next/navigation";
import { getLegacyPostRedirect } from "@/features/posts/lib/routes";

export default async function LegacyEnPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(getLegacyPostRedirect("en", slug));
}
