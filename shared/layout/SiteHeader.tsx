"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/features/i18n/lib/config";

type NavItem = {
  href: string;
  labels: Record<Locale, string>;
};

const navItems: NavItem[] = [
  { href: "", labels: { zh: "首页", en: "Home" } },
  { href: "posts", labels: { zh: "文章", en: "Posts" } },
  { href: "books", labels: { zh: "图书", en: "Books" } },
  { href: "tools", labels: { zh: "工具", en: "Tools" } },
  { href: "lab", labels: { zh: "实验室", en: "Lab" } },
  { href: "ask", labels: { zh: "问问 AI", en: "Ask AI" } },
];

const dictionary = {
  zh: {
    aria: "主导航",
    brand: "潮思",
    hint: "悬停展开导航",
    search: "搜索",
    searchHint: "搜索文章、工具和实验",
    searchPlaceholder: "输入关键词开始搜索…",
    searchEmpty: "搜索功能即将接入静态索引。",
    theme: "切换明暗主题",
    language: "语言",
    command: "Ctrl K",
  },
  en: {
    aria: "Primary navigation",
    brand: "Chaosyn",
    hint: "Hover to open navigation",
    search: "Search",
    searchHint: "Search posts, tools, and labs",
    searchPlaceholder: "Type to search…",
    searchEmpty: "Search will connect to the static index soon.",
    theme: "Toggle color theme",
    language: "Language",
    command: "Ctrl K",
  },
} as const;

function getLocalizedHref(locale: Locale, href: string): string {
  return href ? `/${locale}/${href}/` : `/${locale}/`;
}

function getOppositeLocalePath(pathname: string | null, locale: Locale): string {
  const nextLocale = locale === "zh" ? "en" : "zh";
  if (!pathname) return `/${nextLocale}/`;
  return pathname.replace(/^\/(zh|en)(?=\/|$)/, `/${nextLocale}`);
}

function normalizePath(path: string): string {
  return path.replace(/\/+$/, "") || "/";
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const copy = dictionary[locale];

  const oppositeLocalePath = useMemo(() => getOppositeLocalePath(pathname, locale), [locale, pathname]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = savedTheme === "dark" || (!savedTheme && prefersDark) ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }

      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  return (
    <header className="floating-header">
      <div className="nav-hover-zone">
        <div className="nav-hint" aria-hidden="true">
          <span className="brand-mark">潮</span>
          <span>{copy.hint}</span>
        </div>
        <nav className="floating-nav" aria-label={copy.aria}>
          <Link className="brand-link" href={`/${locale}/`}>
            <span className="brand-mark" aria-hidden="true">潮</span>
            <span>{copy.brand}</span>
          </Link>

          <div className="nav-links">
            {navItems.map((item) => {
              const href = getLocalizedHref(locale, item.href);
              const normalizedHref = normalizePath(href);
              const normalizedPathname = normalizePath(pathname ?? "");
              const isActive =
                normalizedPathname === normalizedHref ||
                (item.href !== "" && normalizedPathname.startsWith(`${normalizedHref}/`));
              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={isActive ? "nav-link is-active" : "nav-link"}
                  key={item.href || "home"}
                  href={href}
                >
                  {item.labels[locale]}
                </Link>
              );
            })}
          </div>

          <div className="nav-actions">
            <button className="nav-action search-trigger" type="button" onClick={() => setIsSearchOpen(true)}>
              <span>{copy.search}</span>
              <kbd>{copy.command}</kbd>
            </button>
            <button className="nav-action icon-action" type="button" aria-label={copy.theme} onClick={toggleTheme}>
              {theme === "dark" ? "☀" : "☾"}
            </button>
            <Link className="nav-action language-action" href={oppositeLocalePath} aria-label={copy.language}>
              {locale === "zh" ? "EN" : "中文"}
            </Link>
          </div>
        </nav>
      </div>

      {isSearchOpen ? (
        <div className="command-overlay" role="presentation" onClick={() => setIsSearchOpen(false)}>
          <section className="command-dialog" role="dialog" aria-modal="true" aria-label={copy.search} onClick={(event) => event.stopPropagation()}>
            <div className="command-input-row">
              <span aria-hidden="true">⌕</span>
              <input autoFocus placeholder={copy.searchPlaceholder} aria-label={copy.searchHint} />
              <kbd>Esc</kbd>
            </div>
            <div className="command-empty">{copy.searchEmpty}</div>
          </section>
        </div>
      ) : null}
    </header>
  );
}
