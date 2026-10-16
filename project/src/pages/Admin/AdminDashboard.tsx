import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Mail, ShoppingBag, Bell, TrendingUp, Package,
  ChevronDown, ChevronUp, RefreshCw, Loader2, UserCircle, CheckCircle, Star,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import ProductsTab from './ProductsTab';
import ReviewsTab from './ReviewsTab';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
  last_sign_in_at: string | null;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
}

interface Order {
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

interface Notification {
  id: string;
  type: string;
  subject: string;
  email_status: string;
  email_error: string | null;
  created_at: string;
}

interface AdminData {
  users: AdminUser[];
  inquiries: Inquiry[];
  orders: Order[];
  products?: number;
  notifications: Notification[];
  newsletter: Array<{ id: string; email: string; created_at: string }>;
}

type Tab = 'overview' | 'customers' | 'inquiries' | 'orders' | 'products' | 'reviews' | 'notifications';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error('Not authenticated. Please sign in first.');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-data`;
      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed (${res.status})`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-900">
        <Loader2 size={32} className="animate-spin text-gold-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-900 px-4">
        <div className="text-center max-w-md">
          <p className="text-red-400 text-lg font-serif mb-4">{error}</p>
          <p className="text-cream-300/60 text-sm mb-6">
            Make sure you are signed in with the admin account (/admin).
          </p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-forest-900 font-medium hover:bg-gold-400 transition-colors"
          >
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { icon: Users, label: 'Customers', value: data.users.length, tab: 'customers' as Tab },
    { icon: Mail, label: 'Inquiries', value: data.inquiries.length, tab: 'inquiries' as Tab },
    { icon: ShoppingBag, label: 'Orders', value: data.orders.length, tab: 'orders' as Tab },
    { icon: Package, label: 'Products', value: data.products ?? 0, tab: 'products' as Tab },
    { icon: Bell, label: 'Notifications', value: data.notifications.length, tab: 'notifications' as Tab },
  ];

  const tabs: Array<{ id: Tab; label: string; icon: typeof Users }> = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'inquiries', label: 'Inquiries', icon: Mail },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-forest-900">
      <section className="bg-forest-800 py-8 lg:py-12">
        <div className="container-luxury">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Admin Dashboard' }]} />
          <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
            <div>
              <span className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.25em] text-gold-400 mb-1">
                Store Management
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-cream-100">Admin Dashboard</h1>
              <p className="text-cream-300/60 text-sm mt-1">Signed in as {user?.email}</p>
            </div>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-700 text-cream-200 hover:bg-forest-600 transition-colors text-sm font-medium"
            >
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        </div>
      </section>

      <section className="container-luxury py-8 lg:py-12">
        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <motion.button
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              onClick={() => setActiveTab(stat.tab)}
              className="bg-forest-800 rounded-2xl p-5 border border-forest-700 hover:border-gold-400/40 transition-all text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-forest-700 text-gold-400 flex items-center justify-center">
                  <stat.icon size={20} />
                </div>
                <span className="font-serif text-2xl text-cream-100">{stat.value}</span>
              </div>
              <p className="text-sm text-cream-300/60 font-medium">{stat.label}</p>
            </motion.button>
          ))}
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 mb-6 bg-forest-800 rounded-xl p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gold-500 text-forest-900'
                  : 'text-cream-300 hover:bg-forest-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-forest-800 rounded-2xl border border-forest-700 overflow-hidden">
          {activeTab === 'overview' && <OverviewTab data={data} />}
          {activeTab === 'customers' && <CustomersTab users={data.users} expandedId={expandedId} setExpandedId={setExpandedId} />}
          {activeTab === 'inquiries' && <InquiriesTab inquiries={data.inquiries} expandedId={expandedId} setExpandedId={setExpandedId} />}
          {activeTab === 'orders' && <OrdersTab orders={data.orders} expandedId={expandedId} setExpandedId={setExpandedId} onRefresh={fetchData} />}
          {activeTab === 'products' && <ProductsTab onRefresh={fetchData} />}
          {activeTab === 'reviews' && <ReviewsTab />}
          {activeTab === 'notifications' && <NotificationsTab notifications={data.notifications} />}
        </div>
      </section>
    </div>
  );
}

