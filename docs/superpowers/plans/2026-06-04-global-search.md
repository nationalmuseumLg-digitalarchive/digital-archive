# Global Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-screen search overlay to the Lagos Museum Digital Archive that searches across all Payload collections via the existing `searchPlugin`, filtering by keyword and document type.

**Architecture:** Expand `searchPlugin` from 2 to 10 collections with per-collection `beforeSync` hooks that populate `title`, `excerpt`, `type`, and `collectionRoute` fields. A Zustand-controlled `SearchOverlay` client component mounts once in the app layout, debounces user input at 300ms, and queries `/api/search` with `depth=0` for single-table performance. A search icon added to the nav pill triggers the overlay.

**Tech Stack:** Payload CMS v3, Next.js App Router, Zustand, Framer Motion, Tailwind CSS (custom colors: `background: #FFFCF0`, `backgroundDark: #faf6e2`, `primary: #081D07`), `useDebounce` (already exists at `src/utils/useDebounce.ts`)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `src/collections/AlternativePages.js` | Add `section` select field for route disambiguation |
| Create | `src/search/beforeSync/pages.ts` | Map Pages → search doc |
| Create | `src/search/beforeSync/alternativePages.ts` | Map AlternativePages → search doc (fix existing bug) |
| Create | `src/search/beforeSync/ethnographicItems.ts` | Map EthnographicItems → search doc |
| Create | `src/search/beforeSync/maps.ts` | Map Maps → search doc |
| Create | `src/search/beforeSync/manuscripts.ts` | Map Manuscripts → search doc |
| Create | `src/search/beforeSync/intelligenceReports.ts` | Map IntelligenceReports → search doc |
| Create | `src/search/beforeSync/governmentReports.ts` | Map GovernmentReports → search doc |
| Create | `src/search/beforeSync/photos.ts` | Map Photos → search doc |
| Create | `src/search/beforeSync/alternativeHeritage.ts` | Map AlternativeHeritage → search doc |
| Create | `src/search/beforeSync/alternativeArchivalHeritage.ts` | Map AlternativeArchivalHeritage → search doc |
| Create | `src/search/beforeSync/index.ts` | Dispatch `beforeSync` by collection slug |
| Modify | `src/payload.config.ts` | Expand searchPlugin collections + fields + hook |
| Modify | `src/utils/useStore.jsx` | Add `searchOpen`, `searchQuery` state + actions |
| Create | `src/components/SearchResultCard.jsx` | Single search result card |
| Create | `src/components/SearchOverlay.jsx` | Full-screen overlay with input, filters, results |
| Modify | `src/components/Nav.jsx` | Add search icon that opens overlay |
| Modify | `src/app/(app)/layout.js` | Mount `<SearchOverlay />` once at app root |
| Replace | `src/utils/search.ts` | Typed `searchPayload()` helper (replaces stub) |

---

## Task 1: Add `section` field to AlternativePages

`alternativePages` documents render at either `/alternative_heritages_objects/[slug]` or `/alternative_heritage_archival/[slug]`. The collection has no field to distinguish which. Add a `section` select field so `beforeSync` can construct the correct URL.

**Files:**
- Modify: `src/collections/AlternativePages.js`

- [ ] **Step 1: Add section select field**

Open `src/collections/AlternativePages.js`. Add this field to the `fields` array, before `pageSection`:

```js
{
  name: 'section',
  type: 'select',
  required: true,
  admin: { position: 'sidebar' },
  options: [
    { label: 'Alternative Heritage Objects', value: 'alternative_heritages_objects' },
    { label: 'Alternative Heritage Archival', value: 'alternative_heritage_archival' },
  ],
},
```

- [ ] **Step 2: Generate migration**

The project uses `push: false` — schema changes require an explicit migration.

```bash
npx payload generate:migrations
```

Expected: a new file created in `src/migrations/` (e.g. `20260604_add_section_to_alternativePages.ts`).

- [ ] **Step 3: Run migration locally**

```bash
npx payload migrate
```

Expected output: `✓ Migrated successfully` (or equivalent Payload v3 output). The `alternative_pages` table in Neon now has a `section` column.

- [ ] **Step 4: Verify in Payload admin**

