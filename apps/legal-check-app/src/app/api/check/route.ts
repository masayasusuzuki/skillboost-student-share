import { NextRequest, NextResponse } from "next/server";

export interface CheckItem {
  item: string;
  status: "ok" | "caution" | "missing";
  quote: string;
  comment: string;
}

export interface CheckResult {
  items: CheckItem[];
  summary: string;
}

export async function POST(request: NextRequest) {
  const { contractText, systemPrompt } = await request.json();

  if (!contractText || !systemPrompt) {
    return NextResponse.json(
      { error: "契約書テキストとシステムプロンプトは必須です" },
      { status: 400 }
    );
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "DEEPSEEK_API_KEY が設定されていません" },
      { status: 500 }
    );
  }

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      max_tokens: 4096,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `以下の契約書の内容をチェックしてください。\n\n${contractText}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    return NextResponse.json(
      { error: `DeepSeek API エラー (${res.status}): ${errorBody}` },
      { status: 502 }
    );
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    return NextResponse.json(
      { error: "AIからの応答が空でした" },
      { status: 502 }
    );
  }

  try {
    const parsed: CheckResult = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "AIの応答をJSONとして解析できませんでした", raw: content },
      { status: 502 }
    );
  }
}
