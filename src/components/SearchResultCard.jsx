'use client'

import { useState } from 'react'
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

const SearchResultCard = ({ title, excerpt, type, collectionRoute, imageUrl }) => {
  const router = useRouter()
  const closeSearch = useStore((state) => state.closeSearch)
  // Fall back to the icon if there's no URL or the image fails to load.
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(imageUrl) && !imageFailed

  const handleClick = () => {
    if (!collectionRoute) return // nothing to navigate to; don't push "/undefined"
    closeSearch()
    // Normalise: store may hold the path with or without a leading slash.
    router.push(`/${String(collectionRoute).replace(/^\/+/, '')}`)
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
      <div className="h-28 w-full bg-background border-b border-black flex items-center justify-center overflow-hidden">
        {showImage ? (
          // Plain <img> (not next/image): the media lives on R2 and avoids the
          // image optimizer. onError degrades to the document icon.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title || 'Record image'}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <DocumentIcon />
        )}
      </div>

      <div className="p-3 flex flex-col gap-2">
        <span className="bg-primary text-background font-montserrat uppercase text-[0.65rem] px-2 py-0.5 w-fit">
          {type || 'RECORD'}
        </span>
        <h3 className="font-montserrat font-bold uppercase text-[0.8rem] line-clamp-2">
          {title || 'Untitled'}
        </h3>
        {excerpt ? <p className="font-light text-[0.75rem] line-clamp-2">{excerpt}</p> : null}
      </div>
    </motion.div>
  )
}

export default SearchResultCard
