---
target: "usarral.com (whole site: home, projects, post, about, es)"
total_score: 26
max_score: 36
na_heuristics: 10
p0_count: 0
p1_count: 3
timestamp: 2026-07-26T17-45-59Z
slug: usarral-com-site
---
Method: dual-agent (A: design-review sub-agent · B: detector/browser-evidence sub-agent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Instant, synchronous feedback everywhere (aria-checked switches, filter-count banner, GitHub-card skeleton pulse); no async waits on a static site. |
| 2 | Match System / Real World | 3 | Nav/terminology plain and clear; Home's bio paragraph is generic boilerplate that undersells the site's own real-client-work positioning. |
| 3 | User Control and Freedom | 3 | Filter-clear button and native `<dialog>` Escape-to-close for search; but LangToggle's custom dropdown only closes on outside-click, no Escape handler. |
| 4 | Consistency and Standards | 3 | Strong system-wide consistency, but Projects page skips a heading level (h1→h3, confirmed independently by both the design review and the automated detector), plus two components (Search, LangToggle) break the site's own no-shadow rule. |
| 5 | Error Prevention | 3 | No forms/destructive actions to misuse; single-active-filter model prevents confusing multi-filter states; `rel="noreferrer"` used correctly throughout. |
| 6 | Recognition Rather Than Recall | 3 | Icons are conventional and sr-labelled; tech-pill filter behavior relies on one line of intro copy, and icon-toggles have no visible (non-sr-only) text labels. |
| 7 | Flexibility and Efficiency of Use | 2 | Real Cmd/Ctrl+K search shortcut exists; but tech-pill filtering supports only one active filter at a time, and no shortcuts exist for theme/language toggles. |
| 8 | Aesthetic and Minimalist Design | 3 | This is the system's home turf — restrained, one accent, no clutter — undercut by the About page's near-emptiness and Home's Pinned/Posts content duplication. |
| 9 | Error Recovery | 3 | Custom, localized 404 with plain-language message and a link home. |
| 10 | Help and Documentation | n/a | No help system exists or is warranted — personal portfolio/blog, not a product with a learning curve. |

**Total: 26/36** (heuristic 10 scored n/a — genuinely inapplicable to this surface) → **72.2% → Good**

## Design Specificity Verdict

**LLM assessment**: The visual *system* is genuinely specific, not category-interchangeable — and it's not just documented, it's measurably implemented. The design reviewer verified the light/dark accent swap directly via OKLCH→sRGB contrast math (coral-on-paper: 5.09:1; cactus-green-on-slate: 6.85:1, both passing WCAG AA), confirmed the dashed-at-rest→solid-on-hover border rule is implemented literally as `DESIGN.md` specifies, and confirmed there is truly no primary CTA button anywhere on the site — an unusual, disciplined restraint most "developer portfolio" templates cave on.

Genericness creeps back in at the content layer, not the system: Home's bio paragraph ("I love to learn new things... always looking for new challenges") could belong to any developer's site and actively undersells the real named client work documented in `src/data/projects.ts`. The About page is a near-duplicate of Home. And two overlay components — `Search.astro` (`shadow-sm` + `backdrop:backdrop-blur-sm`) and `LangToggle.astro` (`shadow-lg`) — use real box-shadows/blur, directly violating DESIGN.md's own "Flat-By-Conviction" Don't. These read as unmodified leftovers from the Astro Cactus starter theme that never got re-skinned into the site's own vocabulary.

**Deterministic scan**: CLI detector (`detect.mjs`) came back clean (exit 0, zero findings) across `src/pages`, `src/components`, `src/layouts`. The browser-injected overlay detector, run live against all 5 pages, found real issues the static scan couldn't see:
- **Skipped heading level** on `/en/projects/` (h1 → h3, no h2) — found independently by both assessments, from two different methods (source reading vs. live DOM inspection). High-confidence finding.
- **Long line-length (~101 chars/line)** on Home, About, and `/es/` — outside comfortable reading measure. Notably, the blog post page did *not* trigger this, consistent with DESIGN.md's stated intent that long-form post content targets prose measure via Tailwind Typography; the other pages have no such treatment.
- **A `width`/`height` CSS transition** on all 5 pages (layout-thrashing risk; likely the mobile nav dropdown) — not sanctioned anywhere in DESIGN.md, which documents only transform/opacity-based motion (the theme-toggle icon morph).
- **A first-viewport column overflow** on the blog post page (one column runs 248% of viewport height while its sibling fits in 32%) — likely an inherent property of a long article next to a short TOC sidebar rather than a defect, but worth a look.
- EN/ES parity confirmed at the browser level: `/es/` reproduced the identical finding set to `/en/`, including the same content-duplication issue (see Priority Issues) — no locale-specific regression.
- The intentional light/dark accent hue swap was correctly *not* flagged by either detector pass — the tooling didn't produce a false alarm on the system's signature move.

**Visual overlays**: Browser-based overlay evidence was gathered directly in the sub-agents' isolated tabs (this session did not keep a live user-facing `[Human]` tab open across the whole critique); the per-page finding lists above are the overlay's output, reported verbatim by the isolated detector agent.

## Overall Impression

The hard, distinctive design work — color, type, and border system — got done and holds up under direct measurement. The easier, more content-driven work didn't receive the same discipline: a generic bio paragraph, a near-empty About page, a single-page-reachable contact link, and two overlay components that quietly abandon the site's own flat vocabulary. The single biggest opportunity: the site's strongest credibility signal (real government/enterprise client work, a Discord bot with 3M users) lives one click away on `/projects/`, while Home leads with copy so generic it doesn't hint that signal exists.

## What's Working

1. **The theme/accent system is executed with real discipline, not just documented.** Verified via direct OKLCH contrast math and source inspection — the coral↔cactus-green swap and dashed→solid border rule both ship exactly as `DESIGN.md` specifies. Most style guides like this stay aspirational; this one didn't.
2. **EN/ES bilingual parity is real, not aspirational.** Verified directly in the running site: identical structure, full string translation, and — tellingly — the same content-duplication bug reproduced faithfully in both languages. PRODUCT.md calls this "a feature, not an afterthought"; confirmed true in practice.
3. **The blog reading experience is well-crafted and on-brand.** Sticky TOC, breadcrumbs, decorative anchors reinforcing the terminal identity, muted left-border admonitions instead of loud alert boxes, and a contextual (not persistent) back-to-top button.

## Priority Issues

**[P1] About page is functionally a duplicate of Home, not an independent page**
- **What**: `src/pages/[lang]/about.astro` renders the exact same bio string already shown on Home, plus one GitHub link. Its own meta description promises "more about me... and the technologies I work with" — a promise the page doesn't keep.
- **Why it matters**: the recruiter/hiring-manager audience — one of PRODUCT.md's two co-equal audiences — clicking "About" for depth gets *less* content than they already saw on Home, right at the moment they were leaning in.
- **Fix**: give About unique content — technology/experience detail, a short timeline, or at minimum the missing LinkedIn link — distinct from Home's one paragraph.
- **Suggested command**: `/impeccable clarify`

**[P1] LinkedIn — the recruiter's preferred contact channel — is reachable from exactly one page**
- **What**: `SocialList.astro` (GitHub + LinkedIn) only ever renders from Home. Footer links GitHub only; Header has no social icons; About links GitHub only.
- **Why it matters**: a recruiter convinced by Projects has no path to LinkedIn without navigating back to Home specifically. For an audience PRODUCT.md names as co-equal, this is real, avoidable friction on the one action that matters most to them.
- **Fix**: add the LinkedIn/GitHub links to the persistent Footer (or Header) so they're reachable from every page.
- **Suggested command**: `/impeccable layout`

**[P1] Projects page accessibility: tech-pill "wall of options," duplicate tab stops, and a skipped heading level**
- **What**: Every project card renders its tech stack as independently-clickable, sitewide-filter buttons inline (up to 9 per card, ~41 total), each a separate tab stop, with no visible affordance beyond one line of intro copy. Each card's primary link also appears twice in the tab order (a visible link, then an invisible full-card overlay anchor to the same href). Separately — and confirmed independently by both the design review (source reading) and the automated browser detector (live DOM scan) — the page's `<h1>` ("Projects") is followed directly by `<h3>` card titles with no `<h2>` in between.
- **Why it matters**: on a site where PRODUCT.md marks accessibility as a hard requirement, a keyboard/screen-reader user must tab through dozens of low-information filter buttons and duplicate links per card, and a screen-reader user navigating by heading level hits an unexplained jump. Sighted users likely never discover the filter feature exists at all, since nothing about a pill signals "clickable control" until hover.
- **Fix**: separate the filter control from the content it labels (one shared filter row above the grid), drop the redundant full-card overlay link, and insert a proper heading level (or restructure card titles) between the page h1 and card titles.
- **Suggested command**: `/impeccable optimize`

**[P2] "Flat-by-conviction" is broken in exactly the two places it's most visible**
- **What**: `Search.astro` (`shadow-sm` + `backdrop:backdrop-blur-sm`) and `LangToggle.astro` (`shadow-lg`) both use real box-shadows/blur — directly contradicting DESIGN.md's stated Don't. Notably, the deterministic CLI scan came back clean on these files; this is a finding the design review caught that the automated tooling missed.
- **Why it matters**: these are the only two moments in the entire site where the UI actually elevates above the base surface, and both abandon the site's own signature restraint for generic starter-theme defaults.
- **Fix**: replace both with the documented flat vocabulary — a tonal fill (the GitHub card's `bg-global-text/5` precedent) plus the existing border, no shadow/blur.
- **Suggested command**: `/impeccable harden`

**[P2] Home page: "Pinned Posts" and "Posts" currently show the same 3 entries twice**
- **What**: `index.astro` renders `pinnedPosts` and `latestPosts` as two separate lists; currently all 3 pinned posts are also the 3 most recent posts, so the identical 3 titles appear twice in one scroll, reproduced in both EN and ES.
- **Why it matters**: reads as a bug on first impression and spends the scarce above-the-fold "peak" real estate on redundant, not additive, information.
- **Fix**: exclude pinned-post IDs from the `latestPosts` slice, or suppress "Pinned Posts" when it has zero non-overlapping value versus "Posts."
- **Suggested command**: `/impeccable distill`

## Persona Red Flags

**Jordan (Confused First-Timer)**, arriving via search directly onto a blog post:
- The decorative `#` glyph before each heading has no `href` — Jordan, expecting a GitHub/Reddit-style permalink, clicks it and gets nothing.
- Landing directly on a post, Jordan has zero context about who Carlos is unless they notice the small breadcrumb and click through — no inline "about the author" cue on the post itself.

**Sam (Accessibility-Dependent, keyboard/screen reader)**:
- `LangToggle`'s dropdown has no Escape-key handler — only closes via outside click.
- On Projects, Sam tabs through each card's destination twice (visible link, then invisible overlay anchor) and must pass up to 9 tech-pill buttons per card first — the e-RVC card alone is 9 extra tab stops.
- Confirmed heading-level skip on Projects (h1 → h3, no h2) — noticeable when navigating by heading level.

**Alex (Impatient Power User / the "fellow developer" reader)**:
- Cmd/Ctrl+K search exists (genuinely good), but theme and language toggles have no keyboard shortcut.
- Tech-pill filtering supports exactly one active filter — Alex can't combine "Docker" + "Node.js" to narrow further, a real ceiling on a feature shaped like a power-user tool.

**Elena, the Hiring Manager** (project-specific persona, derived from PRODUCT.md's recruiter/client audience):
- **Profile**: screens many candidate sites weekly, ~30-60 seconds per site on first pass, not deeply technical, looking for scale/impact signals and real client names over tech-stack detail.
- **Behaviors**: skims Home's bio in under 10 seconds, clicks straight to Projects, reads card titles/first-line summaries more than full paragraphs, then looks for a way to make contact.
- **Red flags**: Home's generic bio doesn't surface "real government/enterprise client work" in her first 10 seconds — she has to already be committed enough to click through to Projects to find that signal. If she then checks About expecting more depth, she finds less than Home already gave her — a credibility ding at exactly the wrong moment. Having found Projects convincing, her preferred contact channel (LinkedIn) isn't on that page, the footer, or the header — only back on Home, a page she may not revisit.

## Minor Observations

- Home's bio paragraph is generic filler copy that undercuts PRODUCT.md's own positioning ("not a generic portfolio template").
- Long line-length (~101 chars/line) on Home, About, and `/es/` — outside comfortable reading measure; found by the browser detector, not addressed anywhere in DESIGN.md as an intentional exception for these pages (unlike post content, which correctly targets prose measure).
- A `width`/`height` CSS transition (likely the mobile nav dropdown) appears on all 5 pages — a layout-thrashing risk not sanctioned anywhere in DESIGN.md, which documents only transform/opacity-based motion.
- `global.css` hardcodes `#666` gray twice instead of deriving from the documented OKLCH ink tokens — invisible to users but a small crack in an otherwise disciplined token system.
- Secondary/muted text (dates, summaries, footer copy) consistently uses Tailwind's stock `gray-600/400`/`zinc-200/700` rather than a token derived from `ink-slate`/`heading-ink` — an undocumented "second neutral palette" running alongside the one DESIGN.md documents.
- The blog post's circular "back to top" button (solid-filled `zinc-200`/`zinc-700`) is the only fully circular, solid-filled chrome outside the avatar exception DESIGN.md carves out — worth confirming this is an intended second exception.
- Project cards have visibly uneven internal whitespace because CSS grid stretches each row to its tallest card.
- Search is honestly dev-disabled with a clear message in local dev — production search UX could not be evaluated in this review.
- The detector's own console output has a count/label mismatch (header says "2 anti-patterns found" while 3-4 individual finding lines are actually logged) across all 5 pages — a quirk in the tool itself, not a site defect.

## Questions to Consider

- If the strongest credibility signal (named government/enterprise clients, a Discord bot with 3M users) lives on `/projects/`, why does Home open with generic "I love learning new things" copy instead of leading with one concrete proof point already sitting in `projects.ts`?
- About currently says *less* than Home. What is About actually *for*, if not to go deeper than the homepage bio?
- Tech pills serve double duty as content labels *and* a sitewide filter control — is that dual purpose serving either reader well, or would a dedicated filter row above the grid serve both audiences better than 41 inline buttons?
- Is LinkedIn's single-page reachability a deliberate choice (PRODUCT.md says this isn't an active job search) or an accidental gap?
- Would the flat/dashed system read as *more* deliberate if the two components that currently break it (search modal, language dropdown) were instead the ones that most showed the system off?
