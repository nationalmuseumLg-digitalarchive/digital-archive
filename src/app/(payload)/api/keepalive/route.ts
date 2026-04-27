// Health probe + Neon keepalive in one. Hit by Cloudflare Cron Trigger every
// 4 minutes (see wrangler.jsonc + worker.js) so Neon's free-tier compute never
// auto-suspends, and curlable on demand to diagnose config drift.
//
// Returns a structured JSON report: which env vars are present (no values
// leaked), and whether a one-shot `SELECT 1` over Neon's HTTP driver succeeds.
// HTTP driver is used here on purpose — no WebSocket pool, no shared state, no
// dependency on the Payload adapter — so this endpoint stays green even if the
// adapter is misconfigured.
import { neon } from '@neondatabase/serverless'

export const dynamic = 'force-dynamic'

const REQUIRED_ENVS = [
  'DATABASE_URI',
  'PAYLOAD_SECRET',
  'NEXT_PUBLIC_SERVER_URL',
  'S3_BUCKET',
  'S3_ENDPOINT',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
] as const

export async function GET() {
  const envReport = Object.fromEntries(
    REQUIRED_ENVS.map((k) => [k, Boolean(process.env[k])]),
  ) as Record<(typeof REQUIRED_ENVS)[number], boolean>

  const missing = REQUIRED_ENVS.filter((k) => !envReport[k])
  const url = process.env.DATABASE_URI || ''

  if (!url) {
    return Response.json(
      {
        ok: false,
        reason: 'DATABASE_URI missing — set it as a Cloudflare secret: `wrangler secret put DATABASE_URI`',
        env: envReport,
        missing,
      },
      { status: 500, headers: { 'cache-control': 'no-store' } },
    )
  }

  try {
    const u = new URL(url)
    u.searchParams.delete('sslmode')
    const sql = neon(u.toString())
    const started = Date.now()
    const rows = await sql`SELECT 1 as ok`
    return Response.json(
      {
        ok: true,
        ms: Date.now() - started,
        rows: rows.length,
        host: u.hostname,
        env: envReport,
        missing,
      },
      { headers: { 'cache-control': 'no-store' } },
    )
  } catch (err) {
    return Response.json(
      {
        ok: false,
        reason: 'db query failed',
        error: err instanceof Error ? err.message : String(err),
        env: envReport,
        missing,
      },
      { status: 500, headers: { 'cache-control': 'no-store' } },
    )
  }
}
