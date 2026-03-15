'use client';

import { useState } from 'react';
import { X, Minus, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { submitOrder } from '@/actions/orders';
import type { CartItem } from './MenuPage';

interface Props {
  cart:          CartItem[];
  tableNumber:   number | null;
  onClose:       () => void;
  onChangeQty:   (id: string, delta: number) => void;
  onRemove:      (id: string) => void;
  onOrderPlaced: () => void;
}

export default function Cart({
  cart, tableNumber, onClose, onChangeQty, onRemove, onOrderPlaced,
}: Props) {
  const [notes,   setNotes]   = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  async function handleSubmit() {
    if (!tableNumber) return;
    setLoading(true);
    setError('');

    const result = await submitOrder({
      tableNumber,
      items: cart.map((item) => ({
        menuItemId: item._id,
        name:       item.selectedSize
                      ? `${item.name} (${item.selectedSize})`
                      : item.name,
        price:      item.price,
        quantity:   item.quantity,
        itemNotes:  item.itemNotes ?? '',
      })),
      notes,
    });

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(onOrderPlaced, 2000);
    } else {
      setError(result.error ?? 'Er ging iets mis. Probeer het opnieuw.');
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white rounded-t-3xl
                      shadow-2xl z-50 max-h-[90vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3">
          <h2 className="text-xl font-bold">Uw bestelling</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12 px-6 text-center">
            <CheckCircle2 className="w-16 h-16 text-brand-500" />
            <h3 className="text-2xl font-bold text-brand-700">Bestelling geplaatst!</h3>
            <p className="text-slate-500">
              Tafel {tableNumber} — uw bestelling gaat naar de keuken. 🍣
            </p>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-5 space-y-1">
              {cart.map((item) => (
                <div key={item._id} className="py-2.5 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-tight">
                        {item.name}
                        {item.selectedSize && (
                          <span className="ml-1.5 text-xs bg-brand-50 text-brand-700
                                           px-2 py-0.5 rounded-full font-semibold">
                            {item.selectedSize}
                          </span>
                        )}
                      </p>
                      {item.itemNotes && (
                        <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                          {item.itemNotes}
                        </p>
                      )}
                      <p className="text-slate-400 text-xs mt-0.5">€{item.price.toFixed(2)} per stuk</p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => onChangeQty(item._id, -1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200
                                   flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => onChangeQty(item._id, 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200
                                   flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="w-16 text-right text-sm font-semibold flex-shrink-0">
                      €{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Notes */}
              <div className="pt-2 pb-4">
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Speciale instructies
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Allergieën, extra saus, geen uien..."
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm
                             resize-none focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 pt-3 pb-6 border-t border-slate-100">
              <div className="flex justify-between text-lg font-bold mb-3">
                <span>Totaal</span>
                <span>€{total.toFixed(2)}</span>
              </div>

              {!tableNumber && (
                <div className="flex items-center gap-2 text-amber-600 text-sm mb-3
                                bg-amber-50 rounded-xl px-3 py-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  Scan de QR-code aan uw tafel om te bestellen.
                </div>
              )}

              {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={!tableNumber || loading}
                className="btn-primary w-full text-base py-3"
              >
                {loading
                  ? 'Bestelling plaatsen…'
                  : `Bestelling plaatsen · Tafel ${tableNumber ?? '—'}`}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
