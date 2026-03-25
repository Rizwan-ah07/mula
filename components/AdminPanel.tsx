'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Eye, EyeOff, Plus, X, LogOut } from 'lucide-react';

// ── Serialised types (ObjectId → string after JSON round-trip) ───────────────

export type AdminMenuItem = {
  _id:         string;
  name:        string;
  price:       number;
  description: { nl: string; en: string; fr: string };
  category:    'poke' | 'puree' | 'sides' | 'drinks';
  image:       string;
  available:   boolean;
  ingredients: string[];
  sizes?:      { label: string; price: number }[];
};

export type AdminOrder = {
  _id:         string;
  tableNumber: number;
  items:       { name: string; price: number; quantity: number; itemNotes?: string }[];
  notes:       string;
  status:      'pending' | 'preparing' | 'completed';
  total:       number;
  createdAt:   string;
};

interface Props {
  initialItems:  AdminMenuItem[];
  initialOrders: AdminOrder[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = ['poke', 'puree', 'sides', 'drinks'] as const;

type FormData = {
  name:          string;
  price:         string;
  descriptionNl: string;
  descriptionEn: string;
  descriptionFr: string;
  category:      'poke' | 'puree' | 'sides' | 'drinks';
  image:         string;
  ingredients:   string;
};

const BLANK: FormData = {
  name: '', price: '', descriptionNl: '', descriptionEn: '', descriptionFr: '', category: 'poke', image: '', ingredients: '',
};

const STATUS_CHIP: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-700',
  preparing: 'bg-blue-100  text-blue-700',
  completed: 'bg-green-100 text-green-700',
};

const CAT_CHIP: Record<string, string> = {
  poke:   'bg-teal-50   text-teal-700',
  puree:  'bg-purple-50 text-purple-700',
  sides:  'bg-orange-50 text-orange-700',
  drinks: 'bg-sky-50    text-sky-700',
};

const INP = 'w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white';

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminPanel({ initialItems, initialOrders }: Props) {
  const [tab,      setTab]      = useState<'items' | 'orders'>('items');
  const [items,    setItems]    = useState<AdminMenuItem[]>(initialItems);
  const [orders]               = useState<AdminOrder[]>(initialOrders);
  const [filter,   setFilter]   = useState<'all' | 'pending' | 'preparing' | 'completed'>('all');
  const [showAdd,  setShowAdd]  = useState(false);
  const [addForm,  setAddForm]  = useState<FormData>(BLANK);
  const [editId,   setEditId]   = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormData>(BLANK);
  const [busy,     setBusy]     = useState<string | null>(null);

  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  function parseForm(f: FormData): Partial<AdminMenuItem> {
    return {
      name:        f.name,
      price:       Number(f.price),
      description: {
        nl: f.descriptionNl,
        en: f.descriptionEn,
        fr: f.descriptionFr,
      },
      category:    f.category,
      image:       f.image,
      ingredients: f.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
    };
  }

  function itemToForm(item: AdminMenuItem): FormData {
    return {
      name:          item.name,
      price:         String(item.price),
      descriptionNl: typeof item.description === 'object' ? item.description.nl : '',
      descriptionEn: typeof item.description === 'object' ? item.description.en : '',
      descriptionFr: typeof item.description === 'object' ? item.description.fr : '',
      category:      item.category,
      image:         item.image,
      ingredients:   item.ingredients.join(', '),
    };
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async function toggleAvailable(item: AdminMenuItem) {
    setBusy(item._id);
    const res = await fetch(`/api/menu-items/${item._id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ available: !item.available }),
    });
    if (res.ok) {
      setItems((p) => p.map((i) => i._id === item._id ? { ...i, available: !i.available } : i));
      router.refresh();
    }
    setBusy(null);
  }

  async function deleteItem(id: string) {
    if (!confirm('Dit item definitief verwijderen?')) return;
    setBusy(id);
    const res = await fetch(`/api/menu-items/${id}`, { method: 'DELETE' });
    if (res.ok) { setItems((p) => p.filter((i) => i._id !== id)); router.refresh(); }
    setBusy(null);
  }

  async function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    setBusy('__add__');
    const res = await fetch('/api/menu-items', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(parseForm(addForm)),
    });
    if (res.ok) {
      const created = await res.json();
      setItems((p) => [created, ...p]);
      setAddForm(BLANK);
      setShowAdd(false);
      router.refresh();
    }
    setBusy(null);
  }

  async function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    setBusy(editId);
    const res = await fetch(`/api/menu-items/${editId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(parseForm(editForm)),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems((p) => p.map((i) => i._id === editId ? updated : i));
      setEditId(null);
      router.refresh();
    }
    setBusy(null);
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const visibleOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">

      {/* Tab bar */}
      <div className="flex items-end gap-0 mb-6 border-b border-slate-200">
        {(['items', 'orders'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              tab === t
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t === 'items' ? `Menu Items (${items.length})` : `Bestellingen (${orders.length})`}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={logout}
          className="flex items-center gap-1.5 mb-1 px-3 py-1.5 text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Uitloggen"
        >
          <LogOut className="w-3.5 h-3.5" />
          Uitloggen
        </button>
      </div>

      {/* ─────────────────────── MENU ITEMS TAB ─────────────────────── */}
      {tab === 'items' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-slate-500">
              {items.filter((i) => i.available).length} van {items.length} beschikbaar
            </p>
            <button
              onClick={() => { setShowAdd((v) => !v); setEditId(null); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
            >
              {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAdd ? 'Sluiten' : 'Nieuw item'}
            </button>
          </div>

          {/* Add form */}
          {showAdd && (
            <ItemForm
              form={addForm}
              onChange={setAddForm}
              onSubmit={submitAdd}
              onCancel={() => setShowAdd(false)}
              busy={busy === '__add__'}
              label="Toevoegen"
            />
          )}

          {/* Items list */}
          <div className="space-y-2">
            {items.map((item) =>
              editId === item._id ? (
                <div key={item._id} className="border border-brand-200 rounded-2xl p-4 bg-white shadow-sm">
                  <p className="text-xs font-semibold text-brand-600 mb-3 uppercase tracking-wide">
                    Bewerken — {item.name}
                  </p>
                  <ItemForm
                    form={editForm}
                    onChange={setEditForm}
                    onSubmit={submitEdit}
                    onCancel={() => setEditId(null)}
                    busy={busy === item._id}
                    label="Opslaan"
                  />
                </div>
              ) : (
                <div
                  key={item._id}
                  className={`flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm transition-opacity ${
                    !item.available ? 'opacity-50' : ''
                  } ${busy === item._id ? 'pointer-events-none opacity-60' : ''}`}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800 truncate">{item.name}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CAT_CHIP[item.category]}`}>
                        {item.category}
                      </span>
                      {!item.available && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-500">
                          Niet beschikbaar
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 truncate mt-0.5">
                      {typeof item.description === 'object' ? item.description.nl : item.description}
                    </p>
                  </div>

                  <span className="text-sm font-bold text-slate-700 whitespace-nowrap flex-shrink-0">
                    {item.sizes
                      ? `v.a. €${Math.min(...item.sizes.map((s) => s.price)).toFixed(2)}`
                      : `€${item.price.toFixed(2)}`}
                  </span>

                  {/* Action buttons */}
                  <div className="flex items-center gap-0.5 ml-1 flex-shrink-0">
                    <button
                      onClick={() => toggleAvailable(item)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.available
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-slate-400 hover:bg-slate-50'
                      }`}
                      title={item.available ? 'Zet op onbeschikbaar' : 'Zet op beschikbaar'}
                    >
                      {item.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => { startEdit(item); setShowAdd(false); }}
                      className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      title="Bewerken"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Verwijderen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────── ORDERS TAB ─────────────────────── */}
      {tab === 'orders' && (
        <div>
          {/* Status filter */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {(['all', 'pending', 'preparing', 'completed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize ${
                  filter === s
                    ? 'bg-brand-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {s === 'all' ? `Alle (${orders.length})` : `${s} (${orders.filter((o) => o.status === s).length})`}
              </button>
            ))}
          </div>

          {visibleOrders.length === 0 ? (
            <p className="text-center text-slate-400 py-16">Geen bestellingen gevonden.</p>
          ) : (
            <div className="space-y-3">
              {visibleOrders.map((order) => (
                <div key={order._id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800">Tafel {order.tableNumber}</span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${STATUS_CHIP[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleString('nl-NL', {
                          day: '2-digit', month: 'short',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className="font-bold text-slate-700 text-lg">€{order.total.toFixed(2)}</span>
                  </div>

                  <ul className="mt-3 space-y-1 border-t border-slate-50 pt-3">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="flex-shrink-0 text-slate-400 font-medium w-5 text-right">{item.quantity}×</span>
                        <span>
                          {item.name}
                          {item.itemNotes && (
                            <span className="text-xs text-slate-400 ml-1.5 italic">({item.itemNotes})</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {order.notes && (
                    <p className="mt-2 text-sm text-slate-500 italic border-t border-slate-50 pt-2">
                      Notitie: {order.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Helper inside function scope to access itemToForm
  function startEdit(item: AdminMenuItem) {
    setEditId(item._id);
    setEditForm(itemToForm(item));
  }
}

// ── Shared item form ──────────────────────────────────────────────────────────

function ItemForm({
  form, onChange, onSubmit, onCancel, busy, label,
}: {
  form:      FormData;
  onChange:  (f: FormData) => void;
  onSubmit:  (e: React.FormEvent) => void;
  onCancel:  () => void;
  busy:      boolean;
  label:     string;
}) {
  const txt = (key: keyof FormData) => ({
    value:    form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...form, [key]: e.target.value }),
  });

  return (
    <form onSubmit={onSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input required placeholder="Naam *"           className={INP} {...txt('name')} />
        <input required type="number" step="0.01" min="0"
               placeholder="Prijs (€) *"              className={INP} {...txt('price')} />
        <select
          required
          value={form.category}
          onChange={(e) => onChange({ ...form, category: e.target.value as FormData['category'] })}
          className={INP}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input placeholder="Afbeelding URL"            className={INP} {...txt('image')} />
        <textarea
          placeholder="🇳🇱 Beschrijving (NL)"
          rows={2}
          className={`${INP} sm:col-span-2 resize-none`}
          {...txt('descriptionNl')}
        />
        <textarea
          placeholder="🇬🇧 Description (EN)"
          rows={2}
          className={`${INP} sm:col-span-2 resize-none`}
          {...txt('descriptionEn')}
        />
        <textarea
          placeholder="🇫🇷 Description (FR)"
          rows={2}
          className={`${INP} sm:col-span-2 resize-none`}
          {...txt('descriptionFr')}
        />
        <input
          placeholder="Ingrediënten (komma gescheiden)"
          className={`${INP} sm:col-span-2`}
          {...txt('ingredients')}
        />
      </div>

      <div className="flex justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Annuleren
        </button>
        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2 text-sm font-semibold bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          {busy ? 'Bezig…' : label}
        </button>
      </div>
    </form>
  );
}
