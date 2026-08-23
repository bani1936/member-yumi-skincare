import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLocation } from 'wouter';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// 活動海報輪播（可左右滑動／點箭頭切換）— 之後有新活動海報，把圖放進 client/public/ 並在這裡增減即可。
// 橫式 Banner 統一比例約 8:3（對應設計稿 1920x720），輪播容器用固定比例 + object-cover 裁切呈現，
// 尚未做成橫版的海報暫時沿用原圖，裁切效果可能不完美，之後補齊橫版素材後直接替換 src 即可。
// detailSrc：點擊 Banner 後彈出的完整活動明細圖（贈品門檻、條件等），沒有的話點擊不會有反應。
const HERO_POSTERS: { src: string; alt: string; detailSrc?: string; detailAlt?: string }[] = [
  {
    src: "/promo-banner-newcustomer.jpg",
    alt: "August 新會員消費滿額贈 UIS訂製化妝包",
    detailSrc: "/promo-poster-newcustomer.png",
    detailAlt: "新會員消費滿額贈完整活動明細",
  },
  {
    src: "/promo-banner-pvexchange.jpg",
    alt: "點點成金，PV換好禮：年度集點活動",
    detailSrc: "/promo-detail-pvexchange.png",
    detailAlt: "點點成金 PV 集點活動完整明細（Q1~Q3 級距）",
  },
];

// UIS訂製化妝包實拍 — 之後把照片放進 client/public/，把檔名加進這個陣列即可自動顯示在下方相簿。
const GALLERY_IMAGES: string[] = [
  "/promo-gift-1.jpg",
  "/promo-gift-2.jpg",
  "/promo-gift-3.jpg",
  "/promo-gift-6.jpg",
];

// 安瓶保養組 4 款總覽 — 不論目前生效中的是哪個活動（新客滿額贈／集點贈…），
// 贈品都是這 4 款安瓶保養組其中之一，所以獨立做一組「款式總覽」相簿，
// 講解任何一個活動時都可以直接點開給客人看，不受活動檔期切換影響。
// 之後把照片放進 client/public/，檔名對應下面即可（可依實際照片再調整檔名）。
const AMPOULE_SET_IMAGES: { src: string; label: string }[] = [
  { src: "/ampoule-set-iron.jpg", label: "熨斗系列安瓶保養組" },
  { src: "/ampoule-set-dodouhao.jpg", label: "38都都好安瓶保養組" },
  { src: "/ampoule-set-cleansing.jpg", label: "58淨膚安瓶保養組" },
  { src: "/ampoule-set-brightening.jpg", label: "晶亮安瓶保養組" },
];

