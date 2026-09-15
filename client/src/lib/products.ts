/**
 * 格柏蕾蒂產品資料庫
 * 包含所有產品系列、分類與價格資訊
 */

export interface Product {
  id: string;
  name: string;
  productNumber: string;  // 產品編號（如 38號、6號）
  productTitle: string;   // 產品名稱（如 修護柔敏膠原凝露）
  category: string;
  series: string;
  price: number;
  memberPrice?: number;   // 會員價
  description: string;
  intro?: string;         // 簡介（產品詳情頁的長文案說明）
  benefitCards?: { title: string; description: string }[]; // 產品用途：四格功效卡片（取代長文字段落）
  forYou?: string[];       // 適用對象（FOR YOU）條列文字
  experience?: { icon?: 'feather' | 'flower'; title: string; description: string }[]; // 質地與使用感（EXPERIENCE）
  image?: string;
  images?: string[];      // 多張商品圖（產品詳情頁輪播用，未填則退回單張 image）
  benefits?: string[];
  size?: string;
  volume?: string;
  pv?: number;            // PV 點數
  featured?: boolean;
  featuredOrder?: number;
  // 詳細信息
  ingredients?: string;   // 主要成分
  usage?: string;         // 用途
  instructions?: string;  // 用法
  storage?: string;       // 保存方式
  precautions?: string[]; // 使用注意事項 / 成分小知識
  // 圖示化用法（用於重點商品，取代純文字用法）
  usageSteps?: { title: string; description: string; note?: string }[];
  usageTags?: string[];   // 適用情境標籤（薄塗舒緩用法等）
  usageTips?: string[];   // 使用小提醒
  usageModes?: { label: string; title: string; description: string; tags?: string[]; note?: string }[]; // 大區塊式用法（HOW TO USE 風格）
  // 旗艦商品故事頁（選填，用於明星商品的敘事式導覽頁）
  storySections?: {
    heroImage?: string;
    intro?: {
      title: string;
      gridImage: string;
      warning?: string;
    };
    ingredientsSection?: {
      items: { image: string; name: string; description: string }[];
    };
    benefits?: {
      image: string;
      title: string;
      points: string[];
    }[];
    // 三大關鍵配方（如：源頭阻斷／深層修復／表層改善）
    keyFormulas?: {
      image?: string;
      items: { label: string; title: string; tags: string }[];
    };
    // 科學實證數據（如：CRP下降20-25%）
    clinicalStats?: { value: string; label: string }[];
    // 使用方法（icon + 短文字，如：100-150ml溫涼水／餐後30分鐘內／每日1包）
    howToUse?: { icon: 'cup' | 'clock' | 'calendar'; text: string }[];
    // 常見問題
    faqs?: { q: string; a: string }[];
    // 產品規格（如：風味／包裝／產地）
    specs?: { label: string; value: string }[];
    // 全成分（法規標示用完整成分清單）
    fullIngredients?: string[];
  };
}

export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// 產品分類
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'all',
    name: '全部產品',
    icon: '🌿',
    description: '所有格柏蕾蒂產品'
  },
  {
    id: 'micro-lifting-small',
    name: '熨斗系列(小)',
    icon: '✨',
    description: '重啟肃膚年輕密碼'
  },
  {
    id: 'micro-lifting-large',
    name: '熨斗系列(大)',
    icon: '✨',
    description: '重啟肃膚年輕密碼'
  },
  {
    id: 'cleansing',
    name: '淨膚系列',
    icon: '🧼',
    description: '穩膚修護全面舒緩'
  },
  {
    id: 'skin-care',
    name: '都都好系列',
    icon: '🎯',
    description: '控油抗痘、修護肌膚'
  },
  {
    id: 'brightening',
    name: '晶亮系列',
    icon: '💎',
    description: '肌因修護、重建健康肌本'
  },
  {
    id: 'elasticity',
    name: 'Q彈精緻系列',
    icon: '🎀',
    description: '提升肌膚彈性與光澤'
  },
  {
    id: 'essential-oil',
    name: '精油系列',
    icon: '🌸',
    description: '天然植物精油護理'
  },
  {
    id: 'cleaning',
    name: '清潔系列',
    icon: '🧴',
    description: '深層清潔護理'
  },
  {
    id: 'special',
    name: '特殊系列',
    icon: '🌟',
    description: '專業護理產品'
  },
  {
    id: 'bust',
    name: '美胸系列',
    icon: '💄',
    description: '提升胸部線條與彈性'
  }
];

// 系列介紹（顯示於系列頁最上方，介紹該系列的主打功效與特色）
export interface SeriesIntro {
  title: string;
  description: string;
  features: { title: string; description: string; icon: 'sparkles' | 'shield' | 'droplet' | 'leaf' | 'target' | 'heart' }[];
  closing?: string;
}

export const SERIES_INTROS: Record<string, SeriesIntro> = {
  '熨斗系列(小)': {
    title: '微整型系列 重啟肌膚年輕密碼',
    description: '專為追求緊緻、修復與逆齡效果設計的高效保養品系列，結合尖端生物科技與高濃度活性成分，能夠深入肌底修復受損細胞，立即感受拉提緊緻效果。持續使用，讓肌膚宛如微整般年輕飽滿、輪廓更加立體明亮。',
    features: [
      { title: '即刻有感拉提', icon: 'sparkles', description: '使用後快速緊緻肌膚，明顯改善鬆弛與細紋。' },
      { title: '細胞級修復', icon: 'shield', description: '強化肌膚防禦力，活化老化細胞，恢復彈性與光澤。' },
      { title: '越用越年輕', icon: 'heart', description: '每一次保養都是深層修護，長效打造緊緻澎潤的年輕肌。' },
      { title: '無藥性添加', icon: 'leaf', description: '溫和無負擔，敏弱肌也能安心使用。' },
    ],
    closing: '不只是保養，是一場逆轉肌齡的科技革命。',
  },
  '熨斗系列(大)': {
    title: '微整型系列 重啟肌膚年輕密碼',
    description: '專為追求緊緻、修復與逆齡效果設計的高效保養品系列，結合尖端生物科技與高濃度活性成分，能夠深入肌底修復受損細胞，立即感受拉提緊緻效果。持續使用，讓肌膚宛如微整般年輕飽滿、輪廓更加立體明亮。',
    features: [
      { title: '即刻有感拉提', icon: 'sparkles', description: '使用後快速緊緻肌膚，明顯改善鬆弛與細紋。' },
      { title: '細胞級修復', icon: 'shield', description: '強化肌膚防禦力，活化老化細胞，恢復彈性與光澤。' },
      { title: '越用越年輕', icon: 'heart', description: '每一次保養都是深層修護，長效打造緊緻澎潤的年輕肌。' },
      { title: '無藥性添加', icon: 'leaf', description: '溫和無負擔，敏弱肌也能安心使用。' },
    ],
    closing: '不只是保養，是一場逆轉肌齡的科技革命。',
  },
  '淨膚系列': {
    title: '淨膚系列 穩膚修護 全面舒緩',
    description: '專為極敏感性肌膚打造的高效修護保養系列，結合溫和安撫與深層修復科技，有效改善肌膚斑點、泛紅、乾癢等不適問題。淨膚系列幫助肌膚重建健康屏障，從根本穩定膚況，找回細緻透亮的自然光采。',
    features: [
      { title: '舒緩泛紅乾癢', icon: 'droplet', description: '高效植萃舒敏配方，第一時間安撫敏弱膚況。' },
      { title: '淡化斑點瑕疵', icon: 'sparkles', description: '改善因發炎或日曬所引起的色素沉澱，還原淨白膚色。' },
      { title: '強化肌膚屏障', icon: 'shield', description: '強韌肌底，降低外界刺激對肌膚的傷害。' },
      { title: '無藥性、低敏無負擔', icon: 'leaf', description: '不含刺激性成分，敏感肌、孕婦皆可安心使用。' },
    ],
    closing: '淨膚系列，深層補水兼具驅黃淡斑，打造水潤透亮的奶油淨白肌。',
  },
  '都都好系列': {
    title: '都都好系列 淨痘煥膚 毛孔細緻專家',
    description: '為問題性肌膚量身打造的都都好系列，專注改善痘痘、痘疤、粉刺與毛孔粗大問題，溫和調理肌膚油水平衡，同時強化代謝與修復機能。從淨化到修護，一瓶接著一瓶，循序漸進幫助你重拾平滑無瑕的健康肌。',
    features: [
      { title: '控油抗痘', icon: 'target', description: '深入毛孔清除多餘皮脂與髒污，預防痘痘生成。' },
      { title: '淡化痘疤與粉刺', icon: 'sparkles', description: '加速肌膚代謝，修復痘痘留下的色素與凹凸不平。' },
      { title: '收斂毛孔、細緻肌膚', icon: 'droplet', description: '有效改善毛孔粗大，還原滑嫩膚觸。' },
      { title: '溫和不刺激、無藥性添加', icon: 'leaf', description: '敏感肌也能安心使用，長效穩定膚況。' },
    ],
    closing: '都都好系列，深層淨痘淡化痘疤，打造平滑細緻的水煮蛋肌。',
  },
  '晶亮系列': {
    title: '晶亮系列 專研肌因修護，重建健康肌本',
    description: '為高度問題肌膚設計，專注於修護酒糟肌、敏感肌、脂漏性皮膚炎與粉刺困擾。透過精準調理與肌因級修復科技，深入肌膚核心，幫助調節油脂、舒緩炎症、修護屏障，全面穩定膚況，從根本改善反覆發作的肌膚問題。',
    features: [
      { title: '舒緩泛紅與刺激', icon: 'droplet', description: '針對酒糟與敏感反應，快速降低肌膚發炎不適。' },
      { title: '調理皮脂、改善脂漏', icon: 'target', description: '平衡油脂分泌，有效減緩脂漏性皮膚炎引起的脫屑與搔癢。' },
      { title: '深層淨化粉刺源頭', icon: 'sparkles', description: '溫和代謝角質，預防毛孔堵塞與粉刺生成。' },
      { title: '強化肌膚防禦屏障', icon: 'shield', description: '重建肌膚自我修護力，降低外界刺激傷害。' },
      { title: '無藥性、低敏高效配方', icon: 'leaf', description: '安心溫和，敏弱肌也能長期使用。' },
    ],
    closing: '晶亮系列，專攻敏弱修護與屏障修護，打造穩定健康的晶透無瑕肌。',
  },
  'Q彈精緻系列': {
    title: 'Q彈精緻系列 平滑肌因 重塑膚觸',
    description: '專為凹洞型痘疤與月球表面般的肌膚打造，結合修復、撫平與重建三大關鍵機制，深入肌底啟動膠原蛋白再生，強化肌膚組織結構，從源頭改善痘疤凹陷與肌膚不平整問題。持續使用，肌膚逐漸細緻平滑，重現緊緻光采。',
    features: [
      { title: '撫平凹洞痘疤', icon: 'sparkles', description: '促進膠原增生，修補肌膚凹陷組織，改善肌膚凹凸不平。' },
      { title: '修復肌底結構', icon: 'shield', description: '加強肌膚更新與修復力，重建受損肌膚屏障。' },
      { title: '細緻毛孔、改善膚觸', icon: 'droplet', description: '使粗糙、顆粒感肌膚逐步光滑、平整。' },
      { title: '無藥性、低敏溫和', icon: 'leaf', description: '適合長期使用，敏弱肌也能安心改善深層肌膚問題。' },
    ],
    closing: 'Q彈精緻系列，是專屬凹洞型肌膚的「重建型保養」，讓過去無解的痘疤肌，也能迎來平滑新生。',
  },
};

