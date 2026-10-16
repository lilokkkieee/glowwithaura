import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import DiscountPopup from '@/components/DiscountPopup/DiscountPopup';
import ToastContainer from '@/components/Toast/ToastContainer';
import ScrollProgress from '@/components/ScrollProgress/ScrollProgress';
import CustomCursor from '@/components/CustomCursor/CustomCursor';
import AmbientBackground from '@/components/AmbientBackground/AmbientBackground';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <ScrollProgress />
      <CustomCursor />
      <AmbientBackground />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <DiscountPopup />
      <ToastContainer />
    </div>
  );
}
