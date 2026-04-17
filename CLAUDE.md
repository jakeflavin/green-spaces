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

### Key files

- `src/lib/firebase.ts` — Firebase init (Firestore + Storage); config is hardcoded for project `green-spaces-bdd39`
- `src/lib/memories.ts` — Firestore/Storage CRUD helpers + seed data array (6 pre-loaded global memories)
- `src/hooks/useMemories.ts` — real-time Firestore `onSnapshot` subscription; merges live docs with seed data client-side so the map is never empty
- `src/App.tsx` — root component; owns all state (`memories`, `pendingLatLng`, `selectedMemory`, `activeFilter`)
- `src/components/Sidebar.tsx` — filter pills + scrollable memory list
- `src/components/MemoryCard.tsx` — renders in two modes: compact (Leaflet popup, 260px max) and full (detail overlay)
- `src/components/AddMemoryModal.tsx` — triggered by map click; captures lat/lng, uploads image to Storage, writes doc to Firestore

### Data model (`memories/{id}` in Firestore)

```ts
{
  id, title, location, lat, lng, date, story,
  type: 'trail' | 'summit' | 'park' | 'beach' | 'urban',
  author, imageUrl, createdAt
}
```

Seed data is **not** written to Firestore — it's merged client-side in `useMemories` to avoid polluting the DB on every deploy.

### Map pins

Custom SVG teardrops rendered via `L.divIcon` (inline, no external assets). Type-to-colour mapping:

| Type | Colour |
|------|--------|
| Trail | `#4a7c59` |
| Summit | `#7c6a4a` |
| Park | `#5a8c3a` |
| Beach | `#4a7a8c` |
| Urban | `#6a4a7c` |

## Styling

Tailwind CSS v3 with a custom `gs` colour palette (`bg-gs-forest`, `text-gs-cream`, etc.) and two serif fonts:

- `font-display` → Playfair Display (titles)
- `font-body` → Lora (UI text)

**No greys, no system-ui fonts** — all colours come from the `gs` palette in `tailwind.config.js`. Use `bg-gs-*` / `text-gs-*` tokens rather than arbitrary hex values.

## Firebase

- Project: `green-spaces-bdd39`
- Firestore security: public read, create-only (no update/delete), requires `title` + `story` + `lat` + `lng`
- Storage: `memories/{uuid}.{ext}`, public read, write if < 5MB and `image/*`
