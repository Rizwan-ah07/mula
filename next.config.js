/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip ESLint + type-checking during `next build` — both run in the editor
  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors:  true },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.imgur.com' },
    ],
  },

  // Keep mongodb out of the client bundle
  experimental: {
    serverComponentsExternalPackages: ['mongodb'],
  },
};

module.exports = nextConfig;
