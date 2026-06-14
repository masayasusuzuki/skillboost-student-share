# skillboost-student-share

SKILL BOOST スクールの**受講生に配布する教材リポジトリ**。
Claude Code スキル2つと、講義で使うサンプルアプリ3つを1か所にまとめている。
受講生が `git clone` して README どおりに進めれば、追加の調べ物なしで動かせる状態を保つことが目的。

- 配布対象：プログラミング未経験〜初心者の受講生
- 公開リポジトリ：https://github.com/masayasusuzuki/skillboost-student-share

## ディレクトリ構成

```
.
├── CLAUDE.md          # このファイル（全体像・編集方針）
├── README.md          # 受講生向けの導入ガイド（入口）
├── skills/            # Claude Code に追加するスキル
│   ├── generate-script/   台本（script.md）を自動生成するスキル
│   └── generate-slides/   台本からスライド（PPTX/PDF）を自動生成するスキル（Node CLI同梱・要 Gemini APIキー）
└── apps/              # サンプルアプリ（いずれも Next.js 16 / React 19 / Tailwind v4）
    ├── scraping-target/   スクレイピング練習用デモサイト（架空SaaS5社の料金ページ）
    ├── scraping-app/      料金スクレイピングWebアプリ（Playwright・要デモサイト同時起動）
    └── legal-check-app/   契約書チェック自動化ツール（要 DeepSeek APIキー）
```

## 各アセットの要点

### skills/

- Claude Code は `~/.claude/skills/` 配下に置いたスキルを自動認識する。導入は `skills/` 内で次の1行。

```bash
cp -r generate-script generate-slides ~/.claude/skills/
```

- `generate-slides` のみ追加セットアップあり（`tool/` で `npm install` ＋ `.env` に `GEMINI_API_KEY`）。手順は各 README 参照。
- CLI本体（`generate-slides/tool/src/config.ts`）は `__dirname` 基準で自分の場所を解決するため、置き場所に依存せず動く。

### apps/

- 各アプリのフォルダで `npm install` → `npm run dev`。詳細と必要なAPIキーは各 README。

| アプリ | 内容 | APIキー | ポート |
|---|---|---|---|
| `scraping-target` | スクレイピング練習用デモサイト | 不要 | 3000 |
| `scraping-app` | 料金スクレイピングWebアプリ | 不要 | 3100 |
| `legal-check-app` | 契約書チェック自動化ツール | DeepSeek | 3000 |

- `scraping-app` と `scraping-target` は**ペア**。デモサイト(:3000)を起動した状態で、スクレイピングアプリ(:3100)から取得する。ポートを分けてあるので2つ同時に起動できる。
- `scraping-app` は Playwright でデモサイトの料金ページを取得し、テーブル・比較表・CSVを出力する。`npm run build` とデモサイトへの実スクレイピングで動作確認済み。
- `legal-check-app` は DeepSeek API を使うため、`.env.example` を `.env.local` にコピーして `DEEPSEEK_API_KEY` を設定する。

## 編集・更新のときの方針

- マシン固有の絶対パス（`/Users/...`）を絶対に持ち込まない。`~/.claude/skills/`（ユーザー共通）か、フォルダ内で完結する相対パスで書く。
- `node_modules` や `.next` などのビルド成果物は同梱しない（受講生が `npm install` する前提・`.gitignore` で除外）。
- 実APIキーを含む `.env` は同梱しない。`.env.example`（プレースホルダ）のみ置く。
- 受け取った人が混乱しないよう、このリポジトリの中だけで完結する説明にする。手元に無い外部フォルダのパスを書かない。
