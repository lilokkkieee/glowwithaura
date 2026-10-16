import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import type { Product } from '@/types';
import Rating from '@/components/Rating/Rating';
import ImagePlaceholder from '@/components/ImagePlaceholder/ImagePlaceholder';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  index?: number;
}

export default function ProductCard({ product, onQuickView, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const wished = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    showToast(wished ? 'Removed from wishlist' : 'Added to wishlist', 'info');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.slug}`} className="card-luxury group block">
        <div className="relative aspect-square overflow-hidden bg-cream-100">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder label={product.name} className="w-full h-full" />
          )}
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.discountPercent && (
              <span className="bg-gold-500 text-forest-900 text-xs font-semibold px-2.5 py-1 rounded-full">
                -{product.discountPercent}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-forest-700 text-cream-100 text-xs font-semibold px-2.5 py-1 rounded-full">
                New
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleWishlist}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                wished ? 'bg-red-50 text-red-500' : 'bg-white/90 text-forest-700 hover:bg-white'
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart size={16} className={wished ? 'fill-red-500' : ''} />
            </button>
            <button
              onClick={handleQuickView}
              className="w-9 h-9 rounded-full bg-white/90 text-forest-700 hover:bg-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
              aria-label="Quick view"
            >
              <Eye size={16} />
            </button>
          </div>

          {/* Add to cart bar */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary py-2.5 text-sm justify-center"
              disabled={product.stock === 0}
            >
              <ShoppingBag size={15} />
              {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs uppercase tracking-wider text-gold-600 mb-1">{product.category}</p>
          <h3 className="font-serif text-lg text-forest-900 leading-snug mb-1.5 group-hover:text-gold-600 transition-colors">
            {product.name}
          </h3>
          {product.reviewCount > 0 && <Rating value={product.rating} count={product.reviewCount} />}
          <div className="flex items-center gap-2 mt-2.5">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-semibold text-forest-900">
                  ₹{product.discountPrice}
                </span>
                <span className="text-sm text-beige-500 line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="text-lg font-semibold text-forest-900">₹{product.price}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