// 完整產品清單
export const PRODUCTS: Product[] = [
  // 熨斗系列(小)
  {
    id: '0-1',
    productNumber: '0號',
    productTitle: '晶瑩剔透修膚霜(小)',
    name: '(0號)晶瑩剔透修膚霜(小)',
    category: 'micro-lifting-small',
    series: '熨斗系列(小)',
    price: 3320,
    memberPrice: 2980,
    description: '強化皮膚防禦力、舒緩肌膚、水嫩、光滑',
    image: '/01.jpg',
    benefits: ['修護', '晶亮', '緊緻'],
    size: '小',
    volume: '30ml',
    pv: 2533,
    ingredients: '金縷梅、玻尿酸、山茶花提取液、蘆薈汁葉萃取液',
    usage: '增強皮膚防禦力，舒緩肌膚、水嫩、光滑',
    instructions: '微整系列第1瓶，0號是一道防護膜，早、晚潔膚後，取適量塗抹於臉上',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '金縷梅萃取具天然收斂毛孔、控油效果，擁有抗發炎與抗菌特性',
      '幫助皮膚回復健康穩定'
    ]
  },
  {
    id: '1-1',
    productNumber: '1號',
    productTitle: '水合柔膚精華液(小)',
    name: '(1號)水合柔膚精華液(小)',
    category: 'micro-lifting-small',
    series: '熨斗系列(小)',
    price: 4430,
    memberPrice: 3980,
    description: '以複合式植物配方、補水，舒緩乾燥不適感及肌膚壓力',
    image: '/01.jpg',
    benefits: ['保濕', '柔膚', '水合'],
    size: '小',
    volume: '30ml',
    pv: 3383,
    ingredients: '蘆薈汁葉萃取液、銀杏萃取液、玻尿酸',
    usage: '以複合式植物配方，讓肌膚補水，舒緩肌膚（乾燥）不適感、舒緩肌膚壓力',
    instructions: '0號使用後，接續使用1號，使臉部快速補水，能使後面其他產品使用快速吸收，早晚取適量塗抹於臉上',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '蘆薈汁葉萃取是「肌膚的天然急救箱」，富含天然多醣體與胺基酸，能迅速補充水分',
      '促進肌膚自我修復、加快受損組織癒合，減少肌膚發炎與感染機會'
    ]
  },
  {
    id: '2號-熨斗小-s',
    productNumber: '2號',
    productTitle: '青春光采精華液(小)',
    name: '(2號)青春光采精華液(小)',
    category: 'micro-lifting-small',
    series: '熨斗系列(小)',
    price: 3100,
    memberPrice: 2780,
    description: '淡化（撫平）皺紋、細紋、紋路，肌膚緊緻、水嫩',
    image: '/01.jpg',
    benefits: ['青春光采', '逆齢', '精華'],
    size: '小',
    volume: '30ml',
    pv: 2250,
    ingredients: '歐錦葵花萃取液、榲基海帶提取物、玻尿酸、歐洲緞萃取液',
    usage: '淡化（撫平）皺紋、細紋、紋路，肌膚緊緻、水嫩',
    instructions: '在1號使用完後，早、晚潔膚後，取適量2號塗抹於臉上，用手掌溫度將臉頰的肌膚往太陽穴方向按摩提拉來回做4-5次即可',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '歐錦葵花萃取含有類黃酮與維他命C等抗氧化成分，能幫助對抗自由基傷害',
      '平滑肌膚並延緩肌膚老化現象，提升肌膚防禦力'
    ]
  },
  {
    id: '3-1',
    productNumber: '3號',
    productTitle: '亮采A精華液(小)',
    name: '(3號)亮采A精華液(小)',
    category: 'micro-lifting-small',
    series: '熨斗系列(小)',
    price: 3320,
    memberPrice: 2980,
    description: '回複肌膚彈性，使肌膚皙白水嫩',
    image: '/01.jpg',
    benefits: ['亮采', '提亮', '精華'],
    size: '小',
    volume: '30ml',
    pv: 2533,
    ingredients: '蘆薈汁葉萃取液、榲基海帶提取物、玻尿酸',
    usage: '回復肌膚彈性，使肌膚暫白水嫩',
    instructions: '早晚潔膚後，2號使用完後取適量3號塗抹於臉上，快速塗勻請勿拍打按摩',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '榲基海帶提取物來自北大西洋冷水域的褐藻，含有大量天然海藻多醣體，能在肌膚表面形成保濕薄膜',
      '快速補水同時鎖住水分，改善乾燥、粗糙與脫屑問題，強化角質層結構'
    ]
  },
  {
    id: '4號-熨斗小-s',
    productNumber: '4號',
    productTitle: '亮采B精華霜(小)',
    name: '(4號)亮采B精華霜(小)',
    category: 'micro-lifting-small',
    series: '熨斗系列(小)',
    price: 3100,
    memberPrice: 2780,
    description: '滋潤肌膚，預防皮膚乾燥，使肌膚回複柔順平和的線條及嫩白',
    image: '/02.jpg',
    benefits: ['亮采', '修護', '精華'],
    size: '小',
    volume: '30ml',
    pv: 2250,
    ingredients: '銀杏葉萃取液、全綠葉澳洲堅果籽油、蘆薈汁葉萃取液、葡萄籽萃取液、玻尿酸',
    usage: '滋潤肌膚，預防皮膚乾燥，使肌膚回復柔順平和的線條及嫩白',
    instructions: '早晚潔膚後，3號使用完後取適量4號塗抹於臉上，快速塗勻請勿拍打按摩',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '葡萄籽萃取能夠保護並促進膠原蛋白與彈力蛋白的生成，減少黑色素生成',
      '抗發炎特性可穩定肌膚，修護外在刺激造成的傷害，幫助恢復健康的肌膚狀態'
    ]
  },
  {
    id: '5-1號-熨斗小-s',
    productNumber: '5-1號',
    productTitle: '亮采膠原保濕乳(小)',
    name: '(5-1號)亮采膠原保濕乳(小)',
    category: 'micro-lifting-small',
    series: '熨斗系列(小)',
    price: 3100,
    memberPrice: 2780,
    description: '形成保護膜，潤滋、舒緩肌膚乾燥、預防乾裂，能使肌膚光滑',
    image: '/02.jpg',
    benefits: ['膠原', '保濕', '修護'],
    size: '小',
    volume: '30ml',
    pv: 2250,
    ingredients: '去離子水、蘆薈汁葉萃取液、葡萄籽萃取、銀杏萃取液、玻尿酸',
    usage: '形成肌膚保護膜，減少肌膚乾澀、脫屑，潤澤滋養，舒緩肌膚乾燥，預防乾裂，使肌膚潤澤光滑',
    instructions: '早晚潔膚後，4號使用完後取適量5-1號塗抹於臉上；乾燥、脫屑肌膚可加強使用（油性、痘痘肌膚不適合），適合超乾性、粗糙、冬天缺水、脫屑發紅肌',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '銀杏葉萃取液具有非常強的抗氧化、抗發炎與保護膠原蛋白作用，減少膠原流失',
      '延緩鬆弛細紋產生，減少泛紅、發炎反應，穩定膚況'
    ]
  },
  {
    id: '5-2號-熨斗小-s',
    productNumber: '5-2號',
    productTitle: '龍血膠原保濕乳(小)',
    name: '(5-2號)龍血膠原保濕乳(小)',
    category: 'micro-lifting-small',
    series: '熨斗系列(小)',
    price: 3100,
    memberPrice: 2780,
    description: '形成肌膚保護膜，調理肌膚油水平衡',
    image: '/01.jpg',
    benefits: ['膠原', '保濕', '龍血'],
    size: '小',
    volume: '30ml',
    pv: 2250,
    ingredients: '去離子水、綠葉龍血樹萃取、蘆薈汁葉萃取液、葡萄籽提取物、銀杏萃取液',
    usage: '形成肌膚保護膜，也能調理肌膚油水平衡',
    instructions: '早晚潔膚後，4號使用完後取適量5-2號塗抹於臉上',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '綠葉龍血樹萃取被稱為「天然癒合劑」，具有強效修護、抗炎舒緩、抗老化與肌膚防禦力提升等多重功能',
      '被譽為「天然肌膚守護膜」'
    ]
  },
  {
    id: '6號-熨斗小-s',
    productNumber: '6號',
    productTitle: '晶緻人蔘C白修護霜(小)',
    name: '(6號)晶緻人蔘C白修護霜(小)',
    category: 'micro-lifting-small',
    series: '熨斗系列(小)',
    price: 3100,
    memberPrice: 2780,
    description: '人蔘萃取液，可淡化皺紋，延緩肌膚老化， 使皮膚水嫩白皙',
    image: '/02.jpg',
    benefits: ['中性肌', '黑眼圈', '美白'],
    size: '小',
    volume: '30ml',
    pv: 2250,
    featured: true,
    featuredOrder: 2,
    ingredients: '去離子水、蘆薈汁葉萃取液、德國洋甘菊萃取液、銀杏葉萃取液、榲基海帶提取物、月見草萃取液、人蔘萃取液',
    usage: '淡化皺紋，延緩肌膚老化，使皮膚水嫩皙白',
    instructions: '早晚潔膚後，5號（5-1或5-2）使用完後取適量6號塗抹於臉上',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: ['人蔘萃取富含人蔘皂苷，能深入肌底激活細胞，提升肌膚代謝力', '快速形成一層「隱形防護層」，有效隔離外界刺激（污染、灰塵、紫外線），提升肌膚自我防禦力']
  },
  {
    id: '7-1',
    productNumber: '7號',
    productTitle: '活膚煥采亮顏乳(小)',
    name: '(7號)活膚煥采亮顏乳(小)',
    category: 'micro-lifting-small',
    series: '熨斗系列(小)',
    price: 2550,
    memberPrice: 2250,
    description: '防曬養膚一瓶搞定，月見草油是女性聖品，避免皮膚紫外線傷害',
    image: '/02.jpg',
    benefits: ['防曬隔離', '提亮', '修復'],
    size: '小',
    volume: '30ml',
    pv: 1750,
    featured: true,
    featuredOrder: 6,
    ingredients: '去離子水、月見花萃取、德國洋甘菊萃取液、桑白根萃取液、玻尿酸、石榴果皮萃取',
    usage: '內含50%防曬隔離效果與50%保養品，月見草油能使皮膚遇紫外線傷害時與防曬隔離成分互相配合，一個防曬隔離一個修護。可搭配在任一系列保養的最後一道，作為日常防塵防曬使用',
    instructions: '早上潔膚後，6號使用完後取適量7號均勻塗抹於臉上',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: ['石榴果皮萃取有效中和自由基，抵禦光老化與環境壓力對肌膚造成的傷害', '延緩肌膚鬆弛、暗沉，抑制黑色素生成，達到淡斑、亮白膚色效果']
  },
  {
    id: '26號-熨斗小-s',
    productNumber: '26號',
    productTitle: '柔敏C白精華噴液(小)',
    name: '(26號)柔敏C白精華噴液(小)',
    category: 'micro-lifting-small',
    series: '熨斗系列(小)',
    price: 3100,
    memberPrice: 2780,
    description: '使肌膚補充水分，使肌膚光滑、水嫩，白天防曬後仍可補水保濕',
    image: '/03.jpg',
    benefits: ['柔敏', '美白', '噫液'],
    size: '小',
    volume: '120ml',
    pv: 2250,
    ingredients: '蘋果萃取液、榲基海帶提取物、透明質酸',
    usage: '使肌膚補充水分，使肌膚光滑、水嫩，白天防曬後仍可進行補水保濕',
    instructions: '於所有保養品、彩妝品後使用，每3～4小時補充一次，距離臉部約15-20公分讓噴霧散射出的幅度更廣，才能均勻吸收，請勿拍打肌膚，讓噴液自然吸收',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '蘋果萃取液富含多種天然營養素，幫助溫和代謝老廢角質，改善毛孔粗大、膚色暗沉',
      '讓肌膚更細緻透亮，有效抵禦自由基傷害，減少細紋與彈性流失'
    ]
  },

  // 熨斗系列(大)
  {
    id: '0-2',
    productNumber: '0號',
    productTitle: '晶瑩剔透修膚霜(大)',
    name: '(0號)晶瑩剔透修膚霜(大)',
    category: 'micro-lifting-large',
    series: '熨斗系列(大)',
    price: 9300,
    memberPrice: 8380,
    description: '強化皮膚防禦力、舒緩肌膚、水嫩、光滑',
    image: '/03.jpg',
    benefits: ['修護', '晶亮', '緊緻'],
    size: '大',
    volume: '120ml',
    pv: 7038,
    ingredients: '金縷梅、玻尿酸、山茶花提取液、蘆薈汁葉萃取液',
    usage: '增強皮膚防禦力，舒緩肌膚、水嫩、光滑',
    instructions: '微整系列第1瓶，0號是一道防護膜，早、晚潔膚後，取適量塗抹於臉上',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '金縷梅萃取具天然收斂毛孔、控油效果，擁有抗發炎與抗菌特性',
      '幫助皮膚回復健康穩定'
    ]
},
  {
    id: '1-2',
    productNumber: '1號',
    productTitle: '水合柔膚精華液(大)',
    name: '(1號)水合柔膚精華液(大)',
    category: 'micro-lifting-large',
    series: '熨斗系列(大)',
    price: 9300,
    memberPrice: 8380,
    description: '以複合式植物配方、補水，舒緩乾燥不適感及肌膚壓力',
    image: '/03.jpg',
    benefits: ['保濕', '柔膚', '水合'],
    size: '大',
    volume: '120ml',
    pv: 7038,
    ingredients: '蘆薈汁葉萃取液、銀杏萃取液、玻尿酸',
    usage: '以複合式植物配方，讓肌膚補水，舒緩肌膚（乾燥）不適感、舒緩肌膚壓力',
    instructions: '0號使用後，接續使用1號，使臉部快速補水，能使後面其他產品使用快速吸收，早晚取適量塗抹於臉上',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '蘆薈汁葉萃取是「肌膚的天然急救箱」，富含天然多醣體與胺基酸，能迅速補充水分',
      '促進肌膚自我修復、加快受損組織癒合，減少肌膚發炎與感染機會'
    ]
},
  {
    id: '2-2',
    productNumber: '2號',
    productTitle: '青春光采精華液(大)',
    name: '(2號)青春光采精華液(大)',
    category: 'micro-lifting-large',
    series: '熨斗系列(大)',
    price: 9300,
    memberPrice: 8380,
    description: '淡化(撫平)皺紋、細紋、紋路，使肌膚緊緻、水嫩',
    image: '/03.jpg',
    benefits: ['青春光采', '逆齡', '精華'],
    size: '大',
    volume: '120ml',
    pv: 7038,
    ingredients: '歐錦葵花萃取液、榲基海帶提取物、玻尿酸、歐洲緞萃取液',
    usage: '淡化（撫平）皺紋、細紋、紋路，肌膚緊緻、水嫩',
    instructions: '在1號使用完後，早、晚潔膚後，取適量2號塗抹於臉上，用手掌溫度將臉頰的肌膚往太陽穴方向按摩提拉來回做4-5次即可',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '歐錦葵花萃取含有類黃酮與維他命C等抗氧化成分，能幫助對抗自由基傷害',
      '平滑肌膚並延緩肌膚老化現象，提升肌膚防禦力'
    ]
},
  {
    id: '3-2',
    productNumber: '3號',
    productTitle: '亮采A精華液(大)',
    name: '(3號)亮采A精華液(大)',
    category: 'micro-lifting-large',
    series: '熨斗系列(大)',
    price: 9300,
    memberPrice: 8380,
    description: '回復肌膚彈性，使肌膚皙白水嫩',
    image: '/03.jpg',
    benefits: ['亮采', '提亮', '精華'],
    size: '大',
    volume: '120ml',
    pv: 7038,
    ingredients: '蘆薈汁葉萃取液、榲基海帶提取物、玻尿酸',
    usage: '回復肌膚彈性，使肌膚暫白水嫩',
    instructions: '早晚潔膚後，2號使用完後取適量3號塗抹於臉上，快速塗勻請勿拍打按摩',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '榲基海帶提取物來自北大西洋冷水域的褐藻，含有大量天然海藻多醣體，能在肌膚表面形成保濕薄膜',
      '快速補水同時鎖住水分，改善乾燥、粗糙與脫屑問題，強化角質層結構'
    ]
},
  {
    id: '4-2',
    productNumber: '4號',
    productTitle: '亮采B精華霜(大)',
    name: '(4號)亮采B精華霜(大)',
    category: 'micro-lifting-large',
    series: '熨斗系列(大)',
    price: 9080,
    memberPrice: 8180,
    description: '滋潤肌膚，預防皮膚乾燥，使肌膚回復柔順平和的線條及嫩白',
    image: '/03.jpg',
    benefits: ['亮采', '修護', '精華'],
    size: '大',
    volume: '120ml',
    pv: 6783,
    ingredients: '銀杏葉萃取液、全綠葉澳洲堅果籽油、蘆薈汁葉萃取液、葡萄籽萃取液、玻尿酸',
    usage: '滋潤肌膚，預防皮膚乾燥，使肌膚回復柔順平和的線條及嫩白',
    instructions: '早晚潔膚後，3號使用完後取適量4號塗抹於臉上，快速塗勻請勿拍打按摩',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '葡萄籽萃取能夠保護並促進膠原蛋白與彈力蛋白的生成，減少黑色素生成',
      '抗發炎特性可穩定肌膚，修護外在刺激造成的傷害，幫助恢復健康的肌膚狀態'
    ]
},
  {
    id: '5-1-2',
    productNumber: '5-1號',
    productTitle: '亮采膠原保濕乳(大)',
    name: '(5-1號)亮采膠原保濕乳(大)',
    category: 'micro-lifting-large',
    series: '熨斗系列(大)',
    price: 9080,
    memberPrice: 8180,
    description: '形成保護膜，潤滋、舒緩肌膚乾燥、預防乾裂，能使肌膚光滑',
    image: '/03.jpg',
    benefits: ['膠原', '保濕', '修護'],
    size: '大',
    volume: '120ml',
    pv: 6783,
    ingredients: '去離子水、蘆薈汁葉萃取液、葡萄籽萃取、銀杏萃取液、玻尿酸',
    usage: '形成肌膚保護膜，減少肌膚乾澀、脫屑，潤澤滋養，舒緩肌膚乾燥，預防乾裂，使肌膚潤澤光滑',
    instructions: '早晚潔膚後，4號使用完後取適量5-1號塗抹於臉上；乾燥、脫屑肌膚可加強使用（油性、痘痘肌膚不適合），適合超乾性、粗糙、冬天缺水、脫屑發紅肌',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '銀杏葉萃取液具有非常強的抗氧化、抗發炎與保護膠原蛋白作用，減少膠原流失',
      '延緩鬆弛細紋產生，減少泛紅、發炎反應，穩定膚況'
    ]
},
  {
    id: '5-2-2',
    productNumber: '5-2號',
    productTitle: '龍血膠原保濕乳(大)',
    name: '(5-2號)龍血膠原保濕乳(大)',
    category: 'micro-lifting-large',
    series: '熨斗系列(大)',
    price: 9080,
    memberPrice: 8180,
    description: '形成肌膚保護膜，調理肌膚油水平衡',
    image: '/03.jpg',
    benefits: ['膠原', '保濕', '龍血'],
    size: '大',
    volume: '120ml',
    pv: 6783,
    ingredients: '去離子水、綠葉龍血樹萃取、蘆薈汁葉萃取液、葡萄籽提取物、銀杏萃取液',
    usage: '形成肌膚保護膜，也能調理肌膚油水平衡',
    instructions: '早晚潔膚後，4號使用完後取適量5-2號塗抹於臉上',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '綠葉龍血樹萃取被稱為「天然癒合劑」，具有強效修護、抗炎舒緩、抗老化與肌膚防禦力提升等多重功能',
      '被譽為「天然肌膚守護膜」'
    ]
},
  {
    id: '6-2',
    productNumber: '6號',
    productTitle: '晶緻人蔘C白修護霜(大)',
    name: '(6號)晶緻人蔘C白修護霜(大)',
    category: 'micro-lifting-large',
    series: '熨斗系列(大)',
    price: 9080,
    memberPrice: 8180,
    description: '人蔘萃取液，可淡化皺紋，延緩肌膚老化，使皮膚水嫩皙白',
    image: '/04.PNG',
    benefits: ['人蔘', '美白', '修護'],
    size: '大',
    volume: '120ml',
    pv: 6783,
    ingredients: '去離子水、蘆薈汁葉萃取液、德國洋甘菊萃取液、銀杏葉萃取液、榲基海帶提取物、月見草萃取液、人蔘萃取液',
    usage: '淡化皺紋，延緩肌膚老化，使皮膚水嫩皙白',
    instructions: '早晚潔膚後，5號（5-1或5-2）使用完後取適量6號塗抹於臉上',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '人蔘萃取富含人蔘皂苷，能深入肌底激活細胞，提升肌膚代謝力',
      '快速形成一層「隱形防護層」，有效隔離外界刺激（污染、灰塵、紫外線），提升肌膚自我防禦力'
    ]
},
  {
    id: '7-2',
    productNumber: '7號',
    productTitle: '活膚煥采亮顏乳(大)',
    name: '(7號)活膚煥采亮顏乳(大)',
    category: 'micro-lifting-large',
    series: '熨斗系列(大)',
    price: 7480,
    memberPrice: 6750,
    description: '防曬養膚一瓶搞定，月見草油是女性聖品，避免皮膚紫外線傷害',
    image: '/04.PNG',
    benefits: ['活膚', '煥采', '亮顏'],
    size: '大',
    volume: '120ml',
    pv: 5253,
    ingredients: '去離子水、月見花萃取、德國洋甘菊萃取液、桑白根萃取液、玻尿酸、石榴果皮萃取',
    usage: '內含50%防曬隔離效果與50%保養品，月見草油能使皮膚遇紫外線傷害時與防曬隔離成分互相配合，一個防曬隔離一個修護。可搭配在任一系列保養的最後一道，作為日常防塵防曬使用',
    instructions: '早上潔膚後，6號使用完後取適量7號均勻塗抹於臉上',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '石榴果皮萃取有效中和自由基，抵禦光老化與環境壓力對肌膚造成的傷害',
      '延緩肌膚鬆弛、暗沉，抑制黑色素生成，達到淡斑、亮白膚色效果'
    ]
},
  {
    id: '26-2',
    productNumber: '26號',
    productTitle: '柔敏C白精華噴液(大)',
    name: '(26號)柔敏C白精華噴液(大)',
    category: 'micro-lifting-large',
    series: '熨斗系列(大)',
    price: 9080,
    memberPrice: 8180,
    description: '使肌膚補充水分，使肌膚光滑、水嫩，白天防曬後仍可補水保濕',
    image: '/05.jpg',
    benefits: ['柔敏', '美白', '精華'],
    size: '大',
    volume: '500ml',
    pv: 6783,
    ingredients: '蘋果萃取液、榲基海帶提取物、透明質酸',
    usage: '使肌膚補充水分，使肌膚光滑、水嫩，白天防曬後仍可進行補水保濕',
    instructions: '於所有保養品、彩妝品後使用，每3～4小時補充一次，距離臉部約15-20公分讓噴霧散射出的幅度更廣，才能均勻吸收，請勿拍打肌膚，讓噴液自然吸收',
    storage: '存放於陰涼乾燥處，避免陽光直射',
    precautions: [
      '蘋果萃取液富含多種天然營養素，幫助溫和代謝老廢角質，改善毛孔粗大、膚色暗沉',
      '讓肌膚更細緻透亮，有效抵禦自由基傷害，減少細紋與彈性流失'
    ]
},

  // 都都好系列 (38系列)
  {
    id: '38-1-都都好-m',
    productNumber: '38-1',
    productTitle: '都都好亮顏乳',
    name: '38-1 都都好亮顏乳',
    category: 'skin-care',
    series: '都都好系列',
    price: 3100,
    memberPrice: 2780,
    description: '控油抵痘，淡化痘疤與粉刷，收斂毛孔',
    image: '/06.jpg',
    benefits: ['茶樹葉', '抑菌'],
    size: '標準',
    volume: '30ml',
    pv: 2250,
    usage: '幫助減少毛孔內細菌滋生，減輕痘痘部位發炎、紅腫現象。',
    ingredients: '茶樹萃取、蘆薈汁葉萃取液、玻尿酸',
    instructions: '早晚潔膚後，取適量38-1塗抹全臉，快速均勻勿拍打按摩。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  {
    id: '38-2-都都好-m',
    productNumber: '38-2',
    productTitle: '都都好美顔液',
    name: '38-2 都都好美顔液',
    category: 'skin-care',
    series: '都都好系列',
    price: 3100,
    memberPrice: 2780,
    description: '深層清潔，改善膚質',
    image: '/06.jpg',
    benefits: ['羽衣草', '抗氧化'],
    size: '標準',
    volume: '30ml',
    pv: 2250,
    usage: '促進皮膚細胞修復，中和自由基，幫助油水平衡，改善暗沉。',
    ingredients: '羽衣草萃取物、玻尿酸、綜合維生素',
    instructions: '擦完38-1後取適量38-2塗抹全臉，快速均勻勿拍打按摩。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  {
    id: '38-3-都都好-m',
    productNumber: '38-3',
    productTitle: '都都好美顔露',
    name: '38-3 都都好美顔露',
    category: 'skin-care',
    series: '都都好系列',
    price: 3100,
    memberPrice: 2780,
    description: '舅緩肌膚，增進吸收',
    image: '/07.jpg',
    benefits: ['洋甘菊', '舒緩'],
    size: '標準',
    volume: '30ml',
    pv: 2250,
    usage: '減緩肌膚紅腫、刺激、發癢，有很強的抗發炎作用，加速微損傷皮膚癒合。',
    ingredients: '德國洋甘菊萃取、去離子水、天然褐藻萃取液',
    instructions: '擦完38-2後取適量38-3塗抹全臉，快速均勻勿拍打按摩。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  {
    id: '38-4-都都好-m',
    productNumber: '38-4',
    productTitle: '都都好修護液',
    name: '38-4 都都好修護液',
    category: 'skin-care',
    series: '都都好系列',
    price: 3100,
    memberPrice: 2780,
    description: '修護受損肌膚，強化屏障',
    image: '/08.jpg',
    benefits: ['海藻醣', '防護'],
    size: '標準',
    volume: '60ml',
    pv: 2250,
    usage: '天然生物防護因子，穩定肌膚屏障，減少自由基引起的皮膚微炎症。',
    ingredients: '蘆薈萃取液、銀杏萃取液、海藻醣',
    instructions: '早晚使用，擦完38-3後每天晚上將38-4倒在化妝棉上濕敷痘痘處10分鐘，嚴重者早中晚各一次。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  {
    id: '38-5-都都好-m',
    productNumber: '38-5',
    productTitle: '都都好凝露',
    name: '38-5 都都好凝露',
    category: 'skin-care',
    series: '都都好系列',
    price: 3100,
    memberPrice: 2780,
    description: '凝聘精華，深層滋養',
    image: '/09.jpg',
    benefits: ['金縷梅', '收斂'],
    size: '標準',
    volume: '50ml',
    pv: 2250,
    usage: '收斂皮脂腺開口，毛孔緊緻，降低肌膚表面細菌量。',
    ingredients: '蘆薈汁葉萃取液、維他命E、金縷梅萃取液、德國洋甘菊萃取液',
    instructions: '擦完38-4後取適量38-5塗抹全臉，快速均勻勿拍打按摩。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  {
    id: '38-6-都都好-m',
    productNumber: '38-6',
    productTitle: '都都好美顏霜',
    name: '38-6 都都好美顏霜',
    category: 'skin-care',
    series: '都都好系列',
    price: 3100,
    memberPrice: 2780,
    description: '痘痘肌專用，人蔘萃取液，能改善暗沉淡化痘疤，使肌膚嫩白',
    featured: true,
    featuredOrder: 3,
    image: '/07.jpg',
    benefits: ['痘痘肌', '人蔘', '美白'],
    size: '標準',
    volume: '30ml',
    pv: 2250,
    usage: '深入肌底激活細胞，提升肌膚代謝力，塗抹在肌膚上快速形成「隱形防護層」，有效隔離外界刺激。',
    ingredients: '人蔘萃取液、蘆薈萃取液、維他命E',
    instructions: '擦完38-5後取適量38-6塗抹全臉，快速均勻勿拍打按摩。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  {
    id: '38-7-都都好-m',
    productNumber: '38-7',
    productTitle: '都都好精華液',
    name: '38-7 都都好精華液',
    category: 'skin-care',
    series: '都都好系列',
    price: 3100,
    memberPrice: 2780,
    description: '高濃度精華，深層修護',
    image: '/03.jpg',
    benefits: ['維他命C', '補水'],
    size: '標準',
    volume: '120ml',
    pv: 2250,
    usage: '針對油性痘痘肌膚補水，調理油水平衡，使肌膚光滑水嫩，白天防曬後仍可進行補水保濕。',
    ingredients: '維他命C、透明質酸、甘草根萃取液',
    instructions: '於所有保養品、彩妝品後使用，每3~4小時補充一次，距離臉部約15~20公分，讓噴霧散射出的幅度更廣，較能均勻吸收。請勿拍打肌膚，讓噴液自然吸收。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  {
    id: '38-8-10',
    productNumber: '38-8',
    productTitle: '都都好精華粉與原液',
    name: '38-8 都都好精華粉與原液',
    category: 'skin-care',
    series: '都都好系列',
    price: 4900,
    memberPrice: 4400,
    description: '粉液結合，雙重功效',
    image: '/10.jpg',
    benefits: ['課程專用', '重建'],
    size: '標準',
    volume: '10件組',
    pv: 3740,
    usage: '幫助減輕發炎反應，有助受損肌膚修復，平衡肌膚油脂分泌。',
    ingredients: '七葉樹提取物、褐藻萃取、沒藥醇',
    instructions: '淨痘課程專用，需受過專業培訓之美容師於店內操作課程使用。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  {
    id: '38-8-1',
    productNumber: '38-8',
    productTitle: '都都好精華粉與原液',
    name: '38-8 都都好精華粉與原液',
    category: 'skin-care',
    series: '都都好系列',
    price: 680,
    memberPrice: 580,
    description: '粉液結合，雙重功效',
    image: '/10.jpg',
    benefits: ['課程專用', '重建'],
    size: '標準',
    volume: '1件組',
    pv: 464,
    usage: '幫助減輕發炎反應，有助受損肌膚修復，平衡肌膚油脂分泌。',
    ingredients: '七葉樹提取物、褐藻萃取、沒藥醇',
    instructions: '淨痘課程專用，需受過專業培訓之美容師於店內操作課程使用。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  // 淨膚系列 (58系列)
  {
    id: '58-1',
    productNumber: '58-1',
    productTitle: '淨膚凝露',
    name: '58-1 淨膚凝露',
    category: 'cleansing',
    series: '淨膚系列',
    price: 3320,
    memberPrice: 2980,
    description: '溫和清潔，穩定膚況',
    image: '/11.jpg',
    benefits: ['清潔', '穩定', '溫和'],
    size: '標準',
    volume: '30ml',
    pv: 2533,
    usage: '能安撫肌膚，舒緩肌膚乾燥，提升肌膚舒適度。',
    ingredients: '去離子水、保濕因子、維他命C、七葉樹萃取',
    instructions: '早晚使用，取適量的58-1產品均勻塗抹於臉上，早晚均須使用。',
    precautions: ['七葉樹萃取具有抗發炎、抗水腫、促進血液循環的作用，抗氧化特性，能中和自由基、減緩細胞老化，幫助緊緻肌膚，減少毛孔粗大，保護肌膚與細胞健康。']
  },
  {
    id: '58-2-淨膚-m',
    productNumber: '58-2',
    productTitle: '修護原液',
    name: '58-2 修護原液',
    category: 'cleansing',
    series: '淨膚系列',
    price: 3100,
    memberPrice: 2780,
    description: '深層修護，舒緩敏感',
    image: '/12.jpg',
    benefits: ['修護', '舒緩', '敏感'],
    size: '標準',
    volume: '30ml',
    pv: 2250,
    usage: '黃根萃取能舒緩乾燥肌膚，修護、防護皮膚。',
    ingredients: '水解大黃根萃取、銀杏萃取、保濕因子',
    instructions: '早晚使用，均勻擦上58-1後，快速取適量的58-2產品均勻塗抹於臉上，早晚均須使用。',
    precautions: ['水解大黃根萃取是一種經過水解處理的大黃根提取物，含有大黃素（Emodin）與其他抗菌成分，減少皮膚發炎，有助於舒緩敏感、穩定膚況，抑制黑色素活性，改善膚色暗沉與蠟黃現象。']
  },
  {
    id: '58-3-淨膚-m',
    productNumber: '58-3',
    productTitle: '淨膚滋養露',
    name: '58-3 淨膚滋養露',
    category: 'cleansing',
    series: '淨膚系列',
    price: 3100,
    memberPrice: 2780,
    description: '滋養保濕，維持平衡',
    image: '/11.jpg',
    benefits: ['滋養', '保濕', '平衡'],
    size: '標準',
    volume: '30ml',
    pv: 2250,
    usage: '修護肌膚，提升肌膚防禦力，保持肌膚健康，回復肌膚彈性。',
    ingredients: '全緣葉澳洲堅果籽油、葡萄籽萃取液、維他命E',
    instructions: '早晚使用，均勻擦上58-2後，快速取適量的58-3產品均勻塗抹於臉上，早晚均須使用。',
    precautions: ['維他命E能改善皮膚乾燥、脫屑，增強皮膚屏障功能，中和自由基，減少環境傷害與老化跡象，保護膠原蛋白，減少因日曬、外力引起的肌膚紅腫與不適。']
  },
  {
    id: '58-4-淨膚-m',
    productNumber: '58-4',
    productTitle: '淨膚修護精華液',
    name: '58-4 淨膚修護精華液',
    category: 'cleansing',
    series: '淨膚系列',
    price: 3100,
    memberPrice: 2780,
    description: '精華濃縮，快速吸收',
    image: '/12.jpg',
    benefits: ['精華', '吸收', '修護'],
    size: '標準',
    volume: '30ml',
    pv: 2250,
    usage: '桑白皮萃取能使乾糙缺水肌膚水嫩，減少肌膚乾澀、使肌膚Q彈飽滿。',
    ingredients: '去離子水、蘆薈汁葉萃取液、桑白皮萃取',
    instructions: '早晚使用，均勻擦上58-3後，快速取適量的58-4產品均勻塗抹於臉上，早晚均須使用。',
    precautions: ['桑白皮萃取中的活性成分能抑制酪胺酸酶活性，減少黑色素生成，幫助淡化色斑、曬斑，改善膚色暗沉，有助於減輕肌膚紅腫與敏感反應，保濕修護促進水分保持與皮膚屏障修復，並能中和自由基，減緩肌膚老化。']
  },
  {
    id: '58-5-淨膚-m',
    productNumber: '58-5',
    productTitle: '淨膚修護霜',
    name: '58-5 淨膚修護霜',
    category: 'cleansing',
    series: '淨膚系列',
    price: 3100,
    memberPrice: 2780,
    description: '豐富滋潤，全面護理',
    image: '/11.jpg',
    benefits: ['滋潤', '護理', '修護'],
    size: '標準',
    volume: '30ml',
    pv: 2250,
    usage: '使缺營養素之肌膚，恢復光滑潤澤，使肌膚由內而外恢復光澤亮麗。',
    ingredients: '玻尿酸、藍銅胜肽',
    instructions: '早晚使用，均勻擦上58-4後，快速取適量的58-5產品均勻塗抹於臉上，早晚均須使用。',
    precautions: ['藍銅胜肽能刺激皮膚製造膠原蛋白與彈力蛋白，抑制自由基與慢性發炎，減少肌膚老化與紅腫，促進肌膚健康屏障形成，提升耐受度幫助肌膚自我更新與癒合。']
  },
  {
    id: '58-6-淨膚-m',
    productNumber: '58-6',
    productTitle: '淨膚珍珠霜',
    name: '58-6 淨膚珍珠霜',
    category: 'cleansing',
    series: '淨膚系列',
    price: 3100,
    memberPrice: 2780,
    description: '珍珠精華，提亮膚色',
    image: '/11.jpg',
    benefits: ['珍珠', '提亮', '光澤'],
    size: '標準',
    volume: '30ml',
    pv: 2250,
    usage: '使肌膚留住、維持水分，透出如珍珠般的光澤白皙水嫩。',
    ingredients: '蘆薈汁葉萃取液、水解珍珠原液、玻尿酸',
    instructions: '早晚使用，均勻擦上58-5後，快速取適量的58-6產品均勻塗抹於臉上，斑點地方請加強，早晚均須使用。',
    precautions: ['水解珍珠原液能幫助均勻膚色、改善暗沉與蠟黃，增加皮膚防禦力，減少敏感不適，提供胺基酸，促進肌膚修護與彈性，容易吸收、滲透力強。']
  },
  {
    id: '58-7-淨膚-m',
    productNumber: '58-7',
    productTitle: '貴婦淨膚霜',
    name: '58-7 貴婦淨膚霜',
    category: 'cleansing',
    series: '淨膚系列',
    price: 3100,
    memberPrice: 2780,
    description: '當歸萃取液，能淡化皺紋，延緩老化，使皮膚水嫩、白皙',
    featured: true,
    featuredOrder: 4,
    image: '/11.jpg',
    benefits: ['極乾肌', '淡斑', '美白'],
    size: '標準',
    volume: '30ml',
    pv: 2250,
    usage: '內含當歸萃取液，能淡化皺紋、延緩老化，長時間使用能使皮膚水嫩、白皙。',
    ingredients: '甘草根萃取液、當歸萃取液、維他命E',
    instructions: '早晚使用，均勻擦上58-6後，快速取適量的58-7產品均勻塗抹於臉上，斑點地方請加強，早晚均須使用。',
    precautions: ['當歸萃取液能幫助肌膚代謝與養分輸送，抗發炎、促進血液循環，改善暗沉膚色、提升肌膚紅潤光澤感，減少泛紅與乾燥不適，減少自由基損傷，延緩肌膚衰老，提升整體膚質活力與光澤。']
  },
  {
    id: '58-8-淨膚-m',
    productNumber: '58-8',
    productTitle: '隱痕定格液',
    name: '58-8 隱痕定格液',
    category: 'cleansing',
    series: '淨膚系列',
    price: 3100,
    memberPrice: 2780,
    description: '淨膚精華，深層修護',
    image: '/03.jpg',
    benefits: ['精華', '修護', '淨膚'],
    size: '標準',
    volume: '120ml',
    pv: 2250,
    usage: '回復肌膚彈性，撫平皺紋，使肌膚由內而外恢復光澤亮麗，白天防曬後仍可進行補水保濕。',
    ingredients: '玻尿酸、甘草酸二鉀、藍銅胜肽',
    instructions: '於所有保養品或彩妝品後使用，每3～4小時補充一次，距離臉部約15～20公分，讓噴霧散射出的幅度更廣，方能均勻吸收，請勿拍打肌膚，讓噴液自然吸收。',
    precautions: ['甘草酸二鉀能抑制皮膚發炎，改善紅腫、刺癢，幫助穩定屏障功能，降低過敏反應，減少黑色素形成，改善乾癢症狀與紅腫反應。']
  },
  {
    id: '58-9-3',
    productNumber: '58-9',
    productTitle: '淨膚精華粉與原液',
    name: '58-9 淨膚精華粉與原液',
    category: 'cleansing',
    series: '淨膚系列',
    price: 1480,
    memberPrice: 1320,
    description: '粉液結合，經濟實惠',
    image: '/10.jpg',
    benefits: ['精華', '粉體', '經濟'],
    size: '標準',
    volume: '3件組',
    pv: 1122,
    usage: '使肌膚回復柔順平和的線條，恢復肌膚彈性、使肌膚有光澤。',
    ingredients: '甘草萃取、蘆薈萃取液、褐藻萃取',
    instructions: '皮膚清潔後，將淨膚精華粉與淨膚精華液攪拌在一起變成淨膚面膜，將面膜均勻抹在臉上，黯沉斑點肌膚全臉按摩由額頭至下巴按摩4次，針對暗沉斑點處加強，力道要視膚況調整。',
    precautions: ['褐藻萃取能促進微循環，幫助排水代謝、改善暗沉，緩解紅腫、穩定敏感膚況。']
  },
  {
    id: '58-9-1',
    productNumber: '58-9',
    productTitle: '淨膚精華粉與原液',
    name: '58-9 淨膚精華粉與原液',
    category: 'cleansing',
    series: '淨膚系列',
    price: 680,
    memberPrice: 580,
    description: '粉液結合，經濟實惠',
    image: '/10.jpg',
    benefits: ['精華', '粉體', '經濟'],
    size: '標準',
    volume: '1件組',
    pv: 464,
    usage: '使肌膚回復柔順平和的線條，恢復肌膚彈性、使肌膚有光澤。',
    ingredients: '甘草萃取、蘆薈萃取液、褐藻萃取',
    instructions: '皮膚清潔後，將淨膚精華粉與淨膚精華液攪拌在一起變成淨膚面膜，將面膜均勻抹在臉上，黯沉斑點肌膚全臉按摩由額頭至下巴按摩4次，針對暗沉斑點處加強，力道要視膚況調整。',
    precautions: ['褐藻萃取能促進微循環，幫助排水代謝、改善暗沉，緩解紅腫、穩定敏感膚況。']
  },

  // 晶亮系列 (D系列)
  {
    id: 'd1-晶亮-m',
    productNumber: 'D1',
    productTitle: '晶亮凝露',
    name: 'D1-晶亮凝露',
    category: 'brightening',
    series: '晶亮系列',
    price: 3100,
    memberPrice: 2780,
    description: '晶亮膚色，恢復光澤',
    image: '/14.jpg',
    benefits: ['金盞花', '鎮靜'],
    size: '標準',
    volume: '30ml',
    pv: 2250,
    usage: '舒緩敏感，鎮靜紅腫，非常適合敏感肌，有助於小傷口癒合、屏障功能受損肌膚的恢復。',
    ingredients: '保濕因子、金盞花萃取',
    instructions: '早晚潔膚後，取適量D1塗抹全臉，快速均勻勿拍打按摩。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  {
    id: 'd2-晶亮-m',
    productNumber: 'D2',
    productTitle: '晶亮柔敏原液',
    name: 'D2-晶亮柔敏原液',
    category: 'brightening',
    series: '晶亮系列',
    price: 3100,
    memberPrice: 2780,
    description: '柔敏配方，溫和有效',
    image: '/15.jpg',
    benefits: ['B5', '強效保濕'],
    size: '標準',
    volume: '30ml',
    pv: 2250,
    usage: '強效保濕、修護、抗敏、舒緩等多重功效，增加皮膚彈性與柔軟度，幫助修復受損角質層，減少刺激、泛紅、乾癢敏感現象。',
    ingredients: '保濕因子、維他命B5、蘋果萃取液',
    instructions: '早晚潔膚後，擦完D1後取適量D2塗抹全臉，快速均勻勿拍打按摩。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  {
    id: 'D3',
    productNumber: 'D3',
    productTitle: '絲光蛋白精華液',
    name: 'D3-絲光蛋白精華液',
    category: 'brightening',
    series: '晶亮系列',
    price: 3320,
    memberPrice: 2980,
    description: '蛋白精華，絲光質感',
    image: '/15.jpg',
    benefits: ['玻尿酸', '修護'],
    size: '標準',
    volume: '30ml',
    pv: 2533,
    usage: '提升肌膚耐受力，減少外界刺激影響。玻尿酸能讓肌膚表面平滑細緻，幫助皮膚細胞維持良好環境，促進受損肌膚修護。',
    ingredients: '維他命E、水解米蛋白、玻尿酸',
    instructions: '早晚潔膚後，擦完D2後取適量D3塗抹全臉，快速均勻勿拍打按摩。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  {
    id: 'd4-晶亮-m',
    productNumber: 'D4',
    productTitle: '晶亮精華霜',
    name: 'D4-晶亮精華霜',
    category: 'brightening',
    series: '晶亮系列',
    price: 3100,
    memberPrice: 2780,
    description: '精華濃縮，深層修護',
    image: '/14.jpg',
    benefits: ['堅果籽油', '抗敏'],
    size: '標準',
    volume: '30ml',
    pv: 2250,
    usage: '天然抗炎成分能夠快速滲透入皮膚，對敏感肌、微發炎肌膚有很好的舒緩效果。',
    ingredients: '全緣葉澳洲堅果籽油、去離子水、玻尿酸、維他命B3',
    instructions: '早晚潔膚後，擦完D3後取適量D4塗抹全臉，快速均勻勿拍打按摩。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  {
    id: 'd5-晶亮-m',
    productNumber: 'D5',
    productTitle: '晶亮剔透霜',
    name: 'D5-晶亮剔透霜',
    category: 'brightening',
    series: '晶亮系列',
    price: 3100,
    memberPrice: 2780,
    description: '剔透質地，透亮膚色',
    image: '/14.jpg',
    benefits: ['桑白皮', '舒緩'],
    size: '標準',
    volume: '30ml',
    pv: 2250,
    usage: '幫助降低皮膚發炎反應，桑白皮的致敏性低，適用於敏感性肌膚、酒糟肌膚，有助肌膚補水、鎖水。',
    ingredients: '桑白皮萃取、去離子水、維他命E',
    instructions: '早晚潔膚後，擦完D4後取適量D5塗抹全臉，快速均勻勿拍打按摩。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  {
    id: 'd6-晶亮-m',
    productNumber: 'D6',
    productTitle: '晶亮亮顏霜',
    name: 'D6-晶亮亮顏霜',
    category: 'brightening',
    series: '晶亮系列',
    price: 3100,
    memberPrice: 2780,
    description: '水解黑桑果能收斂肌膚、使肌膚具有防護力',
    featured: true,
    featuredOrder: 5,
    image: '/14.jpg',
    benefits: ['敏感酒糟', '黑桑果', '美白'],
    size: '標準',
    volume: '30ml',
    pv: 2250,
    usage: '肌膚美白，減少黑色素形成，減緩肌膚老化，對抗暗沉蠟黃膚色。',
    ingredients: '水解黑桑果、去離子水、玻尿酸、人蔘萃取液',
    instructions: '早晚潔膚後，擦完D5後取適量D6塗抹全臉，快速均勻勿拍打按摩。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  {
    id: 'd7-晶亮-m',
    productNumber: 'D7',
    productTitle: '晶亮修護精華液',
    name: 'D7-晶亮修護精華液',
    category: 'brightening',
    series: '晶亮系列',
    price: 3100,
    memberPrice: 2780,
    description: '噴霧方便，隨時修護',
    image: '/03.jpg',
    benefits: ['燕麥', '屏障'],
    size: '標準',
    volume: '120ml',
    pv: 2250,
    usage: '有助肌膚補水，隨時保濕、維持肌膚水嫩光滑，白天防曬後仍可進行補水保濕。',
    ingredients: '燕麥萃取、去離子水、玻尿酸',
    instructions: '於所有保養品、彩妝品後使用，每3~4小時補充一次，距離臉部約15~20公分，讓噴霧散射出的幅度更廣，較能均勻吸收。請勿拍打肌膚，讓噴液自然吸收。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  {
    id: 'D8-10',
    productNumber: 'D8',
    productTitle: '晶亮精華粉與原液',
    name: 'D8-晶亮精華粉與原液',
    category: 'brightening',
    series: '晶亮系列',
    price: 4900,
    memberPrice: 4400,
    description: '粉液結合，雙重功效',
    image: '/d8-set10.jpg',
    benefits: ['課程專用', '細胞重建'],
    size: '標準',
    volume: '10件組',
    pv: 3740,
    usage: '幫助強化肌膚屏障，對炎症、敏感有穩定膚況的作用。使肌膚回復柔順平和的線條並恢復彈性有光澤',
    ingredients: '野葛根、蘆薈萃取液、褐藻萃取',
    instructions: '晶亮課程專用，需受過專業培訓之美容師於店內操作課程使用。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },
  {
    id: 'D8-1',
    productNumber: 'D8',
    productTitle: '晶亮精華粉與原液',
    name: 'D8-晶亮精華粉與原液',
    category: 'brightening',
    series: '晶亮系列',
    price: 680,
    memberPrice: 580,
    description: '粉液結合，雙重功效',
    image: '/d8-set1.jpg',
    benefits: ['課程專用', '細胞重建'],
    size: '標準',
    volume: '1件組',
    pv: 464,
    usage: '幫助強化肌膚屏障，對炎症、敏感有穩定膚況的作用。使肌膚回復柔順平和的線條並恢復彈性有光澤',
    ingredients: '野葛根、蘆薈萃取液、褐藻萃取',
    instructions: '晶亮課程專用，需受過專業培訓之美容師於店內操作課程使用。',
    storage: '存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },

  // Q彈精緻系列 (68系列)
  {
    id: '68膠原滋養再生露-q彈精緻-m',
    productNumber: '68',
    productTitle: '膠原滋養再生露',
    name: '68 膠原滋養再生露',
    category: 'elasticity',
    series: 'Q彈精緻系列',
    price: 3100,
    memberPrice: 2780,
    description: '膠原滋養，再生修護',
    image: '/09.jpg',
    benefits: ['膠原', '滋養', '再生'],
    size: '標準',
    volume: '50ml',
    pv: 2250
  },
  {
    id: '68-1-q彈精緻-m',
    productNumber: '68-1',
    productTitle: 'Q彈精緻滋養液',
    name: '68-1 Q彈精緻滋養液',
    category: 'elasticity',
    series: 'Q彈精緻系列',
    price: 3100,
    memberPrice: 2780,
    description: 'Q彈滋養，精緻修護',
    image: '/18.jpg',
    benefits: ['Q彈', '滋養', '精緻'],
    size: '標準',
    volume: '30ml',
    pv: 2250
  },
  {
    id: '68-2',
    productNumber: '68-2',
    productTitle: 'Q彈滋養凝露',
    name: '68-2 Q彈滋養凝露',
    category: 'elasticity',
    series: 'Q彈精緻系列',
    price: 4430,
    memberPrice: 3980,
    description: 'Q彈滋養，凝聚修護',
    image: '/09.jpg',
    benefits: ['Q彈', '滋養', '凝露'],
    size: '標準',
    volume: '50ml',
    pv: 3383
  },
  {
    id: '68-3-q彈精緻-m',
    productNumber: '68-3',
    productTitle: 'Q彈滋養霜',
    name: '68-3 Q彈滋養霜',
    category: 'elasticity',
    series: 'Q彈精緻系列',
    price: 3100,
    memberPrice: 2780,
    description: 'Q彈滋養，深層修護',
    image: '/18.jpg',
    benefits: ['Q彈', '滋養', '霜體'],
    size: '標準',
    volume: '30ml',
    pv: 2250
  },
  {
    id: '68-4',
    productNumber: '68-4',
    productTitle: 'Q彈精緻霜',
    name: '68-4 Q彈精緻霜',
    category: 'elasticity',
    series: 'Q彈精緻系列',
    price: 3320,
    memberPrice: 2980,
    description: 'Q彈精緻，提升活力',
    image: '/17.jpg',
    benefits: ['Q彈', '精緻', '活力'],
    size: '標準',
    volume: '30ml',
    pv: 2533
  },
  {
    id: '68-5-q彈精緻-m',
    productNumber: '68-5',
    productTitle: 'Q彈精緻修護液',
    name: '68-5 Q彈精緻修護液',
    category: 'elasticity',
    series: 'Q彈精緻系列',
    price: 3100,
    memberPrice: 2780,
    description: 'Q彈精緻，修護深層',
    image: '/03.jpg',
    benefits: ['Q彈', '精緻', '修護'],
    size: '標準',
    volume: '120ml',
    pv: 2250
  },
  {
    id: '68-6-10',
    productNumber: '68-6',
    productTitle: 'Q彈精緻精華粉與原液',
    name: '68-6 Q彈精緻精華粉與原液',
    category: 'elasticity',
    series: 'Q彈精緻系列',
    price: 4900,
    memberPrice: 4400,
    description: '粉液結合，雙重功效',
    image: '/10.jpg',
    benefits: ['精華', '粉體', '高效'],
    size: '標準',
    volume: '10件組',
    pv: 3740
  },
  {
    id: '68-6-1',
    productNumber: '68-6',
    productTitle: 'Q彈精緻精華粉與原液',
    name: '68-6 Q彈精緻精華粉與原液',
    category: 'elasticity',
    series: 'Q彈精緻系列',
    price: 680,
    memberPrice: 580,
    description: '粉液結合，雙重功效',
    image: '/10.jpg',
    benefits: ['精華', '粉體', '高效'],
    size: '標準',
    volume: '1件組',
    pv: 464
  },

  // 其他系列
  {
    id: 'special-38',
    productNumber: '38號',
    productTitle: '修護柔敏膠原凝露',
    name: '38號修護柔敏膠原凝露',
    category: 'special',
    series: '特殊系列',
    price: 4430,
    memberPrice: 3980,
    description: '超強舒緩、修復、保濕王者',
    featured: true,
    featuredOrder: 1,
    image: '/collagen-gel-detail.jpg',
    benefits: ['超強舒緩', '修復', '保濕王者'],
    size: '標準',
    volume: '300ml',
    pv: 3383,
    usage: '舒緩及修護肌膚，減少肌膚乾澀、脫屑、脫皮狀況，調理肌膚油水平衡。\n每天使用可提升肌膚對環境傷害的保護力，形成肌膚保護膜。',
    instructions: '清潔後，取適量塗抹全身上下所有部位(包含私密處)皆可使用！\n所有情況舉例：泛紅、敏感、過敏、曬傷、發炎、灼燒脫皮、皮膚炎、疹子…等皆可使用！\n\n✦ 加強過夜用法：系列保養品上完後，全臉塗抹約0.2公分厚，睡醒用飲用水擦拭至薄薄一層，再重新上後續保養品即可。',
    usageModes: [
      {
        label: '01',
        title: '全臉厚敷，深層修護加乘',
        description: '清潔肌膚後，使用面膜刷將膠原凝露均勻厚敷於全臉約 0.2 公分厚度，停留 15-20 分鐘，再用飲用水沾濕洗臉巾輕柔擦拭乾淨，後續依序使用日常保養品即可。',
        note: '適用部位：全臉、全身皆可使用，建議使用飲用水擦拭'
      },
      {
        label: '02',
        title: '隨時薄塗，舒緩肌膚不適',
        description: '當肌膚出現不適時，可隨時取適量薄塗於局部或大面積肌膚，幫助舒緩、修復與保濕。',
        tags: ['曬傷', '灼傷', '脫皮', '發炎', '疹子', '私密處緩解不適'],
        note: '全身、寶寶尿布疹、私密處皆可使用'
      },
      {
        label: '03',
        title: '夜間加強，喚醒澎潤光采',
        description: '系列保養品使用完畢後，全臉塗抹約 0.2 公分厚，睡醒後用飲用水擦拭至薄薄一層，再重新上後續保養品即可。',
      }
    ],
    usageTips: [
      '冰鎮效果更佳：放置冰箱冷藏後使用，舒緩效果更佳',
      '刺癢感屬正常修護反應：若感覺些微刺癢，但沒有出現紅、腫、痛等異常反應，通常代表肌膚存在較多隱性受損區域，產品正在協助肌膚修護與調理',
      '若有異常請停止使用：若出現持續不適、明顯紅腫或其他異常狀況，請立即停止使用並與我們聯繫'
    ],
    ingredients: '蘆薈葉汁萃取、透明質酸、甘露醇萃取',
    storage: '存放於陰涼乾燥處。避免陽光直射及潮濕環境。\n在家建議冰冷凍敷效果最佳!',
    storySections: {
      heroImage: '/collagen-story-hero.jpg',
      intro: {
        title: '純天然植萃，任何受損膚況適用',
        gridImage: '/collagen-story-concerns-grid.jpg',
        warning: '⚠️ 溫和純淨無添加：全身上下、寶寶尿布疹、私密處皆可安心使用。',
      },
      ingredientsSection: {
        items: [
          { image: '/collagen-story-ingredient-1.jpg', name: '蘆薈葉汁萃取液', description: '有「肌膚天然急救箱」之稱，富含天然多醣體與胺基酸，能迅速為肌膚補水，舒緩泛紅與乾燥不適，加速修復力。' },
          { image: '/collagen-story-ingredient-2.jpg', name: '透明質酸', description: '俗稱玻尿酸，具備優異的鎖水能力，能大量吸附並鎖留水分，維持肌膚澎潤與彈性，減緩乾燥引起的細紋。' },
          { image: '/collagen-story-ingredient-3.jpg', name: '甘露醇萃取', description: '天然抗氧化多醣醇成分，具舒緩鎮定特性，能降低肌膚敏感反應，幫助維持肌膚水潤與穩定狀態。' },
        ],
      },
      benefits: [
        { image: '/collagen-story-benefit-1.jpg', title: '厚敷修護｜深層舒緩鎮定', points: ['全臉厚敷 0.2 公分，停留 15-20 分鐘', '醫美沙龍級 300ml，用量無負擔', '敏弱肌、術後修復皆適用'] },
        { image: '/collagen-story-benefit-2.jpg', title: '薄塗急救｜隨時隨地舒緩', points: ['暗沉、雷射術後、敏感泛紅皆可用', '每天使用，膚況感受得到的變化', '質地清爽好吸收，不黏膩'] },
      ],
    },
  },

  {
    id: 'special-21',
    productNumber: '21號',
    productTitle: '玫瑰角質乳液',
    name: '21號玫瑰角質乳液',
    category: 'special',
    series: '特殊系列',
    price: 950,
    memberPrice: 850,
    description: '玉瑰爡角質，清潔修護',
    image: '/22.jpg',
    benefits: ['玉瑰爡', '角質', '清潔'],
    size: '標準',
    volume: '80ml',
    pv: 680
  },
  {
    id: 'special-1',
    productTitle: '極致水潤解渴霜',
    name: '極致水潤解渴霜',
    category: 'special',
    series: '特殊系列',
    price: 3100,
    memberPrice: 2780,
    description: '極致保濕，深層滋養',
    image: '/14.jpg',
    benefits: ['保濕', '滋養', '解渴'],
    size: '標準',
    volume: '30ml',
    pv: 2250
  },
  {
    id: 'special-2',
    productTitle: '舒緩乖乖修護乳',
    name: '舒緩乖乖修護乳',
    category: 'special',
    series: '特殊系列',
    price: 3100,
    memberPrice: 2780,
    description: '舒緩敏感，溫和修護',
    image: '/14.jpg',
    benefits: ['舒緩', '敏感', '修護'],
    size: '標準',
    volume: '30ml',
    pv: 2250
  },
  {
    id: 'special-4',
    productTitle: '金頭腦皮膚調理液',
    name: '金頭腦皮膚調理液',
    category: 'special',
    series: '特殊系列',
    price: 3100,
    memberPrice: 2780,
    description: '調理肌膚，平衡油水',
    image: '/24.jpg',
    benefits: ['調理', '平衡', '油水'],
    size: '標準',
    volume: '60ml',
    pv: 2250
  },
  {
    id: 'special-5',
    productTitle: '好皮敷修護液',
    name: '好皮敷修護液',
    category: 'special',
    series: '特殊系列',
    price: 3100,
    memberPrice: 2780,
    description: '好皮敷修護，深層保護',
    image: '/24.jpg',
    benefits: ['好皮敷', '修護', '保護'],
    size: '標準',
    volume: '60ml',
    pv: 2250
  },
  {
    id: 'special-6',
    productTitle: '好皮敷凝露',
    name: '好皮敷凝露',
    category: 'special',
    series: '特殊系列',
    price: 3100,
    memberPrice: 2780,
    description: '好皮敷凝聚，滋養修護',
    image: '/09.jpg',
    benefits: ['好皮敷', '凝露', '滋養'],
    size: '標準',
    volume: '50ml',
    pv: 2250
  },
  {
    id: 'special-7',
    productNumber: '',
    productTitle: '精緻美瞳眼霜',
    name: '精緻美瞳眼霜',
    category: 'special',
    series: '特殊系列',
    price: 3100,
    memberPrice: 2780,
    description: '精緻美瞳，修護眼周',
    image: '/01.jpg',
    benefits: ['精緻', '美瞳', '眼周'],
    size: '標準',
    volume: '30ml',
    pv: 2250
  },
  {
    id: 'special-8',
    productNumber: '',
    productTitle: '露加綻美飲',
    name: '露加綻美飲',
    category: 'special',
    series: '特殊系列',
    price: 2535,
    memberPrice: 2280,
    description: '由內而外，阻斷慢性發炎老化循環',
    image: '/luga-beauty-drink.jpg',
    benefits: ['美妍', '飲品', '由內而外'],
    size: '標準',
    volume: '15入',
    pv: 1260,
    ingredients: '白藜蘆醇（Resveratrol）、輔酶Q10（Coenzyme Q10）、牛磺酸（Taurine）、MSM（甲基硫醯基甲烷）、透明質酸鈉（Sodium Hyaluronate）、銀耳萃取物（Tremella Fuciformis Extract）、維生素C、鋅',
    usage: '慢性發炎會破壞膠原蛋白、促使細胞機能下降與受損，形成「發炎反應→修復力下降→顯著老化跡象」的惡性循環。露加綻美飲透過三大機轉由內而外調理：源頭阻斷預防發炎、深層修復重啟細胞活力、表層改善實現水潤透亮。',
    instructions: '每日限1包，請使用100-150毫升水沖泡，攪拌均勻後飲用，多食無益。',
    storage: '存放陰涼乾燥處，避免陽光照射、高溫潮濕處。',
    precautions: [
      '全素食可食用。',
      '本品添加植物萃取，如有沉澱係屬正常。',
      '避免睡前食用，孕婦及哺乳期婦女使用前應先諮詢醫師。',
      '十五歲以下小孩、懷孕或哺乳期間婦女及服用抗凝血藥品(warfarin)之病患，不宜食用。'
    ],
    usageTips: [
      '約2週開始感受到變化，為達最佳效果建議連續使用12-16週'
    ],
    storySections: {
      intro: {
        title: '慢性發炎如何引發老化惡性循環',
        gridImage: '/luga-story-cycle.jpg',
      },
      keyFormulas: {
        image: '/luga-story-icons.jpg',
        items: [
          { label: '01', title: '源頭阻斷．預防發炎', tags: 'MSM．牛磺酸' },
          { label: '02', title: '深層修復．重啟細胞活力', tags: '白藜蘆醇．輔酶Q10．牛磺酸' },
          { label: '03', title: '表層改善．實現水潤透亮', tags: '玻尿酸．銀耳萃取．維生素C＆鋅' },
        ],
      },
      clinicalStats: [
        { value: '-20~25%', label: '發炎指標CRP' },
        { value: '+11%', label: '面部含水量' },
        { value: '-15.6%', label: '皺紋改善' },
        { value: '40%', label: '挽救膠原流失' },
      ],
      howToUse: [
        { icon: 'cup', text: '100-150ml溫涼水' },
        { icon: 'clock', text: '餐後30分鐘內' },
        { icon: 'calendar', text: '每日1包' },
      ],
      faqs: [
        { q: '素食者可以食用嗎？', a: '可以，本產品為全素配方。' },
        { q: '哪些人應避免使用？', a: '15歲以下兒童、孕婦與哺乳期婦女、服用抗凝血藥物者。' },
        { q: '生理期是否可以食用？', a: '主要成分無禁忌，但配方含洛神花性偏寒涼，經期體質虛寒者建議酌量或暫停。' },
      ],
      specs: [
        { label: '風味', value: '玫瑰洛神' },
        { label: '包裝', value: '每包6g，每盒15份' },
        { label: '產地', value: '台灣製造' },
      ],
      fullIngredients: [
        'Taurine', 'Methylsulfonylmethane', 'Maltodextrin',
        '4-O-α-glucopyranosyl-D-sorbitol', 'Hibiscus Sabdariffa Extract',
        'Resistant maltodextrin', 'Coenzyme Q10', 'Zn-Gluconate', 'Vitamin C',
        'Streptococcus Zooepidemicus Fermentation (containing Sodium Hyaluronate)',
        'Tremella Fuciformis Extract', 'Grape Extract', 'Parfum', 'Silica', 'Sucralose',
      ],
    },
  },

  // 美胸系列
  {
    id: 'bust-1',
    productNumber: '',
    productTitle: 'UP活絡喚醒乳',
    name: 'UP活絡喚醒乳',
    category: 'bust',
    series: '美胸系列',
    price: 4430,
    memberPrice: 3980,
    description: '活絡喚醒，提升紋理',
    image: '/03.jpg',
    benefits: ['活絡', '喚醒', '提升'],
    size: '標準',
    volume: '120ml',
    pv: 3383
  },
  {
    id: 'bust-2',
    productNumber: '',
    productTitle: 'UP定點精華液',
    name: 'UP定點精華液',
    category: 'bust',
    series: '美胸系列',
    price: 3320,
    memberPrice: 2980,
    description: '定點精華，集中修護',
    image: '/01.jpg',
    benefits: ['定點', '精華', '集中'],
    size: '標準',
    volume: '30ml',
    pv: 2533
  },
  {
    id: 'bust-3',
    productNumber: '',
    productTitle: 'UP緊實精華液',
    name: 'UP緊實精華液',
    category: 'bust',
    series: '美胸系列',
    price: 3320,
    memberPrice: 2980,
    description: '緊實提升，修護保護',
    image: '/01.jpg',
    benefits: ['緊實', '提升', '修護'],
    size: '標準',
    volume: '30ml',
    pv: 2533
  },

  // 精油系列
  {
    id: 'Q1',
    productNumber: 'Q1',
    productTitle: '草本精油(安撫/舒緩)',
    name: 'Q1-草本精油(安撫/舒緩)',
    category: 'essential-oil',
    series: '精油系列',
    price: 1280,
    memberPrice: 980,
    description: '橙花天竺葵草本植萃｜澄淨亮采．基礎修護煥白',
    intro: '橙花優雅明亮的花果香調，交織著天竺葵溫柔沉穩的草本氣息，調和出柔和又讓人放鬆的典雅香氣。感覺就像與自然大地之息接軌，沉浸在陽光灑落花園的平靜美好中，讓您在日常繁忙緊繃的時刻，能得到片刻的跳脫與身心靈舒緩，重新拾回內心的寧靜與柔嫩肌膚的被呵護感。',
    image: '/q1-hero.png',
    benefits: ['草本透亮', '橙花放鬆'],
    size: '標準',
    volume: '100ml',
    pv: 833,
    benefitCards: [
      { title: '亮采拋光', description: '橙花與天竺葵精油溫和調理膚色，改善沉悶暗沉，重現淨白通透的光澤。' },
      { title: '舒緩放鬆', description: '天然花草芳香能幫助舒緩壓力、放鬆情緒。' },
      { title: '滑嫩膚觸', description: '質地清爽好吸收，使肌膚觸感變得絲滑柔軟。' },
      { title: '深層補水', description: '玻尿酸高效保濕鎖水，維護肌膚水分平衡。' },
    ],
    forYou: [
      '肌膚暗沉無光：渴望改善粗糙黯沉、重現透亮拋光感者',
      '情緒緊繃焦躁：需要舒緩身心、幫助放鬆入睡者',
      '肌膚油水失衡：希望維持穩定膚況、日常保養者',
    ],
    experience: [
      { icon: 'feather', title: '輕盈好吸收', description: '質地清爽好推展，迅速滲透不黏膩' },
      { icon: 'flower', title: '天然植萃香氣', description: '散發苦橙花與天竺葵的天然花草香，帶來沉靜放鬆的舒壓感受' },
    ],
    usage: '✦ 舒緩情緒與放鬆\n透過橙花與天竺葵精油的天然芳香氣息，在使用過程中幫助放鬆身心、舒緩日常壓力，帶來溫和療癒的放鬆感受。\n\n✦ 深層保濕滋養\n結合甜杏仁油與甘油的保濕修護特性，深入滋養乾燥肌膚，使肌膚回復柔嫩細緻、觸感絲滑。\n\n✦ 平衡肌膚油水\n幫助維持肌膚健康狀態，適合各類膚質作為日常身體護理使用。',
    instructions: '洗完澡後，趁身體肌膚微濕時取適量塗抹全身，輕拍至吸收即可。',
    ingredients: '苦橙花精油、天竺葵精油、玻尿酸、甘油',
    storage: '存放於陰涼乾燥處。\n避免陽光直射及潮濕環境。'
  },
  {
    id: 'Q2',
    productNumber: 'Q2',
    productTitle: '草本精油(通暢/活化)',
    name: 'Q2-草本精油(通暢/活化)',
    category: 'essential-oil',
    series: '精油系列',
    price: 1380,
    memberPrice: 1080,
    description: '薰衣草植萃精油｜雙效保濕亮采．煥發水潤透亮',
    intro: '橙花優雅清甜的花果香調，交織著天竺葵與薰衣草的沉穩草本氣息，溫柔包裹每一吋肌膚。植物花草交融出的層次感，宛如漫步於清晨拂過的日光花園，帶走滿身疲憊與緊繃。配合甜杏仁油與玻尿酸的深層滋養，讓您在繁忙的日常裡重拾身心靈的平衡與平靜，享受被溫柔呵護的片刻時光。',
    image: '/q2-hero.png',
    benefits: ['深層補水', '鎮靜修護'],
    size: '標準',
    volume: '100ml',
    pv: 918,
    benefitCards: [
      { title: '深層補水', description: '玻尿酸能迅速為肌膚大量抓水鎖水，改善乾裂與脫屑，重現水潤光澤。' },
      { title: '舒緩修護', description: '薰衣草萃取能安撫換季乾癢與泛紅不適，幫助穩定膚況。' },
      { title: '澎潤彈性', description: '深入肌膚補水修護，維護細緻年輕感。' },
      { title: '滑嫩膚觸', description: '甜杏仁油修護乾燥肌膚，使膚觸柔嫩細致。' },
    ],
    forYou: [
      '肌膚乾燥粗糙：渴望撫平乾紋、恢復絲滑觸感者',
      '膚色暗沉無光：希望改善肢體暗沉、提升全身肌膚亮采者',
      '日常壓力緊繃：喜愛居家芳療，想在睡前放鬆身心靈者',
    ],
    experience: [
      { icon: 'feather', title: '輕盈好吸收', description: '質地清爽不黏衣物，推開即化為滋養水膜' },
      { icon: 'flower', title: '天然植萃香氣', description: '散發淡雅薰衣草的天然草本清香，帶來沉靜療癒感受' },
    ],
    ingredients: '薰衣草萃取、甜杏仁油、玻尿酸、甘油',
    usage: '✦ 情緒安撫與紓壓\n透過橙花、天竺葵與薰衣草的植物芳香，在按摩過程中幫助放鬆神經、舒緩壓力。\n\n✦ 深層滋養修復\n甜杏仁油能修復乾燥的身體肌膚，使觸感變得絲滑柔軟。\n\n✦ 平衡肌膚油水\n幫助維持肌膚健康狀態，適合各類膚質作為日常身體護理使用。',
    instructions: '洗完澡後，趁身體肌膚微濕時取適量塗抹全身，以輕拍方式促進吸收即可。',
    storage: '需存放於陰涼乾燥處，避免陽光直射及潮濕環境。'
  },

  // 清潔系列
  {
    id: '22-small',
    productNumber: '22號',
    productTitle: '亮采99金卸妝乳',
    name: '22號亮采99金卸妝乳',
    category: 'cleaning',
    series: '清潔系列',
    price: 1540,
    memberPrice: 1380,
    description: '亮采99金卸妝，溫和清潔',
    image: '/03.jpg',
    benefits: ['卸妝', '清潔', '溫和'],
    size: '小',
    volume: '120ml',
    pv: 1173
  },
  {
    id: '22-large',
    productNumber: '22號',
    productTitle: '亮采99金卸妝乳',
    name: '22號亮采99金卸妝乳',
    category: 'cleaning',
    series: '清潔系列',
    price: 3200,
    memberPrice: 2980,
    description: '亮采99金卸妝，溫和清潔',
    image: '/05.jpg',
    benefits: ['卸妝', '清潔', '溫和'],
    size: '大',
    volume: '500ml',
    pv: 2533
  },
  {
    id: '23-small',
    productNumber: '23號',
    productTitle: '亮采99金潔顏蜜',
    name: '23號亮采99金潔顏蜜',
    category: 'cleaning',
    series: '清潔系列',
    price: 1540,
    memberPrice: 1380,
    description: '亮采99金潔顏，深層清潔',
    image: '/03.jpg',
    benefits: ['潔顏', '清潔', '深層'],
    size: '小',
    volume: '120ml',
    pv: 1173
  },
  {
    id: '23-large',
    productNumber: '23號',
    productTitle: '亮采99金潔顏蜜',
    name: '23號亮采99金潔顏蜜',
    category: 'cleaning',
    series: '清潔系列',
    price: 3200,
    memberPrice: 2980,
    description: '亮采99金潔顏，深層清潔',
    image: '/05.jpg',
    benefits: ['潔顏', '清潔', '深層'],
    size: '大',
    volume: '500ml',
    pv: 2533
  },

  // 安瓶保養組
  {
    id: 'ampoule-1',
    productNumber: '',
    productTitle: '熨斗系列安瓶保養組',
    name: '熨斗系列安瓶保養組',
    image: '/ampoule-iron.png',
    category: 'ampoule',
    series: '安瓶保養組',
    price: 3000,
    memberPrice: 2500,
    description: '微整形安瓶，集中修護',
    benefits: ['微整形', '安瓶', '修護'],
    size: '組合',
    volume: '9件組',
    pv: 2125
  },
  {
    id: 'ampoule-2',
    productNumber: '38',
    productTitle: '都都好安瓶保養組',
    name: '38都都好安瓶保養組',
    image: '/ampoule-dodu.png',
    category: 'ampoule',
    series: '安瓶保養組',
    price: 3000,
    memberPrice: 2500,
    description: '都都好安瓶，美顏修護',
    benefits: ['都都好', '安瓶', '美顏'],
    size: '組合',
    volume: '7件組',
    pv: 2125
  },
  {
    id: 'ampoule-3',
    productNumber: '58',
    productTitle: '淨膚安瓶保養組',
    name: '58淨膚安瓶保養組',
    image: '/ampoule-cleansing.png',
    category: 'ampoule',
    series: '安瓶保養組',
    price: 3000,
    memberPrice: 2500,
    description: '淨膚安瓶，清潔修護',
    benefits: ['淨膚', '安瓶', '清潔'],
    size: '組合',
    volume: '8件組',
    pv: 2125
  },
  {
    id: 'ampoule-4',
    productTitle: '晶亮安瓶保養組',
    name: '晶亮安瓶保養組',
    image: '/ampoule-brightening.png',
    category: 'ampoule',
    series: '安瓶保養組',
    price: 3000,
    memberPrice: 2500,
    description: '晶亮安瓶，提亮修護',
    benefits: ['晶亮', '安瓶', '提亮'],
    size: '組合',
    volume: '7件組',
    pv: 2125
  },

  // 首次體驗加購（原價 NT$3,000，加購價 NT$1,000，每次限購1組，PV 不列入累計計算）
  {
    id: 'trial-ampoule-1',
    productNumber: '',
    productTitle: '熨斗系列安瓶保養組',
    name: '熨斗系列安瓶保養組（首次體驗加購）',
    image: '/ampoule-iron.png',
    category: 'ampoule-trial',
    series: '首次體驗加購',
    price: 3000,
    memberPrice: 1000,
    description: '首次體驗限定加購價，每次限購1組，PV 不列入累計計算',
    benefits: ['首次體驗', '加購價'],
    size: '組合',
    pv: 0
  },
  {
    id: 'trial-ampoule-2',
    productNumber: '',
    productTitle: '38都都好安瓶保養組',
    name: '38都都好安瓶保養組（首次體驗加購）',
    image: '/ampoule-dodu.png',
    category: 'ampoule-trial',
    series: '首次體驗加購',
    price: 3000,
    memberPrice: 1000,
    description: '首次體驗限定加購價，每次限購1組，PV 不列入累計計算',
    benefits: ['首次體驗', '加購價'],
    size: '組合',
    pv: 0
  },
  {
    id: 'trial-ampoule-3',
    productNumber: '',
    productTitle: '58淨膚安瓶保養組',
    name: '58淨膚安瓶保養組（首次體驗加購）',
    image: '/ampoule-cleansing.png',
    category: 'ampoule-trial',
    series: '首次體驗加購',
    price: 3000,
    memberPrice: 1000,
    description: '首次體驗限定加購價，每次限購1組，PV 不列入累計計算',
    benefits: ['首次體驗', '加購價'],
    size: '組合',
    pv: 0
  },
  {
    id: 'trial-ampoule-4',
    productNumber: '',
    productTitle: '晶亮安瓶保養組',
    name: '晶亮安瓶保養組（首次體驗加購）',
    image: '/ampoule-brightening.png',
    category: 'ampoule-trial',
    series: '首次體驗加購',
    price: 3000,
    memberPrice: 1000,
    description: '首次體驗限定加購價，每次限購1組，PV 不列入累計計算',
    benefits: ['首次體驗', '加購價'],
    size: '組合',
    pv: 0
  }
];

// 肌膚檢測問卷
export interface SkinQuizQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    value: string;
  }[];
}

