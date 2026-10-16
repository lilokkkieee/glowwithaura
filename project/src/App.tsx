import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { RecentlyViewedProvider } from '@/context/RecentlyViewedContext';
import { ToastProvider } from '@/context/ToastContext';
import { loadProducts } from '@/data/products';
import Layout from '@/components/Layout/Layout';
import Loader from '@/components/Loader/Loader';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

const Home = lazy(() => import('@/pages/Home/Home'));
const BestSeller = lazy(() => import('@/pages/BestSeller/BestSeller'));
const Collections = lazy(() => import('@/pages/Collections/Collections'));
const Gift = lazy(() => import('@/pages/Gift/Gift'));
const Sale = lazy(() => import('@/pages/Sale/Sale'));
const About = lazy(() => import('@/pages/About/About'));
const Contact = lazy(() => import('@/pages/Contact/Contact'));
const CustomCandle = lazy(() => import('@/pages/CustomCandle/CustomCandle'));
const ProductDetails = lazy(() => import('@/pages/ProductDetails/ProductDetails'));
const Cart = lazy(() => import('@/pages/Cart/Cart'));
const Wishlist = lazy(() => import('@/pages/Wishlist/Wishlist'));
const Login = lazy(() => import('@/pages/Login/Login'));
const Signup = lazy(() => import('@/pages/Signup/Signup'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword/ForgotPassword'));
const Account = lazy(() => import('@/pages/Account/Account'));
const AdminDashboard = lazy(() => import('@/pages/Admin/AdminDashboard'));
const TrackOrder = lazy(() => import('@/pages/TrackOrder/TrackOrder'));
const NotFound = lazy(() => import('@/pages/NotFound/NotFound'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy/PrivacyPolicy'));
const TermsConditions = lazy(() => import('@/pages/TermsConditions/TermsConditions'));
const RefundPolicy = lazy(() => import('@/pages/RefundPolicy/RefundPolicy'));

export default function App() {
  useEffect(() => { loadProducts(); }, []);
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <Suspense fallback={<Loader fullScreen />}>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/best-sellers" element={<BestSeller />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/gift" element={<Gift />} />
                    <Route path="/sale" element={<Sale />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/custom-candles" element={<CustomCandle />} />
                    <Route path="/product/:slug" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/track-order" element={<TrackOrder />} />
                    <Route
                      path="/wishlist"
                      element={
                        <ProtectedRoute>
                          <Wishlist />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route
                      path="/account"
                      element={
                        <ProtectedRoute>
                          <Account />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsConditions />} />
                    <Route path="/refund" element={<RefundPolicy />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
