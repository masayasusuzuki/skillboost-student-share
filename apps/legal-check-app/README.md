# legal-check-app（契約書チェック自動化ツール）

Phase 2「法務チェック」で作る、契約書のテキストを貼り付けるとリスクのある箇所を自動で指摘してくれるWebアプリです。
判定には DeepSeek の API を使うので、APIキーの設定が必要です。

## 起動方法（はじめての人向け）

1. このフォルダで依存パッケージを入れる

```bash
npm install
```

2. APIキーを設定する

```bash
cp .env.example .env.local
```

`.env.local` を開いて、DeepSeek の API キーを入力します。

```
DEEPSEEK_API_KEY=あなたのAPIキー
```

> DeepSeek APIキーの取得：[https://platform.deepseek.com/](https://platform.deepseek.com/)

3. 開発サーバーを起動する

```bash
npm run dev
```

4. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

---

## （参考）create-next-app の元の説明

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# legal-check-app
