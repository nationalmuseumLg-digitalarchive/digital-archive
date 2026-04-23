'use client'

// AnimatePresence needs a React context that is only available on the client.
// Wrapping it here with 'use client' creates the proper boundary so it can be
// imported and rendered from a Server Component layout without causing a
// hydration mismatch or "Client-only hook" error.
import { AnimatePresence } from 'framer-motion'

export default function PageTransition({ children }) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>
}