Start the dev server (`npm run dev`) and open `http://localhost:3000/admin/collections/alternativePages`. Open any existing record — you should see a `Section` select field in the sidebar. Set it to the correct section for each existing document (this is a one-time admin task).

- [ ] **Step 5: Commit**

```bash
git add src/collections/AlternativePages.js src/migrations/
git commit -m "feat(search): add section select field to AlternativePages for route disambiguation"
```

---

## Task 2: Create beforeSync hooks

One file per collection, all in `src/search/beforeSync/`. Each hook takes `originalDoc` and `searchDoc` and returns `searchDoc` with `title`, `excerpt`, `type`, and `collectionRoute` populated.

**Files:**
- Create: `src/search/beforeSync/pages.ts`
- Create: `src/search/beforeSync/alternativePages.ts`
- Create: `src/search/beforeSync/ethnographicItems.ts`
- Create: `src/search/beforeSync/maps.ts`
- Create: `src/search/beforeSync/manuscripts.ts`
- Create: `src/search/beforeSync/intelligenceReports.ts`
- Create: `src/search/beforeSync/governmentReports.ts`
- Create: `src/search/beforeSync/photos.ts`
- Create: `src/search/beforeSync/alternativeHeritage.ts`
- Create: `src/search/beforeSync/alternativeArchivalHeritage.ts`

- [ ] **Step 1: Create `src/search/beforeSync/pages.ts`**

`pages` documents contain `Card` blocks (blockType `file`) with `title`, `description`, `keyword` fields. Concatenate all block content so each card in the page is searchable.

```ts
export function pagesBeforeSync({ originalDoc, searchDoc }: { originalDoc: any; searchDoc: any }) {
  const blocks: any[] = originalDoc?.pageSection?.layout ?? []
  const cardBlocks = blocks.filter((b) => b.blockType === 'file')

  const names = cardBlocks.map((b) => b.title ?? '').filter(Boolean).join(' ')
  const keywords = cardBlocks.map((b) => b.keyword ?? '').filter(Boolean).join(' ')
  const descriptions = cardBlocks.map((b) => b.description ?? '').filter(Boolean).join(' ')

  searchDoc.title = [originalDoc.internalName, names, keywords].filter(Boolean).join(' ') || 'Untitled'
  searchDoc.excerpt = descriptions.slice(0, 200)
  searchDoc.type = 'PAGES'
  searchDoc.collectionRoute = originalDoc.slug ?? ''

  return searchDoc
}
```

- [ ] **Step 2: Create `src/search/beforeSync/alternativePages.ts`**

`alternativePages` documents contain `AlternativeCard` blocks (blockType `alternativeFile`) and `AlternativeArchivalCard` blocks (blockType `alternativeArchivalFile`). The existing payload.config.ts `beforeSync` has a bug: it overwrites `title` on each loop iteration instead of concatenating. This file fixes that.

```ts
export function alternativePagesBeforeSync({
  originalDoc,
  searchDoc,
}: {
  originalDoc: any
  searchDoc: any
}) {
  const blocks: any[] = originalDoc?.pageSection?.layout ?? []

  // Both block types: alternativeFile and alternativeArchivalFile
  const names = blocks
    .map((b) => b.objectName ?? b.NAHA ?? b.objectType ?? '')
    .filter(Boolean)
    .join(' ')
  const keywords = blocks.map((b) => b.keyword ?? '').filter(Boolean).join(' ')
  const descriptions = blocks.map((b) => b.description ?? '').filter(Boolean).join(' ')

  searchDoc.title = [originalDoc.internalName, names, keywords].filter(Boolean).join(' ') || 'Untitled'
  searchDoc.excerpt = descriptions.slice(0, 200)
  searchDoc.type = 'ALT PAGES'

  const section = originalDoc.section ?? 'alternative_heritages_objects'
  searchDoc.collectionRoute = `${section}/${originalDoc.slug ?? ''}`

  return searchDoc
}
```

- [ ] **Step 3: Create `src/search/beforeSync/ethnographicItems.ts`**

`ethnographicItems` are individual documents. Title field is `objectName`. No individual record pages exist — routing goes to the collection listing.

