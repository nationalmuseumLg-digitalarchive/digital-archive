import { getCloudflareContext } from '@opennextjs/cloudflare'

/**
 * Safely retrieves environment variables in both Node.js and Cloudflare Worker runtimes.
 * In Workers, it prioritizes bindings from the Cloudflare Context.
 */
export const getEnv = (key: string): string => {
  let value = ''

  // 1. Try to get from Cloudflare Context (Production Worker)
  try {
    const context = getCloudflareContext()
    if (context?.env && typeof context.env === 'object') {
      const env = context.env as Record<string, any>
      
      // Handle Hyperdrive objects specifically if the key is DATABASE_URI
      if (key === 'DATABASE_URI' && env[key]?.connectionString) {
        return env[key].connectionString
      }
      
      if (env[key] && typeof env[key] === 'string') {
        return env[key]
      }
    }
  } catch (e) {
    // Context not available (Local dev / Build time)
  }

  // 2. Fallback to process.env (Node.js / Local Dev / Build)
  value = process.env[key] || ''

  return value
}
