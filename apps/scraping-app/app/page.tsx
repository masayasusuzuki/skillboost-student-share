"use client";

import { useState } from "react";
import type { ScrapeResult, ScrapeSuccess } from "@/lib/types";
import { isFailure } from "@/lib/types";

// デモサイト（scraping-target）の5社分の料金ページURL。
// scraping-target を `npm run dev`（http://localhost:3000）で起動した状態で使う。
const DEMO_URLS = [
  "http://localhost:3000/companies/techstart",
  "http://localhost:3000/companies/cloudbase",
  "http://localhost:3000/companies/dataflow",
  "http://localhost:3000/companies/aiworks",
  "http://localhost:3000/companies/smartoffice",
].join("\n");

// アクセス間隔（ミリ秒）。サーバーに負荷をかけないためのマナー。
const ACCESS_INTERVAL_MS = 3000;

const TIER_ORDER = ["basic", "standard", "premium"] as const;
const TIER_LABEL: Record<string, string> = {
  basic: "ベーシック",
  standard: "スタンダード",
  premium: "プレミアム",
};

const yen = (n: number) => `¥${n.toLocaleString()}`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [urlsText, setUrlsText] = useState(DEMO_URLS);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<ScrapeResult[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0, current: "" });

  const successes = results.filter(
    (r): r is ScrapeSuccess => !isFailure(r)
  );

  async function handleRun() {
    const urls = urlsText
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    if (urls.length === 0) return;

    setRunning(true);
    setResults([]);
    setProgress({ done: 0, total: urls.length, current: urls[0] });

    const collected: ScrapeResult[] = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      setProgress({ done: i, total: urls.length, current: url });

      try {
        const res = await fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const json = await res.json();
        if (res.ok) {
          collected.push(json as ScrapeResult);
        } else {
          collected.push({ url, error: json?.error ?? "取得に失敗しました" });
        }
      } catch {
        collected.push({ url, error: "通信に失敗しました" });
      }

      setResults([...collected]);
      setProgress({ done: i + 1, total: urls.length, current: url });

      // 最後のURL以外は、次のアクセスまで間隔を空ける。
      if (i < urls.length - 1) {
        await sleep(ACCESS_INTERVAL_MS);
      }
    }

    setProgress((p) => ({ ...p, current: "" }));
    setRunning(false);
  }

  function downloadCsv() {
    const header = ["会社", "プラン", "月額", "年額"];
    const rows: string[][] = [];
    for (const s of successes) {
      for (const p of s.plans) {
        rows.push([s.company, p.plan, String(p.monthly), String(p.yearly)]);
      }
    }
    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    // Excel で文字化けしないよう BOM を付ける。
    const blob = new Blob(["﻿" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pricing.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const pct =
    progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
        競合の料金、まとめて取得
      </h1>
      <p className="text-gray-500 mb-8 text-sm">
        料金ページのURLを入力して「実行」を押すと、各ページから料金プランを取得し、比較表とCSVで出力します。
      </p>

      {/* 入力フォーム */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 mb-6">
        <label className="block text-sm font-semibold mb-2">
          取得するURL（1行に1つ）
        </label>
        <textarea
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
          disabled={running}
          rows={5}
          className="w-full rounded-lg border border-gray-300 p-3 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50"
          spellCheck={false}
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-400">
            アクセス間隔: {ACCESS_INTERVAL_MS / 1000}秒（マナーとして待機します）
          </span>
          <button
            onClick={handleRun}
            disabled={running}
            className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:bg-gray-300"
          >
            {running ? "取得中..." : "実行"}
          </button>
        </div>
      </section>

      {/* プログレスバー */}
      {progress.total > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>
              {running && progress.current
                ? `${progress.current} を取得中...`
                : "完了"}
            </span>
            <span>
              {progress.done} / {progress.total}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </section>
      )}

      {/* 結果テーブル */}
      {results.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">取得結果</h2>
            <button
              onClick={downloadCsv}
              disabled={successes.length === 0}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:bg-gray-300"
            >
              CSVダウンロード
            </button>
          </div>

          <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl">
            <table className="min-w-[560px] w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-left">
                  <th className="px-4 py-3 font-medium">会社</th>
                  <th className="px-4 py-3 font-medium">プラン</th>
                  <th className="px-4 py-3 font-medium text-right">月額</th>
                  <th className="px-4 py-3 font-medium text-right">年額</th>
                </tr>
              </thead>
              <tbody>
                {successes.flatMap((s) =>
                  s.plans.map((p, i) => (
                    <tr
                      key={`${s.url}-${p.tier}-${i}`}
                      className="border-t border-gray-100"
                    >
                      <td className="px-4 py-3 font-medium">
                        {i === 0 ? s.company : ""}
                      </td>
                      <td className="px-4 py-3">{p.plan}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {yen(p.monthly)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-gray-500">
                        {yen(p.yearly)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 失敗したURL */}
          {results.filter(isFailure).map((f) => (
            <p key={f.url} className="text-xs text-red-500 mt-2">
              取得失敗: {f.url} — {f.error}
            </p>
          ))}
        </section>
      )}

      {/* 比較表 */}
      {successes.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3">月額料金 比較表</h2>
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl">
            <table className="min-w-[560px] w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-left">
                  <th className="px-4 py-3 font-medium">プラン</th>
                  {successes.map((s) => (
                    <th
                      key={s.url}
                      className="px-4 py-3 font-medium text-right whitespace-nowrap"
                    >
                      {s.company}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIER_ORDER.map((tier) => {
                  // この行（プラン階層）の中で最安の月額を求めてハイライトする。
                  const prices = successes.map(
                    (s) => s.plans.find((p) => p.tier === tier)?.monthly ?? 0
                  );
                  const valid = prices.filter((n) => n > 0);
                  const min = valid.length ? Math.min(...valid) : -1;
                  return (
                    <tr key={tier} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium">
                        {TIER_LABEL[tier]}
                      </td>
                      {successes.map((s, idx) => {
                        const price = prices[idx];
                        const cheapest = price > 0 && price === min;
                        return (
                          <td
                            key={s.url}
                            className={`px-4 py-3 text-right tabular-nums ${
                              cheapest
                                ? "font-bold text-green-600 bg-green-50"
                                : ""
                            }`}
                          >
                            {price > 0 ? yen(price) : "—"}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            各プラン階層で最も安い月額を緑でハイライトしています。
          </p>
        </section>
      )}
    </div>
  );
}
