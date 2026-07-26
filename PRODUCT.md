# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted about equally:

- Recruiters, hiring managers, and potential freelance/consulting clients evaluating Carlos's (usarral) credibility and project experience before reaching out.
- Fellow developers arriving at a specific technical post (via search or social) about Docker, Angular, TypeScript, Spring Boot, NestJS, deployment/security/automation topics — the portfolio is secondary to them.

Site is bilingual (English/Spanish) to serve both a Spanish-speaking and international audience.

## Product Purpose

A personal site and technical blog for Carlos (usarral), a Spain-based software developer. It exists to document real project work and technical writing over time and to build a public technical presence. It is not currently driving an active job search or lead-generation funnel — the goal is personal record and thought leadership, not conversion.

## Positioning

Not a generic "portfolio template" — the project list is real, named client/employer work (Catalonia's public vineyard registry, Generalitat de Catalunya language-services applications, SAP ERP customization for hotel chains, IoT stage-effect systems, a Discord bot that reached 3M users) alongside personal experiments (NASA Space Apps ML flood detection, this site itself). The blog covers concrete operational topics (Docker deployments, CI/CD, self-hosting, AI/security) rather than generic career content.

## Operating Context

- Static site built with Astro, deployed via a custom CI/CD pipeline (Vercel).
- Content authored in Markdown/MDX under `src/content/post` (and a currently-disabled `note` type), each post/note existing in paired EN/ES files.
- Projects are hand-maintained structured data in `src/data/projects.ts`, not CMS-driven.
- Dark/light theme switch and EN/ES language switch are existing, load-bearing features of the reading experience.
- Search (Pagefind) only works in production builds, not local dev.

## Capabilities and Constraints

- Confirmed functionality: blog with tags, RSS, OG image generation (Satori), full-text search (Pagefind), project listing filterable by technology, bilingual routing (`/`, `/es/`), dark/light theme.
- Stack (Astro, static output, Tailwind) reflects current implementation choices, not a stated hard constraint from the user — treat as strong incumbent default rather than an immovable rule.
- No CMS, no backend, no user accounts, no comments system currently.

## Brand Commitments

- Name: usarral.com / "Usarral" (author: Carlos, GitHub `usarral`).
- Built on the Astro Cactus starter theme as the incumbent visual/component system (see DESIGN.md once documented).
- Bilingual EN/ES is a durable commitment, not incidental — both locales must stay in parity.

## Evidence on Hand

- Real project descriptions with names, tech stacks, and links are already in `src/data/projects.ts` (e-RVC, Catalan language services platform, SAP ABAP4 for hotel chains, The Box of the Boss, GDM La Merced, usarral.com itself, Astra5, NodeBot, butler-ci-cli).
- Real blog posts under `src/content/post`, each with paired EN/ES versions.
- No testimonials, case-study metrics beyond what's already stated (e.g. NodeBot's 3M users / 27,000 servers), or press — future work must not fabricate additional social proof, client quotes, or metrics.

## Product Principles

1. Document real work truthfully — every project and post reflects actual work done; no invented case studies, clients, or metrics.
2. Serve two readers without picking one — the credibility-scanning visitor and the post-reading visitor are both first-class; neither should be designed away.
3. Bilingual parity is a feature, not a translation afterthought — EN and ES content and UI stay in lockstep.
4. Personal record over funnel — the site optimizes for an honest, lasting technical presence, not for maximizing contact-form conversions.
5. Static and fast stays the default — prefer solutions that keep the site statically buildable over ones that require a backend or runtime service, absent an explicit decision to change that.

## Accessibility & Inclusion

Accessibility is a hard requirement, not a nice-to-have. The incumbent implementation already reflects this intent (skip-to-content link, semantic HTML per the Astro Cactus base, themed for both light and dark). Treat WCAG-level accessibility as binding for all future work on this site, including bilingual content and any new components.
