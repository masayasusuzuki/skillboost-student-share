import type { NextConfig } from "next";
import { config } from "dotenv";
import path from "path";

// ルートディレクトリの .env.local を読み込む
config({ path: path.resolve(__dirname, "../.env.local") });

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
