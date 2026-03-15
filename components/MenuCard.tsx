'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
import type { MenuItem, CartItem, MenuItemSize } from './MenuPage';

interface Props {
  item:        MenuItem;
  quantity:    number;       // total qty across all sizes of this item
  cartEntries: CartItem[];   // cart rows belonging to this item (for per-size counts)
  onAdd:       (sizeLabel?: string) => void;
  onRemove:    (sizeLabel?: string) => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
  poke:   '🐟',
  puree:  '🥣',
  sides:  '🥦',
  drinks: '🥤',
};

export default function MenuCard({ item, quantity, cartEntries, onAdd, onRemove }: Props) {
  const [activeSizeIdx, setActiveSizeIdx] = useState(0);

  const hasSizes    = item.sizes && item.sizes.length > 0;
  const activeSize  = hasSizes ? item.sizes![activeSizeIdx] : undefined;
  const displayPrice = activeSize ? activeSize.price : item.price;

  const cartKeyForActive = activeSize
    ? `${item._id}_${activeSize.label.toLowerCase()}`
    : item._id;
  const qtyForActive = cartEntries.find((e) => e._id === cartKeyForActive)?.quantity ?? 0;

  return (
    <div className="card overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-44 w-full bg-slate-100">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-4xl">
            {CATEGORY_EMOJI[item.category] ?? '🍽️'}
          </div>
        )}
        {/* Category badge */}
        <span className="absolute top-2 right-2 bg-white/90 text-brand-700 text-xs font-semibold
                         px-2 py-0.5 rounded-full capitalize">
          {item.category}
        </span>
        {/* Cart count badge */}
        {quantity > 0 && (
          <span className="absolute top-2 left-2 bg-brand-600 text-white text-xs font-bold
                           w-6 h-6 flex items-center justify-center rounded-full shadow">
            {quantity}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-800 leading-tight">{item.name}</h3>
          <span className="text-brand-600 font-bold whitespace-nowrap text-sm">
            {hasSizes ? `v.a. €${item.price.toFixed(2)}` : `€${item.price.toFixed(2)}`}
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

        {/* ── Size selector ── */}
        {hasSizes && (
          <div className="flex gap-2 mt-3">
            {item.sizes!.map((size: MenuItemSize, idx: number) => {
              const key = `${item._id}_${size.label.toLowerCase()}`;
              const qty = cartEntries.find((e) => e._id === key)?.quantity ?? 0;
              const isActive = activeSizeIdx === idx;
              return (
                <button
                  key={size.label}
                  onClick={() => setActiveSizeIdx(idx)}
                  className={`flex-1 flex flex-col items-center py-2 rounded-xl border text-xs font-semibold
                              transition-all ${
                    isActive
                      ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-brand-300'
                  }`}
                >
                  <span>{size.label}</span>
                  <span className={isActive ? 'text-white/80' : 'text-brand-600'}>
                    €{size.price.toFixed(2)}
                  </span>
                  {qty > 0 && (
                    <span className={`mt-0.5 font-bold ${isActive ? 'text-gold-300' : 'text-brand-700'}`}>
                      {qty}×
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Add / qty controls ── */}
        <div className="mt-3">
          {qtyForActive === 0 ? (
            <button
              onClick={() => onAdd(activeSize?.label)}
              className="btn-primary w-full text-sm"
            >
              {hasSizes
                ? `+ ${activeSize?.label} · €${displayPrice.toFixed(2)}`
                : '+ Toevoegen'}
            </button>
          ) : (
            <div className="flex items-center justify-between bg-brand-50 rounded-xl px-3 py-1.5">
              <button
                onClick={() => onRemove(activeSize?.label)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-100 transition-colors"
              >
                <Minus className="w-4 h-4 text-brand-700" />
              </button>
              <span className="font-bold text-brand-700 text-lg">{qtyForActive}</span>
              <button
                onClick={() => onAdd(activeSize?.label)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-100 transition-colors"
              >
                <Plus className="w-4 h-4 text-brand-700" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
