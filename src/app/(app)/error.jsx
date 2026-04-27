'use client'

import { useEffect, useState } from 'react'

export default function Error({ error, reset }) {
  const [retried, setRetried] = useState(false)

  useEffect(() => {
    if (retried) return
    // Most server errors here are Neon cold starts (~10s wake). Auto-retry once
    // after 3s — by then the keepalive ping has usually warmed the DB.
    const t = setTimeout(() => {
      setRetried(true)
      reset()
    }, 3000)
    return () => clearTimeout(t)
  }, [retried, reset])

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.5rem' }}>Loading…</h1>
      <p style={{ color: '#666', marginTop: '1rem', maxWidth: 480, marginInline: 'auto' }}>
        {retried
          ? 'The page is still unavailable. Please retry.'
          : 'Waking the database. This usually takes a few seconds.'}
      </p>
      {retried && (
        <button
          onClick={() => {
            setRetried(false)
            reset()
          }}
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            background: '#000',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      )}
    </div>
  )
}
