import Link from "next/link";
import { companies } from "@/lib/companies";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          SaaS 料金比較
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          架空のSaaS 5社の料金プランを掲載しています。
          <br />
          各社のページから料金情報をスクレイピングで取得してみましょう。
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Link
            key={company.slug}
            href={`/companies/${company.slug}`}
            className="group block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all"
          >
            <div
              className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: company.color }}
            >
              {company.name.slice(0, 2)}
            </div>
            <h2 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
              {company.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{company.description}</p>
            <div className="mt-4 text-sm text-gray-400">
              {company.plans[0].monthlyPrice.toLocaleString()}円〜 / 月
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <h2 className="font-semibold text-lg mb-4">
          このサイトの使い方（教材向け）
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>
            まず{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
              /robots.txt
            </code>{" "}
            を確認して、スクレイピングが許可されていることを確認しましょう
          </li>
          <li>各社の料金ページにアクセスして、HTML構造を確認しましょう</li>
          <li>
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
              .plan-card
            </code>
            、
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
              .price-monthly
            </code>
            、
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
              .price-yearly
            </code>{" "}
            などのクラスを手がかりにデータを取得しましょう
          </li>
          <li>5社分のデータを集めて、比較表を作ってみましょう</li>
        </ol>
      </div>
    </div>
  );
}
