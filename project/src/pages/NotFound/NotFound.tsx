import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-full bg-forest-800 flex items-center justify-center mx-auto mb-8">
          <Flame size={36} className="text-gold-400" />
        </div>
        <p className="font-serif text-7xl md:text-8xl text-cream-100 mb-2">404</p>
        <h1 className="font-serif text-2xl text-cream-100 mb-4">This page flickered out.</h1>
        <p className="text-cream-300/80 mb-8">
          The page you are looking for may have been moved or no longer exists. Let us guide you back to the light.
        </p>
        <Link to="/" className="btn-gold">
          Back to Home <ArrowRight size={18} />
        </Link>
      </motion.div>
    </div>
  );
}