```ts
export function ethnographicItemsBeforeSync({
  originalDoc,
  searchDoc,
}: {
  originalDoc: any
  searchDoc: any
}) {
  searchDoc.title = originalDoc.objectName ?? `Ethnographic Item ${originalDoc.id}`
  searchDoc.excerpt = (originalDoc.description ?? originalDoc.provenance ?? '').slice(0, 200)
  searchDoc.type = 'ETHNOGRAPHIC'
  searchDoc.collectionRoute = 'ethnography_and_archaeology'
  return searchDoc
}
```

- [ ] **Step 4: Create `src/search/beforeSync/maps.ts`**

`maps` documents have no title field — use description as excerpt, fallback ID as title.

```ts
export function mapsBeforeSync({ originalDoc, searchDoc }: { originalDoc: any; searchDoc: any }) {
  searchDoc.title = `Map ${originalDoc.id}`
  searchDoc.excerpt = (originalDoc.description ?? '').slice(0, 200)
  searchDoc.type = 'MAPS'
  searchDoc.collectionRoute = 'maps'
  return searchDoc
}
```

- [ ] **Step 5: Create `src/search/beforeSync/manuscripts.ts`**

`manuscripts` documents have `internalName` and `nav[0].link` for routing.

```ts
export function manuscriptsBeforeSync({
  originalDoc,
  searchDoc,
}: {
  originalDoc: any
  searchDoc: any
}) {
  searchDoc.title = originalDoc.internalName ?? `Manuscript ${originalDoc.id}`
  searchDoc.excerpt = ''
  searchDoc.type = 'MANUSCRIPTS'
  searchDoc.collectionRoute = originalDoc.nav?.[0]?.link ?? 'manuscripts'
  return searchDoc
}
```

- [ ] **Step 6: Create `src/search/beforeSync/intelligenceReports.ts`**

```ts
export function intelligenceReportsBeforeSync({
  originalDoc,
  searchDoc,
}: {
  originalDoc: any
  searchDoc: any
}) {
  searchDoc.title = originalDoc.internalName ?? `Intelligence Report ${originalDoc.id}`
  searchDoc.excerpt = ''
  searchDoc.type = 'INTELLIGENCE'
  searchDoc.collectionRoute = originalDoc.nav?.[0]?.link ?? 'intelligence_reports'
  return searchDoc
}
```

- [ ] **Step 7: Create `src/search/beforeSync/governmentReports.ts`**

```ts
export function governmentReportsBeforeSync({
  originalDoc,
  searchDoc,
}: {
  originalDoc: any
  searchDoc: any
}) {
  searchDoc.title = originalDoc.internalName ?? `Government Report ${originalDoc.id}`
  searchDoc.excerpt = ''
  searchDoc.type = 'GOVT REPORTS'
  searchDoc.collectionRoute = originalDoc.nav?.[0]?.link ?? 'government_reports'
  return searchDoc
}
```

- [ ] **Step 8: Create `src/search/beforeSync/photos.ts`**

```ts
export function photosBeforeSync({ originalDoc, searchDoc }: { originalDoc: any; searchDoc: any }) {
  searchDoc.title = `Photo ${originalDoc.id}`
  searchDoc.excerpt = (originalDoc.description ?? '').slice(0, 200)
  searchDoc.type = 'PHOTOS'
  searchDoc.collectionRoute = 'photos'
  return searchDoc
}
```

- [ ] **Step 9: Create `src/search/beforeSync/alternativeHeritage.ts`**

Collection slug is `alternative_heritages`. Has `internalName` and `nav`.

```ts
export function alternativeHeritageBeforeSync({
  originalDoc,
  searchDoc,
}: {
  originalDoc: any
  searchDoc: any
}) {
  searchDoc.title = originalDoc.internalName ?? `Alternative Heritage ${originalDoc.id}`
  searchDoc.excerpt = ''
  searchDoc.type = 'ALT HERITAGE'
  searchDoc.collectionRoute = originalDoc.nav?.[0]?.link ?? 'alternative_heritages_objects'
  return searchDoc
}
```

- [ ] **Step 10: Create `src/search/beforeSync/alternativeArchivalHeritage.ts`**

Collection slug is `alternative_archival_heritages`. Has `internalName` and `nav`.

