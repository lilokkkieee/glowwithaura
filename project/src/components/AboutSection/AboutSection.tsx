import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const ARTISAN_IMG = 'https://images.pexels.com/photos/6755794/pexels-photo-6755794.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop';

export default function AboutSection() {
  return (
    <section className="bg-forest-800 py-16 lg:py-24">
      <div className="container-luxury">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-lift aspect-[4/3]">
              <img
                src={ARTISAN_IMG}
                alt="Artisan hand-pouring a candle"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-cream-50 rounded-2xl shadow-card p-5 sm:p-6 max-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-gold-500" />
                <span className="font-serif text-sm text-forest-900">Small Batch</span>
              </div>
              <p className="text-xs text-beige-700 leading-relaxed">Every candle handcrafted with love and premium soy wax.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.25em] text-gold-400 mb-3">Our Story</span>
            <h2 className="font-serif text-3xl md:text-4xl text-cream-100 leading-tight mb-5">
              Handcrafted in small batches, made for your moments.
            </h2>
            <p className="text-cream-300/80 text-sm sm:text-base leading-relaxed mb-4">
              At Glow With Aura, every candle is a labor of love. We hand-pour each one in small batches using premium natural soy wax, carefully selected fragrances, and wicks that burn clean and even.
            </p>
            <p className="text-cream-300/80 text-sm sm:text-base leading-relaxed mb-6">
              Whether it is a birthday, a wedding, a festival, or a quiet evening at home — we personalize every candle to your occasion. Because we believe every flame should tell a story, and every story deserves to be beautiful.
            </p>
            <Link to="/about" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-cream-200/30 text-cream-100 font-medium tracking-wide transition-all duration-300 hover:bg-cream-100/10 hover:border-cream-200/50 active:scale-[0.98]">
              Read Our Story <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
