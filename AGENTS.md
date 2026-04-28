# AGENTS.md — notion-nextjs-blog

如果遇到了读取错误乱码的文件，请先使用 `jiemi.exe <文件路径>` 解密后再读取。

## 项目定位

这是 `潮思 Chaosyn` 的新一代个人平台，不只是博客主题。

核心目标：

- 迁移旧 Astro/Fuwari 博客的内容与能力。
- 保持 SEO-first：稳定 URL、canonical、hreflang、sitemap、RSS、robots、JSON-LD。
- 使用 Next.js App Router 构建可扩展平台：文章、图书、友链、工具、实验室、AI Search。
- 部署目标为 Cloudflare Pages / OpenNext Cloudflare，优先支持 Edge Runtime。
- 内容发布源继续使用 Notion 同步生成的 Markdown 文件。

## 交流与协作

- 默认使用简体中文回复。
- 技术术语保留英文原文，例如 `App Router`、`Edge Runtime`、`Cloudflare Pages`。
- 不确定时先查证或从代码中验证，不要猜。
- 重要结构调整、依赖替换、URL 策略变化、部署策略变化，先说明方案再改。
- 不要为了“顺手优化”修改无关代码。

## 技术栈约定

- Runtime / package manager：`Bun`。
- Framework：`Next.js App Router`。
- Language：`TypeScript`，保持 `strict` 风格。
- UI components：`shadcn/ui`，组件源码放在 `shared/ui`，按需添加，不做全量引入。
- Icons：`lucide-react`，图标按组件直接 import，避免字符串映射和全量图标注册。
- Deploy：`Cloudflare Pages` + `@opennextjs/cloudflare`。
- Edge：Next.js `app/api/**/route.ts` 优先使用 `export const runtime = "edge"`，除非明确需要 Node-only 能力。
- Content：Markdown (`.md`)，不是 MDX。
- Content sync：沿用 Notion → Markdown → Git commit → Cloudflare Pages build 的发布流。
- 工程原则参考 CloudMind 中的 `ankigenix项目技术栈和项目规范`：Strict TypeScript、Server-first data fetching、Schema-first、Feature-based modular architecture、可选基础设施优雅降级。

## 常用命令

在项目根目录 `D:\myproject\notion-nextjs-blog` 执行：

- 安装依赖：`bun install`
- 本地开发：`bun run dev`
- 单元测试：`bun test`
- 生产构建：`bun run build`
- Cloudflare 构建：`bun run cf:build`
- Cloudflare 预览：`bun run cf:preview`
- 同步 Notion 文章：`bun run sync-notion`
- 同步友链：`bun run sync-friends`
- 提交 IndexNow：`bun run indexnow:submit`

提交完成前至少运行与改动相关的最小验证。涉及路由、SEO、构建配置时运行 `bun test` 和 `bun run build`。

## 目录结构约定

坚持 feature-based 结构。

```txt
app/          Next.js 路由入口，保持薄层
features/     按业务能力组织代码
shared/       跨 feature 复用的 UI、配置、工具
content/      Markdown 发布源与本地图片资源
data/         JSON 数据，例如 friends.json
scripts/      Notion 同步、IndexNow、迁移脚本
tests/        Bun 单元测试
public/       静态公共资源
```

### `app/` 规则

- 只放路由入口、layout、metadata、redirect、route handler。
- 不要在 `app/**/page.tsx` 里堆业务逻辑。
- 页面应调用 `features/*` 或 `shared/*` 中的组件和函数。
- `app/api/**/route.ts` 只做请求解析、权限/环境检查、响应封装，业务逻辑放到 `features/*/lib`。

### `features/` 规则

每个业务模块自包含：

```txt
features/<name>/
  components/   该功能专属组件
  lib/          数据读取、路由、SEO、业务逻辑
  types.ts      该功能专属类型
```

已规划 feature：

- `features/posts`：文章读取、列表、详情、TOC、SEO、旧链接跳转。
- `features/books`：图书、章节、目录。
- `features/friends`：友链展示与提交。
- `features/search`：站内搜索数据与 UI。
- `features/ai`：AI Search、sources、streaming。
- `features/i18n`：语言、路径、字典。
- `features/seo`：metadata、sitemap、robots、JSON-LD。
- `features/platform`：首页平台入口和模块展示。

### `shared/` 规则

- `shared/ui`：无业务含义的基础 UI；`shadcn/ui` 组件统一生成到这里。
- `shared/layout`：站点壳、Header、Footer、移动导航。
- `shared/config`：站点配置、导航配置。
- `shared/markdown`：Markdown 解析、渲染、heading tree、reading time。
- `shared/lib`：通用工具，如 `date`、`url`、`fs`、`env`。

