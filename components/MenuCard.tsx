'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Pencil, Trash2, X } from 'lucide-react';
import type { MenuItem, CartItem } from './MenuPage';

interface Props {
  item:        MenuItem;
  quantity:    number;
  cartEntries: CartItem[];
  onAdd:       (sizeLabel?: string) => void;
  onRemove:    (sizeLabel?: string) => void;
  isAdmin?:    boolean;
}

const CATEGORY_EMOJI: Record<string, string> = {
  poke:   '🐟',
  puree:  '🥣',
  sides:  '🥦',
  drinks: '🥤',
};

const CATEGORIES = ['poke', 'puree', 'sides', 'drinks'] as const;
type Category = typeof CATEGORIES[number];
const INP = 'w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white';

export default function MenuCard({ item, quantity, cartEntries, onAdd, onRemove, isAdmin }: Props) {
  const router = useRouter();
  const [sizeOpen,  setSizeOpen]  = useState(false);
  const [editOpen,  setEditOpen]  = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [editForm,  setEditForm]  = useState({
    name:        item.name,
    price:       String(item.price),
    description: item.description,
    category:    item.category as Category,
    image:       item.image,
    ingredients: item.ingredients.join(', '),
  });

  const hasSizes    = item.sizes && item.sizes.length > 0;
  const qtySimple   = cartEntries.find((e) => e._id === item._id)?.quantity ?? 0;
  const displayPrice = hasSizes ? item.sizes![0].price : item.price;

  async function handleDelete() {
    if (!confirm(`"${item.name}" verwijderen?`)) return;
    setDeleting(true);
    await fetch(`/api/menu-items/${item._id}`, { method: 'DELETE' });
    router.refresh();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/menu-items/${item._id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:        editForm.name,
        price:       Number(editForm.price),
        description: editForm.description,
        category:    editForm.category,
        image:       editForm.image,
        ingredients: editForm.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
      }),
    });
    setSaving(false);
    setEditOpen(false);
    router.refresh();
  }

  return (
    <>
      <div className={`card overflow-hidden flex flex-col transition-opacity ${deleting ? 'opacity-40 pointer-events-none' : ''}`}>
        {/* Image */}
        <div className="relative h-44 w-full bg-slate-100">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw" />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl">
              {CATEGORY_EMOJI[item.category] ?? '🍽️'}
            </div>
          )}

          {/* Category badge */}
          <span className="absolute top-2 right-2 bg-white/90 text-brand-700 text-xs font-semibold px-2 py-0.5 rounded-full capitalize">
            {item.category}
          </span>

          {/* Cart count badge */}
          {quantity > 0 && (
            <span className="absolute top-2 left-2 bg-brand-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow">
              {quantity}
            </span>
          )}

          {/* Admin action icons */}
          {isAdmin && (
            <div className="absolute bottom-0 inset-x-0 flex justify-end gap-1.5 px-2 py-1.5 bg-gradient-to-t from-black/50 to-transparent">
              <button
                onClick={() => setEditOpen(true)}
                className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow hover:bg-white transition-colors"
                title="Bewerken"
              >
                <Pencil className="w-3.5 h-3.5 text-brand-600" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow hover:bg-red-50 transition-colors"
                title="Verwijderen"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-800 leading-tight">{item.name}</h3>
            <span className="text-brand-600 font-bold whitespace-nowrap text-sm">
              €{displayPrice.toFixed(2)}
            </span>
          </div>

          <p className="text-slate-500 text-sm mt-1 flex-1 leading-snug">{item.description}</p>

          {item.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.ingredients.map((ing) => (
                <span key={ing} className="bg-brand-50 text-brand-700 text-xs px-2 py-0.5 rounded-full">
                  {ing}
                </span>
              ))}
            </div>
          )}

          {/* ── Controls ── */}
          <div className="mt-3">
            {hasSizes ? (
              quantity > 0 ? (
                <div className="space-y-2">
                  {item.sizes!.map((size) => {
                    const key = `${item._id}_${size.label.toLowerCase()}`;
                    const qty = cartEntries.find((e) => e._id === key)?.quantity ?? 0;
                    return (
                      <div key={size.label} className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 w-14 shrink-0">{size.label}</span>
                        <div className="flex-1 flex items-center justify-between bg-brand-50 rounded-xl px-2 py-1.5">
                          <button onClick={() => onRemove(size.label)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-brand-100 transition-colors">
                            <Minus className="w-3 h-3 text-brand-700" />
                          </button>
                          <span className="font-bold text-brand-700 text-sm min-w-[1.5rem] text-center">{qty}</span>
                          <button onClick={() => onAdd(size.label)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-brand-100 transition-colors">
                            <Plus className="w-3 h-3 text-brand-700" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-brand-600 w-12 text-right shrink-0">
                          €{size.price.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : sizeOpen ? (
                <div className="grid grid-cols-2 gap-2">
                  {item.sizes!.map((size, idx) => {
                    const diff = size.price - item.sizes![0].price;
                    return (
                      <button key={size.label}
                        onClick={() => { onAdd(size.label); setSizeOpen(false); }}
                        className="flex flex-col items-center py-3 rounded-xl border border-brand-200 bg-brand-50 hover:bg-brand-600 transition-colors group">
                        <span className="text-sm font-semibold text-slate-800 group-hover:text-white">{size.label}</span>
                        <span className="text-xs font-bold text-brand-600 group-hover:text-white/80">
                          {idx === 0 ? `€${size.price.toFixed(2)}` : `+€${diff.toFixed(2)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <button onClick={() => setSizeOpen(true)} className="btn-primary w-full text-sm">
                  + Toevoegen · €{item.sizes![0].price.toFixed(2)}
                </button>
              )
            ) : (
              qtySimple === 0 ? (
                <button onClick={() => onAdd()} className="btn-primary w-full text-sm">
                  + Toevoegen
                </button>
              ) : (
                <div className="flex items-center justify-between bg-brand-50 rounded-xl px-3 py-1.5">
                  <button onClick={() => onRemove()}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-100 transition-colors">
                    <Minus className="w-4 h-4 text-brand-700" />
                  </button>
                  <span className="font-bold text-brand-700 text-lg">{qtySimple}</span>
                  <button onClick={() => onAdd()}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-100 transition-colors">
                    <Plus className="w-4 h-4 text-brand-700" />
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── Edit modal ── */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">Bewerken — {item.name}</h2>
              <button onClick={() => setEditOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Naam *" className={`${INP} col-span-2`}
                  value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                <input required type="number" step="0.01" min="0" placeholder="Prijs (€) *" className={INP}
                  value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                <select required className={INP} value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value as Category })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder="Afbeelding URL" className={`${INP} col-span-2`}
                  value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} />
                <textarea placeholder="Beschrijving" rows={2} className={`${INP} col-span-2 resize-none`}
                  value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                <input placeholder="Ingrediënten (komma gescheiden)" className={`${INP} col-span-2`}
                  value={editForm.ingredients} onChange={(e) => setEditForm({ ...editForm, ingredients: e.target.value })} />
              </div>

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setEditOpen(false)}
                  className="flex-1 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  Annuleren
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 text-sm font-semibold bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors">
                  {saving ? 'Bezig…' : 'Opslaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
