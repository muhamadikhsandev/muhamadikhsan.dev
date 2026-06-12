import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // FIX NEXT IMAGE: Menghapus 'unoptimized: true' agar gambar otomatis dikompres ke WebP & dibuat responsif
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wknxqscwvlphuwtvbvot.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;