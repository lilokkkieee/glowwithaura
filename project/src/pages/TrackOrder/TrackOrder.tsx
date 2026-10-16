import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Search, Loader2, Check, Clock, Truck, MapPin, AlertCircle } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { useAuth } from '@/context/AuthContext';

interface TrackedOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string | null;
  items: Array<{ name: string; quantity: number; price: number; fragrance?: string }>;
  subtotal: number;
  discount: number;
  shipping: number;
  cod_charge: number;
  total: number;
  coupon: string | null;
  status: string;
  payment_method: string | null;
  payment_reference: string | null;
  payment_status: string;
  created_at: string;
}

const statusSteps = [
  { key: 'Placed', label: 'Order Placed', icon: Check },
  { key: 'Processing', label: 'Processing', icon: Clock },
  { key: 'Shipped', label: 'Shipped', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: MapPin },
];

function OrderHistoryCard({ order }: { order: TrackedOrder }) {
  const statusIdx = getStatusIndex(order.status);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-forest-800 rounded-2xl p-6 border border-forest-700 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl text-cream-100">{order.order_number}</h2>
          <p className="text-sm text-cream-300/50 mt-1">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <span className="text-gold-400 font-semibold">₹{Number(order.total).toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between">
        {statusSteps.map((step, index) => {
          const completed = index <= statusIdx;
          return (
            <div key={step.key} className="flex flex-col items-center flex-1 relative">
              {index < statusSteps.length - 1 && <div className={`absolute top-5 left-1/2 w-full h-0.5 ${index < statusIdx ? 'bg-gold-400' : 'bg-forest-600'}`} />}
              <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 ${completed ? 'border-gold-400 bg-gold-500/20 text-gold-400' : 'border-forest-600 bg-forest-800 text-cream-400/40'}`}>
                <step.icon size={18} />
              </div>
              <p className={`text-[11px] mt-2 text-center ${completed ? 'text-cream-100' : 'text-cream-400/40'}`}>{step.label}</p>
            </div>
          );
        })}
      </div>
      <div className="grid sm:grid-cols-2 gap-3 text-sm border-t border-forest-700 pt-4">
        <div><span className="text-cream-300/50 block">Payment Method</span><span className="text-cream-100">{order.payment_method === 'UPI' ? 'Scan & Pay' : 'Cash on Delivery'}</span></div>
        <div><span className="text-cream-300/50 block">Payment Status</span><span className="text-cream-100">{order.payment_status}</span></div>
      </div>
      <div className="space-y-2 border-t border-forest-700 pt-4">
        <h3 className="font-serif text-lg text-cream-100">Items</h3>
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between gap-3 text-sm bg-forest-700/50 rounded-lg p-3">
            <span className="text-cream-100">{item.name} <span className="text-cream-300/50">×{item.quantity}</span></span>
            <span className="text-gold-400 shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="pt-3 border-t border-forest-600 space-y-1 text-sm">
          <div className="flex justify-between text-cream-300/70"><span>Subtotal</span><span>₹{Number(order.subtotal).toFixed(2)}</span></div>
          {Number(order.discount) > 0 && <div className="flex justify-between text-cream-300/70"><span>Discount</span><span>−₹{Number(order.discount).toFixed(2)}</span></div>}
          <div className="flex justify-between text-cream-300/70"><span>Shipping</span><span>{Number(order.shipping) === 0 ? 'Free' : `₹${Number(order.shipping).toFixed(2)}`}</span></div>
          {Number(order.cod_charge) > 0 && <div className="flex justify-between text-cream-300/70"><span>COD Charge</span><span>₹{Number(order.cod_charge).toFixed(2)}</span></div>}
          <div className="flex justify-between text-cream-100 font-bold pt-1"><span>Total</span><span className="text-gold-400">₹{Number(order.total).toFixed(2)}</span></div>
        </div>
      </div>
    </motion.div>
  );
}

function getStatusIndex(status: string): number {
  const idx = statusSteps.findIndex((s) => s.key.toLowerCase() === status.toLowerCase());
  return idx >= 0 ? idx : 0;
}

export default function TrackOrder() {
  const { user } = useAuth();
  const [historyOrders, setHistoryOrders] = useState<TrackedOrder[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError('Please enter your order number.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError('Please enter your email or phone for verification.');
      return;
    }
    setLoading(true);
    setError(null);
    setOrder(null);
    setSearched(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error: rpcError } = await supabase.rpc('verify_order_access', {
        p_order_number: orderNumber.trim().toUpperCase(),
        p_email: email.trim() || null,
        p_phone: phone.trim() || null,
      });

      if (rpcError) throw new Error(rpcError.message);
      if (!data || (Array.isArray(data) && data.length === 0)) {
        setError('No order found. Please check your order number and email/phone.');
        return;
      }

      const result = Array.isArray(data) ? data[0] : data;
      setOrder(result as TrackedOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to look up order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistoryLoading(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistoryError(null);

    const loadOrders = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data, error: rpcError } = await supabase.rpc('get_my_orders');
        if (rpcError) throw new Error('Could not load your orders.');
        if (!cancelled) setHistoryOrders((data ?? []) as TrackedOrder[]);
      } catch (err) {
        if (!cancelled) setHistoryError(err instanceof Error ? err.message : 'Could not load your orders.');
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    };

    loadOrders();
    return () => { cancelled = true; };
  }, [user]);

  if (user) {
    return (
      <div className="container-luxury py-10 lg:py-14 max-w-3xl">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'My Account', to: '/account' }, { label: 'My Orders' }]} />
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-forest-800 flex items-center justify-center mx-auto mb-4">
            <Package size={28} className="text-gold-400" />
          </div>
          <h1 className="font-serif text-3xl text-cream-100 mb-2">My Orders</h1>
          <p className="text-cream-300/60 text-sm">View your order history and track each order.</p>
        </div>
        {historyLoading && <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-gold-400" /></div>}
        {historyError && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm mb-6">{historyError}</div>}
        {!historyLoading && !historyError && historyOrders.length === 0 && (
          <div className="bg-forest-800 rounded-2xl border border-forest-700 p-10 text-center">
            <p className="text-cream-300/70 mb-5">You have not placed any orders yet.</p>
            <Link to="/collections" className="btn-gold">Continue Shopping</Link>
          </div>
        )}
        {!historyLoading && historyOrders.length > 0 && (
          <div className="space-y-6">
            {historyOrders.map((historyOrder) => <OrderHistoryCard key={historyOrder.id} order={historyOrder} />)}
          </div>
        )}
      </div>
    );
  }

  const statusIdx = order ? getStatusIndex(order.status) : 0;

  return (
    <div className="container-luxury py-10 lg:py-14 max-w-3xl">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Track Your Order' }]} />

      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-forest-800 flex items-center justify-center mx-auto mb-4">
          <Package size={28} className="text-gold-400" />
        </div>
        <h1 className="font-serif text-3xl text-cream-100 mb-2">Track Your Order</h1>
        <p className="text-cream-300/60 text-sm">
          Enter your order number and the email or phone you used at checkout.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="bg-forest-800 rounded-2xl p-6 border border-forest-700 space-y-4 mb-8">
        <div>
          <label className="block text-sm text-cream-300 mb-1.5">Order Number</label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="input-luxury"
            placeholder="e.g. GWA-10234"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-cream-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-luxury"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-cream-300 mb-1.5">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-luxury"
              placeholder="9876543210"
            />
          </div>
        </div>
        <p className="text-xs text-cream-400/60">Enter either your email or phone — whichever you used at checkout.</p>
        <button type="submit" disabled={loading} className="btn-gold w-full">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <><Search size={18} /> Track Order</>}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 mb-6">
          <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={28} className="animate-spin text-gold-400" />
        </div>
      )}

      {/* Order result */}
      {order && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Status tracker */}
          <div className="bg-forest-800 rounded-2xl p-6 border border-forest-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-serif text-xl text-cream-100">{order.order_number}</h2>
              <span className="text-sm text-cream-300/50">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>

            {/* Progress steps */}
            <div className="flex items-center justify-between mt-8 mb-2">
              {statusSteps.map((s, idx) => {
                const completed = idx <= statusIdx;
                const current = idx === statusIdx;
                return (
                  <div key={s.key} className="flex flex-col items-center flex-1 relative">
                    {idx < statusSteps.length - 1 && (
                      <div className={`absolute top-5 left-1/2 w-full h-0.5 ${idx < statusIdx ? 'bg-gold-400' : 'bg-forest-600'}`} />
                    )}
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      completed ? 'border-gold-400 bg-gold-500/20 text-gold-400' : 'border-forest-600 bg-forest-800 text-cream-400/40'
                    } ${current ? 'ring-2 ring-gold-400/30' : ''}`}>
                      <s.icon size={18} />
                    </div>
                    <p className={`text-xs mt-2 text-center ${completed ? 'text-cream-100' : 'text-cream-400/40'}`}>{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment status */}
          <div className="bg-forest-800 rounded-2xl p-6 border border-forest-700 space-y-3">
            <h3 className="font-serif text-lg text-cream-100">Payment Details</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-cream-300/50 block">Payment Method</span>
                <span className="text-cream-100">{order.payment_method === 'UPI' ? 'Scan & Pay' : 'Cash on Delivery'}</span>
              </div>
              <div>
                <span className="text-cream-300/50 block">Payment Status</span>
                <span className={`font-medium ${
                  order.payment_status === 'Confirmed' ? 'text-green-400' :
                  order.payment_status === 'Pending Verification' ? 'text-gold-400' :
                  order.payment_status === 'Failed' ? 'text-red-400' : 'text-cream-300'
                }`}>
                  {order.payment_status}
                </span>
              </div>
              {order.payment_reference && (
                <div className="sm:col-span-2">
                  <span className="text-cream-300/50 block">Transaction Reference</span>
                  <span className="text-cream-100 font-mono text-xs break-all">{order.payment_reference}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order items */}
          <div className="bg-forest-800 rounded-2xl p-6 border border-forest-700 space-y-3">
            <h3 className="font-serif text-lg text-cream-100">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm bg-forest-700/50 rounded-lg p-3">
                  <span className="text-cream-100">
                    {item.name}
                    {item.fragrance ? ` (${item.fragrance})` : ''}
                    <span className="text-cream-300/50"> x{item.quantity}</span>
                  </span>
                  <span className="text-gold-400">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-forest-600 space-y-1 text-sm">
              <div className="flex justify-between text-cream-300/70"><span>Subtotal</span><span>₹{Number(order.subtotal).toFixed(2)}</span></div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-cream-300/70"><span>Discount</span><span>−₹{Number(order.discount).toFixed(2)}</span></div>
              )}
              <div className="flex justify-between text-cream-300/70"><span>Shipping</span><span>{Number(order.shipping) === 0 ? 'Free' : `₹${Number(order.shipping).toFixed(2)}`}</span></div>
              {Number(order.cod_charge) > 0 && <div className="flex justify-between text-cream-300/70"><span>COD Charge</span><span>₹{Number(order.cod_charge).toFixed(2)}</span></div>}
              <div className="flex justify-between text-cream-100 font-bold pt-1"><span>Total</span><span className="text-gold-400">₹{Number(order.total).toFixed(2)}</span></div>
            </div>
          </div>

          {/* Shipping address */}
          {order.shipping_address && (
            <div className="bg-forest-800 rounded-2xl p-6 border border-forest-700">
              <h3 className="font-serif text-lg text-cream-100 mb-2">Delivery Address</h3>
              <p className="text-sm text-cream-300/70 whitespace-pre-wrap">{order.shipping_address}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* No search yet */}
      {!searched && !loading && !order && !error && (
        <div className="text-center py-8">
          <p className="text-cream-300/40 text-sm">
            Your order status will appear here after you search.
          </p>
        </div>
      )}
    </div>
  );
}
