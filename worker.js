// Wrapper around the OpenNext-generated worker so we can attach a `scheduled`
// handler for Cloudflare Cron Triggers. The OpenNext build regenerates
// .open-next/worker.js on every build, so we keep our extensions out here and
// re-export everything it provides (default fetch handler + Durable Objects).
import openNextWorker from './.open-next/worker.js'

export {
  DOQueueHandler,
  DOShardedTagCache,
  BucketCachePurge,
} from './.open-next/worker.js'

export default {
  fetch: openNextWorker.fetch,

  // Cron Trigger entrypoint. Pings /api/keepalive so Neon's free-tier compute
  // stays warm and visitors don't pay the ~10s wake-up cost.
  async scheduled(event, env, ctx) {
    const url = `${env.NEXT_PUBLIC_SERVER_URL || 'https://lagosmuseumarchives.ng'}/api/keepalive`
    const req = new Request(url, { method: 'GET', headers: { 'x-cron': '1' } })
    ctx.waitUntil(
      openNextWorker.fetch(req, env, ctx).catch((err) => {
        console.error('keepalive cron failed:', err)
      }),
    )
  },
}
