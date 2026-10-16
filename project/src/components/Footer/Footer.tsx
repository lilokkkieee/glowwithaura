import { Link } from 'react-router-dom';
import { Flame, Instagram, Facebook, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import ImagePlaceholder from '@/components/ImagePlaceholder/ImagePlaceholder';

const footerLinks = {
  Shop: [
    { label: 'Best Sellers', to: '/best-sellers' },
    { label: 'Collections', to: '/collections' },
    { label: 'Custom Candles', to: '/custom-candles' },
    { label: 'Gift Sets', to: '/gift' },
  ],
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Track Order', to: '/track-order' },
  ],
  Support: [
    { label: 'Shipping', to: '/terms' },
    { label: 'Returns', to: '/refund' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms & Conditions', to: '/terms' },
  ],
};

export default function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await supabase.from('newsletter_subscribers').insert({ email, source: 'footer' });
    } catch { /* duplicate email is fine */ }
    showToast('Welcome to the Glow family. Check your inbox!');
    setEmail('');
  };

  return (
    <footer className="relative bg-forest-800 text-cream-200 mt-20 overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <ImagePlaceholder variant="dark" className="w-full h-full" iconSize={48} />
      </div>

      {/* Newsletter strip */}
      <div className="relative border-b border-forest-700">
        <div className="container-luxury py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-cream-100 mb-2">Join the Glow List</h3>
            <p className="text-cream-300 text-sm">Early access to new collections, scent stories, and members-only offers.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-3 flex-col sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-full bg-forest-700 border border-forest-600 text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-gold-400 transition-colors"
            />
            <button type="submit" className="btn-gold shrink-0">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="relative container-luxury py-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div className="col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-full bg-forest-700 flex items-center justify-center">
              <Flame size={18} className="text-gold-400" />
            </div>
            <span className="font-serif text-xl font-semibold text-cream-100">Glow With Aura</span>
          </Link>
          <p className="text-sm text-cream-300 leading-relaxed mb-5 max-w-xs">
            Handcrafted luxury candles, poured in small batches with clean ingredients and personalized for your special occasions.
          </p>
          <div className="flex gap-3">
            <a href="https://www.instagram.com/glow.ithaura?stkn=MXJmYjl2NWw0ZXU5Ng==" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-forest-700 hover:bg-gold-500 hover:text-forest-900 flex items-center justify-center transition-colors" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="https://www.facebook.com/her_actual_facebook_page" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-forest-700 hover:bg-gold-500 hover:text-forest-900 flex items-center justify-center transition-colors" aria-label="Facebook">
              <Facebook size={16} />
            </a>
            <a href="mailto:sukhadevetilottama1@gmail.com " className="w-9 h-9 rounded-full bg-forest-700 hover:bg-gold-500 hover:text-forest-900 flex items-center justify-center transition-colors" aria-label="Email">
              <Mail size={16} />
            </a>
          </div>
        </div>

        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="font-serif text-lg text-cream-100 mb-4">{heading}</h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-cream-300 hover:text-gold-400 transition-colors link-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 md:col-span-4 lg:col-span-1">
          <h4 className="font-serif text-lg text-cream-100 mb-4">Get in Touch</h4>
          <ul className="space-y-3 text-sm text-cream-300">
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-gold-400 shrink-0" />
              <a href="tel:8007963658" className="hover:text-gold-400 transition-colors">8007963658</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-gold-400 shrink-0" />
              <a href="mailto:sukhadevetilottama1@gmail.com" className="hover:text-gold-400 transition-colors break-all">sukhadevetilottama1@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-forest-700">
        <div className="container-luxury py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-cream-400">
          <p>© {new Date().getFullYear()} Glow With Aura. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-gold-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gold-400 transition-colors">Terms</Link>
            <Link to="/refund" className="hover:text-gold-400 transition-colors">Refunds</Link>
            <Link to="/admin" className="hover:text-gold-400 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
