'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import {
  X,
  Trophy,
  Crown,
  Gift,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Sparkles,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

interface LuckyDrawConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (msg: string) => void;
}

export function LuckyDrawConfigModal({ isOpen, onClose, onSaved }: LuckyDrawConfigModalProps) {
  const { prizePools, updatePrizePool, drawCriteria, updateDrawCriteria, formatAmount } = useStore();

  const [selectedTier, setSelectedTier] = useState<'platinum' | 'gold' | 'silver' | 'bumper'>('platinum');
  const [pools, setPools] = useState<Record<string, string[]>>(() => ({
    platinum: [...(prizePools.platinum || [])],
    gold: [...(prizePools.gold || [])],
    silver: [...(prizePools.silver || [])],
    bumper: [...(prizePools.bumper || [])],
  }));

  const [criteria, setCriteria] = useState<Record<string, number>>(() => ({
    platinum: drawCriteria.platinum ?? 500,
    gold: drawCriteria.gold ?? 250,
    silver: drawCriteria.silver ?? 100,
    bumper: drawCriteria.bumper ?? 0,
  }));

  const [newPrize, setNewPrize] = useState('');

  if (!isOpen) return null;

  const currentPrizes = pools[selectedTier] || [];

  const handleAddPrize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrize.trim()) return;

    setPools((prev) => ({
      ...prev,
      [selectedTier]: [...(prev[selectedTier] || []), newPrize.trim()],
    }));
    setNewPrize('');
  };

  const handleRemovePrize = (idx: number) => {
    setPools((prev) => ({
      ...prev,
      [selectedTier]: (prev[selectedTier] || []).filter((_, i) => i !== idx),
    }));
  };

  const handleCriteriaChange = (val: number) => {
    setCriteria((prev) => ({
      ...prev,
      [selectedTier]: Math.max(0, val),
    }));
  };

  const handleSave = () => {
    Object.entries(pools).forEach(([t, pList]) => {
      updatePrizePool(t, pList);
    });

    Object.entries(criteria).forEach(([t, cVal]) => {
      updateDrawCriteria(t, cVal);
    });

    if (onSaved) {
      onSaved(`🏆 Lucky Draw and Bumper prize pools and criteria saved successfully!`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 my-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0F172A]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Configure Lucky Draw & Bumper Prize Pools
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize prize pools, minimum order thresholds, and jackpot entry rules
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

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Tier Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setSelectedTier('platinum')}
              className={`p-3 rounded-2xl text-center text-xs font-bold transition-all border ${
                selectedTier === 'platinum'
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/25'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-4 h-4 mx-auto mb-1" />
              <span>Platinum Draw</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTier('gold')}
              className={`p-3 rounded-2xl text-center text-xs font-bold transition-all border ${
                selectedTier === 'gold'
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md shadow-amber-500/25'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <Crown className="w-4 h-4 mx-auto mb-1" />
              <span>Gold Draw</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTier('silver')}
              className={`p-3 rounded-2xl text-center text-xs font-bold transition-all border ${
                selectedTier === 'silver'
                  ? 'bg-[#0066FF] text-white border-blue-600 shadow-md shadow-blue-500/25'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <Gift className="w-4 h-4 mx-auto mb-1" />
              <span>Silver Draw</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTier('bumper')}
              className={`p-3 rounded-2xl text-center text-xs font-bold transition-all border ${
                selectedTier === 'bumper'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-700 shadow-md shadow-purple-500/25'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 mx-auto mb-1" />
              <span>Mega Bumper</span>
            </button>
          </div>

          {/* Entry Criteria Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Minimum Qualifying Order Spend / Profit (USD Base)
              </label>
              <span className="text-xs font-mono font-bold text-[#0066FF] dark:text-[#38BDF8]">
                {selectedTier === 'bumper'
                  ? 'Exclusive to Brand JUDES purchases'
                  : formatAmount(criteria[selectedTier] || 0)}
              </span>
            </div>

            {selectedTier === 'bumper' ? (
              <p className="text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 p-3 rounded-xl border border-purple-200 dark:border-purple-800/40">
                👑 All customers who purchase any item from the in-house brand <strong>JUDES</strong> automatically receive 1 Grand Bumper ticket per eligible item. Held every 6–12 months!
              </p>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="25"
                  value={criteria[selectedTier] || 0}
                  onChange={(e) => handleCriteriaChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                />
                <span className="text-xs text-slate-400 shrink-0">USD min order</span>
              </div>
            )}
          </div>

          {/* Prize Pool List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Active Prize Pool ({currentPrizes.length} Prizes)
              </h4>
              <span className="text-[11px] text-slate-400">Prizes picked at random during draws</span>
            </div>

            <div className="space-y-2">
              {currentPrizes.map((pName, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-slate-900 dark:text-white">{pName}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemovePrize(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Prize Form */}
            <form onSubmit={handleAddPrize} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newPrize}
                onChange={(e) => setNewPrize(e.target.value)}
                placeholder={`Add new prize to ${selectedTier.toUpperCase()} pool...`}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Prize</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0F172A]/80 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 rounded-full bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer active:scale-95"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
