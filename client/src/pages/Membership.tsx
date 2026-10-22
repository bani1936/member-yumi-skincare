import { ChevronLeft } from "lucide-react";
import { MEMBERSHIP_TIERS } from "@/lib/membership-tiers";
import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// 消費者分頁（LV.1~3）簡化版升等條件文字，避免出現「直B」「領代」等經營術語
const SIMPLE_REQUIREMENTS: Record<string, string[]> = {
  member: ["加入即享"],
  "group-leader": ["個人累積消費滿 3 萬 PV 點", "推薦好友累積消費滿 3 萬 PV 點"],
  "section-leader": ["首購當月個人累積消費滿 12 萬 PV 點", "無限期推薦好友累積消費滿 20 萬 PV 點"],
  "consumer-small-plate": ["首購當月個人累積消費滿 NT$298,000 元"],
};

// 「會員消費權益」分頁專用的 LV.4 小盤卡片
// 注意：這是獨立資料，跟「合夥與代理制度」分頁裡 membership-tiers.ts 的「小盤督導」互不影響，各自維護
const CONSUMER_SMALL_PLATE_TIER = {
  id: "consumer-small-plate",
  name: "小盤",
  commission: "35%",
  discount: "35%",
  entryFee: "NT$298,000",
  requirements: ["首購當月個人累積消費滿 NT$298,000 元"],
  benefits: ["35% 現金回饋", "35% 永久產品折扣", "推薦好友加碼現金回饋"],
  perks: ["推薦好友加碼現金回饋"],
  color: "bg-amber-50",
  icon: "🎖️",
  order: 4,
};

const FAQ_ITEMS = [
  {
    question: "會籍是終身嗎？",
    answer: (
      <>
        <p className="text-sm">會籍非終身制，但只要維持消費即可持續享有原位階的權益與折扣：</p>
        <p className="text-sm mt-2">
          <span className="font-semibold" style={{ color: "#8B6F47" }}>1. 首購權益：</span>
          加入會員即享有會籍至「次年 12 月 31 日」。
        </p>
        <p className="text-sm mt-2">
          <span className="font-semibold" style={{ color: "#8B6F47" }}>2. 免費自動續會：</span>
          於會籍期間內，每年累積消費滿 15,000 PV，下一年度即可自動免費續會，並繼續保留您現有的位階與相關回饋。
        </p>
        <p className="text-sm mt-2">
          <span className="font-semibold" style={{ color: "#8B6F47" }}>3. 會籍暫停與恢復：</span>
          若未達續會條件，會籍將暫時凍結；凍結期間如欲購買產品，僅需支付 500 元續會費即可恢復會籍（有效期限至「當年 12 月 31 日」），恢復後同樣享有原位階權益。
        </p>
      </>
    ),
  },
  {
    question: "回饋金領取方式？",
    answer:
      "每年一月份累積購買滿 20,000 PV ，整年皆可領取；或要領取當月購買 2,250 PV 含以上，可領取回饋金。",
  },
  {
    question: "PV 點數會過期嗎？",
    answer: "PV 點數不會過期，終身累積。",
  },
  {
    question: "刷卡可以分期嗎？",
    answer: "永豐、台新、中信信用卡，享 3、6 期分期零利率。",
  },
];

