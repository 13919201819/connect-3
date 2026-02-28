// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply CORS headers to API routes for all origins in production
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? process.env.FRONTEND_URL || '*'
              : 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
  
  // Configure for Vercel deployment
  poweredByHeader: false,
  
  // Enable experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: ['nodemailer'],
  },

  // Optimize for production
  compress: true,
  
  // Environment configuration
  env: {
    CUSTOM_KEY: 'clumoss-email-backend',
  },

  // Configure API routes for larger file uploads
  // Note: Vercel has a 5MB limit for serverless functions
  async rewrites() {
    return [
      {
        source: '/health',
        destination: '/api/health',
      },
    ];
  },
};

export default nextConfig;