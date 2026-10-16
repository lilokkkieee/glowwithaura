import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight, ArrowLeft, X, Loader2,
  Banknote, QrCode, Check, Package,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import scannerImage from '@/assets/images/scanner/scanner_picture_.jpg';

type PaymentMethod = 'COD' | 'UPI';
type CheckoutStep = 'cart' | 'address' | 'payment' | 'confirmation';

const COD_CHARGE = 99;

interface AddressForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
}

export default function Cart() {
  const {
    items, updateQuantity, removeFromCart, subtotal, discount, total, coupon, applyCoupon, removeCoupon, clearCart,
  } = useCart();
  const { showToast } = useToast();
  const [couponInput, setCouponInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [upiRef, setUpiRef] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderPaymentMethod, setOrderPaymentMethod] = useState<PaymentMethod>('COD');
  const [address, setAddress] = useState<AddressForm>({
    fullName: '', phone: '', address: '', city: '', state: '', zip: '', email: '',
  });
  const { user } = useAuth();

  const shippingCost = subtotal >= 499 ? 0 :49 ;
  const codCharge = paymentMethod === 'COD' ? COD_CHARGE : 0;
  const grandTotal = total + shippingCost + codCharge;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyCoupon(couponInput)) {
      showToast(`Coupon "${couponInput.toUpperCase()}" applied`);
      setCouponInput('');
    } else {
      showToast('Invalid coupon code', 'error');
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.address || !address.city || !address.state || !address.zip || !address.email) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'UPI' && !upiRef.trim()) {
      showToast('Please enter your UPI transaction reference ID', 'error');
      return;
    }
    setLoading(true);
    try {
      const shippingAddressStr = `${address.fullName}, ${address.address}, ${address.city}, ${address.state} ${address.zip}`;
      const orderPayload = {
        customerName: address.fullName,
        customerEmail: address.email,
        customerPhone: address.phone,
        shippingAddress: shippingAddressStr,
        items: items.map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.discountPrice ?? i.product.price,
          fragrance: i.product.fragrance,
        })),
        subtotal,
        discount,
        shipping: shippingCost,
        codCharge,
        total: grandTotal,
        coupon,
        userId: user?.uid ?? null,
        paymentMethod,
        paymentReference: paymentMethod === 'UPI' ? upiRef.trim() : null,
      };

      const { data: sessionData } = await supabase.auth.getSession();
      const authToken = sessionData.session?.access_token ?? import.meta.env.VITE_SUPABASE_ANON_KEY;
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-order-email`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setOrderNumber(data.orderNumber || 'GWA-UNKNOWN');
      setOrderTotal(grandTotal);
      setOrderPaymentMethod(paymentMethod);
      clearCart();
      setStep('confirmation');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Checkout failed. Please try again.';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Empty cart ---
  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="container-luxury py-20 text-center">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
        <div className="w-20 h-20 rounded-full bg-forest-800 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={32} className="text-gold-400" />
        </div>
        <h1 className="font-serif text-3xl text-cream-100 mb-3">Your cart is empty</h1>
        <p className="text-cream-300/80 mb-8 max-w-md mx-auto">
          Looks like you have not added any candles yet. Let us fix that.
        </p>
        <Link to="/collections" className="btn-gold">
          Browse Candles <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  // --- Confirmation screen ---
  if (step === 'confirmation') {
    return (
      <div className="container-luxury py-20 text-center">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Order Confirmation' }]} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto"
        >
          <div className="w-20 h-20 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-gold-400" />
          </div>
          <h1 className="font-serif text-3xl text-cream-100 mb-3">Order Placed Successfully!</h1>
          <p className="text-cream-300/80 mb-6">
            Your order number is{' '}
            <span className="font-serif text-2xl font-semibold text-gold-400">{orderNumber}</span>
            {' '}— save this to track your order.
          </p>
          <div className="bg-forest-800 rounded-2xl p-6 border border-forest-700 space-y-3 mb-8 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-cream-300/70">Payment Method</span>
              <span className="text-cream-100 font-medium">
                {orderPaymentMethod === 'UPI' ? 'Scan & Pay' : 'Cash on Delivery'}
              </span>
            </div>
            {orderPaymentMethod === 'UPI' && (
              <div className="flex justify-between text-sm">
                <span className="text-cream-300/70">Payment Status</span>
                <span className="text-gold-400 font-medium">Pending Verification</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-cream-300/70">Total</span>
              <span className="text-gold-400 font-semibold">₹{orderTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/track-order" className="btn-gold">
              <Package size={18} /> Track Your Order
            </Link>
            <Link to="/collections" className="btn-outline">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Address step ---
  if (step === 'address') {
    return (
      <div className="container-luxury py-10 lg:py-14 max-w-2xl">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Delivery Details' }]} />
        <h1 className="font-serif text-3xl text-cream-100 mb-2">Delivery Details</h1>
        <p className="text-cream-300/60 text-sm mb-8">Step 1 of 2 — Enter your shipping address</p>

        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-cream-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                className="input-luxury"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm text-cream-300 mb-1.5">Phone</label>
              <input
                type="tel"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="input-luxury"
                placeholder="9876543210"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-cream-300 mb-1.5">Email</label>
            <input
              type="email"
              value={address.email}
              onChange={(e) => setAddress({ ...address, email: e.target.value })}
              className="input-luxury"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-cream-300 mb-1.5">Street Address</label>
            <input
              type="text"
              value={address.address}
              onChange={(e) => setAddress({ ...address, address: e.target.value })}
              className="input-luxury"
              placeholder="123 Main Street, Apt 4B"
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-cream-300 mb-1.5">City</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="input-luxury"
                placeholder="Mumbai"
              />
            </div>
            <div>
              <label className="block text-sm text-cream-300 mb-1.5">State</label>
              <input
                type="text"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="input-luxury"
                placeholder="Maharashtra"
              />
            </div>
            <div>
              <label className="block text-sm text-cream-300 mb-1.5">ZIP</label>
              <input
                type="text"
                value={address.zip}
                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                className="input-luxury"
                placeholder="400001"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setStep('cart')} className="btn-outline px-5 py-3">
              <ArrowLeft size={18} /> Back
            </button>
            <button type="submit" className="btn-gold flex-1">
              Continue to Payment <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- Payment step ---
  if (step === 'payment') {
    const paymentOptions: { id: PaymentMethod; label: string; icon: typeof Banknote; desc: string }[] = [
      { id: 'COD', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when your order arrives' },
      { id: 'UPI', label: 'Scan & Pay', icon: QrCode, desc: 'Pay securely by scanning the QR code using GPay, PhonePe, Paytm or any UPI app.' },
    ];

    return (
      <div className="container-luxury py-10 lg:py-14 max-w-2xl">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Delivery', to: '/cart' }, { label: 'Payment' }]} />
        <h1 className="font-serif text-3xl text-cream-100 mb-2">Payment Method</h1>
        <p className="text-cream-300/60 text-sm mb-8">Step 2 of 2 — Choose how you want to pay</p>

        <div className="space-y-3 mb-6">
          {paymentOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPaymentMethod(opt.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                paymentMethod === opt.id
                  ? 'border-gold-400 bg-forest-700'
                  : 'border-forest-600 bg-forest-800 hover:border-forest-500'
              }`}
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                paymentMethod === opt.id ? 'bg-gold-500/20 text-gold-400' : 'bg-forest-700 text-cream-400'
              }`}>
                <opt.icon size={22} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className={`font-medium ${paymentMethod === opt.id ? 'text-cream-100' : 'text-cream-300'}`}>
                  {opt.label}
                </p>
                <p className="text-xs text-cream-400/70 mt-0.5">{opt.desc}</p>
              </div>
              {paymentMethod === opt.id && <Check size={18} className="text-gold-400 shrink-0" />}
            </button>
          ))}
        </div>

        {/* Scan & Pay details */}
        {paymentMethod === 'UPI' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-forest-800 rounded-2xl p-5 border border-forest-700 space-y-4 mb-6"
          >
            <div className="text-center">
              <p className="text-cream-300/70 text-sm mb-3">
                Scan this QR code with GPay, PhonePe, Paytm or any UPI app.
              </p>
              <div className="inline-block bg-white rounded-2xl p-3 sm:p-4">
                <img
                  src={scannerImage}
                  alt="UPI QR Code"
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                />
              </div>
              <p className="text-gold-400 font-semibold text-lg mt-3">
                Amount to Pay: ₹{grandTotal.toFixed(2)}
              </p>
            </div>
            <div>
              <label className="block text-sm text-cream-300 mb-1.5">
                UPI Transaction Reference ID
              </label>
              <input
                type="text"
                value={upiRef}
                onChange={(e) => setUpiRef(e.target.value)}
                className="input-luxury"
                placeholder="Enter your UPI transaction ID / UTR number"
              />
              <p className="text-xs text-cream-400/60 mt-1.5">
                Enter the transaction reference ID you received after making the UPI payment. Your order will be confirmed after verification.
              </p>
            </div>
          </motion.div>
        )}

        {/* COD info */}
        {paymentMethod === 'COD' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-forest-800 rounded-2xl p-5 border border-forest-700 mb-6"
          >
            <p className="text-sm text-cream-300/70">
              Cash on Delivery includes a ₹{COD_CHARGE} COD handling charge.
            </p>
          </motion.div>
        )}

        {/* Order summary */}
        <div className="bg-forest-800 rounded-2xl p-5 border border-forest-700 space-y-3 mb-6">
          <h3 className="font-serif text-lg text-cream-100 mb-2">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-cream-300/80"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-gold-400"><span>Discount</span><span>−₹{discount.toFixed(2)}</span></div>
            )}
            <div className="flex justify-between text-cream-300/80"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span></div>
            {codCharge > 0 && (
              <div className="flex justify-between text-cream-300/80"><span>COD Charge</span><span>₹{codCharge.toFixed(2)}</span></div>
            )}
            <div className="flex justify-between text-cream-100 font-bold text-base pt-2 border-t border-forest-600">
              <span>Total</span><span className="text-gold-400">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => setStep('address')} className="btn-outline px-5 py-3">
            <ArrowLeft size={18} /> Back
          </button>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={loading || (paymentMethod === 'UPI' && !upiRef.trim())}
            className="btn-gold flex-1"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Place Order <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>
    );
  }

  // --- Cart view (default) ---
  return (
    <div className="container-luxury py-10 lg:py-14">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shopping Cart' }]} />
      <h1 className="font-serif text-3xl sm:text-4xl text-cream-100 mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex gap-4 p-4 bg-forest-800 rounded-2xl shadow-soft border border-forest-700"
              >
                <Link to={`/product/${item.product.slug}`} className="shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover"
                  />
                </Link>

                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/product/${item.product.slug}`}>
                        <h3 className="font-serif text-lg text-cream-100 hover:text-gold-400 transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-cream-400 mt-0.5">{item.product.fragrance}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-beige-400 hover:text-red-500 transition-colors shrink-0"
                      aria-label="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mt-auto pt-3">
                    <div className="flex items-center border border-forest-600 rounded-full">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1.5 text-cream-200 hover:text-gold-400"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm font-medium text-cream-100">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1.5 text-cream-200 hover:text-gold-400"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-cream-100">
                        ₹{((item.product.discountPrice ?? item.product.price) * item.quantity).toFixed(2)}
                      </p>
                      {item.product.discountPrice && (
                        <p className="text-xs text-cream-400 line-through">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Link to="/collections" className="inline-flex items-center gap-1 text-sm text-gold-400 hover:text-gold-300 mt-2">
            ← Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-28 h-fit">
          <div className="bg-forest-800 rounded-2xl shadow-card p-6 space-y-5 border border-forest-700">
            <h2 className="font-serif text-xl text-cream-100">Order Summary</h2>

            {/* Coupon */}
            {coupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-forest-700 border border-forest-600">
                <span className="flex items-center gap-2 text-sm text-cream-100 min-w-0">
                  <Tag size={16} className="shrink-0" /> <span className="truncate">{coupon} applied</span>
                </span>
                <button onClick={removeCoupon} className="text-cream-400 hover:text-red-400 shrink-0">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code"
                  className="input-luxury py-2.5 text-sm min-w-0"
                />
                <button type="submit" className="btn-outline px-4 py-2.5 text-sm whitespace-nowrap shrink-0">
                  Apply
                </button>
              </form>
            )}

            <p className="text-xs text-cream-400/60">
              Try: AURA10, LUXURY15, GLOW20
            </p>

            <div className="space-y-2.5 text-sm border-t border-forest-700 pt-4">
              <div className="flex justify-between text-cream-300/80">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-gold-400">
                  <span>Discount</span>
                  <span>−₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-cream-300/80">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline border-t border-forest-700 pt-4">
              <span className="font-serif text-lg text-cream-100">Total</span>
              <span className="font-serif text-2xl font-semibold text-gold-400">
                ₹{(total + shippingCost).toFixed(2)}
              </span>
            </div>

            <p className="text-xs text-center text-cream-400/60">
              COD orders include a ₹99 handling charge, added at payment.
            </p>

            <button onClick={() => setStep('address')} className="btn-gold w-full">
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <p className="text-xs text-center text-cream-400/60">
              Secure checkout · Free returns within 5-7 days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
