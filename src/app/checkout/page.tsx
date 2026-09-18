'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { SHIPPING_METHODS } from '@/lib/mock-data';
import { ShippingAddress, ShippingMethodOption } from '@/types/user';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Gift,
  User,
} from 'lucide-react';
import { cn, calculatePurchaseCoins } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartSummary,
    clearCart,
    formatAmount,
    currency,
    detectedLocation,
    addOrder,
    user,
    isLoggedIn,
    openAuthModal,
    appliedPromo,
    judesCoins,
    redeemCoinsDirect,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redeemedCoins, setRedeemedCoins] = useState<number>(0);

  // Step 1: Shipping Form State
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: user.savedAddresses[0]?.firstName || (isLoggedIn && user.name ? user.name.split(' ')[0] : ''),
    lastName: user.savedAddresses[0]?.lastName || (isLoggedIn && user.name ? user.name.split(' ').slice(1).join(' ') : ''),
    email: user.email || '',
    phone: user.phone || user.savedAddresses[0]?.phone || '',
    street: user.savedAddresses[0]?.street || '',
    apartment: user.savedAddresses[0]?.apartment || '',
    city: user.savedAddresses[0]?.city || '',
    state: user.savedAddresses[0]?.state || '',
    postalCode: user.savedAddresses[0]?.postalCode || '',
    country: user.savedAddresses[0]?.country || detectedLocation?.countryName || 'United States',
  });

  // Step 2: Shipping Method
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethodOption>(SHIPPING_METHODS[0]);

  // Step 3: Payment Form State
  const [paymentType, setPaymentType] = useState<'card' | 'apple_pay' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(isLoggedIn && user.name ? user.name.toUpperCase() : '');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Synchronize shipping fields when user logs in
  useEffect(() => {
    if (isLoggedIn && user && user.email) {
      const defaultAddr = user.savedAddresses[0];
      const names = user.name ? user.name.split(' ') : ['Customer', 'Shopper'];
      setShippingAddress((prev) => ({
        firstName: defaultAddr?.firstName || names[0] || prev.firstName,
        lastName: defaultAddr?.lastName || names.slice(1).join(' ') || prev.lastName,
        email: user.email || defaultAddr?.email || prev.email,
        phone: user.phone || defaultAddr?.phone || prev.phone,
        street: defaultAddr?.street || prev.street,
        apartment: defaultAddr?.apartment || prev.apartment,
        city: defaultAddr?.city || prev.city,
        state: defaultAddr?.state || prev.state,
        postalCode: defaultAddr?.postalCode || prev.postalCode,
        country: defaultAddr?.country || prev.country,
      }));
      setCardHolder((user.name || 'CUSTOMER').toUpperCase());
    }
  }, [user, isLoggedIn]);

  // Luxury Gift Packaging State
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [hidePriceReceipt, setHidePriceReceipt] = useState(false);
  const [giftBoxType, setGiftBoxType] = useState<'midnight_matte' | 'wooden_atelier' | 'emerald_velvet'>('midnight_matte');
  const [giftRibbonColor, setGiftRibbonColor] = useState<'royal_blue' | 'champagne_gold' | 'scarlet_silk'>('royal_blue');
  const [hasWaxSeal, setHasWaxSeal] = useState(true);

  const giftWrapFee = isGiftWrap
    ? giftBoxType === 'wooden_atelier'
      ? 7.99
      : giftBoxType === 'emerald_velvet'
      ? 5.99
      : 4.99
    : 0;

  // If cart is empty and user navigates here directly, handle gracefully
  useEffect(() => {
    if (cart.length === 0) {
      // Don't redirect immediately if they just completed an order
    }
  }, [cart]);

  const handleAutofillDemo = () => {
    setShippingAddress({
      firstName: 'Marcus',
      lastName: 'Sterling',
      email: 'customer@judes-cart.com',
      phone: '+1 (555) 234-8910',
      street: '742 Evergreen Terrace',
      apartment: 'Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
    });
    setCardHolder('MARCUS STERLING');
  };

  const coinDiscount = redeemedCoins / 20;
  const maxRedeemableCoins = Math.min(judesCoins, Math.floor((cartSummary.subtotal * 0.5) * 20));

  const calculateFinalTotal = () => {
    const shippingCost = selectedShipping.price;
    const effectiveShipping = cartSummary.isFreeShippingUnlocked && selectedShipping.id === 'standard' ? 0 : shippingCost;
    const total = cartSummary.subtotal - cartSummary.discount - coinDiscount + effectiveShipping + cartSummary.estimatedTax + giftWrapFee;
    return Math.max(0, total);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    const effectiveShippingCost = cartSummary.isFreeShippingUnlocked && selectedShipping.id === 'standard'
      ? 0
      : selectedShipping.price;

    const orderItems = cart.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      image: item.image,
      color: item.color,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
    }));

    const newOrder = await api.createOrder({
      items: orderItems,
      subtotal: cartSummary.subtotal,
      discount: cartSummary.discount + coinDiscount,
      shipping: effectiveShippingCost,
      tax: cartSummary.estimatedTax,
      total: calculateFinalTotal(),
      currency: currency,
      coinsEarned: calculatePurchaseCoins(calculateFinalTotal()),
      shippingAddress,
      shippingMethod: selectedShipping,
      paymentMethod: {
        type: paymentType,
        last4: cardNumber.replace(/\s+/g, '').slice(-4) || '4242',
        brand: 'Visa',
      },
      estimatedDelivery: selectedShipping.estimatedDays,
      giftPackaging: {
        enabled: isGiftWrap,
        note: isGiftWrap && giftNote.trim() ? giftNote.trim() : undefined,
        hidePriceReceipt: isGiftWrap ? hidePriceReceipt : false,
        fee: giftWrapFee,
        boxType: giftBoxType,
        ribbonColor: giftRibbonColor,
        waxSeal: hasWaxSeal ? 'JudesCart Crest Seal' : undefined,
      },
    });

    if (redeemedCoins > 0) {
      redeemCoinsDirect(redeemedCoins);
    }

    addOrder(newOrder);
    clearCart();

    // Store latest order id in sessionStorage for receipt view
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('aura_latest_order_id', newOrder.id);
    }

    setIsSubmitting(false);
    router.push(`/checkout/success?orderId=${newOrder.id}`);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 dark:text-slate-600 stroke-[1.2]" />
        <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-white tracking-tight">Your bag is empty</h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">There are no items to checkout.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-950 text-white text-xs font-medium hover:bg-stone-800 transition-colors"
        >
          <span>Return to Collection</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Checkout Stepper */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-200 -z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#0066FF] transition-all duration-300 -z-0"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center bg-[#F8FAFC] px-3">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                step >= 1 ? 'bg-[#0066FF] text-white shadow-sm shadow-blue-500/25' : 'bg-slate-200 text-slate-500'
              )}
            >
              1
            </div>
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mt-1.5">
              Shipping
            </span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center bg-[#F8FAFC] px-3">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                step >= 2 ? 'bg-[#0066FF] text-white shadow-sm shadow-blue-500/25' : 'bg-slate-200 text-slate-500'
              )}
            >
              2
            </div>
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mt-1.5">
              Delivery
            </span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center bg-[#F8FAFC] px-3">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                step === 3 ? 'bg-[#0066FF] text-white shadow-sm shadow-blue-500/25' : 'bg-slate-200 text-slate-500'
              )}
            >
              3
            </div>
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mt-1.5">
              Payment
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Multi-Step Forms (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Customer Sign-In Prompt or Logged-In Badge */}
              {!isLoggedIn ? (
                <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Already have a JudesCart account?</p>
                      <p className="text-[11px] text-slate-500">Sign in to load saved addresses &amp; earn points on this order.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Checking out as <strong>{user.name}</strong> ({user.email})</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                    VIP Linked
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="font-sans text-lg font-bold text-[#0A192F]">Delivery Destination</h2>
                  <p className="text-xs text-slate-500">Enter where you would like your JudesCart parcels delivered.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAutofillDemo}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#0066FF] hover:text-[#0066FF] text-slate-700 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>Autofill Demo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={shippingAddress.firstName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                  required
                />
                <Input
                  label="Last Name"
                  value={shippingAddress.lastName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Street Address"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Apartment / Suite"
                  value={shippingAddress.apartment}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, apartment: e.target.value })}
                />
                <Input
                  label="City"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  required
                />
                <Input
                  label="Postal / ZIP Code"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  required
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  className="px-8 bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold flex items-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <span>Continue to Delivery</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: SHIPPING METHOD */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="font-sans text-lg font-bold text-[#0A192F]">Select Shipping Service</h2>
                <p className="text-xs text-slate-500">Every JudesCart order is packed in custom protective packaging with tracking.</p>
              </div>

              <div className="space-y-3">
                {SHIPPING_METHODS.map((method) => {
                  const isFree = cartSummary.isFreeShippingUnlocked && method.id === 'standard';
                  const priceDisplay = isFree || method.price === 0 ? 'Complimentary' : formatAmount(method.price);
                  const isSelected = selectedShipping.id === method.id;

                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedShipping(method)}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between',
                        isSelected
                          ? 'border-[#0066FF] bg-blue-50/40 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'w-4 h-4 rounded-full border flex items-center justify-center mt-1 transition-colors',
                            isSelected ? 'border-[#0066FF] bg-[#0066FF]' : 'border-slate-300'
                          )}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{method.name}</span>
                            <span className="text-xs text-slate-500">({method.estimatedDays})</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{method.description}</p>
                        </div>
                      </div>

                      <span className="text-sm font-bold text-slate-900 shrink-0 ml-4">
                        {priceDisplay}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Deluxe Atelier Gift Packaging Studio */}
              <div className="p-4 sm:p-5 rounded-2xl border border-purple-200/80 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/70 via-indigo-50/40 to-slate-50 dark:from-purple-950/20 dark:to-slate-900/40 space-y-4">
                <div className="flex items-start justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGiftWrap}
                      onChange={(e) => setIsGiftWrap(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0066FF] focus:ring-[#0066FF] border-slate-300"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>Luxury Atelier Gift Packaging Studio (+{formatAmount(giftWrapFee || 4.99)})</span>
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Curated packaging with handcrafted boxes, satin ribbons, hand-poured wax seal, and calligraphy card.
                      </p>
                    </div>
                  </label>
                  <span className="text-xs font-bold text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80 px-2.5 py-0.5 rounded-full shrink-0 border border-purple-200 dark:border-purple-800">
                    Bespoke Atelier
                  </span>
                </div>

                {isGiftWrap && (
                  <div className="pt-3 border-t border-purple-200/60 dark:border-purple-800/40 space-y-4 animate-in fade-in">
                    {/* Box Type Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                        1. Select Luxury Presentation Box
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'midnight_matte', name: 'Midnight Navy Box', fee: 4.99, desc: 'Matte magnetic finish' },
                          { id: 'wooden_atelier', name: 'Cedar Keepsake Chest', fee: 7.99, desc: 'Handcrafted solid cedar' },
                          { id: 'emerald_velvet', name: 'Emerald Velvet Box', fee: 5.99, desc: 'Plush royal emerald wrap' },
                        ].map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setGiftBoxType(b.id as any)}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              giftBoxType === b.id
                                ? 'border-purple-500 bg-purple-100/60 dark:bg-purple-950/60 shadow-xs ring-2 ring-purple-400/40'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span>{b.name}</span>
                              <span className="text-purple-600 dark:text-purple-400 font-mono text-[11px]">{formatAmount(b.fee)}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block mt-0.5">{b.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ribbon Color Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                        2. Ribbon Finish
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'royal_blue', name: 'Royal Blue Satin', color: 'bg-blue-600' },
                          { id: 'champagne_gold', name: '24K Champagne Gold', color: 'bg-amber-400' },
                          { id: 'scarlet_silk', name: 'Scarlet Crimson Silk', color: 'bg-rose-600' },
                        ].map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setGiftRibbonColor(r.id as any)}
                            className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                              giftRibbonColor === r.id
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 ring-2 ring-purple-400/40 font-bold'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded-full ${r.color} shrink-0 shadow-xs`} />
                            <span className="text-xs truncate">{r.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Wax Seal Toggle */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <span>✨</span> Hand-Poured Wax Seal Stamp
                        </span>
                        <p className="text-[10px] text-slate-500">
                          Authentic JudesCart monogram crest pressed in metallic gold sealing wax
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasWaxSeal(!hasWaxSeal)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          hasWaxSeal
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        {hasWaxSeal ? 'Included ✓' : 'Add Seal'}
                      </button>
                    </div>

                    {/* Greeting Note */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">Calligraphy Greeting Card Note</label>
                        <span className="text-[11px] text-slate-400">{giftNote.length}/150</span>
                      </div>
                      <textarea
                        rows={2}
                        maxLength={150}
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value)}
                        placeholder="e.g. Happy Birthday! Wishing you endless joy, wonder, and milestones ahead..."
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-400 text-slate-800 dark:text-white"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={hidePriceReceipt}
                        onChange={(e) => setHidePriceReceipt(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-[#0066FF] border-slate-300"
                      />
                      <span>Omit prices on packing slip (Send as Gift Receipt)</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Address</span>
                </Button>

                <Button
                  onClick={() => setStep(3)}
                  className="px-8 bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold flex items-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT GATEWAY SIMULATION */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="font-sans text-lg font-bold text-[#0A192F]">Secure JudesCart Payment</h2>
                  <p className="text-xs text-slate-500">Encrypted 256-bit simulated gateway transaction.</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>PCI-DSS Level 1</span>
                </div>
              </div>

              {/* Payment Type Selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentType('card')}
                  className={cn(
                    'py-2.5 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2',
                    paymentType === 'card'
                      ? 'border-[#0066FF] bg-[#0066FF] text-white shadow-sm shadow-blue-500/20'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Credit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType('apple_pay')}
                  className={cn(
                    'py-2.5 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2',
                    paymentType === 'apple_pay'
                      ? 'border-[#0066FF] bg-[#0066FF] text-white shadow-sm shadow-blue-500/20'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <span> Apple Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType('paypal')}
                  className={cn(
                    'py-2.5 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2',
                    paymentType === 'paypal'
                      ? 'border-[#0066FF] bg-[#0066FF] text-white shadow-sm shadow-blue-500/20'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <span>PayPal</span>
                </button>
              </div>

              {/* Interactive Virtual Card Preview */}
              {paymentType === 'card' && (
                <div className="space-y-4">
                  <div className="relative p-6 rounded-2xl bg-gradient-to-tr from-[#0A192F] via-[#0D2847] to-[#0066FF] text-white shadow-xl max-w-sm mx-auto overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-sky-400/15 rounded-full blur-2xl" />
                    <div className="flex justify-between items-center mb-8">
                      <span className="font-sans text-sm font-black tracking-wider uppercase text-sky-200">JUDESCART PREMIER</span>
                      <span className="text-xs font-mono font-bold text-sky-300">VISA VIP</span>
                    </div>
                    <div className="font-mono text-base sm:text-lg tracking-widest mb-6">
                      {cardNumber}
                    </div>
                    <div className="flex justify-between text-xs text-sky-100 font-mono">
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-sky-200/70">Cardholder</span>
                        <span>{cardHolder}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-sky-200/70">Expires</span>
                        <span>{cardExpiry}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Inputs */}
                  <div className="space-y-3">
                    <Input
                      label="Card Number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      required
                    />
                    <Input
                      label="Cardholder Name"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="FULL NAME ON CARD"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiration Date (MM/YY)"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="11/28"
                        required
                      />
                      <Input
                        label="Security Code (CVV)"
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="888"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentType !== 'card' && (
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                  <p className="text-xs text-slate-600">
                    You will be directed to {paymentType === 'apple_pay' ? 'Apple Pay Touch ID' : 'PayPal Checkout'} to authenticate your transaction.
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    Simulated Ready
                  </span>
                </div>
              )}

              {/* JudesCoins Direct Redemption Slider */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-50 to-yellow-50 border border-amber-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🪙</span>
                    <div>
                      <h4 className="font-sans font-bold text-xs sm:text-sm text-amber-950">
                        Redeem JudesCoins for Instant Discount
                      </h4>
                      <p className="text-[11px] text-amber-800">
                        Rate: 20 Coins = $1.00 USD off your purchase
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-900 block">
                      {judesCoins} Coins Available
                    </span>
                    <span className="text-[10px] text-amber-700">
                      (Approx ${(judesCoins / 20).toFixed(2)})
                    </span>
                  </div>
                </div>

                {maxRedeemableCoins > 0 ? (
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Redeem Amount</span>
                        <span className="font-bold text-[#0066FF]">
                          {redeemedCoins} Coins (-{formatAmount(redeemedCoins / 20)})
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={maxRedeemableCoins}
                        step={10}
                        value={redeemedCoins}
                        onChange={(e) => setRedeemedCoins(Number(e.target.value))}
                        className="w-full accent-[#0066FF] cursor-pointer h-2 bg-amber-200/60 rounded-lg appearance-none"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[0, 20, 50, 100, maxRedeemableCoins]
                        .filter((val, i, arr) => arr.indexOf(val) === i && val <= maxRedeemableCoins)
                        .map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setRedeemedCoins(val)}
                            className={cn(
                              'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border',
                              redeemedCoins === val
                                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                                : 'bg-white border-amber-200 text-amber-900 hover:bg-amber-100'
                            )}
                          >
                            {val === 0 ? 'None' : val === maxRedeemableCoins ? `Max (${val})` : `${val} Coins`}
                          </button>
                        ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-800 italic">
                    Earn more JudesCoins on this order or through daily visits to unlock instant discounts!
                  </p>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Delivery</span>
                </Button>

                <Button
                  onClick={handlePlaceOrder}
                  isLoading={isSubmitting}
                  className="px-8 bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all active:scale-95"
                >
                  <Lock className="w-3.5 h-3.5 text-white" />
                  <span>Place Order • {formatAmount(calculateFinalTotal())}</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-sans text-sm font-bold text-[#0A192F]">Order Summary ({cart.length} items)</h3>
            <Link href="/products" className="text-[11px] text-stone-500 hover:text-stone-900 underline">
              Modify Bag
            </Link>
          </div>

          {/* Items Preview */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative w-12 h-14 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <p className="font-medium text-stone-900 truncate">{item.name}</p>
                  <p className="text-stone-500">{item.color} • {item.size}</p>
                </div>
                <span className="text-xs font-semibold text-stone-900">
                  {formatAmount(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-stone-900">{formatAmount(cartSummary.subtotal)}</span>
            </div>
            {cartSummary.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Promotional Discount ({appliedPromo?.code})</span>
                <span>-{formatAmount(cartSummary.discount)}</span>
              </div>
            )}
            {redeemedCoins > 0 && (
              <div className="flex justify-between text-amber-700 font-medium">
                <span className="flex items-center gap-1">
                  <span>🪙</span>
                  <span>JudesCoins Discount ({redeemedCoins} Coins)</span>
                </span>
                <span>-{formatAmount(coinDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Method ({selectedShipping.name})</span>
              <span>
                {cartSummary.isFreeShippingUnlocked && selectedShipping.id === 'standard' ? (
                  <span className="text-emerald-700 font-medium">Complimentary</span>
                ) : (
                  formatAmount(selectedShipping.price)
                )}
              </span>
            </div>
            {isGiftWrap && (
              <div className="flex justify-between text-purple-900 font-medium">
                <span className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-purple-600" />
                  <span>Deluxe Gift Packaging</span>
                </span>
                <span>{formatAmount(4.99)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Sales Tax (8.5%)</span>
              <span className="font-medium text-stone-900">{formatAmount(cartSummary.estimatedTax)}</span>
            </div>
            <div className="flex justify-between text-base font-sans font-extrabold text-[#0A192F] pt-3 border-t border-slate-200">
              <span>Total Payment</span>
              <span>{formatAmount(calculateFinalTotal())}</span>
            </div>
          </div>

          {/* JudesCoins Purchase Reward Notice */}
          <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                🪙
              </div>
              <div>
                <p className="text-xs font-bold text-amber-950">
                  Earn +{calculatePurchaseCoins(calculateFinalTotal())} JudesCoins
                </p>
                <p className="text-[10px] text-amber-700 font-medium">
                  Reward rule: 1 coin for every ₹100 spent
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-200/70 text-amber-900 shrink-0">
              Auto-Credited
            </span>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-[11px] text-stone-600 space-y-1">
            <p className="font-bold text-[#0A192F]">JudesCart Buyer Guarantee</p>
            <p>Every piece arrives in signature tamper-evident protective packaging with manufacturer warranty and 30-day effortless returns.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
