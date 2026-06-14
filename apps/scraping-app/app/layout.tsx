import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "料金スクレイピングツール",
  description:
    "競合SaaSの料金ページをまとめて取得し、比較表とCSVで出力するデモアプリです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <span className="font-bold text-lg tracking-tight">
              料金スクレイピングツール
            </span>
            <span className="text-xs text-gray-400">SKILL BOOST 教材デモ</span>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-400">
          学習用のデモツールです。スクレイピングは対象サイトの利用規約とアクセス間隔を守って利用してください。
        </footer>
      </body>
    </html>
  );
}
