/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'i.ytimg.com',
      'www.travelandleisure.com',
      'encrypted-tbn0.gstatic.com',
      'whereintheworldisnina.com'
    ],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default nextConfig

