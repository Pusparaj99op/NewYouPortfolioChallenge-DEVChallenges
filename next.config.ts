import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: "standalone",

  // Optimize images
  images: {
    unoptimized: false,
  },

  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};

export default nextConfig;

