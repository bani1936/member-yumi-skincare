import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Minus, Gift } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { PRODUCTS } from "@/lib/products";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import {
  getActiveGiftCampaigns,
  AMPOULE_SET_OPTIONS,
  SPRAY_120ML_OPTIONS,
  SALON_SET_SERIES_OPTIONS,
  type GiftChooseFrom,
  type GiftCampaign,
} from "@/lib/giftTiers";

interface CartItem {
  productId: string;
  quantity: number;
}

type GetGiftSelection = (campaignId: string, tierIdx: number, itemIdx: number, qty: number) => string[];
type SetGiftSelectionAt = (campaignId: string, tierIdx: number, itemIdx: number, qty: number, pos: number, value: string) => void;
type GetOptionsFor = (chooseFrom: GiftChooseFrom) => string[];

// 單一活動的滿額贈禮階梯：列出所有階層，達成的最高階層展開顯示可任選系列的下拉選單
function GiftCampaignCard({
  campaign,
  totalPV,
  finalPrice,
  getGiftSelection,
  setGiftSelectionAt,
  getOptionsFor,
}: {
  campaign: GiftCampaign;
  totalPV: number;
  finalPrice: number;
  getGiftSelection: GetGiftSelection;
  setGiftSelectionAt: SetGiftSelectionAt;
  getOptionsFor: GetOptionsFor;
}) {
  const currentTierIndex = campaign.tiers.reduce((acc, tier, idx) => {
    const value = tier.basis === 'amount' ? finalPrice : totalPV;
    return value >= tier.thresholdValue ? idx : acc;
  }, -1);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-bold" style={{ color: '#5a4632' }}>{campaign.name}</span>
        {campaign.periodLabel && (
          <span className="text-[11px]" style={{ color: '#a89e8e' }}>{campaign.periodLabel}</span>
        )}
      </div>

      <div className="flex flex-col">
        {campaign.tiers.map((tier, tierIdx) => {
          const achieved = tierIdx <= currentTierIndex;
          const isCurrent = tierIdx === currentTierIndex;
          const thresholdLabel = tier.basis === 'amount'
            ? `訂單滿 NT$ ${tier.thresholdValue.toLocaleString()}`
            : `滿 ${tier.thresholdValue.toLocaleString()} PV`;
          const summary = tier.items.map((it) => `${it.label}×${it.qty}${it.unit}`).join('、');

          if (isCurrent) {
            return (
              <div key={tierIdx} className="rounded-lg my-1 p-3" style={{ background: '#FBF6EE', border: '1px solid #E8DCC8' }}>
                <div className="flex gap-2.5 mb-2.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5"
                    style={{ background: '#5a4632' }}
                  >
                    ✓
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: '#5a4632' }}>{thresholdLabel} ・ 目前已達成</div>
                    <div className="text-xs" style={{ color: '#9a8f7d' }}>贈 {summary}</div>
                    {tier.items.some((it) => it.note) && (
                      <div className="text-[11px] mt-1" style={{ color: '#b3714a' }}>
                        {tier.items.filter((it) => it.note).map((it) => it.note).join('；')}（需另行確認）
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3 pl-7">
                  {tier.items.map((item, itemIdx) => {
                    if (!item.chooseFrom) return null;
                    const options = getOptionsFor(item.chooseFrom);
                    const selections = getGiftSelection(campaign.id, tierIdx, itemIdx, item.qty);
                    return (
                      <div key={itemIdx}>
                        <div className="text-xs mb-1.5" style={{ color: '#8a7960' }}>
                          {item.label}（可任選系列，共 {item.qty} {item.unit}）
                        </div>
                        <div className="flex flex-col gap-2">
                          {Array.from({ length: item.qty }).map((_, pos) => (
                            <div key={pos} className="flex items-center gap-2">
                              {item.qty > 1 && (
                                <span className="text-xs w-14 flex-shrink-0" style={{ color: '#8a7960' }}>
                                  第 {pos + 1} {item.unit}
                                </span>
                              )}
                              <select
                                value={selections[pos] || ""}
                                onChange={(e) => setGiftSelectionAt(campaign.id, tierIdx, itemIdx, item.qty, pos, e.target.value)}
                                className="flex-1 text-sm px-3 py-2 rounded-md border bg-white outline-none"
                                style={{ borderColor: '#E8DCC8' }}
                              >
                                <option value="">請選擇</option>
                                {options.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          return (
            <div
              key={tierIdx}
              className="flex gap-2.5 py-2.5"
              style={{
                borderBottom: tierIdx < campaign.tiers.length - 1 ? '1px solid #F0EAE0' : 'none',
                opacity: achieved ? 1 : 0.55,
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-white text-xs"
                style={achieved ? { background: '#5a4632' } : { border: '1.5px solid #C9BFAE' }}
              >
                {achieved ? '✓' : ''}
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: achieved ? '#5a4632' : '#7a7060' }}>{thresholdLabel}</div>
                <div className="text-xs" style={{ color: achieved ? '#9a8f7d' : '#a89e8e' }}>贈 {summary}</div>
              </div>
            </div>
          );
        })}
      </div>

      {currentTierIndex + 1 < campaign.tiers.length && (() => {
        const nextTier = campaign.tiers[currentTierIndex + 1];
        const currentValue = nextTier.basis === 'amount' ? finalPrice : totalPV;
        const remaining = Math.max(0, nextTier.thresholdValue - currentValue);
        const remainingLabel = nextTier.basis === 'amount'
          ? `NT$ ${remaining.toLocaleString()}`
          : `${remaining.toLocaleString()} PV`;
        return (
          <div className="text-xs pl-7 pt-1" style={{ color: '#b3714a' }}>
            再加購 {remainingLabel} 即可升級下一階贈禮
          </div>
        );
      })()}
    </div>
  );
}

export default function CartDetail() {
  const [, navigate] = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // 滿額贈禮的選擇，key 為 "campaignId-tierIdx-itemIndex"，value 為每一份贈品選擇的內容
  const [giftSelections, setGiftSelections] = useState<Record<string, string[]>>({});

  useEffect(() => {
    // 從 localStorage 讀取購物車數據
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart:", e);
      }
    }
    setIsLoading(false);
  }, []);

  const [glEnrollment] = useState<boolean>(() => {
    return localStorage.getItem('glEnrollment') === 'true';
  });
  const GL_ENROLLMENT_PRICE = 1000;

  // 每當購物車變化時，保存到 localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const getProductById = (id: string) => {
    return PRODUCTS.find((p) => p.id === id);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // 移除產品
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      // 更新數量
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  // 原價總金額（未套用會員價）
  const originalSubtotal = cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  // 會員價總金額和總 PV（含 GL 會員開通禮遇，不影響原價與PV）
  const subtotal = cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product?.memberPrice || product?.price || 0) * item.quantity;
  }, 0) + (glEnrollment ? GL_ENROLLMENT_PRICE : 0);

  const totalPV = cart.reduce((sum, item) => {
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

  const discount = calculateDiscount(totalPV);
  const finalPrice = subtotal - discount;

  // 2250 PV 商品任選的選項，直接從商品庫抓取所有 pv === 2250 的品項
  const pv2250Options = PRODUCTS.filter((p) => p.pv === 2250).map((p) => p.name);

  const getOptionsFor: GetOptionsFor = (chooseFrom) => {
    switch (chooseFrom) {
      case 'ampoule':
        return AMPOULE_SET_OPTIONS;
      case 'spray':
        return SPRAY_120ML_OPTIONS;
      case 'salonSeries':
        return SALON_SET_SERIES_OPTIONS;
      case 'pv2250':
        return pv2250Options;
      default:
        return [];
    }
  };

  // 目前生效的活動組合：基礎活動（新客滿額贈 或 盛夏不鬧肌，擇一）+ 所有生效中的疊加活動
  const activeGiftCampaigns = getActiveGiftCampaigns();

  const getGiftSelection: GetGiftSelection = (campaignId, tierIdx, itemIdx, qty) => {
    const key = `${campaignId}-${tierIdx}-${itemIdx}`;
    return giftSelections[key] || Array(qty).fill("");
  };

  const setGiftSelectionAt: SetGiftSelectionAt = (campaignId, tierIdx, itemIdx, qty, pos, value) => {
    const key = `${campaignId}-${tierIdx}-${itemIdx}`;
    setGiftSelections((prev) => {
      const current = prev[key] || Array(qty).fill("");
      const next = [...current];
      next[pos] = value;
      return { ...prev, [key]: next };
    });
  };

  // 確認訂單：不再彈出表單，直接帶著空白的收件人資訊跳轉到訂單明細，
  // 訂購人姓名等資訊改在訂單明細頁面填寫。滿額贈禮則把每個生效活動達成的最高階層一併存進訂單
  const handleConfirmOrder = () => {
    const gifts = activeGiftCampaigns
      .map((campaign) => {
        const tierIdx = campaign.tiers.reduce((acc, tier, idx) => {
          const value = tier.basis === 'amount' ? finalPrice : totalPV;
          return value >= tier.thresholdValue ? idx : acc;
        }, -1);
        if (tierIdx < 0) return null;
        const tier = campaign.tiers[tierIdx];
        return {
          campaignId: campaign.id,
          campaignName: campaign.name,
          thresholdValue: tier.thresholdValue,
          basis: tier.basis,
          items: tier.items.map((item, itemIdx) => ({
            label: item.label,
            qty: item.qty,
            unit: item.unit,
            note: item.note || "",
            selections: item.chooseFrom ? getGiftSelection(campaign.id, tierIdx, itemIdx, item.qty) : [],
          })),
        };
      })
      .filter((g): g is NonNullable<typeof g> => !!g);

    const orderData = {
      items: cart,
      originalSubtotal,
      subtotal,
      discount,
      finalPrice,
      totalPV,
      glEnrollment,
      glEnrollmentPrice: glEnrollment ? GL_ENROLLMENT_PRICE : 0,
      customer: { name: "", phone: "", address: "" },
      gifts,
    };

    sessionStorage.setItem("currentOrder", JSON.stringify(orderData));
    navigate("/order-detail");
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">載入中...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">購物車是空的</p>
        <Button onClick={() => window.history.back()}>返回</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* 導航欄 */}
      <nav
        className="sticky top-16 z-40 bg-white border-b border-border isolate"
        style={{ transform: 'translateZ(0)', WebkitTransform: 'translate3d(0,0,0)' }}
      >
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">購物車詳細</h1>
        </div>
      </nav>

      {/* 主要內容 */}
      <section className="py-8">
        <div className="container max-w-4xl mx-auto px-4">
          {/* 購物車明細表 */}
          <div className="bg-white rounded-lg border border-border overflow-hidden mb-8">
            {/* 表頭 */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 md:px-6 py-4 bg-secondary/20 border-b border-border font-semibold text-sm">
              <div className="col-span-4">產品名稱</div>
              <div className="col-span-3 text-right">單價</div>
              <div className="col-span-2 text-right">數量</div>
              <div className="col-span-3 text-right">小計</div>
            </div>

            {/* 購物車項目 */}
            {cart.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;

              const unitPrice = product.memberPrice || product.price;
              const hasDiscount = !!product.memberPrice && product.memberPrice < product.price;
              const itemSubtotal = unitPrice * item.quantity;
              const itemOriginalSubtotal = product.price * item.quantity;

              return (
                <div
                  key={item.productId}
                  className="px-4 md:px-6 py-4 border-b border-border last:border-b-0 hover:bg-secondary/5 transition-colors"
                >
                  {/* 桌面版本 */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      <ImageWithFallback
                        src={product.image}
                        fallbackSrc="/favicon.png"
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        style={{ background: '#F5F1ED' }}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{product.volume}</p>
                      </div>
                    </div>
                    <div className="col-span-3 text-right">
                      {hasDiscount && (
                        <p className="text-xs text-muted-foreground line-through" style={{ fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>NT$ {product.price.toLocaleString()}</p>
                      )}
                      <p className="text-sm font-semibold" style={{ fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>NT$ {unitPrice.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2 flex items-center justify-end">
                      <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-secondary rounded transition-colors flex-shrink-0"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-semibold text-sm flex-shrink-0">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-secondary rounded transition-colors flex-shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="col-span-3 text-right">
                      {hasDiscount && (
                        <p className="text-xs text-muted-foreground line-through" style={{ fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>NT$ {itemOriginalSubtotal.toLocaleString()}</p>
                      )}
                      <p className="text-sm font-semibold" style={{ color: '#8b6f47', fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>NT$ {itemSubtotal.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* 手機版本 */}
                  <div className="md:hidden flex gap-3">
                    <ImageWithFallback
                      src={product.image}
                      fallbackSrc="/favicon.png"
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      style={{ background: '#F5F1ED' }}
                    />
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex justify-between items-center gap-2">
                        <p className="font-medium text-foreground text-xs flex-1 truncate">{product.name}</p>
                        <div className="text-right whitespace-nowrap flex-shrink-0">
                          {hasDiscount && (
                            <p className="text-[10px] text-muted-foreground line-through leading-tight" style={{ fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>NT$ {itemOriginalSubtotal.toLocaleString()}</p>
                          )}
                          <p className="text-xs font-semibold" style={{ color: '#8b6f47', fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>NT$ {itemSubtotal.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-muted-foreground leading-snug">
                          <div>{product.volume}</div>
                          <div style={{ fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>NT$ {unitPrice.toLocaleString()}</div>
                        </div>
                        <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 hover:bg-secondary rounded transition-colors flex-shrink-0"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-5 text-center text-xs font-semibold flex-shrink-0">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 hover:bg-secondary rounded transition-colors flex-shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {glEnrollment && (
            <div className="flex justify-between items-center px-4 py-3 mb-8 rounded-lg" style={{ background: '#F9F6F1' }}>
              <span className="text-sm font-semibold text-foreground">GL 會員開通禮遇</span>
              <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>NT$ {GL_ENROLLMENT_PRICE.toLocaleString()}</span>
            </div>
          )}

          {/* 總結資訊 */}
          <div className="bg-secondary/10 rounded-lg p-6 space-y-3 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">原價</span>
              <span className="font-semibold text-muted-foreground" style={{ fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>NT$ {originalSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">會員價</span>
              <span className="font-semibold" style={{ fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>NT$ {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">折扣金額(PV)</span>
              <span className="font-semibold text-accent" style={{ fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>-NT$ {discount.toLocaleString()}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="font-semibold">總付款金額</span>
              <span className="text-2xl font-bold text-primary" style={{ fontFamily: "'Spectral', 'Noto Serif TC', serif" }}>NT$ {finalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="text-muted-foreground">獲得 PV</span>
              <span className="font-semibold text-foreground">{totalPV.toLocaleString()}</span>
            </div>
          </div>

          {/* 滿額贈禮：同時列出目前生效的每個活動（基礎活動＋可疊加活動） */}
          <div className="bg-white rounded-lg p-6 mb-8" style={{ border: '1px solid #E8DCC8' }}>
            <div className="flex items-center gap-2 mb-1">
              <Gift className="w-5 h-5" style={{ color: '#5a4632' }} />
              <span className="text-base font-bold" style={{ color: '#5a4632' }}>滿額贈禮</span>
            </div>
            <div className="text-xs mb-4" style={{ color: '#8a7960' }}>
              目前訂單 PV：<span className="font-bold" style={{ color: '#5a4632' }}>{totalPV.toLocaleString()}</span>
              {" ・ "}總付款金額：<span className="font-bold" style={{ color: '#5a4632' }}>NT$ {finalPrice.toLocaleString()}</span>
            </div>

            <div className="space-y-5">
              {activeGiftCampaigns.map((campaign, idx) => (
                <div key={campaign.id} style={{ borderTop: idx > 0 ? '1px solid #F0EAE0' : 'none', paddingTop: idx > 0 ? '18px' : 0 }}>
                  <GiftCampaignCard
                    campaign={campaign}
                    totalPV={totalPV}
                    finalPrice={finalPrice}
                    getGiftSelection={getGiftSelection}
                    setGiftSelectionAt={setGiftSelectionAt}
                    getOptionsFor={getOptionsFor}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 確認訂單按鈕：直接跳轉到訂單明細，不再彈出表單 */}
          <div className="flex justify-center">
            <Button
              onClick={handleConfirmOrder}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold"
            >
              確認訂單
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
