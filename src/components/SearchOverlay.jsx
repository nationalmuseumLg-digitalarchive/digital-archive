'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useStore from '../utils/useStore'
import { useDebounce } from '../utils/useDebounce'
import { searchPayload, MIN_QUERY_LENGTH } from '../utils/search'
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

// A single shimmering placeholder bar.
const Bar = ({ className = '', delay = 0 }) => (
  <div
    className={`bg-primary/10 animate-shimmer rounded-sm ${className}`}
    style={{ animationDelay: `${delay}ms` }}
  />
)

// Skeleton that mirrors SearchResultCard's layout so the loading state lines up
// with the real results. `i` staggers the shimmer for a cascade across the grid.
const SkeletonCard = ({ i = 0 }) => {
  const delay = (i % 4) * 120
  return (
    <div className="border-[1px] border-black bg-backgroundDark flex flex-col overflow-hidden">
      <div
        className="h-28 w-full bg-background border-b border-black animate-shimmer"
        style={{ animationDelay: `${delay}ms` }}
      />
      <div className="p-3 flex flex-col gap-2">
        <Bar className="h-3 w-12" delay={delay} />
        <Bar className="h-3.5 w-3/4" delay={delay} />
        <Bar className="h-3 w-1/2" delay={delay} />
        <Bar className="h-2.5 w-full mt-1" delay={delay} />
        <Bar className="h-2.5 w-5/6" delay={delay} />
      </div>
    </div>
  )
}

const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} i={i} />
    ))}
  </div>
)

const Spinner = () => (
  <svg
    className="w-4 h-4 animate-spin"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

const SearchOverlay = () => {
  const searchOpen = useStore((state) => state.searchOpen)
  const closeSearch = useStore((state) => state.closeSearch)
  const searchQuery = useStore((state) => state.searchQuery)
  const setSearchQuery = useStore((state) => state.setSearchQuery)

  const [activeType, setActiveType] = useState('')
  const [results, setResults] = useState([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false) // first page / replace
  const [loadingMore, setLoadingMore] = useState(false) // appending next page
  const [error, setError] = useState(false)
  const inputRef = useRef(null)

  const debouncedQuery = useDebounce(searchQuery, 300)

  // Auto-focus the input when the overlay opens.
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [searchOpen])

  // Close on Escape.
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') closeSearch()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeSearch])

  // Fetch the first page whenever the debounced query or active filter changes.
  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setResults([])
      setTotalDocs(0)
      setHasMore(false)
      setLoading(false)
      setError(false)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(false)
    setPage(1)

    searchPayload(debouncedQuery, activeType, 1, controller.signal)
      .then((data) => {
        setResults(data.docs ?? [])
        setTotalDocs(data.totalDocs ?? 0)
        setHasMore(Boolean(data.hasNextPage))
        setLoading(false)
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return // superseded by a newer query
        setError(true)
        setLoading(false)
      })

    return () => controller.abort()
  }, [debouncedQuery, activeType])

  const loadMore = async () => {
    if (loadingMore || !hasMore) return
    const nextPage = page + 1
    setLoadingMore(true)
    try {
      const data = await searchPayload(debouncedQuery, activeType, nextPage)
      setResults((prev) => [...prev, ...(data.docs ?? [])])
      setPage(nextPage)
      setHasMore(Boolean(data.hasNextPage))
    } catch {
      setHasMore(false) // stop offering "load more" if a page fails
    } finally {
      setLoadingMore(false)
    }
  }

  // Derived view state. `isSearching` also covers the gap between a keystroke
  // and the debounce firing, so the empty state never flashes mid-type.
  const belowMinimum = searchQuery.length < MIN_QUERY_LENGTH
  const isSearching = !belowMinimum && (loading || searchQuery !== debouncedQuery)

  const renderResults = () => {
    if (belowMinimum) {
      return (
        <p className="font-montserrat uppercase text-[0.75rem] text-center mt-16 opacity-30 tracking-widest">
          TYPE AT LEAST {MIN_QUERY_LENGTH} CHARACTERS TO SEARCH
        </p>
      )
    }

    if (isSearching) return <SkeletonGrid count={8} />

    if (error) {
      return (
        <div className="text-center mt-16 flex flex-col gap-2">
          <p className="font-montserrat font-bold uppercase text-[1rem]">SEARCH UNAVAILABLE</p>
          <p className="font-light text-[0.75rem] opacity-50">
            Something went wrong. Please try again.
          </p>
        </div>
      )
    }

    if (results.length === 0) {
      return (
        <div className="text-center mt-16 flex flex-col gap-2">
          <p className="font-montserrat font-bold uppercase text-[1rem]">NO RECORDS FOUND</p>
          <p className="font-light text-[0.75rem] opacity-50">Try a different keyword or filter</p>
        </div>
      )
    }

    return (
      <>
        <p className="font-montserrat uppercase text-[0.65rem] tracking-widest opacity-40 mb-4">
          {totalDocs} {totalDocs === 1 ? 'Result' : 'Results'}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((doc) => (
            <SearchResultCard
              key={doc.id}
              title={doc.title}
              excerpt={doc.excerpt}
              type={doc.type}
              collectionRoute={doc.collectionRoute}
              imageUrl={doc.imageUrl}
            />
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-background transition-colors uppercase text-sm font-semibold font-montserrat flex items-center gap-2 disabled:opacity-60"
            >
              {loadingMore ? (
                <>
                  <Spinner />
                  Loading
                </>
              ) : (
                <>
                  Load more
                  <span className="opacity-50">({results.length} of {totalDocs})</span>
                </>
              )}
            </button>
          </div>
        )}
      </>
    )
  }

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

          <div className="px-8 py-8">{renderResults()}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SearchOverlay
