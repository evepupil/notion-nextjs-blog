# Deployment And Runtime Spec

> Status: Draft ready for implementation planning
> Date: 2026-04-27
> Project: `notion-nextjs-blog`

## Goal

Keep the public blog stable on Cloudflare Pages while preserving a future path for Edge/Worker features.

## Current Decision

The production deployment baseline is static export:

- `next.config.ts` uses `output: "export"`.
- Cloudflare Pages build command is `bun run pages:build`.
- Cloudflare Pages output directory is `out`.
- `scripts/clean-pages-output.js` removes stale `out` and `.open-next` before build.
- `scripts/prepare-static-pages-output.js` writes Cloudflare `_redirects`.
- No `_worker.js` should be present in `out` for the public blog deployment.

## Why

The OpenNext/Pages worker attempt produced runtime 500 for all routes with:

```txt
TypeError: components.ComponentMod.handler is not a function
```

This is different from earlier build-time Node compatibility errors. The stable fix is to deploy static output first, then reintroduce dynamic functions only behind isolated boundaries.

## Cloudflare Pages Settings

Use these settings in the Pages project:

- Framework preset: None
- Build command: `bun run pages:build`
- Build output directory: `out`
- Root directory: `/`
- Environment variables:
  - `BUN_VERSION=1.3.8`
  - `NODE_VERSION=22`

`wrangler.jsonc` should keep:

```jsonc
{
  "name": "notion-nextjs-blog",
  "compatibility_date": "2025-09-01",
  "compatibility_flags": ["nodejs_compat"],
  "pages_build_output_dir": "out"
}
```

## Redirects

Only article legacy links are guaranteed:

```txt
/posts/en/:slug/ /en/posts/:slug/ 301
/posts/:slug/ /zh/posts/:slug/ 301
/posts/en/:slug /en/posts/:slug/ 301
/posts/:slug /zh/posts/:slug/ 301
```

Do not add broad legacy redirects without evidence of public links.

## Future Edge Strategy

Dynamic features should be introduced in this order:

1. Keep the main blog static.
2. Add standalone Worker under `workers/<name>` for isolated dynamic features.
3. Route only specific paths to the Worker, such as `/api/ask` or `/api/friends/submit`.
4. Avoid making the whole site depend on a Worker runtime until OpenNext compatibility is verified in CI and preview.

## Acceptance Criteria

- `bun run pages:build` generates `out` successfully.
- `out/_worker.js` does not exist.
- `out/zh/posts/index.html`, `out/robots.txt`, `out/sitemap.xml`, and `out/_redirects` exist.
- Production `/zh/`, `/zh/posts/`, `/robots.txt`, and `/sitemap.xml` return 200 after deployment.
- Legacy `/posts/[slug]/` returns 301 to `/zh/posts/[slug]/`.
