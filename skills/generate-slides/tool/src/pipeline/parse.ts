import fs from "fs";
import type { ParsedModule, Section, CodeBlock, ModuleMetadata } from "../types.js";
import { logStep } from "../utils/logger.js";

export function parseScript(filePath: string): ParsedModule {
  logStep("Parse", `Reading ${filePath}`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n");

  const title = extractTitle(lines);
  const metadata = extractMetadata(raw);
  const sections = extractSections(raw);

  logStep("Parse", `Title: ${title}`);
  logStep("Parse", `Duration: ${metadata.duration}`);
  logStep("Parse", `Sections: ${sections.length}`);

  return { title, metadata, sections };
}

function extractTitle(lines: string[]): string {
  for (const line of lines) {
    const match = line.match(/^# (.+)$/);
    if (match) return match[1].trim();
  }
  return "Untitled";
}

function extractMetadata(raw: string): ModuleMetadata {
  const duration = raw.match(/対象時間[：:]\s*(.+)/)?.[1]?.trim() ?? "";

  const objectives: string[] = [];
  const objMatch = raw.match(/このモジュールで学ぶこと\n([\s\S]*?)(?=\n---|\n## )/);
  if (objMatch) {
    const objLines = objMatch[1].split("\n");
    for (const line of objLines) {
      const m = line.match(/^\s+- (.+)/);
      if (m) objectives.push(m[1].trim());
    }
  }

  return { duration, objectives };
}

function extractSections(raw: string): Section[] {
  // 台本セクション以降を取得
  const scriptStart = raw.indexOf("## 台本");
  if (scriptStart === -1) {
    // 台本ヘッダがない場合はH3で分割
    return splitBySections(raw);
  }

  const scriptBody = raw.slice(scriptStart);
  return splitBySections(scriptBody);
}

function splitBySections(text: string): Section[] {
  const parts = text.split(/(?=^### \[)/m);
  const sections: Section[] = [];

  for (const part of parts) {
    const nameMatch = part.match(/^### \[(.+?)\]/);
    if (!nameMatch) continue;

    const name = nameMatch[1];
    const content = part.slice(nameMatch[0].length).trim();
    const operations = extractOperations(content);
    const codeBlocks = extractCodeBlocks(content);
    const lineCount = content.split("\n").length;

    sections.push({ name, content, operations, codeBlocks, lineCount });
  }

  return sections;
}

function extractOperations(content: string): string[] {
  const ops: string[] = [];
  const regex = /【操作】(.+)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    ops.push(match[1].trim());
  }
  return ops;
}

function extractCodeBlocks(content: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push({ language: match[1] || "", code: match[2].trim() });
  }
  return blocks;
}
