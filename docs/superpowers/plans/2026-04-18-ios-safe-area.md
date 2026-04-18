# iOS Safe Area — Edge-to-Edge Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Green Spaces app fill the iOS Safari viewport edge-to-edge, with content appearing behind the status bar and home indicator while remaining usable.

**Architecture:** Install `tailwindcss-safe-area` for clean utility classes, then apply them to the three affected elements: `Header`, `BottomSheet`, and the floating button in `App.tsx`. The app root already uses `fixed inset-0` and the `<meta viewport>` already has `viewport-fit=cover`, so only padding/spacing on specific elements needs updating.

**Tech Stack:** React 19, Tailwind CSS v3, `tailwindcss-safe-area` plugin

> **Note:** This project has no automated tests. Each task includes a manual verification step instead.

---

### Task 1: Install and register `tailwindcss-safe-area`

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `tailwind.config.js`

- [ ] **Step 1: Install the package**

```bash
npm install tailwindcss-safe-area
```

Expected output: package added to `node_modules` and `package.json` dependencies.

- [ ] **Step 2: Register the plugin in `tailwind.config.js`**

In `tailwind.config.js`, change the `plugins` array on line 51 from:

```js
plugins: [],
```

to:

```js
plugins: [
  require('tailwindcss-safe-area'),
],
```

- [ ] **Step 3: Verify the plugin generates utilities**

Run the dev server:

```bash
npm run dev
```

Open browser DevTools, inspect any element, and confirm that utilities like `pt-safe`, `pb-safe` appear in the generated CSS (search in the Styles panel or Network tab for `safe-area-inset`). No visible change on desktop is expected.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json tailwind.config.js
git commit -m "feat: install tailwindcss-safe-area plugin"
```

---

### Task 2: Apply safe area to the Header

**Files:**
- Modify: `src/components/Header.tsx`

The `<header>` element currently has `py-3` which gives 12px top and bottom padding. On notched iOS devices, the status bar sits above the header and clips content. We need the header background to extend behind the status bar, and the content to be padded below it.

Replace `py-3` with `pb-3` (keep bottom padding) and `pt-[calc(0.75rem+env(safe-area-inset-top))]` (base 12px + safe area on top). On non-notched devices `env(safe-area-inset-top)` resolves to `0px`, so behaviour is unchanged.

- [ ] **Step 1: Update the `<header>` element's className**

In `src/components/Header.tsx`, change line 8 from:

```tsx
<header className="flex items-center justify-between px-5 py-3 bg-gs-deep dark:bg-gs-night flex-shrink-0 shadow-header dark:shadow-[0_2px_16px_rgba(0,0,0,0.45)] z-10 relative">
```

to:

```tsx
<header className="flex items-center justify-between px-5 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] bg-gs-deep dark:bg-gs-night flex-shrink-0 shadow-header dark:shadow-[0_2px_16px_rgba(0,0,0,0.45)] z-10 relative">
```

- [ ] **Step 2: Verify on iOS Safari (or simulator)**

Open the app on an iPhone with a notch or Dynamic Island. Confirm:
- The header's green background fills up behind the status bar (no gap)
- The header text/icons/buttons are fully visible below the status bar
- The layout looks correct on desktop (no extra top gap on large screens)

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: extend header into iOS status bar safe area"
```

---

### Task 3: Apply safe area to the BottomSheet

**Files:**
- Modify: `src/components/BottomSheet.tsx`

Two problems to fix:
1. Scrollable content can be hidden behind the home indicator — fix with `pb-safe` on the scroll container.
2. The home indicator zone shows the sheet surface color as white/light when the sheet opens — fix by adding a non-scrolling colour fill `div` below the scroll area that matches the sheet background.

- [ ] **Step 1: Add `pb-safe` to the scrollable content div**

In `src/components/BottomSheet.tsx`, change line 57 from:

```tsx
<div ref={contentRef} className="overflow-y-auto max-h-[72vh]">
```

to:

```tsx
<div ref={contentRef} className="overflow-y-auto max-h-[72vh] pb-safe">
```

- [ ] **Step 2: Add the home indicator colour fill div**

Below the scrollable content `div` (after its closing tag on line 59), and before the closing tag of the sheet wrapper `div`, add a colour-fill element:

```tsx
      {/* Fills the home indicator zone with the sheet's background colour */}
      <div className="flex-shrink-0 h-safe-b bg-gs-surface dark:bg-gs-surface-dark" />
```

The full sheet wrapper content should now read:

```tsx
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
        <div className="w-10 h-1 rounded-full bg-gs-border dark:bg-gs-border-dark" />
      </div>
      {/* Scrollable content */}
      <div ref={contentRef} className="overflow-y-auto max-h-[72vh] pb-safe">
        {children}
      </div>
      {/* Fills the home indicator zone with the sheet's background colour */}
      <div className="flex-shrink-0 h-[env(safe-area-inset-bottom)] bg-gs-surface dark:bg-gs-surface-dark" />
```

> Note: `h-[env(safe-area-inset-bottom)]` is a Tailwind arbitrary value. On devices without a home indicator it resolves to `0px`, adding no visible space.

- [ ] **Step 3: Verify on iOS Safari**

Open the app on an iPhone. Open either bottom sheet (tap the memories button or a pin). Confirm:
- The last list item is fully visible above the home indicator
- The home indicator zone shows the sheet surface colour (white in light mode, `#253028` in dark mode) instead of a mismatched colour
- Drag-to-dismiss still works correctly

- [ ] **Step 4: Commit**

```bash
git add src/components/BottomSheet.tsx
git commit -m "feat: apply safe area insets to bottom sheet content and fill"
```

---

### Task 4: Apply safe area to the floating button

**Files:**
- Modify: `src/App.tsx`

The floating "memories in view" button uses `bottom-6` (1.5rem = 24px). On iOS, the home indicator sits in this zone, hiding the button. Replace with a `calc()` that adds the safe area inset on top of the base offset.

- [ ] **Step 1: Update the floating button's `bottom` class**

In `src/App.tsx`, the floating button is around line 126. Change:

```tsx
className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 bg-gs-deep dark:bg-gs-soft-dark text-white dark:text-gs-ink-dark px-5 py-3 rounded-full shadow-lg cursor-pointer active:scale-95 transition-transform"
```

to:

```tsx
className="md:hidden fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 bg-gs-deep dark:bg-gs-soft-dark text-white dark:text-gs-ink-dark px-5 py-3 rounded-full shadow-lg cursor-pointer active:scale-95 transition-transform"
```

- [ ] **Step 2: Verify on iOS Safari**

With no bottom sheet open, confirm the "memories in view" pill button is fully visible above the home indicator on an iPhone.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: offset floating button above iOS home indicator"
```
