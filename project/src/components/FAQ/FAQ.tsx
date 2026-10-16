import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'Can I customize the wax colors?', a: 'Absolutely. We offer a wide range of wax colors — from soft pastels to bold jewel tones. You can pick any color to match your event theme or home decor.' },
  { q: 'Can I customize the fragrance?', a: 'Yes! Choose from our curated fragrance library or describe a custom scent profile and our artisans will craft it for you. Floral, woody, citrus, gourmand — the choice is yours.' },
  { q: 'Can I add my own label?', a: 'We offer custom label design with your name, date, message, or brand logo. Perfect for weddings, corporate gifts, and return favors.' },
  { q: 'What is the minimum order quantity?', a: 'For custom candles, the minimum order is just 1 piece. For bulk orders with custom packaging, we recommend a minimum of 10 pieces for the best pricing.' },
  { q: 'What is the delivery time?', a: 'Custom candles take 5-7 days to handcraft, plus 2-3 days for delivery. For bulk orders (50+), please allow 10-14 days. We will share an exact timeline with your quote.' },
  { q: 'Do you offer bulk orders for events?', a: 'Yes, we specialize in bulk custom candle orders for weddings, corporate events, and return gifts. Contact us with your requirements and we will provide a custom quote with volume pricing.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-cream-50 py-16 lg:py-24">
      <div className="container-luxury max-w-3xl">
        <div className="text-center mb-10 lg:mb-12">
          <span className="section-eyebrow">Questions & Answers</span>
          <h2 className="section-title mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-soft overflow-hidden border border-cream-200"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-serif text-base sm:text-lg text-forest-900">{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={`text-gold-600 shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-beige-700 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
