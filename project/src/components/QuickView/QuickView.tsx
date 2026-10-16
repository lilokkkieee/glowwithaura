import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Check } from 'lucide-react';
import type { Product } from '@/types';
import Modal from '@/components/Modal/Modal';
import Rating from '@/components/Rating/Rating';
import ImagePlaceholder from '@/components/ImagePlaceholder/ImagePlaceholder';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickView({ product, onClose }: QuickViewProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  if (!product) return null;
  const wished = isInWishlist(product.id);

  const handleAdd = () => {
    addToCart(product, qty);
    showToast(`${product.name} added to cart`);
    onClose();
  };

  return (
    <Modal open={!!product} onClose={onClose} maxWidth="max-w-4xl">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="bg-forest-800 p-6">
          <div className="aspect-square rounded-xl overflow-hidden mb-3">
            {product.images[activeImage] ? (
              <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <ImagePlaceholder label={product.name} className="w-full h-full" variant="dark" />
            )}
          </div>
          {product.images.length > 0 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-gold-500' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 flex flex-col bg-forest-900">
          <p className="text-xs uppercase tracking-wider text-gold-400 mb-2">{product.category}</p>
          <h2 className="font-serif text-2xl text-cream-100 mb-2">{product.name}</h2>
          <Rating value={product.rating} count={product.reviewCount} size="md" />
          <p className="text-sm text-cream-300/80 mt-4 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-3 mt-5">
            {product.discountPrice ? (
              <>
                <span className="text-2xl font-semibold text-gold-400">₹{product.discountPrice}</span>
                <span className="text-base text-cream-400 line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-gold-400">₹{product.price}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
            <div className="flex items-center gap-1.5 text-cream-300/80">
              <Check size={14} className="text-gold-400" /> Burn: {product.burnTime}
            </div>
            <div className="flex items-center gap-1.5 text-cream-300/80">
              <Check size={14} className="text-gold-400" /> {product.weight}
            </div>
            <div className="flex items-center gap-1.5 text-cream-300/80">
              <Check size={14} className="text-gold-400" /> {product.fragrance}
            </div>
            <div className="flex items-center gap-1.5 text-cream-300/80">
              <Check size={14} className="text-gold-400" /> SKU: {product.sku}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center border border-forest-600 rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-cream-200 hover:text-gold-400">−</button>
              <span className="px-3 font-medium text-cream-100">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-cream-200 hover:text-gold-400">+</button>
            </div>
            <button onClick={handleAdd} className="btn-primary flex-1">
              <ShoppingBag size={16} /> Add to Cart
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${
                wished ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-forest-600 text-cream-200 hover:border-gold-400'
              }`}
              aria-label="Wishlist"
            >
              <Heart size={18} className={wished ? 'fill-red-500' : ''} />
            </button>
          </div>

          <Link
            to={`/product/${product.slug}`}
            onClick={onClose}
            className="mt-4 text-sm text-gold-400 hover:text-gold-300 link-underline self-start"
          >
            View full details
          </Link>
        </div>
      </div>
    </Modal>
  );
}
