'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, defaultOpenId, allowMultiple = false, className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('divide-y divide-stone-200 border-t border-b border-stone-200', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="py-1">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex items-center justify-between w-full py-4 text-left group"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-3 text-sm font-semibold text-[#0A192F] group-hover:text-[#0066FF] transition-colors">
                {item.icon && <span className="text-[#0066FF]">{item.icon}</span>}
                {item.title}
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-slate-400 group-hover:text-[#0066FF] transition-transform duration-200',
                  isOpen && 'transform rotate-180 text-[#0066FF]'
                )}
              />
            </button>
            {isOpen && (
              <div className="pb-5 pt-1 text-sm text-stone-600 leading-relaxed animate-in fade-in-50 duration-150">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
