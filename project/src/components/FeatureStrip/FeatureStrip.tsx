import { motion } from 'framer-motion';
import { Flame, Leaf, Sparkles, Truck } from 'lucide-react';

const features = [
  { icon: Flame, title: 'Hand Poured', desc: 'Every candle crafted by hand in small batches.' },
  { icon: Leaf, title: 'Natural Soy Wax', desc: '100% premium soy wax for a clean, long burn.' },
  { icon: Sparkles, title: 'Custom Made', desc: 'Designed exactly to your vision and occasion.' },
  { icon: Truck, title: 'Pan India Delivery', desc: 'Beautifully packaged, delivered nationwide.' },
];

export default function FeatureStrip() {
  return (
    <section className="bg-forest-800 py-12 border-y border-forest-700">
      <div className="container-luxury grid grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left"
          >
            <div className="w-12 h-12 rounded-full bg-forest-700 flex items-center justify-center shrink-0 ring-1 ring-gold-400/20">
              <f.icon size={22} className="text-gold-400" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg text-cream-100 mb-0.5">{f.title}</h3>
              <p className="text-xs sm:text-sm text-cream-300/80 leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
