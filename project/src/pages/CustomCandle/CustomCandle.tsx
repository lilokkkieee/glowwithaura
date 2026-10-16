import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Loader2, Sparkles, Flame, Palette, Package, Droplet,
  Gift, Tag, FileText, Flower2, Check, ChevronRight, ChevronLeft,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

const occasions = [
  'Birthday', 'Wedding', 'Anniversary', 'Baby Shower', 'Diwali',
  'Christmas', 'Corporate Gifts', 'Housewarming', "Mother's Day",
  'Party Favours', 'Graduation', 'Proposal',
];

const waxColors = [
  { name: 'Ivory', hex: '#F5F0E1' },
  { name: 'Blush', hex: '#F4D4D4' },
  { name: 'Rose', hex: '#E08FA0' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Forest Green', hex: '#2D5A3D' },
  { name: 'Sage', hex: '#9CAF88' },
  { name: 'Ocean Blue', hex: '#5B8CA8' },
  { name: 'Lavender', hex: '#B8A9C9' },
  { name: 'Charcoal', hex: '#36454F' },
  { name: 'Burgundy', hex: '#6E1E1E' },
  { name: 'Amber', hex: '#C8860D' },
  { name: 'White', hex: '#F8F8FF' },
];

const fragrances = [
  'Floral (Rose, Jasmine, Lavender)',
  'Woody (Sandalwood, Cedar, Oud)',
  'Citrus (Bergamot, Orange, Lemon)',
  'Spicy (Cinnamon, Clove, Cardamom)',
  'Fresh (Ocean, Rain, Linen)',
  'Gourmand (Vanilla, Caramel, Coffee)',
  'Unscented',
  'Custom Blend — describe below',
];

const jarStyles = [
  { name: 'Glass Jar', price: 0 },
  { name: 'Ceramic Pot', price: 50 },
  { name: 'Tin Container', price: -20 },
  { name: 'Concrete Vessel', price: 80 },
  { name: 'No Container', price: -40 },
];

const jarColors = ['Clear', 'Amber', 'Frosted', 'Black', 'Gold', 'White'];

const lidOptions = [
  { name: 'No Lid', price: 0 },
  { name: 'Wooden Lid', price: 30 },
  { name: 'Metal Lid', price: 25 },
  { name: 'Cork Lid', price: 20 },
];

const labelOptions = [
  { name: 'No Label', price: 0 },
  { name: 'Minimal Text', price: 40 },
  { name: 'Custom Design', price: 80 },
  { name: 'Photo Label', price: 100 },
];

const ribbonOptions = [
  { name: 'No Ribbon', price: 0 },
  { name: 'Satin Ribbon', price: 25 },
  { name: 'Velvet Ribbon', price: 40 },
  { name: 'Jute Twine', price: 15 },
];

const giftBoxOptions = [
  { name: 'No Gift Box', price: 0 },
  { name: 'Standard Box', price: 60 },
  { name: 'Premium Box', price: 120 },
  { name: 'Luxury Hamper', price: 200 },
];

const flowerOptions = [
  { name: 'No Flowers', price: 0 },
  { name: 'Dried Rose Petals', price: 35 },
  { name: 'Lavender Bunch', price: 45 },
  { name: 'Mixed Dried Flowers', price: 55 },
];

const BASE_PRICE = 250;

export default function CustomCandle() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [form, setForm] = useState({
    name: '', email: '', phone: '', occasion: '', eventDate: '', quantity: 1,
    wax_color: '', fragrance: '', fragrance_details: '', jar_style: '', jar_color: '',
    lid: '', label_design: '', label_text: '', ribbon: '', gift_box: '', flowers: '',
    notes: '', budget: '', address: '',
  });

  const [previewColor, setPreviewColor] = useState('#F5F0E1');

  const calculatePrice = () => {
    let price = BASE_PRICE;
    const findPrice = (arr: { name: string; price: number }[], val: string) => {
      const item = arr.find((a) => a.name === val);
      return item ? item.price : 0;
    };
    price += findPrice(jarStyles, form.jar_style);
    price += findPrice(lidOptions, form.lid);
    price += findPrice(labelOptions, form.label_design);
    price += findPrice(ribbonOptions, form.ribbon);
    price += findPrice(giftBoxOptions, form.gift_box);
    price += findPrice(flowerOptions, form.flowers);
    return Math.max(price, 150) * form.quantity;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        candle_type: form.jar_style || 'Custom',
        fragrance_type: form.fragrance || 'Custom',
        fragrance_details: form.fragrance_details,
        color: form.wax_color,
        size: 'Custom',
        quantity: form.quantity,
        notes: `Occasion: ${form.occasion}\nEvent Date: ${form.eventDate}\nJar Style: ${form.jar_style}\nJar Color: ${form.jar_color}\nLid: ${form.lid}\nLabel Design: ${form.label_design}\nLabel Text: ${form.label_text}\nRibbon: ${form.ribbon}\nGift Box: ${form.gift_box}\nFlowers: ${form.flowers}\nBudget: ${form.budget}\nDelivery Address: ${form.address}\nAdditional Notes: ${form.notes}`,
      };

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-custom-candle-email`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error || `Request failed (${res.status})`);

      if (result.warning) {
        showToast('Your request was saved, but the email notification had an issue. We still have your details.', 'error');
      } else {
        showToast('Custom candle request sent! We will reach out within 48 hours.');
      }
      setForm({ name: '', email: '', phone: '', occasion: '', eventDate: '', quantity: 1, wax_color: '', fragrance: '', fragrance_details: '', jar_style: '', jar_color: '', lid: '', label_design: '', label_text: '', ribbon: '', gift_box: '', flowers: '', notes: '', budget: '', address: '' });
      setStep(1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Something went wrong.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return form.occasion && form.eventDate && form.quantity > 0;
    if (step === 2) return form.wax_color && form.fragrance && form.jar_style;
    if (step === 3) return true;
    if (step === 4) return form.name && form.email;
    return false;
  };

  const sel = () => 'border-gold-400 bg-gold-400/10 text-cream-100';
  const unsel = 'border-forest-600 bg-forest-700/50 text-cream-200 hover:border-forest-500';

  return (
    <div className="bg-forest-900 min-h-screen">
      <section className="bg-forest-800 py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.pexels.com/photos/6798396/pexels-photo-6798396.jpeg?auto=compress&cs=tinysrgb&w=1920&h=600&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container-luxury relative z-10">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Custom Candles' }]} />
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-gold-400 mb-3">
              <Sparkles size={14} /> Bespoke Service
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-cream-100 leading-tight mb-4">Create Your Own Candle</h1>
            <p className="text-cream-300/80 leading-relaxed text-sm sm:text-base">
              Designed exactly the way you imagine. Choose every detail and we will handcraft a candle made just for you.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-forest-800 border-b border-forest-700 sticky top-16 lg:top-20 z-30">
        <div className="container-luxury py-3">
          <div className="flex items-center justify-between gap-2">
            {['Occasion', 'Candle Design', 'Extras', 'Your Details'].map((label, i) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-sans font-semibold shrink-0 transition-colors ${
                  step > i + 1 ? 'bg-gold-500 text-forest-900' : step === i + 1 ? 'bg-forest-700 text-cream-100 ring-1 ring-gold-400/30' : 'bg-forest-700/50 text-cream-400'
                }`}>
                  {step > i + 1 ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-xs sm:text-sm font-medium hidden sm:block ${step >= i + 1 ? 'text-cream-100' : 'text-cream-400'}`}>{label}</span>
                {i < 3 && <ChevronRight size={16} className="text-cream-400/40 hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="container-luxury py-10 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <motion.form onSubmit={handleSubmit} className="lg:col-span-2 bg-forest-800 rounded-3xl shadow-card p-6 sm:p-8 lg:p-10 border border-forest-700">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h2 className="font-serif text-xl text-cream-100 mb-4 flex items-center gap-2"><Sparkles size={18} className="text-gold-400" /> Occasion Details</h2>
                    <label className="block text-sm font-medium text-cream-200 mb-2">What is the occasion?</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {occasions.map((occ) => (
                        <button key={occ} type="button" onClick={() => setForm({ ...form, occasion: occ })}
                          className={`text-left p-3 rounded-xl border text-sm transition-all ${form.occasion === occ ? sel() : unsel}`}>{occ}</button>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-cream-200 mb-1.5">Event Date</label>
                      <input type="date" required value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="input-luxury" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cream-200 mb-1.5">Quantity</label>
                      <div className="flex items-center border border-forest-600 rounded-xl bg-forest-700 w-fit">
                        <button type="button" onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })} className="px-4 py-3 text-cream-300 hover:text-gold-400">−</button>
                        <span className="px-4 font-medium text-cream-100">{form.quantity}</span>
                        <button type="button" onClick={() => setForm({ ...form, quantity: form.quantity + 1 })} className="px-4 py-3 text-cream-300 hover:text-gold-400">+</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h2 className="font-serif text-xl text-cream-100 mb-4 flex items-center gap-2"><Palette size={18} className="text-gold-400" /> Wax Color</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                      {waxColors.map((color) => (
                        <button key={color.name} type="button" onClick={() => { setForm({ ...form, wax_color: color.name }); setPreviewColor(color.hex); }}
                          className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${form.wax_color === color.name ? 'border-gold-400 bg-gold-400/10' : 'border-forest-600 bg-forest-700/50 hover:border-forest-500'}`}>
                          <span className="w-8 h-8 rounded-full border border-forest-500/30" style={{ backgroundColor: color.hex }} />
                          <span className="text-[10px] text-cream-300 text-center">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-cream-100 mb-4 flex items-center gap-2"><Droplet size={18} className="text-gold-400" /> Fragrance</h2>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {fragrances.map((frag) => (
                        <button key={frag} type="button" onClick={() => setForm({ ...form, fragrance: frag })}
                          className={`text-left p-3 rounded-xl border text-sm transition-all ${form.fragrance === frag ? 'border-gold-400 bg-gold-400/10 text-cream-100' : unsel}`}>{frag}</button>
                      ))}
                    </div>
                    <input value={form.fragrance_details} onChange={(e) => setForm({ ...form, fragrance_details: e.target.value })} className="input-luxury mt-3" placeholder="Describe your custom fragrance (optional)" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-cream-100 mb-4 flex items-center gap-2"><Package size={18} className="text-gold-400" /> Jar Style</h2>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {jarStyles.map((jar) => (
                        <button key={jar.name} type="button" onClick={() => setForm({ ...form, jar_style: jar.name })}
                          className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${form.jar_style === jar.name ? 'border-gold-400 bg-gold-400/10 text-cream-100' : unsel}`}>
                          <span>{jar.name}</span>
                          <span className="text-xs text-cream-400">{jar.price === 0 ? 'Included' : jar.price > 0 ? `+₹${jar.price}` : `-₹${Math.abs(jar.price)}`}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cream-200 mb-2">Jar Color</label>
                    <div className="flex flex-wrap gap-2.5">
                      {jarColors.map((color) => (
                        <button key={color} type="button" onClick={() => setForm({ ...form, jar_color: color })}
                          className={`px-4 py-2 rounded-full border text-sm transition-all ${form.jar_color === color ? 'border-gold-400 bg-gold-400/10 text-cream-100' : 'border-forest-600 bg-forest-700/50 text-cream-200 hover:border-forest-500'}`}>{color}</button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  {[
                    { title: 'Lid', icon: Flame, opts: lidOptions, field: 'lid' as const },
                    { title: 'Label Design', icon: Tag, opts: labelOptions, field: 'label_design' as const },
                    { title: 'Ribbon', icon: Gift, opts: ribbonOptions, field: 'ribbon' as const },
                    { title: 'Gift Box', icon: Package, opts: giftBoxOptions, field: 'gift_box' as const },
                    { title: 'Dried Flowers', icon: Flower2, opts: flowerOptions, field: 'flowers' as const },
                  ].map((section) => (
                    <div key={section.title}>
                      <h2 className="font-serif text-xl text-cream-100 mb-4 flex items-center gap-2"><section.icon size={18} className="text-gold-400" /> {section.title}</h2>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {section.opts.map((opt) => (
                          <button key={opt.name} type="button" onClick={() => setForm({ ...form, [section.field]: opt.name })}
                            className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${form[section.field] === opt.name ? 'border-gold-400 bg-gold-400/10 text-cream-100' : unsel}`}>
                            <span>{opt.name}</span>
                            <span className="text-xs text-cream-400">{opt.price === 0 ? 'Free' : `+₹${opt.price}`}</span>
                          </button>
                        ))}
                      </div>
                      {section.field === 'label_design' && (
                        <input value={form.label_text} onChange={(e) => setForm({ ...form, label_text: e.target.value })} className="input-luxury mt-3" placeholder="Label text (e.g. 'Happy Birthday, Priya!')" />
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h2 className="font-serif text-xl text-cream-100 mb-4 flex items-center gap-2"><FileText size={18} className="text-gold-400" /> Your Details</h2>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-cream-200 mb-1.5">Name</label>
                        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxury" placeholder="Your name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cream-200 mb-1.5">Email</label>
                        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-luxury" placeholder="you@example.com" />
                      </div>
                    </div>
                    <div className="mt-5">
                      <label className="block text-sm font-medium text-cream-200 mb-1.5">Phone</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-luxury" placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cream-200 mb-1.5">Preferred Budget (per piece)</label>
                    <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="input-luxury">
                      <option value="">Select budget range</option>
                      <option value="₹250-₹500">₹250 - ₹500</option>
                      <option value="₹500-₹1000">₹500 - ₹1,000</option>
                      <option value="₹1000-₹2000">₹1,000 - ₹2,000</option>
                      <option value="₹2000+">₹2,000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cream-200 mb-1.5">Delivery Address</label>
                    <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-luxury resize-none" placeholder="City, State, Pincode" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cream-200 mb-1.5">Additional Notes (optional)</label>
                    <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-luxury resize-none" placeholder="Any special requests..." />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-forest-700">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-cream-200 font-medium hover:bg-forest-700 transition-colors">
                  <ChevronLeft size={18} /> Back
                </button>
              ) : <div />}
              {step < totalSteps ? (
                <button type="button" onClick={() => canProceed() && setStep(step + 1)} disabled={!canProceed()} className="btn-gold">
                  Continue <ChevronRight size={18} />
                </button>
              ) : (
                <button type="submit" disabled={loading || !canProceed()} className="btn-gold">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  Request Quote
                </button>
              )}
            </div>
          </motion.form>

          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-forest-800 rounded-3xl shadow-card p-6 border border-forest-700">
              <h3 className="font-serif text-lg text-cream-100 mb-4">Live Preview</h3>
              <div className="relative aspect-square rounded-2xl bg-forest-700/50 overflow-hidden flex items-center justify-center mb-4">
                <div className="relative">
                  <motion.div animate={{ scaleY: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 w-3 h-8 rounded-full bg-gradient-to-t from-orange-400 to-yellow-200 blur-[2px]" />
                  <div className="w-20 h-32 rounded-t-lg rounded-b-md transition-colors duration-500 shadow-card relative overflow-hidden" style={{ backgroundColor: previewColor }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-6 bg-forest-900/30" />
                  </div>
                  {form.jar_style && form.jar_style !== 'No Container' && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-3 rounded-full bg-forest-900/20" />
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {form.occasion && <div className="flex justify-between"><span className="text-cream-400">Occasion:</span><span className="text-cream-100 font-medium">{form.occasion}</span></div>}
                {form.wax_color && <div className="flex justify-between"><span className="text-cream-400">Wax:</span><span className="text-cream-100 font-medium">{form.wax_color}</span></div>}
                {form.fragrance && <div className="flex justify-between"><span className="text-cream-400">Fragrance:</span><span className="text-cream-100 font-medium text-right text-xs">{form.fragrance.split('(')[0]}</span></div>}
                {form.jar_style && <div className="flex justify-between"><span className="text-cream-400">Jar:</span><span className="text-cream-100 font-medium">{form.jar_style}</span></div>}
                {form.gift_box && form.gift_box !== 'No Gift Box' && <div className="flex justify-between"><span className="text-cream-400">Gift Box:</span><span className="text-cream-100 font-medium">{form.gift_box}</span></div>}
              </div>
              <div className="mt-5 pt-5 border-t border-forest-700">
                <div className="flex items-end justify-between">
                  <span className="text-sm text-cream-400">Estimated Total</span>
                  <span className="font-serif text-2xl text-gold-400">₹{calculatePrice()}</span>
                </div>
                <p className="text-xs text-cream-400 mt-1">Final price confirmed with your quote</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
