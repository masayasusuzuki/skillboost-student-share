"use client";

import { useState } from "react";

interface CheckItem {
  item: string;
  status: "ok" | "caution" | "missing";
  quote: string;
  comment: string;
}

interface CheckResult {
  items: CheckItem[];
  summary: string;
}

const STATUS_CONFIG = {
  ok: {
    label: "OK",
    bg: "bg-green-50",
    border: "border-green-300",
    badge: "bg-green-600 text-white",
    icon: "\u2713",
  },
  caution: {
    label: "要確認",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    badge: "bg-yellow-500 text-white",
    icon: "!",
  },
  missing: {
    label: "未記載",
    bg: "bg-red-50",
    border: "border-red-300",
    badge: "bg-red-600 text-white",
    icon: "\u2717",
  },
} as const;

const DEFAULT_SYSTEM_PROMPT = `あなたは法務の専門家です。提出された業務委託契約書の内容を以下の6つのチェック項目に基づいて確認してください。

## チェック項目

1. 契約期間・更新条件: 契約期間が明記されているか。自動更新の有無、更新条件、中途解約の条件が適切に定められているか。
2. 業務範囲・成果物の定義: 委託業務の内容が具体的に定義されているか。成果物の仕様・納品基準が明確か。追加業務が発生した場合の取り扱いが定められているか。
3. 報酬・支払条件: 報酬額、支払時期、支払方法が明記されているか。源泉徴収の取り扱いが適切か。遅延損害金の定めがあるか。
4. 知的財産権の帰属: 成果物の著作権・知的財産権の帰属が明確に定められているか。著作者人格権の取り扱いが記載されているか。既存の知的財産権との区別がされているか。
5. 秘密保持・情報管理: 秘密情報の定義が明確か。秘密保持義務の期間が適切か。情報漏洩時の責任・損害賠償が定められているか。契約終了後の情報の取り扱いが記載されているか。
6. 損害賠償・責任制限: 損害賠償の範囲と上限が定められているか。免責事項が過度に一方的でないか。瑕疵担保責任（契約不適合責任）の期間と内容が適切か。

## 出力形式

必ず以下のJSON形式で出力してください。それ以外のテキストは含めないでください。

{
  "items": [
    {
      "item": "チェック項目名",
      "status": "ok | caution | missing",
      "quote": "契約書から該当箇所を引用（該当なしの場合は空文字）",
      "comment": "参考コメント（問題点の説明や改善提案）"
    }
  ],
  "summary": "総合評価コメント"
}

statusの値:
- "ok": 適切に記載されている
- "caution": 記載はあるが不十分・リスクがある
- "missing": 記載がない・欠落している`;

export default function Home() {
  const [contractText, setContractText] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleCheck = async () => {
    if (!contractText.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText, systemPrompt }),
      });
      const data = await res.json();
      if (res.ok && data.items) {
        setResult(data);
      } else {
        setError(data.error || "不明なエラーが発生しました");
      }
    } catch {
      setError("リクエストに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">法務チェック</h1>
        <p className="text-sm text-gray-500 mt-1">
          契約書の内容をAIが自動チェックします
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          <strong>免責事項:</strong>{" "}
          本ツールはAIによる参考チェックであり、法的助言を構成するものではありません。実際の契約締結にあたっては、必ず弁護士等の専門家にご相談ください。AIの判定は誤りを含む可能性があります。
        </div>

        {/* System Prompt Section */}
        <section className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-700">
              システムプロンプト設定
            </span>
            <span className="text-gray-400 text-sm">
              {showPrompt ? "▲ 閉じる" : "▼ 開く"}
            </span>
          </button>
          {showPrompt && (
            <div className="px-5 pb-4">
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={16}
                className="w-full border border-gray-300 rounded-md p-3 text-sm font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              />
              <button
                onClick={() => setSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                デフォルトに戻す
              </button>
            </div>
          )}
        </section>

        {/* Contract Input Section */}
        <section className="bg-white rounded-lg border border-gray-200 p-5">
          <label className="block font-medium text-gray-700 mb-2">
            契約書テキスト
          </label>
          <textarea
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            placeholder="ここに契約書の文章を貼り付けてください..."
            rows={12}
            className="w-full border border-gray-300 rounded-md p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          />
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleCheck}
              disabled={loading || !contractText.trim()}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "チェック中..." : "チェック開始"}
            </button>
            {loading && (
              <span className="text-sm text-gray-500">
                AIが契約書を確認しています...
              </span>
            )}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Result Section */}
        {result && (
          <section className="space-y-4">
            <h2 className="font-bold text-lg text-gray-900">チェック結果</h2>

            {/* Summary badges */}
            <div className="flex gap-3 text-sm">
              {(["ok", "caution", "missing"] as const).map((s) => {
                const count = result.items.filter((i) => i.status === s).length;
                return (
                  <span
                    key={s}
                    className={`px-3 py-1 rounded-full font-medium ${STATUS_CONFIG[s].badge}`}
                  >
                    {STATUS_CONFIG[s].label}: {count}
                  </span>
                );
              })}
            </div>

            {/* Check items */}
            <div className="space-y-3">
              {result.items.map((item, idx) => {
                const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.missing;
                return (
                  <div
                    key={idx}
                    className={`rounded-lg border ${cfg.border} ${cfg.bg} p-4`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${cfg.badge}`}
                      >
                        {cfg.icon}
                      </span>
                      <span className="font-bold text-gray-900">
                        {item.item}
                      </span>
                      <span
                        className={`ml-auto text-xs px-2 py-0.5 rounded font-medium ${cfg.badge}`}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    {item.quote && (
                      <div className="mb-2 pl-3 border-l-2 border-gray-300 text-sm text-gray-600 italic">
                        {item.quote}
                      </div>
                    )}
                    <p className="text-sm text-gray-800">{item.comment}</p>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-1">総合評価</h3>
              <p className="text-sm text-gray-800">{result.summary}</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
