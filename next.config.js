/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'imgix.cosmicjs.com',
      'cdn.cosmicjs.com',
      'images.unsplash.com'
    ],
  },
  env: {
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  },
}

module.exports = nextConfig