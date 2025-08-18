import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // agar .next/standalone bisa dijalankan tanpa install node_modules di runtime
};

export default nextConfig;