```ts
export function alternativeArchivalHeritageBeforeSync({
  originalDoc,
  searchDoc,
}: {
  originalDoc: any
  searchDoc: any
}) {
  searchDoc.title = originalDoc.internalName ?? `Archival Heritage ${originalDoc.id}`
  searchDoc.excerpt = ''
  searchDoc.type = 'ARCHIVAL HERITAGE'
  searchDoc.collectionRoute = originalDoc.nav?.[0]?.link ?? 'alternative_heritage_archival'
  return searchDoc
}
```

- [ ] **Step 11: Create `src/search/beforeSync/index.ts`**

Dispatches to the correct hook based on `searchDoc.doc.relationTo` (set by the plugin before this hook runs).

```ts
import { pagesBeforeSync } from './pages'
import { alternativePagesBeforeSync } from './alternativePages'
import { ethnographicItemsBeforeSync } from './ethnographicItems'
import { mapsBeforeSync } from './maps'
import { manuscriptsBeforeSync } from './manuscripts'
import { intelligenceReportsBeforeSync } from './intelligenceReports'
import { governmentReportsBeforeSync } from './governmentReports'
import { photosBeforeSync } from './photos'
import { alternativeHeritageBeforeSync } from './alternativeHeritage'
import { alternativeArchivalHeritageBeforeSync } from './alternativeArchivalHeritage'

export function globalBeforeSync({
  originalDoc,
  searchDoc,
}: {
  originalDoc: any
  searchDoc: any
}) {
  const collectionSlug = (searchDoc.doc as any)?.relationTo as string | undefined

  switch (collectionSlug) {
    case 'pages':
      return pagesBeforeSync({ originalDoc, searchDoc })
    case 'alternativePages':
      return alternativePagesBeforeSync({ originalDoc, searchDoc })
    case 'ethnographicItems':
      return ethnographicItemsBeforeSync({ originalDoc, searchDoc })
    case 'maps':
      return mapsBeforeSync({ originalDoc, searchDoc })
    case 'manuscripts':
      return manuscriptsBeforeSync({ originalDoc, searchDoc })
    case 'intelligence_reports':
      return intelligenceReportsBeforeSync({ originalDoc, searchDoc })
    case 'government_reports':
      return governmentReportsBeforeSync({ originalDoc, searchDoc })
    case 'photos':
      return photosBeforeSync({ originalDoc, searchDoc })
    case 'alternative_heritages':
      return alternativeHeritageBeforeSync({ originalDoc, searchDoc })
    case 'alternative_archival_heritages':
      return alternativeArchivalHeritageBeforeSync({ originalDoc, searchDoc })
    default:
      return searchDoc
  }
}
```

- [ ] **Step 12: Commit**

```bash
git add src/search/
git commit -m "feat(search): add per-collection beforeSync hooks"
```

---

## Task 3: Expand searchPlugin in payload.config.ts

Replace the current inline `searchPlugin` config (which only covers `pages` and `alternativePages` and has a buggy `beforeSync`) with the expanded version.

**Files:**
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Add import at top of payload.config.ts**

After the existing imports, add:

```ts
import { globalBeforeSync } from './search/beforeSync'
```

- [ ] **Step 2: Replace the entire searchPlugin(...) block**

Find the existing `searchPlugin({...})` block (lines 219–265 in the current file) and replace it entirely:

```ts
searchPlugin({
  collections: [
    'pages',
    'alternativePages',
    'ethnographicItems',
    'maps',
    'manuscripts',
    'intelligence_reports',
    'government_reports',
    'photos',
    'alternative_heritages',
    'alternative_archival_heritages',
  ],
  defaultPriorities: {
    pages: 10,
    alternativePages: 10,
    ethnographicItems: 10,
    maps: 10,
    manuscripts: 10,
    intelligence_reports: 10,
    government_reports: 10,
    photos: 10,
    alternative_heritages: 10,
    alternative_archival_heritages: 10,
  },
  fields: ({ defaultFields }) => [
    ...defaultFields,
    { name: 'type', type: 'text', index: true },
    { name: 'excerpt', type: 'text', index: true },
    { name: 'collectionRoute', type: 'text' },
  ],
  beforeSync: globalBeforeSync,
}),
```

