import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SkinDetection from "./pages/SkinDetection";
import ProductCalculator from "./pages/ProductCalculator";
import Products from "./pages/Products";
import CartDetail from "./pages/CartDetail";
import OrderDetail from "./pages/OrderDetail";
import Membership from "./pages/Membership";
import Promotion from "./pages/Promotion";
import ProductDetail from "./pages/ProductDetail";

import SplashScreen from "./components/SplashScreen";
import LineFloatButton from "./components/LineFloatButton";
import { ImageWithFallback } from "./components/ui/ImageWithFallback";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

function GlobalNav() {
  const [, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#5a4a3a] to-[#6b5a4a] text-white border-b border-[#4a3a2a]">
      <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => handleNavigate('/')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <ImageWithFallback
            src="/logo-circle.png"
            fallbackSrc="/favicon.png"
            alt="Yumí Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="flex flex-col items-start leading-tight">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '19px', fontWeight: 700, color: '#F5F1ED' }}>
              Yumí 米米美學
            </span>
            <span style={{ fontSize: '10px', letterSpacing: '2px', color: '#D9C6A5', marginTop: '3px' }}>
              會員中心
            </span>
          </span>
        </button>
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => handleNavigate('/promotion')} className="text-sm hover:text-[#d4a574] transition-colors">最新活動</button>
          <button onClick={() => handleNavigate('/products')} className="text-sm hover:text-[#d4a574] transition-colors">全系列產品</button>
          <button onClick={() => handleNavigate('/membership')} className="text-sm hover:text-[#d4a574] transition-colors">會員制度</button>
          <button onClick={() => handleNavigate('/product-calculator')} className="text-sm hover:text-[#d4a574] transition-colors">首購金額試算</button>
        </div>
        {/* 手機版菜單按鈕 */}
        <div className="md:hidden">
          <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }} className="hover:text-[#d4a574] transition-colors">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {/* 手機版側邊菜單 */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-[#5a4a3a] to-[#6b5a4a] border-t border-[#4a3a2a] py-4 px-4 space-y-3">
          <button onClick={() => { handleNavigate('/promotion'); setIsMenuOpen(false); }} className="block w-full text-left text-sm text-white hover:text-[#d4a574] transition-colors py-2">
            最新活動
          </button>
          <button onClick={() => { handleNavigate('/products'); setIsMenuOpen(false); }} className="block w-full text-left text-sm text-white hover:text-[#d4a574] transition-colors py-2">
            全系列產品
          </button>
          <button onClick={() => { handleNavigate('/membership'); setIsMenuOpen(false); }} className="block w-full text-left text-sm text-white hover:text-[#d4a574] transition-colors py-2">
            會員制度
          </button>
          <button onClick={() => { handleNavigate('/product-calculator'); setIsMenuOpen(false); }} className="block w-full text-left text-sm text-white hover:text-[#d4a574] transition-colors py-2">
            首購金額試算
          </button>
        </div>
      )}
    </nav>
  );
}

function PromoMarquee() {
  return (
    <div className="overflow-hidden py-2" style={{ background: '#000000' }}>
      <div className="flex animate-marquee">
        {Array.from({ length: 2 }).map((_, groupIdx) => (
          <div key={groupIdx} className="flex items-center flex-shrink-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className="mx-16 text-sm font-normal whitespace-nowrap"
                style={{ color: '#FFFFFF' }}
              >
                台新、永豐、中信 刷卡3、6 期零利率！
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Switch>
      <Route path={"\\"} component={Home} />
      <Route path={"/"} component={Home} />
      <Route path={"/skin-detection"} component={SkinDetection} />
      <Route path={"/product-calculator"} component={ProductCalculator} />
      <Route path={"/products"} component={Products} />
      <Route path={"/cart-detail"} component={CartDetail} />
      <Route path={"/order-detail"} component={OrderDetail} />
      <Route path={"/membership"} component={Membership} />
      <Route path={"/promotion"} component={Promotion} />
      <Route path={"/product-detail"} component={ProductDetail} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // 檢查 sessionStorage 中是否已經顯示過 Splash Screen
    return !sessionStorage.getItem('splashShown');
  });

  useEffect(() => {
    if (showSplash === false) {
      // 標記 Splash Screen 已顯示
      sessionStorage.setItem('splashShown', 'true');
    }
  }, [showSplash]);

  // 修正瀏覽器「上一頁/下一頁」按鈕沒有正確刷新畫面的問題：
  // 這個網站是純前端單頁應用（用 hash 路由切換畫面，網址從沒真正離開過），
  // 按上一頁/下一頁時瀏覽器一定會觸發 popstate 事件（跟一般網頁重新整理無關），
  // 直接在這個事件發生時強制重新整理，確保畫面內容一定跟網址列同步，不依賴框架內部的狀態同步機制。
  useEffect(() => {
    const handlePopState = () => {
      window.location.reload();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} duration={2000} />}
          <Toaster />
          <WouterRouter hook={useHashLocation}>
            <GlobalNav />
            <PromoMarquee />
            <AppRoutes />
          </WouterRouter>
          <LineFloatButton />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
