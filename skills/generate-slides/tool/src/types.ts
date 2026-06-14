// Stage 1: Markdownパース結果
export interface ParsedModule {
  title: string;
  metadata: ModuleMetadata;
  sections: Section[];
}

export interface ModuleMetadata {
  duration: string;
  objectives: string[];
}

export interface Section {
  name: string;
  content: string;
  operations: string[];
  codeBlocks: CodeBlock[];
  lineCount: number;
}

export interface CodeBlock {
  language: string;
  code: string;
}

// Stage 2: スライド計画（Claude Codeが生成してplan.jsonとして保存）
export interface SlidePlan {
  moduleName: string;
  slides: SlideSpec[];
  totalCount: number;
}

export interface SlideSpec {
  index: number;
  sectionName: string;
  title: string;
  keyPoints: string[];
  imagePrompt: string;
  layoutHint: "title" | "bullets" | "comparison" | "diagram" | "code" | "summary";
  speakerNotes: string;
}

// Stage 3: 画像生成済みスライド
export interface GeneratedSlide extends SlideSpec {
  imagePath: string;
}

// 設定
export interface AppConfig {
  geminiApiKey: string;
  geminiModel: string;
  concurrency: number;
  outputDir: string;
  designGuidelinesPath: string;
  retryAttempts: number;
  retryDelayMs: number;
}
