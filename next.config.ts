import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  },

  // Ensure API routes use Node.js runtime
  api: {
    externalResolver: true,
  },

  // Headers configuration
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, x-admin-key" },
        ],
      },
    ];
  },
};

export default nextConfig;
