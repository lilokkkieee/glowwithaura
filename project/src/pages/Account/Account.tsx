import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, LogOut, ShoppingBag, Heart, Package, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

export default function Account() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      showToast('You have been signed out.');
      navigate('/');
    } catch {
      showToast('Could not sign out. Please try again.', 'error');
    } finally {
      setLoggingOut(false);
    }
  };

  if (!user) return null;

  const stats = [
    { icon: ShoppingBag, label: 'Cart Items', value: itemCount, to: '/cart' },
    { icon: Heart, label: 'Wishlist', value: wishlistCount, to: '/wishlist' },
    { icon: Package, label: 'Orders', value: '—', to: '/track-order' },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-forest-800 py-12 lg:py-16">
        <div className="container-luxury">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'My Account' }]} />
          <div className="flex items-center gap-5 mt-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-forest-700 flex items-center justify-center ring-2 ring-gold-400/30 shrink-0">
              <User size={32} className="text-gold-400" />
            </div>
            <div>
              <span className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.25em] text-gold-400 mb-1">
                Welcome back
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-cream-100 leading-tight">
                {user.displayName}
              </h1>
              <p className="text-cream-300/70 text-sm mt-1">{user.email}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-luxury py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <Link
                to={stat.to}
                className="block bg-forest-800 rounded-2xl shadow-card p-6 border border-forest-700 hover:border-gold-400/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-forest-700 text-gold-400 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-forest-900 transition-colors">
                    <stat.icon size={22} />
                  </div>
                  <span className="font-serif text-3xl text-cream-100">{stat.value}</span>
                </div>
                <p className="text-sm text-cream-300/70 font-medium">{stat.label}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 bg-forest-800 rounded-2xl shadow-card p-8 border border-forest-700"
        >
          <h2 className="font-serif text-xl text-cream-100 mb-6">Account Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center shrink-0">
                <User size={18} className="text-gold-400" />
              </div>
              <div>
                <p className="text-xs text-cream-400 uppercase tracking-wide">Name</p>
                <p className="text-cream-100">{user.displayName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center shrink-0">
                <Mail size={18} className="text-gold-400" />
              </div>
              <div>
                <p className="text-xs text-cream-400 uppercase tracking-wide">Email</p>
                <p className="text-cream-100">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-forest-700">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {loggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
              Sign Out
            </button>
          </div>
        </motion.div>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <Link
            to="/collections"
            className="flex items-center justify-between p-5 bg-forest-800 rounded-2xl border border-forest-700 hover:border-gold-400/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Package size={20} className="text-gold-400" />
              <span className="text-cream-100 font-medium">Continue Shopping</span>
            </div>
            <span className="text-cream-400 group-hover:text-gold-400 transition-colors">→</span>
          </Link>
          <Link
            to="/wishlist"
            className="flex items-center justify-between p-5 bg-forest-800 rounded-2xl border border-forest-700 hover:border-gold-400/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Heart size={20} className="text-gold-400" />
              <span className="text-cream-100 font-medium">View Wishlist</span>
            </div>
            <span className="text-cream-400 group-hover:text-gold-400 transition-colors">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
