'use client'

import { useEffect } from 'react'

// Scrolls to (and briefly highlights) the element whose id matches `targetId`.
// Used by the maps/photos pages so a search result with ?open=<id> lands on the
// exact record. The server is responsible for rendering the right page so the
// element exists; this just brings it into view once layout/images settle.
const ScrollToId = ({ targetId }) => {
  useEffect(() => {
    if (!targetId) return
    const id = String(targetId)
    const timer = setTimeout(() => {
      const el = document.getElementById(id)
      if (!el) return
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('ring-2', 'ring-primary')
      setTimeout(() => el.classList.remove('ring-2', 'ring-primary'), 2500)
    }, 400)
    return () => clearTimeout(timer)
  }, [targetId])

  return null
}

export default ScrollToId
