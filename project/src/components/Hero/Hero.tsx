import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRef, useEffect } from 'react';
import HeroParticles from '@/components/HeroParticles/HeroParticles';

const HERO_IMAGE = 'https://images.pexels.com/photos/6798396/pexels-photo-6798396.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(hover: none)').matches) return;
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px)`;
      }
    };
    section.addEventListener('mousemove', onMove);
    return () => section.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-forest-900 min-h-[85vh] sm:min-h-[90vh] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Luxury handcrafted candles with warm glow"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/70 via-forest-900/50 to-forest-900/80" />
      </div>

      {/* Blobs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-72 h-72 sm:w-96 sm:h-96 bg-forest-400/10 rounded-full blur-3xl pointer-events-none" />

      <HeroParticles />

      {/* Mouse glow */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full bg-gold-400/8 blur-[80px] pointer-events-none -ml-[150px] sm:-ml-[200px] -mt-[150px] sm:-mt-[200px] hidden lg:block"
        style={{ willChange: 'transform' }}
      />

      <div className="container-luxury relative z-10 py-20 lg:py-28 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.3em] text-gold-400 mb-5 sm:mb-6">
            <Sparkles size={14} /> Hand-Poured Luxury
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium text-cream-100 leading-[1.08] mb-5 sm:mb-6 text-balance">
            Handcrafted Candles<br />Made Just For You
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-cream-300 leading-relaxed mb-8 sm:mb-10 max-w-xl mx-auto px-4 sm:px-0">
            Luxury handmade soy candles designed for birthdays, anniversaries, weddings, baby showers, festivals, gifts and every special occasion.
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Link to="/collections" className="btn-gold text-sm sm:text-base">
              Shop Collection <ArrowRight size={18} />
            </Link>
            <Link
              to="/custom-candles"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 rounded-full border border-cream-200/30 text-cream-100 font-medium tracking-wide transition-all duration-300 hover:bg-cream-100/10 hover:border-cream-200/50 active:scale-[0.98] text-sm sm:text-base"
            >
              Create Your Candle
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <div className="w-6 h-10 rounded-full border-2 border-cream-200/30 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-cream-200/50"
          />
        </div>
      </motion.div>
    </section>
  );
}
