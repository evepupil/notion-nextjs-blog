---
title: 'Hello Chaosyn Lab'
published: 2026-04-27
description: '新一代个人平台的第一篇测试文章，用于验证 Markdown 内容读取与文章页渲染。'
image: ''
tags: ["Next.js", "Cloudflare", "SEO"]
draft: false
lang: 'zh-CN'
translationKey: 'hello-chaosyn'
category: '技术'
---

# Hello Chaosyn Lab

这是一篇用于验证新博客平台 Markdown 渲染管线的测试文章。

## 当前目标

- 从 `content/posts/zh` 读取 Markdown。
- 解析 frontmatter。
- 生成文章列表和详情页。
- 保持 SEO metadata 可控。

## 代码示例

```ts
export const runtime = "edge";
```

后续正式内容会通过 Notion 同步脚本自动写入。
