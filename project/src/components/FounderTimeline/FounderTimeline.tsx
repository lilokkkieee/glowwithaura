import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const timeline = [
  {
    year: '2019',
    title: 'The First Pour',
    desc: 'Our founder started pouring candles in a tiny studio, driven by a belief that scent should feel like a ritual.',
  },
  {
    year: '2020',
    title: 'Clean by Design',
    desc: 'We committed to coconut-soy wax, lead-free wicks, and phthalate-free fragrance — no exceptions.',
  },
  {
    year: '2022',
    title: 'A Signature Scent Library',
    desc: 'Our perfumer-composed fragrances grew to twelve signature scents, each telling its own story.',
  },
  {
    year: '2024',
    title: 'Refillable Vessels',
    desc: 'We introduced refillable amber glass vessels designed to outlive the candle and find a second life.',
  },
];

export default function FounderTimeline() {
  return (
    <section className="container-luxury py-16 lg:py-24">
      <div className="text-center mb-12">
        <span className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.25em] text-gold-400 mb-3">
          Our Journey
        </span>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream-100 leading-tight">
          From a single flame to a glow
        </h2>
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gold-400/20 -translate-x-1/2" />

        {timeline.map((item, i) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative flex items-start gap-6 mb-12 last:mb-0 ${
              i % 2 === 0 ? 'sm:flex-row-reverse sm:text-right' : ''
            }`}
          >
            {/* Dot */}
            <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-10 mt-1">
              <div className="w-8 h-8 rounded-full bg-forest-700 ring-2 ring-gold-400/40 flex items-center justify-center">
                <Sparkles size={14} className="text-gold-400" />
              </div>
            </div>

            {/* Content */}
            <div className={`pl-14 sm:pl-0 sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-12' : 'sm:pl-12'}`}>
              <span className="font-serif text-2xl text-gold-400 block mb-1">{item.year}</span>
              <h3 className="font-serif text-lg text-cream-100 mb-2">{item.title}</h3>
              <p className="text-sm text-cream-300/80 leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
