import { Product } from '@/types/product';
import { CartSummary } from '@/types/cart';
import { CurrencyCode } from '@/types/currency';

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedProducts?: Product[];
  actionPills?: Array<{ label: string; query: string }>;
  highlightPromo?: { code: string; discountText: string; description: string };
  openDrawer?: 'cart' | 'luckyDraw' | 'mystery';
}

interface BrainContext {
  products: Product[];
  cartSummary: CartSummary;
  currency: CurrencyCode;
  formatAmount: (amount: number) => string;
  judesCoins: number;
  vipTier: string;
}

export function generateAIResponse(
  userQuery: string,
  context: BrainContext
): AIMessage {
  const q = userQuery.toLowerCase().trim();
  const { products, cartSummary, formatAmount, judesCoins, vipTier } = context;

  const currentCartTotal = cartSummary.total;
  const isINR = context.currency === 'INR';
  const platinumThreshold = isINR ? 5000 : 500;
  const goldThreshold = isINR ? 2500 : 250;
  const silverThreshold = isINR ? 1000 : 100;

  // Helper to find products by keywords
  const findProducts = (keywords: string[], limit = 3): Product[] => {
    return products
      .filter((p) => {
        const text = `${p.name} ${p.category} ${p.tagline} ${p.brand || ''} ${p.description}`.toLowerCase();
        return keywords.some((kw) => text.includes(kw.toLowerCase()));
      })
      .slice(0, limit);
  };

  // 1. LUCKY DRAW & TICKET ELIGIBILITY
  if (
    q.includes('lucky draw') ||
    q.includes('platinum') ||
    q.includes('gold') ||
    q.includes('silver') ||
    q.includes('ticket') ||
    q.includes('win') ||
    q.includes('raffle')
  ) {
    let spendAdvice = '';
    let targetTier = '';
    let needed = 0;

    if (currentCartTotal >= platinumThreshold) {
      spendAdvice = `🎉 Outstanding news! Your current cart (${formatAmount(currentCartTotal)}) exceeds the threshold for a **guaranteed Platinum Draw ticket** (eligible to win iPhone 16 Pro Max & M3 MacBooks)!`;
    } else if (currentCartTotal >= goldThreshold) {
      needed = platinumThreshold - currentCartTotal;
      targetTier = 'Platinum';
      spendAdvice = `✨ You currently qualify for the **Gold Draw** (Apple Watch & Sony XM5)! Add just **${formatAmount(needed)}** more to unlock a top-tier **Platinum Draw ticket**.`;
    } else if (currentCartTotal >= silverThreshold) {
      needed = goldThreshold - currentCartTotal;
      targetTier = 'Gold';
      spendAdvice = `🎟️ You currently qualify for the **Silver Draw** (AirPods & Sunday Cash Raffles)! Add **${formatAmount(needed)}** more to upgrade to **Gold Tier**.`;
    } else {
      needed = silverThreshold - currentCartTotal;
      targetTier = 'Silver';
      spendAdvice = `🛒 Your cart is currently at ${formatAmount(currentCartTotal)}. Add just **${formatAmount(needed)}** more to unlock your first guaranteed **Silver Lucky Draw entry**!`;
    }

    const recommended = products
      .filter((p) => p.isFeatured || p.drawTier === 'platinum')
      .slice(0, 3);

    return {
      id: String(Date.now()),
      sender: 'ai',
      text: `### JudesCart Weekly Lucky Draw Hub 🏆\n\nEvery order automatically earns verified entry tickets drawn every Sunday:\n\n* 💎 **Platinum Tier** (${formatAmount(platinumThreshold)}+): Flagship Apple iPhone 16 Pro, MacBook Pro & 4K OLEDs\n* 🥇 **Gold Tier** (${formatAmount(goldThreshold)}+): Apple Watch Ultra 2 & Sony WH-1000XM5\n* 🥈 **Silver Tier** (${formatAmount(silverThreshold)}+): Apple AirPods Pro & Sunday Cash Pools\n\n${spendAdvice}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedProducts: recommended,
      actionPills: [
        { label: '👑 Tell me about Bumper Draw', query: 'Tell me about the Bumper Draw' },
        { label: '🛍️ Boost Cart Spend', query: 'Show best products to reach Platinum draw' },
        { label: '🎰 Open Draw Wheel', query: 'Open the lucky draw wheel' },
      ],
      openDrawer: q.includes('wheel') ? 'luckyDraw' : undefined,
    };
  }

  // 2. BUMPER DRAW (BRAND JUDES EXCLUSIVE)
  if (
    q.includes('bumper') ||
    q.includes('judes brand') ||
    q.includes('car') ||
    q.includes('suv') ||
    q.includes('trip') ||
    q.includes('vacation') ||
    q.includes('lakh')
  ) {
    const judesBrandItems = products.filter((p) => p.brand === 'JUDES').slice(0, 3);

    return {
      id: String(Date.now()),
      sender: 'ai',
      text: `### The Grand Bumper Draw (Brand JUDES Exclusive) 👑\n\nHeld every **6 to 12 months**, the Grand Bumper Draw is our most prestigious event:\n\n* 🚗 **Jackpot 1**: Luxury SUV & Vehicle\n* ✈️ **Jackpot 2**: 7-Day All-Expenses-Paid European Holiday\n* 💰 **Jackpot 3**: ₹5,00,000 Direct Mega Cash Prize\n\n**Qualification Rule**: Simply purchase *any* product from JudesCart’s signature in-house label **"Brand JUDES"** to receive verified Bumper Draw raffle entries. Here are our top-rated Brand JUDES picks:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedProducts: judesBrandItems,
      actionPills: [
        { label: '👗 View Cashmere & Apparel', query: 'Show cashmere and winter clothing' },
        { label: '🎧 View SonicPro Headphones', query: 'Tell me about SonicPro headphones' },
        { label: '💼 View Italian Leather Bags', query: 'Show leather bags and totes' },
      ],
    };
  }

  // 3. SPECIAL OFFERS & DEALS
  if (
    q.includes('offer') ||
    q.includes('discount') ||
    q.includes('sale') ||
    q.includes('deal') ||
    q.includes('cheap') ||
    q.includes('save')
  ) {
    const discounted = products
      .filter((p) => p.originalPrice && p.originalPrice > p.price)
      .slice(0, 3);

    return {
      id: String(Date.now()),
      sender: 'ai',
      text: `### Active Offers & Flash Deals 🔥\n\nHere are our top limited-time price drops across audio, fashion, and lifestyle. Each purchase also comes with bonus JudesCoins and Lucky Draw entry:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedProducts: discounted,
      highlightPromo: {
        code: 'WELCOME10',
        discountText: '10% OFF Sitewide',
        description: 'Applies on your entire order with no minimum spend.',
      },
      actionPills: [
        { label: '🎟️ Promo code for free shipping?', query: 'Are there any free shipping codes?' },
        { label: '🪙 How do I use JudesCoins?', query: 'How do I redeem JudesCoins?' },
      ],
    };
  }

  // 4. AUDIO & HEADPHONES (SONICPRO)
  if (
    q.includes('headphone') ||
    q.includes('audio') ||
    q.includes('sound') ||
    q.includes('sonicpro') ||
    q.includes('anc') ||
    q.includes('noise cancel')
  ) {
    const audioItems = findProducts(['sonicpro', 'headphones', 'electronics', 'lamp'], 2);

    return {
      id: String(Date.now()),
      sender: 'ai',
      text: `### Audiophile Sound & Studio Gear 🎧\n\nOur flagship recommendation is the **SonicPro Wireless ANC Studio Headphones**:\n\n* **Acoustic Fidelity**: Custom 40mm beryllium diaphragms engineered in Munich, Germany.\n* **Noise Isolation**: 45dB hybrid active noise cancellation silences commutes and flights.\n* **Battery Life**: 45+ hours on a single charge with fast USB-C Qi charging.\n* **Bumper Eligible**: As a Brand JUDES product, it automatically qualifies for both the **Platinum Weekly Draw** and the **Grand Bumper Draw**!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedProducts: audioItems,
      actionPills: [
        { label: '💡 Check AuraGlow Smart Lamp', query: 'Tell me about the desk lamp' },
        { label: '🏆 What prizes can I win with this?', query: 'What draw tier does SonicPro qualify for?' },
      ],
    };
  }

  // 5. APPAREL, CASHMERE & WINTER COATS
  if (
    q.includes('cashmere') ||
    q.includes('coat') ||
    q.includes('sweater') ||
    q.includes('clothes') ||
    q.includes('apparel') ||
    q.includes('fashion') ||
    q.includes('winter') ||
    q.includes('outfit')
  ) {
    const apparelItems = findProducts(['cashmere', 'coat', 'apparel', 'boot'], 3);

    return {
      id: String(Date.now()),
      sender: 'ai',
      text: `### Curated Luxury Wardrobe Staples 🧥\n\nInvest in heirloom-grade garments handcrafted for warmth, silhouette, and longevity:\n\n* **Mongolian Cashmere Cardigan**: 100% Grade-A 2-ply Mongolian cashmere with custom horn buttons.\n* **Virgin Melton Cocoon Coat**: Sculptural architectural tailoring made in Lyon, France (rated down to -10°C).\n* **Lugged Chelsea Boot**: Weatherproof waxed suede with lightweight Italian Vibram Vi-Lite soles.\n\nHere are the top curated pieces for your wardrobe:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedProducts: apparelItems,
      actionPills: [
        { label: '👢 Show Footwear', query: 'Show Chelsea boots and footwear' },
        { label: '👜 Show Italian Bags', query: 'Show leather bags and totes' },
      ],
    };
  }

  // 6. LEATHER GOODS & BAGS
  if (
    q.includes('bag') ||
    q.includes('tote') ||
    q.includes('leather') ||
    q.includes('wallet') ||
    q.includes('florence')
  ) {
    const leatherItems = findProducts(['tote', 'leather', 'sella'], 2);

    return {
      id: String(Date.now()),
      sender: 'ai',
      text: `### Tuscan Leather Artisanship 👜\n\nCrafted in Florence, Italy, using vegetable-tanned full-grain calfskin and brushed brass hardware. Features an interior padded 15-inch laptop compartment and reinforced bridle leather handles that patina beautifully over decades:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedProducts: leatherItems,
      actionPills: [
        { label: '👢 Matching Chelsea Boots', query: 'Show matching boots for leather tote' },
        { label: '💎 Lucky Draw Eligibility', query: 'Does the leather tote qualify for Platinum draw?' },
      ],
    };
  }

  // 7. PROMO CODES & COUPONS
  if (
    q.includes('promo') ||
    q.includes('coupon') ||
    q.includes('voucher') ||
    q.includes('code')
  ) {
    return {
      id: String(Date.now()),
      sender: 'ai',
      text: `### Verified JudesCart Promo Codes 🎟️\n\nHere are active promotion codes you can use at checkout right now:\n\n* 🏷️ **\`WELCOME10\`**: 10% off your entire order (No minimum spend)\n* 🚀 **\`FREESHIP\`**: Free express priority shipping on any cart\n* 💎 **\`VIPCLUB\`**: Flat 15% discount for verified loyalty club members\n\nYou can click below to automatically apply **WELCOME10** to your cart!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      highlightPromo: {
        code: 'WELCOME10',
        discountText: '10% OFF Sitewide',
        description: 'Automatically deducts 10% from your order total at checkout.',
      },
      actionPills: [
        { label: '🛍️ View My Cart', query: 'Show my cart summary' },
        { label: '🪙 How many coins do I have?', query: 'Check my JudesCoins balance' },
      ],
    };
  }

  // 8. JUDESCOINS & REWARDS
  if (
    q.includes('coin') ||
    q.includes('reward') ||
    q.includes('points') ||
    q.includes('loyalty') ||
    q.includes('mystery box')
  ) {
    return {
      id: String(Date.now()),
      sender: 'ai',
      text: `### JudesCoins Rewards & VIP Club 🪙\n\n* **Your Balance**: You currently hold **${judesCoins} JudesCoins**!\n* **VIP Status**: **${vipTier.toUpperCase()} Tier** with enhanced coin accrual rates.\n* **How to Earn**: Earn 10 Coins per $1 spent, plus daily streaks via the **Daily Mystery Vault** (up to 10 free coins daily).\n* **How to Redeem**: Use coins for direct checkout discounts (100 coins = $1.00 off) or spin the Lucky Draw Wheel!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionPills: [
        { label: '🎁 Open Daily Mystery Vault', query: 'Open the daily mystery box' },
        { label: '🎰 Spin Lucky Draw Wheel', query: 'Open lucky draw wheel' },
      ],
      openDrawer: q.includes('mystery') ? 'mystery' : undefined,
    };
  }

  // 9. SHIPPING & RETURNS
  if (
    q.includes('shipping') ||
    q.includes('delivery') ||
    q.includes('return') ||
    q.includes('refund') ||
    q.includes('dispatch')
  ) {
    return {
      id: String(Date.now()),
      sender: 'ai',
      text: `### Shipping, Dispatch & Returns 🚚\n\n* **Free Shipping**: Complimentary insured express delivery on orders over **$99 / ₹5,000**.\n* **Fast Dispatch**: Orders placed before 3:00 PM EST ship same-day with live tracking.\n* **30-Day Easy Returns**: Enjoy hassle-free 30-day returns on unworn apparel, electronics, and accessories in original packaging with prepaid return labels.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionPills: [
        { label: '🛍️ Shop Featured Items', query: 'Show all featured products' },
        { label: '🏆 What about lucky draw tickets?', query: 'How do lucky draws work?' },
      ],
    };
  }

  // 10. CART SUMMARY / STATUS
  if (q.includes('cart') || q.includes('checkout') || q.includes('total')) {
    return {
      id: String(Date.now()),
      sender: 'ai',
      text: `### Your Current Cart Status 🛒\n\n* **Subtotal**: ${formatAmount(cartSummary.subtotal)}\n* **Estimated Total**: **${formatAmount(cartSummary.total)}**\n* **Lucky Draw Tier**: ${
        cartSummary.total >= platinumThreshold
          ? '💎 Platinum Draw Qualified!'
          : cartSummary.total >= goldThreshold
          ? '🥇 Gold Draw Qualified!'
          : cartSummary.total >= silverThreshold
          ? '🥈 Silver Draw Qualified!'
          : `Add ${formatAmount(silverThreshold - cartSummary.total)} more for Silver Draw`
      }\n\nWould you like to review items in your cart or proceed to checkout?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      openDrawer: 'cart',
      actionPills: [
        { label: '💎 Boost to next draw tier', query: 'Show products to qualify for next lucky draw tier' },
        { label: '🏷️ Active coupon codes', query: 'Show promo codes' },
      ],
    };
  }

  // 11. DEFAULT FALLBACK / STYLING CONCIERGE
  const topRecommendations = products.filter((p) => p.isFeatured).slice(0, 3);

  return {
    id: String(Date.now()),
    sender: 'ai',
    text: `### JudesAI Concierge Assistance ✨\n\nI can help you explore our luxury collection, check sizing and materials, or optimize your cart to unlock **Platinum Lucky Draw tickets** and the **Brand JUDES Bumper Jackpot**.\n\nHere are some of our most celebrated flagship arrivals today:`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedProducts: topRecommendations,
    actionPills: [
      { label: '🏆 How do Lucky Draws work?', query: 'Explain the lucky draw tiers' },
      { label: '👑 Brand JUDES Bumper Draw', query: 'Tell me about the bumper draw' },
      { label: '🔥 What items are on offer?', query: 'Show items with special offers' },
      { label: '🎧 SonicPro ANC Studio Audio', query: 'Tell me about SonicPro headphones' },
    ],
  };
}
