// 滿額贈禮設定
// 目前同時有多個活動檔期，彼此有「基礎活動只能擇一生效」與「可疊加活動」的規則：
// - 活動一「新客滿額贈」：永久生效，但有任何檔期限定的基礎活動生效時會暫停（同一時間只會有一個「基礎活動」生效）
// - 活動二「【2026 夏季限定】盛夏不鬧肌」：僅 2026/7/21～2026/8/20 生效，生效時活動一暫停
// - 活動五「【27th週年慶】限定贈禮」：僅 2026/10/19～2026/11/18 生效（民國115/10/19～115/11/18），生效時活動一暫停
// - 活動三「【2026 年集點贈】點點成金，PV換好禮！」：永久生效，可與基礎活動（活動一或活動二）疊加
// - 活動四「【2026 門市限定】UIS訂製化妝包滿額贈」：永久生效，可與其他所有活動疊加
//
// basis: 'pv' 代表門檻用訂單 PV 判斷；'amount' 代表門檻用實際結算金額（總付款金額）判斷
// chooseFrom: 'ampoule' | 'spray' | 'salonSeries' | 'pv2250' | null（null 代表固定贈品，不需選擇）
// note: 額外備註（例如「達成任務再加贈 X 組」），僅供顯示提醒，不會自動計算加贈數量，
//       需要店家另行確認客人是否達成任務後人工加贈

export type GiftChooseFrom = 'ampoule' | 'spray' | 'salonSeries' | 'pv2250' | null;

export interface GiftItem {
  label: string;
  qty: number;
  unit: string;
  chooseFrom: GiftChooseFrom;
  note?: string;
}

export interface GiftTier {
  thresholdValue: number;
  basis: 'pv' | 'amount';
  items: GiftItem[];
}

export interface GiftCampaign {
  id: string;
  name: string;
  periodLabel: string;
  // 'base'：同一時間只會有一個 base 活動生效（依日期判斷是活動一還是活動二）
  // 'addon'：只要在活動期間內，一律疊加顯示，不受 base 活動影響
  group: 'base' | 'addon';
  isActive: (date: Date) => boolean;
  tiers: GiftTier[];
}

// 安瓶保養組可任選的系列（對應商品庫中實際的 4 款安瓶保養組商品）
export const AMPOULE_SET_OPTIONS = [
  '熨斗系列安瓶保養組',
  '38都都好安瓶保養組',
  '58淨膚安瓶保養組',
  '晶亮安瓶保養組',
];

// 120ml 噴液任選的可選商品
export const SPRAY_120ML_OPTIONS = [
  '(26號)柔敏C白精華噴液(小)',
  '38-7 都都好精華液',
  '58-8 隱痕定格液',
  'D7-晶亮修護精華液',
];

// 系列保養沙龍組可任選的系列
export const SALON_SET_SERIES_OPTIONS = [
  '熨斗系列',
  '淨膚系列',
  '都都好系列',
  '晶亮系列',
];

// 盛夏不鬧肌活動期間
const SUMMER_SKIN_START = new Date('2026-07-21T00:00:00');
const SUMMER_SKIN_END = new Date('2026-08-20T23:59:59');

// 27th週年慶限定贈禮活動期間（民國115/10/19～115/11/18）
const ANNIVERSARY_27_START = new Date('2026-10-19T00:00:00');
const ANNIVERSARY_27_END = new Date('2026-11-18T23:59:59');

