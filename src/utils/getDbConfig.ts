import { getCloudflareContext } from '@opennextjs/cloudflare'

export const getDbConnectionString = () => {
  let uri = '';
  let envSource = 'Local/Build (Node.js)';
  
  // Detect environment
  const isWorker = typeof caches !== 'undefined';
  
  try {
    if (isWorker) {
      const { env } = getCloudflareContext()
      // Check for Hyperdrive binding first
      if ((env as any)?.DATABASE_URI?.connectionString) {
        uri = (env as any).DATABASE_URI.connectionString
        envSource = 'Cloudflare Hyperdrive';
      } else if (typeof (env as any)?.DATABASE_URI === 'string') {
        uri = (env as any).DATABASE_URI
        envSource = 'Cloudflare Env Var';
      }
    }
  } catch (err) {
    console.error('[Payload DB] Error getting Cloudflare context:', err);
  }

  // Fallback to process.env if no URI found yet (Local/Build)
  if (!uri) {
    uri = process.env.DATABASE_URI || process.env.BUILD_DATABASE_URI || '';
  }

  // Neon SNI workaround: ONLY apply if in Worker environment
  if (isWorker && uri && uri.includes('neon.tech')) {
    const match = uri.match(/@(ep-[a-z0-9\-]+)[.-]/);
    if (match && match[1]) {
      const endpointId = match[1].replace('-pooler', '');
      if (!uri.includes(`${endpointId}$`)) {
        uri = uri.replace('://', `://${endpointId}$`);
        envSource += ' (Neon SNI Patch Applied)';
      }
    }
  }

  // Add sslmode=require if missing and not in local dev
  if (uri && !uri.includes('sslmode=') && isWorker) {
    uri += (uri.includes('?') ? '&' : '?') + 'sslmode=require';
  }

  console.log(`[Payload DB] Environment: ${isWorker ? 'Worker' : 'Node.js'} | Source: ${envSource}`);
  
  return uri;
}
