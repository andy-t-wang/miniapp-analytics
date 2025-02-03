import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "world-id-assets.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
