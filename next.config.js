/** @type {import('next').NextConfig} */
const runtimeCaching = require("next-pwa/cache");


const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true,      // Enable SWC minification for improved performance
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
};

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching,
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
})

// module.exports = nextConfig
module.exports = withPWA({
  async redirects() {
    return [
      {
        source: '/',
        destination: '/movies',
        permanent: true,
      },
    ]
  },
  nextConfig,
  images: {
    domains: ['image.tmdb.org', 'lh3.googleusercontent.com'],
    unoptimized: true,
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  }
})
