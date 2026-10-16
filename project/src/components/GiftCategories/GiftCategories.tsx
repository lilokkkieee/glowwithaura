import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImagePlaceholder from '@/components/ImagePlaceholder/ImagePlaceholder';

const categories = [
  {
    label: 'For Her',
    to: '/gift',
  },
  {
    label: 'For Him',
    to: '/gift',
  },
  {
    label: 'For Occasion',
    to: '/gift',
  },
];

export default function GiftCategories({ light = false }: { light?: boolean }) {
  return (
    <section className={`py-16 lg:py-24 ${light ? 'bg-cream-50' : 'bg-forest-900'}`}>
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.25em] text-gold-400 mb-3">
            Thoughtful Gifting
          </span>
          <h2 className={`font-serif text-3xl md:text-4xl lg:text-5xl leading-tight ${light ? 'text-forest-900' : 'text-cream-100'}`}>
            Gift for All Category
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-16 max-w-3xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link to={cat.to} className="group flex flex-col items-center gap-5">
                <div className="relative w-48 h-48 lg:w-56 lg:h-56">
                  <div className="absolute inset-0 rounded-full overflow-hidden shadow-lift ring-2 ring-gold-400/20 group-hover:ring-gold-400/50 transition-all duration-500">
                    <ImagePlaceholder label={cat.label} className="w-full h-full" variant="dark" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-forest-900/0 group-hover:bg-forest-900/10 transition-colors duration-500" />
                </div>
                <span className={`font-serif text-xl lg:text-2xl group-hover:text-gold-400 transition-colors ${light ? 'text-forest-900' : 'text-cream-100'}`}>
                  {cat.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
