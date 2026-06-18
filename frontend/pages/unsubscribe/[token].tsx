import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

export default function Unsubscribe() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subscribers/unsubscribe/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center card">
        {status === 'loading' && (
          <>
            <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
            <p className="text-slate-500">Processing your request...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="text-green-500 mx-auto mb-4" size={40} />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Unsubscribed</h1>
            <p className="text-slate-500 mb-6">You've been successfully removed from the mailing list.</p>
            <Link href="/" className="btn-outline text-sm">← Back to portfolio</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="text-red-500 mx-auto mb-4" size={40} />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h1>
            <p className="text-slate-500 mb-6">Invalid or expired unsubscribe link.</p>
            <Link href="/" className="btn-outline text-sm">← Back to portfolio</Link>
          </>
        )}
      </div>
    </main>
  );
}
