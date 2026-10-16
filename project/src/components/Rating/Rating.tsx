import { Star, StarHalf } from 'lucide-react';

interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

const sizeMap = { sm: 14, md: 18, lg: 22 };

export default function Rating({ value, count, size = 'sm', showCount = true }: RatingProps) {
  const stars = [];
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.25;
  const dim = sizeMap[size];

  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<Star key={i} size={dim} className="fill-gold-400 text-gold-400" />);
    } else if (i === full && hasHalf) {
      stars.push(<StarHalf key={i} size={dim} className="fill-gold-400 text-gold-400" />);
    } else {
      stars.push(<Star key={i} size={dim} className="text-beige-300" />);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">{stars}</div>
      {showCount && count !== undefined && (
        <span className="text-xs text-beige-600 font-sans">
          {value.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}
