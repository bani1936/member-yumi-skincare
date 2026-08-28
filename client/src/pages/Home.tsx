import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { Gift, Calculator, Sparkles, Users } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

export default function Home() {
  const [, navigate] = useLocation();

  const TOOL_CARDS = [
    {
      id: 'promotion',
      icon: <Gift className="w-7 h-7" />,
      image: '/promo-banner-newcustomer.jpg',
      subtitle: 'LATEST PROMOTION',
      title: '最新活動',
      description: '新會員消費滿額贈 UIS訂製化妝包｜還有更多好禮進行中',
      buttonText: '了解詳情',
      path: '/promotion',
      highlight: true,
    },
    {
      id: 'products',
      icon: <Sparkles className="w-7 h-7" />,
      subtitle: 'PRODUCTS',
      title: '全系列產品',
      description: '探索專屬保養，養出素顏雪白奶油肌',
      buttonText: '點我瀏覽',
      path: '/products',
      highlight: false,
    },
    {
      id: 'membership',
      icon: <Users className="w-7 h-7" />,
      subtitle: 'VIP BENEFITS',
      title: '會員制度',
      description: '專屬尊榮禮遇，解鎖更多會員權益',
      buttonText: '快速了解',
      path: '/membership',
      highlight: false,
    },
    {
      id: 'product-calculator',
      icon: <Calculator className="w-7 h-7" />,
      subtitle: 'PRICE ESTIMATE',
      title: '首購金額試算',
      description: '快速試算優惠，即刻展開專屬保養',
      buttonText: '快速計算',
      path: '/product-calculator',
      highlight: false,
    }
  ];

  const HEADING_FONT = "'Playfair Display', 'Noto Serif TC', serif";

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8' }}>

      {/* Hero 標題區 */}
      <section
        className="py-14 md:py-16 text-center px-4"
        style={{ background: 'linear-gradient(135deg, #F0EAE2, #F5F1ED)' }}
      >
        <div className="text-[11px] tracking-[2px] font-semibold mb-3" style={{ color: '#B59A8A' }}>
          PROFESSIONAL SKIN MANAGEMENT
        </div>
        <h1
          className="text-2xl md:text-3xl font-medium mb-3"
          style={{ color: '#5a4632', fontFamily: HEADING_FONT, fontWeight: 500 }}
        >
          Yumí 米米美學｜高端皮膚管理
        </h1>
        <p className="text-sm md:text-base" style={{ color: '#6B6B6B' }}>
          專屬您的產品導覽與會員服務中心
        </p>
      </section>

      <section className="py-14 md:py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {TOOL_CARDS.map((tool) => (
              <Card
                key={tool.id}
                className="h-full min-h-[260px] p-8 cursor-pointer group overflow-hidden transition-all hover:-translate-y-1 rounded-sm"
                style={
                  tool.highlight
                    ? {
                        background: 'linear-gradient(160deg, #FBF6EE, #F3E8D8)',
                        border: '1.5px solid #C9A876',
                        boxShadow: 'none',
                      }
                    : {
                        background: '#fff',
                        border: '1px solid #E8E4E0',
                        boxShadow: 'none',
                      }
                }
                onClick={() => navigate(tool.path)}
              >
                {tool.id === 'promotion' && tool.image ? (
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="-mx-8 -mt-8 mb-5 aspect-[16/9] overflow-hidden">
                      <ImageWithFallback
                        src={tool.image}
                        fallbackSrc="/favicon.png"
                        alt={tool.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center text-center flex-1">
                      <div
                        className="text-[11px] tracking-[1.5px] font-semibold mb-2"
                        style={{ color: '#9c7a3f' }}
                      >
                        {tool.subtitle}
                      </div>
                      <h3
                        className="text-xl md:text-2xl font-medium mb-3"
                        style={{ color: '#5a4632', fontFamily: HEADING_FONT, fontWeight: 500 }}
                      >
                        {tool.title}
                      </h3>
                      <p className="leading-relaxed text-sm md:text-base whitespace-pre-line" style={{ color: '#6B6B6B' }}>
                        {tool.description}
                      </p>
                    </div>
                  </div>
                ) : (
                <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
                  <div
                    className="mb-6 flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300"
                    style={
                      tool.highlight
                        ? { background: 'rgba(255,255,255,0.6)', color: '#8B6F47' }
                        : { background: '#F5F1ED', color: '#8B6F47' }
                    }
                  >
                    {tool.icon}
                  </div>

                  <div
                    className="text-[11px] tracking-[1.5px] font-semibold mb-2"
                    style={{ color: tool.highlight ? '#9c7a3f' : '#B59A8A' }}
                  >
                    {tool.subtitle}
                  </div>

                  <h3
                    className={`text-xl md:text-2xl font-medium ${tool.description ? 'mb-3' : ''}`}
                    style={{ color: '#5a4632', fontFamily: HEADING_FONT, fontWeight: 500 }}
                  >
                    {tool.title}
                  </h3>

                  {tool.description && (
                    <p className="leading-relaxed text-sm md:text-base whitespace-pre-line" style={{ color: '#6B6B6B' }}>
                      {tool.description}
                    </p>
                  )}
                </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-white py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center text-sm text-white/50">
            <p>Copyright © 2026 Yumí 米米美學｜高端皮膚管理</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
