import { motion } from 'framer-motion';
import { useCountUp, useInView } from '@/hooks/useCountUp';

interface StatCounterProps {
  value: string;
  label: string;
  delay?: number;
}

export default function StatCounter({ value, label, delay = 0 }: StatCounterProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const numericMatch = value.match(/(\d+)/);
  const numericValue = numericMatch ? parseInt(numericMatch[1], 10) : 0;
  const prefix = value.slice(0, numericMatch?.index ?? 0);
  const suffix = value.slice((numericMatch?.index ?? 0) + (numericMatch?.[0].length ?? 0));

  const animatedValue = useCountUp(numericValue, 1800, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="text-center p-6 rounded-2xl bg-forest-800 border border-forest-700"
    >
      <p className="font-serif text-4xl md:text-5xl text-gold-400 mb-1">
        {prefix}{animatedValue}{suffix}
      </p>
      <p className="text-sm text-cream-300/80">{label}</p>
    </motion.div>
  );
}