export const SKIN_QUIZ_QUESTIONS: SkinQuizQuestion[] = [
  {
    id: 'skin-type',
    question: '您的膚質類型是？',
    options: [
      { text: '油性肌膚', value: 'oily' },
      { text: '乾性肌膚', value: 'dry' },
      { text: '混合肌膚', value: 'combination' },
      { text: '中性肌膚', value: 'normal' }
    ]
  },
  {
    id: 'main-concern',
    question: '主要肌膚困擾是？',
    options: [
      { text: '痘痘/粉刺', value: 'acne' },
      { text: '暗沉/無光澤', value: 'dull' },
      { text: '乾燥/脫皮', value: 'dry' },
      { text: '敏感/泛紅', value: 'sensitive' },
      { text: '細紋/鬆弛', value: 'aging' },
      { text: '毛孔粗大', value: 'pores' }
    ]
  },
  {
    id: 'sensitivity',
    question: '肌膚是否敏感？',
    options: [
      { text: '非常敏感', value: 'very-sensitive' },
      { text: '有點敏感', value: 'somewhat-sensitive' },
      { text: '不敏感', value: 'not-sensitive' }
    ]
  },
  {
    id: 'age-group',
    question: '年齡區間？',
    options: [
      { text: '20-25歲', value: '20-25' },
      { text: '25-30歲', value: '25-30' },
      { text: '30-35歲', value: '30-35' },
      { text: '35-40歲', value: '35-40' },
      { text: '40歲以上', value: '40+' }
    ]
  },
  {
    id: 'goal',
    question: '護膚目標是？',
    options: [
      { text: '控油抗痘', value: 'acne-control' },
      { text: '保濕修護', value: 'moisturize' },
      { text: '抗衰老', value: 'anti-aging' },
      { text: '美白亮膚', value: 'brightening' },
      { text: '全面護理', value: 'comprehensive' }
    ]
  }
];

