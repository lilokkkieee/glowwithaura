import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ImagePlaceholder from '@/components/ImagePlaceholder/ImagePlaceholder';

const cards = [
  {
    id: 'new-arrivals',
    title: 'New Arrivals',
    description: 'Delve into our exquisite candle creations and illuminate your home.',
    to: '/collections',
    layout: 'portrait',
  },
  {
    id: 'collection',
    title: 'Collection',
    description: 'Elegant, fragrant, and atmosphere-enhancing candles for every occasion.',
    to: '/collections',
    layout: 'landscape',
  },
  {
    id: 'fragrance-by-mood',
    title: 'Fragrance by Mood',
    description:
      'Transform any space with our mood-enhancing candles. From calming lavender to energizing citrus, discover scents that elevate every moment.',
    to: '/collections',
    layout: 'wide',
  },
];

function DiscoveryCard({ card, index }: { card: typeof cards[number]; index: number }) {
  const isPortrait = card.layout === 'portrait';
  const isWide = card.layout === 'wide';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={isPortrait ? 'w-full max-w-[317px]' : isWide ? 'w-full max-w-[722px]' : 'w-full max-w-[547px]'}
    >
      <Link
        to={card.to}
        className={`group relative block overflow-hidden rounded-[40px] shadow-card hover:shadow-lift transition-shadow duration-500 ${
          isPortrait ? 'aspect-[317/462]' : isWide ? 'aspect-[722/349]' : 'aspect-[547/241]'
        }`}
      >
        <ImagePlaceholder variant="dark" className="absolute inset-0 w-full h-full" label={card.title} />
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center ${
            isPortrait
              ? 'bg-forest-900/60'
              : isWide
              ? 'bg-forest-900/55'
              : 'bg-gradient-to-t from-forest-900/60 via-forest-900/40 to-forest-900/30'
          }`}
        >
          <div className="flex flex-col items-center gap-2.5">
            <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream-100 leading-tight">
              {card.title}
            </h3>
            <p className="text-base lg:text-lg text-cream-200 leading-relaxed max-w-md">
              {card.description}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-700 text-cream-100 font-medium tracking-wide transition-all duration-300 group-hover:bg-gold-500 group-hover:text-forest-900 group-hover:scale-105">
            Shop Now <ArrowRight size={16} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function FragranceDiscovery() {
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
            Curated Experiences
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream-100 leading-tight">
            Experience Our Unique Fragrances
          </h2>
        </motion.div>

        <div className="flex flex-wrap items-end justify-center gap-6">
          <DiscoveryCard card={cards[0]} index={0} />
          <DiscoveryCard card={cards[1]} index={1} />
        </div>
        <div className="flex justify-center mt-6">
          <DiscoveryCard card={cards[2]} index={2} />
        </div>
      </div>
    </section>
  );
}
