# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using React 19 with the App Router. This version has breaking changes from earlier Next.js versions — always read the relevant guide in `node_modules/next/dist/docs/` before writing code.

## Commands

```bash
# Development
pnpm dev          # Start dev server at localhost:3000

# Build & Production
pnpm build        # Production build
pnpm start        # Start production server

# Linting
pnpm lint         # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16.2.0 with App Router
- **React**: 19.2.4 (canary releases built-in for App Router)
- **Styling**: Tailwind CSS v4 with `@tailwindcss/postcss`
- **Language**: TypeScript (strict mode enabled)
- **Linting**: ESLint 9 with `eslint-config-next`

## Architecture

### App Router Structure

- `app/` - App Router directory (primary routing)
- `app/layout.tsx` - Root layout with Geist fonts
- `app/page.tsx` - Home page
- `app/globals.css` - Global styles with Tailwind CSS v4 syntax (`@import "tailwindcss"`, `@theme inline`)

### Path Aliases

- `@/*` maps to the project root (configured in tsconfig.json)

## Key Next.js 16 Features

### Instant Navigation

When building pages that should navigate instantly:
1. Export `unstable_instant` from the route segment to validate caching structure
2. Wrap uncached data in `<Suspense>` boundaries at the component level
3. Use `'use cache'` directive for cacheable data

```tsx
export const unstable_instant = { prefetch: 'static' }
```

### Cache Components

Enable in `next.config.ts` with `cacheComponents: true`. Combined with proper Suspense boundaries, this produces instant navigations.

### Params Handling

In dynamic routes like `[slug]`, `params` is a Promise. Components that await it need their own `<Suspense>` boundary:

```tsx
<Suspense fallback={<p>Loading...</p>}>
  {params.then(({ slug }) => <Component slug={slug} />)}
</Suspense>
```

## Important Notes

- The App Router uses React canary releases with all stable React 19 changes plus newer framework-validated features
- Always check deprecation notices in `node_modules/next/dist/docs/` when implementing features
- Tailwind CSS v4 uses new syntax: `@import "tailwindcss"` instead of `@tailwind` directives
