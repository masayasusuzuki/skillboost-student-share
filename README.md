# SKILL BOOST 配布物（生徒向け）

このリポジトリには、SKILL BOOST の講座で使う教材一式（Claude Code スキル2つ + サンプルアプリ3つ）がまとまっています。
すべて、ダウンロードした人がそのまま始められるように作ってあります（特定の人のパソコンに依存したパスは入っていません）。

## 中身

```
.
├── README.md          ← このファイル
├── skills/            ← Claude Code に追加するスキル
│   ├── generate-script/   台本（script.md）を自動生成するスキル
│   └── generate-slides/   台本からスライド（PPTX/PDF）を自動生成するスキル
└── apps/              ← 講義で作るサンプルアプリ
    ├── scraping-target/   スクレイピング練習用のデモサイト
    ├── scraping-app/      料金スクレイピングWebアプリ
    └── legal-check-app/   契約書チェック自動化ツール
```

## 入手方法

このリポジトリをまるごと手元にダウンロードします。

```bash
git clone https://github.com/masayasusuzuki/skillboost-student-share.git
```

---

## 1. スキルの導入（skills/）

Claude Code は `~/.claude/skills/` に置いたスキルを自動で読み込みます。
`skills/` フォルダで以下を実行すると、2つとも導入できます。

```bash
cp -r skills/generate-script skills/generate-slides ~/.claude/skills/
```

- `generate-slides` はスライド画像の生成に Gemini API を使うため、追加で `npm install` と APIキー設定が必要です。手順は `skills/generate-slides/README.md` を見てください。
- 各スキルの詳しい使い方は、それぞれのフォルダの `README.md` にあります。

> `~` は「あなたのホームフォルダ」のことです。このコマンドはどのパソコンでもそのまま使えます。

---

## 2. サンプルアプリ（apps/）

各アプリのフォルダに入って `npm install` → `npm run dev` で起動できます。
詳しい手順と必要な設定（APIキーの有無）は、各フォルダの `README.md` に書いてあります。

| アプリ | 内容 | APIキー |
|---|---|---|
| `scraping-target` | スクレイピング練習用のデモサイト | 不要 |
| `scraping-app` | 料金スクレイピングWebアプリ | 不要 |
| `legal-check-app` | 契約書チェック自動化ツール | DeepSeek APIキーが必要 |

> `scraping-app` は `scraping-target` とペアで使います。デモサイト（ポート3000）を起動した状態で、スクレイピングアプリ（ポート3100）から取得します。2つ同時に起動できるよう、ポートを分けてあります。

---

## 補足

- アプリは各フォルダの中だけで完結する相対パスで動くので、好きな場所に置いて構いません（スキルだけは `~/.claude/skills/` に置く必要があります）。
- APIキーは絶対に他人に見せたり、GitHub にアップロードしたりしないでください。
