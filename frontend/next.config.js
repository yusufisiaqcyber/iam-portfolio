/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.cybernuggets.name.ng/api',
    NEXT_PUBLIC_YOUTUBE_URL: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@cybernuggetz-iam',
  },
  images: {
    domains: ['github.com', 'avatars.githubusercontent.com'],
  }
}

module.exports = nextConfig;