- [ ] **Step 3: Generate migration for new search fields**

The `search` collection gains three new columns (`type`, `excerpt`, `collectionRoute`):

```bash
npx payload generate:migrations
```

- [ ] **Step 4: Run migration**

```bash
npx payload migrate
```

- [ ] **Step 5: Verify search collection schema**

Start the dev server and open `http://localhost:3000/admin/collections/search`. Confirm the collection is visible. Open any existing search record — you should see `type`, `excerpt`, and `collectionRoute` fields (empty for old records).

- [ ] **Step 6: Re-sync search index**

Existing search documents won't have the new fields populated until their source documents are re-saved. Trigger a re-sync by opening any document in the Payload admin and clicking Save. Verify the search record for that document now has `type`, `excerpt`, and `collectionRoute` filled in.

- [ ] **Step 7: Verify via API**

```bash
curl "http://localhost:3000/api/search?where[or][0][title][like]=test&limit=5&depth=0"
```

Expected: JSON response with `docs` array. Each doc should include `title`, `type`, `excerpt`, `collectionRoute`.

- [ ] **Step 8: Commit**

```bash
git add src/payload.config.ts src/migrations/
git commit -m "feat(search): expand searchPlugin to all 10 collections with indexed type/excerpt fields"
```

---

## Task 4: Add search state to Zustand store

**Files:**
- Modify: `src/utils/useStore.jsx`

- [ ] **Step 1: Replace useStore.jsx**

The current store has `sections`, `openCard`, `cardID`. Add `searchOpen`, `searchQuery` and their actions — keep all existing state untouched:

```js
import { create } from 'zustand'

const useStore = create((set) => ({
  sections: {},
  updateSections: (sections) => set(() => ({ sections })),
  openCard: false,
  updateOpenCard: (card) => set(() => ({ openCard: card })),
  cardID: '',
  updateCardId: (card) => set(() => ({ cardID: card })),
  searchOpen: false,
  openSearch: () => set(() => ({ searchOpen: true })),
  closeSearch: () => set(() => ({ searchOpen: false })),
  searchQuery: '',
  setSearchQuery: (q) => set(() => ({ searchQuery: q })),
}))

export default useStore
```

- [ ] **Step 2: Verify existing Nav still works**

Start the dev server (`npm run dev`). Open `http://localhost:3000`. Hover over nav flyout menus — they should still work normally. This confirms the existing `sections`/`openCard`/`cardID` state is intact.

- [ ] **Step 3: Commit**

```bash
git add src/utils/useStore.jsx
git commit -m "feat(search): add searchOpen and searchQuery state to Zustand store"
```

---

## Task 5: Create SearchResultCard component

**Files:**
- Create: `src/components/SearchResultCard.jsx`

- [ ] **Step 1: Create the file**

```jsx
'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import useStore from '../utils/useStore'

const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="32px"
    viewBox="0 -960 960 960"
    width="32px"
    fill="#081D07"
    opacity="0.25"
  >
    <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
  </svg>
)

const SearchResultCard = ({ title, excerpt, type, collectionRoute }) => {
  const router = useRouter()
  const closeSearch = useStore((state) => state.closeSearch)

  const handleClick = () => {
    closeSearch()
    router.push(`/${collectionRoute}`)
  }

  return (
    <motion.div
      whileHover={{ backgroundColor: '#081D07', color: '#FFFCF0' }}
      transition={{ ease: 'easeOut', duration: 0.2 }}
      className="border-[1px] border-black bg-backgroundDark cursor-pointer flex flex-col overflow-hidden"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="h-28 w-full bg-background border-b border-black flex items-center justify-center">
        <DocumentIcon />
      </div>

      <div className="p-3 flex flex-col gap-2">
        <span className="bg-primary text-background font-montserrat uppercase text-[0.65rem] px-2 py-0.5 w-fit">
          {type || 'RECORD'}
        </span>
        <h3 className="font-montserrat font-bold uppercase text-[0.8rem] line-clamp-2">
          {title || 'Untitled'}
        </h3>
        {excerpt ? (
          <p className="font-light text-[0.75rem] line-clamp-2">{excerpt}</p>
        ) : null}
      </div>
    </motion.div>
  )
}

export default SearchResultCard
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SearchResultCard.jsx
git commit -m "feat(search): add SearchResultCard component"
```

