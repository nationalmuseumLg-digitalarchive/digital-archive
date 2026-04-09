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
import { getDbConnectionString } from './utils/getDbConfig'

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
  upload: {
    limits: {
      fileSize: 100000000, // 100MB, written in bytes
    },
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: getDbConnectionString(),
      max: process.env.CI ? 10 : (typeof caches !== 'undefined' ? 1 : undefined),
    },
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
          ...(process.env.NEXT_PUBLIC_R2_URL
            ? {
                disablePayloadAccessControl: true,
                generateFileURL: ({ filename, prefix }) => {
                  const path = prefix ? `${prefix}/${filename}` : filename
                  return `${process.env.NEXT_PUBLIC_R2_URL}/${path}`
                },
              }
            : {}),
        },
      },
      bucket: process.env.S3_BUCKET,
      config: {
        credentials: {
          forcePathStyle: true,
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        endpoint: process.env.S3_ENDPOINT,
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