// 根據檢測結果推薦產品
export function getRecommendedProducts(answers: Record<string, string>): Product[] {
  const recommended: Product[] = [];

  const skinType = answers['skin-type'];
  const mainConcern = answers['main-concern'];
  const goal = answers['goal'];

  // 根據主要困擾推薦
  if (mainConcern === 'acne') {
    recommended.push(
      ...PRODUCTS.filter(p => p.series === '都都好系列').slice(0, 3)
    );
  } else if (mainConcern === 'dull') {
    recommended.push(
      ...PRODUCTS.filter(p => p.series === '晶亮系列').slice(0, 3)
    );
  } else if (mainConcern === 'dry') {
    recommended.push(
      ...PRODUCTS.filter(p => p.series === '淨膚系列').slice(0, 3)
    );
  } else if (mainConcern === 'sensitive') {
    recommended.push(
      ...PRODUCTS.filter(p => p.series === '淨膚系列' || p.series === '都都好系列').slice(0, 3)
    );
  } else if (mainConcern === 'aging') {
    recommended.push(
      ...PRODUCTS.filter(p => p.series === '晶亮系列' || p.series === 'Q彈精緻系列').slice(0, 3)
    );
  }

  // 如果推薦不足，補充基礎產品
  if (recommended.length < 3) {
    recommended.push(
      ...PRODUCTS.filter(p => !recommended.includes(p)).slice(0, 3 - recommended.length)
    );
  }

  return recommended.slice(0, 3);
}
