import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'sale' | 'new' | 'limited' | 'stock' | 'blue';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase';

  const variants = {
    default: 'bg-blue-50 text-blue-700 border border-blue-200',
    blue: 'bg-[#0066FF] text-white shadow-xs',
    outline: 'border border-slate-300 text-slate-700 bg-white/80 backdrop-blur-sm',
    sale: 'bg-rose-50 text-rose-700 border border-rose-200 font-bold',
    new: 'bg-[#0066FF] text-white font-bold shadow-xs',
    limited: 'bg-[#0A192F] text-white font-bold',
    stock: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
