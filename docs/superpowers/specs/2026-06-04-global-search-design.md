# Global Search — Design Spec
_Date: 2026-06-04_

## Overview

A global search feature for the Lagos Museum Digital Archive. Users can trigger a full-screen search overlay from a magnifying glass icon in the nav, search across all archival collections by keyword, filter by document type, and navigate directly to the matching record's collection page.

---

## Goals

- Search across all collections from any page in the app
- Fast, accurate results — single debounced query against a pre-built Postgres index
- Filter by document type (collection)
- Follow existing design system: `font-montserrat`, uppercase text, `#FFFCF0` / `#1D1911` palette, border-based layouts, Framer Motion transitions
- No date filtering in v1

---

## Architecture

### Approach

Extend the existing Payload `searchPlugin` (already installed, currently indexing only `pages` and `alternativePages`) to cover all collections. The plugin maintains a dedicated `search` Postgres table, synced automatically on every document save. The frontend queries `/api/search` directly — no custom API route needed.

### Collections indexed

| Collection slug | Type label | Routing |
|---|---|---|
| `pages` | PAGES | `/<slug>` (via nestedDocsPlugin) |
| `alternativePages` | ALT PAGES | `/<categoryPath>/<slug>` |
| `ethnographicItems` | ETHNOGRAPHIC | `/ethnography_and_archaeology` |
| `maps` | MAPS | `/maps` |
| `manuscripts` | MANUSCRIPTS | `/manuscripts/<nav-link>` |
| `intelligenceReports` | INTELLIGENCE | `/intelligence_reports/<nav-link>` |
| `governmentReports` | GOVT REPORTS | `/government_reports/<nav-link>` |
| `photos` | PHOTOS | `/photos` |
| `alternativeHeritage` | ALT HERITAGE | `/alternative_heritages_objects/<nav-link>` |
| `alternativeArchivalHeritage` | ARCHIVAL HERITAGE | `/alternative_heritage_archival/<nav-link>` |

---

## Data Layer

### Search plugin fields (added to all search documents)

```ts
fields: ({ defaultFields }) => [
  ...defaultFields,
  { name: 'type',           type: 'text', index: true  },  // e.g. "MANUSCRIPTS"
  { name: 'excerpt',        type: 'text', index: true  },  // short description for result card
  { name: 'collectionRoute', type: 'text'              },  // e.g. "manuscripts/benin_expeditions"
]
```

`index: true` on `title` (default field), `excerpt`, and `type` creates Postgres indexes for fast `ILIKE` queries.

### beforeSync hooks

One file per collection in `src/search/beforeSync/`. Each hook maps source doc fields to the search document:

```ts
// signature for every hook
({ originalDoc, searchDoc }) => {
  searchDoc.title   = <primary identifier>
  searchDoc.excerpt = <short description, truncated to ~200 chars>
  searchDoc.type    = <TYPE_LABEL>
  searchDoc.collectionRoute = <route string>
  return searchDoc
}
```

**`alternativePages` (fix existing bug):** Current code overwrites `title` on each card block iteration. Fix: concatenate all block `objectName` / `title` values into a single space-separated string so the full page content is searchable. Set `excerpt` to the first block's description.

**Collections with `nav` arrays** (`manuscripts`, `intelligenceReports`, `governmentReports`, `alternativeHeritage`, `alternativeArchivalHeritage`): `title` = `internalName`, `collectionRoute` = `nav[0].link`.

**`photos`**: `title` = `"Photo"` + doc ID, `excerpt` = `description`.

**`ethnographicItems`**: `title` = primary name field, `excerpt` = description.

### defaultPriorities

All collections set to `10` (equal weight).

---

## API Query

The frontend queries Payload's auto-generated REST endpoint. No custom route is needed.

**Keyword-only:**
```
GET /api/search
  ?where[or][0][title][like]=<query>
  &where[or][1][excerpt][like]=<query>
  &limit=20
  &depth=0
```

**With type filter:**
```
GET /api/search
  ?where[and][0][or][0][title][like]=<query>
  &where[and][0][or][1][excerpt][like]=<query>
  &where[and][1][type][equals]=<TYPE_LABEL>
  &limit=20
  &depth=0
```

`depth=0` prevents Payload resolving the `doc` relationship join — result cards are built entirely from the flattened search doc fields, keeping the query to a single table lookup.

---

## State Management

Two new fields added to the existing Zustand store (`src/utils/useStore.jsx`):

| Field | Type | Purpose |
|---|---|---|
| `searchOpen` | `boolean` | Controls overlay visibility |
| `searchQuery` | `string` | Current input value (for persistence across open/close) |

New actions: `openSearch()`, `closeSearch()`, `setSearchQuery(q)`.

---

## UI Components

### 1. Search icon in Nav (`src/components/Nav.jsx`)

- Magnifying glass SVG, `fill="#1D1911"`, 20×20px — matches existing arrow SVG style
- Added to the desktop nav pill as the last item, and to the mobile nav
- `onClick` calls `openSearch()` from Zustand store

### 2. SearchOverlay (`src/components/SearchOverlay.jsx`)

`'use client'` component. Mounted at the app layout level (`src/app/(app)/layout.js`) so it is available on every page.