export default function Promotion() {
  const [, navigate] = useLocation();
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroDetailOpen, setHeroDetailOpen] = useState(false);

  // 自動輪播：每 2.5 秒切換下一張活動海報，持續循環，不會因為使用者操作而停下來
  useEffect(() => {
    if (HERO_POSTERS.length <= 1) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_POSTERS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);
  const touchStartX = useRef<number | null>(null);

  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [ampoulePreviewIndex, setAmpoulePreviewIndex] = useState<number | null>(null);

  const showHeroPrev = () => {
    setHeroIndex((heroIndex - 1 + HERO_POSTERS.length) % HERO_POSTERS.length);
  };
  const showHeroNext = () => {
    setHeroIndex((heroIndex + 1) % HERO_POSTERS.length);
  };
  const handleHeroTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleHeroTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 40) showHeroPrev();
    else if (deltaX < -40) showHeroNext();
    touchStartX.current = null;
  };

  const showPrev = () => {
    if (previewIndex === null) return;
    setPreviewIndex((previewIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  };
  const showNext = () => {
    if (previewIndex === null) return;
    setPreviewIndex((previewIndex + 1) % GALLERY_IMAGES.length);
  };

  const showAmpoulePrev = () => {
    if (ampoulePreviewIndex === null) return;
    setAmpoulePreviewIndex((ampoulePreviewIndex - 1 + AMPOULE_SET_IMAGES.length) % AMPOULE_SET_IMAGES.length);
  };
  const showAmpouleNext = () => {
    if (ampoulePreviewIndex === null) return;
    setAmpoulePreviewIndex((ampoulePreviewIndex + 1) % AMPOULE_SET_IMAGES.length);
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: '#FAFAF8' }}>
      {/* 導航欄 */}
      <nav className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b" style={{ borderColor: '#E8E4E0' }}>
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold" style={{ color: '#5a4632' }}>最新活動</h1>
        </div>
      </nav>

      {/* 活動海報輪播：橫版 Banner，容器改用寬版比例 */}
      <div className="container max-w-6xl mx-auto px-4 pt-8">
        <div
          className="relative overflow-hidden"
          style={{ border: '1px solid #E8E4E0', aspectRatio: '2 / 1' }}
          onTouchStart={handleHeroTouchStart}
          onTouchEnd={handleHeroTouchEnd}
        >
          <button
            type="button"
            onClick={() => HERO_POSTERS[heroIndex].detailSrc && setHeroDetailOpen(true)}
            aria-label="查看完整活動明細"
            className="block w-full h-full p-0 border-0"
            style={{ cursor: HERO_POSTERS[heroIndex].detailSrc ? 'pointer' : 'default' }}
          >
            <ImageWithFallback
              key={heroIndex}
              src={HERO_POSTERS[heroIndex].src}
              fallbackSrc="/favicon.png"
              alt={HERO_POSTERS[heroIndex].alt}
              className="w-full h-full object-cover block"
            />
          </button>

          {HERO_POSTERS.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {HERO_POSTERS.map((poster, idx) => (
                <button
                  key={poster.src}
                  type="button"
                  onClick={() => setHeroIndex(idx)}
                  aria-label={`切換到第 ${idx + 1} 張活動海報`}
                  className="rounded-full transition-all"
                  style={{
                    width: idx === heroIndex ? '18px' : '6px',
                    height: '6px',
                    background: idx === heroIndex ? '#8B6F47' : 'rgba(255,255,255,0.85)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 放大燈箱：活動完整明細圖 */}
      <Dialog open={heroDetailOpen} onOpenChange={setHeroDetailOpen}>
        <DialogContent
          className="max-w-2xl w-[95vw] p-0 border-0 bg-transparent shadow-none flex items-center justify-center"
          showCloseButton={false}
        >
          {HERO_POSTERS[heroIndex].detailSrc && (
            <div className="relative w-full flex items-center justify-center">
              <ImageWithFallback
                src={HERO_POSTERS[heroIndex].detailSrc}
                fallbackSrc="/favicon.png"
                alt={HERO_POSTERS[heroIndex].detailAlt || HERO_POSTERS[heroIndex].alt}
                className="max-h-[85vh] w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setHeroDetailOpen(false)}
                className="absolute -top-3 -right-3 md:top-2 md:right-2 w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-md"
                style={{ color: '#5a4632' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 安瓶保養組 4 款總覽（不受活動檔期切換影響，講解優惠時可直接點開給客人看） */}
      <div className="container max-w-4xl mx-auto px-4 mt-10">
        <div className="text-center mb-6">
          <div className="text-[11px] tracking-[2px] font-semibold mb-2" style={{ color: '#B59A8A' }}>
            AMPOULE SET OPTIONS
          </div>
          <h2
            className="text-xl md:text-2xl font-bold"
            style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
          >
            安瓶保養組 4 款總覽
          </h2>
          <p className="text-xs mt-2" style={{ color: '#B0A797' }}>各活動滿額贈的安瓶保養組皆從 4 款任選</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {AMPOULE_SET_IMAGES.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setAmpoulePreviewIndex(idx)}
              className="relative aspect-square overflow-hidden cursor-pointer transition-transform hover:-translate-y-0.5"
              style={{ border: '1px solid #E8E4E0', background: '#F5F1ED' }}
            >
              <ImageWithFallback
                src={item.src}
                fallbackSrc="/favicon.png"
                alt={item.label}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-[11px] md:text-xs font-medium text-center"
                style={{ background: 'rgba(90,70,50,0.72)', color: '#fff' }}
              >
                {item.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* UIS訂製化妝包實拍 */}
      {GALLERY_IMAGES.length > 0 && (
        <div className="container max-w-4xl mx-auto px-4 mt-10">
          <div className="text-center mb-6">
            <div className="text-[11px] tracking-[2px] font-semibold mb-2" style={{ color: '#B59A8A' }}>
              UIS POUCH PREVIEW
            </div>
            <h2
              className="text-xl md:text-2xl font-bold"
              style={{ color: '#5a4632', fontFamily: "'Playfair Display', serif" }}
            >
              UIS訂製化妝包實拍
            </h2>
            <p className="text-xs mt-2" style={{ color: '#B0A797' }}>點擊照片可放大預覽</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY_IMAGES.map((src, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPreviewIndex(idx)}
                className="aspect-square overflow-hidden cursor-pointer transition-transform hover:-translate-y-0.5"
                style={{ border: '1px solid #E8E4E0', background: '#F5F1ED' }}
              >
                <ImageWithFallback
                  src={src}
                  fallbackSrc="/favicon.png"
                  alt={`UIS訂製化妝包實拍 ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 放大預覽燈箱：UIS訂製化妝包實拍 */}
      <Dialog open={previewIndex !== null} onOpenChange={(open) => { if (!open) setPreviewIndex(null); }}>
        <DialogContent
          className="max-w-3xl w-[95vw] p-0 border-0 bg-transparent shadow-none flex items-center justify-center"
          showCloseButton={false}
        >
          {previewIndex !== null && (
            <div className="relative w-full flex items-center justify-center">
              <ImageWithFallback
                key={previewIndex}
                src={GALLERY_IMAGES[previewIndex]}
                fallbackSrc="/favicon.png"
                alt={`UIS訂製化妝包實拍 ${previewIndex + 1}`}
                className="max-h-[80vh] w-auto object-contain"
              />

              <button
                type="button"
                onClick={() => setPreviewIndex(null)}
                className="absolute -top-3 -right-3 md:top-2 md:right-2 w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-md"
                style={{ color: '#5a4632' }}
              >
                <X className="w-5 h-5" />
              </button>

              {GALLERY_IMAGES.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrev}
                    className="absolute left-1 md:-left-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-white/90 shadow-md"
                    style={{ color: '#5a4632' }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
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
                {previewIndex + 1} / {GALLERY_IMAGES.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 放大預覽燈箱：安瓶保養組總覽 */}
      <Dialog open={ampoulePreviewIndex !== null} onOpenChange={(open) => { if (!open) setAmpoulePreviewIndex(null); }}>
        <DialogContent
          className="max-w-3xl w-[95vw] p-0 border-0 bg-transparent shadow-none flex items-center justify-center"
          showCloseButton={false}
        >
          {ampoulePreviewIndex !== null && (
            <div className="relative w-full flex items-center justify-center">
              <ImageWithFallback
                key={ampoulePreviewIndex}
                src={AMPOULE_SET_IMAGES[ampoulePreviewIndex].src}
                fallbackSrc="/favicon.png"
                alt={AMPOULE_SET_IMAGES[ampoulePreviewIndex].label}
                className="max-h-[80vh] w-auto object-contain"
              />

              <button
                type="button"
                onClick={() => setAmpoulePreviewIndex(null)}
                className="absolute -top-3 -right-3 md:top-2 md:right-2 w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-md"
                style={{ color: '#5a4632' }}
              >
                <X className="w-5 h-5" />
              </button>

              {AMPOULE_SET_IMAGES.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showAmpoulePrev}
                    className="absolute left-1 md:-left-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-white/90 shadow-md"
                    style={{ color: '#5a4632' }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={showAmpouleNext}
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
                {AMPOULE_SET_IMAGES[ampoulePreviewIndex].label}（{ampoulePreviewIndex + 1} / {AMPOULE_SET_IMAGES.length}）
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
