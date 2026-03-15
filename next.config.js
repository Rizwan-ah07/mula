/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip ESLint during `next build` — run it separately in CI if needed
  eslint: { ignoreDuringBuilds: true },

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
