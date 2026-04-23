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
import { extractPlainText } from './utils/extractPlainText'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getEnv } from './utils/getEnv'

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

// console.log(nestedDocs)

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
    domain: 'lagosmuseumarchives.ng',
    secure: true,
    sameSite: 'Lax',
  },
  csrf: [
    'https://lagosmuseumarchives.ng',
    getEnv('NEXT_PUBLIC_SERVER_URL'),
  ].filter(Boolean) as string[],
  serverURL: getEnv('NEXT_PUBLIC_SERVER_URL') || getEnv('PAYLOAD_PUBLIC_SERVER_URL') || 'https://lagosmuseumarchives.ng',
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
    pool: (() => {
      // Use a getter so connectionString is resolved at request time, not at module
      // evaluation time. This is critical for Cloudflare Workers where Hyperdrive
      // bindings are only accessible inside the request context (AsyncLocalStorage).
      const isWorker = typeof caches !== 'undefined'

      const poolConfig: Record<string, unknown> = {
        // With Hyperdrive, 5 connections per isolate is sufficient.
        // Hyperdrive manages the actual pool to Neon externally.
        max: isWorker ? 5 : 20,
        connectionTimeoutMillis: 10000,
        // Keep connections alive within the isolate so they can be reused
        // across requests. Hyperdrive handles the upstream pooling to Neon.
        idleTimeoutMillis: isWorker ? 0 : 10000,
        allowExitOnIdle: false,
        statement_timeout: 30000,
      }

      // Define connectionString as a getter so it is evaluated lazily —
      // specifically when pg.Pool is constructed inside postgresAdapter.connect(),
      // which is called by getPayload() on the first incoming request when the
      // Cloudflare request context (and therefore the Hyperdrive binding) is live.
      Object.defineProperty(poolConfig, 'connectionString', {
        get() {
          const uri = getEnv('DATABASE_URI')
          const isHyperdrive =
            uri.includes('hyperdrive') ||
            (isWorker && process.env.DATABASE_URI_SOURCE === 'Hyperdrive')

          // Force sslmode=require for direct Worker → Neon connections;
          // not needed for Hyperdrive (its proxy handles TLS internally).
          if (uri && isWorker && !isHyperdrive) {
            if (uri.includes('sslmode=')) {
              return uri.replace(/sslmode=[^&]+/, 'sslmode=require')
            }
            return uri + (uri.includes('?') ? '&' : '?') + 'sslmode=require'
          }
          return uri
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
