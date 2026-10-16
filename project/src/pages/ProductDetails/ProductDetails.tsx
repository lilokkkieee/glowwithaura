import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, ShoppingBag, Share2, Minus, Plus, Check, Truck, RotateCcw,
  ChevronRight, Star, Loader2,
} from 'lucide-react';
import { getProductBySlug, getRelatedProducts } from '@/data/products';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { useAuth } from '@/context/AuthContext';
import Rating from '@/components/Rating/Rating';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import ProductCard from '@/components/ProductCard/ProductCard';
import QuickView from '@/components/QuickView/QuickView';
import ImagePlaceholder from '@/components/ImagePlaceholder/ImagePlaceholder';
import type { Product } from '@/types';

interface DBReview {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = slug ? getProductBySlug(slug) : undefined;
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const { addRecentlyViewed } = useRecentlyViewed();
  const { user } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'description' | 'ingredients' | 'reviews'>('description');
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<DBReview[]>([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (!product) return;
    addRecentlyViewed(product.id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveImage(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQty(1);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTab('description');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReviewSubmitted(false);
  }, [product, addRecentlyViewed]);

  useEffect(() => {
    if (product && tab === 'reviews') {
      supabase
        .from('product_reviews')
        .select('id, user_name, rating, comment, created_at')
        .eq('product_id', product.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setReviews(data as DBReview[]); });
    }
  }, [product, tab]);

  if (!product) {
    return (
      <div className="container-luxury py-20 text-center">
        <p className="font-serif text-2xl text-cream-100 mb-4">Product not found</p>
        <button onClick={() => navigate('/collections')} className="btn-primary">
          Back to Collections
        </button>
      </div>
    );
  }

  const wished = isInWishlist(product.id);
  const related = getRelatedProducts(product);

  const handleAdd = () => {
    addToCart(product, qty);
    showToast(`${product.name} added to cart`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url: window.location.href });
      } catch { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard', 'info');
    }
  };

  return (
    <>
      <div className="container-luxury py-8 lg:py-12">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Collections', to: '/collections' },
            { label: product.name },
          ]}
        />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible scrollbar-hide">
              {product.images.length > 0 ? (
                product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === i ? 'border-gold-500' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))
              ) : (
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-transparent">
                  <ImagePlaceholder className="w-full h-full" iconSize={20} />
                </div>
              )}
            </div>
            <motion.div
              key={activeImage}
              initial={{ opacity: 0.5, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex-1 aspect-square rounded-3xl overflow-hidden bg-cream-100 shadow-card"
            >
              {product.images[activeImage] ? (
                <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <ImagePlaceholder label={product.name} className="w-full h-full" iconSize={56} />
              )}
            </motion.div>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-400 mb-2">{product.category}</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream-100 leading-tight mb-3">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-5">
              {product.reviewCount > 0 && (
                <Rating value={product.rating} count={product.reviewCount} size="md" />
              )}
              {product.reviewCount > 0 && (
                <button
                  onClick={() => setTab('reviews')}
                  className="text-sm text-gold-400 hover:underline"
                >
                  Read reviews
                </button>
              )}
            </div>

            <p className="text-cream-300/80 leading-relaxed mb-6">{product.longDescription}</p>

            <div className="flex items-baseline gap-3 mb-6">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-semibold text-gold-400">₹{product.discountPrice}</span>
                  <span className="text-lg text-cream-400 line-through">₹{product.price}</span>
                  <span className="bg-red-500/20 text-red-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Save {product.discountPercent}%
                  </span>
                </>
              ) : (
                <span className="text-3xl font-semibold text-gold-400">₹{product.price}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 p-5 rounded-2xl bg-forest-800 border border-forest-700">
              <div>
                <p className="text-xs uppercase tracking-wider text-cream-400/60 mb-1">Fragrance</p>
                <p className="text-sm text-cream-100 font-medium">{product.fragrance}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-cream-400/60 mb-1">Burn Time</p>
                <p className="text-sm text-cream-100 font-medium">{product.burnTime}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-cream-400/60 mb-1">Weight</p>
                <p className="text-sm text-cream-100 font-medium">{product.weight}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-cream-400/60 mb-1">SKU</p>
                <p className="text-sm text-cream-100 font-medium">{product.sku}</p>
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              {product.stock > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-forest-500" />
                  <span className="text-sm text-gold-400">
                    In stock — {product.stock} {product.stock < 10 ? 'left, selling fast' : 'available'}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm text-red-600">Out of stock</span>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center border border-beige-300 rounded-full">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-cream-200 hover:text-gold-400" aria-label="Decrease">
                  <Minus size={16} />
                </button>
                <span className="px-3 font-medium min-w-[2rem] text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 py-3 text-cream-200 hover:text-gold-400" aria-label="Increase">
                  <Plus size={16} />
                </button>
              </div>
              <button onClick={handleAdd} className="btn-primary flex-1 min-w-[180px]" disabled={product.stock === 0}>
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <button
                onClick={() => { toggleWishlist(product.id); showToast(wished ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  wished ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-forest-600 text-cream-200 hover:border-gold-400'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={20} className={wished ? 'fill-red-500' : ''} />
              </button>
              <button
                onClick={handleShare}
                className="w-12 h-12 rounded-full border border-forest-600 text-cream-200 hover:border-gold-400 flex items-center justify-center transition-all"
                aria-label="Share"
              >
                <Share2 size={20} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-forest-700">
              <div className="flex flex-col items-center text-center gap-1.5">
                <Truck size={20} className="text-gold-400" />
                <p className="text-xs text-cream-300/80">Free shipping over ₹499</p>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <RotateCcw size={20} className="text-gold-400" />
                <p className="text-xs text-cream-300/80"> 42hr burn guarantee </p>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <Check size={20} className="text-gold-400" />
                <p className="text-xs text-cream-300/80">Clean ingredients</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 lg:mt-24">
          <div className="flex gap-2 border-b border-forest-700 mb-8 overflow-x-auto scrollbar-hide">
            {([
              { key: 'description', label: 'Description' },
              { key: 'ingredients', label: 'Ingredients' },
              { key: 'reviews', label: `Reviews (${product.reviewCount})` },
            ] as const).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  tab === t.key ? 'border-gold-400 text-gold-400' : 'border-transparent text-cream-300/60 hover:text-cream-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tab === 'description' && (
              <div className="max-w-2xl text-cream-300/80 leading-relaxed space-y-4">
                <p>{product.longDescription}</p>
                <p>
                  Each {product.name} candle is hand-poured in small batches at our studio using a coconut-soy wax blend for a clean, even burn. The vessel is designed to be reused — rinse with warm water and give it a second life as a planter, pen cup, or votive holder.
                </p>
              </div>
            )}

            {tab === 'ingredients' && (
              <ul className="max-w-2xl space-y-2">
                {product.ingredients.map((ing) => (
                  <li key={ing} className="flex items-center gap-2 text-cream-300/80">
                    <Check size={16} className="text-gold-400" /> {ing}
                  </li>
                ))}
                <li className="text-sm text-cream-400/60 pt-3">
                  Free of phthalates, parabens, and synthetic dyes. Never tested on animals.
                </li>
              </ul>
            )}

            {tab === 'reviews' && (
              <div className="max-w-3xl space-y-6">
                {product.reviewCount > 0 && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-2xl bg-forest-800 border border-forest-700">
                    <div className="text-center">
                      <p className="font-serif text-5xl text-gold-400">{product.rating.toFixed(1)}</p>
                      <Rating value={product.rating} showCount={false} size="md" />
                      <p className="text-xs text-cream-400/60 mt-1">{product.reviewCount} reviews</p>
                    </div>
                    <div className="flex-1 w-full space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter((r) => r.rating === star).length;
                        const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2 text-sm">
                            <span className="flex items-center gap-0.5 w-12 text-cream-300/60">
                              {star} <Star size={12} className="fill-gold-400 text-gold-400" />
                            </span>
                            <div className="flex-1 h-2 rounded-full bg-beige-200 overflow-hidden">
                              <div className="h-full bg-gold-400 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-8 text-right text-cream-400/60">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Review form */}
                {reviewSubmitted ? (
                  <div className="p-6 rounded-2xl border border-gold-400/30 bg-gold-500/10 text-center">
                    <Check size={24} className="text-gold-400 mx-auto mb-2" />
                    <p className="text-cream-100 font-medium">Thanks! Your review will appear after approval.</p>
                  </div>
                ) : user ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (reviewRating < 1 || !reviewComment.trim()) return;
                      setSubmitting(true);
                      try {
                        const { error } = await supabase.from('product_reviews').insert({
                          product_id: product.id,
                          user_id: user.uid,
                          user_name: user.displayName,
                          rating: reviewRating,
                          comment: reviewComment.trim(),
                        });
                        if (error) throw error;
                        setReviewSubmitted(true);
                        setReviewRating(0);
                        setReviewComment('');
                      } catch {
                        showToast('Could not submit review. You may have already reviewed this product.', 'error');
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    className="p-6 rounded-2xl border border-forest-700"
                  >
                    <h4 className="font-serif text-lg text-cream-100 mb-4">Write a Review</h4>
                    <div className="flex items-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewRating(s)}
                          aria-label={`${s} stars`}
                        >
                          <Star
                            size={24}
                            className={s <= reviewRating ? 'fill-gold-400 text-gold-400' : 'text-beige-300'}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={3}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-forest-800 border border-forest-700 text-cream-100 placeholder:text-cream-400 text-sm focus:outline-none focus:border-gold-400 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={submitting || reviewRating < 1}
                      className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-forest-900 font-medium hover:bg-gold-400 transition-colors text-sm disabled:opacity-50"
                    >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <div className="p-6 rounded-2xl border border-forest-700 text-center">
                    <p className="text-cream-300/60 text-sm">
                      <Link to="/login" className="text-gold-400 hover:underline">Log in</Link> to write a review
                    </p>
                  </div>
                )}

                {reviews.length === 0 && product.reviewCount === 0 && (
                  <p className="text-center text-cream-300/40 text-sm py-8">No reviews yet. Be the first to share your experience!</p>
                )}

                {reviews.map((review) => (
                  <div key={review.id} className="p-6 rounded-2xl border border-forest-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-forest-700 text-gold-400 flex items-center justify-center font-serif">
                          {review.user_name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-cream-100">{review.user_name}</p>
                          <p className="text-xs text-cream-400/60">{new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <Rating value={review.rating} showCount={false} />
                    </div>
                    <p className="text-cream-300/80 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20 lg:mt-28">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.25em] text-gold-400 mb-3">You May Also Love</span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream-100 leading-tight">Related candles</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickView} index={i} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/collections" className="inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 link-underline">
            Continue shopping <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
