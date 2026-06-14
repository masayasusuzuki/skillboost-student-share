---
name: generate-slides
description: 台本Markdownからスライド（PPTX/PDF）を生成するスキル。台本のパース → plan.json作成 → Gemini APIで画像生成 → PPTX/PDF出力まで一気通貫で実行する。ユーザーが「スライドを作って」「プレゼン資料を生成して」「台本からスライド化して」「PPTX作って」などスライド生成に関連することを言ったら必ずこのスキルを使うこと。台本ファイルや.mdファイルからスライドを作る場合も対象。
argument-hint: "[台本.mdのパス]"
---

# スライド生成スキル

台本Markdownからスライド（PPTX/PDF）を生成する。Gemini APIで各スライドの画像を生成し、それをPPTX/PDFにまとめる。

## 前提

- CLIツール: このスキルに同梱（`~/.claude/skills/generate-slides/tool/`）
- 画像生成API: Gemini（`~/.claude/skills/generate-slides/tool/.env` に GEMINI_API_KEY が設定済み）
- デザインガイドライン: `~/.claude/skills/generate-slides/references/design-guidelines.md` を必ず読んでから plan.json を作成すること

## 出力先の決定（最重要）

出力先ディレクトリ（`$OUTPUT_DIR`）は以下の優先順位で決定する:

1. ユーザーが明示的に出力先を指定した場合 → そのパスを使う
2. 台本ファイルと同じディレクトリに `slides/` フォルダがある場合 → `{台本のディレクトリ}/slides/` を使う
3. 上記いずれでもない場合 → ユーザーに「出力先ディレクトリを指定してください」と確認してから進める。推測で勝手に決めない。

絶対に `slide-generator/output/` をデフォルト出力先として使わないこと。CLIツールの `-o` オプションには必ず上記で決定した `$OUTPUT_DIR` の絶対パスを渡すこと。

## 処理の全体像

```
台本(.md) → パース(CLI) → plan.json作成(このスキル) → 画像生成+出力(CLI) → まとめ画像(任意)
```

---

## Step 1: 台本をパースする

```bash
cd ~/.claude/skills/generate-slides/tool && npx tsx src/index.ts $ARGUMENTS --parse-only -o $OUTPUT_DIR
```

`$ARGUMENTS` は台本ファイルの絶対パス、`$OUTPUT_DIR` は出力先ディレクトリの絶対パスを指定する。

パース結果（JSON）がコンソールに出力される。各セクションのタイトル・内容・コードブロックを確認する。

---

## Step 2: plan.json を作成する

`~/.claude/skills/generate-slides/references/design-guidelines.md` のガイドラインに厳密に従うこと。ガイドラインに従わないと、画像の品質が大きく劣化する。

パース結果を元に plan.json を生成する。

### 話題分割のルール（最重要）

各セクションの `content`（台本テキスト）を読み、話題が変わるごとに1スライドとして分割すること。

- 話題ベースで分割する。行数やパターンではなく、「何について話しているか」が変わったら新しいスライドにする。
- 「概念の説明」と「操作手順」は必ず別スライドにする。例：「Node.jsとは」（概念）と「Node.jsのインストール」（操作）は別スライド。
- 迷ったら分割する側に倒す。1枚に詰め込むより、2枚に分けるほうが初心者には親切。
- 台本の内容を落とさない。台本で説明されているすべての話題がスライドに反映されること。自己紹介、具体例、注意点なども独立した話題であればスライドにする。
- スライド数を事前に決めない。話題の数だけスライドができる。多くても少なくても構わない。
- speakerNotes には台本テキストをそのまま使わない。台本の内容を要約して、スライドの発表者ノートとして適切な形にまとめる。
- title / keyPoints はスライドとして見たときにわかりやすい表現にする。台本の口語表現をそのまま使わない。

### plan.json の形式

```json
{
  "moduleName": "your-module-name",
  "slides": [
    {
      "index": 0,
      "sectionName": "セクション名",
      "title": "スライドタイトル",
      "keyPoints": ["要点1", "要点2"],
      "imagePrompt": "ここにデザインガイドラインに従ったプロンプト",
      "layoutHint": "title|bullets|comparison|diagram|code|summary",
      "speakerNotes": "元の台本テキスト"
    }
  ],
  "totalCount": 11
}
```

### imagePrompt の組み立て方

各スライドの `imagePrompt` は以下の構造で組み立てる:
1. Base Layer をデザインガイドラインからそのままコピー
2. Layout Template（layoutHintに対応するもの）に沿ってスライド内容を記述

