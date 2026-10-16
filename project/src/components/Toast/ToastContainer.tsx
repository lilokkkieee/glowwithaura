import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const icons = {
  success: <CheckCircle2 size={20} className="text-forest-500" />,
  error: <AlertCircle size={20} className="text-red-500" />,
  info: <Info size={20} className="text-gold-500" />,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="pointer-events-auto flex items-center gap-3 bg-white shadow-lift rounded-xl px-4 py-3 max-w-sm"
          >
            {icons[toast.type]}
            <p className="text-sm text-forest-900 font-medium flex-1">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-beige-400 hover:text-forest-800">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
