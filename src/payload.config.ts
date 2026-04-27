// @ts-nocheck
// storage-adapter-import-placeholder
import { s3Storage } from '@payloadcms/storage-s3'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { searchPlugin } from '@payloadcms/plugin-search'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getEnv } from './utils/getEnv'
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless'

// @neondatabase/serverless uses WebSocket to connect to Neon, which is natively
// tracked I/O in Cloudflare Workers. The nodejs_compat net.Socket polyfill that
// pg uses for TCP connections is NOT properly registered with the Workers I/O
// scheduler, causing every cold-start pool.connect() to look like a hung Promise
// and get the Worker killed. WebSocket has no such issue.
const isWorker = typeof caches !== 'undefined'
if (isWorker) {
  // Workers has a global WebSocket; Neon needs it injected explicitly.
  neonConfig.webSocketConstructor = WebSocket
}

// Cloudflare Workers limitation: I/O objects (WebSockets, sockets, streams)
// cannot be reused across requests. Payload caches the postgres pool globally
// via `getPayload()`, so without intervention request 2 inherits request 1's
// WebSockets and throws "Cannot perform I/O on behalf of a different request".
//
// WorkerPool wraps @neondatabase/serverless Pool and reads
// getCloudflareContext().ctx to detect a new request. When the ctx changes, we
// abandon the prior inner pool (Workers reaps its sockets at end-of-request)
// and create a fresh NeonPool bound to the current request. We do NOT call
// .end() on the abandoned pool because doing so can fire ECONNRESET on the
// keepalive client that connectWithReconnect (in @payloadcms/db-postgres)
// holds, which would loop forever trying to reconnect on a dead pool.
class WorkerPool {
  constructor(options) {
    this.options = options
    this._inner = null
    this._innerCtx = null
  }
  _getInner() {
    let ctx = null
    try {
      ctx = getCloudflareContext()?.ctx ?? null
    } catch {
      // Outside a request context (boot / build); fall through to keep current pool.
    }
    if (!this._inner || (ctx && this._innerCtx !== ctx)) {
      this._inner = new NeonPool(this.options)
      this._innerCtx = ctx
    }
    return this._inner
  }
  query(text, values) {
    return this._getInner().query(text, values)
  }
  connect() {
    return this._getInner().connect()
  }
  async end() {
    /* no-op: per-request lifecycle handled by Workers I/O cleanup */
  }
  on() {
    return this
  }
  off() {
    return this
  }
  prependListener() {
    return this
  }
  removeListener() {
    return this
  }
  removeAllListeners() {
    return this
  }
}

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { AlternativePages } from './collections/AlternativePages'
import { EthnographicItems } from './collections/EthnographicItems'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { Manuscripts } from './collections/Manuscripts'
import { IntelligenceReports } from './collections/IntelligenceReports'
import { Maps } from './collections/Maps'
import { ArchaeologyAndEthnography } from './collections/ArchaeologyAndEthnography'
import { GovernmentReports } from './collections/GovernmentReports'
import { Photos } from './collections/Photos'
import { AlternativeHeritage } from './collections/AlternativeHeritage'
import { AlternativeArchivalHeritage } from './collections/AlternativeArchivalHeritage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Resolve the public origin once. Used for cookie scoping, serverURL, and CSRF.
const SERVER_URL =
  getEnv('NEXT_PUBLIC_SERVER_URL') ||
  getEnv('PAYLOAD_PUBLIC_SERVER_URL') ||
  'https://lagosmuseumarchives.ng'
