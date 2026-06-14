# generate-slides

台本Markdown（script.md）からスライド（PPTX/PDF）を自動生成するClaude Codeスキルです。

Gemini APIで各スライドの画像を生成し、PPTXとPDFにまとめます。

## セットアップ

### 1. スキルをインストールする

このスキルは Claude Code のスキル置き場（`~/.claude/skills/`）に置くと自動で認識されます。

このバンドルの `skills/` ディレクトリで、以下を実行してください。

```bash
cp -r generate-script generate-slides ~/.claude/skills/
```

`generate-script` と `generate-slides` の両方がインストールされます。

> `~/.claude/skills/` の `~` は「あなたのホームフォルダ」を指します。特定の人のフォルダ名は含まれていないので、どのパソコンでもこのコマンドのまま動きます。

### 2. 依存パッケージをインストールする

```bash
cd ~/.claude/skills/generate-slides/tool
npm install
```

### 3. APIキーを設定する

```bash
cp .env.example .env
```

`.env` を開いて Gemini API キーを入力してください：

```
GEMINI_API_KEY=あなたのAPIキー
```

> **Gemini APIキーの取得：** [Google AI Studio](https://aistudio.google.com/) から無料で発行できます。

---

## 使い方

Claude Codeで以下のように話しかけます：

```
スライドを作って（台本: ./script.md）
```

```
台本からスライドを生成して
```

### 流れ

1. 台本をパースしてスライド構成を解析
2. plan.json（スライド設計書）を作成
3. スライド一覧をユーザーに提示・確認
4. OKを出すとGemini APIで画像を生成
5. PPTX/PDFとして出力

### 出力先

台本ファイルと同じディレクトリの `slides/` フォルダに出力されます。

---

## 部分修正

特定のスライドだけ作り直したい場合はClaudeに伝えてください：

```
3番のスライドを修正して（もう少しシンプルなデザインにして）
```

---

## まとめ画像（オプション）

全スライドを一覧表示した画像も生成できます。Pillowが必要です：

```bash
pip install Pillow
```

生成後に「まとめ画像を作って」と伝えてください。
