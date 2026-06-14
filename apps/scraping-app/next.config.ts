import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Playwright を API ルートで使うため Node.js ランタイムで動かす。
  // デモサイトと違い静的書き出し（output: "export"）はしない。
  serverExternalPackages: ["playwright", "playwright-core"],
};

export default nextConfig;
