'use client'

import { useState } from 'react'
import { RenderBlocks } from '@/utils/RenderBlocks'
import AlternativeCardBlock from '@/blocks/alternativeCard/Server'

const PaginatedBlocks = ({ blocks, itemsPerPage = 20, isCollection = false }) => {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(blocks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBlocks = blocks.slice(startIndex, endIndex)

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const handleFirst = () => {
    setCurrentPage(1)
  }

  const handleLast = () => {
    setCurrentPage(totalPages)
  }

  return (
    <div className='flex flex-col gap-6 w-screen'>
      <div className='w-[100%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-2 h-[100%]'>
        {isCollection ? (
          // Render collection items directly
          currentBlocks.map((item, index) => (
            <div className="my-16" key={item.id || index}>
              <AlternativeCardBlock {...item} />
            </div>
          ))
        ) : (
          // Render blocks with RenderBlocks
          <RenderBlocks blocks={currentBlocks} />
        )}
      </div>

      {totalPages > 1 && (
        <div className='flex gap-4 items-center justify-center text-sm py-6 border-t border-primary'>
          <button
            onClick={handleFirst}
            disabled={currentPage === 1}
            className='px-4 py-2 bg-primary text-background disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80'
          >
            First
          </button>

          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className='px-4 py-2 bg-primary text-background disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80'
          >
            Previous
          </button>

          <span className='text-primary font-semibold'>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className='px-4 py-2 bg-primary text-background disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80'
          >
            Next
          </button>

          <button
            onClick={handleLast}
            disabled={currentPage === totalPages}
            className='px-4 py-2 bg-primary text-background disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80'
          >
            Last
          </button>
        </div>
      )}
    </div>
  )
}

export default PaginatedBlocks