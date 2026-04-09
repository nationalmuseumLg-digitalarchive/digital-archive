export const getDbConnectionString = () => {
  let uri = '';
  
  // Detect environment
  const isWorker = typeof caches !== 'undefined';
  const isServer = typeof window === 'undefined';
  
  if (!isServer) return ''; // Safely return empty string in browser

  try {
    // In Node.js or during build, use process.env directly
    uri = process.env.DATABASE_URI || process.env.BUILD_DATABASE_URI || '';
    
    // In Worker runtime, we can try to get the context
    // We avoid 'require' because it breaks ESM Workers
    // We rely on the fact that OpenNext usually shims process.env with bindings
    // or we'd ideally use a Hyperdrive connection string if available.
  } catch (err) {
    // console.error('[Payload DB] Error getting database connection string:', err);
  }

  // Neon SNI workaround: ONLY apply if in Worker environment
  if (isWorker && uri && uri.includes('neon.tech')) {
    const match = uri.match(/@(ep-[a-z0-9\-]+)[.-]/);
    if (match && match[1]) {
      const endpointId = match[1].replace('-pooler', '');
      if (!uri.includes(`${endpointId}$`)) {
        uri = uri.replace('://', `://${endpointId}$`);
      }
    }
  }

  // Add sslmode=require if missing and in Worker
  if (uri && !uri.includes('sslmode=') && isWorker) {
    uri += (uri.includes('?') ? '&' : '?') + 'sslmode=require';
  }

  return uri;
}
