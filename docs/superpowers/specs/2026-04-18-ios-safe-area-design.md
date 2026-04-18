# iOS Safe Area — Edge-to-Edge Layout

**Date:** 2026-04-18  
**Status:** Approved

## Problem

On iOS Safari with `viewport-fit=cover`, the app viewport extends behind the status bar (top) and home indicator (bottom). Without safe area inset handling:

- Header content is clipped under the top status bar
- Bottom sheet content and the floating button are clipped under the home indicator
- When the bottom sheet opens, the home indicator zone shows the sheet's surface color (white/light) instead of a colour-matched fill, making it look broken

## Approach

Use the `tailwindcss-safe-area` plugin for clean, `supports`-gated utility classes that degrade gracefully on non-supporting browsers.

## Dependencies

- Install `tailwindcss-safe-area` (npm package)
- Register in `tailwind.config.js` under `plugins`

## Changes

### `tailwind.config.js`
Add `require('tailwindcss-safe-area')` to the `plugins` array.

### `src/components/Header.tsx`
Add `pt-safe` to the header's outermost element. This pushes content below the status bar while the header background (already behind the bar via `fixed inset-0` on the App root) fills the gap with the correct colour.

### `src/components/BottomSheet.tsx`
Two changes:

1. Add `pb-safe` to the scrollable content `div` (`ref={contentRef}`) so list items are not hidden behind the home indicator.
2. Add a non-scrolling `div` below the scrollable content, inside the sheet wrapper, with `bg-gs-surface dark:bg-gs-surface-dark` and `h-safe-bottom` (or equivalent safe-area height). This fills the home indicator zone with the sheet's background colour instead of whatever shows through.

### `src/App.tsx` — floating button
Replace the fixed `bottom-6` with a value that adds `env(safe-area-inset-bottom)` on top of the existing 1.5rem offset. Use `bottom-[calc(1.5rem+env(safe-area-inset-bottom))]` or the plugin's `mb-safe` utility if it produces the equivalent result.

## Scope

No changes to Firestore, Storage, map rendering, or desktop layout. Mobile-only (the three elements above are already hidden on `md:` breakpoint or irrelevant on desktop).

## Success Criteria

- Header text/icons are fully visible below the iOS status bar on an iPhone with a notch or Dynamic Island
- Bottom sheet content scrolls above the home indicator; no items hidden behind it
- Home indicator zone shows the sheet's surface colour (not white) when the sheet is open
- Floating "memories in view" button sits above the home indicator
- No regression on desktop or Android Chrome
