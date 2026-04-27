# Frontend Redesign Spec

> Status: Draft ready for implementation planning
> Date: 2026-04-27
> Project: `notion-nextjs-blog`

## Goal

Turn the current runnable skeleton into a polished personal platform UI: Chinese-first navigation, soft article cards, complete platform entry points, and a premium reading experience that matches the "日系轻博客 + 轻赛博实验室 + 极简阅读器" direction.

## Current Problems

- `shared/layout/SiteHeader.tsx` uses English labels (`Posts`, `Books`, `Tools`, `Lab`, `Ask AI`) on the Chinese site.
- `features/posts/components/PostCard.tsx` only uses line separation, making the post list feel unfinished and visually flat.
- `app/[locale]/posts/page.tsx` has weak page framing (`Posts / zh`) and no category, tag, search, RSS, or content stats affordances.
- `features/platform/components/PlatformHome.tsx` is a useful skeleton but still looks like a generic module grid.
- `features/posts/components/PostArticle.tsx` has basic readability but lacks a mature reader chrome: language switch, license, edit/source link, related navigation, and mobile TOC behavior.
- Inline styles dominate component files, making visual iteration slow and inconsistent.

## Design Principles

- Chinese-first for `zh`, English-first for `en`; labels, CTAs, empty states, and metadata must be locale-aware.
- Make article pages feel calmer than the homepage; homepage can be more experimental, reading pages should be restrained.
- Prefer soft surfaces over heavy cards: low opacity background, thin border, subtle shadow, stronger typography hierarchy.
- Keep the first viewport unmistakably personal: author identity, recent writing, current experiments, and links to useful modules.
- Avoid generic SaaS cards, noisy glassmorphism, excessive neon, and decorative UI that does not improve navigation or reading.
- Static export remains the deployment baseline until OpenNext + Pages worker stability is confirmed.

## Information Architecture

### Primary Navigation

Chinese labels:

- `首页` -> `/zh/`
- `文章` -> `/zh/posts/`
- `图书` -> `/zh/books/`
- `工具` -> `/zh/tools/`
- `实验室` -> `/zh/lab/`
- `问问 AI` -> `/zh/ask/`

English labels:

- `Home` -> `/en/`
- `Posts` -> `/en/posts/`
- `Books` -> `/en/books/`
- `Tools` -> `/en/tools/`
- `Lab` -> `/en/lab/`
- `Ask AI` -> `/en/ask/`

Header requirements:

- Show brand as `潮思` on `zh`, `Chaosyn` on `en`.
- Show active nav state based on pathname.
- Provide language switch between equivalent `zh` and `en` sections.
- Collapse to a compact two-row or scrollable nav on mobile; no hamburger is required for v1 if all labels remain accessible.
- Keep nav sticky or near-sticky visually, but avoid layout jump and avoid blocking content.

## Page Specs

### Home Page

Goal: establish this as a personal platform, not a blog theme.

Sections:

1. Hero: personal identity, one sentence positioning, primary CTA to posts, secondary CTA to lab.
2. Recent writing: 3-5 latest posts with soft row cards.
3. Platform modules: articles, books, tools, lab, Ask AI as distinct destinations with short utility copy.
4. Current focus: a small status area for what is being built/read/researched.
5. Footer links: RSS, GitHub, analytics/share link if enabled, sitemap.

Visual direction:

- Full-width soft background with very light grid/noise texture.
- One small visual anchor: avatar/monogram/orb, not a large generic hero card.
- Use one accent gradient only: cyan to pink.
- Make module blocks less card-like by using split rows or soft panels with index numbers.

### Posts List Page

Goal: make browsing articles feel complete and calm.

Sections:

1. Header block: localized title, description, post count, last updated date.
2. Utility strip: `全部文章`, category chips, tag/search placeholder, RSS link.
3. Featured row: pinned posts or latest 1-2 posts with stronger layout.
4. Post list: weak card rows with date rail, title, description, category, tags, reading time.
5. Empty state: localized, clear next action.

Post card behavior:

- Default surface: `rgba(255,255,255,0.55)`, 1px border, 20-28px radius.
- Hover: slight translateY(-2px), border accent tint, soft shadow.
- Date should be readable but secondary.
- Tags should be compact; avoid visual noise if many tags by showing first 3 and `+N`.
- Pinned posts should show `精选` / `Featured` badge.

### Post Article Page

Goal: premium static reading page.

Sections:

1. Article hero: category, date, reading time, title, description, tags.
2. Reader layout: content column + desktop sticky TOC.
3. Mobile TOC: inline collapsible section before article body, not a fixed overlay.
4. Article body: improve headings, lists, tables, images, code blocks, blockquotes.
5. After article: license, updated date, back to posts, optional source/edit link.

Reading constraints:

- Content width: 720-820px.
- Font size: 17-18px desktop, 16px mobile.
- Line height: 1.85-1.95 for Chinese body text.
- Code blocks must support horizontal scroll and copy affordance later.
- Tables must be horizontally scrollable.

### Placeholder Module Pages

The current `Ask`, `Books`, `Tools`, and `Lab` pages should no longer look broken.

Each module page needs:

- Localized title and description.
- Status badge: `规划中` / `In planning`, `建设中` / `Building`, or `可用` / `Available`.
- 3-4 planned capabilities as soft rows.
- Link back to home and posts.

This keeps the platform feeling intentional before the full module migration is done.

## Component Architecture

Create shared UI primitives only if they reduce duplicated styles:

- `shared/ui/LocalizedText.ts` or plain dictionaries for labels.
- `shared/ui/SectionHeader.tsx` for page intro blocks.
- `shared/ui/SoftPanel.tsx` for weak surfaces.
- `shared/ui/Pill.tsx` for tags/status/meta chips.
- `shared/layout/SiteFooter.tsx` for RSS/sitemap/social links.

Feature components:

- `features/platform/components/HomeHero.tsx`
- `features/platform/components/HomeRecentPosts.tsx`
- `features/platform/components/ModuleRail.tsx`
- `features/posts/components/PostsPageHeader.tsx`
- `features/posts/components/PostFilters.tsx`
- `features/posts/components/PostCard.tsx` refactor
- `features/posts/components/PostArticle.tsx` refactor
- `features/posts/components/PostArticleFooter.tsx`

## CSS Direction

Move repeated inline styles into `app/globals.css` utility classes:

- `.shell`, `.shell-narrow`
- `.soft-panel`, `.soft-row`, `.soft-pill`
- `.eyebrow`, `.muted`, `.page-title`
- `.reader-grid`, `.reader-body`
- `.focus-ring`

Keep CSS plain for now; do not introduce shadcn or a heavy animation library in v1.

## Accessibility Requirements

- All nav links must have visible focus states.
- Color contrast must remain readable on the cream background.
- Mobile layout must not require horizontal scrolling except code/table blocks.
- Language switch must have clear text or `aria-label`.
- Do not rely on color alone for active nav or pinned state.

## Acceptance Criteria

- `zh` navigation is fully Chinese; `en` navigation is fully English.
- `/zh/posts/` no longer looks like a raw list; each article has a soft card/row treatment.
- `/zh/` reads as a complete personal platform homepage.
- `/zh/ask/`, `/zh/books/`, `/zh/tools/`, `/zh/lab/` look intentionally designed even before full features are implemented.
- `/zh/posts/[slug]/` remains readable and gains better meta/TOC/footer structure.
- `bun test` passes.
- `bun run pages:build` passes and outputs static `out` without `_worker.js`.
