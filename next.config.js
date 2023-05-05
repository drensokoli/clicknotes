/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

// module.exports = nextConfig
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org', 'lh3.googleusercontent.com'],
    unoptimized: true,
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  }
}
