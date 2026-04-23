import type { CollectionConfig } from 'payload'

// Detect Cloudflare Worker environment
const isWorker = typeof caches !== 'undefined'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    pagination: { defaultLimit: 20, limits: [20, 50, 100] },
    useAsTitle: 'alt',
  },
  upload: {
    // Disable server-side resizing in Cloudflare Workers because 'sharp' is not available
    imageSizes: isWorker ? [] : [
      {
        name: 'thumb',
        width: 300,
        height: 300,
        crop: 'center',
      },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      index: true,
    },
  ],
}
