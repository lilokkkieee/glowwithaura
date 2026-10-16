import { motion } from 'framer-motion';
import { MessageSquare, Palette, Flame, Package } from 'lucide-react';

const steps = [
  { icon: MessageSquare, title: 'Tell Us Your Idea', desc: 'Share your vision — the occasion, the mood, the colors you love.' },
  { icon: Palette, title: 'Choose Color & Fragrance', desc: 'Pick from our premium wax colors and signature fragrances.' },
  { icon: Flame, title: 'We Handcraft Your Candle', desc: 'Our artisans pour each candle by hand with natural soy wax.' },
  { icon: Package, title: 'Delivered To Your Door', desc: 'Beautifully packaged and delivered across India in 7-10 days.' },
];

export default function HowItWorks() {
  return (
    <section className="bg-forest-800 py-16 lg:py-24 border-y border-forest-700">
      <div className="container-luxury">
        <div className="text-center mb-10 lg:mb-14">
          <span className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.25em] text-gold-400 mb-3">Simple & Seamless</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream-100 mb-4">How It Works</h2>
          <p className="text-cream-300/80 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            From idea to your doorstep in four elegant steps.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="relative inline-flex items-center justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-forest-700 flex items-center justify-center ring-1 ring-gold-400/20 relative z-10">
                  <step.icon size={26} className="text-gold-400" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gold-500 text-forest-900 text-xs font-sans font-semibold flex items-center justify-center z-20">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-serif text-lg text-cream-100 mb-2">{step.title}</h3>
              <p className="text-sm text-cream-300/80 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