不要让 `shared` 反向依赖 `features`。

## 路由与 i18n

- 新站正式路径使用语言前缀：`/zh/...`、`/en/...`。
- 中文语言码使用 `zh`，英文使用 `en`。
- 默认语言是 `zh`。
- 正式文章路径：
  - `/zh/posts/[slug]/`
  - `/en/posts/[slug]/`
- 只兼容旧文章链接：
  - `/posts/[slug]/` → `/zh/posts/[slug]/`
  - `/posts/en/[slug]/` → `/en/posts/[slug]/`
- 不需要兼容旧的 about/friends/archive/sponsors URL。
- 新 sitemap 只提交新 URL，不提交 legacy URL。
- canonical 永远指向新 URL。

## SEO 规则

SEO 是本项目一等公民。

- 每个可索引页面必须有明确 `title`、`description`、canonical。
- 多语言对应页面必须输出 `hreflang` 与 `x-default`。
- 文章页必须输出 `BlogPosting` JSON-LD。
- 图书/项目页后续按内容类型补结构化数据。
- `robots.txt` 不得禁止 `/_next/`、图片、CSS、JS 等渲染资源。
- `sitemap.xml` 只包含 canonical URL。
- 旧文章 URL 使用永久跳转，不进入 sitemap。
- 分页、标签、归档页是否收录要显式设计，避免重复低质量索引。

## Markdown 内容规则

- 内容源是 `.md`，不要默认改成 `.mdx`。
- Notion 同步脚本输出目录：
  - 中文文章：`content/posts/zh`
  - 英文文章：`content/posts/en`
  - 图片：`content/assets/images`
  - 友链：`data/friends.json`
- 文章 frontmatter 应尽量稳定：`title`、`published`、`description`、`image`、`tags`、`draft`、`lang`、`translationKey`、`category`、`notionSync`。
- 不要手动破坏 `notionSync: true` 文章的同步标记。
- 图片应优先本地化，避免依赖 Notion 临时图片 URL。
- Markdown 渲染管线应集中在 `shared/markdown` 或 `features/posts/lib`，不要散落到页面组件里。

## TypeScript / React / Next.js 规范

- TypeScript 默认按严格模式写代码；新增或调整 `tsconfig` 时优先保持：`strict`、`noImplicitAny`、`noImplicitReturns`、`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes`、`noUnusedLocals`、`noUnusedParameters`、`noFallthroughCasesInSwitch`、`forceConsistentCasingInFileNames`。
- 优先写 Server Components；只有交互组件才加 `"use client"`。
- 不要在 Client Component 中读取文件系统、环境密钥或服务端内容。
- 数据读取优先在 server/module 层完成，避免客户端瀑布请求。
- 数据变更必须通过受控服务端入口：`Server Actions`、`app/api/**/route.ts` 或明确的服务层函数。不要在客户端直接拼接敏感请求或调用第三方密钥服务。
- 独立异步任务用 `Promise.all` 并行。
- 避免 barrel import 造成 bundle 膨胀；优先直接 import 具体文件。
- 类型导入使用 `import type`。
- 组件 props 使用明确类型，不使用 `any`，除非封装第三方不稳定数据且有注释说明。
- 明确处理 `undefined` / `null`，优先使用类型守卫、联合类型、泛型和类型推导解决类型问题。
- 尽量避免非空断言 `!`；如果使用，必须能从上文看出值已经被验证。
- 函数命名表达业务含义，不使用单字母变量。
- 不要在组件内部定义子组件，除非该子组件确实只依赖局部闭包且不会造成重渲染问题。
- 静态配置和不变数组提升到 module scope。
- Edge Route 中不要使用 Node-only API，除非该路由明确不是 Edge Runtime。

### App Router 细则

- `layout.tsx` 只放跨页面壳、全局 metadata、provider 和稳定布局。
- `page.tsx` 保持薄层：读取 params/searchParams、调用 feature 层数据函数、渲染 feature 组件。
- `generateMetadata` 只组合 metadata，不做复杂数据转换；复杂 SEO 逻辑放入 `features/*/lib/seo.ts` 或 `features/seo/lib/*`。
- `generateStaticParams` 只生成必要静态路径，避免把临时/草稿/legacy URL 放入正式构建路径。
- `loading.tsx`、`error.tsx`、`not-found.tsx` 可按路由段添加，但不要重复实现通用 UI；复用 `shared/ui`。
- Client Component 边界尽量下沉，只包住搜索框、语言切换、主题切换、AI 聊天等真正需要浏览器状态的部分。

