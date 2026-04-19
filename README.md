# Green Spaces Memory Map

A community web app where users pin favourite natural spaces — trails, summits, parks, beaches, and urban green spaces — on a world map, attaching a photo and a short story. Anonymous contributions, no account needed.

## Stack

- **React 19 + TypeScript + Vite** — static SPA
- **Leaflet / react-leaflet** — interactive map with custom SVG pins
- **Firebase** — Firestore (real-time data) + Storage (photo uploads)
- **Tailwind CSS v3** — custom `gs-*` colour palette, dark mode via `class` strategy
- **exifr** — EXIF GPS extraction from uploaded photos

## Getting started

```bash
npm install
npm run dev
```

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check + build to `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build locally |

## Deploy

```bash
npm run build && firebase deploy   # Firebase Hosting
# or
npm run build && vercel --prod
```

## Project structure

```
src/
  types/
    memory.ts              # Shared types (Memory, MemoryType, FilterValue, etc.)
  components/
    ui/                    # Reusable primitives
      TypePill.tsx         # Type badge / filter button
      BottomSheet.tsx      # Mobile swipe-up sheet
      Drawer.tsx           # Desktop slide-in panel
      Modal.tsx            # Backdrop + centered card
      FilterBar.tsx        # Filter pill grid
      MemoryListItem.tsx   # Memory list row
    features/              # Feature components
      Sidebar.tsx          # Desktop memory list + filters
      MemoryCard.tsx       # Memory detail view
      AddMemoryPanel.tsx   # Add memory form
      MapView.tsx          # Leaflet map
      IntroModal.tsx       # First-visit welcome modal
    layout/
      Header.tsx           # App header
    theme/
      typeConfig.ts        # Type → label/emoji/colour mapping
  hooks/
    useMemories.ts         # Firestore real-time subscription
    useSystemTheme.ts      # System dark mode
  lib/
    firebase.ts            # Firebase init
    memories.ts            # Firestore/Storage CRUD
  App.tsx                  # Root — owns all state
```

## Firebase

- **Project:** `green-spaces-bdd39`
- **Firestore rules:** public read, create-only (no update/delete)
- **Storage rules:** public read, write if < 5 MB and `image/*`

## Design

- Custom `gs-*` Tailwind palette — no raw hex values in components
- `font-display`: Bricolage Grotesque (headings)
- `font-body`: Plus Jakarta Sans (UI text)
- Full dark mode support via `dark:` variants
