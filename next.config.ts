import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@journals/mf-contract"],
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
};

export default nextConfig;
