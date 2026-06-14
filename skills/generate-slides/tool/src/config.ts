import { config as loadEnv } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import type { AppConfig } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toolRoot = path.resolve(__dirname, "..");

export function loadConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  loadEnv({ path: path.join(toolRoot, ".env") });

  const base: AppConfig = {
    geminiApiKey: process.env.GEMINI_API_KEY ?? "",
    geminiModel: "gemini-3.1-flash-image-preview",
    concurrency: 2,
    outputDir: path.resolve("output"),
    designGuidelinesPath: path.resolve(toolRoot, "..", "references", "design-guidelines.md"),
    retryAttempts: 5,
    retryDelayMs: 10000,
  };

  return { ...base, ...overrides };
}
