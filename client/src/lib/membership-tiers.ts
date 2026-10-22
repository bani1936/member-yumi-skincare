/**
 * 會員位階數據
 * 直銷模式 - 8 個位階
 */

export interface MembershipTier {
  id: string;
  name: string;
  commission: string; // 回饋金 %
  discount: string; // 產品折扣 %，"—" 表示無
  guidanceGenerations?: number; // 輔導獎金可領代數，undefined 表示無此福利
  entryFee: string;
  requirements: string[]; // 升等條件（符合任一即可）
  benefits: string[]; // 完整福利清單（向下相容舊頁面使用）
  perks: string[]; // 卡片用的精簡福利標籤（回饋金／折扣／輔導獎金已在卡片上方顯示，這裡不重複）
  color: string;
  icon: string;
  order: number;
}

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: "member",
    name: "會員",
    commission: "0%",
    discount: "—",
    entryFee: "1000 元入會",
    requirements: ["入會費 1,000 元"],
    benefits: ["產品會員價", "消費累積PV點"],
    perks: ["產品會員價", "消費累積PV點"],
    color: "bg-gray-100",
    icon: "👤",
    order: 1,
  },
  {
    id: "group-leader",
    name: "組長",
    commission: "20%",
    discount: "20%",
    entryFee: "3 萬 PV",
    requirements: [
      "自己直接購買 3 萬 PV",
      "自己加直 B 累積購買滿 3 萬 PV",
    ],
    benefits: [
      "20% 回饋金",
      "20% 購買產品折扣",
      "終身線上課程(組長以上)",
    ],
    perks: [],
    color: "bg-amber-50",
    icon: "👥",
    order: 2,
  },
  {
    id: "section-leader",
    name: "科長",
    commission: "30%",
    discount: "30%",
    entryFee: "12 萬 PV",
    requirements: [
      "當月自己累積或當月加上新直 B 共同累積 12 萬零 1 PV，或自己直接購買 12 萬 PV（不包含介紹直 B 直接購買科長）",
      "當月介紹 1 位科長及 1 位組長，自己即晉升為科長",
      "當月介紹 4 位直 B 組長，自己即晉升為科長",
      "無限期介紹直 B 累積 20 萬 PV 即晉升為科長",
    ],
    benefits: [
      "30% 回饋金",
      "30% 購買產品折扣",
      "終身線上課程(科長以上)",
      "終身實體技術課程(科長以上)",
    ],
    perks: [],
    color: "bg-yellow-50",
    icon: "📊",
    order: 3,
  },
  {
    id: "small-plate-leader",
    name: "小盤督導",
    commission: "35%",
    discount: "35%",
    guidanceGenerations: 2,
    entryFee: "32 萬 PV",
    requirements: [
      "整組累積 32 萬 PV，且自己有 2 位直 B 科長（自己或新推薦業績達 8 萬 PV，自己須為科長）",
      "直切小盤：當月自己購買累積 32 萬 PV，不含直 B 業績",
      "加入科長當月起 3 個月內，推薦 2 位直 B 科長即可晉升小盤",
    ],
    benefits: [
      "輔導獎金領 2 代",
      "35% 回饋金",
      "35% 購買產品折扣",
      "終身線上課程(小盤以上)",
      "終身實體技術課程(小盤以上)",
      "終身門店管理課程(小盤以上)",
    ],
    perks: ["終身線上課程", "終身實體技術課程", "終身門店管理課程"],
    color: "bg-orange-50",
    icon: "🎯",
    order: 4,
  },
  {
    id: "mid-plate-leader",
    name: "中盤督導",
    commission: "37%",
    discount: "35%",
    guidanceGenerations: 4,
    entryFee: "40400-56400",
    requirements: ["2 位直 B 小盤督導"],
    benefits: [
      "輔導獎金領 4 代",
      "37% 回饋金",
      "35% 購買產品折扣",
      "終身線上課程(小盤以上)",
      "終身實體技術課程(小盤以上)",
      "終身門店管理課程(小盤以上)",
    ],
    perks: ["終身線上課程", "終身實體技術課程", "終身門店管理課程"],
    color: "bg-red-50",
    icon: "📈",
    order: 5,
  },
  {
    id: "large-plate-leader",
    name: "大盤督導",
    commission: "38%",
    discount: "35%",
    guidanceGenerations: 6,
    entryFee: "43600-59600",
    requirements: ["1 位直 B 中盤督導及 3 位直 B 小盤督導"],
    benefits: [
      "輔導獎金領 6 代",
      "38% 回饋金",
      "35% 購買產品折扣",
      "終身線上課程(小盤以上)",
      "終身實體技術課程(小盤以上)",
      "終身門店管理課程(小盤以上)",
    ],
    perks: ["終身線上課程", "終身實體技術課程", "終身門店管理課程"],
    color: "bg-pink-50",
    icon: "👑",
    order: 6,
  },
  {
    id: "agent-consultant",
    name: "代理顧問",
    commission: "40%",
    discount: "35%",
    guidanceGenerations: 8,
    entryFee: "50000-66000",
    requirements: ["1 位直 B 大盤督導及 5 位直 B 小盤督導"],
    benefits: [
      "輔導獎金領 8 代",
      "40% 回饋金",
      "35% 購買產品折扣",
      "終身線上課程(小盤以上)",
      "終身實體技術課程(小盤以上)",
      "終身門店管理課程(小盤以上)",
    ],
    perks: ["終身線上課程", "終身實體技術課程", "終身門店管理課程"],
    color: "bg-purple-50",
    icon: "🎓",
    order: 7,
  },
  {
    id: "supervisor",
    name: "總監",
    commission: "45%",
    discount: "35%",
    guidanceGenerations: 10,
    entryFee: "66000-82000",
    requirements: ["2 位直 B 大盤督導及 6 位直 B 小盤督導"],
    benefits: [
      "輔導獎金領 10 代",
      "45% 回饋金",
      "35% 購買產品折扣",
      "終身線上課程(小盤以上)",
      "終身實體技術課程(小盤以上)",
      "終身門店管理課程(小盤以上)",
    ],
    perks: ["終身線上課程", "終身實體技術課程", "終身門店管理課程"],
    color: "bg-indigo-50",
    icon: "💎",
    order: 8,
  },
];

export const getTierById = (id: string): MembershipTier | undefined => {
  return MEMBERSHIP_TIERS.find((tier) => tier.id === id);
};

export const getTierByOrder = (order: number): MembershipTier | undefined => {
  return MEMBERSHIP_TIERS.find((tier) => tier.order === order);
};
