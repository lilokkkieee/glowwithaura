import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, User, Menu, X, Flame } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { getProductsArray } from '@/data/products';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Collections', to: '/collections' },
  { label: 'Custom Candles', to: '/custom-candles' },
  { label: 'Gift Sets', to: '/gift' },
  { label: 'About', to: '/about' },
  { label: 'Track Order', to: '/track-order' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  const searchResults = searchQuery
    ? getProductsArray()
        .filter((p) => {
          const q = searchQuery.toLowerCase().trim().replace(/\s+/g, ' ');
          const name = p.name.toLowerCase().trim().replace(/\s+/g, ' ');
          const category = p.category.toLowerCase().trim().replace(/\s+/g, ' ');
          const fragrance = p.fragrance.toLowerCase().trim().replace(/\s+/g, ' ');
          return name.includes(q) || category.includes(q) || fragrance.includes(q);
        })
        .slice(0, 5)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-dark shadow-soft' : 'bg-forest-900'
        }`}
      >
        <nav className="container-luxury flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0">
            <div className="w-8 h-8 rounded-full bg-forest-700 flex items-center justify-center">
              <Flame size={16} className="text-gold-400" />
            </div>
            <div className="leading-none">
              <span className="font-serif text-base sm:text-xl lg:text-2xl font-semibold text-cream-100 block">
                Glow With Aura
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold-400 hidden sm:block">
                Luxury Candles
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `text-sm font-medium tracking-wide transition-colors hover:text-gold-400 ${
                      isActive ? 'text-gold-400' : 'text-cream-200'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden sm:flex w-10 h-10 rounded-full hover:bg-forest-800 items-center justify-center transition-colors"
              aria-label="Search"
            >
              <Search size={19} className="text-cream-200" />
            </button>

            <Link
              to="/wishlist"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-forest-800 flex items-center justify-center transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={19} className="text-cream-200" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-forest-800 flex items-center justify-center transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag size={19} className="text-cream-200" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              to={user ? '/account' : '/login'}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-forest-800 flex items-center justify-center transition-colors"
              aria-label="Account"
            >
              <User size={19} className="text-cream-200" />
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-forest-800 flex items-center justify-center transition-colors lg:hidden"
              aria-label="Menu"
            >
              <Menu size={21} className="text-cream-200" />
            </button>
          </div>
        </nav>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-forest-700 bg-forest-800"
            >
              <div className="container-luxury py-5">
                <form onSubmit={handleSearch} className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-400" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candles, fragrances, collections..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-forest-700 border border-forest-600 text-cream-100 placeholder:text-cream-300 text-sm sm:text-base placeholder:text-sm sm:placeholder:text-base focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
                  />
                </form>
                {searchResults.length > 0 && (
                  <div className="mt-3 bg-forest-800 rounded-xl shadow-lift overflow-hidden border border-forest-700">
                    {searchResults.map((p) => (
                      <Link
                        key={p.id}
                        to={`/product/${p.slug}`}
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                        className="flex items-center gap-3 p-3 hover:bg-forest-700 transition-colors"
                      >
                        <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-serif text-cream-100">{p.name}</p>
                          <p className="text-xs text-cream-400">{p.fragrance}</p>
                        </div>
                        <span className="ml-auto font-semibold text-gold-400">₹{p.discountPrice ?? p.price}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-forest-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute inset-0 w-full bg-forest-800 shadow-lift flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-forest-700">
                <span className="font-serif text-xl text-cream-100">Menu</span>
                <button type="button" onClick={() => setMobileOpen(false)} className="w-10 h-10 rounded-full hover:bg-forest-700 flex items-center justify-center touch-manipulation" aria-label="Close menu">
                  <X size={20} className="text-cream-200" />
                </button>
              </div>
              <ul className="flex flex-col p-3 gap-1">
                <li>
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-cream-200 hover:bg-forest-700 transition-colors"
                  >
                    <Search size={19} className="text-cream-200" />
                    Search
                  </button>
                </li>
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      onClick={(event) => {
                        event.preventDefault();
                        setMobileOpen(false);
                        navigate(link.to);
                      }}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-xl font-medium transition-colors ${
                          isActive ? 'bg-gold-500 text-forest-900' : 'text-cream-200 hover:bg-forest-700'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <Link
                    to={user ? '/account' : '/login'}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl font-medium text-cream-200 hover:bg-forest-700 transition-colors"
                  >
                    {user ? 'My Account' : 'Sign In'}
                  </Link>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
