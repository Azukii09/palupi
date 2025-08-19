import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone", // agar .next/standalone bisa dijalankan tanpa install node_modules di runtime
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
