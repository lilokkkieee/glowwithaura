import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import type { ReactNode } from 'react';
import ImagePlaceholder from '@/components/ImagePlaceholder/ImagePlaceholder';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-8rem)] grid lg:grid-cols-2">
      {/* Image side */}
      <div className="relative hidden lg:block">
        <ImagePlaceholder variant="dark" className="absolute inset-0 w-full h-full" iconSize={56} />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-forest-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-12 text-cream-100">
          <Flame size={32} className="text-gold-400 mb-4" />
          <p className="font-serif text-3xl leading-tight max-w-sm">
            "A candle is the soul of a room. It tells you what to feel."
          </p>
          <p className="text-cream-300 text-sm mt-3">— The Aura Studio</p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-forest-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-full bg-forest-700 flex items-center justify-center">
              <Flame size={18} className="text-gold-400" />
            </div>
            <span className="font-serif text-xl font-semibold text-cream-100">Glow With Aura</span>
          </Link>

          <h1 className="font-serif text-3xl md:text-4xl text-cream-100 mb-2">{title}</h1>
          <p className="text-cream-300/80 mb-8">{subtitle}</p>

          {children}

          <div className="mt-6 text-sm text-cream-300/80">{footer}</div>
        </motion.div>
      </div>
    </div>
  );
}
