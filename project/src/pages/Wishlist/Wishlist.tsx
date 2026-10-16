import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { getProductById } from '@/data/products';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

export default function Wishlist() {
  const { wishlist, removeWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const items = wishlist.map((id) => getProductById(id)).filter(Boolean);

  if (items.length === 0) {
    return (
      <div className="container-luxury py-20 text-center">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
        <div className="w-20 h-20 rounded-full bg-forest-800 flex items-center justify-center mx-auto mb-6">
          <Heart size={32} className="text-gold-400" />
        </div>
        <h1 className="font-serif text-3xl text-cream-100 mb-3">Your wishlist is empty</h1>
        <p className="text-cream-300/80 mb-8 max-w-md mx-auto">
          Save the candles you love by tapping the heart icon — they will appear here.
        </p>
        <Link to="/collections" className="btn-gold">
          Discover Candles <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxury py-10 lg:py-14">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
      <h1 className="font-serif text-4xl text-cream-100 mb-2">My Wishlist</h1>
      <p className="text-cream-300/80 mb-8">{items.length} {items.length === 1 ? 'candle' : 'candles'} saved</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {items.map((product) => product && (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-forest-800 rounded-2xl shadow-card overflow-hidden group border border-forest-700"
            >
              <Link to={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-cream-100">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product.slug}`}>
                  <h3 className="font-serif text-lg text-cream-100 hover:text-gold-400 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-cream-400 mt-0.5">{product.fragrance}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-semibold text-gold-400">
                    ₹{product.discountPrice ?? product.price}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { addToCart(product); showToast(`${product.name} added to cart`); }}
                      className="w-9 h-9 rounded-full bg-forest-700 text-cream-100 hover:bg-forest-600 flex items-center justify-center transition-colors"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag size={15} />
                    </button>
                    <button
                      onClick={() => removeWishlist(product.id)}
                      className="w-9 h-9 rounded-full bg-forest-700 text-cream-300 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
