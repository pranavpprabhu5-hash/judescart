'use client';

import React, { useState } from 'react';
import { ProductVariantColor, ProductVariantSize } from '@/types/product';
import { Modal } from '@/components/ui/Modal';
import { Ruler, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VariantSelectorProps {
  colors: ProductVariantColor[];
  sizes: ProductVariantSize[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

export function VariantSelector({
  colors,
  sizes,
  selectedColor,
  onSelectColor,
  selectedSize,
  onSelectSize,
  quantity,
  onQuantityChange,
}: VariantSelectorProps) {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const currentSizeObj = sizes.find((s) => s.name === selectedSize);
  const maxStock = currentSizeObj ? currentSizeObj.stock : 10;
  const isLowStock = currentSizeObj && currentSizeObj.stock > 0 && currentSizeObj.stock <= 3;

  return (
    <div className="space-y-6">
      {/* Color Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-stone-900">
            Color: <span className="font-normal text-stone-600">{selectedColor}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {colors.map((c) => {
            const isSelected = selectedColor === c.name;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => onSelectColor(c.name)}
                title={c.name}
                className={cn(
                  'relative w-8 h-8 rounded-full border transition-all flex items-center justify-center',
                  isSelected
                    ? 'ring-2 ring-[#0066FF] ring-offset-2 scale-105'
                    : 'border-slate-300 hover:scale-105'
                )}
                style={{ backgroundColor: c.hex }}
              >
                {isSelected && (
                  <Check
                    className={cn(
                      'w-3.5 h-3.5',
                      c.hex.toLowerCase() === '#ffffff' || c.hex.toLowerCase() === '#f0ece1' || c.hex.toLowerCase() === '#d7cec7'
                        ? 'text-slate-900'
                        : 'text-white'
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-slate-900">Size:</span>
            {isLowStock && (
              <span className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                Only {currentSizeObj?.stock} remaining
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsSizeGuideOpen(true)}
            className="flex items-center gap-1 text-[#0066FF] hover:text-[#0052CC] transition-colors font-semibold text-[11px] underline"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Size Guide</span>
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {sizes.map((s) => {
            const isOutOfStock = s.stock === 0;
            const isSelected = selectedSize === s.name;
            return (
              <button
                key={s.name}
                type="button"
                disabled={isOutOfStock}
                onClick={() => onSelectSize(s.name)}
                className={cn(
                  'py-3 px-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all relative flex flex-col items-center justify-center',
                  isSelected
                    ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-sm shadow-blue-500/20'
                    : isOutOfStock
                    ? 'border-slate-200 bg-slate-100/60 text-slate-400 cursor-not-allowed line-through'
                    : 'border-slate-200 text-slate-800 hover:border-[#0066FF] hover:text-[#0066FF] bg-white'
                )}
              >
                <span>{s.name}</span>
                {s.stock > 0 && s.stock <= 3 && (
                  <span className="text-[9px] text-amber-500 font-normal mt-0.5">Low</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity Modifier */}
      <div className="flex items-center gap-4 pt-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-900">Quantity:</span>
        <div className="flex items-center border border-slate-200 rounded-full bg-white px-2 py-1">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-600 hover:bg-blue-50 hover:text-[#0066FF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            -
          </button>
          <span className="w-8 text-center text-xs font-bold text-slate-900">{quantity}</span>
          <button
            type="button"
            onClick={() => onQuantityChange(Math.min(maxStock, quantity + 1))}
            disabled={quantity >= maxStock}
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-600 hover:bg-blue-50 hover:text-[#0066FF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            +
          </button>
        </div>
      </div>

      {/* Size Guide Modal */}
      <Modal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        title="JudesCart Sizing & Fit Guide"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs text-stone-600">
          <p className="leading-relaxed">
            All our pieces are tailored according to standard European and International sizing metrics. For an oversized fit, we suggest choosing your true size.
          </p>

          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left divide-y divide-stone-200">
              <thead className="bg-stone-50 text-[11px] font-semibold text-stone-700 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Size</th>
                  <th className="p-3">US / UK</th>
                  <th className="p-3">EU</th>
                  <th className="p-3">Chest / Bust</th>
                  <th className="p-3">Waist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                <tr>
                  <td className="p-3 font-semibold">XS</td>
                  <td className="p-3">0–2</td>
                  <td className="p-3">32–34</td>
                  <td className="p-3">31–33 in / 80–84 cm</td>
                  <td className="p-3">24–25 in / 61–64 cm</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">S</td>
                  <td className="p-3">4–6</td>
                  <td className="p-3">36–38</td>
                  <td className="p-3">34–35 in / 86–89 cm</td>
                  <td className="p-3">26–27 in / 66–69 cm</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">M</td>
                  <td className="p-3">8–10</td>
                  <td className="p-3">40–42</td>
                  <td className="p-3">36–38 in / 91–96 cm</td>
                  <td className="p-3">28–30 in / 71–76 cm</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">L</td>
                  <td className="p-3">12–14</td>
                  <td className="p-3">44–46</td>
                  <td className="p-3">39–41 in / 99–104 cm</td>
                  <td className="p-3">31–33 in / 79–84 cm</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">XL</td>
                  <td className="p-3">16</td>
                  <td className="p-3">48</td>
                  <td className="p-3">42–44 in / 107–112 cm</td>
                  <td className="p-3">34–36 in / 86–91 cm</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-stone-500 text-[11px]">
            *Need personal fit advice? Speak with our styling concierge anytime.
          </div>
        </div>
      </Modal>
    </div>
  );
}
