/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@anthropic-ai/sdk'],
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'ui-avatars.com', 'images.unsplash.com'],
  },
};

export default nextConfig;
