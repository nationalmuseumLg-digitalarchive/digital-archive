'use client'

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center' }}>
        <h1>Something went wrong</h1>
        <p style={{ color: '#666', marginTop: '1rem' }}>
          The page failed to load. This is often a temporary issue — please try again.
        </p>
        <button
          onClick={() => reset()}
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
      </body>
    </html>
  )
}
