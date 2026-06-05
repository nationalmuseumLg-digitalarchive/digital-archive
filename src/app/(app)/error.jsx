'use client'

import { useEffect, useRef, useState } from 'react'

// Neon free-tier cold starts take 5–15s. We retry up to 3 times with
// increasing delays before showing a manual retry button.
const RETRY_DELAYS_MS = [8000, 12000]

export default function Error({ error, reset }) {
  const [attempt, setAttempt] = useState(0)
  const [message, setMessage] = useState('Waking the database. This usually takes a few seconds…')
  const timerRef = useRef(null)

  useEffect(() => {
    if (attempt >= RETRY_DELAYS_MS.length) return

    const delay = RETRY_DELAYS_MS[attempt]
    timerRef.current = setTimeout(() => {
      setAttempt((a) => a + 1)
      reset()
    }, delay)

    return () => clearTimeout(timerRef.current)
  }, [attempt, reset])

  useEffect(() => {
    if (attempt === 1) setMessage('Still waking up — one more try…')
    if (attempt >= RETRY_DELAYS_MS.length) setMessage('The page could not be loaded.')
  }, [attempt])

  const giveUp = attempt >= RETRY_DELAYS_MS.length

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.5rem' }}>{giveUp ? 'Something went wrong' : 'Loading…'}</h1>
      <p style={{ color: '#666', marginTop: '1rem', maxWidth: 480, marginInline: 'auto' }}>
        {message}
      </p>
      {giveUp && (
        <button
          onClick={() => {
            setAttempt(0)
            setMessage('Waking the database. This usually takes a few seconds…')
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
