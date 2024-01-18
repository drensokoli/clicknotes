/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const withPWA = require('next-pwa');

// module.exports = nextConfig
module.exports = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/movies',
        permanent: true,
      },
    ]
  },
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org', 'lh3.googleusercontent.com'],
    unoptimized: true,
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  }
})
