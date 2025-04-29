import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/codinho',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
