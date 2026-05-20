/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['169.254.83.107'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
