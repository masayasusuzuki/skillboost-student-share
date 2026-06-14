// スクレイピング結果の型定義。フロントとAPIで共有する。

export type ScrapedPlan = {
  plan: string; // プラン名（例: スタンダード）
  tier: string; // basic | standard | premium
  monthly: number; // 月額（円）
  yearly: number; // 年額（円）
};

export type ScrapeSuccess = {
  url: string;
  company: string;
  plans: ScrapedPlan[];
};

export type ScrapeFailure = {
  url: string;
  error: string;
};

export type ScrapeResult = ScrapeSuccess | ScrapeFailure;

export function isFailure(r: ScrapeResult): r is ScrapeFailure {
  return "error" in r;
}
