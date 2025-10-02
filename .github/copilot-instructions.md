# MintWatch Development Guide

## Architecture Overview
MintWatch is a **browser extension that replaces Niconico's video player** with a custom React-based interface. Built with **WXT framework**, it injects a complete replacement UI for watch/ranking/search pages while blocking the original site's scripts and styling.

### Core Architecture Pattern
1. **Content Script Entry** (`entrypoints/index.content.ts`): Detects target pages and initializes router
2. **Script Blocking** (`utils/initiator/router.ts`): Aggressively blocks original site scripts using MutationObserver
3. **DOM Replacement**: Completely replaces page content with React components

## Project Structure (MintWatch-specific)
```
entrypoints/           # Extension entry points (background, content scripts, popup pages)
├── background.ts      # Extension lifecycle, welcome/update pages
├── index.content.ts   # Main content script injection logic
└── watch_injector.ts  # Video player injection script

components/
├── Router/           # SPA routing system for extension pages
├── PMWatch/          # Video player components (core feature)
├── ReShogi/          # Ranking page components
├── Search/           # Search page components
└── Global/           # Shared UI components and base styles

utils/apis/           # Niconico API wrappers (auto-imported)
hooks/apiHooks/       # React Query hooks for API calls (auto-imported)
types/               # TypeScript definitions for Niconico API responses (auto-imported)
e2e/                 # Playwright tests with browser extension loading
```

## Development Patterns

### Extension Script Blocking Strategy
```typescript
// Pattern: Block all original scripts before DOM loads
const observer = new MutationObserver((records) => {
    records.forEach((record) => {
        // Block script elements immediately
        elem.querySelectorAll("script").forEach(blockScriptElement)
    })
})
```

### API Integration Pattern
- **API Functions**: `utils/apis/*.ts` - Direct fetch calls with error handling
- **React Hooks**: `hooks/apiHooks/*.ts` - React Query wrappers
- **Example**: `useSearchExpandData(query)` → `searchExpand(query)` → Niconico API

### Storage Architecture
- **WXT Storage**: Use `storage.setItem()`, not browser.storage directly
- **React Integration**: Use `useStorageVar()` for reactive storage values
- **Storage Keys**: Prefixed (`sync:`, `local:`) for organization

### Component & Styling
- **No `export default`** - Use `export function ComponentName()`
- **Data attributes over className**: `[data-active="true"]` instead of `.active`
- **PostCSS nested without `&`**: Direct nesting supported
- **Style modules**: `components/<component>/styleModules/*.css`
- **Global variables**: Defined in `components/Global/baseUI.css`

## Development Workflow
```bash
pnpm install          # Required: PNPM (not NPM)
pnpm run dev          # Development with HMR
pnpm run dev:firefox  # Firefox development
pnpm run build        # Production build
pnpm run e2e          # Playwright tests with extension (run after production build)
```

## Testing Strategy
- **E2E with Extension**: Tests load actual built extension in browser
- **API Mocking**: `e2e/fixtures.ts` provides mock responses for Niconico APIs
- **Page Detection**: Tests verify content script injection on specific URL patterns

## Critical Implementation Details
- **Meta tag protection**: Rename `server-context` → `server-context-mw` to avoid deletion
- **Favicon handling**: Replace with Niconico's original favicon
- **React Query**: Configured with `staleTime: Infinity` for aggressive caching
- **Icon variants**: Different icons for dev (`icon-dev/`) vs production builds