function OverviewTab({ data }: { data: AdminData }) {
  const recentInquiries = data.inquiries.slice(0, 5);
  const recentOrders = data.orders.slice(0, 5);
  const recentUsers = data.users.slice(0, 5);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h2 className="font-serif text-xl text-cream-100 mb-4">Recent Inquiries</h2>
        {recentInquiries.length === 0 ? (
          <EmptyState message="No inquiries yet." />
        ) : (
          <div className="space-y-2">
            {recentInquiries.map((inq) => (
              <div key={inq.id} className="flex items-center gap-3 p-3 rounded-xl bg-forest-700/50">
                <Mail size={16} className="text-gold-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-cream-100 text-sm font-medium truncate">{inq.subject}</p>
                  <p className="text-cream-300/50 text-xs">{inq.name} — {inq.email}</p>
                </div>
                <span className="text-cream-300/40 text-xs shrink-0">{formatDate(inq.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-serif text-xl text-cream-100 mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <EmptyState message="No orders yet." />
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 p-3 rounded-xl bg-forest-700/50">
                <Package size={16} className="text-gold-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-cream-100 text-sm font-medium">{order.order_number}</p>
                  <p className="text-cream-300/50 text-xs">{order.customer_name} — {order.items.length} items</p>
                </div>
                <span className="text-gold-400 text-sm font-semibold shrink-0">${Number(order.total).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-serif text-xl text-cream-100 mb-4">Recent Customers</h2>
        {recentUsers.length === 0 ? (
          <EmptyState message="No registered customers yet." />
        ) : (
          <div className="space-y-2">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-forest-700/50">
                <UserCircle size={16} className="text-gold-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-cream-100 text-sm font-medium">{u.name || u.email}</p>
                  <p className="text-cream-300/50 text-xs">{u.email}</p>
                </div>
                {u.last_sign_in_at && (
                  <span className="text-cream-300/40 text-xs shrink-0">Last seen {formatDate(u.last_sign_in_at)}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CustomersTab({
  users,
  expandedId,
  setExpandedId,
}: {
  users: AdminUser[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}) {
  if (users.length === 0) return <EmptyState message="No registered customers yet." />;
  return (
    <div className="divide-y divide-forest-700">
      {users.map((u) => (
        <div key={u.id}>
          <button
            onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}
            className="w-full flex items-center gap-4 p-4 lg:p-5 hover:bg-forest-700/30 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-forest-700 text-gold-400 flex items-center justify-center shrink-0">
              <UserCircle size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-cream-100 font-medium">{u.name || 'Unnamed'}</p>
              <p className="text-cream-300/50 text-sm">{u.email}</p>
            </div>
            {expandedId === u.id ? <ChevronUp size={18} className="text-cream-300/40" /> : <ChevronDown size={18} className="text-cream-300/40" />}
          </button>
          {expandedId === u.id && (
            <div className="px-4 lg:px-5 pb-5">
              <div className="bg-forest-700/50 rounded-xl p-4 space-y-2 text-sm">
                <DetailRow label="Name" value={u.name || 'Not set'} />
                <DetailRow label="Email" value={u.email} />
                <DetailRow label="Account Created" value={formatDate(u.created_at)} />
                <DetailRow label="Last Login" value={u.last_sign_in_at ? formatDate(u.last_sign_in_at) : 'Never'} />
                <DetailRow label="User ID" value={u.id} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function InquiriesTab({
  inquiries,
  expandedId,
  setExpandedId,
}: {
  inquiries: Inquiry[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}) {
  if (inquiries.length === 0) return <EmptyState message="No contact inquiries yet." />;
  return (
    <div className="divide-y divide-forest-700">
      {inquiries.map((inq) => (
        <div key={inq.id}>
          <button
            onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
            className="w-full flex items-center gap-4 p-4 lg:p-5 hover:bg-forest-700/30 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-forest-700 text-gold-400 flex items-center justify-center shrink-0">
              <Mail size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-cream-100 font-medium truncate">{inq.subject}</p>
              <p className="text-cream-300/50 text-sm">{inq.name} — {inq.email}</p>
            </div>
            <span className="text-cream-300/40 text-xs shrink-0 hidden sm:block">{formatDate(inq.created_at)}</span>
            {expandedId === inq.id ? <ChevronUp size={18} className="text-cream-300/40" /> : <ChevronDown size={18} className="text-cream-300/40" />}
          </button>
          {expandedId === inq.id && (
            <div className="px-4 lg:px-5 pb-5">
              <div className="bg-forest-700/50 rounded-xl p-4 space-y-3">
                <DetailRow label="Name" value={inq.name} />
                <DetailRow label="Email" value={inq.email} />
                <DetailRow label="Phone" value={inq.phone || 'Not provided'} />
                <DetailRow label="Subject" value={inq.subject} />
                <DetailRow label="Date" value={formatDate(inq.created_at)} />
                <div>
                  <p className="text-cream-300/50 text-xs uppercase tracking-wide mb-1">Message</p>
                  <div className="bg-forest-800 rounded-lg p-3 text-cream-100 text-sm whitespace-pre-wrap">{inq.message}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function OrdersTab({
  orders,
  expandedId,
  setExpandedId,
  onRefresh,
}: {
  orders: Order[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  onRefresh: () => void;
}) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase.rpc('admin_update_order_status', {
        p_order_id: orderId,
        p_status: newStatus,
      });
      if (error) throw new Error(error.message);
      onRefresh();
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmPayment = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase.rpc('admin_update_order_status', {
        p_order_id: orderId,
        p_status: 'Processing',
        p_payment_status: 'Confirmed',
      });
      if (error) throw new Error(error.message);
      onRefresh();
    } catch (err) {
      console.error('Failed to confirm payment:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (orders.length === 0) return <EmptyState message="No orders yet." />;
  return (
    <div className="divide-y divide-forest-700">
      {orders.map((order) => (
        <div key={order.id}>
          <button
            onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            className="w-full flex items-center gap-4 p-4 lg:p-5 hover:bg-forest-700/30 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-forest-700 text-gold-400 flex items-center justify-center shrink-0">
              <Package size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-cream-100 font-medium">{order.order_number}</p>
              <p className="text-cream-300/50 text-sm">{order.customer_name} — {order.items.length} items</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-gold-400 font-semibold text-sm">₹{Number(order.total).toFixed(2)}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                order.payment_status === 'Confirmed' ? 'bg-green-500/15 text-green-400' :
                order.payment_status === 'Pending Verification' ? 'bg-gold-500/15 text-gold-400' :
                'bg-forest-600 text-cream-300/60'
              }`}>{order.payment_status}</span>
            </div>
            {expandedId === order.id ? <ChevronUp size={18} className="text-cream-300/40" /> : <ChevronDown size={18} className="text-cream-300/40" />}
          </button>
          {expandedId === order.id && (
            <div className="px-4 lg:px-5 pb-5">
              <div className="bg-forest-700/50 rounded-xl p-4 space-y-3">
                <DetailRow label="Order Number" value={order.order_number} />
                <DetailRow label="Customer Name" value={order.customer_name} />
                <DetailRow label="Email" value={order.customer_email} />
                <DetailRow label="Phone" value={order.customer_phone || 'Not provided'} />
                <DetailRow label="Shipping Address" value={order.shipping_address || 'Not provided'} />
                <DetailRow label="Coupon" value={order.coupon || 'None'} />
                <DetailRow label="Date" value={formatDate(order.created_at)} />

                {/* Payment details */}
                <div className="pt-2 border-t border-forest-600 space-y-2">
                  <p className="text-cream-300/50 text-xs uppercase tracking-wide">Payment</p>
                  <DetailRow label="Payment Method" value={order.payment_method === 'UPI' ? 'Scan & Pay' : order.payment_method === 'COD' ? 'Cash on Delivery' : order.payment_method || 'N/A'} />
                  {order.payment_reference && (
                    <DetailRow label="UPI Reference ID" value={order.payment_reference} />
                  )}
                  <DetailRow label="Payment Status" value={order.payment_status} />
                </div>

                {/* Status dropdown */}
                <div className="pt-2 border-t border-forest-600">
                  <label className="text-cream-300/50 text-xs uppercase tracking-wide block mb-2">Order Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className="w-full px-3 py-2 rounded-xl bg-forest-800 border border-forest-600 text-cream-100 focus:outline-none focus:border-gold-400 transition-colors"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                {/* Confirm payment button for UPI */}
                {order.payment_method === 'UPI' && order.payment_status !== 'Confirmed' && (
                  <button
                    onClick={() => handleConfirmPayment(order.id)}
                    disabled={updatingId === order.id}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-500 transition-colors text-sm disabled:opacity-50"
                  >
                    {updatingId === order.id ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle size={16} /> Confirm Payment Received</>}
                  </button>
                )}

                <div>
                  <p className="text-cream-300/50 text-xs uppercase tracking-wide mb-2">Items</p>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm bg-forest-800 rounded-lg p-2">
                        <span className="text-cream-100">
                          {item.name}
                          {item.fragrance ? ` (${item.fragrance})` : ''}
                          <span className="text-cream-300/50"> x{item.quantity}</span>
                        </span>
                        <span className="text-gold-400">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-forest-600 space-y-1 text-sm">
                  <div className="flex justify-between text-cream-300/70"><span>Subtotal</span><span>₹{Number(order.subtotal).toFixed(2)}</span></div>
                  {Number(order.discount) > 0 && (
                    <div className="flex justify-between text-cream-300/70"><span>Discount</span><span>−₹{Number(order.discount).toFixed(2)}</span></div>
                  )}
                  <div className="flex justify-between text-cream-300/70"><span>Shipping</span><span>{Number(order.shipping) === 0 ? 'Free' : `₹${Number(order.shipping).toFixed(2)}`}</span></div>
                  {Number(order.cod_charge) > 0 && <div className="flex justify-between text-cream-300/70"><span>COD Charge</span><span>₹{Number(order.cod_charge).toFixed(2)}</span></div>}
                  <div className="flex justify-between text-cream-100 font-bold text-base pt-1"><span>Total</span><span className="text-gold-400">₹{Number(order.total).toFixed(2)}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function NotificationsTab({ notifications }: { notifications: Notification[] }) {
  if (notifications.length === 0) return <EmptyState message="No notifications sent yet." />;
  return (
    <div className="divide-y divide-forest-700">
      {notifications.map((n) => (
        <div key={n.id} className="flex items-start gap-4 p-4 lg:p-5">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.email_status === 'sent' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            <Bell size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-cream-100 font-medium text-sm">{n.subject}</p>
            <p className="text-cream-300/50 text-xs mt-0.5">
              {n.type.toUpperCase()} — {n.email_status === 'sent' ? 'Email sent successfully' : 'Email failed'}
            </p>
            {n.email_error && (
              <p className="text-red-400/70 text-xs mt-1 font-mono">{n.email_error}</p>
            )}
          </div>
          <span className="text-cream-300/40 text-xs shrink-0">{formatDate(n.created_at)}</span>
        </div>
      ))}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-cream-300/50 font-medium shrink-0">{label}:</span>
      <span className="text-cream-100 break-all">{value}</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-12 text-center">
      <p className="text-cream-300/40 text-sm">{message}</p>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
