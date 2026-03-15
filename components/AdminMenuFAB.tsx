'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';

const CATEGORIES = ['poke', 'puree', 'sides', 'drinks'] as const;
type Category = typeof CATEGORIES[number];

const BLANK = { name: '', price: '', description: '', category: 'poke' as Category, image: '', ingredients: '' };
const INP = 'w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white';

export default function AdminMenuFAB() {
  const router = useRouter();
  const [open,  setOpen]  = useState(false);
  const [form,  setForm]  = useState(BLANK);
  const [busy,  setBusy]  = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await fetch('/api/menu-items', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:        form.name,
        price:       Number(form.price),
        description: form.description,
        category:    form.category,
        image:       form.image,
        ingredients: form.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
      }),
    });

    if (res.ok) {
      setForm(BLANK);
      setOpen(false);
      router.refresh();
    } else {
      setError('Er ging iets mis. Probeer opnieuw.');
    }
    setBusy(false);
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 bg-brand-600 hover:bg-brand-700
                   text-white rounded-full shadow-lg shadow-brand-600/40 flex items-center
                   justify-center transition-all active:scale-95"
        aria-label="Nieuw menu-item toevoegen"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal backdrop */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">Nieuw menu-item</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Naam *"             className={`${INP} col-span-2`}
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input required type="number" step="0.01" min="0" placeholder="Prijs (€) *" className={INP}
                  value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <select required className={INP}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder="Afbeelding URL" className={`${INP} col-span-2`}
                  value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                <textarea placeholder="Beschrijving" rows={2} className={`${INP} col-span-2 resize-none`}
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <input placeholder="Ingrediënten (komma gescheiden)" className={`${INP} col-span-2`}
                  value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  Annuleren
                </button>
                <button type="submit" disabled={busy}
                  className="flex-1 py-2.5 text-sm font-semibold bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors">
                  {busy ? 'Bezig…' : 'Toevoegen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
