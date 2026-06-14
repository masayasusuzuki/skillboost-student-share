import fs from "fs";
import path from "path";
import pLimit from "p-limit";
import type { SlidePlan, GeneratedSlide, AppConfig } from "../types.js";
import { generateImage } from "../clients/gemini.js";
import { logStep, logProgress } from "../utils/logger.js";

export async function generateSlideImages(
  plan: SlidePlan,
  imageDir: string,
  config: AppConfig,
): Promise<GeneratedSlide[]> {
  fs.mkdirSync(imageDir, { recursive: true });

  const limit = pLimit(config.concurrency);
  const total = plan.slides.length;

  logStep("Generate", `Generating ${total} slide images (concurrency: ${config.concurrency})...`);

  let completed = 0;

  const results = await Promise.all(
    plan.slides.map((slide) =>
      limit(async (): Promise<GeneratedSlide> => {
        const imagePath = path.join(
          imageDir,
          `slide_${String(slide.index).padStart(3, "0")}.png`,
        );

        // 既に生成済みならスキップ
        if (fs.existsSync(imagePath)) {
          completed++;
          logProgress(completed, total, `Skipped (cached): ${slide.title}`);
          return { ...slide, imagePath };
        }

        const imageBuffer = await generateImage(slide.imagePrompt, config);
        fs.writeFileSync(imagePath, imageBuffer);

        completed++;
        logProgress(completed, total, slide.title);

        return { ...slide, imagePath };
      }),
    ),
  );

  logStep("Generate", "All images generated.");
  return results;
}
