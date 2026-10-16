import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cake, Heart, Gift, Baby, Sparkles, Trees, Building2, Home as HomeIcon,
  Flower2, GraduationCap, HeartHandshake, PartyPopper, ArrowRight,
} from 'lucide-react';

const occasions = [
  { icon: Cake, label: 'Birthday', color: 'bg-rose-50 text-rose-600' },
  { icon: HeartHandshake, label: 'Wedding', color: 'bg-amber-50 text-amber-700' },
  { icon: Heart, label: 'Anniversary', color: 'bg-red-50 text-red-500' },
  { icon: Baby, label: 'Baby Shower', color: 'bg-sky-50 text-sky-600' },
  { icon: Sparkles, label: 'Diwali', color: 'bg-orange-50 text-orange-600' },
  { icon: Trees, label: 'Christmas', color: 'bg-green-50 text-green-700' },
  { icon: Building2, label: 'Corporate Gifts', color: 'bg-slate-50 text-slate-700' },
  { icon: HomeIcon, label: 'Housewarming', color: 'bg-emerald-50 text-emerald-700' },
  { icon: Flower2, label: "Mother's Day", color: 'bg-pink-50 text-pink-600' },
  { icon: PartyPopper, label: 'Party Favours', color: 'bg-purple-50 text-purple-600' },
  { icon: GraduationCap, label: 'Graduation', color: 'bg-indigo-50 text-indigo-600' },
  { icon: Gift, label: 'Proposal', color: 'bg-rose-50 text-rose-700' },
];

export default function OccasionCards() {
  return (
    <section className="bg-cream-50 py-16 lg:py-24">
      <div className="container-luxury">
        <div className="text-center mb-10 lg:mb-14">
          <span className="section-eyebrow">Celebrate Every Moment</span>
          <h2 className="section-title mb-4">Create Your Own Candle</h2>
          <p className="text-beige-700 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Designed exactly the way you imagine. Choose your occasion and let us craft the perfect candle for your special moment.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {occasions.map((occ, i) => (
            <motion.div
              key={occ.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to="/custom-candles"
                className="group flex flex-col items-center gap-3 p-5 sm:p-6 bg-white rounded-2xl shadow-soft hover:shadow-lift transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-full ${occ.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <occ.icon size={24} />
                </div>
                <span className="font-serif text-sm sm:text-base text-forest-900 text-center">{occ.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10 lg:mt-12">
          <Link to="/custom-candles" className="btn-gold">
            Start Custom Order <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
