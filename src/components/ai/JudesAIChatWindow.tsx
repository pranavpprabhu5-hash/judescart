'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShoppingBag, 
  Check, 
  ArrowRight, 
  Trash2, 
  Tag, 
  Trophy, 
  Crown, 
  RotateCcw, 
  ExternalLink,
  Gift
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types/product';
import { AIMessage, generateAIResponse } from '@/lib/judes-ai-brain';

interface JudesAIChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const STARTER_PROMPTS = [
  { label: '💎 Unlock Platinum Lucky Draw', query: 'How do I qualify for the Platinum Lucky Draw?' },
  { label: '👑 Brand JUDES Bumper Jackpot', query: 'Show Brand JUDES items for the Bumper Draw' },
  { label: '🔥 Best Offers & Price Drops', query: 'What items currently have special offers and discounts?' },
  { label: '🎧 SonicPro ANC Studio Headphones', query: 'Tell me about the SonicPro noise cancelling headphones' },
  { label: '🧥 Luxury Cashmere & Winter Coats', query: 'Show me cashmere sweaters and tailored coats' },
  { label: '🎟️ Active Promo Codes', query: 'Do you have any active discount promo codes?' },
];

export function JudesAIChatWindow({ isOpen, onClose }: JudesAIChatWindowProps) {
  const { 
    products, 
    cartSummary, 
    currency, 
    formatAmount, 
    judesCoins, 
    vipTier, 
    addToCart, 
    applyPromo,
    openLuckyDraw,
    openCart,
    openDailyMystery
  } = useStore();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);

  // Initial Welcome Message
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Hello! I am **JudesAI**, your personal luxury concierge and shopping stylist.\n\nI can help you discover items from our curated departments, check your eligibility for **Sunday Lucky Draws (Platinum, Gold & Silver)**, or find signature **Brand JUDES** products to enter the **Grand Bumper Jackpot**.\n\nHow may I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionPills: [
        { label: '💎 Lucky Draw Rules', query: 'How do lucky draws work?' },
        { label: '👑 Bumper Draw Info', query: 'Tell me about the bumper jackpot' },
        { label: '🔥 View Hot Deals', query: 'Show discounted items with offers' },
        { label: '🎟️ Promo Codes', query: 'What promo codes can I use?' },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 100);
    }
  }, [isOpen, messages]);

  // Handle Send Message
  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text || isTyping) return;

    const userMsg: AIMessage = {
      id: String(Date.now()),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate realistic AI deliberation
    setTimeout(() => {
      const response = generateAIResponse(text, {
        products,
        cartSummary,
        currency,
        formatAmount,
        judesCoins,
        vipTier,
      });

      setMessages((prev) => [...prev, response]);
      setIsTyping(false);

      // Handle drawer trigger if relevant
      if (response.openDrawer === 'luckyDraw') {
        openLuckyDraw();
      } else if (response.openDrawer === 'cart') {
        openCart();
      } else if (response.openDrawer === 'mystery') {
        openDailyMystery();
      }
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const color = product.colors?.[0]?.name || 'Standard';
    const size = product.sizes?.[0]?.name || 'Standard';
    addToCart(product, color, size, 1);

    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleApplyPromo = (code: string) => {
    const success = applyPromo(code);
    if (success) {
      setAppliedPromoCode(code);
      setTimeout(() => setAppliedPromoCode(null), 3500);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: `Conversation cleared. I am ready to help you discover luxury items, compare materials, or check your Lucky Draw entries!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionPills: [
          { label: '💎 Lucky Draw Rules', query: 'How do lucky draws work?' },
          { label: '👑 Bumper Draw Info', query: 'Tell me about the bumper jackpot' },
          { label: '🔥 Hot Offers', query: 'Show items with special offers' },
        ],
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6 z-50 sm:w-[440px] h-[580px] sm:h-[640px] max-h-[85vh] rounded-3xl overflow-hidden flex flex-col bg-[#071328]/95 text-white border border-blue-500/40 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200">
      
      {/* 1. TOP CONCIERGE HEADER */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-[#0B1E3D] via-[#0E2A56] to-[#12366E] border-b border-blue-500/20 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-md shrink-0 border border-white/30">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B1E3D]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white">JudesAI</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                Concierge
              </span>
            </div>
            <span className="text-[10px] text-cyan-200/80 font-medium block">
              Online • Real-Time Store Knowledge
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Close concierge"
            aria-label="Close concierge"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. LIVE STORE CONTEXT STATUS STRIP */}
      <div className="px-4 py-1.5 bg-[#050D1C]/90 border-b border-white/5 flex items-center justify-between text-[11px] text-stone-300 shrink-0">
        <div className="flex items-center gap-2">
          <span>Currency: <strong className="text-white font-bold">{currency}</strong></span>
          <span>•</span>
          <span>Coins: <strong className="text-amber-300 font-bold">{judesCoins}</strong></span>
        </div>
        <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>VIP {vipTier.toUpperCase()}</span>
        </div>
      </div>

      {/* 3. MESSAGE STREAM CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
          >
            {/* Message Bubble */}
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 sm:p-4 text-xs leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs'
                  : 'bg-white/10 backdrop-blur-md text-stone-100 border border-white/15 rounded-bl-xs'
              }`}
            >
              {/* Render Markdown-like content cleanly */}
              <div className="space-y-2 whitespace-pre-line font-sans">
                {msg.text.split('\n\n').map((paragraph, pIdx) => {
                  // If heading
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h4 key={pIdx} className="font-extrabold text-sm text-cyan-300 tracking-tight">
                        {paragraph.replace('### ', '')}
                      </h4>
                    );
                  }
                  return (
                    <p key={pIdx} className="text-stone-200">
                      {paragraph.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </p>
                  );
                })}
              </div>

              {/* Highlighted Promo Code Box */}
              {msg.highlightPromo && (
                <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-400/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-300 shrink-0" />
                    <div>
                      <span className="font-mono font-black text-amber-300 text-xs tracking-wider block">
                        {msg.highlightPromo.code}
                      </span>
                      <span className="text-[10px] text-stone-300">
                        {msg.highlightPromo.discountText}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApplyPromo(msg.highlightPromo!.code)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
                  >
                    {appliedPromoCode === msg.highlightPromo.code ? 'Applied! ✓' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            {/* Embedded Product Recommendation Cards */}
            {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
              <div className="w-full space-y-2 pt-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Curated Recommendations ({msg.suggestedProducts.length})</span>
                </span>
                
                <div className="grid grid-cols-1 gap-2">
                  {msg.suggestedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-2.5 rounded-xl bg-black/40 border border-white/15 hover:border-blue-400/50 transition-all duration-200 flex items-center gap-3"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-stone-900 shrink-0 border border-white/10">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        {product.brand === 'JUDES' && (
                          <span className="absolute top-0.5 left-0.5 px-1 py-0.2 rounded text-[8px] font-black bg-amber-400 text-slate-950">
                            JUDES
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${product.slug}`}
                          className="font-bold text-white hover:text-cyan-300 transition-colors line-clamp-1 block text-xs"
                          title={product.name}
                        >
                          {product.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-black text-amber-300 text-xs">
                            {formatAmount(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-stone-400 line-through">
                              {formatAmount(product.originalPrice)}
                            </span>
                          )}
                          {product.drawTier && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                              {product.drawTier}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 1-Click Quick Add Button */}
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={`p-2 rounded-lg text-xs font-bold shrink-0 transition-all duration-200 ${
                          addedItemMap[product.id]
                            ? 'bg-emerald-500 text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                        title="Add directly to cart"
                      >
                        {addedItemMap[product.id] ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <ShoppingBag className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Action Follow-Up Pills */}
            {msg.actionPills && msg.actionPills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {msg.actionPills.map((pill, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(pill.query)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 hover:bg-white/20 text-cyan-200 border border-white/15 transition-colors cursor-pointer"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            )}

            <span className="text-[9px] text-stone-400 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {/* Typing Bubble Animation */}
        {isTyping && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/10 text-stone-300 border border-white/10 w-24">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. STARTER PROMPT CAROUSEL (Above Input) */}
      <div className="px-3 py-1.5 bg-[#050D1C] border-t border-white/10 overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none">
        {STARTER_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt.query)}
            className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 whitespace-nowrap transition-colors"
          >
            {prompt.label}
          </button>
        ))}
      </div>

      {/* 5. INTERACTIVE QUERY INPUT BAR */}
      <div className="p-3 bg-[#08162E] border-t border-blue-500/20 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-black/50 rounded-2xl px-3 py-1.5 border border-white/15 focus-within:border-blue-400 transition-colors"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask JudesAI about styling, lucky draws, or offers..."
            className="flex-1 bg-transparent text-xs text-white placeholder-stone-400 focus:outline-hidden py-1.5"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shrink-0 shadow-sm"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[9px] text-stone-400 px-1 mt-1.5">
          <span>Powered by JudesCart Intelligence</span>
          <span>Press Enter to send</span>
        </div>
      </div>

    </div>
  );
}
