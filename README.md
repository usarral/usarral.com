<div align="center">
  <img alt="usarral logo" src="public/logo.svg" width="70" />
</div>
<h1 align="center">usarral.com</h1>

Personal website and technical blog of Carlos (usarral), a software developer based in Spain. Bilingual (English / Spanish), fully static, and deployed on Vercel.

Live at **[usarral.com](https://usarral.com)**.

## Features

- **Blog** in Markdown/MDX with tags, pinned posts, reading time, table of contents and RSS per language.
- **Bilingual**: every page lives under `/en/` and `/es/`, with `hreflang` alternates and a language switch that keeps you on the equivalent page.
- **Projects page** driven by structured data, filterable by technology.
- **Full-text search** with [Pagefind](https://pagefind.app/) (production builds only).
- **Open Graph images** generated at build time with [Satori](https://github.com/vercel/satori).
- **SEO**: sitemap, `robots.txt`, web app manifest, canonical URLs and JSON-LD (`BlogPosting` on posts, `Person`/`WebSite` on home and about, `ItemList` on projects).
- **Comments** through [Giscus](https://giscus.app) (GitHub Discussions).
- **Analytics** with Vercel Analytics and Speed Insights.
- Dark and light themes, accessible semantic markup, JetBrains Mono self-hosted.
- Code blocks with [Expressive Code](https://expressive-code.com/) and custom admonitions.

## Stack

[Astro](https://astro.build) 7 (static output) · [Tailwind CSS](https://tailwindcss.com) 4 · TypeScript · [Biome](https://biomejs.dev) · pnpm · Vercel

## Getting started

Requirements: **Node 24** (see `.nvmrc`; Astro needs at least 22.22) and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

| Command         | What it does                                                         |
| :-------------- | :------------------------------------------------------------------- |
| `pnpm dev`      | Start the dev server                                                 |
| `pnpm build`    | Build to `dist/` and run Pagefind (`postbuild`) to index the content |
| `pnpm preview`  | Serve the production build locally                                   |
| `pnpm check`    | Run `astro check` (types and content) and Biome                      |
| `pnpm lint`     | Run Biome with auto-fix (lint, import order and formatting)          |
| `pnpm format`   | Format with Biome                                                    |

Search only works after a build: run `pnpm build && pnpm preview` to try it.

## Project structure

```
src/
├── content/
│   ├── post/          Blog posts, one file per language (slug.md and slug-es.md)
│   └── tag/           Optional overrides for tag pages
├── data/
│   ├── projects.ts    Projects shown on /projects, with EN and ES text
│   └── techColors.ts  Colour of each technology pill
├── i18n/              Locales, UI strings and helpers
├── pages/
│   ├── [lang]/        Home, about, projects, posts, tags, RSS and 404
│   ├── og-image/      Open Graph image generation
│   └── index.astro    Fallback for "/" (the real redirect lives in vercel.json)
├── components/ layouts/ styles/ plugins/ utils/
└── site.config.ts     Site title, description, URL and menu
```

## Writing content

### Posts

Add a Markdown or MDX file to `src/content/post/`. Each post exists in both languages: `my-post.md` (English, the default) and `my-post-es.md` with `lang: es`. The filename is the slug.

```yaml
---
title: My post          # required, 60 characters max
description: A summary  # required, used for SEO
publishDate: 2026-01-31 # required
lang: en                # "en" (default) or "es"
tags: [docker, devops]
updatedDate: 2026-02-10 # optional
pinned: false           # optional, shows it at the top of the home page
draft: false            # optional, hides it from the production build
coverImage:             # optional
  src: ../../assets/blog/my-post/cover.png
  alt: Describe the image
ogImage: /my-og.png     # optional, skips the generated Open Graph image
---
```

The schema lives in `src/content.config.ts`, so a missing or wrong field fails the build with a clear message. Images for a post go in `src/assets/blog/<slug>/`.

### Tags

Tags are created from the posts' `tags` frontmatter. To customise a tag page, add `src/content/tag/<tag>.md` with an optional `title` and `description`.

### Projects

Edit the `projects` array in `src/data/projects.ts`. Each entry needs a name, summary and description in both languages, a list of technologies and optional links. New technologies get a colour in `src/data/techColors.ts`; otherwise they use the default grey.

### Translations

UI strings are in `src/i18n/ui.ts`, one object per language. Add every new key to both.

## Configuration

- **Site**: title, description, URL and menu in `src/site.config.ts`.
- **Theme**: colours and typography in `src/styles/global.css`.
- **Social links**: `src/components/SocialList.astro`.
- **Open Graph images**: the markup is in `src/pages/og-image/[...slug].png.ts`; the default card is `public/social-card.png`.
- **Environment variables**: none are required.

## Deployment

The site deploys to Vercel from `main`; pull requests get a preview deployment. `vercel.json` holds:

- the `/` redirect, chosen at the edge by the `lang` cookie, then `Accept-Language`, then English;
- security headers, including a `Content-Security-Policy`.

> If you add a third-party script, stylesheet, frame or API call, allow its origin in the CSP in `vercel.json`, and check that nothing is blocked in the browser console. Giscus (`giscus.app`) and Pagefind (WebAssembly) are already allowed.

## Quality and workflow

- **Biome** is the only linter and formatter (tabs, 100 columns). **Husky** runs `astro check` and `biome check --write` before every commit.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/), enforced by commitlint. See [docs/COMMIT_CONVENTIONS.md](docs/COMMIT_CONVENTIONS.md).
- `main` is protected: changes go through pull requests.
- **CI** (`.github/workflows/ci.yml`) runs the type check and the build on every push and pull request.
- **Renovate** opens the dependency updates; majors wait for approval in the Dependency Dashboard.

## Acknowledgements

Started from [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) by Chris Williams, which was inspired by [Hexo Theme Cactus](https://github.com/probberechts/hexo-theme-cactus).

## License

[MIT](LICENSE). The original copyright notice of the Astro Cactus theme is kept.
