import fs from "fs";
import path from "path";
import PptxGenJS from "pptxgenjs";
import { PDFDocument } from "pdf-lib";
import type { GeneratedSlide } from "../types.js";
import { logStep } from "../utils/logger.js";

function detectImageFormat(buf: Buffer): "png" | "jpeg" {
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return "png";
  }
  return "jpeg";
}

export async function assembleOutput(
  slides: GeneratedSlide[],
  baseName: string,
  outputDir: string,
): Promise<{ pptxPath: string; pdfPath: string }> {
  const pptxPath = path.join(outputDir, `${baseName}.pptx`);
  const pdfPath = path.join(outputDir, `${baseName}.pdf`);

  await buildPptx(slides, pptxPath);
  await buildPdf(slides, pdfPath);

  return { pptxPath, pdfPath };
}

async function buildPptx(slides: GeneratedSlide[], outputPath: string): Promise<void> {
  logStep("Assemble", "Building PPTX...");

  // @ts-expect-error PptxGenJS default export typing issue
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";

  for (const slide of slides) {
    const pptxSlide = pptx.addSlide();

    const imageData = fs.readFileSync(slide.imagePath);
    const fmt = detectImageFormat(imageData);
    const base64 = imageData.toString("base64");

    pptxSlide.addImage({
      data: `image/${fmt};base64,${base64}`,
      x: 0,
      y: 0,
      w: "100%",
      h: "100%",
    });

    if (slide.speakerNotes) {
      pptxSlide.addNotes(slide.speakerNotes);
    }
  }

  await pptx.writeFile({ fileName: outputPath });
  logStep("Assemble", `PPTX saved: ${outputPath}`);
}

async function buildPdf(slides: GeneratedSlide[], outputPath: string): Promise<void> {
  logStep("Assemble", "Building PDF...");

  const pdfDoc = await PDFDocument.create();

  for (const slide of slides) {
    const imageBytes = fs.readFileSync(slide.imagePath);
    const fmt = detectImageFormat(imageBytes);
    const image = fmt === "png"
      ? await pdfDoc.embedPng(imageBytes)
      : await pdfDoc.embedJpg(imageBytes);

    // 16:9 aspect ratio
    const width = 960;
    const height = 540;
    const page = pdfDoc.addPage([width, height]);

    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
  logStep("Assemble", `PDF saved: ${outputPath}`);
}
