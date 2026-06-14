# SKILL BOOST 配布物（生徒向け）

このフォルダには、SKILL BOOST の講座で配布している教材一式（Claude Code スキル2つ + サンプルアプリ3つ）がまとまっています。
すべて、ダウンロードした人がそのまま始められるように作ってあります（特定の人のパソコンに依存したパスは入っていません）。

## 中身

```
student-share/
├── README.md          ← このファイル
├── skills/            ← Claude Code に追加するスキル
│   ├── generate-script/   台本（script.md）を自動生成するスキル
│   └── generate-slides/   台本からスライド（PPTX/PDF）を自動生成するスキル
└── apps/              ← 講義で作ったサンプルアプリ
    ├── scraping-target/   スクレイピング練習用のデモサイト（Phase 2）
    ├── scraping-app/      スクレイピングWebアプリ（Phase 2）※下記の注意あり
    └── legal-check-app/   契約書チェック自動化ツール（Phase 2）
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
| `scraping-app` | スクレイピングWebアプリ | （現在ソース未収録・下記参照） |
| `legal-check-app` | 契約書チェック自動化ツール | DeepSeek APIキーが必要 |

> ⚠️ **scraping-app について**：配布元リポジトリがまだ空のため、現在は雛形だけが入っています。完成版のソースは別途共有が必要です。

---

## 補足

- このフォルダ内のアプリ・ツールはすべて、フォルダの中だけで完結する相対パスで動くようになっています。好きな場所に置いて構いません（スキルだけは `~/.claude/skills/` に置く必要があります）。
- APIキーは絶対に他人に見せたり、GitHub にアップロードしたりしないでください。
