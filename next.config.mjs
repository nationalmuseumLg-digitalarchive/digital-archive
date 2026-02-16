import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  // Enable frequent revalidation
  experimental: {
    // Enable streaming
    serverActions: true,
  },
   turbopack: {
    root: '.'
  }

  // Your Next.js config here
}

export default withPayload(nextConfig)
