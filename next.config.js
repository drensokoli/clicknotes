/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache')  

// module.exports = nextConfig
module.exports = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    runtimeCaching,
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
  reactStrictMode: false,
  images: {
    domains: ['image.tmdb.org', 'lh3.googleusercontent.com'],
    unoptimized: true,
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  }
})
