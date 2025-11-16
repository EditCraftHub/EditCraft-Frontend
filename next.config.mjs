/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // Modern formats first
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  
  // swcMinify is removed - it's enabled by default in Next.js 13+
  
  compiler: {
    // Only remove console.log, keep error and warn
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Experimental features for better performance
  experimental: {
    // Removed optimizeCss - causes MODULE_NOT_FOUND error with 'critters'
    optimizePackageImports: ['gsap', 'lucide-react', 'react-icons'],
  },
};

export default nextConfig;