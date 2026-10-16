import { motion } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { siteContent } from '@/data/siteContent';

export default function About() {
  return (
    <div className="min-h-screen bg-forest-900">
      <section className="bg-forest-800 py-12 lg:py-16">
        <div className="container-luxury">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About Us' }]} />
        </div>
      </section>

      <section className="container-luxury py-16 lg:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.25em] text-gold-400 mb-4"
          >
            {siteContent.about.eyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-serif text-4xl md:text-5xl text-cream-100 leading-tight mb-8"
          >
            {siteContent.about.heading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-cream-300/80 leading-relaxed"
          >
            {siteContent.about.body}
          </motion.p>
        </div>
      </section>
    </div>
  );
}
