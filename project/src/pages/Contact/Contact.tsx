import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

export default function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.error || `Request failed (${res.status})`);
      }

      if (result.warning) {
        showToast('Your message was saved, but the email notification had an issue. We still have your inquiry.', 'error');
      } else {
        showToast('Message sent. We will be in touch within 24 hours.');
      }
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, label: 'Visit Us', value: 'Pune, Maharashtra, India' },
    { icon: Phone, label: 'Call Us', value: '8007963658' },
    { icon: Mail, label: 'Email Us', value: 'sukhadevetilottama1@gmail.com' },
  ];

  return (
    <div>
      <section className="bg-forest-800 py-12 lg:py-16">
        <div className="container-luxury">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.25em] text-gold-400 mb-3">Get in Touch</span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream-100 leading-tight mb-4">
              We would love to hear from you.
            </h1>
            <p className="text-cream-300/80 leading-relaxed">
              Whether you have a question about a candle, need help with an order, or want to share a scent memory — our team is here for you.
            </p>
          </div>
        </div>
      </section>

      <section className="container-luxury py-16 lg:py-24">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Info */}
          <div className="space-y-6">
            {contactInfo.map((info) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-forest-700 text-gold-400 flex items-center justify-center shrink-0 ring-1 ring-gold-400/20">
                  <info.icon size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-lg text-cream-100 mb-1">{info.label}</h3>
                  <p className="text-sm text-cream-300/80 leading-relaxed break-words">{info.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-forest-800 rounded-3xl shadow-card p-6 sm:p-8 lg:p-10 space-y-5 border border-forest-700"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-cream-200 mb-1.5">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-luxury"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream-200 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-luxury"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-cream-200 mb-1.5">Phone (optional)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-luxury"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream-200 mb-1.5">Subject</label>
              <input
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="input-luxury"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream-200 mb-1.5">Message</label>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-luxury resize-none"
                placeholder="Tell us more..."
              />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full sm:w-auto">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Send Message
            </button>
          </motion.form>
        </div>
      </section>

      {/* Map */}
      <section className="bg-forest-800 py-16 lg:py-24">
        <div className="container-luxury grid lg:grid-cols-2 gap-10 items-stretch">
          <div className="rounded-2xl overflow-hidden shadow-card min-h-[320px]">
            <iframe
              title="Glow With Aura location"
              src="https://www.google.com/maps?q=Pune,Maharashtra,India&output=embed"
              className="w-full h-full min-h-[320px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.25em] text-gold-400 mb-3">Our Location</span>
            <h2 className="font-serif text-3xl md:text-4xl text-cream-100 mb-4">Pune, Maharashtra, India</h2>
            <p className="text-cream-300/80 leading-relaxed mb-6">
              Reach out to us by phone or email, or visit us in Pune.
            </p>
            <ul className="space-y-2 text-sm text-cream-200">
              <li className="flex justify-between border-b border-forest-700 pb-2"><span className="font-medium">Monday – Friday</span><span className="text-gold-400">10:00 AM – 7:00 PM</span></li>
              <li className="flex justify-between border-b border-forest-700 pb-2"><span className="font-medium">Saturday</span><span className="text-gold-400">11:00 AM – 6:00 PM</span></li>
              <li className="flex justify-between border-b border-forest-700 pb-2"><span className="font-medium">Sunday</span><span className="text-cream-400">Closed</span></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
