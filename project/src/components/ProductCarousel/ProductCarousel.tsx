import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard/ProductCard';
import QuickView from '@/components/QuickView/QuickView';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface ProductCarouselProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  dark?: boolean;
  viewAllTo?: string;
  viewAllLabel?: string;
}

export default function ProductCarousel({
  eyebrow,
  title,
  subtitle,
  products,
  dark = false,
  viewAllTo,
  viewAllLabel,
}: ProductCarouselProps) {
  const [quickView, setQuickView] = useState<Product | null>(null);

  return (
    <section className={`py-16 lg:py-24 ${dark ? 'bg-forest-900' : 'bg-cream-50'}`}>
      <div className="container-luxury">
        <div className={`text-center mb-10 ${dark ? 'text-cream-100' : ''}`}>
          {eyebrow && (
            <span
              className={`inline-block text-xs font-sans font-semibold uppercase tracking-[0.25em] mb-3 ${
                dark ? 'text-gold-400' : 'text-gold-600'
              }`}
            >
              {eyebrow}
            </span>
          )}
          <h2
            className={`font-serif text-3xl md:text-4xl lg:text-5xl leading-tight ${
              dark ? 'text-cream-100' : 'text-forest-900'
            }`}
          >
            {title}
          </h2>
          {subtitle && (
            <p className={`mt-4 leading-relaxed max-w-xl mx-auto text-sm sm:text-base ${dark ? 'text-cream-300/80' : 'text-beige-700'}`}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="relative">
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1.2}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.2 },
              1280: { slidesPerView: 4 },
            }}
            pagination={{ clickable: true, el: '.carousel-pagination' }}
            className="!pb-12"
          >
            {products.map((product, i) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} onQuickView={setQuickView} index={i} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="carousel-pagination flex justify-center gap-2 mt-6" />

          {viewAllTo && (
            <div className="text-center mt-8">
              <Link
                to={viewAllTo}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium tracking-wide transition-all duration-300 active:scale-[0.98] ${
                  dark
                    ? 'bg-gold-500 text-forest-900 hover:shadow-gold hover:scale-[1.02]'
                    : 'bg-forest-700 text-cream-100 hover:bg-forest-800 hover:shadow-lift'
                }`}
              >
                {viewAllLabel ?? 'View All Products'} <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}
