import { Flame } from 'lucide-react';

interface ImagePlaceholderProps {
  label?: string;
  className?: string;
  iconSize?: number;
  variant?: 'light' | 'dark';
}

export default function ImagePlaceholder({
  label,
  className = '',
  iconSize = 40,
  variant = 'light',
}: ImagePlaceholderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        variant === 'light'
          ? 'bg-gradient-to-br from-cream-100 via-beige-100 to-beige-200'
          : 'bg-gradient-to-br from-forest-800 via-forest-700 to-forest-800'
      } ${className}`}
    >
      <Flame
        size={iconSize}
        className={variant === 'light' ? 'text-gold-500/40' : 'text-gold-400/40'}
      />
      {label && (
        <span
          className={`font-serif text-sm tracking-wide ${
            variant === 'light' ? 'text-forest-800/40' : 'text-cream-200/40'
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
