# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Note: `AGENTS.md` points at `node_modules/next/dist/docs/` — that directory does **not** exist for the installed version. The project runs **Next.js 15.2.8 / React 19 App Router**, so standard Next 15 conventions apply (`params` and `searchParams` are Promises and must be awaited).

## Commands

```bash
npm run dev      # dev server on :3000
npm run build    # production build (also the only full typecheck — tsconfig has noEmit)
npm start        # serve the production build
npm run lint     # next lint (ESLint is NOT configured; Biome is the real linter)
npx biome check --write .   # lint + format + organize imports
npx tsc --noEmit            # typecheck without a full build
```

There is no test suite and no test runner installed.

## Environment

`NEXT_DATOCMS_API_TOKEN` (read-only DatoCMS CDA token) must be set in `.env` — see `.env.example`. It is server-only (no `NEXT_PUBLIC_` prefix); any component reading it must stay a Server Component.

## Architecture

Single-language (pt-BR) personal portfolio. All UI strings are hardcoded in Portuguese in JSX — `i18next`/`react-i18next` are in `package.json` but unused; do not assume an i18n layer exists.

**Two content sources, deliberately split:**

1. **Static JSON** in [src/utils/](src/utils/) — `owner.json`, `projects.json`, `experiences.json`, `courses.json`, `skills.json`, `resumes.json`. Imported directly into components at build time (`import projectsData from "@/utils/projects.json"`). Editing the site's own profile/projects content means editing these files, not a CMS.
2. **DatoCMS GraphQL** — blog posts only (`allPosts` / `post` on the `Post` model: `name`, `description`, `category`, `tags`, `externalLink`, `image`, `text` as Structured Text, `isPublished`). Fetched via [performRequest](src/lib/datocms.tsx), a thin `fetch` wrapper around `https://graphql.datocms.com/`. Queries are inline template-literal strings colocated with the component that uses them; there is no generated GraphQL type layer, so response shapes are hand-declared as local `interface Post` in each file.

**Rendering model.** Pages and section components are async Server Components that fetch/read data and render; interactivity lives in leaf `"use client"` components (`navigation-header`, `mobile-sidebar`, `theme-toggle`, the two `filter.tsx` files, and most of `components/ui/`). Filters are URL-state driven: client filter components write to `searchParams` via `useRouter().replace()`, and the server page re-reads them from the awaited `searchParams` promise and does the filtering/sorting in JS over the full result set.

**Page composition.** [src/app/page.tsx](src/app/page.tsx) is a thin shell that stacks the section components from [src/components/sections/](src/components/sections/), each owning its own data access and its own `id` anchor (`#home`, `#skills`, `#projects`, `#experiencia`, `#cursos`, `#blog`) that the sticky nav links to. `/articles` and `/projects` are the "see all" pages with filtering; `/articles/[id]` renders a DatoCMS post.

**Structured Text is rendered by hand.** [src/app/articles/[id]/page.tsx](src/app/articles/[id]/page.tsx) walks `text.value.document.children` with a switch over `paragraph | list | blockquote` and an exhaustiveness check — adding a new node type in DatoCMS requires extending both the union types and that switch (`datocms-structured-text-*` renderers are not installed).

**Icons** are re-exported through [src/components/icons/index.ts](src/components/icons/index.ts) (Tabler). Import from `@/components/icons`, not `@tabler/icons-react`, and add the icon to that barrel first. JSON-driven icons (e.g. `owner.json` `socialLinks[].icon`) are resolved through a name→component map in the consuming component, so a new icon name in JSON also needs a map entry.

## Conventions

- shadcn/ui, "new-york" style, `rsc: true`, Lucide as the shadcn icon library — new primitives go in `src/components/ui/` via the shadcn CLI. `cn()` from [src/lib/utils.ts](src/lib/utils.ts) for class merging.
- Tailwind v4, CSS-first: theme tokens are `@theme inline` + CSS variables in [src/app/globals.css](src/app/globals.css). There is no `tailwind.config.*`; add design tokens as CSS variables there.
- Dark mode via `next-themes` with `attribute="class"` and the `@custom-variant dark` in globals.css. Every new surface needs explicit `dark:` classes — colors are written literally (`text-gray-800 dark:text-neutral-200`) rather than through semantic tokens in most page/section code.
- Biome formatting: **tabs**, double quotes, auto-organized imports. Several files under `src/components/sections/` and `src/app/page.tsx` are currently space-indented and unformatted; run Biome on files you touch.

## Known rough edges

- [src/lib/datocms.tsx](src/lib/datocms.tsx) `console.log`s the API token on every request — remove it if you touch that file.
- `src/app/projects/page.tsx` is under `// @ts-nocheck` and its `Project.technologies` is typed `string` while the JSON holds `string[]`.
- The search filters in both list pages call `.filter()` without using the result, so search is a no-op (the articles search input is also `disabled`); category/status filtering does work.
- `<Head>` from `next/head` is used in App Router pages where it has no effect — use the `metadata` export instead.