### 数据与校验规范

- 外部输入必须在边界校验：route handler 入参、Server Actions、表单提交、Notion/第三方 webhook、环境变量。
- 如果引入 schema 库，优先使用 `Zod`；在未引入前，也要用显式解析函数和类型守卫，避免把未知结构直接传入业务逻辑。
- 对外部服务做适配层封装，例如 Notion、Cloudflare AI、IndexNow、搜索服务，不要在页面组件里直接调用第三方 SDK。
- 可选服务未配置时必须优雅降级，例如 AI Search、统计、广告、IndexNow，不应阻塞文章构建和核心页面渲染。
- 日志、监控、限流、第三方集成不应阻塞主流程；失败时返回可诊断错误或降级结果。

### 代码风格补充

- 统一使用双引号、分号、2 空格缩进。
- imports 保持有序：React/Next → 第三方库 → `@/features/*` → `@/shared/*` → 相对路径。
- 禁止未使用的 imports、变量、参数；需要保留的参数用清晰命名说明用途。
- 当前项目尚未配置 Biome；如后续加入格式化工具，优先考虑 Biome，并保持自动整理 imports。

## 测试规则

- 使用 `bun test`。
- 业务规则优先写测试，尤其是：
  - i18n 路由生成。
  - legacy redirect。
  - Markdown frontmatter 解析。
  - slug/path 规范化。
  - sitemap URL 生成。
  - SEO metadata 生成。
- 新增可测试业务函数时，先补 `tests/*.test.ts`。
- 页面视觉和占位组件可用构建验证；核心纯函数必须有单元测试。

## Cloudflare / Edge 约定

- 部署目标是 Cloudflare Pages + OpenNext Cloudflare。
- `wrangler.jsonc` 保持 `nodejs_compat`，不要随意删除。
- 首版优先静态生成内容页，Edge API 只用于 AI Search、搜索数据、友链提交、IndexNow 等动态能力。
- 不要一开始引入 D1/KV/R2/Vectorize，除非具体 feature 需要。
- 如果未来需要独立 Worker，放到 `workers/<name>`，不要混进 Next.js 页面代码。

## Notion 同步与 CI

- 现有发布流是核心资产：Notion 更新 → GitHub Actions 同步 Markdown → 自动提交 → Cloudflare Pages 构建。
- 首选复用并小步调整旧脚本，不要一次性重写同步链路。
- GitHub Actions 只提交 `content/` 和 `data/` 的同步结果。
- 同步脚本缺少环境变量时应清晰报错，不要静默生成空内容。
- 自动同步提交信息保持可读，方便排查哪天内容变化导致构建或 SEO 问题。

## UI 与设计方向

- 当前视觉方向：D 混合型，即“日系轻博客底色 + 轻赛博个人实验室首页 + 极简阅读页”。
- 首页是个人平台入口，不是传统文章列表。
- 文章页必须阅读优先：正文宽度克制、层级清楚、少特效、代码块舒适、TOC 清晰。
- 工具、实验室、AI 页面可以更有科技感，但不要牺牲性能和可访问性。
- 避免廉价霓虹、过度毛玻璃、卡片堆满屏、模板博客感。
- 基础交互组件优先复用 `shadcn/ui`，例如 `Button`、`Badge`、`Card`、`Separator`、`Dialog`、`Command`。
- 图标优先使用 `lucide-react`，保持线性、轻量、低装饰感；按钮内图标遵循 shadcn 的 `data-icon` 约定。
- 不为了使用组件库而破坏现有“日系轻博客 + 轻赛博实验室”视觉 token；必要时用 `app/globals.css` 中的语义变量适配。

## 禁止事项

- 不要把项目重新改回旧 Fuwari/Astro 风格。
- 不要把内容源切到 MDX，除非前辈明确批准。
- 不要移除旧文章 URL 跳转。
- 不要让 legacy URL 出现在 sitemap/canonical 中。
- 不要在 `app/` 页面里写大量业务逻辑。
- 不要把 Cloudflare Edge route 写成依赖 Node-only API 的实现。
- 不要新增大型依赖来解决小问题。
- 不要提交密钥、token、`.env.local`。

## 当前已知注意点

- 当前项目还很早期，`posts/books/search/ai` 多数是骨架或占位。
- `bun run build` 曾出现过上级目录 lockfile 干扰警告；如复现，优先检查工作区 root 与 lockfile。
- 如果项目尚未初始化 Git，涉及 Git 状态/提交的操作需要先确认仓库状态。
