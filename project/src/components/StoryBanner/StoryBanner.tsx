import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ImagePlaceholder from '@/components/ImagePlaceholder/ImagePlaceholder';

export default function StoryBanner() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Parallax background */}
      <motion.div
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <ImagePlaceholder variant="dark" className="w-full h-full" iconSize={56} />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/90 via-forest-900/70 to-forest-900/50" />
      </motion.div>

      <div className="container-luxury relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <span className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.25em] text-gold-400 mb-4">
            Every Flame Tells a Story
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream-100 leading-tight mb-5 text-balance">
            Crafted in small batches, composed by a perfumer.
          </h2>
          <p className="text-cream-300 leading-relaxed mb-8 text-lg">
            Each candle begins as a fragrance brief — a mood, a memory, a moment. Our perfumer translates that into a layered scent, then we hand-pour it in our Studio.
          </p>
          <Link to="/about" className="btn-gold">
            Read Our Story <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