### imagePrompt 作成時の絶対ルール

Gemini は imagePrompt のテキストをそのまま画像に描画しようとする。技術的な記法が混入すると、それが文字として画像上に表示されてしまう。

- px値、hex色コード、CSSプロパティ名を含めない
- 位置やレイアウトにパーセンテージや固定値を使わない。「全体のバランスを見て配置」のように自然言語で指示し、AIの判断に委ねる
- サイズは自然言語で記述（large, medium, small, moderate spacing など）
- 色はカラー名で記述（indigo, violet, emerald green, amber など）
- タイトルスライドのメインタイトルは短くする（目安10文字以内）
- ページ番号・スライド番号は含めない
- 英語テキストは技術用語（HTML, CSS, VS Code等）のみ許可
- 会社名・学校名・ブランド名を含めない
- 講義時間・対象時間・モジュールの所要時間を含めない（imagePrompt・keyPoints・speakerNotesすべて）
- 3Dオブジェクト、glassmorphism、写実的な画像は使わない

### layoutHint の選び方

| layoutHint | 用途 | 備考 |
|---|---|---|
| `title` | モジュールの表紙（1枚目） | 中央配置、バナー付き |
| `bullets` | 要点を3〜4個並べる | 最も頻出、左右2カラム |
| `comparison` | 2つを比較する | 良い例 vs 悪い例 |
| `diagram` | フロー・ステップ・構成図 | 3〜5ノード |
| `code` | コマンドやコードの表示 | ダークテーマのコードブロック |
| `summary` | モジュールのまとめ（最終） | 紙吹雪風背景、次回予告バナー |

### スライド分割の目安

- 1スライドは1〜2ポイントを目安にする
- スライド数は話題の数に応じて決まる（事前に枚数を決めない）

plan.json を出力先ディレクトリに保存する。

---

## Step 2.5: ユーザー確認フェーズ（必須）

画像生成の前に必ずこのフェーズを実行すること。スキップ不可。

plan.json を作成したら、以下の形式でスライド一覧テーブルをユーザーに提示し、確認を得る:

| Index | セクション | タイトル | レイアウト |
|-------|-----------|---------|-----------|
| 0 | ... | ... | ... |

ユーザーから「OK」「いいね」「go」等の承認が得られるまで画像生成に進まない。
修正指示があった場合は plan.json を修正して再提示する。

---

## Step 3: 画像生成 + スライド出力

```bash
cd ~/.claude/skills/generate-slides/tool && npx tsx src/index.ts $PLAN_JSON_PATH -o $OUTPUT_DIR
```

`$PLAN_JSON_PATH` はplan.jsonの絶対パス、`$OUTPUT_DIR` は出力先ディレクトリの絶対パスを指定する。

生成完了後、出力パスをユーザーに伝える。

---

## Step 4: まとめ画像の作成（任意）

画像生成が完了したら、ユーザーに「まとめ画像（全スライド一覧）を作成しますか？」と確認する。

ユーザーが希望した場合:

```bash
python3 ~/.claude/skills/generate-slides/tool/scripts/generate-overview.py $OUTPUT_DIR
```

- 全スライドPNGを自動的にグリッド配置（16:9に最も近い列×行を自動計算）
- Python + Pillow が必要（`pip install Pillow`）

---

## 部分修正

ユーザーから特定スライドの修正依頼があった場合:

1. plan.json の該当スライドの `imagePrompt` を修正
2. 該当スライドだけ再生成:

```bash
cd ~/.claude/skills/generate-slides/tool && npx tsx src/index.ts $PLAN_JSON_PATH -o $OUTPUT_DIR --slides {index}
```

複数指定: `--slides 0,3,5` / 範囲指定: `--slides 0-3,7`

---

## PPTX/PDFだけ再構築（画像生成なし）

speakerNotes の修正やスライド順序変更など、画像を変えずに再構築したい場合:

```bash
cd ~/.claude/skills/generate-slides/tool && npx tsx src/index.ts $PLAN_JSON_PATH -o $OUTPUT_DIR --assemble-only
```

---

## CLIオプション一覧

| オプション | 説明 | デフォルト |
|---|---|---|
| `--parse-only` | パースのみ実行 | - |
| `--slides <indices>` | 再生成するスライドのindex | - |
| `--assemble-only` | PPTX/PDFのみ再構築 | - |
| `-o, --output <dir>` | 出力ベースディレクトリ | `output` |
| `-c, --concurrency <n>` | 画像生成の並列数 | `2` |
| `--model <name>` | Geminiモデル名 | `gemini-3.1-flash-image-preview` |
