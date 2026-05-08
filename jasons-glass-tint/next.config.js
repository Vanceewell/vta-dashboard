/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  // Uncomment below for static export (GitHub Pages / CDN hosting)
  // output: 'export',
  // trailingSlash: true,
};

module.exports = nextConfig;
