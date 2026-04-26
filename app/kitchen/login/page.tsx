'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KitchenLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nextPath, setNextPath] = useState('/kitchen');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    if (next?.startsWith('/')) {
      setNextPath(next);
    }
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/kitchen/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });

    setLoading(false);

    if (!res.ok) {
      setError('Incorrect pincode');
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl"
      >
        <h1 className="text-white text-2xl font-bold">Kitchen Access</h1>
        <p className="text-slate-400 text-sm mt-1">Enter pincode to open the kitchen board.</p>

        <label className="block mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Pincode
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="mt-2 w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-brand-400"
            placeholder="••••"
            required
          />
        </label>

        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl"
        >
          {loading ? 'Checking…' : 'Enter Kitchen'}
        </button>
      </form>
    </main>
  );
}
