// Lightweight DB ping to keep Neon's free-tier compute from auto-suspending.
// Hit by Cloudflare Cron Trigger every 4 minutes (see wrangler.jsonc + worker.js).
// Uses Neon's HTTP driver (one-shot fetch over Neon's REST query endpoint) — no
// WebSocket pool, no shared state across requests, no caching pitfalls.
import { neon } from '@neondatabase/serverless'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.DATABASE_URI || ''
  if (!url) {
    return Response.json({ ok: false, reason: 'no DATABASE_URI' }, { status: 500 })
  }

  try {
    const u = new URL(url)
    u.searchParams.delete('sslmode')
    const sql = neon(u.toString())
    const started = Date.now()
    const rows = await sql`SELECT 1 as ok`
    return Response.json(
      { ok: true, ms: Date.now() - started, rows: rows.length },
      { headers: { 'cache-control': 'no-store' } },
    )
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
