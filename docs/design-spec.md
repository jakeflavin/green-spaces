# Green Spaces Memory Map — UI/UX Design Spec

---

## Design Direction

**Aesthetic**: Organic field journal — like a naturalist's sketchbook came to life on the web. Warm forest tones, aged parchment textures, editorial serif typography. Feels handcrafted, not algorithmic.

**Mood board keywords**: old trail maps, botanical illustration, national parks signage, linen notebooks, dusk in the mountains.

**One thing someone will remember**: The combination of a living world map and intimate personal stories. Every pin is a human moment.

---

## Colour Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--forest` | `#2d4a2d` | Header background, primary dark |
| `--moss` | `#4a7c59` | CTAs, active states, trail pins |
| `--sage` | `#8aab8a` | Subtle text on dark, secondary labels |
| `--cream` | `#f5f0e8` | Page background, modals |
| `--parchment` | `#ede4d0` | Sidebar background |
| `--bark` | `#7c6a4a` | Body text, secondary labels |
| `--soil` | `#3d2e1e` | Headings, primary text |
| `--dusk` | `#c4a882` | Borders, dividers, muted accents |
| `--water` | `#4a7a8c` | Beach pins |
| `--mist` | `rgba(245,240,232,0.95)` | Translucent overlays |

No greys. No purple gradients. Everything should feel like it came from the ground.

---

## Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display / Titles | Playfair Display | 700 | 1.3–2rem |
| Display italic | Playfair Display | 400 italic | Taglines, empty states |
| Body / UI | Lora | 400 | 0.85–0.95rem |
| Body emphasis | Lora | 500 | Labels, author names |
| Metadata / coords | Monospace (system) | 400 | 0.72rem |

Both fonts loaded from Google Fonts. Never Arial, Inter, Roboto, or system-ui for display text.

---

## Layout

```
┌────────────────────────────────────────────────────────┐
│  🌿 Green Spaces   [tagline]        [pin count] [hint] │  ← Header (56px, forest bg)
├──────────────┬─────────────────────────────────────────┤
│              │                                         │
│  Filter bar  │                                         │
│  ──────────  │         Interactive Map                 │
│              │         (fills remaining height)        │
│  Memory      │                                         │
│  list        │                                         │
│  (scrolls)   │                                         │
│              │                                         │
│  280px wide  │                                         │
└──────────────┴─────────────────────────────────────────┘
```

- Header: fixed, `56px`, dark forest green
- Sidebar: fixed width `280px`, parchment background, independent scroll
- Map: fills all remaining space, 100% height

---

## Map Pin Design

Each pin is an inline SVG teardrop shape — no external image files.

```
    ╭───╮
   /  🥾 \      ← emoji centred in white circle
  │       │
   \     /
    \   /
     \ /
      ▼          ← anchor point at bottom
```

- Drop shadow via SVG `<filter>`
- White inset circle at 50% opacity for emoji legibility
- Icon anchor: bottom-centre of teardrop
- Popup anchor: top-centre (appears above pin)

### Pin colours by type
- Trail `#4a7c59` — forest green
- Summit `#7c6a4a` — earth brown
- Park `#5a8c3a` — bright green
- Beach `#4a7a8c` — ocean blue
- Urban `#6a4a7c` — muted purple

---

## Component Specs

### Header
- Logo emoji + title + italic tagline on left
- Pin count + instructional hint text on right
- Hint is non-interactive (explains click-to-add behaviour)

### Sidebar Filter Bar
- Horizontal pill buttons, wraps on overflow
- Active state: moss green fill, white text
- Default: white fill, bark border
- Labels include emoji + text: `🥾 Trail`

### Sidebar Memory List
- Each item: `44×44px` thumbnail (if image exists) + title + location name
- Selected state: left border accent in moss green
- Hover: subtle translate-right `2px`
- Empty state: italic text, no image

### Add Memory Modal
**Trigger**: Click anywhere on the map
**Layout**:
1. Header: "Pin a Memory" + coordinates + close button
2. Type selector: pill row (Trail / Summit / Park / Beach / Urban)
3. Form grid (2-col): Title · Location name / Date · Author name
4. Full-width: Story textarea (4 rows min)
5. Full-width: Image upload (dashed border, preview replaces placeholder)
6. Footer: Cancel + "📍 Pin this memory" CTA

**Validation**: Title and Story are required. Shows inline error in red.
**Loading state**: Button text changes to "🌱 Saving…", disabled.

### Memory Card — Compact (map popup)
- Max width `260px`
- Image thumbnail left (`70×70px`) + type badge + title + truncated story
- Used inside Leaflet `<Popup>`

### Memory Card — Full (detail overlay)
- Full-width image (`220px` height, object-fit cover)
- Content: type badge + date → title → location → story → author
- Triggered by sidebar click or pin click
- Backdrop: `rgba(45,74,45,0.5)` blur overlay
- Panel: max `520px` wide, centred, scrollable

---

## Interaction Design

| Action | Trigger | Response |
|--------|---------|----------|
| Open detail | Click sidebar item | Detail overlay appears; map pans to pin |
| Add memory | Click empty map area | AddMemoryModal opens with lat/lng pre-filled |
| View popup | Click pin | Compact MemoryCard popup appears |
| Close modal | Click backdrop or ✕ | Modal dismisses, pendingLatLng cleared |
| Close detail | Click backdrop or ✕ | Detail overlay dismisses |
| Filter map | Click filter button | Map and sidebar both filter instantly |
| Submit form | Click "Pin this memory" | Uploading state → success → modal closes → pin appears |

---

## Responsive Considerations

This is a desktop-first app (maps are hard on small screens). At mobile widths:

- Sidebar collapses or becomes a bottom drawer (nice-to-have, not MVP)
- Map still fills screen width
- Modal becomes full-screen

---

## Empty & Loading States

| Scenario | UI |
|----------|-----|
| App first loads | "🌱 Loading memories…" overlay on map |
| Sidebar with active filter, no results | "No [type] memories yet. Click the map to add yours!" |
| Memory has no image | Card renders without image block; no broken placeholder |
| Image uploading | Button disabled + "🌱 Saving…" text |
| Firebase config missing | Console error + form error "Failed to save. Check your Firebase config." |

---

## Seed Data Spread

6 memories, geographically distributed so the map looks global:

| Pin | Location | Type | Continent |
|-----|----------|------|-----------|
| Ridge Line at Dusk | Banff, Canada | Summit | North America |
| Mile 18 Revival Spot | Vancouver, Canada | Trail | North America |
| The Quiet Tarn | Lake District, UK | Summit | Europe |
| Dawn Patrol Beach Run | Tofino, Canada | Beach | North America |
| Outdoor Rink in January | Ottawa, Canada | Urban | North America |
| Post-Rugby Recovery Loop | Hampstead Heath, UK | Urban | Europe |

*TODO before submission: add 1–2 pins in Asia/Oceania/South America for better globe coverage.*
