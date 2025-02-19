/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },typescript:{
    ignoreBuildErrors:true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Increase limit (adjust as needed)
    },
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
