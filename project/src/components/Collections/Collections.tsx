import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '@/data/products';
import ImagePlaceholder from '@/components/ImagePlaceholder/ImagePlaceholder';

export default function Collections() {
  return (
    <section className="bg-forest-900 py-16 lg:py-24">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.25em] text-gold-400 mb-3">
            Curated Collections
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream-100 leading-tight">
            Find your signature scent
          </h2>
          <p className="mt-4 text-cream-300/80 leading-relaxed max-w-xl mx-auto">
            Each collection is composed around a mood — grounding, bright, opulent, or seasonal. Discover the one that feels like home.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                to={`/collections?category=${cat.slug}`}
                className="group block relative aspect-[3/4] rounded-2xl overflow-hidden shadow-card hover:shadow-lift transition-shadow duration-500"
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <ImagePlaceholder label={cat.name} className="w-full h-full" variant="dark" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-cream-100">
                  <h3 className="font-serif text-2xl mb-1">{cat.name}</h3>
                  <p className="text-sm text-cream-200/80 mb-3 line-clamp-2">{cat.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-gold-400 group-hover:gap-2 transition-all">
                    Explore Collection →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
