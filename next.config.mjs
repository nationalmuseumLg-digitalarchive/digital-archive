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
    // Enable serverActions in Next.js 15+ (object form)
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '*.pages.dev',
        '*.workers.dev',
        'nationalmuseumlagos.org',
        '*.nationalmuseumlagos.org',
        'lagosmuseumarchives.ng',
        '*.lagosmuseumarchives.ng'
      ]
    }
  },
  turbopack: {
    root: '.'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  }

  // Your Next.js config here
}

export default withPayload(nextConfig)
