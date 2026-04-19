import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["fs"],
  experimental: {
    webpackBuildWorker: false,
  },
};

export default nextConfig;
