import { useLocation } from 'wouter';
import { ChevronLeft, GlassWater, Clock, Calendar, Feather, Flower2 } from 'lucide-react';
import { PRODUCTS } from '@/lib/products';

const HOW_TO_USE_ICONS = { cup: GlassWater, clock: Clock, calendar: Calendar } as const;
import { USAGE_SEQUENCES } from '@/lib/usage-sequences';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import * as React from 'react';

const CATEGORY_LABELS: Record<string, string> = {
  'all': '明星商品',
  'micro-lifting-small': '熨斗系列(小)',
  'micro-lifting-large': '熨斗系列(大)',
  'skin-care': '都都好系列',
  'cleansing': '淨膚系列',
  'brightening': '晶亮系列',
  'elasticity': 'Q彈精緻系列',
  'special': '特殊系列',
  'bust': '美胸系列',
  'essential-oil': '精油系列',
  'cleaning': '清潔系列',
};

// 全站共用促銷活動明細（商品詳情頁點擊促銷提示行時彈出）
const PROMO_CAMPAIGNS = [
  {
    id: 'newcustomer',
    label: '【新客滿額贈】滿額加贈安瓶保養組，買越多送越多！',
    title: '【新客滿額贈】滿額加贈安瓶保養組',
    date: '加入會員後第一筆訂單於一個月內累積滿額',
    items: [
      '滿額贈｜訂單滿 30,000 PV 送 安瓶保養組2組',
      '滿額贈｜訂單滿 120,000 PV 送 安瓶保養組10組（達成任務再加贈10組）',
      '滿額贈｜訂單滿 NT$ 298,000 送 安瓶保養組20組（達成任務再加贈20組）',
    ],
  },
  {
    id: 'points',
    label: '【2026 年集點贈】年度累積 PV 點數滿額贈！安瓶保養組及熱銷第一名膠原凝露',
    title: '【2026 年集點贈】點點成金，PV換好禮！',
    date: '2026/1/1－2026/12/31',
    items: [
      '集點贈｜累積滿 40,000 PV 送 安瓶保養組1組',
      '集點贈｜累積滿 80,000 PV 送 安瓶保養組1組、2250PV產品任選1瓶',
      '集點贈｜滿 200,000 PV 送 安瓶保養組3組、2250PV產品任選1瓶、38修護柔敏膠原凝露1瓶',
    ],
  },
  {
    id: 'store',
    label: '【門市限定】UIS訂製化妝包滿額贈',
    title: '【米米門市限定】UIS訂製化妝包滿額贈',
    date: '數量有限，送完為止！',
    items: [
      '滿額贈｜新會員首筆訂單滿 30,000 PV 送 UIS訂製化妝包1個',
    ],
  },
];

