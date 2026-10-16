import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

interface LegalSection {
  heading: string;
  body: ReactNode;
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

export default function LegalLayout({ title, lastUpdated, intro, sections }: LegalLayoutProps) {
  return (
    <div className="container-luxury py-10 lg:py-16 max-w-3xl">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: title }]} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-serif text-4xl md:text-5xl text-cream-100 mb-3">{title}</h1>
        <p className="text-sm text-cream-400/60 mb-2">Last updated: {lastUpdated}</p>
        <p className="text-cream-300/80 leading-relaxed mb-10">{intro}</p>

        <div className="space-y-8">
          {sections.map((s, i) => (
            <motion.section
              key={s.heading}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <h2 className="font-serif text-xl md:text-2xl text-cream-100 mb-3">{s.heading}</h2>
              <div className="text-cream-300/80 leading-relaxed space-y-3">{s.body}</div>
            </motion.section>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
