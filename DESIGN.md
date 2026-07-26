---
name: usarral.com
description: A terminal-flat, monospace developer site where one accent color blooms coral by day and cactus-green by night.
colors:
  paper-white: "oklch(98.48% 0 0)"
  heading-ink: "oklch(18.15% 0 0)"
  ink-slate: "oklch(26.99% 0.0096 235.05)"
  desert-bloom: "oklch(55.27% 0.195 19.06)"
  muted-teal-link: "oklch(55.44% 0.0431 185.69)"
  quote-bloom: "oklch(55.27% 0.195 19.06)"
typography:
  headline:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  xs: "2px"
  sm: "4px"
  md: "6px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  2xl: "64px"
components:
  icon-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.heading-ink}"
    rounded: "{rounded.md}"
    padding: "8px"
    height: "36px"
    width: "36px"
  icon-toggle-hover:
    backgroundColor: "transparent"
    textColor: "{colors.desert-bloom}"
    rounded: "{rounded.md}"
  tech-pill:
    backgroundColor: "transparent"
    textColor: "{colors.heading-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  tech-pill-active:
    backgroundColor: "{colors.desert-bloom}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  project-card:
    backgroundColor: "transparent"
    textColor: "{colors.ink-slate}"
    rounded: "{rounded.md}"
    padding: "16px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.desert-bloom}"
    typography: "{typography.body}"
    padding: "16px 8px"
---

# Design System: usarral.com

## Overview

**Creative North Star: "The Terminal Garden"**

The site reads as a desert terminal: a spartan, monospace console where almost nothing is decorative and one living accent color does all the emotional work. Every line of body copy, every heading, every button label is set in the same monospace face — there is no separate display font pretending to be editorial. Structure is carried by size and weight steps within that one typeface, not by switching typefaces.

The system is flat by conviction, not by omission: no shadows exist anywhere in the codebase. Depth and grouping come from low-opacity tonal borders and dashed strokes instead — a "stitched" quality that echoes both a terminal's plain rules and a cactus's ribbed, dashed silhouette. The one indulgence is the accent color, and even that indulgence is disciplined: it changes meaning between light and dark rather than multiplying into a full palette.

This is a personal, text-first site (see PRODUCT.md) for a developer audience as much as a recruiting one, and the visual system matches that: it never reaches for a marketing "hero," a filled call-to-action button, or imagery. Links, dashed borders, and small tech-colored chips are the entire vocabulary.

**Key Characteristics:**
- One monospace typeface for literally everything; hierarchy is size/weight only.
- Fully flat — zero shadows; depth is low-opacity tonal fills and dashed rules.
- Small, restrained radii (2–6px) except fully circular avatars.
- A single accent color that swaps hue by theme (Desert Bloom coral in light, Cactus Night green in dark) rather than expanding into a multi-color palette.
- No primary CTA button exists anywhere; the interaction vocabulary is text links, icon toggles, and filter chips.

## Colors

The palette is minimal and role-driven: a near-white/near-black ink pair, one accent, and one link color — all defined in OKLCH as the project's normative color space.

### Primary
- **Desert Bloom** (`oklch(55.27% 0.195 19.06)` in light mode / **Cactus Night** `oklch(70.91% 0.1415 163.7)` in dark mode): the one accent color in the system. Used for the accent-color caret, hover states on nav links and icon toggles, active tech pills, and quote marks. It is the only color in the system that visibly changes identity between themes.

### Neutral
- **Paper White** (`oklch(98.48% 0 0)` light / **Night Slate** `oklch(23.64% 0.0045 248)` dark): page background (`--color-global-bg`).
- **Ink Slate** (`oklch(26.99% 0.0096 235.05)` light / **Soft Fog** `oklch(83.54% 0 264)` dark): default body text color (`--color-global-text`).
- **Heading Ink** (`oklch(18.15% 0 0)` light / near-white `oklch(94.66% 0 0)` dark): reserved for headings and card titles (`--color-accent-2`) — deliberately purer black/white than body text for contrast at larger sizes.
- **Muted Teal Link** (`oklch(55.44% 0.0431 185.69)` light / pink `oklch(70.44% 0.1133 349)` dark): underline/hover color for inline text links (`--color-link`), distinct from the accent.

