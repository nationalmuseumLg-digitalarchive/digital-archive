'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

export default function Pagination({ totalPages, currentPage }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 mt-12 py-8 border-t border-primary/10 w-full">
      {currentPage > 1 && (
        <Link
          href={createPageURL(currentPage - 1)}
          className="px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-background transition-colors uppercase text-sm font-semibold flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Previous
        </Link>
      )}

      <div className="flex items-center gap-2 font-montserrat text-sm">
        <span className="font-bold">{currentPage}</span>
        <span className="opacity-50">of</span>
        <span className="font-bold">{totalPages}</span>
      </div>

      {currentPage < totalPages && (
        <Link
          href={createPageURL(currentPage + 1)}
          className="px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-background transition-colors uppercase text-sm font-semibold flex items-center gap-2"
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </Link>
      )}
    </div>
  )
}