export const GIFT_CAMPAIGNS: GiftCampaign[] = [
  {
    id: 'newCustomer',
    name: '新客滿額贈',
    periodLabel: '',
    group: 'base',
    isActive: () => true,
    tiers: [
      {
        thresholdValue: 30000,
        basis: 'pv',
        items: [
          { label: '安瓶保養組', qty: 2, unit: '組', chooseFrom: 'ampoule' },
        ],
      },
      {
        thresholdValue: 120000,
        basis: 'pv',
        items: [
          { label: '安瓶保養組', qty: 10, unit: '組', chooseFrom: 'ampoule', note: '達成任務再加贈10組' },
        ],
      },
      {
        thresholdValue: 298000,
        basis: 'amount',
        items: [
          { label: '安瓶保養組', qty: 20, unit: '組', chooseFrom: 'ampoule', note: '達成任務再加贈20組' },
        ],
      },
    ],
  },
  {
    id: 'summerSkin',
    name: '【2026 夏季限定】盛夏不鬧肌',
    periodLabel: '2026/7/21～2026/8/20',
    group: 'base',
    isActive: (date) => date >= SUMMER_SKIN_START && date <= SUMMER_SKIN_END,
    tiers: [
      {
        thresholdValue: 19000,
        basis: 'pv',
        items: [
          { label: '安瓶保養組', qty: 1, unit: '組', chooseFrom: 'ampoule' },
        ],
      },
      {
        thresholdValue: 30000,
        basis: 'pv',
        items: [
          { label: '安瓶保養組', qty: 2, unit: '組', chooseFrom: 'ampoule' },
        ],
      },
      {
        thresholdValue: 88000,
        basis: 'pv',
        items: [
          { label: '安瓶保養組', qty: 4, unit: '組', chooseFrom: 'ampoule' },
          { label: '120ml噴液任選', qty: 1, unit: '瓶', chooseFrom: 'spray' },
        ],
      },
      {
        thresholdValue: 120000,
        basis: 'pv',
        items: [
          { label: '安瓶保養組', qty: 10, unit: '組', chooseFrom: 'ampoule', note: '達成任務再加贈10組' },
          { label: '120ml噴液任選', qty: 1, unit: '瓶', chooseFrom: 'spray' },
          { label: '38修護柔敏膠原凝露', qty: 1, unit: '瓶', chooseFrom: null },
        ],
      },
      {
        thresholdValue: 298000,
        basis: 'amount',
        items: [
          { label: '安瓶保養組', qty: 20, unit: '組', chooseFrom: 'ampoule', note: '達成任務再加贈20組' },
          { label: '無痕塑形筋膜儀', qty: 1, unit: '台', chooseFrom: null },
          { label: '38修護柔敏膠原凝露', qty: 1, unit: '瓶', chooseFrom: null },
          { label: '系列保養沙龍組', qty: 1, unit: '套', chooseFrom: 'salonSeries' },
        ],
      },
    ],
  },
  {
    id: 'anniversary27',
    name: '【27th週年慶】限定贈禮',
    periodLabel: '2026/10/19～2026/11/18',
    group: 'base',
    isActive: (date) => date >= ANNIVERSARY_27_START && date <= ANNIVERSARY_27_END,
    tiers: [
      {
        thresholdValue: 19000,
        basis: 'pv',
        items: [
          { label: '安瓶保養組', qty: 1, unit: '組', chooseFrom: 'ampoule' },
        ],
      },
      {
        thresholdValue: 30000,
        basis: 'pv',
        items: [
          { label: '安瓶保養組', qty: 2, unit: '組', chooseFrom: 'ampoule' },
        ],
      },
      {
        thresholdValue: 88000,
        basis: 'pv',
        items: [
          { label: '安瓶保養組', qty: 4, unit: '組', chooseFrom: 'ampoule' },
          { label: '120ml噴液任選', qty: 1, unit: '瓶', chooseFrom: 'spray' },
        ],
      },
      {
        thresholdValue: 120000,
        basis: 'pv',
        items: [
          { label: '安瓶保養組', qty: 10, unit: '組', chooseFrom: 'ampoule', note: '達成任務再加贈10組' },
          { label: '輕奢緞光美妝包', qty: 1, unit: '個', chooseFrom: null },
          { label: '120ml噴液任選', qty: 1, unit: '瓶', chooseFrom: 'spray' },
          { label: '38修護柔敏膠原凝露', qty: 1, unit: '瓶', chooseFrom: null },
        ],
      },
      {
        thresholdValue: 298000,
        basis: 'amount',
        items: [
          { label: '安瓶保養組', qty: 20, unit: '組', chooseFrom: 'ampoule', note: '達成任務再加贈20組' },
          { label: '璀璨啟程精品登機箱', qty: 1, unit: '個', chooseFrom: null },
          { label: '38修護柔敏膠原凝露', qty: 1, unit: '瓶', chooseFrom: null },
          { label: '系列保養沙龍組', qty: 1, unit: '套', chooseFrom: 'salonSeries' },
        ],
      },
    ],
  },
  {
    id: 'pvExchange',
    name: '【2026 年集點贈】點點成金，PV換好禮！',
    periodLabel: '2026/1/1～2026/12/31',
    group: 'addon',
    isActive: () => true,
    tiers: [
      {
        thresholdValue: 40000,
        basis: 'pv',
        items: [
          { label: '安瓶保養組', qty: 1, unit: '組', chooseFrom: 'ampoule' },
        ],
      },
      {
        thresholdValue: 80000,
        basis: 'pv',
        items: [
          { label: '安瓶保養組', qty: 1, unit: '組', chooseFrom: 'ampoule' },
          { label: '2250PV產品任選', qty: 1, unit: '瓶', chooseFrom: 'pv2250' },
        ],
      },
      {
        thresholdValue: 200000,
        basis: 'pv',
        items: [
          { label: '安瓶保養組', qty: 3, unit: '組', chooseFrom: 'ampoule' },
          { label: '2250PV產品任選', qty: 1, unit: '瓶', chooseFrom: 'pv2250' },
          { label: '38修護柔敏膠原凝露', qty: 1, unit: '瓶', chooseFrom: null },
        ],
      },
    ],
  },
  {
    id: 'makeupBag',
    name: '【門市限定】UIS訂製化妝包滿額贈',
    periodLabel: '數量有限，送完為止！',
    group: 'addon',
    isActive: () => true,
    tiers: [
      {
        thresholdValue: 30000,
        basis: 'pv',
        items: [
          { label: 'UIS訂製旅行化妝包', qty: 1, unit: '個', chooseFrom: null },
        ],
      },
    ],
  },
];

// 依日期判斷目前生效的活動組合：基礎活動（只會有一個）+ 所有生效中的疊加活動
// 基礎活動規則：有任何「檔期限定」的基礎活動（非新客滿額贈）在檔期內，就取代新客滿額贈；
// 否則顯示新客滿額贈。之後新增檔期限定活動，只要 group 設為 'base' 並設定 isActive 即可，不需改這裡。
export function getActiveGiftCampaigns(date: Date = new Date()): GiftCampaign[] {
  const baseCampaigns = GIFT_CAMPAIGNS.filter((c) => c.group === 'base');
  const addonCampaigns = GIFT_CAMPAIGNS.filter((c) => c.group === 'addon' && c.isActive(date));

  const newCustomer = baseCampaigns.find((c) => c.id === 'newCustomer');
  const eventBase = baseCampaigns.find((c) => c.id !== 'newCustomer' && c.isActive(date));
  const activeBase = eventBase ?? newCustomer;

  return [activeBase, ...addonCampaigns].filter((c): c is GiftCampaign => !!c);
}
