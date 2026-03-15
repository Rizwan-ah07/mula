'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError('Ongeldig wachtwoord.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg">
            <Lock className="w-7 h-7 text-white" />
          </div>
        </div>

        <h1 className="text-white text-2xl font-black text-center mb-1">Admin Panel</h1>
        <p className="text-slate-400 text-sm text-center mb-8">Mula Bowls — toegang vereist</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white
                       placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold
                       transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? 'Bezig…' : 'Inloggen'}
          </button>
        </form>
      </div>
    </main>
  );
}