export default function ProductDetail() {
  const [, navigate] = useLocation();
  const productId = new URLSearchParams(window.location.search).get('id');
  const product = PRODUCTS.find(p => p.id === productId);
  const [activeCampaign, setActiveCampaign] = React.useState<typeof PROMO_CAMPAIGNS[number] | null>(null);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">產品未找到</h1>
          <Button onClick={() => navigate('/products')}>返回產品列表</Button>
        </div>
      </div>
    );
  }

  const memberPrice = product.memberPrice || product.price * 0.85;
  const discount = Math.round(((product.price - memberPrice) / product.price) * 100);

  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : (product.image ? [product.image] : []);
  const [activeImage, setActiveImage] = React.useState(0);
  const showArrows = galleryImages.length > 1;
  const goPrev = () => setActiveImage((i) => (i - 1 + galleryImages.length) % galleryImages.length);
  const goNext = () => setActiveImage((i) => (i + 1) % galleryImages.length);

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* 麵包屑導航 */}
      <div className="bg-white border-b" style={{ borderColor: '#E8E4E0' }}>
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm flex-wrap" style={{ color: '#9c8a76' }}>
            <button onClick={() => navigate('/')} className="hover:opacity-70 transition-opacity">
              全部商品
            </button>
            <span>›</span>
            <button onClick={() => navigate('/products')} className="hover:opacity-70 transition-opacity">
              系列產品介紹
            </button>
            {CATEGORY_LABELS[product.category] && (
              <>
                <span>›</span>
                <button
                  onClick={() => navigate(`/products?category=${encodeURIComponent(CATEGORY_LABELS[product.category])}`)}
                  className="hover:opacity-70 transition-opacity"
                >
                  {CATEGORY_LABELS[product.category]}
                </button>
              </>
            )}
            <span>›</span>
            <span style={{ color: '#5a4632' }} className="font-medium">
              {product.productNumber ? `${product.productNumber} ` : ''}{product.productTitle.replace('(小)', '').replace('(大)', '').trim()}
            </span>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,380px)_1fr] gap-8 mb-8 items-start">
          {/* 左側：產品圖片輪播 */}
          <div className="w-full">
            <div className="relative w-full aspect-square bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
              {galleryImages.length > 0 ? (
                <ImageWithFallback
                  src={galleryImages[activeImage]}
                  fallbackSrc="/favicon.png"
                  alt={product.productTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">{product.benefits?.[0] || '✨'}</div>
              )}
              {showArrows && (
                <>
                  <button
                    onClick={goPrev}
                    aria-label="上一張"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 flex items-center justify-center"
                  >
                    <ChevronLeft className="w-4 h-4" style={{ color: '#5a4632' }} />
                  </button>
                  <button
                    onClick={goNext}
                    aria-label="下一張"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 flex items-center justify-center rotate-180"
                  >
                    <ChevronLeft className="w-4 h-4" style={{ color: '#5a4632' }} />
                  </button>
                </>
              )}
            </div>
            {showArrows && (
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className="aspect-square rounded-md overflow-hidden bg-secondary"
                    style={{ border: idx === activeImage ? '1.5px solid #8B6F47' : '1px solid #E3DCD0' }}
                  >
                    <ImageWithFallback
                      src={img}
                      fallbackSrc="/favicon.png"
                      alt={`${product.productTitle} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2 w-full mt-4">
              <span className="flex-1 px-3 py-2 bg-secondary rounded text-center text-sm font-medium">
                {product.series}
              </span>
              <span className="flex-1 px-3 py-2 bg-secondary rounded text-center text-sm font-medium">
                {product.volume || '容量未標示'}
              </span>
            </div>
          </div>

          {/* 右側：產品信息 */}
          <div className="flex flex-col">
            {/* 產品編號與名稱 */}
            <div className="mb-4">
              {product.productNumber && (
                <h2 className="text-3xl font-bold mb-2" style={{ color: '#8b6f47' }}>
                  {product.productNumber}
                </h2>
              )}
              <h3 className="text-2xl font-semibold mb-2">{product.productTitle}</h3>
              <p className="text-base text-muted-foreground">{product.description}</p>
            </div>

            {product.intro && (
              <>
                <div className="border-t border-border my-4" />
                <div className="mb-4">
                  <div className="text-base font-medium mb-2" style={{ color: '#5a4632' }}>簡介</div>
                  <p className="text-base leading-loose text-muted-foreground whitespace-pre-line">
                    {product.intro}
                  </p>
                </div>
              </>
            )}

            {/* 全站購物提示 */}
            <div
              className="mb-4 px-4 py-2.5 rounded-none"
              style={{ background: '#FBF6EE', borderLeft: '3px solid #8B6F47' }}
            >
              <div className="text-sm font-bold mb-1.5" style={{ color: '#C0527A' }}>全館活動</div>
              <div className="text-sm leading-loose" style={{ color: '#5a4632' }}>全館單筆訂單滿 $3,000 免運</div>
              {PROMO_CAMPAIGNS.map((campaign) => (
                <div
                  key={campaign.id}
                  onClick={() => setActiveCampaign(campaign)}
                  className="text-sm leading-loose cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ color: '#5a4632', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                >
                  {campaign.label}
                </div>
              ))}
            </div>

            {/* 活動明細彈窗 */}
            {activeCampaign && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center px-4"
                style={{ background: 'rgba(0,0,0,0.4)' }}
                onClick={() => setActiveCampaign(null)}
              >
                <div
                  className="bg-white rounded-xl p-6 max-w-md w-full"
                  style={{ border: '1px solid #E8DCC8', boxShadow: '0 12px 40px rgba(0,0,0,0.18)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between mb-3.5">
                    <div>
                      <div className="text-base font-bold" style={{ color: '#5a4632' }}>
                        {activeCampaign.title}
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#B0A797' }}>
                        {activeCampaign.date}
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveCampaign(null)}
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: '#F5F1ED', color: '#8B6F47' }}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-sm leading-loose" style={{ color: '#6B6B6B' }}>
                    {activeCampaign.items.map((item, idx) => (
                      <div key={idx}>．{item}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 價格區塊 */}
            <Card className="p-6 mb-6 bg-secondary/50">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">原價</div>
                  <div
                    className="text-xl font-bold text-muted-foreground"
                    style={{ fontFamily: "'Spectral', 'Noto Serif TC', serif" }}
                  >
                    ${product.price}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">會員價</div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: '#8b6f47', fontFamily: "'Spectral', 'Noto Serif TC', serif" }}
                  >
                    ${Math.round(memberPrice)}
                  </div>
                  {discount > 0 && (
                    <div className="text-xs text-accent font-semibold">
                      省 {discount}%
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">PV 點數</div>
                  <div className="text-xl font-bold">{product.pv || 0}</div>
                </div>
              </div>
            </Card>


          </div>
        </div>

        {/* 旗艦故事頁：開場橫幅 + 全方位守護 + BENEFITS */}
        {product.storySections && (
          <div className="mb-12 md:mb-16">
            {product.storySections.heroImage && (
              <div className="-mx-4 md:mx-0 mb-12 md:mb-16 md:rounded-2xl overflow-hidden">
                <ImageWithFallback
                  src={product.storySections.heroImage}
                  fallbackSrc="/favicon.png"
                  alt={product.productTitle}
                  className="w-full h-auto block"
                />
              </div>
            )}

            {product.storySections.intro && (
              <section className="mb-12 md:mb-16 text-center max-w-4xl mx-auto px-2">
                <h2
                  className="text-2xl md:text-3xl font-bold mb-10 leading-snug"
                  style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                >
                  {product.storySections.intro.title}
                </h2>
                <div
                  className="rounded-2xl overflow-hidden mb-10"
                  style={{ border: '1px solid #E8DCC8', boxShadow: '0 2px 12px rgba(139,111,71,0.12)' }}
                >
                  <ImageWithFallback
                    src={product.storySections.intro.gridImage}
                    fallbackSrc="/favicon.png"
                    alt={product.storySections.intro.title}
                    className="w-full h-auto block"
                  />
                </div>
                {product.storySections.intro.warning && (
                  <div
                    className="inline-block rounded-full px-5 py-3 text-xs md:text-sm font-medium"
                    style={{ background: '#FBEDE9', color: '#B5654A' }}
                  >
                    {product.storySections.intro.warning}
                  </div>
                )}
              </section>
            )}

            {product.storySections.keyFormulas && product.storySections.keyFormulas.items.length > 0 && (
              <section className="mb-12 md:mb-16 max-w-2xl mx-auto px-2">
                <h2
                  className="text-2xl md:text-3xl font-bold text-center mb-8"
                  style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                >
                  三大關鍵配方
                </h2>
                {product.storySections.keyFormulas.image && (
                  <div
                    className="rounded-2xl overflow-hidden mb-8"
                    style={{ border: '1px solid #E8DCC8' }}
                  >
                    <ImageWithFallback
                      src={product.storySections.keyFormulas.image}
                      fallbackSrc="/favicon.png"
                      alt="三大關鍵配方"
                      className="w-full h-auto block"
                    />
                  </div>
                )}
                <div className="space-y-3">
                  {product.storySections.keyFormulas.items.map((f, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl p-5 text-center"
                      style={{ border: '1px solid #E8DCC8', background: '#FBF6EE' }}
                    >
                      <div className="text-sm font-bold mb-1" style={{ color: '#5a4632' }}>
                        {f.label} {f.title}
                      </div>
                      <div className="text-xs" style={{ color: '#8a7960' }}>
                        {f.tags}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {product.storySections.clinicalStats && product.storySections.clinicalStats.length > 0 && (
              <section className="mb-12 md:mb-16 max-w-2xl mx-auto px-2">
                <h2
                  className="text-2xl md:text-3xl font-bold text-center mb-8"
                  style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                >
                  科學實證
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {product.storySections.clinicalStats.map((s, idx) => (
                    <div key={idx} className="rounded-2xl p-4 text-center" style={{ background: '#F5F1ED' }}>
                      <div className="text-xl md:text-2xl font-bold mb-1" style={{ color: '#B5654A' }}>
                        {s.value}
                      </div>
                      <div className="text-xs" style={{ color: '#8a7960' }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {product.storySections.howToUse && product.storySections.howToUse.length > 0 && (
              <section className="mb-12 md:mb-16 max-w-2xl mx-auto px-2">
                <h2
                  className="text-2xl md:text-3xl font-bold text-center mb-8"
                  style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                >
                  使用方法
                </h2>
                <div className="flex justify-center gap-10 md:gap-16">
                  {product.storySections.howToUse.map((h, idx) => {
                    const Icon = HOW_TO_USE_ICONS[h.icon] || GlassWater;
                    return (
                      <div key={idx} className="text-center">
                        <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: '#8B6F47' }} />
                        <div className="text-xs" style={{ color: '#5a4632' }}>
                          {h.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {product.instructions && (
                  <p className="text-sm text-center leading-relaxed mt-8" style={{ color: '#6B6B6B' }}>
                    {product.instructions}
                  </p>
                )}
              </section>
            )}

            {product.storySections.howToUse && product.usageTips && product.usageTips.length > 0 && (
              <section className="mb-12 md:mb-16 max-w-2xl mx-auto px-2">
                <h2
                  className="text-2xl md:text-3xl font-bold text-center mb-8"
                  style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                >
                  使用小提醒
                </h2>
                <div className="space-y-3">
                  {product.usageTips.map((tip, idx) => (
                    <div key={idx} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>
                      <span className="flex-shrink-0" style={{ color: '#C9A876' }}>✦</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {product.storySections.ingredientsSection && product.storySections.ingredientsSection.items.length > 0 && (
              <section className="mb-12 md:mb-16 max-w-3xl mx-auto">
                <div className="text-center mb-10">
                  <div className="text-[11px] tracking-[3px] font-semibold mb-2" style={{ color: '#B59A8A' }}>
                    INGREDIENTS
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold"
                    style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                  >
                    精簡有效的配方
                  </h2>
                </div>
                <div className="space-y-12 md:space-y-16">
                  {product.storySections.ingredientsSection.items.map((item, idx) => (
                    <div key={idx}>
                      <h3
                        className="text-lg md:text-xl font-bold mb-4"
                        style={{ color: '#5a4632' }}
                      >
                        {item.name}
                      </h3>
                      <div
                        className="rounded-2xl overflow-hidden mb-5 aspect-video"
                        style={{ border: '1px solid #E8DCC8' }}
                      >
                        <ImageWithFallback
                          src={item.image}
                          fallbackSrc="/favicon.png"
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm md:text-[15px] leading-relaxed" style={{ color: '#6B6B6B' }}>
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {product.storySections.benefits && product.storySections.benefits.length > 0 && (
              <section>
                <div className="text-center mb-8">
                  <div className="text-[11px] tracking-[3px] font-semibold mb-2" style={{ color: '#B59A8A' }}>
                    BENEFITS
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold"
                    style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                  >
                    真實使用，看得見的改變
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {product.storySections.benefits.map((b, idx) => (
                    <div key={idx} className="text-center">
                      <div className="rounded-2xl overflow-hidden mb-5 aspect-[4/5]">
                        <ImageWithFallback
                          src={b.image}
                          fallbackSrc="/favicon.png"
                          alt={b.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-bold mb-3" style={{ color: '#5a4632' }}>
                        {b.title}
                      </h3>
                      <ul className="space-y-1.5 inline-block text-left">
                        {b.points.map((pt, i) => (
                          <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#6B6B6B' }}>
                            <span className="flex-shrink-0" style={{ color: '#C9A876' }}>✦</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {product.storySections.faqs && product.storySections.faqs.length > 0 && (
              <section className="mb-12 md:mb-16 max-w-2xl mx-auto px-2">
                <h2
                  className="text-2xl md:text-3xl font-bold text-center mb-8"
                  style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                >
                  常見問題
                </h2>
                <div style={{ borderTop: '1px solid #E8E4E0' }}>
                  {product.storySections.faqs.map((f, idx) => (
                    <div key={idx} className="py-4" style={{ borderBottom: '1px solid #E8E4E0' }}>
                      <div className="text-sm font-semibold mb-1.5" style={{ color: '#5a4632' }}>
                        {f.q}
                      </div>
                      <div className="text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>
                        {f.a}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {product.storySections.specs && product.storySections.specs.length > 0 && (
              <section className="mb-12 md:mb-16 max-w-2xl mx-auto px-2">
                <h2
                  className="text-2xl md:text-3xl font-bold text-center mb-8"
                  style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                >
                  產品規格
                </h2>
                <table className="w-full text-sm">
                  <tbody>
                    {product.storySections.specs.map((s, idx) => (
                      <tr key={idx} style={{ borderTop: idx === 0 ? 'none' : '1px solid #E8E4E0' }}>
                        <td className="py-2.5" style={{ color: '#8a7960' }}>
                          {s.label}
                        </td>
                        <td className="py-2.5 text-right font-medium" style={{ color: '#5a4632' }}>
                          {s.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {product.storySections.fullIngredients && product.storySections.fullIngredients.length > 0 && (
              <section className="mb-12 md:mb-16 max-w-2xl mx-auto px-2">
                <h2
                  className="text-2xl md:text-3xl font-bold text-center mb-8"
                  style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                >
                  全成分
                </h2>
                <div className="flex flex-wrap gap-2 justify-center">
                  {product.storySections.fullIngredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{ background: '#FBF6EE', color: '#8B6F47', border: '1px solid #E8DCC8' }}
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {product.precautions && product.precautions.length > 0 && (
              <section className="mb-12 md:mb-16 max-w-2xl mx-auto px-2">
                <h2
                  className="text-2xl md:text-3xl font-bold text-center mb-8"
                  style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                >
                  注意事項
                </h2>
                <div className="space-y-3">
                  {product.precautions.map((note, idx) => (
                    <div key={idx} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>
                      <span className="flex-shrink-0" style={{ color: '#C9A876' }}>✦</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {product.storage && (
              <section className="max-w-2xl mx-auto px-2">
                <h2
                  className="text-2xl md:text-3xl font-bold text-center mb-8"
                  style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                >
                  保存方式
                </h2>
                <p className="text-sm text-center leading-relaxed" style={{ color: '#6B6B6B' }}>
                  {product.storage}
                </p>
              </section>
            )}
          </div>
        )}

        {/* 詳細信息 - 交替色塊、置中排版 */}
        {(() => {
          let blockIdx = 0;
          const nextBg = () => (blockIdx++ % 2 === 0 ? '#FFFFFF' : '#FBF6EE');
          return (
            <>
              {/* 完整使用流程 + 整套提示（併入交替色塊，統一風格） */}
              {USAGE_SEQUENCES[product.series] && (
                <div style={{ background: nextBg() }} className="py-14 px-4 max-w-4xl mx-auto">
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
                      {product.productNumber === '7號' ? (
                        '7號 活膚煥采亮顏乳 可搭配在任一系列保養的最後一道，作為日常防塵防曬使用'
                      ) : (
                        '初次使用建議搭配全套完整護膚；後續可依肌膚狀況單品補貨。'
                      )}
                    </p>
                  </div>

                  <div className="text-xs font-semibold mb-4 text-center" style={{ color: '#8B6F47' }}>
                    使用順序 &amp; 用法
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-1 gap-y-4">
                    {USAGE_SEQUENCES[product.series].steps.map((step, idx) => {
                      const stepProduct = PRODUCTS.find(
                        (p) => p.productNumber === step.productNumber && p.category === product.category
                      );
                      const isCurrent = step.productNumber === product.productNumber;
                      const isLast = idx === USAGE_SEQUENCES[product.series].steps.length - 1;
                      const isRowBreak = !isLast && (idx + 1) % 5 === 0;
                      return (
                        <React.Fragment key={idx}>
                          <div className="flex flex-col items-center text-center w-[84px]">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2"
                              style={
                                isCurrent
                                  ? { background: '#C9A876', color: '#fff', boxShadow: '0 0 0 3px #F3E8D8' }
                                  : { background: '#5a4632', color: '#fff' }
                              }
                            >
                              {step.step}
                            </div>
                            <div className="text-xs font-semibold" style={{ color: isCurrent ? '#9c7a3f' : '#5a4632' }}>
                              {step.label || step.productNumber}
                            </div>
                            {stepProduct && (
                              <div className="text-[10px] leading-tight mt-0.5 line-clamp-2" style={{ color: '#9c8a76' }}>
                                {stepProduct.productTitle}
                              </div>
                            )}
                            {step.note && (
                              <div className="text-[10px] leading-tight mt-1" style={{ color: '#B59A8A' }}>
                                {step.note}
                              </div>
                            )}
                          </div>
                          {!isLast && (
                            <div className="flex items-center text-sm" style={{ color: '#D8CFC2' }}>
                              →
                            </div>
                          )}
                          {isRowBreak && <div className="hidden md:block basis-full h-0" />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 產品用途（旗艦故事頁不顯示，內容已在故事區塊中呈現） */}
              {!product.storySections && (
                <div style={{ background: nextBg() }} className="py-14 px-4 max-w-4xl mx-auto">
                  <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-6">
                    <div className="text-[13px] font-semibold tracking-[3px] mb-1.5" style={{ color: '#B59A8A' }}>
                      BENEFITS
                    </div>
                    <h3
                      className="text-[22px] font-bold"
                      style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                    >
                      產品用途
                    </h3>
                  </div>
                  {product.benefitCards && product.benefitCards.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                      {product.benefitCards.map((card, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg p-6 text-center flex flex-col justify-center"
                          style={{ background: '#FBF6EE', border: '1px solid #E8DCC8' }}
                        >
                          <div className="text-lg font-semibold mb-2" style={{ color: '#5a4632' }}>
                            {card.title}
                          </div>
                          <div className="text-base leading-relaxed" style={{ color: '#6B6B6B' }}>
                            {card.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="max-w-lg mx-auto text-center">
                    <p
                      className="leading-relaxed whitespace-pre-wrap"
                      style={{
                        color: '#4a4038',
                        fontSize: product.usageModes ? '19px' : '16px',
                        fontWeight: product.usageModes ? 600 : 400,
                        fontFamily: product.usageModes ? "'Playfair Display', serif" : 'inherit',
                        lineHeight: product.usageModes ? 1.7 : 1.75,
                      }}
                    >
                      {product.usage || product.description}
                    </p>
                    </div>
                  )}
                  </div>
                </div>
              )}

              {/* 適用對象（旗艦故事頁不顯示） */}
              {!product.storySections && product.forYou && product.forYou.length > 0 && (
                <div style={{ background: nextBg() }} className="py-14 px-4 max-w-4xl mx-auto">
                  <div className="max-w-lg mx-auto text-center">
                    <div className="text-[13px] font-semibold tracking-[3px] mb-1.5" style={{ color: '#B59A8A' }}>
                      FOR YOU
                    </div>
                    <h3
                      className="text-[22px] font-bold mb-5"
                      style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                    >
                      適用對象
                    </h3>
                    <div className="inline-block text-left space-y-2.5">
                      {product.forYou.map((item, idx) => (
                        <div key={idx} className="flex gap-2.5 text-base leading-relaxed" style={{ color: '#6B6B6B' }}>
                          <span className="flex-shrink-0" style={{ color: '#C9A876' }}>✦</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 質地與使用感（旗艦故事頁不顯示） */}
              {!product.storySections && product.experience && product.experience.length > 0 && (
                <div style={{ background: nextBg() }} className="py-14 px-4 max-w-4xl mx-auto">
                  <div className="text-center mb-6">
                    <div className="text-[13px] font-semibold tracking-[3px] mb-1.5" style={{ color: '#B59A8A' }}>
                      EXPERIENCE
                    </div>
                    <h3
                      className="text-[22px] font-bold"
                      style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                    >
                      質地與使用感
                    </h3>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-between gap-6 md:gap-10 max-w-2xl mx-auto">
                    {product.experience.map((item, idx) => {
                      const Icon = item.icon === 'flower' ? Flower2 : Feather;
                      return (
                        <div key={idx} className="flex-1 min-w-[140px] max-w-[280px] mx-auto text-center">
                          <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: '#8B6F47' }} />
                          <div className="text-lg font-semibold mb-1" style={{ color: '#5a4632' }}>
                            {item.title}
                          </div>
                          <div className="text-base leading-relaxed" style={{ color: '#6B6B6B' }}>
                            {item.description}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 主要成分（旗艦故事頁不顯示，內容已在 INGREDIENTS 故事區塊中呈現） */}
              {!product.storySections && (
                <div style={{ background: nextBg() }} className="py-14 px-4 max-w-4xl mx-auto">
                  <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-5">
                    <div className="text-[13px] font-semibold tracking-[3px] mb-1.5" style={{ color: '#B59A8A' }}>
                      INGREDIENTS
                    </div>
                    <h3
                      className="text-[22px] font-bold"
                      style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                    >
                      主要成分
                    </h3>
                  </div>

                  {product.ingredients && (
                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center mb-5 max-w-3xl mx-auto">
                      {product.ingredients.split('、').map((ing, idx) => (
                        <span
                          key={idx}
                          className="text-base px-3 py-1.5 rounded-full font-medium whitespace-nowrap"
                          style={{ background: '#FFFFFF', color: '#8B6F47', border: '1px solid #E8DCC8' }}
                        >
                          {ing.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {product.precautions && product.precautions.length > 0 && (
                    <div className="max-w-lg mx-auto text-center">
                      <div
                        className="inline-block text-left space-y-3 pt-4 mt-2"
                        style={{ borderTop: '1px solid #E8DCC8' }}
                      >
                        <div className="text-xs font-semibold text-center" style={{ color: '#B59A8A' }}>
                          成分小知識
                        </div>
                        {product.precautions.map((fact, idx) => (
                          <div key={idx} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>
                            <span className="flex-shrink-0" style={{ color: '#C9A876' }}>✦</span>
                            <span>{fact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              )}

              {/* 使用方法（旗艦故事頁不顯示，01/02/03 已在故事區塊中呈現） */}
              {!product.storySections && (
                product.usageModes && product.usageModes.length > 0 ? (
                  <div style={{ background: nextBg() }} className="py-14 px-4 max-w-4xl mx-auto">
                    <div className="max-w-4xl mx-auto">
                      <div className="text-center mb-8">
                        <div className="text-[13px] font-semibold tracking-[3px] mb-1.5" style={{ color: '#B59A8A' }}>
                          HOW TO USE
                        </div>
                        <h3
                          className="text-[22px] font-bold"
                          style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                        >
                          使用方法
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {product.usageModes.map((mode, idx) => (
                          <Card
                            key={idx}
                            className="p-6 md:p-8"
                            style={{ background: '#FFFFFF', border: '1px solid #E8DCC8' }}
                          >
                            <div className="flex gap-5 md:gap-7">
                              <div
                                className="flex-shrink-0 text-3xl md:text-4xl font-bold"
                                style={{ color: '#D9C6A5', fontFamily: "'Playfair Display', serif" }}
                              >
                                {mode.label}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4
                                  className="text-lg md:text-xl font-bold mb-2.5"
                                  style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                                >
                                  {mode.title}
                                </h4>
                                <p className="text-sm leading-relaxed mb-3" style={{ color: '#6B6B6B' }}>
                                  {mode.description}
                                </p>
                                {mode.tags && mode.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {mode.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="text-xs px-3 py-1.5 rounded-full font-medium"
                                        style={{ background: '#FBF6EE', color: '#8B6F47' }}
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {mode.note && (
                                  <div className="text-xs" style={{ color: '#B59A8A' }}>
                                    ⚠️ {mode.note}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: nextBg() }} className="py-14 px-4 max-w-4xl mx-auto">
                    <div className="max-w-4xl mx-auto">
                    <div className="max-w-lg mx-auto text-center">
                      <div className="text-[13px] font-semibold tracking-[3px] mb-1.5" style={{ color: '#B59A8A' }}>
                        HOW TO USE
                      </div>
                      <h3
                        className="text-[22px] font-bold mb-5"
                        style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                      >
                        使用方法
                      </h3>
                      <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: '#6B6B6B' }}>
                        {product.instructions || '清潔後，取適量塗抹於全身肌膚乾燥處。'}
                      </p>
                    </div>
                    </div>
                  </div>
                )
              )}

              {/* 使用小提醒（旗艦故事頁不顯示，內容已在故事區塊中呈現） */}
              {!product.storySections && product.usageTips && product.usageTips.length > 0 && (
                <div style={{ background: nextBg() }} className="py-14 px-4 max-w-4xl mx-auto">
                  <div className="max-w-4xl mx-auto">
                  <div className="max-w-lg mx-auto text-center">
                    <div className="text-[13px] font-semibold tracking-[3px] mb-1.5" style={{ color: '#B59A8A' }}>
                      TIPS
                    </div>
                    <h3
                      className="text-[22px] font-bold mb-5"
                      style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                    >
                      使用小提醒
                    </h3>
                    <div className="inline-block text-left space-y-3">
                      {product.usageTips.map((tip, idx) => (
                        <div key={idx} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>
                          <span className="flex-shrink-0" style={{ color: '#C9A876' }}>✦</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  </div>
                </div>
              )}

              {/* 保存方式（旗艦故事頁不顯示，內容已在故事區塊中呈現） */}
              {!product.storySections && (
                <div style={{ background: nextBg() }} className="py-14 px-4 max-w-4xl mx-auto">
                  <div className="max-w-4xl mx-auto">
                  <div className="max-w-lg mx-auto text-center">
                    <div className="text-[13px] font-semibold tracking-[3px] mb-1.5" style={{ color: '#B59A8A' }}>
                      STORAGE &amp; CAUTION
                    </div>
                    <h3
                      className="text-[22px] font-bold mb-5"
                      style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
                    >
                      保存方式
                    </h3>
                    <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: '#6B6B6B' }}>
                      {product.storage || '存放於陰涼乾燥處。避免陽光直射及潮濕環境。'}
                    </p>
                  </div>
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
