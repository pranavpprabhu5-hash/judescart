'use client';

import React from 'react';
import Image from 'next/image';
import { Trophy, Award, Gift, Crown, CheckCircle2, Sparkles } from 'lucide-react';

interface WinnerRecord {
  id: string;
  name: string;
  city: string;
  avatar: string;
  prize: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bumper';
  date: string;
  orderId: string;
}

const RECENT_WINNERS: WinnerRecord[] = [
  {
    id: 'win-01',
    name: 'Vikram Mehta',
    city: 'Mumbai, IN',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    prize: 'Apple iPhone 16 Pro Max',
    tier: 'platinum',
    date: '1 day ago',
    orderId: 'JC-91823',
  },
  {
    id: 'win-02',
    name: 'Emily Watson',
    city: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    prize: 'Sony WH-1000XM5 Headphones',
    tier: 'gold',
    date: '2 days ago',
    orderId: 'JC-84729',
  },
  {
    id: 'win-03',
    name: 'Carlos Mendez',
    city: 'Austin, US',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    prize: 'Apple AirPods 4 (ANC)',
    tier: 'silver',
    date: '3 days ago',
    orderId: 'JC-77312',
  },
  {
    id: 'win-04',
    name: 'Priya Sharma',
    city: 'Bangalore, IN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    prize: '₹50,000 Shopping Spree',
    tier: 'platinum',
    date: '4 days ago',
    orderId: 'JC-62941',
  },
  {
    id: 'win-05',
    name: 'Julian Rossi',
    city: 'Milan, IT',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    prize: 'Brand JUDES Luxury Bumper Pass',
    tier: 'bumper',
    date: '5 days ago',
    orderId: 'JC-55019',
  },
];

export function RecentWinnersTicker() {
  const getTierIcon = (tier: WinnerRecord['tier']) => {
    switch (tier) {
      case 'platinum':
        return <Trophy className="w-3.5 h-3.5 text-amber-400" />;
      case 'gold':
        return <Award className="w-3.5 h-3.5 text-blue-400" />;
      case 'silver':
        return <Gift className="w-3.5 h-3.5 text-cyan-400" />;
      case 'bumper':
        return <Crown className="w-3.5 h-3.5 text-yellow-300" />;
    }
  };

  const getTierBadge = (tier: WinnerRecord['tier']) => {
    switch (tier) {
      case 'platinum':
        return 'bg-amber-500/15 text-amber-300 border-amber-400/30';
      case 'gold':
        return 'bg-blue-500/15 text-blue-300 border-blue-400/30';
      case 'silver':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30';
      case 'bumper':
        return 'bg-purple-500/20 text-yellow-300 border-yellow-400/40';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="font-sans text-base font-extrabold text-[#0A192F]">
            Recent Verified Lucky Draw Winners
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Drawn transparently via Cryptographic Randomizer
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RECENT_WINNERS.slice(0, 3).map((w) => (
          <div
            key={w.id}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-[#0066FF]/40 shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-3.5"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-blue-100">
              <Image src={w.avatar} alt={w.name} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="font-sans text-xs font-bold text-slate-900 truncate">
                  {w.name}
                </h4>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${getTierBadge(w.tier)}`}>
                  {getTierIcon(w.tier)}
                  <span>{w.tier}</span>
                </span>
              </div>

              <div className="text-xs font-extrabold text-[#0066FF] truncate mt-0.5">
                {w.prize}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                <span>{w.city}</span>
                <span className="flex items-center gap-0.5 text-emerald-800 font-medium">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {w.orderId}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
