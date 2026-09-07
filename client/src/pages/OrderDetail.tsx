import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, Gift } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { PRODUCTS } from "@/lib/products";
import { getAssetUrl } from "@/lib/utils";

// 動態載入外部腳本（避免重複載入）
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`無法載入 ${src}`));
    document.body.appendChild(script);
  });
}

// 把贈品的重複選擇統整成「品項×數量」，例如 5 組安瓶保養組選了 2 組熨斗系列、3 組都都好系列，
// 就整理成 ["熨斗系列安瓶保養組×2組", "38都都好安瓶保養組×3組"]，而不是一筆一筆重複列出
function summarizeGiftSelections(selections: string[], unit: string): string[] {
  const counts = new Map<string, number>();
  selections.filter(Boolean).forEach((label) => {
    counts.set(label, (counts.get(label) || 0) + 1);
  });
  return Array.from(counts.entries()).map(([label, count]) => `${label}×${count}${unit}`);
}

// 產生「日期+時間+姓名」檔名，例如 2608041359_蔡依廷
function buildOrderFileName(name: string) {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const yy = pad(now.getFullYear() % 100);
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  const safeName = (name || "顧客").trim().replace(/[\\/:*?"<>|]/g, "");
  return `${yy}${mm}${dd}${hh}${min}_${safeName}`;
}

interface CartItem {
  productId: string;
  quantity: number;
}

// PDF 分頁邏輯：以 A4（794×1123px，96dpi）為單位，估算各區塊高度，
// 讓表頭在每一頁都固定顯示，且不會把某一列產品切成兩半
interface PrintPage {
  items: CartItem[];
  isFirstPage: boolean;
  showTotals: boolean;
  showGifts: boolean;
  showFooter: boolean;
}

const PDF_PAGE_WIDTH = 794;
const PDF_PAGE_HEIGHT = 1123;
const PDF_PAGE_PADDING = 40;
// 額外預留在頁面最下方，讓內容永遠不會靠近頁碼文字，避免重疊
const PDF_FOOTER_RESERVE = 28;
const PDF_CONTENT_HEIGHT = PDF_PAGE_HEIGHT - PDF_PAGE_PADDING * 2 - PDF_FOOTER_RESERVE;
const PDF_HEADER_HEIGHT = 78;
const PDF_CUSTOMER_INFO_HEIGHT = 140;
const PDF_TABLE_HEADER_HEIGHT = 52;
const PDF_ROW_HEIGHT = 96;
const PDF_TOTALS_HEIGHT = 160;
const PDF_FOOTER_HEIGHT = 44;

// 結算金額（訂單總額）跟滿額贈禮，各自獨立判斷放不放得下，不再綁成同一塊：
// 商品明細最後一頁如果還有空間，優先把「結算金額」接在下面；
// 滿額贈禮再看結算金額後面還剩不剩空間，放得下就接續同一頁，放不下才另開一頁單獨放滿額贈禮。
function buildPrintPages(items: CartItem[], giftsHeight = 0, hasGifts = false): PrintPage[] {
  if (items.length === 0) {
    return [{ items: [], isFirstPage: true, showTotals: true, showGifts: hasGifts, showFooter: true }];
  }

  const firstPageCapacity = PDF_CONTENT_HEIGHT - PDF_HEADER_HEIGHT - PDF_CUSTOMER_INFO_HEIGHT - PDF_TABLE_HEADER_HEIGHT;
  const otherPageCapacity = PDF_CONTENT_HEIGHT - PDF_HEADER_HEIGHT - PDF_TABLE_HEADER_HEIGHT;
  const rowsFirstPage = Math.max(1, Math.floor(firstPageCapacity / PDF_ROW_HEIGHT));
  const rowsOtherPage = Math.max(1, Math.floor(otherPageCapacity / PDF_ROW_HEIGHT));

  const pages: PrintPage[] = [];
  let remaining = items;
  let isFirst = true;

  while (remaining.length > 0) {
    const capacity = isFirst ? rowsFirstPage : rowsOtherPage;
    pages.push({ items: remaining.slice(0, capacity), isFirstPage: isFirst, showTotals: false, showGifts: false, showFooter: false });
    remaining = remaining.slice(capacity);
    isFirst = false;
  }

  const lastItemsPage = pages[pages.length - 1];
  const lastItemsPageCapacity = lastItemsPage.isFirstPage ? firstPageCapacity : otherPageCapacity;
  const spaceAfterItems = lastItemsPageCapacity - lastItemsPage.items.length * PDF_ROW_HEIGHT;

  // 結算金額：商品明細最後一頁放得下就接在後面，放不下才開新的一頁
  let totalsPage: PrintPage;
  let spaceAfterTotals: number;

  if (spaceAfterItems >= PDF_TOTALS_HEIGHT) {
    totalsPage = lastItemsPage;
    totalsPage.showTotals = true;
    spaceAfterTotals = spaceAfterItems - PDF_TOTALS_HEIGHT;
  } else {
    totalsPage = { items: [], isFirstPage: false, showTotals: true, showGifts: false, showFooter: false };
    pages.push(totalsPage);
    spaceAfterTotals = otherPageCapacity - PDF_TOTALS_HEIGHT;
  }

  // 滿額贈禮：結算金額那頁如果還放得下就接續顯示；放不下才另外開一頁單獨放
  if (hasGifts) {
    if (spaceAfterTotals >= giftsHeight + PDF_FOOTER_HEIGHT) {
      totalsPage.showGifts = true;
      totalsPage.showFooter = true;
    } else {
      pages.push({ items: [], isFirstPage: false, showTotals: false, showGifts: true, showFooter: true });
    }
  } else {
    totalsPage.showFooter = true;
  }

  return pages;
}

interface OrderGiftItem {
  label: string;
  qty: number;
  unit: string;
  note?: string;
  selections: string[];
}

interface OrderGifts {
  campaignId: string;
  campaignName: string;
  thresholdValue: number;
  basis: 'pv' | 'amount';
  items: OrderGiftItem[];
}

interface OrderData {
  items: CartItem[];
  originalSubtotal: number;
  subtotal: number;
  discount: number;
  finalPrice: number;
  totalPV: number;
  glEnrollment?: boolean;
  glEnrollmentPrice?: number;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  gifts?: OrderGifts[] | null;
}

function giftThresholdLabel(gift: OrderGifts): string {
  return gift.basis === 'amount'
    ? `訂單滿 NT$ ${gift.thresholdValue.toLocaleString()}`
    : `滿 ${gift.thresholdValue.toLocaleString()} PV`;
}

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  paymentMethod: string;
  invoiceType: string;
  mobileBarcode: string;
}

const EMPTY_CUSTOMER_INFO: CustomerInfo = { name: "", phone: "", address: "", paymentMethod: "", invoiceType: "", mobileBarcode: "" };

export default function OrderDetail() {
  const [, navigate] = useLocation();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingPdf, setIsSavingPdf] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(EMPTY_CUSTOMER_INFO);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // 從 sessionStorage 讀取當前訂單數據
    const currentOrder = sessionStorage.getItem("currentOrder");
    if (currentOrder) {
      try {
        const parsed = JSON.parse(currentOrder);
        setOrder(parsed);
        if (parsed?.customer) {
          setCustomerInfo({ ...EMPTY_CUSTOMER_INFO, ...parsed.customer });
        }
      } catch (e) {
        console.error("Failed to parse order:", e);
      }
    }
    setIsLoading(false);
  }, []);

  const getProductById = (id: string) => {
    return PRODUCTS.find((p) => p.id === id);
  };

  const handleConfirmOrder = () => {
    if (!order) return;

    // 保存訂單到 localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push({
      ...order,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("orders", JSON.stringify(orders));

    // 清空購物車和當前訂單
    localStorage.removeItem("cart");
    sessionStorage.removeItem("currentOrder");

    // 顯示成功消息並返回首頁
    alert("訂單已成功提交！訂單編號：" + Date.now());
    navigate("/");
  };

  const isNameFilled = customerInfo.name.trim().length > 0;

  const handleSavePdf = async () => {
    if (!order || isSavingPdf || !isNameFilled) return;
    setIsSavingPdf(true);
    try {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");

      const html2canvas = (window as any).html2canvas;
      const { jsPDF } = (window as any).jspdf;

      const pageEls = pageRefs.current.filter((el): el is HTMLDivElement => !!el);

      // 確保每一頁的圖片都載入完成再截圖，避免產品縮圖沒畫進去
      const imgs = pageEls.flatMap((el) => Array.from(el.querySelectorAll("img")));
      await Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((res) => {
                img.onload = res;
                img.onerror = res;
              })
        )
      );

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidthMm = pdf.internal.pageSize.getWidth();
      const pageHeightMm = pdf.internal.pageSize.getHeight();

      // 逐頁截圖，每一頁對應 PDF 的一個實體頁面（A4），表頭會在每頁重複
      for (let i = 0; i < pageEls.length; i++) {
        // 明確指定擷取尺寸為 A4 像素大小，避免內容溢出時被 html2canvas
        // 以 scrollHeight 抓成更高的畫布，擠壓進 PDF 頁面後跟頁碼重疊
        const canvas = await html2canvas(pageEls[i], {
          width: PDF_PAGE_WIDTH,
          height: PDF_PAGE_HEIGHT,
          windowWidth: PDF_PAGE_WIDTH,
          windowHeight: PDF_PAGE_HEIGHT,
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          allowTaint: true,
        });
        const imgData = canvas.toDataURL("image/png");
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, pageWidthMm, pageHeightMm);
      }

      // 加上頁碼（第 X / 共 Y 頁），置於每頁下方置中
      const totalPages = pageEls.length;
      for (let i = 0; i < totalPages; i++) {
        pdf.setPage(i + 1);
        pdf.setFontSize(9);
        pdf.setTextColor(150, 140, 125);
        pdf.text(`${i + 1} / ${totalPages}`, pageWidthMm / 2, pageHeightMm - 10, { align: "center" });
      }

      pdf.save(`${buildOrderFileName(customerInfo.name)}.pdf`);
    } catch (err) {
      console.error("儲存訂單 PDF 失敗:", err);
      alert("儲存 PDF 時發生問題，請稍後再試一次。");
    } finally {
      setIsSavingPdf(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">載入中...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">沒有訂單數據</p>
        <Button onClick={() => window.history.back()}>返回</Button>
      </div>
    );
  }

  const gifts = order.gifts || [];
  const hasGifts = gifts.length > 0;
  // PDF 內贈品區塊估計高度（每個活動一個標題+每個品項最多 qty 行明細），
  // 分頁時一併預留，避免跟頁碼或總結資訊重疊
  const giftsPdfHeight = hasGifts
    ? gifts.reduce((sum, gift) => sum + 34 + gift.items.reduce((s, item) => s + 18 + item.qty * 16, 0), 0)
    : 0;
  const printPages = buildPrintPages(order.items, giftsPdfHeight, hasGifts);

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
          <h1 className="text-lg font-semibold">訂單明細</h1>
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
            {order.items.map((item) => {
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
                        <p className="text-xs text-muted-foreground line-through">NT$ {product.price.toLocaleString()}</p>
                      )}
                      <p className="text-sm font-semibold">NT$ {unitPrice.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-sm font-semibold">{item.quantity}</span>
                    </div>
                    <div className="col-span-3 text-right">
                      {hasDiscount && (
                        <p className="text-xs text-muted-foreground line-through">NT$ {itemOriginalSubtotal.toLocaleString()}</p>
                      )}
                      <p className="text-sm font-semibold" style={{ color: '#8b6f47' }}>NT$ {itemSubtotal.toLocaleString()}</p>
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
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-medium text-foreground text-xs flex-1 truncate">{product.name}</p>
                        <div className="text-right whitespace-nowrap flex-shrink-0">
                          {hasDiscount && (
                            <p className="text-[10px] text-muted-foreground line-through leading-tight">NT$ {itemOriginalSubtotal.toLocaleString()}</p>
                          )}
                          <p className="text-xs font-semibold" style={{ color: '#8b6f47' }}>NT$ {itemSubtotal.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{product.volume}</span>
                        <span>數量 {item.quantity} × NT$ {unitPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {order.glEnrollment && (
              <div
                className="px-4 md:px-6 py-4 border-b border-border last:border-b-0"
                style={{ background: '#FBF8F3' }}
              >
                <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <p className="font-medium text-foreground text-sm">GL 會員開通禮遇</p>
                  </div>
                  <div className="col-span-3 text-right">
                    <p className="text-sm font-semibold">NT$ {(order.glEnrollmentPrice || 1000).toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-semibold">1</span>
                  </div>
                  <div className="col-span-3 text-right">
                    <p className="text-sm font-semibold" style={{ color: '#8b6f47' }}>NT$ {(order.glEnrollmentPrice || 1000).toLocaleString()}</p>
                  </div>
                </div>
                <div className="md:hidden flex justify-between items-center">
                  <p className="font-medium text-foreground text-xs">GL 會員開通禮遇</p>
                  <p className="text-xs font-semibold" style={{ color: '#8b6f47' }}>NT$ {(order.glEnrollmentPrice || 1000).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* 總結資訊 */}
          <div className="bg-secondary/10 rounded-lg p-6 space-y-3 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">原價</span>
              <span className="font-semibold text-muted-foreground">NT$ {order.originalSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">會員價</span>
              <span className="font-semibold">NT$ {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">折扣金額(PV)</span>
              <span className="font-semibold text-accent">-NT$ {order.discount.toLocaleString()}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="font-semibold">總付款金額</span>
              <span className="text-2xl font-bold text-primary">NT$ {order.finalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="text-muted-foreground">獲得 PV</span>
              <span className="font-semibold text-foreground">{order.totalPV.toLocaleString()}</span>
            </div>
          </div>

          {/* 滿額贈禮：達成的每個活動各自列出一塊，只有在有贈品資料時才顯示 */}
          {hasGifts && (
            <div className="bg-secondary/10 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-5 h-5" style={{ color: '#5a4632' }} />
                <span className="font-semibold" style={{ color: '#5a4632' }}>滿額贈禮</span>
              </div>
              <div className="space-y-4">
                {gifts.map((gift, giftIdx) => (
                  <div key={gift.campaignId} style={{ borderTop: giftIdx > 0 ? '1px solid #E8E4E0' : 'none', paddingTop: giftIdx > 0 ? '14px' : 0 }}>
                    <div className="text-xs font-semibold mb-2" style={{ color: '#8b6f47' }}>
                      {gift.campaignName}（{giftThresholdLabel(gift)}）
                    </div>
                    <div className="space-y-3">
                      {gift.items.map((item, idx) => {
                        const summarized = summarizeGiftSelections(item.selections, item.unit);
                        return (
                          <div key={idx} className="text-sm">
                            <div className="font-medium text-foreground">
                              {item.label}×{item.qty}{item.unit}
                              {item.note && <span className="text-xs font-normal ml-1" style={{ color: '#b3714a' }}>（{item.note}，需另行確認）</span>}
                            </div>
                            {summarized.length > 0 && (
                              <div className="text-muted-foreground mt-1 space-y-0.5">
                                {summarized.map((line, i) => (
                                  <div key={i}>・{line}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 收件人資訊：可編輯，訂購人為必填才能儲存訂單 */}
          <div className="bg-secondary/10 rounded-lg p-6 mb-8 space-y-3">
            <div className="border-b border-border pb-3">
              <label htmlFor="customerName" className="text-sm text-muted-foreground">訂購人</label>
              <input
                id="customerName"
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                placeholder="請輸入訂購人姓名"
                className="w-full bg-transparent outline-none font-semibold placeholder:font-normal placeholder:text-muted-foreground"
              />
            </div>
            <div className="border-b border-border pb-3">
              <label htmlFor="customerPhone" className="text-sm text-muted-foreground">電話</label>
              <input
                id="customerPhone"
                type="text"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                placeholder="請輸入電話"
                className="w-full bg-transparent outline-none font-semibold placeholder:font-normal placeholder:text-muted-foreground"
              />
            </div>
            <div className="border-b border-border pb-3">
              <label htmlFor="customerAddress" className="text-sm text-muted-foreground">地址</label>
              <input
                id="customerAddress"
                type="text"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                placeholder="請輸入地址"
                className="w-full bg-transparent outline-none font-semibold placeholder:font-normal placeholder:text-muted-foreground"
              />
            </div>
            <div className="border-b border-border pb-3">
              <label htmlFor="customerPaymentMethod" className="text-sm text-muted-foreground">付款方式</label>
              <select
                id="customerPaymentMethod"
                value={customerInfo.paymentMethod}
                onChange={(e) => setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value })}
                className={`w-full bg-transparent outline-none ${customerInfo.paymentMethod ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
              >
                <option value="">請選擇付款方式</option>
                <option value="現金">現金</option>
                <option value="刷卡">刷卡</option>
                <option value="網銀轉帳">網銀轉帳</option>
              </select>
            </div>
            <div className={customerInfo.invoiceType === '手機載具' ? 'border-b border-border pb-3' : ''}>
              <label htmlFor="customerInvoiceType" className="text-sm text-muted-foreground">發票</label>
              <select
                id="customerInvoiceType"
                value={customerInfo.invoiceType}
                onChange={(e) => setCustomerInfo({ ...customerInfo, invoiceType: e.target.value })}
                className={`w-full bg-transparent outline-none ${customerInfo.invoiceType ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
              >
                <option value="">請選擇發票類型</option>
                <option value="手機載具">手機載具</option>
                <option value="紙本發票">紙本發票</option>
              </select>
            </div>
            {customerInfo.invoiceType === '手機載具' && (
              <div>
                <label htmlFor="customerMobileBarcode" className="text-sm text-muted-foreground">手機載具號碼</label>
                <input
                  id="customerMobileBarcode"
                  type="text"
                  value={customerInfo.mobileBarcode}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, mobileBarcode: e.target.value })}
                  placeholder="請輸入載具號碼"
                  className="w-full bg-transparent outline-none font-semibold placeholder:font-normal placeholder:text-muted-foreground"
                />
              </div>
            )}
            <p className="text-xs pt-1" style={{ color: '#b3714a' }}>*填寫訂購人資訊可儲存訂單</p>
          </div>

          {/* 儲存訂單 PDF */}
          <Button
            onClick={handleSavePdf}
            disabled={isSavingPdf || !isNameFilled}
            className="w-full py-6 text-base disabled:opacity-50"
            style={{ background: '#5a4632', color: '#fff' }}
          >
            <Download className="w-4 h-4 mr-2" />
            {isSavingPdf ? "產生 PDF 中…" : "儲存訂單（PDF）"}
          </Button>

        </div>
      </section>

      {/* 隱藏的列印版訂單明細，每一頁對應 PDF 的一個 A4 實體頁面，表頭在每頁重複 */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {printPages.map((page, pageIndex) => (
          <div
            key={pageIndex}
            ref={(el) => { pageRefs.current[pageIndex] = el; }}
            style={{
              width: `${PDF_PAGE_WIDTH}px`,
              height: `${PDF_PAGE_HEIGHT}px`,
              boxSizing: 'border-box',
              overflow: 'hidden',
              background: '#ffffff',
              padding: `${PDF_PAGE_PADDING}px`,
              paddingBottom: `${PDF_PAGE_PADDING + PDF_FOOTER_RESERVE}px`,
              fontFamily: "'Noto Sans TC', sans-serif",
              color: '#3a2f24',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', letterSpacing: '3px', color: '#B0A797' }}>YUMÍ 米米美學｜高端皮膚管理</div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#3a2f24', marginTop: '6px' }}>訂單明細</div>
            </div>

            {page.isFirstPage && (
              <div
                style={{
                  fontSize: '13px',
                  color: '#5a4632',
                  borderTop: '0.5px solid #E8E4E0',
                  borderBottom: '0.5px solid #E8E4E0',
                  padding: '14px 4px',
                  marginBottom: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: '10px',
                }}
              >
                <div>訂購日期：{new Date().toLocaleString('zh-TW', { hour12: false })}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>訂購人：{customerInfo.name}</span>
                  <span>付款方式：{customerInfo.paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>電話：{customerInfo.phone}</span>
                  <span>發票：{customerInfo.invoiceType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>地址：{customerInfo.address}</span>
                  {customerInfo.invoiceType === '手機載具' && (
                    <span>載具號碼：{customerInfo.mobileBarcode}</span>
                  )}
                </div>
              </div>
            )}

            {(page.items.length > 0 || (page.showTotals && order.glEnrollment)) && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #5a4632' }}>
                    <th style={{ textAlign: 'left', padding: '14px 8px', color: '#3a2f24', fontWeight: 600, verticalAlign: 'middle' }}>產品名稱</th>
                    <th style={{ textAlign: 'right', padding: '14px 8px', color: '#3a2f24', fontWeight: 600, verticalAlign: 'middle' }}>單價</th>
                    <th style={{ textAlign: 'center', padding: '14px 8px', color: '#3a2f24', fontWeight: 600, verticalAlign: 'middle' }}>數量</th>
                    <th style={{ textAlign: 'right', padding: '14px 8px', color: '#3a2f24', fontWeight: 600, verticalAlign: 'middle' }}>小計</th>
                  </tr>
                </thead>
                <tbody>
                  {page.items.map((item, index) => {
                    const product = getProductById(item.productId);
                    if (!product) return null;
                    const unitPrice = product.memberPrice || product.price;
                    const itemSubtotal = unitPrice * item.quantity;
                    const isLast = index === page.items.length - 1;
                    return (
                      <tr key={item.productId} style={{ borderBottom: isLast ? 'none' : '1px solid #E8E4E0' }}>
                        <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {product.image ? (
                              <img
                                src={getAssetUrl(product.image)}
                                alt={product.name}
                                crossOrigin="anonymous"
                                style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', background: '#F5F1ED', display: 'block', flexShrink: 0 }}
                              />
                            ) : (
                              <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: '#F5F1ED', flexShrink: 0 }} />
                            )}
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 600, color: '#3a2f24' }}>{product.name}</div>
                              <div style={{ fontSize: '12px', color: '#9a8f7d', marginTop: '4px' }}>{product.volume}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', padding: '16px 8px', verticalAlign: 'middle', fontSize: '14px', fontWeight: 600, color: '#3a2f24' }}>NT$ {unitPrice.toLocaleString()}</td>
                        <td style={{ textAlign: 'center', padding: '16px 8px', verticalAlign: 'middle', fontSize: '14px', fontWeight: 600, color: '#3a2f24' }}>{item.quantity}</td>
                        <td style={{ textAlign: 'right', padding: '16px 8px', verticalAlign: 'middle', fontSize: '14px', fontWeight: 700, color: '#8b6f47' }}>NT$ {itemSubtotal.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                  {page.showTotals && order.glEnrollment && (
                    <tr style={{ borderBottom: 'none', background: '#FBF8F3' }}>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#3a2f24' }}>GL 會員開通禮遇</div>
                      </td>
                      <td style={{ textAlign: 'right', padding: '16px 8px', verticalAlign: 'middle', fontSize: '14px', fontWeight: 600, color: '#3a2f24' }}>NT$ {(order.glEnrollmentPrice || 1000).toLocaleString()}</td>
                      <td style={{ textAlign: 'center', padding: '16px 8px', verticalAlign: 'middle', fontSize: '14px', fontWeight: 600, color: '#3a2f24' }}>1</td>
                      <td style={{ textAlign: 'right', padding: '16px 8px', verticalAlign: 'middle', fontSize: '14px', fontWeight: 700, color: '#8b6f47' }}>NT$ {(order.glEnrollmentPrice || 1000).toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {page.showTotals && (
              <div style={{ marginTop: page.items.length > 0 ? '20px' : '40px', paddingTop: '16px', borderTop: '2px solid #5a4632' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#8a7960', marginBottom: '6px' }}>
                  <span>原價合計</span><span>NT$ {order.originalSubtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#8a7960', marginBottom: '6px' }}>
                  <span>折扣金額(PV)</span><span>-NT$ {order.discount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, color: '#b3714a' }}>
                  <span>訂單總額</span><span>NT$ {order.finalPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8a7960', marginTop: '8px' }}>
                  <span>獲得 PV</span><span>{order.totalPV.toLocaleString()}</span>
                </div>
              </div>
            )}

            {page.showGifts && (
              <div
                style={
                  page.showTotals
                    ? { marginTop: '16px', paddingTop: '12px', borderTop: '0.5px solid #E8E4E0' }
                    : { marginTop: page.items.length > 0 ? '20px' : '40px', paddingTop: '16px', borderTop: '2px solid #5a4632' }
                }
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Gift style={{ width: '15px', height: '15px', color: '#5a4632' }} />
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#5a4632' }}>滿額贈禮</div>
                </div>
                {gifts.map((gift) => (
                  <div key={gift.campaignId} style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#8b6f47', marginBottom: '4px' }}>
                      {gift.campaignName}（{giftThresholdLabel(gift)}）
                    </div>
                    {gift.items.map((item, idx) => {
                      const summarized = summarizeGiftSelections(item.selections, item.unit);
                      return (
                        <div key={idx} style={{ marginBottom: '6px' }}>
                          <div style={{ fontSize: '12px', color: '#3a2f24', fontWeight: 600 }}>
                            {item.label}×{item.qty}{item.unit}
                            {item.note && <span style={{ fontWeight: 400, color: '#b3714a' }}>　（{item.note}，需另行確認）</span>}
                          </div>
                          {summarized.map((line, i) => (
                            <div key={i} style={{ fontSize: '12px', color: '#8a7960', marginTop: '2px' }}>・{line}</div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {page.showFooter && (
              <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '11px', color: '#c9bfae' }}>
                感謝您的訂購 · Yumí 米米美學
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
