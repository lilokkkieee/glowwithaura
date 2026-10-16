import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CTA_BG = 'https://images.pexels.com/photos/6798396/pexels-photo-6798396.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop';

export default function CustomCTA() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0">
        <img src={CTA_BG} alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-forest-900/80" />
      </div>

      <div className="container-luxury relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-cream-100 leading-tight mb-5">
            Ready to create something beautiful?
          </h2>
          <p className="text-cream-300/80 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Tell us your vision and we will handcraft a candle made just for you. Perfect for any occasion.
          </p>
          <Link to="/custom-candles" className="btn-gold text-sm sm:text-base">
            Start Custom Order <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