**Animation:** Framer Motion `AnimatePresence` wraps the overlay.
- Enter: `{ opacity: 0, y: -20 }` → `{ opacity: 1, y: 0 }`, 200ms easeOut
- Exit: `{ opacity: 0, y: -20 }`, 150ms easeIn

**Structure:**
```
position: fixed, inset: 0, z-index: 100
bg-background text-primary overflow-y-auto

├── Header bar (sticky top)
│     logo (left) + "✕ CLOSE" button (right)
│
├── Search input zone
│     full-width input, font-montserrat uppercase
│     border-b-[1px] border-black → border-b-[2px] on focus
│     placeholder: "SEARCH THE ARCHIVE..."
│     magnifying glass icon inline left
│
├── Filter chips row
│     [ALL] [MANUSCRIPTS] [MAPS] [INTELLIGENCE REPORTS]
│     [GOVT REPORTS] [PHOTOS] [ALT HERITAGES] [ARCHIVAL HERITAGES]
│     inactive: bg-backgroundDark border border-black
│     active:   bg-primary text-background
│     Framer Motion whileTap scale: 0.95
│
└── Results area
      < 3 chars typed:  centered prompt "TYPE AT LEAST 3 CHARACTERS TO SEARCH"
      loading:          4-col skeleton cards (border-[1px] border-black, animated opacity)
      results:          SearchResultCard grid (4 col desktop, 2 col mobile)
      empty:            "NO RECORDS FOUND" + lighter "Try a different keyword or filter"
```

**Input behaviour:**
- `useDebounce(query, 300)` — fires API call 300ms after typing stops
- Minimum 3 characters before any fetch
- `Escape` key closes the overlay

### 3. SearchResultCard (`src/components/SearchResultCard.jsx`)

`'use client'` component.

```
border-[1px] border-black bg-backgroundDark
cursor-pointer hover: bg-primary text-background (transition 200ms)

├── Thumbnail (if available) — next/image, object-cover, fixed height
│   else: type icon placeholder (SVG, centered)
│
├── Type chip — bg-primary text-background text-[0.65rem] font-montserrat uppercase
│              (inverts on card hover)
│
├── Title — font-montserrat font-bold uppercase text-[0.8rem] truncate
│
└── Excerpt — font-light text-[0.75rem] line-clamp-2
```

**On click:** Navigate to `/<collectionRoute>` using `next/navigation` `router.push()`. No `?open=<id>` param in v1 — the user lands on the collection page and can locate the record. (Auto-open can be added in v2 once individual record slugs are consistent across collections.)

**Keyboard accessible:** `role="button"`, `tabIndex={0}`, `onKeyDown` handles Enter.

---

## Performance Summary

| Concern | Solution |
|---|---|
| Too many DB queries per keystroke | Single query against dedicated `search` table |
| Slow ILIKE on large index | `index: true` on `title`, `excerpt`, `type` columns |
| Resolving relationships slows query | `depth=0` on all search API calls |
| Excessive fetches while typing | `useDebounce` at 300ms |
| Fetching on single chars | 3-character minimum before fetch |
| Perceived latency | Skeleton loading state renders immediately |
| Overlay mount cost on every page | Mounted once at layout level, hidden via CSS/AnimatePresence |

---

## Files Changed / Created

| File | Action |
|---|---|
| `src/payload.config.ts` | Expand `searchPlugin` collections list; add `type`, `excerpt`, `collectionRoute` fields; wire `beforeSync` per collection |
| `src/search/beforeSync/index.ts` | Re-exports all beforeSync hooks |
| `src/search/beforeSync/alternativePages.ts` | Fix existing bug + set type/excerpt/route |
| `src/search/beforeSync/pages.ts` | Map pages fields |
| `src/search/beforeSync/ethnographicItems.ts` | Map ethnographic fields |
| `src/search/beforeSync/maps.ts` | Map maps fields |
| `src/search/beforeSync/manuscripts.ts` | Map manuscripts fields |
| `src/search/beforeSync/intelligenceReports.ts` | Map intelligence report fields |
| `src/search/beforeSync/governmentReports.ts` | Map government report fields |
| `src/search/beforeSync/photos.ts` | Map photos fields |
| `src/search/beforeSync/alternativeHeritage.ts` | Map alt heritage fields |
| `src/search/beforeSync/alternativeArchivalHeritage.ts` | Map archival heritage fields |
| `src/utils/useStore.jsx` | Add `searchOpen`, `searchQuery`, `openSearch`, `closeSearch`, `setSearchQuery` |
| `src/components/Nav.jsx` | Add search icon + `openSearch` trigger |
| `src/components/SearchOverlay.jsx` | Full-screen search overlay (new) |
| `src/components/SearchResultCard.jsx` | Individual result card (new) |
| `src/app/(app)/layout.js` | Mount `<SearchOverlay />` |
| `src/utils/search.ts` | Replace stub with typed `searchPayload(query, type?)` fetch helper |

---

## Out of Scope (v1)

- Date range filtering
- Auto-opening a specific card on result click (requires consistent slug per record across all collections)
- Pagination of results beyond 20 items
- Search analytics / recent searches
