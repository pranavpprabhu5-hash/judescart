import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  max?: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export function RatingStars({
  rating,
  max = 5,
  reviewCount,
  size = 'sm',
  interactive = false,
  onRatingChange,
  className,
}: RatingStarsProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const displayRating = hovered !== null ? hovered : rating;

  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= Math.round(displayRating);

          return (
            <button
              type="button"
              key={i}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starValue)}
              onMouseEnter={() => interactive && setHovered(starValue)}
              onMouseLeave={() => interactive && setHovered(null)}
              className={cn(
                'transition-colors duration-150',
                interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
              )}
            >
              <Star
                className={cn(
                  starSize,
                  isFilled ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'
                )}
              />
            </button>
          );
        })}
      </div>
      <span className="text-xs font-medium text-stone-700">
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className="text-xs text-stone-400">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
