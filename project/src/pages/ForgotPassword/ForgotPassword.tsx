import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/AuthLayout/AuthLayout';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we will send you a link to reset your password."
      footer={
        <Link to="/login" className="inline-flex items-center gap-1 text-gold-400 font-medium hover:text-gold-300">
          <ArrowLeft size={15} /> Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-forest-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-forest-500" />
          </div>
          <h2 className="font-serif text-2xl text-forest-900 mb-2">Check your inbox</h2>
          <p className="text-beige-600">
            We sent a reset link to <span className="font-medium text-forest-800">{email}</span>.
            Follow the link to set a new password.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-cream-200 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-beige-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-luxury pl-12"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Link'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