---

## Task 6: Create SearchOverlay component

**Files:**
- Create: `src/components/SearchOverlay.jsx`

- [ ] **Step 1: Create the file**

```jsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useStore from '../utils/useStore'
import { useDebounce } from '../utils/useDebounce'
import SearchResultCard from './SearchResultCard'

const FILTER_TYPES = [
  { label: 'ALL', value: '' },
  { label: 'MANUSCRIPTS', value: 'MANUSCRIPTS' },
  { label: 'MAPS', value: 'MAPS' },
  { label: 'INTELLIGENCE', value: 'INTELLIGENCE' },
  { label: 'GOVT REPORTS', value: 'GOVT REPORTS' },
  { label: 'PHOTOS', value: 'PHOTOS' },
  { label: 'ETHNOGRAPHIC', value: 'ETHNOGRAPHIC' },
  { label: 'ALT HERITAGE', value: 'ALT HERITAGE' },
  { label: 'ARCHIVAL HERITAGE', value: 'ARCHIVAL HERITAGE' },
  { label: 'ALT PAGES', value: 'ALT PAGES' },
  { label: 'PAGES', value: 'PAGES' },
]

const SearchOverlay = () => {
  const searchOpen = useStore((state) => state.searchOpen)
  const closeSearch = useStore((state) => state.closeSearch)
  const searchQuery = useStore((state) => state.searchQuery)
  const setSearchQuery = useStore((state) => state.setSearchQuery)

  const [activeType, setActiveType] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  const debouncedQuery = useDebounce(searchQuery, 300)

  // Auto-focus input when overlay opens
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [searchOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') closeSearch()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeSearch])

  // Fetch results when debouncedQuery or activeType changes
  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setResults([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    const params = new URLSearchParams()
    params.set('limit', '20')
    params.set('depth', '0')

    if (activeType) {
      params.set('where[and][0][or][0][title][like]', debouncedQuery)
      params.set('where[and][0][or][1][excerpt][like]', debouncedQuery)
      params.set('where[and][1][type][equals]', activeType)
    } else {
      params.set('where[or][0][title][like]', debouncedQuery)
      params.set('where[or][1][excerpt][like]', debouncedQuery)
    }

    fetch(`/api/search?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setResults(data.docs ?? [])
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [debouncedQuery, activeType])

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] bg-background text-primary overflow-y-auto"
        >
          {/* Header bar */}
          <div className="flex justify-between items-center px-8 py-4 border-b border-black sticky top-0 bg-background z-10">
            <span className="font-montserrat font-bold text-[0.75rem] uppercase tracking-widest">
              National Museum Lagos — Archives
            </span>
            <button
              onClick={closeSearch}
              className="font-montserrat uppercase text-[0.75rem] flex items-center gap-2 hover:opacity-60 transition-opacity"
              aria-label="Close search"
            >
              CLOSE
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#081D07"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </button>
          </div>

          {/* Search input */}
          <div className="px-8 py-6 border-b border-black">
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#081D07"
                className="flex-shrink-0 opacity-50"
              >
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH THE ARCHIVE..."
                className="w-full bg-transparent font-montserrat uppercase text-[1.1rem] lg:text-[1.4rem] placeholder:opacity-30 border-b border-black focus:border-b-2 outline-none pb-2 transition-all"
              />
            </div>
          </div>

          {/* Filter chips */}
          <div className="px-8 py-4 flex flex-wrap gap-2 border-b border-black">
            {FILTER_TYPES.map((ft) => (
              <motion.button
                key={ft.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveType(ft.value)}
                className={`px-3 py-1 font-montserrat uppercase text-[0.65rem] border border-black rounded-full transition-colors ${
                  activeType === ft.value
                    ? 'bg-primary text-background'
                    : 'bg-backgroundDark text-primary hover:bg-primary hover:text-background'
                }`}
              >
                {ft.label}
              </motion.button>
            ))}
          </div>

          {/* Results area */}
          <div className="px-8 py-8">
            {searchQuery.length < 3 ? (
              <p className="font-montserrat uppercase text-[0.75rem] text-center mt-16 opacity-30 tracking-widest">
                TYPE AT LEAST 3 CHARACTERS TO SEARCH
              </p>
            ) : loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-black bg-backgroundDark h-52 animate-pulse"
                  />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center mt-16 flex flex-col gap-2">
                <p className="font-montserrat font-bold uppercase text-[1rem]">NO RECORDS FOUND</p>
                <p className="font-light text-[0.75rem] opacity-50">
                  Try a different keyword or filter
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {results.map((doc) => (
                  <SearchResultCard
                    key={doc.id}
                    title={doc.title}
                    excerpt={doc.excerpt}
                    type={doc.type}
                    collectionRoute={doc.collectionRoute}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SearchOverlay
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SearchOverlay.jsx
git commit -m "feat(search): add SearchOverlay component with debounced input, type filters, and result grid"
```

---

## Task 7: Add search icon to Nav

**Files:**
- Modify: `src/components/Nav.jsx`

- [ ] **Step 1: Import openSearch from store at the top of the Nav component**

`Nav.jsx` is already a client component (`'use client'`). Add `openSearch` to the destructuring inside the `Nav` function body:

```js
const openSearch = useStore((state) => state.openSearch)
```

Add this line directly after the existing `const [navOpen, setNavOpen] = useState(false)` line in the `Nav` function.

- [ ] **Step 2: Add search icon to desktop nav pill**

Find the desktop `<ul>` inside `<nav className="px-8 py-3 invisible sm:visible ...">`. Add a new `<li>` as the last item before the closing `</ul>`:

```jsx
<li>
  <button
    onClick={openSearch}
    aria-label="Open search"
    className="flex items-center hover:opacity-70 transition-opacity"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="18px"
      viewBox="0 -960 960 960"
      width="18px"
      fill="#FFFCF0"
    >
      <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
    </svg>
  </button>
</li>
```

Note: fill is `#FFFCF0` (background color) because the nav pill is `bg-primary` (`#081D07`).

- [ ] **Step 3: Add search icon to mobile nav**

In the mobile nav, find the `<ul>` that appears when `navOpen` is true (the list with HOME, ABOUT, SECTIONS, PHOTOS links). Add a search button after the PHOTOS link:

```jsx
<button
  className="bg-primary text-background p-2 h-[20%] flex justify-center items-center gap-2 rounded-md font-montserrat uppercase text-[0.75rem]"
  onClick={() => {
    setNavOpen(false)
    openSearch()
  }}
>
  SEARCH
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="18px"
    viewBox="0 -960 960 960"
    width="18px"
    fill="#FFFCF0"
  >
    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
  </svg>
</button>
```

- [ ] **Step 4: Verify in browser**

Start the dev server. Open `http://localhost:3000`. You should see a small search icon at the right end of the nav pill. Clicking it should... not crash (the overlay will be wired in Task 8). Clicking currently does nothing visible since `SearchOverlay` is not yet in the tree.

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.jsx
git commit -m "feat(search): add search icon to desktop and mobile nav"
```

---

## Task 8: Mount SearchOverlay in app layout

**Files:**
- Modify: `src/app/(app)/layout.js`

- [ ] **Step 1: Import SearchOverlay**

Add the import at the top of `src/app/(app)/layout.js`, after the existing imports:

```js
import SearchOverlay from '@/components/SearchOverlay'
```

- [ ] **Step 2: Mount SearchOverlay in the body**

Add `<SearchOverlay />` as the first child inside `<body>`, before `<HeaderServer />`:

```jsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${old.variable} ${montserrat.variable}`}>
        <SearchOverlay />
        <HeaderServer />
        <PageTransition>{children}</PageTransition>
        <FooterServer />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: End-to-end test in browser**

Start the dev server. Open `http://localhost:3000`.

1. Click the search icon in the nav — the overlay should fade in smoothly over the full screen.
2. Press `Escape` — the overlay should close.
3. Open again, type 1–2 characters — "TYPE AT LEAST 3 CHARACTERS TO SEARCH" should appear.
4. Type 3+ characters — skeleton cards appear while loading, then results (or "NO RECORDS FOUND" if the search index is empty).
5. Click a filter chip — it should turn dark, and results should filter to that type.
6. Click a result card — the overlay should close and the browser should navigate to the correct route.
7. On mobile: tap the hamburger, tap SEARCH — overlay opens and mobile nav closes.

- [ ] **Step 4: Commit**

```bash
git add src/app/(app)/layout.js
git commit -m "feat(search): mount SearchOverlay at app layout level"
```

---

## Task 9: Replace search.ts stub

**Files:**
- Replace: `src/utils/search.ts`

- [ ] **Step 1: Replace with typed helper**

The current `src/utils/search.ts` is a stub that uses a wrong env var. Replace it entirely:

```ts
export type SearchResult = {
  id: string
  title: string
  excerpt: string
  type: string
  collectionRoute: string
}

export type SearchResponse = {
  docs: SearchResult[]
  totalDocs: number
  hasNextPage: boolean
}

export async function searchPayload(query: string, type?: string): Promise<SearchResponse> {
  if (query.length < 3) return { docs: [], totalDocs: 0, hasNextPage: false }

  const params = new URLSearchParams()
  params.set('limit', '20')
  params.set('depth', '0')

  if (type) {
    params.set('where[and][0][or][0][title][like]', query)
    params.set('where[and][0][or][1][excerpt][like]', query)
    params.set('where[and][1][type][equals]', type)
  } else {
    params.set('where[or][0][title][like]', query)
    params.set('where[or][1][excerpt][like]', query)
  }

  const res = await fetch(`/api/search?${params.toString()}`)
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
  return res.json()
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/search.ts
git commit -m "feat(search): replace search.ts stub with typed searchPayload helper"
```

---

## Task 10: Full index re-sync and final verification

After all tasks are complete, the search index needs to be fully re-synced since many documents were created before the new `type`, `excerpt`, and `collectionRoute` fields existed.

- [ ] **Step 1: Re-sync all documents**

In the Payload admin (`http://localhost:3000/admin`), for each collection go through and re-save at least one document to verify the `beforeSync` hook fires correctly. For a bulk re-sync, use the Payload local API in a script:

```ts
// scripts/reindex-search.ts
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const collections = [
  'pages', 'alternativePages', 'ethnographicItems', 'maps',
  'manuscripts', 'intelligence_reports', 'government_reports',
  'photos', 'alternative_heritages', 'alternative_archival_heritages',
] as const

async function reindex() {
  const payload = await getPayload({ config })
  for (const slug of collections) {
    const result = await payload.find({ collection: slug, limit: 1000, depth: 0 })
    for (const doc of result.docs) {
      await payload.update({ collection: slug, id: doc.id, data: {} as any })
    }
    console.log(`Re-synced ${result.docs.length} docs from ${slug}`)
  }
  process.exit(0)
}

reindex().catch((err) => {
  console.error('Reindex failed:', err)
  process.exit(1)
})
```

Run: `npx tsx scripts/reindex-search.ts`

- [ ] **Step 2: Verify search API returns correct fields**

```bash
curl "http://localhost:3000/api/search?where[or][0][title][like]=lagos&limit=5&depth=0" | jq '.docs[] | {title, type, excerpt, collectionRoute}'
```

Expected: 5 docs each with non-empty `title`, `type`, `collectionRoute`.

- [ ] **Step 3: Verify type filter works**

```bash
curl "http://localhost:3000/api/search?where[and][0][or][0][title][like]=a&where[and][1][type][equals]=MANUSCRIPTS&limit=5&depth=0" | jq '.docs[].type'
```

Expected: all results show `"MANUSCRIPTS"`.

- [ ] **Step 4: Final browser walkthrough**

1. Search "manuscript" — results from MANUSCRIPTS type appear
2. Search "bronze" — results from ALT PAGES and ETHNOGRAPHIC appear
3. Filter by MAPS, search "nigeria" — only map results
4. Click a result — navigates to the correct page
5. Check mobile at 375px viewport — 2-column grid, search accessible from mobile nav

- [ ] **Step 5: Final commit**

```bash
git add scripts/reindex-search.ts
git commit -m "feat(search): add reindex script for full search index re-sync"
```
