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
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSummary, clearCart, formatAmount, addOrder, user, appliedPromo } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Shipping Form State
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: user.savedAddresses[0]?.firstName || 'Eleanor',
    lastName: user.savedAddresses[0]?.lastName || 'Sterling',
    email: user.savedAddresses[0]?.email || 'eleanor.sterling@atelier.com',
    phone: user.savedAddresses[0]?.phone || '+1 (555) 234-8910',
    street: user.savedAddresses[0]?.street || '742 Evergreen Terrace',
    apartment: user.savedAddresses[0]?.apartment || 'Apt 4B',
    city: user.savedAddresses[0]?.city || 'San Francisco',
    state: user.savedAddresses[0]?.state || 'CA',
    postalCode: user.savedAddresses[0]?.postalCode || '94107',
    country: user.savedAddresses[0]?.country || 'United States',
  });

  // Step 2: Shipping Method
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethodOption>(SHIPPING_METHODS[0]);

  // Step 3: Payment Form State
  const [paymentType, setPaymentType] = useState<'card' | 'apple_pay' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('ELEANOR STERLING');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('888');

  // If cart is empty and user navigates here directly, handle gracefully
  useEffect(() => {
    if (cart.length === 0) {
      // Don't redirect immediately if they just completed an order
    }
  }, [cart]);

  const handleAutofillDemo = () => {
    setShippingAddress({
      firstName: 'Eleanor',
      lastName: 'Sterling',
      email: 'eleanor.sterling@atelier.com',
      phone: '+1 (555) 234-8910',
      street: '742 Evergreen Terrace',
      apartment: 'Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
    });
  };

  const calculateFinalTotal = () => {
    const shippingCost = selectedShipping.price;
    const effectiveShipping = cartSummary.isFreeShippingUnlocked && selectedShipping.id === 'standard' ? 0 : shippingCost;
    return cartSummary.subtotal - cartSummary.discount + effectiveShipping + cartSummary.estimatedTax;
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
      discount: cartSummary.discount,
      shipping: effectiveShippingCost,
      tax: cartSummary.estimatedTax,
      total: calculateFinalTotal(),
      currency: 'USD',
      shippingAddress,
      shippingMethod: selectedShipping,
      paymentMethod: {
        type: paymentType,
        last4: cardNumber.replace(/\s+/g, '').slice(-4) || '4242',
        brand: 'Visa',
      },
      estimatedDelivery: selectedShipping.estimatedDays,
    });

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
        <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 stroke-[1.2]" />
        <h2 className="font-serif text-2xl text-stone-900">Your bag is empty</h2>
        <p className="text-xs text-stone-500">There are no items to checkout.</p>
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
                      placeholder="Eleanor Sterling"
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
            <div className="flex justify-between">
              <span>Estimated Sales Tax (8.5%)</span>
              <span className="font-medium text-stone-900">{formatAmount(cartSummary.estimatedTax)}</span>
            </div>
            <div className="flex justify-between text-base font-sans font-extrabold text-[#0A192F] pt-3 border-t border-slate-200">
              <span>Total Payment</span>
              <span>{formatAmount(calculateFinalTotal())}</span>
            </div>
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
