# student-share

SKILL BOOST スクールの**生徒に配布する成果物**を1か所にまとめたバンドル。
講座（cc-contents）の中で「GitHubで公開しているので各自clone／インストールして使ってね」と案内している教材一式を、**どのパソコンでもそのまま動く形（マシン固有の絶対パスなし）**に複製・調整して同梱している。

> このディレクトリ自体は配布用パッケージ。原本（`../student-skills/` や各GitHubリポ）はいじらず、複製のみで構成している。

## このバンドルの位置づけ

- 配布対象：プログラミング未経験〜初心者の受講生
- 中身：Claude Code スキル2つ + 講義で使うサンプルアプリ3つ
- ゴール：受講生がダウンロードして README どおりに進めれば、追加の調べ物なしで動かせる状態

## ディレクトリ構成

```
student-share/
├── CLAUDE.md          # このファイル（全体像）
├── README.md          # 生徒向けの導入ガイド（入口）
├── skills/            # Claude Code に追加するスキル
│   ├── generate-script/   台本（script.md）を自動生成するスキル
│   └── generate-slides/   台本からスライド（PPTX/PDF）を自動生成するスキル（Node CLI同梱・要 Gemini APIキー）
└── apps/              # 講義で作るサンプルアプリ（いずれも Next.js 16 / React 19 / Tailwind v4）
    ├── scraping-target/   スクレイピング練習用のデモサイト（架空SaaS5社の料金ページ）
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
- 原本は次の独立リポ（このバンドルとは別管理）。

  https://github.com/masayasusuzuki/intention-student-skills

### apps/

- 各アプリのフォルダで `npm install` → `npm run dev`。詳細と必要なAPIキーは各 README。

| アプリ | 内容 | APIキー | ポート |
|---|---|---|---|
| `scraping-target` | スクレイピング練習用デモサイト | 不要 | 3000 |
| `scraping-app` | 料金スクレイピングWebアプリ | 不要 | 3100 |
| `legal-check-app` | 契約書チェック自動化ツール | DeepSeek | 3000 |

- `scraping-app` と `scraping-target` は**ペア**。デモサイト(:3000)を起動した状態で、スクレイピングアプリ(:3100)から取得する。ポートを分けてあるので2つ同時に起動できる。
- `scraping-app` は配布元リポ（`masayasusuzuki/scraping-app`）が空だったため、台本（Module 2-3-1）の文脈に合わせて新規実装したもの。`npm run build` とデモサイトへの実スクレイピングで動作確認済み。
- `legal-check-app` は GitHub 上 PRIVATE。バンドル同梱で生徒は使えるが、学習サイトの clone リンクからは直接取得できない点に注意。

## 編集・更新のときの方針

- マシン固有の絶対パス（`/Users/...`）を絶対に持ち込まない。`~/.claude/skills/`（ユーザー共通）か、フォルダ内で完結する相対パスで書く。
- `node_modules` や `.next` などのビルド成果物は同梱しない（生徒が `npm install` する前提・各 `.gitignore` で除外）。
- 実APIキーを含む `.env` は同梱しない。`.env.example`（プレースホルダ）のみ置く。
- 原本（`../student-skills/` や各GitHubリポ）は直接編集しない。ここは複製で完結させる。

## 関連

- 配布の根拠になっている講義台本：
  `../contents/cc-contents/phase1_practical/module1-6_tips/`（skills）
  `../contents/cc-contents/phase2_consulting/module2-3_usecases/`（scraping）
  `../contents/cc-contents/phase2_consulting/module2-3-2_usecases/`（法務チェック）
- 学習サイト側のリンク定義：
  `../learning-site/src/data/courses/cc/lectures.ts`
