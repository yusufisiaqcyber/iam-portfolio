/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    NEXT_PUBLIC_YOUTUBE_URL: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@yourchannel',
  },
  images: {
    domains: ['github.com', 'avatars.githubusercontent.com'],
  }
}

module.exports = nextConfig;
