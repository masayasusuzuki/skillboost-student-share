export type Plan = {
  name: string;
  slug: "basic" | "standard" | "premium";
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  recommended: boolean;
};

export type Company = {
  slug: string;
  name: string;
  description: string;
  color: string;
  plans: Plan[];
};

export const companies: Company[] = [
  {
    slug: "techstart",
    name: "TechStart",
    description: "スタートアップ向けプロジェクト管理ツール",
    color: "#6366f1",
    plans: [
      {
        name: "ベーシック",
        slug: "basic",
        monthlyPrice: 980,
        yearlyPrice: 9800,
        features: [
          "プロジェクト3件まで",
          "メンバー5人まで",
          "基本タスク管理",
          "メール通知",
        ],
        recommended: false,
      },
      {
        name: "スタンダード",
        slug: "standard",
        monthlyPrice: 2980,
        yearlyPrice: 29800,
        features: [
          "プロジェクト無制限",
          "メンバー20人まで",
          "ガントチャート",
          "Slack連携",
          "優先サポート",
        ],
        recommended: true,
      },
      {
        name: "プレミアム",
        slug: "premium",
        monthlyPrice: 7980,
        yearlyPrice: 79800,
        features: [
          "全スタンダード機能",
          "メンバー無制限",
          "カスタムワークフロー",
          "API連携",
          "専任サポート",
          "SLA保証",
        ],
        recommended: false,
      },
    ],
  },
  {
    slug: "cloudbase",
    name: "CloudBase",
    description: "中小企業向けクラウドストレージ＆ファイル共有",
    color: "#0ea5e9",
    plans: [
      {
        name: "ベーシック",
        slug: "basic",
        monthlyPrice: 1480,
        yearlyPrice: 14800,
        features: [
          "ストレージ100GB",
          "ユーザー3人まで",
          "ファイル共有リンク",
          "モバイルアプリ",
        ],
        recommended: false,
      },
      {
        name: "スタンダード",
        slug: "standard",
        monthlyPrice: 3980,
        yearlyPrice: 39800,
        features: [
          "ストレージ1TB",
          "ユーザー15人まで",
          "バージョン管理",
          "アクセス権限設定",
          "監査ログ",
        ],
        recommended: true,
      },
      {
        name: "プレミアム",
        slug: "premium",
        monthlyPrice: 9800,
        yearlyPrice: 98000,
        features: [
          "ストレージ無制限",
          "ユーザー無制限",
          "高度な暗号化",
          "SAML SSO",
          "専用サーバー",
          "24時間サポート",
        ],
        recommended: false,
      },
    ],
  },
  {
    slug: "dataflow",
    name: "DataFlow",
    description: "ノーコードデータ分析・BIダッシュボード",
    color: "#10b981",
    plans: [
      {
        name: "ベーシック",
        slug: "basic",
        monthlyPrice: 2480,
        yearlyPrice: 24800,
        features: [
          "ダッシュボード3枚",
          "データソース2接続",
          "基本グラフ",
          "CSV出力",
        ],
        recommended: false,
      },
      {
        name: "スタンダード",
        slug: "standard",
        monthlyPrice: 6980,
        yearlyPrice: 69800,
        features: [
          "ダッシュボード無制限",
          "データソース10接続",
          "AI分析アシスタント",
          "自動レポート配信",
          "チーム共有",
        ],
        recommended: true,
      },
      {
        name: "プレミアム",
        slug: "premium",
        monthlyPrice: 14800,
        yearlyPrice: 148000,
        features: [
          "全スタンダード機能",
          "データソース無制限",
          "リアルタイム更新",
          "埋め込みBI",
          "カスタムコネクタ",
          "専任データコンサル",
        ],
        recommended: false,
      },
    ],
  },
  {
    slug: "aiworks",
    name: "AIWorks",
    description: "業務特化型AI自動化プラットフォーム",
    color: "#f43f5e",
    plans: [
      {
        name: "ベーシック",
        slug: "basic",
        monthlyPrice: 4980,
        yearlyPrice: 49800,
        features: [
          "AIタスク月500回",
          "テンプレート10種",
          "メール自動化",
          "基本API",
        ],
        recommended: false,
      },
      {
        name: "スタンダード",
        slug: "standard",
        monthlyPrice: 12800,
        yearlyPrice: 128000,
        features: [
          "AIタスク月5,000回",
          "テンプレート無制限",
          "ワークフロー自動化",
          "Webhook連携",
          "チーム管理",
        ],
        recommended: true,
      },
      {
        name: "プレミアム",
        slug: "premium",
        monthlyPrice: 29800,
        yearlyPrice: 298000,
        features: [
          "AIタスク無制限",
          "カスタムモデル学習",
          "オンプレミス対応",
          "専用GPU割り当て",
          "SLA 99.9%保証",
          "導入コンサルティング",
        ],
        recommended: false,
      },
    ],
  },
  {
    slug: "smartoffice",
    name: "SmartOffice",
    description: "オールインワン社内コミュニケーションツール",
    color: "#f59e0b",
    plans: [
      {
        name: "ベーシック",
        slug: "basic",
        monthlyPrice: 1980,
        yearlyPrice: 19800,
        features: [
          "チャット・DM",
          "ユーザー10人まで",
          "ファイル共有5GB",
          "ビデオ通話（1対1）",
        ],
        recommended: false,
      },
      {
        name: "スタンダード",
        slug: "standard",
        monthlyPrice: 4980,
        yearlyPrice: 49800,
        features: [
          "チャット・DM・スレッド",
          "ユーザー50人まで",
          "ファイル共有50GB",
          "グループビデオ通話",
          "タスクボード",
        ],
        recommended: true,
      },
      {
        name: "プレミアム",
        slug: "premium",
        monthlyPrice: 9800,
        yearlyPrice: 98000,
        features: [
          "全スタンダード機能",
          "ユーザー無制限",
          "ストレージ無制限",
          "ウェビナー機能",
          "Active Directory連携",
          "専任カスタマーサクセス",
        ],
        recommended: false,
      },
    ],
  },
];

export function getCompany(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}

export function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}
