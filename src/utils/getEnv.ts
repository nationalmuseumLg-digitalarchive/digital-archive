import { getCloudflareContext } from '@opennextjs/cloudflare'

/**
 * Reads an environment variable in both Node.js (build / local dev) and
 * Cloudflare Worker runtimes.
 *
 * In a Worker, Cloudflare bindings live on the per-request `env` object
 * exposed by `getCloudflareContext()`. Outside a request, or in Node, we fall
 * back to `process.env`.
 */
export const getEnv = (key: string): string => {
  try {
    const env = getCloudflareContext()?.env as Record<string, unknown> | undefined
    const value = env?.[key]
    if (typeof value === 'string') return value
  } catch {
    // No request context (build / local dev) — fall through.
  }
  return process.env[key] ?? ''
}
