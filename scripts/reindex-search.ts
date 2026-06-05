// Re-syncs documents across the searchable collections so the Payload `search`
// index picks up the type / excerpt / collectionRoute / imageUrl fields.
// Re-saving a document triggers the search plugin's afterChange hook, which
// re-runs `beforeSync` and writes the current fields into the index.
//
// RESUME MODE: docs already indexed with the new fields (a search entry whose
// `type` is set) are skipped, so the job only processes what's left. If the
// connection drops, just run it again — it continues from where it stopped.
//
// Resilient to transient Neon drops: a dropped pg connection can surface as an
// unhandled 'error' event; we keep the process alive and retry each operation.
//
// Run (dev server can stay up):  npx tsx scripts/reindex-search.ts
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

process.on('uncaughtException', (e) => console.warn('  ~ uncaught (continuing):', e?.message))
process.on('unhandledRejection', (e: any) => console.warn('  ~ rejection (continuing):', e?.message ?? e))

const collections = [
  'pages',
  'alternativePages',
  'ethnographicItems',
  'maps',
  'manuscripts',
  'intelligence_reports',
  'government_reports',
  'photos',
  'alternative_heritages',
  'alternative_archival_heritages',
] as const

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function withRetry<T>(fn: () => Promise<T>, tries = 4): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < tries; i++) {
    try {
      return await fn()
    } catch (e) {
      lastErr = e
      await sleep(400 * (i + 1)) // brief backoff; lets a dropped pool reconnect
    }
  }
  throw lastErr
}

// IDs of source docs in `slug` that already have a search entry with `type` set
// (i.e. synced with the current config). Those are skipped on this run.
async function alreadyDone(payload: any, slug: string): Promise<Set<number | string>> {
  const done = new Set<number | string>()
  let page = 1
  for (;;) {
    const res = await withRetry<any>(() =>
      payload.find({
        collection: 'search',
        depth: 0,
        limit: 500,
        page,
        where: { and: [{ 'doc.relationTo': { equals: slug } }, { type: { exists: true } }] },
      }),
    )
    for (const d of res.docs) {
      const v = d?.doc?.value
      if (v != null) done.add(typeof v === 'object' ? v.id : v)
    }
    if (!res.hasNextPage) break
    page++
  }
  return done
}

async function reindex() {
  console.log('Booting Payload…')
  const payload = await getPayload({ config })
  console.log('Payload ready. Reindexing (resume mode)…')

  for (const slug of collections) {
    const done = await alreadyDone(payload, slug)
    const { docs } = await withRetry<any>(() =>
      payload.find({ collection: slug, limit: 5000, depth: 0 }),
    )

    let ok = 0
    let failed = 0
    let skipped = 0
    for (const doc of docs) {
      if (done.has(doc.id)) {
        skipped++
        continue
      }
      try {
        await withRetry(() => payload.update({ collection: slug, id: doc.id, data: {} as any }))
        ok++
      } catch (err) {
        failed++
        console.error(`  ! ${slug} #${doc.id}:`, (err as Error).message)
      }
    }
    console.log(
      `${slug}: synced ${ok}, skipped ${skipped} (already done)${failed ? `, ${failed} failed` : ''} — of ${docs.length}`,
    )
  }

  console.log('Done.')
  process.exit(0)
}

reindex().catch((err) => {
  console.error('Reindex failed:', err)
  process.exit(1)
})