export default function Membership() {
  const topTier = MEMBERSHIP_TIERS[MEMBERSHIP_TIERS.length - 1];
  const [activeTab, setActiveTab] = React.useState<'consumer' | 'partner'>('consumer');
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());

  const consumerTiers = [...MEMBERSHIP_TIERS.filter((t) => t.order <= 3), CONSUMER_SMALL_PLATE_TIER];
  // 合夥與代理制度分頁：科長（LV.3）排第一張，後面接小盤督導（LV.4）以上
  const partnerTiers = MEMBERSHIP_TIERS.filter((t) => t.order >= 3);
  const visibleTiers = activeTab === 'consumer' ? consumerTiers : partnerTiers;

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* 導航欄 */}
      <nav
        className="sticky top-16 z-40 bg-white border-b border-border isolate"
        style={{ transform: 'translateZ(0)', WebkitTransform: 'translate3d(0,0,0)' }}
      >
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">會員制度</h1>
          </div>
        </div>
      </nav>

      {/* Hero 標題區 + 位階卡片區：同一塊漸層背景，跟下方權益一覽的白底做出區隔 */}
      <section
        className="pt-14 pb-12 px-4 text-center"
        style={{ background: "linear-gradient(135deg, #F0EAE2, #F5F1ED)" }}
      >
        <div
          className="text-xs font-semibold tracking-[3px] mb-3"
          style={{ color: "#B59A8A" }}
        >
          MEMBERSHIP PROGRAM
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: "#5a4632" }}
        >
          會員位階與升級禮遇
        </h2>
        <p className="text-sm md:text-base mb-10" style={{ color: "#6B6B6B" }}>
          加入即享專屬會員價與終身點數累積，輕鬆升級再享高額回饋與專屬折扣！
        </p>

        {/* 分頁切換：會員消費權益／合夥與代理制度 */}
        <div className="container max-w-5xl mx-auto text-left">
          <div className="flex justify-center gap-2 border-b mb-8" style={{ borderColor: "#E0D4C0" }}>
            <button
              onClick={() => setActiveTab('consumer')}
              className="px-5 py-2.5 text-sm transition-colors"
              style={
                activeTab === 'consumer'
                  ? { color: "#8B6F47", fontWeight: 700, borderBottom: "2px solid #8B6F47" }
                  : { color: "#9c8a76", fontWeight: 500 }
              }
            >
              會員消費權益
            </button>
            <button
              onClick={() => setActiveTab('partner')}
              className="px-5 py-2.5 text-sm transition-colors"
              style={
                activeTab === 'partner'
                  ? { color: "#8B6F47", fontWeight: 700, borderBottom: "2px solid #8B6F47" }
                  : { color: "#9c8a76", fontWeight: 500 }
              }
            >
              合夥與代理制度
            </button>
          </div>

          <div
            className={`grid grid-cols-1 gap-4 ${
              activeTab === 'consumer' ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3 lg:grid-cols-3'
            }`}
          >
            {visibleTiers.map((tier) => {
              const isTop = tier.id === topTier.id;
              const isExpanded = expandedIds.has(tier.id);
              return (
                <div
                  key={tier.id}
                  className="p-6 text-center"
                  style={
                    isTop
                      ? {
                          background: "linear-gradient(160deg, #FBF6EE, #F3E8D8)",
                          border: "1.5px solid #C9A876",
                        }
                      : {
                          background: "#fff",
                          border: "1px solid #E8E4E0",
                        }
                  }
                >
                  <div className="text-xs tracking-wide mb-1" style={{ color: isTop ? "#9c7a3f" : "#B59A8A" }}>
                    LV.{tier.order}
                    {isTop ? " · 最高位階" : ""}
                  </div>
                  <h3
                    className="text-base font-bold mb-4"
                    style={{ color: "#5a4632" }}
                  >
                    {tier.name}
                  </h3>

                  <div className="text-left text-sm space-y-1.5 mb-4" style={{ color: isTop ? "#5a4632" : "#6B6B6B" }}>
                    {tier.id !== 'member' && (
                      <>
                        <div>
                          <span style={{ color: isTop ? "#9c7a3f" : "#C9A876" }}>✦</span> 現金回饋 {tier.commission}
                        </div>
                        <div>
                          <span style={{ color: isTop ? "#9c7a3f" : "#C9A876" }}>✦</span> {activeTab === 'consumer' ? '永久產品折扣' : '產品折扣'} {tier.discount}
                        </div>
                      </>
                    )}
                    {activeTab === 'consumer' &&
                      tier.perks.map((perk, idx) => (
                        <div key={idx}>
                          <span style={{ color: isTop ? "#9c7a3f" : "#C9A876" }}>✦</span> {perk}
                        </div>
                      ))}
                    {activeTab === 'partner' && tier.guidanceGenerations && (
                      <div>
                        <span style={{ color: isTop ? "#9c7a3f" : "#C9A876" }}>✦</span> 輔導獎金領 {tier.guidanceGenerations} 代
                      </div>
                    )}
                  </div>

                  {activeTab === 'consumer' ? (
                    (() => {
                      const reqs = SIMPLE_REQUIREMENTS[tier.id] || [tier.requirements[0]];
                      return tier.id !== 'member' ? (
                        <div
                          className="text-left pt-2.5"
                          style={{ borderTop: "1px dashed #E0D9CD" }}
                        >
                          <div
                            className="text-xs font-semibold mb-1.5 text-center"
                            style={{ color: isTop ? "#9c7a3f" : "#B0A797" }}
                          >
                            升等條件{reqs.length > 1 ? "（符合任一即可）" : ""}
                          </div>
                          <div className="space-y-1">
                            {reqs.map((req, idx) => (
                              <div key={idx} className="flex gap-1.5 text-xs leading-relaxed" style={{ color: "#6B6B6B" }}>
                                <span style={{ color: "#C9A876" }}>✓</span>
                                <span>{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div
                          className="text-xs pt-2.5"
                          style={{ color: isTop ? "#9c7a3f" : "#B0A797", borderTop: "1px dashed #E0D9CD" }}
                        >
                          升等條件｜{reqs[0]}
                        </div>
                      );
                    })()
                  ) : (
                    <>
                      <button
                        onClick={() => toggleExpand(tier.id)}
                        className="text-xs hover:opacity-70 transition-opacity"
                        style={{ color: isTop ? "#9c7a3f" : "#9c7a3f", textDecoration: "underline" }}
                      >
                        {isExpanded ? "收合 ⌃" : "展開詳情 ⌄"}
                      </button>
                      {isExpanded && (
                        <div
                          className="text-left mt-3 pt-3"
                          style={{ borderTop: "1px dashed #E0D9CD" }}
                        >
                          <div className="text-xs font-semibold mb-1.5" style={{ color: "#8B6F47" }}>
                            升等條件{tier.requirements.length > 1 ? "（符合任一即可）" : ""}
                          </div>
                          <div className="space-y-1">
                            {tier.requirements.map((req, idx) => (
                              <div key={idx} className="flex gap-1.5 text-xs leading-relaxed" style={{ color: "#6B6B6B" }}>
                                <span style={{ color: "#C9A876" }}>✓</span>
                                <span>{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 權益一覽比較表 */}
      <section className="px-4 mt-16">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-7">
            <div className="text-xs font-semibold tracking-[3px] mb-2" style={{ color: "#B59A8A" }}>
              COMPARE BENEFITS
            </div>
            <h2
              className="text-2xl font-bold"
              style={{ color: "#5a4632", fontFamily: "'Playfair Display', serif" }}
            >
              權益一覽
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "#E8E4E0" }}>
            <table className="w-full border-collapse bg-white text-sm min-w-[720px]">
              <thead>
                <tr style={{ background: "#F5F1ED" }}>
                  <td className="p-2.5 md:p-4 font-semibold" style={{ color: "#6B6B6B" }}>
                    位階
                  </td>
                  {visibleTiers.map((tier) => {
                    const isTop = tier.id === topTier.id;
                    return (
                      <td
                        key={tier.id}
                        className="p-2.5 md:p-4 text-center font-semibold whitespace-nowrap"
                        style={
                          isTop
                            ? { background: "#F3E8D8", color: "#5a4632" }
                            : { color: "#6B6B6B" }
                        }
                      >
                        {tier.name}
                      </td>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t" style={{ borderColor: "#EEE9E3" }}>
                  <td className="p-2.5 md:p-4" style={{ color: "#8a8a8a" }}>
                    回饋金
                  </td>
                  {visibleTiers.map((tier) => {
                    const isTop = tier.id === topTier.id;
                    return (
                      <td
                        key={tier.id}
                        className="p-2.5 md:p-4 text-center"
                        style={
                          isTop
                            ? { background: "#FBF6EE", color: "#8B6F47", fontWeight: 700 }
                            : {}
                        }
                      >
                        {tier.commission}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-t" style={{ borderColor: "#EEE9E3", background: "#FAFAF8" }}>
                  <td className="p-2.5 md:p-4" style={{ color: "#8a8a8a" }}>
                    產品折扣
                  </td>
                  {visibleTiers.map((tier) => {
                    const isTop = tier.id === topTier.id;
                    return (
                      <td
                        key={tier.id}
                        className="p-2.5 md:p-4 text-center"
                        style={
                          isTop
                            ? { background: "#FBF6EE", color: "#8B6F47", fontWeight: 600 }
                            : {}
                        }
                      >
                        {tier.discount}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-t" style={{ borderColor: "#EEE9E3" }}>
                  <td className="p-2.5 md:p-4" style={{ color: "#8a8a8a" }}>
                    {activeTab === 'consumer' ? '加碼回饋' : '輔導獎金'}
                  </td>
                  {visibleTiers.map((tier) => {
                    const isTop = tier.id === topTier.id;
                    const has =
                      activeTab === 'consumer'
                        ? tier.id === 'consumer-small-plate'
                        : Boolean(tier.guidanceGenerations);
                    return (
                      <td
                        key={tier.id}
                        className="p-2.5 md:p-4 text-center"
                        style={
                          isTop
                            ? { background: "#FBF6EE", color: "#8B6F47", fontWeight: 700 }
                            : { color: has ? "#8B6F47" : "#c9c2b8" }
                        }
                      >
                        {has ? "✓" : "—"}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-center mt-3" style={{ color: "#B59A8A" }}>
            手機版可左右滑動查看完整表格
          </p>
        </div>
      </section>

      {/* 常見問題 FAQ */}
      <section className="mt-16 py-16 px-4" style={{ background: "#F5F1ED" }}>
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs font-semibold tracking-[3px] mb-2" style={{ color: "#B59A8A" }}>
              FAQ
            </div>
            <h2
              className="text-2xl font-bold"
              style={{ color: "#5a4632", fontFamily: "'Playfair Display', serif" }}
            >
              常見問題
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                style={{ borderColor: "#E0D9CD" }}
              >
                <AccordionTrigger
                  className="text-left font-semibold hover:no-underline"
                  style={{ color: "#5a4632" }}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent style={{ color: "#8a7a68" }}>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
