import assert from 'node:assert/strict'
import test from 'node:test'

import { neonConfig } from '@neondatabase/serverless'

test('Cloudflare archive reads use the request-safe HTTP transport', async () => {
  const originalCaches = globalThis.caches
  const originalWebSocket = globalThis.WebSocket
  const originalPoolQueryViaFetch = neonConfig.poolQueryViaFetch

  try {
    Object.defineProperty(globalThis, 'caches', {
      configurable: true,
      value: {},
    })
    Object.defineProperty(globalThis, 'WebSocket', {
      configurable: true,
      value: class TestWebSocket {},
    })
    neonConfig.poolQueryViaFetch = false

    await import(`../src/payload.config.ts?worker-runtime-test=${Date.now()}`)

    assert.equal(
      neonConfig.poolQueryViaFetch,
      true,
      'ordinary Pool.query calls must use HTTP so they do not reuse WebSockets across requests',
    )
  } finally {
    neonConfig.poolQueryViaFetch = originalPoolQueryViaFetch
    Object.defineProperty(globalThis, 'caches', {
      configurable: true,
      value: originalCaches,
    })
    Object.defineProperty(globalThis, 'WebSocket', {
      configurable: true,
      value: originalWebSocket,
    })
  }
})
