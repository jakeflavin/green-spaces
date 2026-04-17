# Design Spec: Responsive Layout, Color Cohesion & Unified Type Pills

**Date:** 2026-04-17  
**Status:** Approved  
**Approach:** Option A — Targeted fixes, shared component

---

## Problem Summary

Three distinct issues to address:

1. **Not responsive** — the sidebar + map side-by-side layout breaks on mobile; no breakpoints exist anywhere
2. **Incoherent colors** — `MemoryCard`'s `TypeBadge` uses hardcoded inline hex values outside the `gs-*` palette
3. **Inconsistent pills** — type pills are implemented three separate ways (Sidebar filter bar, AddMemoryModal selector, MemoryCard badge) with mismatched sizing, color logic, and style

---

## Section 1: Responsive Layout

### Mobile behavior (below `md` breakpoint)

- **Default view:** Map fills the full screen
- **Navigation:** A bottom tab bar (`md:hidden`, `fixed bottom-0`) with two tabs:
  - 🗺 Map
  - ☰ List  
  Active tab highlighted with `gs-lime` accent
- **List view:** When the List tab is active, the Sidebar renders as a `fixed inset-0 z-[300]` full-screen panel stacked above the map
- **State:** `mobileView: 'map' | 'list'` added to `App.tsx`, default `'map'`

### Desktop behavior (at `md:` and above)

- Unchanged — sidebar always visible side-by-side, tab bar hidden

### Modal adjustments

- `AddMemoryModal` and `MemoryDetailOverlay`: `p-4` on mobile (instead of `p-6`), `max-h-[100dvh]` on small screens
- Header "Pin a memory" button: collapses to icon-only on mobile

### Files changed

- `src/App.tsx` — add `mobileView` state, bottom tab bar, conditional sidebar visibility
- `src/components/Sidebar.tsx` — add `md:` show/hide classes, full-screen panel on mobile
- `src/components/Header.tsx` — collapse button label on mobile
- `src/components/AddMemoryModal.tsx` — mobile padding and height adjustments
- `src/components/MemoryDetailOverlay.tsx` — mobile padding and height adjustments

---

## Section 2: Color System

### Problem

`TypeBadge` in `MemoryCard.tsx` uses inline `style={{ backgroundColor, color }}` with hardcoded hex values (Tailwind utility-palette greens, yellows, cyans, purples) that are disconnected from the `gs-*` design token system.

### Solution

Add five type-specific color pairs to `tailwind.config.js` under the `gs` namespace:

| Type   | Background token | Background value | Text token       | Text value  |
|--------|-----------------|-----------------|-----------------|-------------|
| Trail  | `gs-trail`      | `#d1ede0`       | `gs-trail-text` | `#1a5c38`   |
| Summit | `gs-summit`     | `#fdefd3`       | `gs-summit-text`| `#8a4e0f`   |
| Park   | `gs-park`       | `#c9eedb`       | `gs-park-text`  | `#0f5132`   |
| Beach  | `gs-beach`      | `#cceef5`       | `gs-beach-text` | `#0e5c72`   |
| Urban  | `gs-urban`      | `#e8e0f5`       | `gs-urban-text` | `#4a1f8c`   |

Colors are muted and earthy — harmonious with `gs-deep`, `gs-lime`, `gs-mid`. No more inline styles.

### Files changed

- `tailwind.config.js` — add 10 new color tokens (5 bg + 5 text)
- `src/components/TypePill.tsx` — use Tailwind classes instead of inline styles (see Section 3)

---

## Section 3: Unified TypePill Component

### New file: `src/components/TypePill.tsx`

Single source of truth for all type-related display. Exports:

1. **`TYPE_CONFIG`** — record mapping each `MemoryType | 'all'` to `{ label, emoji, bgClass, textClass }`
2. **`TypePill`** component

#### Props

```ts
interface TypePillProps {
  type: MemoryType | 'all'
  size: 'sm' | 'md'
  active?: boolean   // only meaningful for size="md"
  onClick?: () => void
}
```

#### Behavior

- **`size="sm"`** — badge display only (no interactive state). Uses type-specific `gs-*` color tokens. Used in `MemoryCard`.
- **`size="md"`** — interactive selector/filter button. Active state: `bg-gs-lime text-gs-deep`. Inactive state: `bg-gs-soft text-gs-muted hover:bg-gs-subtle hover:text-gs-deep`. Used in Sidebar filter bar and AddMemoryModal type selector.

#### Replaces

- `TypeBadge` in `MemoryCard.tsx` (with `size="sm"`)
- `FilterBar` button rendering in `Sidebar.tsx` (with `size="md" active={...}`)
- Type selector buttons in `AddMemoryModal.tsx` (with `size="md" active={...}`)

The `FILTERS` array in `Sidebar.tsx` and `TYPES` array in `AddMemoryModal.tsx` are removed; both import `TYPE_CONFIG` from `TypePill.tsx` instead.

### Files changed

- `src/components/TypePill.tsx` — new file
- `src/components/MemoryCard.tsx` — remove `TypeBadge`, import `TypePill`
- `src/components/Sidebar.tsx` — import `TypePill`, remove local `FILTERS` array
- `src/components/AddMemoryModal.tsx` — import `TypePill`, remove local `TYPES` array

---

## Implementation Order

1. `tailwind.config.js` — add color tokens (no component changes, safe first step)
2. `src/components/TypePill.tsx` — create new component
3. `src/components/MemoryCard.tsx` — swap `TypeBadge` → `TypePill`
4. `src/components/Sidebar.tsx` — swap filter buttons → `TypePill`, add mobile classes
5. `src/components/AddMemoryModal.tsx` — swap type selector → `TypePill`, add mobile adjustments
6. `src/components/Header.tsx` — mobile button collapse
7. `src/components/MemoryDetailOverlay.tsx` — mobile padding/height
8. `src/App.tsx` — `mobileView` state + bottom tab bar
