# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Type-check + build to dist/
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

Deploy:
```bash
npm run build && firebase deploy   # Firebase Hosting (recommended)
# or
npm run build && vercel --prod
```

There are no tests configured.

## What This Is

**Green Spaces Memory Map** — a community web app where users pin favourite natural spaces (trails, summits, parks, beaches, urban green spaces) on a world map, attaching a photo and short story. Earth Day weekend project, anonymous contributions only (no auth).

## Architecture

**React 19 + Vite + TypeScript**, deployed as a static SPA. All state lives in `App.tsx` — no external state library.

### Source layout

```
src/
  types/
    memory.ts              # Shared types: Memory, MemoryType, MapBounds, AddMemoryInput, FilterValue
  components/
    ui/                    # Primitive reusable components
      TypePill.tsx         # Badge (sm) + filter button (md) for memory types
      BottomSheet.tsx      # Mobile swipe-up surface
      Drawer.tsx           # Desktop slide-in panel
      Modal.tsx            # Generic backdrop + centered card wrapper
      FilterBar.tsx        # Filter pill grid; exports FILTER_ORDER constant
      MemoryListItem.tsx   # Unified memory list row (desktop + mobile)
    features/              # Feature-level components
      Sidebar.tsx          # Desktop left panel — filter + scrollable memory list
      MemoryCard.tsx       # Memory detail (compact mode for map popups, full mode for panel)
      AddMemoryPanel.tsx   # Add memory form — EXIF extraction, map pin, Firebase write
      MapView.tsx          # Leaflet map with custom SVG pins
      IntroModal.tsx       # Welcome modal shown on first visit
    layout/
      Header.tsx           # App header bar with logo and "Pin a memory" CTA
    theme/
      typeConfig.ts        # MemoryType → label/emoji/Tailwind class mapping
  hooks/
    useMemories.ts         # Real-time Firestore onSnapshot subscription
    useSystemTheme.ts      # System dark mode detection + applies .dark class to <html>
  lib/
    firebase.ts            # Firebase init (Firestore + Storage)
    memories.ts            # Firestore/Storage CRUD helpers (subscribeToMemories, addMemory, uploadImage)
  App.tsx                  # Root component; owns all app state
  index.css                # Tailwind directives + Leaflet overrides + iOS fixes
```

### Key files

- `src/types/memory.ts` — single source of truth for all shared TypeScript types
- `src/lib/memories.ts` — Firestore/Storage CRUD; imports types from `src/types/memory.ts`
- `src/hooks/useMemories.ts` — real-time Firestore subscription with 300ms bounds debounce
- `src/App.tsx` — root component; owns all state (`memories`, `selectedMemory`, `activeFilter`, `isAddingMemory`, `isListOpen`, `mapBounds`, `hoveredId`)
- `src/components/theme/typeConfig.ts` — maps each `MemoryType` + `'all'` to label, emoji, and Tailwind bg/text classes

### Data model (`memories/{id}` in Firestore)

```ts
{
  id, location, lat, lng, date, story,
  type: 'trail' | 'summit' | 'park' | 'beach' | 'urban',
  author, imageUrl, createdAt
}
```

### Map pins

Custom SVG teardrops rendered via `L.divIcon` (inline, no external assets). Highlighted pins (on hover) are larger with a glow effect. Type-to-colour mapping (defined in `MapView.tsx`):

| Type   | Colour    |
|--------|-----------|
| Trail  | `#7aaa8e` |
| Summit | `#b0a08a` |
| Park   | `#7aaa8e` |
| Beach  | `#8ab0be` |
| Urban  | `#a898c0` |

## Styling

Tailwind CSS v3 with a custom `gs` colour palette and two fonts:

- `font-display` → Bricolage Grotesque (titles, headings)
- `font-body` → Plus Jakarta Sans (UI text, body)

**No greys, no system-ui fonts** — all colours come from the `gs` palette in `tailwind.config.js`. Use `bg-gs-*` / `text-gs-*` tokens rather than arbitrary hex values.

Key palette tokens: `gs-deep`, `gs-ink`, `gs-night`, `gs-surface`, `gs-panel`, `gs-soft`, `gs-subtle`, `gs-border`, `gs-muted` — each has a `-dark` variant for dark mode. Type-specific badge colours: `gs-trail`, `gs-summit`, `gs-park`, `gs-beach`, `gs-urban` (each with a `-text` variant).

Dark mode uses Tailwind's `class` strategy — `useSystemTheme` applies the `dark` class to `<html>`.

## Firebase

- Project: `green-spaces-bdd39`
- Firestore security: public read, create-only (no update/delete), requires `story` + `lat` + `lng`
- Storage: `memories/{uuid}.{ext}`, public read, write if < 5 MB and `image/*`
