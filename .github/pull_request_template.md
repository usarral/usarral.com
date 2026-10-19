## What does this change?

<!-- A short summary and the reason behind it. Link the issue if there is one: Closes #123 -->

## Type of change

<!-- Match the Conventional Commits type of the PR title (see docs/COMMIT_CONVENTIONS.md). -->

- [ ] `feat`: new feature, page or content
- [ ] `fix`: bug fix
- [ ] `perf` / `refactor`: no change in behaviour
- [ ] `docs` / `chore` / `ci` / `build`: documentation, tooling or dependencies

## Checklist

- [ ] The PR title follows Conventional Commits (it becomes the squash commit message).
- [ ] `pnpm check` passes and `pnpm build` succeeds (Node 24).
- [ ] Content exists in both languages (EN and ES), including new UI strings in `src/i18n/ui.ts`.
- [ ] If it adds a third-party origin (script, style, frame, API), the CSP in `vercel.json` allows it and the browser console shows no violations.
- [ ] Visual changes: checked in light and dark mode, on mobile and desktop.

## Screenshots

<!-- Before / after, if something looks different. Delete this section otherwise. -->
