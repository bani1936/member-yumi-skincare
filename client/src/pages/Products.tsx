import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { useLocation } from 'wouter';
import { ChevronLeft, ChevronRight, ShoppingCart, Grid3x3, List, Sparkles, ShieldCheck, Droplet, Leaf, Target, Heart, ChevronDown, X } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import * as React from 'react';
import { PRODUCTS, PRODUCT_CATEGORIES, SERIES_INTROS } from '@/lib/products';
import { USAGE_SEQUENCES } from '@/lib/usage-sequences';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// 分類映射
const CATEGORY_MAP: Record<string, string> = {
  '明星商品': 'all',
  '熨斗系列(小)': 'micro-lifting-small',
  '熨斗系列(大)': 'micro-lifting-large',
  '都都好系列': 'skin-care',
  '淨膚系列': 'cleansing',
  '晶亮系列': 'brightening',
  'Q彈精緻系列': 'elasticity',
  '特殊系列': 'special',
  '美胸系列': 'bust',
  '精油系列': 'essential-oil',
  '清潔系列': 'cleaning',
};

const DISPLAY_CATEGORIES = [
  '明星商品',
  '熨斗系列(小)',
  '熨斗系列(大)',
  '都都好系列',
  '淨膚系列',
  '晶亮系列',
  'Q彈精緻系列',
  '特殊系列',
  '美胸系列',
  '精油系列',
  '清潔系列',
];

// 系列介紹特色圖示對照表
const SERIES_FEATURE_ICONS = {
  sparkles: Sparkles,
  shield: ShieldCheck,
  droplet: Droplet,
  leaf: Leaf,
  target: Target,
  heart: Heart,
} as const;

// 真實顧客回饋 — 熨斗系列(小)/(大) 為同一批保養品，共用同一組回饋內容。
// 之後有新的顧客回饋照片，把圖放進 client/public/ 並在下面陣列增減即可。
interface TestimonialItem {
  src: string;
  tags: string[];
  caption: string;
}

const IRON_SERIES_TESTIMONIALS: TestimonialItem[] = [
  {
    src: '/iron-testimonial-1.jpg',
    tags: ['顧客反饋', '3分鐘體驗'],
    caption: '體驗3分鐘無痛音波，立刻下顎線緊實、輪廓線變流暢、蘋果肌膨潤、整體肌膚保濕更亮白',
  },
  {
    src: '/iron-testimonial-2.jpg',
    tags: ['單擦無醫美', '輪廓線更平整', '肌膚細緻度提高'],
    caption: '前後兩張照片四個月的時間，因為備孕胖了十公斤，擦我們家熨斗系列臉反而變小變尖，整個面部平整度都變高😍完全沒做醫美～單擦',
  },
  {
    src: '/iron-testimonial-3-sonic.jpg',
    tags: ['IG20萬網紅', '台中UIS闆娘', '音波對比'],
    caption: '台中UIS店闆娘，IG20萬粉絲網紅，合作過多家醫美診所，自己去打音波的效果(上圖)。自己擦熨斗系列保養後，效果讓她很驚艷，果斷整間肌膚管理門店的產品全部換我們家的😍',
  },
  {
    src: '/iron-testimonial-4.jpg',
    tags: ['保經業務', '素顏奶油肌', '月子中心詢問度爆表'],
    caption: '超厲害保經業務，原本沒擦粉底不敢出門，擦熨斗系列一個月，養成素顏奶油肌，還在月子中心被媽媽們詢問怎麼保養的❤️',
  },
];

const TESTIMONIAL_SETS: Record<string, TestimonialItem[]> = {
  '熨斗系列(小)': IRON_SERIES_TESTIMONIALS,
  '熨斗系列(大)': IRON_SERIES_TESTIMONIALS,
};

