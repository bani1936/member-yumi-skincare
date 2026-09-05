import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { ChevronLeft, ChevronDown, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PRODUCTS } from '@/lib/products';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

interface CartItem {
  productId: string;
  quantity: number;
}

const TRIAL_SERIES_NAME = '首次體驗加購';
const TRIAL_SERIES_MAX_QTY = 1;

export default function ProductCalculator() {
  const [, navigate] = useLocation();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        console.error('Failed to parse cart:', e);
        return [];
      }
    }
    return [];
  });
  const [expandedSeries, setExpandedSeries] = useState<Set<string>>(new Set(['熨斗系列']));
  const [glEnrollment, setGlEnrollment] = useState<boolean>(() => {
    return localStorage.getItem('glEnrollment') === 'true';
  });
  const GL_ENROLLMENT_PRICE = 1000;

  useEffect(() => {
    localStorage.setItem('glEnrollment', String(glEnrollment));
  }, [glEnrollment]);

  // 每當購物車變化時，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // 按系列分組產品
  const productsByCategory = PRODUCTS.reduce((acc, product) => {
    if (!acc[product.series]) {
      acc[product.series] = [];
    }
    acc[product.series].push(product);
    return acc;
  }, {} as Record<string, typeof PRODUCTS>);

  const toggleSeries = (series: string) => {
    const newExpanded = new Set(expandedSeries);
    if (newExpanded.has(series)) {
      newExpanded.delete(series);
    } else {
      newExpanded.add(series);
    }
    setExpandedSeries(newExpanded);
  };

  const addToCart = (productId: string) => {
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { productId, quantity: 1 }]);
    }
  };

  const getProductById = (id: string) => PRODUCTS.find(p => p.id === id);

  // 計算某系列在購物車中的總數量（可排除指定產品，用來算「其他品項」的數量）
  const getSeriesQuantity = (series: string, excludeProductId?: string) => {
    return cart.reduce((sum, item) => {
      if (excludeProductId && item.productId === excludeProductId) return sum;
      const product = getProductById(item.productId);
      return product?.series === series ? sum + item.quantity : sum;
    }, 0);
  };

  // 首次體驗加購：全系列（4款任選）合計限購1組，不是每款各限購1組
  const getMaxQuantity = (productId: string): number | null => {
    const product = getProductById(productId);
    if (product?.series !== TRIAL_SERIES_NAME) return null;
    const otherQty = getSeriesQuantity(TRIAL_SERIES_NAME, productId);
    return Math.max(0, TRIAL_SERIES_MAX_QTY - otherQty);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const maxQty = getMaxQuantity(productId);
    const clampedQuantity = maxQty !== null ? Math.min(quantity, maxQty) : quantity;
    if (clampedQuantity <= 0) {
      removeFromCart(productId);
    } else {
      const existing = cart.find(item => item.productId === productId);
      if (existing) {
        setCart(cart.map(item =>
          item.productId === productId
            ? { ...item, quantity: clampedQuantity }
            : item
        ));
      } else {
        // 如果購物車中不存在此產品，新增它
        setCart([...cart, { productId, quantity: clampedQuantity }]);
      }
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  // 原價總金額（未套用會員價）
  const originalSubtotal = cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  // 會員價總金額（含 GL 會員開通禮遇，不影響原價）
  const subtotal = cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product?.memberPrice || product?.price || 0) * item.quantity;
  }, 0) + (glEnrollment ? GL_ENROLLMENT_PRICE : 0);

  // 計算點數（根據每個產品的 PV 乘上數量）
  const points = cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product?.pv || 0) * item.quantity;
  }, 0);

  // 計算折扣金額
  const calculateDiscount = (totalPoints: number): number => {
    if (totalPoints < 30000) {
      return 0;
    } else if (totalPoints <= 120000) {
      return Math.round((totalPoints - 30000) * 0.2);
    } else if (totalPoints <= 320000) {
      return Math.round(18000 + (totalPoints - 120000) * 0.3);
    } else {
      return Math.round(18000 + 60000 + (totalPoints - 320000) * 0.35);
    }
  };

  const discount = calculateDiscount(points);
  const finalPrice = subtotal - discount;

  // 計算進度條資訊
  const getProgressInfo = (totalPoints: number) => {
    const thresholds = [30000, 120000, 320000];
    let currentThreshold = 0;
    let nextThreshold = 30000;
    let currentLevel = 0;

    if (totalPoints < 30000) {
      currentThreshold = 0;
      nextThreshold = 30000;
      currentLevel = 0;
    } else if (totalPoints < 120000) {
      currentThreshold = 30000;
      nextThreshold = 120000;
      currentLevel = 1;
    } else if (totalPoints < 320000) {
      currentThreshold = 120000;
      nextThreshold = 320000;
      currentLevel = 2;
    } else {
      currentThreshold = 320000;
      nextThreshold = 320000;
      currentLevel = 3;
    }

    const progress = totalPoints < nextThreshold
      ? Math.round(((totalPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
      : 100;
    const remaining = Math.max(0, nextThreshold - totalPoints);

    return { currentLevel, nextThreshold, progress, remaining };
  };

  const progressInfo = getProgressInfo(points);

  return (
    <div className="min-h-screen bg-background pb-56 md:pb-44">
      {/* 導航欄 */}
      <nav
        className="sticky top-16 z-40 bg-white border-b border-border isolate"
        style={{ transform: 'translateZ(0)', WebkitTransform: 'translate3d(0,0,0)' }}
      >
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-foreground" style={{fontFamily: '"Noto Sans TC", sans-serif', fontSize: '16px', fontWeight: '400'}}>返回主頁</h1>
        </div>
      </nav>

      {/* 主要內容 */}
      <section className="py-8 md:py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="text-[11px] tracking-[2px] font-semibold mb-2" style={{ color: "#B59A8A" }}>
              PURCHASE ESTIMATOR
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: "#5a4632", fontFamily: "'Playfair Display', serif" }}
            >
              首購金額試算
            </h2>
            <p className="mb-4" style={{ color: "#8a8a8a" }}>
              專為團購及首次購買顧客計算金額
            </p>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors text-sm font-medium"
              >
                <ShoppingCart className="w-4 h-4" />
                清空購物車
              </button>
            )}
          </div>

          {/* GL 會員開通禮遇 */}
          <div
            className="mb-6 md:mb-8 rounded-xl p-4 border"
            style={{ background: '#F9F6F1', borderColor: '#E8DCC8' }}
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={glEnrollment}
                onChange={(e) => setGlEnrollment(e.target.checked)}
                className="w-[18px] h-[18px] flex-shrink-0 accent-primary"
              />
              <span className="flex-1 text-sm font-semibold text-foreground">
                GL 會員開通禮遇
              </span>
              <span className="text-base font-semibold text-foreground">
                NT${GL_ENROLLMENT_PRICE.toLocaleString()}
              </span>
            </label>
          </div>

          {/* 系列分組 */}
          <div className="space-y-2 md:space-y-4">
            {Object.entries(productsByCategory).map(([series, products]) => {
              const isExpanded = expandedSeries.has(series);
              const isTrialSeries = series === TRIAL_SERIES_NAME;
              return (
                <div
                  key={series}
                  className="rounded-xl overflow-hidden"
                  style={{ border: isTrialSeries ? '1.5px dashed #C9A876' : '1px solid #E8E4E0' }}
                >
                  {/* 系列標題 */}
                  <button
                    onClick={() => toggleSeries(series)}
                    className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between transition-colors"
                    style={{ backgroundColor: isExpanded ? '#FBF6EE' : '#fff' }}
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="text-base md:text-lg font-semibold" style={{ color: '#5a4632' }}>
                        {isTrialSeries ? `✦ ${series}` : series}
                      </h3>
                      {(() => {
                        const seriesCount = cart.filter(item => {
                          const product = getProductById(item.productId);
                          return product?.series === series;
                        }).reduce((sum, item) => sum + item.quantity, 0);
                        return seriesCount > 0 && (
                          <div className="flex items-center justify-center w-5 h-5 text-white rounded-full text-xs font-bold" style={{ backgroundColor: '#8B6F47' }}>
                            {seriesCount}
                          </div>
                        );
                      })()}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      style={{ color: '#B59A8A' }}
                    />
                  </button>

                  {/* 產品列表 */}
                  {isExpanded && (
                    <div className="divide-y" style={{ borderColor: '#EEE9E3' }}>
                      {isTrialSeries && (
                        <div className="px-4 md:px-6 py-2.5" style={{ background: '#FBF6EE' }}>
                          <p className="text-[11px]" style={{ color: '#9c7a3f' }}>
                            限量體驗優惠・4款任選其中1組・PV 不列入累計計算
                          </p>
                        </div>
                      )}
                      {products.map(product => {
                        const cartItem = cart.find(item => item.productId === product.id);
                        const hasDiscount = !!product.memberPrice && product.memberPrice < product.price;
                        const maxQty = getMaxQuantity(product.id);
                        const isAtMaxQty = maxQty !== null && (cartItem?.quantity ?? 0) >= maxQty;
                        return (
                          <div
                            key={product.id}
                            className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-[#FAFAF8] transition-colors gap-3 md:gap-0"
                          >
                            {/* 產品資訊 */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <ImageWithFallback
                                src={product.image}
                                fallbackSrc="/favicon.png"
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                style={{ background: '#F5F1ED' }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                                  <h4 className="text-sm font-semibold text-foreground">
                                    {product.name}
                                  </h4>
                                  {product.pv === 0 ? (
                                    <span
                                      className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                                      style={{ color: '#9c7a3f', background: '#F3E8D8' }}
                                    >
                                      PV 0・不累計
                                    </span>
                                  ) : product.pv ? (
                                    <span className="text-xs text-muted-foreground font-normal">
                                      PV {product.pv}
                                    </span>
                                  ) : null}
                                </div>
                                {product.volume && (
                                  <p className="text-xs text-muted-foreground">
                                    {product.volume}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* 價格與控制 - 固定寬度 */}
                            <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 w-full md:w-auto">
                              <div className="flex flex-col items-end min-w-fit">
                                {hasDiscount && (
                                  <span className="text-xs" style={{ color: '#B0A797' }}>
                                    原價 NT${product.price}
                                  </span>
                                )}
                                <span className="text-base md:text-lg font-bold text-primary">
                                  NT${product.memberPrice || product.price}
                                </span>
                              </div>
                              <div className="w-24">
                                <div className="flex items-center justify-end gap-1 bg-background border border-border rounded-lg p-1">
                                  <button
                                    onClick={() => updateQuantity(product.id, (cartItem?.quantity ?? 0) - 1)}
                                    className="p-1 hover:bg-secondary rounded transition-colors flex-shrink-0"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-6 text-center font-semibold text-sm flex-shrink-0">
                                    {cartItem?.quantity ?? 0}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(product.id, (cartItem?.quantity ?? 0) + 1)}
                                    disabled={isAtMaxQty}
                                    className="p-1 hover:bg-secondary rounded transition-colors flex-shrink-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 固定底部：折扣進度條 + 結算總結（合併成同一個區塊，避免中間出現縫隙） */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg isolate"
        style={{ transform: 'translateZ(0)', WebkitTransform: 'translate3d(0,0,0)' }}
      >
        {/* 折扣進度條 */}
        <div className="border-b border-border px-4 py-3">
          <div className="container max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-xs text-muted-foreground">
                {progressInfo.currentLevel === 3
                  ? '已達最高等級 🎉'
                  : `距離下一個折扣門檻：${progressInfo.remaining.toLocaleString()} 點`}
              </p>
              <p className="text-xs font-semibold text-primary">
                {progressInfo.progress}%
              </p>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-300"
                style={{ width: `${progressInfo.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 結算總結 */}
        <div className="container max-w-4xl mx-auto px-4 py-4">
          {/* 桌面版本 */}
          <div className="hidden md:grid grid-cols-6 gap-3 items-center">
            {/* 左側資訊 */}
            <div className="col-span-1">
              <p className="text-sm text-muted-foreground mb-2">
                已選 {cart.length} 項
              </p>
              <p className="text-sm text-muted-foreground">
                獲得 {points.toLocaleString()} PV
              </p>
            </div>

            {/* 原價 */}
            <div className="text-left">
              <p className="text-sm text-muted-foreground mb-1">原價</p>
              <p className="text-sm" style={{ color: '#B0A797', fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>
                NT$ {originalSubtotal.toLocaleString()}
              </p>
            </div>

            {/* 會員價 */}
            <div className="text-left">
              <p className="text-sm text-muted-foreground mb-1">會員價</p>
              <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>
                NT$ {subtotal.toLocaleString()}
              </p>
            </div>

            {/* 折扣資訊 */}
            <div className="text-left">
              <p className="text-sm text-muted-foreground mb-1">折扣金額(PV)</p>
              <p className="text-lg font-semibold text-accent" style={{ fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>
                -NT$ {discount.toLocaleString()}
              </p>
            </div>

            {/* 加總金額 */}
            <div className="text-left">
              <p className="text-sm text-muted-foreground mb-1">加總金額</p>
              <p className="text-2xl font-bold text-primary" style={{ fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>
                NT$ {finalPrice.toLocaleString()}
              </p>
            </div>

            {/* 查看購物車按鈕 */}
            <div className="flex justify-end">
              {cart.length > 0 && (
                <button
                  onClick={() => {
                    localStorage.setItem('cart', JSON.stringify(cart));
                    navigate('/cart-detail');
                  }}
                  className="px-5 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  查看購物車
                </button>
              )}
            </div>
          </div>

          {/* 手機版本 */}
          <div className="md:hidden space-y-2">
            <div className="grid grid-cols-2 gap-x-3 text-xs" style={{ color: '#8a8a8a' }}>
              <span>已選 {cart.length} 項</span>
              <span className="text-right">獲得 {points.toLocaleString()} PV</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 text-xs" style={{ color: '#8a8a8a' }}>
              <span>
                原價 <span>NT$ {originalSubtotal.toLocaleString()}</span>
              </span>
              <span className="text-right">
                折扣金額(PV) <span className="font-semibold text-accent">-NT$ {discount.toLocaleString()}</span>
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: '#EEE9E3' }}>
              <p className="text-lg font-bold text-primary" style={{ fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>
                會員價 NT$ {finalPrice.toLocaleString()}
              </p>
              {cart.length > 0 && (
                <button
                  onClick={() => {
                    localStorage.setItem('cart', JSON.stringify(cart));
                    navigate('/cart-detail');
                  }}
                  className="px-3 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors text-xs whitespace-nowrap h-fit"
                >
                  查看購物車
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
