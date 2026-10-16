import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const galleryImages = [
  { url: 'https://images.pexels.com/photos/6798396/pexels-photo-6798396.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop', alt: 'Romantic candle setup with rose petals', span: 'row-span-2' },
  { url: 'https://images.pexels.com/photos/28260282/pexels-photo-28260282.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', alt: 'Black and gold luxury candles', span: '' },
  { url: 'https://images.pexels.com/photos/6311807/pexels-photo-6311807.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', alt: 'Stylish candle product photography', span: '' },
  { url: 'https://images.pexels.com/photos/12901662/pexels-photo-12901662.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop', alt: 'Mirror tray with lit candle', span: 'row-span-2' },
  { url: 'https://images.pexels.com/photos/39277498/pexels-photo-39277498.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', alt: 'Lavender scented candles', span: '' },
  { url: 'https://images.pexels.com/photos/8903647/pexels-photo-8903647.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', alt: 'Brown candle on marble backdrop', span: '' },
  { url: 'https://images.pexels.com/photos/27549292/pexels-photo-27549292.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', alt: 'Sculpted candles in various shapes', span: '' },
  { url: 'https://images.pexels.com/photos/27947432/pexels-photo-27947432.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', alt: 'Pink butterfly candle with florals', span: '' },
];

export default function GallerySection() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section className="bg-cream-50 py-16 lg:py-24 border-y border-cream-200">
      <div className="container-luxury">
        <div className="text-center mb-10 lg:mb-14">
          <span className="section-eyebrow">Inspiration Gallery</span>
          <h2 className="section-title mb-4">Our Candle Work</h2>
          <p className="text-beige-700 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            A glimpse of candles we have handcrafted for special occasions.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] sm:auto-rows-[240px] gap-3 sm:gap-4">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${img.span}`}
              onClick={() => setLightbox(img.url)}
            >
              <img
                src={img.url}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] bg-forest-900/90 flex items-center justify-center p-4"
          >
            <button className="absolute top-5 right-5 w-10 h-10 rounded-full bg-cream-100/10 text-cream-100 flex items-center justify-center hover:bg-cream-100/20 transition-colors">
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightbox}
              alt="Gallery image"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
