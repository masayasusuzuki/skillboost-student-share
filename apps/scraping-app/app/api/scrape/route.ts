import { NextResponse } from "next/server";
import { chromium } from "playwright";

// Playwright は Node.js ランタイムが必要（Edge では動かない）。
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 1リクエストにつき1ページをスクレイピングする。
// アクセス間隔（マナーとしての待機）はフロント側で各リクエストの間に空けている。
export async function POST(request: Request) {
  let url: string;
  try {
    const body = await request.json();
    url = body?.url;
  } catch {
    return NextResponse.json({ error: "リクエストの形式が不正です" }, { status: 400 });
  }

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URLが指定されていません" }, { status: 400 });
  }

  let browser;
  try {
    // ヘッドレスモード（画面を出さずに動かすモード）で起動する。
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

    // 料金ページのHTML構造（デモサイトのクラス名）に合わせて値を取り出す。
    const data = await page.evaluate(() => {
      const toNumber = (text: string | null | undefined): number =>
        Number((text ?? "").replace(/[^0-9]/g, "")) || 0;

      const company =
        document.querySelector(".company-name")?.textContent?.trim() ?? "";

      const plans = Array.from(document.querySelectorAll(".plan-card")).map(
        (card) => ({
          plan: card.querySelector(".plan-name")?.textContent?.trim() ?? "",
          tier: card.getAttribute("data-plan") ?? "",
          monthly: toNumber(card.querySelector(".price-monthly")?.textContent),
          yearly: toNumber(card.querySelector(".price-yearly")?.textContent),
        })
      );

      return { company, plans };
    });

    if (!data.company || data.plans.length === 0) {
      return NextResponse.json(
        {
          error:
            "料金情報が見つかりませんでした。対象サイトのURL・HTML構造を確認してください。",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ url, ...data });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "ページの取得に失敗しました";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
