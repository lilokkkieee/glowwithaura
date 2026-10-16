import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DISMISS_KEY = 'gwa_popup_dismissed';

export default function DiscountPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem(DISMISS_KEY, '1');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, source: 'popup' });

      if (error && error.code !== '23505') throw error;

      setSubscribed(true);
      setTimeout(() => handleClose(), 2500);
    } catch {
      setSubscribed(true);
      setTimeout(() => handleClose(), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, x: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-6 left-6 z-[90] w-[340px] max-w-[calc(100vw-3rem)]"
        >
          <div className="bg-white rounded-2xl shadow-lift overflow-hidden">
            {/* Header strip */}
            <div className="bg-gradient-to-r from-forest-700 to-forest-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <Gift size={18} className="text-gold-400" />
                </div>
                <div>
                  <p className="font-serif text-cream-100 text-base leading-tight">Exclusive Offer</p>
                  <p className="text-xs text-cream-300">First order discount</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full hover:bg-forest-600 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X size={16} className="text-cream-200" />
              </button>
            </div>

            {subscribed ? (
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-forest-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-forest-500" />
                </div>
                <p className="font-serif text-lg text-forest-900 mb-1">Welcome to the family!</p>
                <p className="text-sm text-beige-600">Check your inbox for your 15% off code.</p>
              </div>
            ) : (
              <div className="p-5">
                <h3 className="font-serif text-lg text-forest-900 mb-1.5">
                  Get 15% off your first order
                </h3>
                <p className="text-sm text-beige-600 mb-4 leading-relaxed">
                  Join the Glow List for early access to new collections and members-only offers.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-beige-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full pl-10 pr-4 py-2.5 rounded-full bg-cream-100 border border-beige-200 text-sm text-ink placeholder:text-beige-500 focus:outline-none focus:border-gold-400 focus:bg-white focus:ring-2 focus:ring-gold-200 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-gold py-2.5 text-sm"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : 'Claim My Discount'}
                  </button>
                </form>
                <button
                  onClick={handleClose}
                  className="w-full text-center text-xs text-beige-400 hover:text-beige-600 mt-3 transition-colors"
                >
                  No thanks, I will pay full price
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
