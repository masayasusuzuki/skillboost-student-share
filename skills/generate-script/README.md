# generate-script

テーマと時間を伝えるだけで、動画・プレゼン用の台本Markdown（script.md）を自動生成するClaude Codeスキルです。

構成案の確認 → 本文ライティング の2ステップで進みます。

## インストール

このスキルは Claude Code のスキル置き場（`~/.claude/skills/`）に置くと自動で認識されます。

このバンドルの `skills/` ディレクトリで、以下を実行してください。

```bash
cp -r generate-script generate-slides ~/.claude/skills/
```

`generate-script` と `generate-slides` の両方がインストールされます。Claude Code を起動し直すと認識されます。

> `~/.claude/skills/` の `~` は「あなたのホームフォルダ」を指します。特定の人のフォルダ名は含まれていないので、どのパソコンでもこのコマンドのまま動きます。

## 使い方

Claude Codeで以下のように話しかけるだけです：

```
台本を作って（テーマ: ○○、対象時間: 30分）
```

```
script.mdを作って。テーマはClaude Codeの基本操作で、初心者向け、1時間
```

### 流れ

1. Claude が構成案（目次）を提示する
2. 内容を確認・修正する
3. OKを出すと本文のライティングが始まる
4. `script.md` に保存される

## カスタマイズ

`SKILL.md` を編集することで、トーンや出力形式を自分好みに調整できます。
