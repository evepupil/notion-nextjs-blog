import Link from "next/link";
import type { Locale } from "@/features/i18n/lib/config";
import { siteConfig } from "@/shared/config/site";

const navItems = [
  ["posts", "Posts"],
  ["books", "Books"],
  ["tools", "Tools"],
  ["lab", "Lab"],
] as const;

export function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="shell" style={{ paddingTop: 16 }}>
      <nav
        aria-label="主导航"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "12px 16px 12px 18px",
          border: "1px solid var(--line)",
          borderRadius: 999,
          background: "rgba(255, 252, 247, 0.72)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 10px 40px rgba(60, 46, 35, 0.08)",
        }}
      >
        <Link href={`/${locale}/`} style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800 }}>
          <span
            aria-hidden="true"
            style={{
              width: 32,
              height: 32,
              borderRadius: 12,
              display: "grid",
              placeItems: "center",
              color: "white",
              background: "linear-gradient(135deg, var(--accent), var(--accent-pink))",
            }}
          >
            潮
          </span>
          {siteConfig.shortName}
        </Link>
        <div style={{ display: "flex", gap: 6, color: "var(--muted)", fontSize: 14 }}>
          {navItems.map(([href, label]) => (
            <Link key={href} href={`/${locale}/${href}/`} style={{ padding: "9px 10px" }}>
              {label}
            </Link>
          ))}
        </div>
        <Link
          href={`/${locale}/ask/`}
          style={{ color: "white", background: "var(--deep)", borderRadius: 999, padding: "10px 14px", fontSize: 14 }}
        >
          Ask AI
        </Link>
      </nav>
    </header>
  );
}
