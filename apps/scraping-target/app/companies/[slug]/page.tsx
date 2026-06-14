import { notFound } from "next/navigation";
import Link from "next/link";
import { companies, getCompany, formatPrice } from "@/lib/companies";

export function generateStaticParams() {
  return companies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) return { title: "Not Found" };
  return {
    title: `${company.name} - 料金プラン | SaaS Pricing Hub`,
    description: company.description,
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-600 transition-colors">
          トップ
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{company.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
            style={{ backgroundColor: company.color }}
          >
            {company.name.slice(0, 2)}
          </div>
          <h1 className="company-name text-2xl sm:text-3xl font-bold tracking-tight">
            {company.name}
          </h1>
        </div>
        <p className="text-gray-500">{company.description}</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        {company.plans.map((plan) => (
          <div
            key={plan.slug}
            className={`plan-card relative bg-white rounded-2xl border-2 p-6 sm:p-8 flex flex-col ${
              plan.recommended
                ? "border-blue-500 shadow-lg shadow-blue-100"
                : "border-gray-200"
            }`}
            data-plan={plan.slug}
          >
            {/* Recommended Badge */}
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="recommended-badge bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  おすすめ
                </span>
              </div>
            )}

            {/* Plan Name */}
            <h3 className="plan-name text-lg font-semibold text-center mb-4">
              {plan.name}
            </h3>

            {/* Price */}
            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center gap-1">
                <span className="price-monthly text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {formatPrice(plan.monthlyPrice)}
                </span>
                <span className="text-sm text-gray-400">/月</span>
              </div>
              <div className="mt-1 text-sm text-gray-400">
                年払い:{" "}
                <span className="price-yearly font-medium text-gray-600">
                  {formatPrice(plan.yearlyPrice)}
                </span>
                <span>/年</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-6" />

            {/* Features */}
            <ul className="feature-list space-y-3 flex-1">
              {plan.features.map((feature, i) => (
                <li
                  key={i}
                  className="feature-item flex items-start gap-2 text-sm text-gray-600"
                >
                  <svg
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: company.color }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              className={`mt-6 w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                plan.recommended
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              このプランを選択
            </button>
          </div>
        ))}
      </div>

      {/* HTML Structure Guide */}
      <div className="mt-12 bg-gray-800 text-gray-300 rounded-xl p-6 sm:p-8 text-sm">
        <h3 className="text-white font-semibold mb-3">
          HTML構造ヒント（スクレイピング学習用）
        </h3>
        <pre className="overflow-x-auto leading-relaxed">
          <code>{`<h1 class="company-name">         … 会社名
<div class="plan-card" data-plan="basic|standard|premium">
  <h3 class="plan-name">           … プラン名
  <span class="price-monthly">     … 月額料金
  <span class="price-yearly">      … 年額料金
  <ul class="feature-list">
    <li class="feature-item">      … 機能項目
  <span class="recommended-badge"> … おすすめバッジ（スタンダードのみ）`}</code>
        </pre>
      </div>
    </div>
  );
}
