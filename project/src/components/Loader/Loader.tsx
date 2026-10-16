import { motion } from 'framer-motion';

export default function Loader({ fullScreen = false }: { fullScreen?: boolean }) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-2 border-gold-200 border-t-gold-500"
      />
      <p className="font-serif text-lg text-forest-800 tracking-wide">Glow With Aura</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-cream-50">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-20">{content}</div>;
}