export default function Products() {
  const [, navigate] = useLocation();

  // 從 URL 參數獲取初始分類
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFromUrl = urlParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || '明星商品');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFullIntro, setShowFullIntro] = useState(false);
  const [testimonialPreviewIndex, setTestimonialPreviewIndex] = useState<number | null>(null);

  // 切換系列時，收合「了解更多」內容
  useEffect(() => {
    setShowFullIntro(false);
    setTestimonialPreviewIndex(null);
  }, [selectedCategory]);

  const currentTestimonials = TESTIMONIAL_SETS[selectedCategory];

  const showTestimonialPrev = () => {
    if (testimonialPreviewIndex === null || !currentTestimonials) return;
    setTestimonialPreviewIndex((testimonialPreviewIndex - 1 + currentTestimonials.length) % currentTestimonials.length);
  };
  const showTestimonialNext = () => {
    if (testimonialPreviewIndex === null || !currentTestimonials) return;
    setTestimonialPreviewIndex((testimonialPreviewIndex + 1) % currentTestimonials.length);
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...PRODUCTS];

    if (selectedCategory === '明星商品') {
      filtered = filtered.filter(p => p.featured === true);
    } else {
      const categoryId = CATEGORY_MAP[selectedCategory];
      filtered = filtered.filter(p => p.category === categoryId);
    }

    // 排序邏輯
    if (selectedCategory === '明星商品') {
      // 明星商品按 featuredOrder 排序
      filtered.sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999));
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      // 按產品編號排序
      filtered.sort((a, b) => {
        const aNum = parseInt(a.productNumber?.split('-')[0] || '999');
        const bNum = parseInt(b.productNumber?.split('-')[0] || '999');
        if (aNum !== bNum) return aNum - bNum;
        const aSub = parseInt(a.productNumber?.split('-')[1] || '0');
        const bSub = parseInt(b.productNumber?.split('-')[1] || '0');
        return aSub - bSub;
      });
    }

    return filtered;
  }, [selectedCategory, sortBy]);

  // 當 URL 參數改變時更新分類
  React.useEffect(() => {
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // 切換分類時同步更新網址（用 replace 避免瀏覽紀錄爆量），
  // 這樣從商品詳情頁按「上一頁」才能正確回到剛剛選的那個分類，而不是回到沒有分類參數的初始狀態
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    navigate(`/products?category=${encodeURIComponent(cat)}`, { replace: true });
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      {/* 麵包屑導航 */}
      <div className="bg-white border-b" style={{ borderColor: "#E8E4E0" }}>
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm" style={{ color: "#9c8a76" }}>
            <button
              onClick={() => navigate('/')}
              className="hover:opacity-70 transition-opacity"
            >
              全部商品
            </button>
            <span>›</span>
            <span style={{ color: "#5a4632" }} className="font-medium">系列產品介紹</span>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 左側分類菜單（電腦版） */}
          <div className="hidden md:block">
            <div className="text-xs tracking-wider mb-4" style={{ color: "#9c8a76" }}>系列分類</div>
            <div className="flex flex-col gap-0.5">
              {DISPLAY_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className="text-left pl-3 pr-2 py-2.5 text-sm transition-all"
                    style={
                      isActive
                        ? {
                            borderLeft: "2px solid #C9A876",
                            background: "#FBF6EE",
                            color: "#8B6F47",
                            fontWeight: 700,
                          }
                        : {
                            borderLeft: "2px solid transparent",
                            color: "#6B6B6B",
                          }
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 右側內容區 */}
          <div className="md:col-span-3">
            {/* 手機版分類下拉選單 */}
            <div className="md:hidden mb-6">
              <div className="mb-2 text-xs tracking-wider" style={{ color: "#9c8a76" }}>選擇系列</div>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger
                  className="w-full h-12 text-sm font-medium transition-all"
                  style={{ border: "1px solid #E0D5C5", background: "#FBF6EE", color: "#5a4632" }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DISPLAY_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 頁面標題 */}
            <div className="mb-6">
              <div className="text-[11px] tracking-[2px] font-semibold mb-1.5" style={{ color: "#B59A8A" }}>
                FULL COLLECTION
              </div>
              <h1
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "#5a4632", fontFamily: "'Playfair Display', serif" }}
              >
                {selectedCategory}
              </h1>
            </div>

            {/* 系列介紹：主打功效與特色（圖示化，精簡文字） */}
            {SERIES_INTROS[selectedCategory] && (
              <div style={{ background: '#FFFFFF' }} className="-mx-4 px-4 py-14 mb-8">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-7">
                    <div className="text-[13px] font-semibold tracking-[3px] mb-1.5" style={{ color: '#B59A8A' }}>
                      SERIES HIGHLIGHTS
                    </div>
                    <h2
                      className="text-[22px] font-bold"
                      style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                    >
                      系列特色
                    </h2>
                  </div>

                  <div className="flex flex-wrap justify-center gap-x-9 gap-y-6 max-w-2xl mx-auto mb-7">
                    {SERIES_INTROS[selectedCategory].features.map((f, idx) => {
                      const Icon = SERIES_FEATURE_ICONS[f.icon] || Sparkles;
                      return (
                        <div key={idx} className="flex flex-col items-center text-center gap-2.5 w-[100px]">
                          <div
                            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: "#8B6F47" }}
                          >
                            <Icon className="w-5 h-5" style={{ color: "#fff" }} />
                          </div>
                          <span className="text-xs md:text-sm font-semibold leading-snug" style={{ color: "#5a4632" }}>
                            {f.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {SERIES_INTROS[selectedCategory].closing && (
                    <p
                      className="text-center text-sm md:text-base font-medium"
                      style={{ color: "#8B6F47", fontFamily: "'Playfair Display', serif" }}
                    >
                      「{SERIES_INTROS[selectedCategory].closing}」
                    </p>
                  )}

                  <div className="text-center mt-4">
                    <button
                      onClick={() => setShowFullIntro((prev) => !prev)}
                      className="inline-flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
                      style={{ color: "#9c7a3f" }}
                    >
                      {showFullIntro ? '收合說明' : '了解更多'}
                      <ChevronDown
                        className="w-3.5 h-3.5 transition-transform"
                        style={{ transform: showFullIntro ? 'rotate(180deg)' : 'none' }}
                      />
                    </button>
                  </div>

                  {showFullIntro && (
                    <div className="mt-4 pt-4 max-w-2xl mx-auto" style={{ borderTop: "1px solid #E8DCC8" }}>
                      <p className="text-sm leading-relaxed mb-4 text-center" style={{ color: "#6B6B6B" }}>
                        {SERIES_INTROS[selectedCategory].description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                        {SERIES_INTROS[selectedCategory].features.map((f, idx) => (
                          <div key={idx} className="flex gap-2 text-sm leading-relaxed">
                            <span className="flex-shrink-0" style={{ color: "#C9A876" }}>✦</span>
                            <span style={{ color: "#4a4038" }}>
                              <span className="font-semibold" style={{ color: "#8B6F47" }}>
                                {f.title}：
                              </span>
                              {f.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 真實顧客回饋（熨斗系列(小)/(大) 專屬，橫向可滑動） */}
            {currentTestimonials && (
              <div className="mb-8">
                <div className="text-center mb-5">
                  <div className="text-[11px] tracking-[2px] font-semibold mb-1.5" style={{ color: "#B59A8A" }}>
                    REAL RESULTS
                  </div>
                  <h2
                    className="text-xl md:text-2xl font-bold"
                    style={{ color: "#5a4632", fontFamily: "'Playfair Display', serif" }}
                  >
                    真實顧客回饋
                  </h2>
                  <p className="text-xs mt-2" style={{ color: "#B0A797" }}>熨斗系列真實使用心得，左右滑動看更多</p>
                </div>
                <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0" style={{ scrollSnapType: 'x mandatory' }}>
                  {currentTestimonials.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTestimonialPreviewIndex(idx)}
                      className="w-[220px] md:w-full flex-shrink-0 md:flex-shrink text-left rounded-xl overflow-hidden transition-transform hover:-translate-y-0.5"
                      style={{ border: '1px solid #E8E4E0', background: '#fff', scrollSnapAlign: 'start' }}
                    >
                      <div className="aspect-[3/4] overflow-hidden" style={{ background: '#F5F1ED' }}>
                        <ImageWithFallback
                          src={item.src}
                          fallbackSrc="/favicon.png"
                          alt={item.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                              style={{ background: '#F5F1ED', color: '#8B6F47' }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: '#8a7a68' }}>{item.caption}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 明星商品強打橫幅：膠原凝露 */}
            {selectedCategory === '明星商品' && (
              <div
                className="rounded-2xl overflow-hidden mb-8 grid grid-cols-1 md:grid-cols-2"
                style={{ border: '1px solid #E8DCC8' }}
              >
                <div className="aspect-[4/3] md:aspect-auto">
                  <ImageWithFallback
                    src="/collagen-gel-hero.jpg"
                    fallbackSrc="/favicon.png"
                    alt="膠原凝露 - 舒緩・修復・保濕王者"
                    className="w-full h-full object-cover object-left"
                  />
                </div>
                <div
                  className="p-7 md:p-10 flex flex-col justify-center"
                  style={{ background: 'linear-gradient(160deg, #FBF6EE, #F3E8D8)' }}
                >
                  <div className="text-[11px] tracking-[2px] font-semibold mb-2" style={{ color: '#9c7a3f' }}>
                    MONTHLY MUST-HAVE
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold mb-2"
                    style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                  >
                    膠原凝露
                  </h2>
                  <p className="text-sm font-medium mb-4" style={{ color: '#8B6F47' }}>
                    舒緩・修復・保濕王者
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['舒緩敏感', '修復受損', '深層保濕', '全臉全身皆可用'].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1.5 rounded-full font-medium"
                        style={{ background: 'rgba(255,255,255,0.6)', color: '#8B6F47' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('/product-detail?id=special-38&from=' + encodeURIComponent('明星商品'))}
                    className="inline-flex items-center gap-2 self-start text-sm font-semibold px-5 py-2.5 rounded-full transition-transform hover:scale-105"
                    style={{ background: '#8B6F47', color: '#fff' }}
                  >
                    查看詳情
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* 完整使用流程 + 整套提示橫幅 */}
            {USAGE_SEQUENCES[selectedCategory] && (
              <div style={{ background: '#FBF6EE' }} className="-mx-4 px-4 py-14 mb-8">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-7">
                    <div className="text-[13px] font-semibold tracking-[3px] mb-1.5" style={{ color: '#B59A8A' }}>
                      COMPLETE SET
                    </div>
                    <h3
                      className="text-[22px] font-bold mb-3"
                      style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                    >
                      整套使用效果最佳
                    </h3>
                    <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: '#6B6B6B' }}>
                      初次使用建議搭配全套完整護膚；後續可依肌膚狀況單品補貨。
                    </p>
                  </div>

                  <div className="text-xs font-semibold mb-4 text-center" style={{ color: "#8B6F47" }}>
                    使用順序 &amp; 用法
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-1 gap-y-4">
                    {USAGE_SEQUENCES[selectedCategory].steps.map((step, idx) => {
                      const product = PRODUCTS.find(
                        (p) => p.productNumber === step.productNumber && p.category === CATEGORY_MAP[selectedCategory]
                      );
                      const isLast = idx === USAGE_SEQUENCES[selectedCategory].steps.length - 1;
                      const isRowBreak = !isLast && (idx + 1) % 5 === 0;
                      return (
                        <React.Fragment key={idx}>
                          <div className="flex flex-col items-center text-center w-[84px]">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2"
                              style={{ background: "#5a4632", color: "#fff" }}
                            >
                              {step.step}
                            </div>
                            <div className="text-xs font-semibold" style={{ color: "#5a4632" }}>
                              {step.label || step.productNumber}
                            </div>
                            {product && (
                              <div className="text-[10px] leading-tight mt-0.5 line-clamp-2" style={{ color: "#9c8a76" }}>
                                {product.productTitle}
                              </div>
                            )}
                            {step.note && (
                              <div className="text-[10px] leading-tight mt-1" style={{ color: "#B59A8A" }}>
                                {step.note}
                              </div>
                            )}
                          </div>
                          {!isLast && (
                            <div className="flex items-center text-sm" style={{ color: "#D8CFC2" }}>
                              →
                            </div>
                          )}
                          {isRowBreak && <div className="hidden md:block basis-full h-0" />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 排序和視圖選項 */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger
                    className="w-40 h-9 text-xs rounded-full"
                    style={{ border: "1px solid #E8E4E0", color: "#6B6B6B" }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">最新上架</SelectItem>
                    <SelectItem value="price-low">價格低到高</SelectItem>
                    <SelectItem value="price-high">價格高到低</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 視圖切換（電腦版） */}
              <div className="hidden md:flex items-center gap-1.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className="p-2 rounded-full transition-colors"
                  style={
                    viewMode === 'grid'
                      ? { background: "#FBF6EE", color: "#8B6F47" }
                      : { background: "transparent", color: "#B0A797" }
                  }
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="p-2 rounded-full transition-colors"
                  style={
                    viewMode === 'list'
                      ? { background: "#FBF6EE", color: "#8B6F47" }
                      : { background: "transparent", color: "#B0A797" }
                  }
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 產品網格 */}
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-2 md:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden cursor-pointer relative transition-all hover:-translate-y-0.5"
                  style={{ border: "1px solid #E8E4E0", boxShadow: "none" }}
                  onClick={() => navigate(`/product-detail?id=${product.id}&from=${encodeURIComponent(selectedCategory)}`)}
                >
                  {/* 產品圖片 */}
                  <div className="aspect-square overflow-hidden relative" style={{ background: "#F5F1ED" }}>
                    <ImageWithFallback
                      src={product.image}
                      fallbackSrc="/favicon.png"
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                  </div>

                  {/* 產品信息 */}
                  <div className="p-4 text-center">
                    {/* 產品編號和名稱分兩行顯示 */}
                    <div className="mb-2">
                      {product.productNumber && (
                        <div className="text-sm md:text-base font-bold mb-0.5" style={{ color: "#8B6F47" }}>
                          {product.productNumber}
                        </div>
                      )}
                      <div className="text-sm md:text-base font-semibold line-clamp-2" style={{ color: "#3a332b" }}>
                        {product.productTitle}
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center mb-3">
                      {!!product.memberPrice && product.memberPrice < product.price && (
                        <span
                          className="text-xs mb-0.5"
                          style={{ color: "#B0A797" }}
                        >
                          原價 NT$ {product.price}
                        </span>
                      )}
                      <span
                        className="text-lg md:text-xl font-bold"
                        style={{ color: "#8B6F47" }}
                      >
                        NT$ {product.memberPrice || product.price}
                      </span>
                    </div>
                    {/* 福利標籤 */}
                    {product.benefits && product.benefits.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {product.benefits.filter(b => b).map((benefit) => (
                          <span
                            key={benefit}
                            className="px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ background: "#F5F1ED", color: "#8B6F47" }}
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* 分頁信息 */}
            {filteredProducts.length > 0 && (
              <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>
                  共 {filteredProducts.length} 筆相關商品
                  <br />
                  第 1 頁 / 共 1 頁
                </p>
              </div>
            )}

            {/* 無產品提示 */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">此分類暫無商品</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 放大預覽燈箱：真實顧客回饋 */}
      <Dialog open={testimonialPreviewIndex !== null} onOpenChange={(open) => { if (!open) setTestimonialPreviewIndex(null); }}>
        <DialogContent
          className="max-w-3xl w-[95vw] p-0 border-0 bg-transparent shadow-none flex items-center justify-center"
          showCloseButton={false}
        >
          {testimonialPreviewIndex !== null && currentTestimonials && (
            <div className="relative w-full flex items-center justify-center">
              <ImageWithFallback
                key={testimonialPreviewIndex}
                src={currentTestimonials[testimonialPreviewIndex].src}
                fallbackSrc="/favicon.png"
                alt={currentTestimonials[testimonialPreviewIndex].caption}
                className="max-h-[80vh] w-auto rounded-xl object-contain"
              />

              <button
                type="button"
                onClick={() => setTestimonialPreviewIndex(null)}
                className="absolute -top-3 -right-3 md:top-2 md:right-2 w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-md"
                style={{ color: '#5a4632' }}
              >
                <X className="w-5 h-5" />
              </button>

              {currentTestimonials.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showTestimonialPrev}
                    className="absolute left-1 md:-left-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-white/90 shadow-md"
                    style={{ color: '#5a4632' }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={showTestimonialNext}
                    className="absolute right-1 md:-right-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-white/90 shadow-md"
                    style={{ color: '#5a4632' }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-white/90"
                style={{ color: '#8a8a8a' }}
              >
                {testimonialPreviewIndex + 1} / {currentTestimonials.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
