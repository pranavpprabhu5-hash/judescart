'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'navy';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary: 'bg-[#0066FF] text-white hover:bg-[#0052CC] shadow-sm hover:shadow-blue-500/25',
      navy: 'bg-[#0A192F] text-white hover:bg-[#0066FF] shadow-sm',
      secondary: 'bg-blue-50 text-[#0066FF] hover:bg-blue-100 border border-blue-200 font-semibold',
      outline: 'bg-transparent text-slate-800 border border-slate-300 hover:border-[#0066FF] hover:text-[#0066FF] hover:bg-blue-50/50',
      ghost: 'bg-transparent text-slate-700 hover:bg-blue-50 hover:text-[#0066FF]',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 rounded-full gap-1.5',
      md: 'text-sm px-5 py-2.5 rounded-full gap-2',
      lg: 'text-base px-7 py-3.5 rounded-full gap-2.5 font-semibold tracking-wide',
      icon: 'p-2 rounded-full',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
