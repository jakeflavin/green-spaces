# Design Spec: Font & Color Refresh

**Date:** 2026-04-17  
**Status:** Approved

## Context

The app's fonts were almost right but looked off in the header — the title was too small and the tagline blended into the background using a muddy lime/80% color. The overall color palette lacked cohesion: the olive-lime accent clashed with the greens in the type pills, and the deep forest green header felt heavy. The goal is a muted, calm, polished palette with no jarring accents, and a header that reads confidently without dominating.

---

## Decisions

### Fonts — unchanged
Keep **Bricolage Grotesque** (display) and **Plus Jakarta Sans** (body). No font changes needed.

### Header typography — updated
The title needs more visual weight, and the tagline needs to stop competing with the accent color.

| Element | Before | After |
|---|---|---|
| Title | `font-bold text-xl tracking-tight` | `font-extrabold text-[22px] tracking-[-0.03em]` |
| Tagline color | `text-gs-lime/80` | `text-white/45` |
| Tagline size/spacing | `text-[11px] mt-0.5` | `text-[11px] mt-1 tracking-[0.01em]` |

Full tagline text kept ("Map the places that made you love the planet").

### Color palette — full replacement

All `gs-*` tokens in `tailwind.config.js` are replaced. No lime. Everything muted and cohesive.

#### Core tokens

| Token | Old value | New value | Usage |
|---|---|---|---|
| `gs-deep` | `#0a3d2e` | `#4a6358` | Header background, "All" pill, active states |
| `gs-ink` | `#0a1628` | `#2a3830` | Primary text |
| `gs-muted` | `#445544` | `#8a9890` | Secondary text, locations |
| `gs-surface` | `#ffffff` | `#ffffff` | Sidebar / card backgrounds (unchanged) |
| `gs-soft` | `#f0faf4` | `#f2f5f3` | Selected list item background |
| `gs-border` | `#d4eadc` | `rgba(0,0,0,0.07)` | Sidebar border, dividers |
| `gs-subtle` | `#e8f5ec` | `#edf2ee` | Hover states, subtle fills |
| `gs-lime` | `#7cad4d` | *(removed)* | No longer used |
| `gs-mid` | `#1a7a50` | *(removed)* | No longer used |
| `gs-bright` | `#299854` | *(removed)* | No longer used |

> **Note:** `gs-border` is now a semi-transparent value. In Tailwind this must be expressed as an arbitrary value (`border-[rgba(0,0,0,0.07)]`) or converted to a solid equivalent (`#e8ebe9`). Use `#e8ebe9` as the solid token value.

#### Type pill tokens

| Token | Background | Text |
|---|---|---|
| `gs-trail` / `gs-trail-text` | `#e0eae4` | `#3a5244` |
| `gs-summit` / `gs-summit-text` | `#eae4d8` | `#6a4a28` |
| `gs-park` / `gs-park-text` | `#e0eae4` | `#3a5244` |
| `gs-beach` / `gs-beach-text` | `#d8e8ee` | `#2a4858` |
| `gs-urban` / `gs-urban-text` | `#e4e0ee` | `#44385e` |

Park and trail share the same tint — they're both green categories.

#### Map pin colors (MapView PIN_CONFIG)

| Type | Old (hardcoded hex) | New |
|---|---|---|
| trail | `#16a34a` | `#7aaa8e` |
| summit | `#d97706` | `#b0a08a` |
| park | `#0a3d2e` | `#7aaa8e` |
| beach | `#0891b2` | `#8ab0be` |
| urban | `#7c3aed` | `#a898c0` |
| dot (active) | `#22c55e` | `#7aaa8e` |

### Header component — specific class changes

```tsx
// Logo square
// Before: bg-gs-lime
// After:  bg-white/[0.18]

// Memory count badge
// Before: bg-gs-lime text-gs-deep
// After:  bg-white/[0.12] text-white/75 border border-white/[0.18]

// Dot inside badge
// Before: bg-gs-deep
// After:  bg-white/40

// "Pin a memory" button
// Before: bg-white/10 hover:bg-white/20 border border-white/25 text-white
// After:  bg-white/90 hover:bg-white text-gs-deep (no border needed)
```

### TypePill active state
```tsx
// Before: bg-gs-lime text-gs-deep
// After:  bg-gs-deep text-white/90
```

---

## Files to change

1. **`tailwind.config.js`** — replace entire `gs` color object with new tokens
2. **`index.html`** — no changes (fonts unchanged)
3. **`src/components/Header.tsx`** — title weight/tracking, tagline color, logo bg, badge, CTA button
4. **`src/components/TypePill.tsx`** — active pill state (`bg-gs-lime` → `bg-gs-deep`)
5. **`src/components/MapView.tsx`** — PIN_CONFIG hex values → new muted values
6. **`src/App.css`** — update any hardcoded rgba values that reference old deep/lime colors

---

## Verification

1. `npm run dev` — visually confirm header, sidebar pills, and map pins all use new palette
2. Check all 5 type pill types render (trail, summit, park, beach, urban) in filter bar and on cards
3. Confirm selected list item highlight (`gs-soft`) is visible but subtle
4. Confirm map pins are visible against the map tile background
5. `npm run build` — no TypeScript errors
