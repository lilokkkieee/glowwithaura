import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, ArrowRight } from 'lucide-react';
import ImagePlaceholder from '@/components/ImagePlaceholder/ImagePlaceholder';

export default function GiftSection({ light = false }: { light?: boolean }) {
  return (
    <section className={`py-16 lg:py-24 ${light ? 'bg-cream-100' : 'bg-forest-900'}`}>
      <div className="container-luxury">
        <div className="relative rounded-3xl overflow-hidden shadow-lift">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[460px]">
              <ImagePlaceholder className="w-full h-full" label="Gift Set" />
              <div className="absolute inset-0 bg-gradient-to-r from-forest-900/40 to-transparent lg:bg-none" />
            </div>

            <div className={`flex flex-col justify-center p-10 lg:p-16 ${light ? 'bg-cream-50 text-forest-900' : 'bg-forest-800 text-cream-100'}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-400 mb-4">
                  <Gift size={14} /> The Art of Gifting
                </span>
                <h2 className={`font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-5 text-balance ${light ? 'text-forest-900' : 'text-cream-100'}`}>
                  A gift they will remember long after the flame goes out.
                </h2>
                <p className={`leading-relaxed mb-8 max-w-md ${light ? 'text-forest-700' : 'text-cream-300/80'}`}>
                  Each gift set is hand-wrapped in our signature linen paper with a wax seal and a handwritten note option. The perfect gesture for housewarmings, holidays, and quiet thank-yous.
                </p>
                <Link to="/gift" className="btn-gold self-start">
                  Shop Gift Sets <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
