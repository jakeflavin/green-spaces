# Color Contrast & Panel Shadows

**Date:** 2026-04-18  
**Status:** Approved

## Problem

The sidebar and topbar don't have enough visual separation from the map in either light or dark mode. Two related issues:

1. Panel/map separation — colors are too close in value; no shadows define the edges
2. Interactive state contrast — hover/selected states in the sidebar are nearly invisible

## Decisions

Three questions were presented visually and answered by the user:

| Question | Choice | Description |
|---|---|---|
| Panel direction | A | Keep subtle panels (`#f8faf9` / `#18211d`), rely on shadows for separation |
| Interactive states | B | Medium tint: hover 10%, selected 18% + border |
| Shadow strength | B | Medium: header `0 2px 14px`, sidebars `4px 0 14px` |

---

## Changes

### 1. Shadow tokens — `tailwind.config.js`

Add under `boxShadow`:

```js
'header':    '0 2px 14px rgba(10,22,40,0.18)',
'sidebar-r': '4px 0 14px rgba(10,22,40,0.11)',
'sidebar-l': '-4px 0 14px rgba(10,22,40,0.11)',
```

Dark mode shadows are stronger and applied as Tailwind arbitrary values in component classes (dark-mode variant not configurable in `boxShadow`).

### 2. Header — `src/components/Header.tsx`

- Add `shadow-header dark:shadow-[0_2px_16px_rgba(0,0,0,0.45)]` and `relative z-10` to the `<header>` element
- Improve low-contrast text within the header:
  - Subtitle: `text-white/45` → `text-white/60`
  - Count pill background: `bg-white/[0.12]` → `bg-white/[0.16]`
  - Count pill border: `border-white/[0.18]` → `border-white/25`
  - Count text: `text-white/75` → `text-white/85`

### 3. Sidebar — `src/components/Sidebar.tsx`

- Add `shadow-sidebar-r dark:shadow-[4px_0_16px_rgba(0,0,0,0.40)]` to the `<aside>` element
- Update interactive state classes:
  - Hover: `bg-gs-deep/[0.10] dark:bg-gs-soft-dark`
  - Selected background: `bg-gs-deep/[0.18] dark:bg-gs-subtle-dark`
  - Selected border: `border border-gs-deep/[0.22] dark:border-gs-border-dark`

### 4. Drawer — `src/components/Drawer.tsx`

- Add `shadow-sidebar-l dark:shadow-[-4px_0_16px_rgba(0,0,0,0.40)]` to the outer div

---

## Verification

1. Light mode: header has a visible bottom shadow; sidebar has a visible right shadow; drawer has a visible left shadow
2. Light mode: hovering a sidebar item is clearly visible; selected item is clearly darker than hovered
3. Dark mode: all three shadows are more prominent than light mode
4. Dark mode: hover/selected states remain distinguishable
5. Header subtitle and count pill text are legible against the green header background
