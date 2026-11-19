import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount: number;
  size?: 'sm' | 'md';
}

export function RatingStars({
  rating,
  reviewCount,
  size = 'sm',
}: RatingStarsProps) {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const filledStars = Math.round(rating);

  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`Rated ${rating.toFixed(1)} out of 5 stars from ${reviewCount.toLocaleString()} reviews`}
    >
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= filledStars;
          return (
            <Star
              key={starIndex}
              className={`${starSize} ${
                isFilled
                  ? 'fill-[#D97706] text-[#D97706]'
                  : 'fill-slate-200 text-slate-200'
              }`}
            />
          );
        })}
      </div>
      <span className="text-xs font-semibold text-[#0F172A] tabular-nums">
        {rating.toFixed(1)}
      </span>
      <span className="text-xs text-slate-500 tabular-nums">
        ({reviewCount.toLocaleString()})
      </span>
    </div>
  );
}
