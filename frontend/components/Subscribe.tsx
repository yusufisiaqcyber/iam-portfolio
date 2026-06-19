import { useState } from 'react';
import { Mail, Bell, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { subscribe } from '../lib/api';

export default function Subscribe() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await subscribe(email, name);
      setSubscribed(true);
      toast.success('Successfully subscribed! Check your email.');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Something went wrong. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-700 to-blue-900">
      <div className="max-w-2xl mx-auto text-center">

        <div className="flex items-center justify-center gap-2 mb-4">
          <Bell className="text-blue-200" size={20} />
          <p className="text-blue-200 font-mono text-sm uppercase tracking-widest">Stay Updated</p>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          Get Notified on New Write-ups
        </h2>
        <p className="text-blue-200 mb-8 leading-relaxed">
          Subscribe to receive email notifications whenever I publish new write-ups about
          IAM engineering, security concepts, and hands-on labs.
        </p>

        {subscribed ? (
          <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur rounded-xl p-6">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <Check size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">You're subscribed!</p>
              <p className="text-blue-200 text-sm">Check your inbox for a welcome email.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={e => setName(e.target.value)}
              className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:border-white flex-1 backdrop-blur"
            />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:border-white flex-1 backdrop-blur"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        <p className="text-blue-300 text-xs mt-4">
          No spam. Unsubscribe anytime. Your email is never shared.
        </p>
      </div>
    </section>
  );
}
