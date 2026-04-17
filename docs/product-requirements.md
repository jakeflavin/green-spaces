# Green Spaces Memory Map — Product Requirements

> DEV Weekend Challenge: Earth Day Edition | Due: April 20, 2026

---

## Overview

A community-driven web app where people pin their favourite natural spaces on a world map — trails, summits, parks, riversides — and attach a photo and short story. A living, crowdsourced love letter to the planet.

**Tagline**: *"Map the places that made you love the planet."*

---

## Problem Statement

Earth Day content tends to be data-heavy — carbon calculators, emissions dashboards, statistics. What's missing is the emotional layer: the reason people *care* about the planet in the first place. That reason is almost always a specific place. A trail. A beach. A park bench. This app captures those places and the stories behind them.

---

## Goals

- Let anyone pin a natural space they love in under 2 minutes
- Show all community pins on a shared real-time map
- Make the map look alive and populated from day one (seed data)
- Be visually impressive enough to demo well in a blog post

---

## Non-Goals

- No user authentication (anonymous contributions only, MVP)
- No editing or deleting pins after submission
- No native mobile app (responsive web only)
- No social features (likes, comments, follows)

---

## Users

**Primary**: Outdoor people who want to share a place that matters to them — runners, hikers, backpackers, park-goers.

**Secondary**: Anyone browsing the map for inspiration on where to go next.

---

## User Stories

| # | As a… | I want to… | So that… |
|---|-------|-----------|----------|
| 1 | visitor | see pins on a world map | I can explore other people's green spaces |
| 2 | visitor | click a pin and read the memory | I understand why this place matters to someone |
| 3 | contributor | click anywhere on the map | I can drop a pin at my spot |
| 4 | contributor | fill in a title, story, and photo | I can share what made this place special |
| 5 | contributor | pick a place type (trail, summit, etc.) | my pin gets the right icon and colour |
| 6 | visitor | filter pins by type | I can browse only trails or only beaches |
| 7 | visitor | scroll a sidebar list of memories | I can browse without interacting with the map |

---

## Core Features (MVP)

### Map View
- World map, default zoom shows most continents
- Custom SVG pin icons, colour-coded by place type
- Click a pin → popup with memory preview
- Click anywhere on empty map → triggers Add Memory flow

### Add Memory
- Modal triggered by map click
- Captures: lat/lng (from click), title, location name, date visited, story, place type, author name (optional), photo (optional)
- Image uploaded to Firebase Storage
- Memory document saved to Firestore
- New pin appears on map in real time for all users

### Sidebar
- Scrollable list of all memories, newest first
- Filter bar: All / Trail / Summit / Park / Beach / Urban
- Clicking a list item flies the map to that pin and opens its detail

### Memory Detail
- Full-screen overlay with large photo, title, story, date, author
- Triggered from sidebar or from map pin click

### Seed Data
- 6 pre-loaded memories from real places, spread across the globe
- Ensures map looks populated on first open

---

## Place Types

| Type | Icon | Colour |
|------|------|--------|
| Trail | 🥾 | Forest green `#4a7c59` |
| Summit | ⛰️ | Earth brown `#7c6a4a` |
| Park | 🌳 | Bright green `#5a8c3a` |
| Beach | 🌊 | Ocean blue `#4a7a8c` |
| Urban | 🏙️ | Muted purple `#6a4a7c` |

---

## Data Model

### Memory Document (Firestore: `memories/{id}`)

```
{
  id:         string (auto)
  title:      string (required, max 100 chars)
  location:   string (display name, optional)
  lat:        number (required)
  lng:        number (required)
  date:       string (YYYY-MM-DD, optional)
  story:      string (required, max 2000 chars)
  type:       enum: trail | summit | park | beach | urban
  author:     string (optional, default "Anonymous Explorer")
  imageUrl:   string (Firebase Storage URL, optional)
  createdAt:  timestamp (serverTimestamp)
}
```

### Image Storage (Firebase Storage: `memories/{uuid}.{ext}`)
- Max size: 5MB
- Accepted types: `image/*`
- Public read, write-once

---

## Firebase Security Rules (Summary)

### Firestore
- `memories`: public read, create allowed if `title` + `story` + `lat` + `lng` present, no update/delete

### Storage
- `memories/*`: public read, write allowed if file < 5MB and content type is image

---

## Out of Scope (Future Ideas)
- Auth + user profiles
- Edit / delete own memories
- Upvoting / favouriting
- Comments on memories
- Clustering pins at low zoom levels
- Map search by location name
- Email notifications when someone pins near you