const SERVER_HOSTNAME = (() => {
  try {
    return new URL(SERVER_URL).hostname
  } catch {
    return 'lagosmuseumarchives.ng'
  }
})()

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    AlternativePages,
    EthnographicItems,
    Maps,
    Manuscripts,
    IntelligenceReports,
    ArchaeologyAndEthnography,
    GovernmentReports,
    AlternativeHeritage,
    AlternativeArchivalHeritage,
    Photos,
  ],
  globals: [Header, Footer],
  // Fix for proxy auth drops and CORS mismatch in Cloudflare
  cors: '*', // Allow origin matching bypass for proxy host changes
  // Explicit cookie config to prevent Cloudflare/browser from dropping the payload-token
  cookiePrefix: 'payload',
  cookie: {
    domain: SERVER_HOSTNAME,
    secure: true,
    sameSite: 'Lax',
  },
  csrf: [SERVER_URL].filter(Boolean) as string[],
  serverURL: SERVER_URL,
  upload: {
    limits: {
      fileSize: 100000000, // 100MB, written in bytes
    },
  },
  editor: lexicalEditor(),
  secret: getEnv('PAYLOAD_SECRET'),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // Never push schema in production. NODE_ENV=production in wrangler.jsonc also prevents
    // this, but explicit push:false is a hard guard regardless of NODE_ENV.
    push: false,
    // In Workers: use WorkerPool (per-request NeonPool wrapper). NeonPool alone
    // breaks across requests because Workers forbids reusing I/O objects.
    // In local dev: fall back to standard pg (no pg option = use default).
    pg: isWorker ? ({ Pool: WorkerPool } as any) : undefined,
    pool: (() => {
      const poolConfig: Record<string, unknown> = {
        // Workers: 5 WebSocket connections (no TCP; @neondatabase/serverless handles pooling).
        // Build/local-dev: 3 max to avoid exhausting Neon's per-endpoint connection limit.
        max: isWorker ? 5 : 3,
        // 30s covers Neon free-tier cold start (~10s) plus query overhead.
        connectionTimeoutMillis: 30000,
        // Workers: 0 = no idle eviction (WebSocket connections are cheap, reuse them).
        // Build/local-dev: release idle connections quickly so the build doesn't exhaust Neon.
        idleTimeoutMillis: isWorker ? 0 : 3000,
        allowExitOnIdle: true,
        statement_timeout: 30000,
      }

      Object.defineProperty(poolConfig, 'connectionString', {
        get() {
          // Read once via getEnv so Cloudflare bindings (secrets) take priority
          // over anything baked into next-env.mjs at build time. Falls back to
          // process.env in non-Worker contexts (build / local dev).
          const raw = getEnv('DATABASE_URI') || process.env.DATABASE_URI || ''
          if (!raw) {
            // Fail loud and named instead of letting @neondatabase/serverless
            // open a WSS to nothing and surface "[object ErrorEvent]".
            throw new Error(
              'DATABASE_URI is not set. In Cloudflare Workers it must be a secret: ' +
                '`npx wrangler secret put DATABASE_URI`. Locally, set it in .env.',
            )
          }
          try {
            const u = new URL(raw)
            // Workers: @neondatabase/serverless's WebSocket transport always uses
            // TLS, and pg refuses URLs with sslmode=verify-full there. Strip it.
            // Non-Workers (local build, dev, scripts): keep sslmode — node-postgres
            // needs it to negotiate TLS against Neon, otherwise Neon rejects with
            // "connection is insecure (try using sslmode=require)".
            if (isWorker) u.searchParams.delete('sslmode')
            return u.toString()
          } catch {
            throw new Error(
              `DATABASE_URI is set but is not a valid URL (length=${raw.length}). ` +
                'Expected postgres://user:pass@host[:port]/db.',
            )
          }
        },
        enumerable: true,
        configurable: true,
      })

      return poolConfig as any
    })(),
  }),
  plugins: [
    searchPlugin({
      collections: ['pages', 'alternativePages'],
      defaultPriorities: {
        pages: 20,
        alternativePages: 20,
      },
      fields: ({ defaultFields }) => [
        ...defaultFields,

        {
          name: 'cardKeywords',
          type: 'text',
          search: true,
        },
        {
          name: 'cardDescriptions',
          type: 'text',
          search: true,
        },
        {
          name: 'cardTitles',
          type: 'text',
          search: true,
        },
      ],
      beforeSync: ({ originalDoc, searchDoc }) => {
        // ...searchDoc,
        searchDoc.title = originalDoc.internalName || 'Untitled'

        if (originalDoc.pageSection?.layout) {
          const cardBlocks = originalDoc.pageSection.layout.filter(
            (block) => block.blockType === 'file', // Only focus on card blocks
          )

          // Process each card block and ensure its fields are included in searchDoc
          cardBlocks.forEach((card, idx) => {
            const cardIndex = `card_${idx}` // Assign an index to avoid conflicts

            // Index the card's title, description, and keyword for search
            searchDoc.title = card.title || '' // Searchable card title
            searchDoc.description = card.description || '' // Searchable card description
            searchDoc.keyword = card.keyword || '' // Searchable card keyword
          })
        }

        return searchDoc
      },
    }),
    s3Storage({
      clientUploads: true,
      collections: {
        media: {
          prefix: 'media',
          acl: 'public-read',
          cacheControl: 'public, max-age=31536000, immutable',
          ...(getEnv('NEXT_PUBLIC_R2_URL')
            ? {
                disablePayloadAccessControl: true,
                generateFileURL: ({ filename, prefix }) => {
                  const path = prefix ? `${prefix}/${filename}` : filename
                  return `${getEnv('NEXT_PUBLIC_R2_URL')}/${path}`
                },
              }
            : {}),
        },
      },
      bucket: getEnv('S3_BUCKET'),
      config: {
        credentials: {
          accessKeyId: getEnv('S3_ACCESS_KEY_ID'),
          secretAccessKey: getEnv('S3_SECRET_ACCESS_KEY'),
        },
        // R2 requires path-style URLs; this must be at the top level of the
        // S3Client config, NOT inside the credentials object.
        forcePathStyle: true,
        endpoint: getEnv('S3_ENDPOINT').replace(/\/$/, ''), // strip trailing slash
        region: 'auto',
      },
    }),
    nestedDocsPlugin({
      collections: ['pages'],
      generateLabel: (_, doc) => doc.title,
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),

    // storage-adapter-placeholder
  ],
})
