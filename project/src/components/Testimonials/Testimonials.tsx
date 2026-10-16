import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    occasion: 'Wedding',
    rating: 5,
    text: 'The custom wedding candles were beyond beautiful. Every detail was perfect — the fragrance, the label with our names, the ribbon. Our guests could not stop talking about them.',
  },
  {
    id: 2,
    name: 'Ananya Desai',
    location: 'Delhi',
    occasion: 'Birthday',
    rating: 5,
    text: 'Ordered custom candles for my daughter\'s birthday. The team understood exactly what I wanted. The candles looked gorgeous and smelled amazing. Will order again!',
  },
  {
    id: 3,
    name: 'Rohan Mehta',
    location: 'Bangalore',
    occasion: 'Corporate Gifts',
    rating: 5,
    text: 'We ordered 200 custom candles for our company Diwali gifts. Professional service, beautiful packaging, and everyone loved them. Highly recommend for bulk orders.',
  },
  {
    id: 4,
    name: 'Sneha Patel',
    location: 'Ahmedabad',
    occasion: 'Baby Shower',
    rating: 5,
    text: 'The baby shower candles were adorable. Soft pastel colors, gentle fragrance, and the custom labels made them so special. Perfect return gifts for our guests.',
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-16 lg:py-24 text-cream-100 overflow-hidden bg-forest-900">
      <div className="container-luxury relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.25em] text-gold-400 mb-3">
            Loved by Many
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream-100">
            From our happy customers
          </h2>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="!pb-14"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="bg-forest-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 h-full flex flex-col border border-forest-700/50">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < t.rating ? 'fill-gold-400 text-gold-400' : 'text-forest-700'}
                    />
                  ))}
                </div>
                <p className="font-serif text-base sm:text-lg text-cream-100 leading-relaxed mb-6 flex-1">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-forest-700">
                  <div className="w-11 h-11 rounded-full bg-gold-500/20 flex items-center justify-center font-serif text-lg text-gold-300">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-cream-100 text-sm">{t.name}</p>
                    <p className="text-xs text-cream-400">{t.location} · {t.occasion}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
