'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product, ProductCategory } from '@/types/product';
import { useStore } from '@/context/StoreContext';
import { CurrencyCode } from '@/types/currency';
import { CURRENCIES } from '@/lib/mock-data';
import {
  X,
  Package,
  Sparkles,
  AlertTriangle,
  Plus,
  Trash2,
  Crown,
  Trophy,
  CheckCircle2,
  DollarSign,
  Layers,
} from 'lucide-react';

interface ProductEditModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (msg: string) => void;
}

export function ProductEditModal({ product, isOpen, onClose, onSaved }: ProductEditModalProps) {
  const { updateProduct, currency, categories, addCategory } = useStore();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<ProductCategory>('electronics');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCatInput, setCustomCatInput] = useState('');

  const [productCurrency, setProductCurrency] = useState<CurrencyCode>(currency || 'USD');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);

  const [isJudesBrand, setIsJudesBrand] = useState(false);
  const [drawTier, setDrawTier] = useState<'platinum' | 'gold' | 'silver'>('gold');
  const [imageUrl, setImageUrl] = useState('');
  const [sizes, setSizes] = useState<{ name: string; stock: number }[]>([]);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setTagline(product.tagline || '');
      setCategory(product.category || 'electronics');
      setIsCustomCategory(false);
      setCustomCatInput('');

      const curr = currency || 'USD';
      setProductCurrency(curr);
      const rate = CURRENCIES[curr]?.rate || 1;
      const displayPrice = curr === 'INR' || curr === 'JPY'
        ? Math.round(product.price * rate)
        : Math.round(product.price * rate * 100) / 100;
      const displayOrig = product.originalPrice
        ? (curr === 'INR' || curr === 'JPY'
            ? Math.round(product.originalPrice * rate)
            : Math.round(product.originalPrice * rate * 100) / 100)
        : Math.round(displayPrice * 1.3);

      setPrice(displayPrice);
      setOriginalPrice(displayOrig);

      setIsJudesBrand(product.brand === 'JUDES' || !!product.isBumperEligible);
      setDrawTier((product.drawTier as any) || 'gold');
      setImageUrl(product.images?.[0] || '');
      setSizes(product.sizes?.length ? product.sizes.map((s) => ({ ...s })) : [{ name: 'Standard Unit', stock: 25 }]);
    }
  }, [product, currency]);

  if (!isOpen || !product) return null;

  const handleCurrencyChange = (newCurr: CurrencyCode) => {
    if (newCurr === productCurrency) return;
    const oldRate = CURRENCIES[productCurrency]?.rate || 1;
    const newRate = CURRENCIES[newCurr]?.rate || 1;
    const usdVal = price / oldRate;
    const usdOrig = originalPrice / oldRate;

    const convertedPrice = newCurr === 'INR' || newCurr === 'JPY'
      ? Math.round(usdVal * newRate)
      : Math.round(usdVal * newRate * 100) / 100;
    const convertedOrig = newCurr === 'INR' || newCurr === 'JPY'
      ? Math.round(usdOrig * newRate)
      : Math.round(usdOrig * newRate * 100) / 100;

    setProductCurrency(newCurr);
    setPrice(convertedPrice);
    setOriginalPrice(convertedOrig);
  };

  const handleSizeStockChange = (idx: number, newStock: number) => {
    setSizes((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, stock: Math.max(0, newStock) } : s))
    );
  };

  const handleAddSizeVariant = () => {
    setSizes((prev) => [...prev, { name: `Variant ${prev.length + 1}`, stock: 20 }]);
  };

  const handleRemoveSizeVariant = (idx: number) => {
    if (sizes.length <= 1) return;
    setSizes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleBulkStockAdjustment = (delta: number) => {
    setSizes((prev) =>
      prev.map((s) => ({ ...s, stock: Math.max(0, s.stock + delta) }))
    );
  };

  const totalStock = sizes.reduce((sum, s) => sum + s.stock, 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let finalCategory = category;
    if (isCustomCategory && customCatInput.trim()) {
      finalCategory = addCategory(customCatInput.trim()) as any;
    }

    const rate = CURRENCIES[productCurrency]?.rate || 1;
    const baseUsdPrice = productCurrency === 'USD'
      ? price
      : Math.round((price / rate) * 100) / 100;
    const baseUsdOrig = productCurrency === 'USD'
      ? originalPrice
      : Math.round((originalPrice / rate) * 100) / 100;

    updateProduct(product.id, {
      name: name.trim(),
      tagline: tagline.trim(),
      category: finalCategory,
      brand: isJudesBrand ? 'JUDES' : (product.brand === 'JUDES' ? 'JudesCart Studio' : product.brand),
      isBumperEligible: isJudesBrand,
      drawTier,
      price: Math.max(1, baseUsdPrice),
      originalPrice: Math.max(baseUsdPrice, baseUsdOrig),
      images: imageUrl.trim() ? [imageUrl.trim(), ...product.images.slice(1)] : product.images,
      sizes,
    });

    if (onSaved) {
      onSaved(`✨ Updated "${name}" inventory and specifications successfully!`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 my-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0F172A]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-[#0066FF] dark:text-[#38BDF8]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Edit Product & Inventory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                SKU: {product.id} • Available Stock: {totalStock} units
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Attributes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image Preview & URL */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Product Image
              </label>
              <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                {imageUrl ? (
                  <Image src={imageUrl} alt={name} fill className="object-cover" />
                ) : (
                  <Package className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL (Unsplash or CDN)"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>

            {/* Title, Tagline, Category, Brand */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>

              {/* Category & Brand Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(!isCustomCategory)}
                      className="text-[10px] font-bold text-[#0066FF] hover:underline"
                    >
                      {isCustomCategory ? 'Select Existing' : '+ New Category'}
                    </button>
                  </div>

                  {isCustomCategory ? (
                    <input
                      type="text"
                      placeholder="e.g. Gaming Gear"
                      value={customCatInput}
                      onChange={(e) => setCustomCatInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                    />
                  ) : (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Lucky Draw Tier */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Lucky Draw Eligibility Tier
                  </label>
                  <select
                    value={drawTier}
                    onChange={(e) => setDrawTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value="platinum">Platinum Draw (Luxury Tech & Flagships)</option>
                    <option value="gold">Gold Draw (Wearables & Audio)</option>
                    <option value="silver">Silver Draw (Accessories & Weekly Cash)</option>
                  </select>
                </div>
              </div>

              {/* Brand JUDES Mega Bumper Option */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-900 dark:text-amber-300">
                      Brand JUDES Signature Collection
                    </div>
                    <div className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                      Qualifies for the Mega Bumper Draw (Cars, Foreign Trips & ₹5,00,000 Cash)
                    </div>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isJudesBrand}
                    onChange={(e) => setIsJudesBrand(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Pricing & Multi-Currency Adjustment */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#0066FF]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Pricing Matrix
                </span>
              </div>

              {/* Currency Selector for this form */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">Price in:</span>
                <select
                  value={productCurrency}
                  onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {Object.keys(CURRENCIES).map((c) => (
                    <option key={c} value={c}>
                      {c} ({CURRENCIES[c as CurrencyCode]?.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Selling Price ({CURRENCIES[productCurrency]?.symbol || '$'} {productCurrency})
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Original / Strikethrough Price ({CURRENCIES[productCurrency]?.symbol || '$'} {productCurrency})
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-bold text-slate-500 dark:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>
            </div>
          </div>

          {/* Variant Inventory & Low-Stock Alerts */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0066FF]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Inventory & Size Variants
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    totalStock === 0
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : totalStock < 10
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}
                >
                  {totalStock === 0 ? 'Out of Stock' : totalStock < 10 ? `Low Stock (${totalStock})` : `In Stock (${totalStock})`}
                </span>
              </div>

              {/* Quick Bulk Stock Actions */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px]">Quick:</span>
                <button
                  type="button"
                  onClick={() => handleBulkStockAdjustment(10)}
                  className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                >
                  +10 All
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkStockAdjustment(-5)}
                  className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                >
                  -5 All
                </button>
                <button
                  type="button"
                  onClick={handleAddSizeVariant}
                  className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/20 text-[#0066FF] dark:text-[#38BDF8] text-[11px] font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Size</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {sizes.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={s.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSizes((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, name: val } : item))
                        );
                      }}
                      placeholder="Size / Unit Label (e.g. Medium, 42mm)"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                    />
                  </div>

                  <div className="w-28 flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      value={s.stock}
                      onChange={(e) => handleSizeStockChange(idx, parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-center"
                    />
                    <span className="text-[10px] text-slate-400">units</span>
                  </div>

                  {sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSizeVariant(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer active:scale-95"
            >
              Save Product & Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