### Named Rules
**The Desert Bloom / Cactus Night Rule.** The accent color is not a fixed hue — it is a warm coral bloom (`oklch(55.27% 0.195 19.06)`) in light mode and a cactus green (`oklch(70.91% 0.1415 163.7)`) in dark mode. Any future work must preserve this theme-driven hue swap on the accent token rather than flattening it to one color across themes; it is the system's signature move, not an inconsistency to fix.

**The One Accent Rule.** Only one accent color is active at a time. Tech pills borrow arbitrary brand colors for their own badges (see Components), but those are content-identity colors, not part of the site's own palette — they never bleed into buttons, links, or headings.

## Typography

**Body Font:** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` (system monospace stack; no webfont is loaded)

**Character:** One monospace voice throughout — technical, unpretentious, terminal-like. There is no serif or humanist sans anywhere in the system; even page titles are set in the same face as body copy, just larger and bolder.

### Hierarchy
- **Headline** (600 weight, 1.5rem / 24px, 1.2 line-height): page `<h1>` titles (`.title` class). Used once per page.
- **Title** (600 weight, 1.25rem / 20px, 1.3 line-height): section subheads within a page (e.g. "Pinned Posts", "Posts").
- **Body** (400 weight, 0.875rem / 14px, 1.6 line-height): all running copy, the global default set on `<body>`. Long-form post content targets prose measure via Tailwind Typography.
- **Label** (500 weight, 0.6875–0.75rem / 11–12px, 1.4 line-height): dates, tech pills, filter-banner meta, footer nav — small supporting text that is never the reading focus.

### Named Rules
**The One Voice Rule.** Every text role uses the same monospace family. A future addition of a serif/display face for "editorial" moments would break the system's identity; resist it even under pressure to make headings feel "designed."

## Layout

Content lives in a single centered column (`max-w-3xl`, ~48rem) with responsive side padding (`px-4` mobile → `px-8` from `sm:`). The header logo and nav sit inline on mobile and shift to a sidebar-style stacked column on `sm:` and up (`sm:flex-col`, logo mark absolutely positioned to the left of the column). There is no multi-column marketing layout anywhere — even the projects grid is a simple `sm:grid-cols-2`, capped at two columns.

Vertical rhythm is generous and stepped: `gap-1`/`gap-1.5` (4–6px) inside compact clusters like tech-pill rows, `gap-4` (16px) between list items, `mt-16` (64px) between major page sections, and a large `mb-28` (112px) reserved specifically under the header before content starts. Bilingual routing (`/{locale}/...`) does not change the layout, only the content.

## Elevation & Depth

Fully flat. No `box-shadow` appears anywhere in the codebase. Depth and grouping are conveyed entirely through low-opacity tonal fills (`bg-global-text/5`, `bg-blue-400/5`) and border treatments (`border-accent-2/15`, `border-accent-2/20`) rather than shadows or blur.

### Named Rules
**The Flat-By-Conviction Rule.** Never introduce a `box-shadow`, a lifted card, or a blurred backdrop. Any need for a "layer" above the base surface should be solved with a low-opacity tonal fill or a border, matching the terminal-flat identity.

## Shapes

Radii are small and utilitarian: `2px` on inline code, `4px` (default `rounded`) on filter banners and expressive-code blocks, `6px` (`rounded-md`) on cards and icon-toggle buttons. The one exception is fully circular (`rounded-full`) avatars in the GitHub card. Borders favor a **dashed** style at low opacity for structural dividers (project-card default border, `<hr>`, table foot rules, the project filter banner) — solid, full-opacity, colored borders are reserved for active/hover states only, not resting states.

### Named Rules
**The Dashed-at-Rest Rule.** Structural borders default to `dashed` and low-opacity tonal color. A border only becomes solid and full-color accent when it signals hover/active state (e.g. a project card's border going from dashed `border-accent-2/15` to solid `border-accent/60` on hover).

## Components

### Text Links
- **Style:** underline with a small offset (`underline-offset-2`), default underline decoration inherits text color; on hover the decoration color switches to the link color and thickens (`decoration-2`).
- **Character:** understated by default, becomes visibly "clickable" only on hover/focus — never colored at rest.

### Icon Toggle Buttons (theme / language / search)
- **Shape:** `rounded-md` (6px), fixed 36×36px hit target (`h-9 w-9`), 8px internal padding.
- **Default:** transparent background, icon inherits heading-ink color.
- **Hover:** icon color shifts to the accent color (Desert Bloom / Cactus Night); no background fill on hover.
- **Behavior:** theme toggle uses `role="switch"` with `aria-checked`, animating between sun/moon icon via scale+opacity, not a swap.

### Tech Pills / Filter Chips
- **Style:** `rounded` (4px), 11px label text, 1px border at low-opacity heading-ink (`border-accent-2/20`), transparent background at rest.
- **Color:** background and border fill with the *tech's own brand color* (e.g. Angular red, Docker blue) with a matched text color when active — the only place in the system where colors outside the site's own palette appear, because they represent external brand identity, not site branding.
- **Two roles, not one component:** a single shared row of filter buttons (one per unique technology, `aria-pressed` toggles the sitewide filter, only one active at a time) sits above the project grid. Per-card pills inside `ProjectCard` are static, non-interactive badges that only reflect content — they light up (`data-active`) when they match the active sitewide filter, but are not separate tab stops or click targets. This split exists specifically so a project card with many tags doesn't turn into a wall of duplicate filter buttons in the tab order.

### Project Cards
- **Corner Style:** `rounded-md` (6px).
- **Border:** dashed, low-opacity heading-ink at rest (`border-accent-2/15`); on hover (only when the card links out) the border solidifies to accent color at 60% opacity.
- **Background:** transparent (no fill) at all times — the border and text carry the whole card.
- **Internal Padding:** 16px, with an internal `gap-3` (12px) stack for header/description/pills/links.

### GitHub Card (webmention/repo embed)
- **Corner Style:** `rounded-md` (6px).
- **Background:** low-opacity heading-ink tonal fill (`bg-global-text/5`) — the one component that does use a background fill, since it needs to read as an embedded "card" distinct from the page.
- **Loading state:** `animate-pulse` skeleton using the same tonal fill, text made transparent.

### Admonition Callouts
- **Style:** left-border accent only (`border-s-2`), no box background beyond a very faint tint keyed to the admonition type (note=blue, tip=lime, important=purple, caution=orange, warning=red) at 5% opacity.
- **Icon:** a small masked SVG glyph per type, colored to match the border.

### Navigation (Header / Footer)
- **Style:** flat text links, `font-semibold`, accent color in the header nav; footer nav is neutral gray with hover underline.
- **Active state:** `aria-current="page"` on the current route's link (styling hook only — no distinct visual treatment beyond what `aria-current` selectors may add).
- **Mobile:** header nav collapses into a `hidden`/`flex` dropdown panel triggered by a custom-element hamburger button (line ↔ cross icon morph), not an off-canvas drawer.

## Do's and Don'ts

### Do:
- **Do** keep every text role in the same monospace stack; size and weight carry hierarchy, not typeface switching.
- **Do** let the accent color swap hue between light (Desert Bloom coral) and dark (Cactus Night green) themes — this is the system's signature, not a bug to normalize.
- **Do** default structural borders to dashed and low-opacity; reserve solid, full-color borders for hover/active states.
- **Do** use tech-pill brand colors only for external technology identity (Docker blue, Angular red, etc.), never bleed them into site chrome.
- **Do** keep depth flat: tonal opacity fills and borders, never shadows.

### Don't:
- **Don't** introduce a `box-shadow`, lifted card, or blurred backdrop anywhere in the system.
- **Don't** add a second typeface (serif/display/humanist-sans) for "editorial" moments; it breaks the One Voice Rule.
- **Don't** add a filled primary CTA button. This system has no button-as-hero pattern — links, icon toggles, and chips are the entire interaction vocabulary; inventing a bold CTA button would be off-brand.
- **Don't** flatten the accent color to a single fixed hue across both themes.
- **Don't** increase corner radii beyond the established 2–6px scale (excluding the intentionally circular avatar) without a confirmed direction change.
