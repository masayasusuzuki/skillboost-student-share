import { Command } from "commander";
import fs from "fs";
import path from "path";
import { loadConfig } from "./config.js";
import { parseScript } from "./pipeline/parse.js";
import { generateSlideImages } from "./pipeline/generate.js";
import { assembleOutput } from "./pipeline/assemble.js";
import { logStep } from "./utils/logger.js";
import type { SlidePlan, GeneratedSlide } from "./types.js";

/** "0,3,5" や "0-3,7" のような文字列をindexのSetに展開する */
function parseSlideIndices(input: string): Set<number> {
  const indices = new Set<number>();
  for (const part of input.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (isNaN(start) || isNaN(end)) {
        console.error(`Warning: Invalid range "${trimmed}", skipping`);
        continue;
      }
      if (start > end) {
        console.error(`Warning: Invalid range "${trimmed}" (start > end), skipping`);
        continue;
      }
      for (let i = start; i <= end; i++) indices.add(i);
    } else {
      const num = parseInt(trimmed, 10);
      if (isNaN(num)) {
        console.error(`Warning: Invalid index "${trimmed}", skipping`);
        continue;
      }
      indices.add(num);
    }
  }
  return indices;
}

const program = new Command();

program
  .name("slide-generator")
  .description("台本MarkdownからAIスライドを生成する")
  .argument("<input>", "台本Markdownファイル or plan.jsonのパス")
  .option("-o, --output <dir>", "出力ベースディレクトリ", "output")
  .option("-c, --concurrency <n>", "画像生成の並列数", "2")
  .option("--parse-only", "パースのみ実行（Claude Codeでplan.json作成用）")
  .option("--model <name>", "Geminiモデル名", "gemini-3.1-flash-image-preview")
  .option("--slides <indices>", "再生成するスライドのindex（例: 0,3,5 / 0-3,7）")
  .option("--assemble-only", "画像生成スキップ、PPTX/PDFのみ再構築")
  .action(async (inputPath: string, opts) => {
    try {
      const config = loadConfig({
        outputDir: path.resolve(opts.output),
        concurrency: Math.min(parseInt(opts.concurrency, 10), 20),
        geminiModel: opts.model,
      });

      const resolved = path.resolve(inputPath);

      // plan.jsonが渡された場合: Stage 3-4 実行
      if (resolved.endsWith(".json")) {
        logStep("Resume", `Loading plan from ${resolved}`);
        const plan: SlidePlan = JSON.parse(fs.readFileSync(resolved, "utf-8"));
        const baseName = plan.moduleName || "slides";

        // -o で指定されたディレクトリに直接出力（サブフォルダを作らない）
        const moduleDir = config.outputDir;
        fs.mkdirSync(moduleDir, { recursive: true });

        // plan.jsonもコピー（入力が出力先と同一でなければ）
        const destPlan = path.join(moduleDir, "plan.json");
        if (path.resolve(resolved) !== path.resolve(destPlan)) {
          fs.copyFileSync(resolved, destPlan);
        }

        // --assemble-only: 画像生成スキップ、既存PNGからPPTX/PDFのみ再構築
        if (opts.assembleOnly) {
          logStep("Assemble", "Reassembling from existing images...");
          const slides: GeneratedSlide[] = plan.slides.map((slide) => ({
            ...slide,
            imagePath: path.join(moduleDir, `slide_${String(slide.index).padStart(3, "0")}.png`),
          }));

          // 全画像の存在チェック
          for (const slide of slides) {
            if (!fs.existsSync(slide.imagePath)) {
              console.error(`Error: Missing image ${slide.imagePath}`);
              process.exit(1);
            }
          }

          const { pptxPath, pdfPath } = await assembleOutput(slides, baseName, moduleDir);
          logStep("Done", `PPTX: ${pptxPath}`);
          logStep("Done", `PDF:  ${pdfPath}`);
          return;
        }

        // 画像生成が必要な場合はAPIキーチェック
        if (!config.geminiApiKey) {
          console.error("Error: GEMINI_API_KEY is not set in .env");
          process.exit(1);
        }

        // --slides: 指定indexのPNGを削除して再生成対象にする
        if (opts.slides) {
          const targetIndices = parseSlideIndices(opts.slides);
          const deleted: number[] = [];
          for (const idx of targetIndices) {
            const pngPath = path.join(moduleDir, `slide_${String(idx).padStart(3, "0")}.png`);
            if (fs.existsSync(pngPath)) {
              fs.unlinkSync(pngPath);
              deleted.push(idx);
            }
          }
          logStep("Regenerate", `Cleared ${deleted.length} cached images: [${deleted.join(", ")}]`);
        }

        // Stage 3: Generate（画像もmoduleDirに保存、キャッシュ済みはスキップ）
        const slides = await generateSlideImages(plan, moduleDir, config);

        // Stage 4: Assemble
        const { pptxPath, pdfPath } = await assembleOutput(slides, baseName, moduleDir);

        logStep("Done", `Output: ${moduleDir}/`);
        logStep("Done", `PPTX: ${pptxPath}`);
        logStep("Done", `PDF:  ${pdfPath}`);
        return;
      }

      // Markdownが渡された場合: Stage 1 (パース)
      const parsed = parseScript(resolved);

      if (opts.parseOnly) {
        console.log(JSON.stringify(parsed, null, 2));
        return;
      }

      // ガイド表示
      console.log("\n次のステップ:");
      console.log("1. --parse-only の出力を Claude Code に渡して plan.json を作ってもらう");
      console.log("2. npx tsx src/index.ts plan.json で画像生成+出力\n");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`\nError: ${message}`);
      process.exit(1);
    }
  });

program.parse();
