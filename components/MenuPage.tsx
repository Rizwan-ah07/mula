'use client';

import { useState, useEffect } from 'react';
import MenuCard from './MenuCard';
import Cart from './Cart';
import TableModal from './TableModal';
import BowlBuilder, { type BowlCartItem } from './BowlBuilder';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MenuItemSize {
  label: string;
  price: number;
}

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: 'poke' | 'puree' | 'sides' | 'drinks';
  image: string;
  ingredients: string[];
  sizes?: MenuItemSize[];
}

export interface CartItem {
  _id:          string;   // may be `${menuId}_medium` etc. for sized items
  name:         string;
  price:        number;   // size-adjusted price
  category:     string;
  image:        string;
  ingredients:  string[];
  quantity:     number;
  selectedSize?: string;  // 'Medium' | 'Large'
  itemNotes?:   string;   // custom bowl details
}

// ── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = 'all' | 'poke' | 'puree' | 'sides' | 'drinks' | 'build';

const TABS: { label: string; value: Tab }[] = [
  { label: '🍱 All',    value: 'all'    },
  { label: '🐟 Poke',   value: 'poke'   },
  { label: '🥣 Puree',  value: 'puree'  },
  { label: '🥦 Sides',  value: 'sides'  },
  { label: '🥤 Drinks', value: 'drinks' },
  { label: '✨ Custom', value: 'build'  },
];

const LS_KEY = 'mulaTableNumber';

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  items:       MenuItem[];
  tableNumber: number | null;
}

export default function MenuPage({ items, tableNumber }: Props) {
  const [cart,           setCart]           = useState<CartItem[]>([]);
  const [activeTab,      setTab]            = useState<Tab>('all');
  const [cartOpen,       setCartOpen]       = useState(false);
  const [effectiveTable, setEffectiveTable] = useState<number | null>(tableNumber);
  const [showModal,      setShowModal]      = useState(false);

  useEffect(() => {
    if (tableNumber && tableNumber > 0) {
      localStorage.setItem(LS_KEY, String(tableNumber));
      setEffectiveTable(tableNumber);
      return;
    }
    const saved  = localStorage.getItem(LS_KEY);
    const parsed = saved ? parseInt(saved, 10) : NaN;
    if (!isNaN(parsed) && parsed > 0) {
      setEffectiveTable(parsed);
    } else {
      setShowModal(true);
    }
  }, [tableNumber]);

  function handleTableConfirm(num: number) {
    localStorage.setItem(LS_KEY, String(num));
    setEffectiveTable(num);
    setShowModal(false);
  }

  // ── Cart helpers ──────────────────────────────────────────────────────────

  function addToCart(item: MenuItem, sizeLabel?: string) {
    const sizeObj = sizeLabel ? item.sizes?.find((s) => s.label === sizeLabel) : undefined;
    const price   = sizeObj ? sizeObj.price : item.price;
    const cartKey = sizeLabel ? `${item._id}_${sizeLabel.toLowerCase()}` : item._id;

    setCart((prev) => {
      const existing = prev.find((c) => c._id === cartKey);
      if (existing) {
        return prev.map((c) =>
          c._id === cartKey ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        {
          _id:          cartKey,
          name:         item.name,
          price,
          category:     item.category,
          image:        item.image,
          ingredients:  item.ingredients,
          quantity:     1,
          selectedSize: sizeLabel,
        },
      ];
    });
  }

  function addCustomBowl(bowl: BowlCartItem) {
    setCart((prev) => [...prev, { ...bowl }]);
    setTab('all');
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((c) => c._id !== id));
  }

  function changeQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((c) => (c._id === id ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const filtered =
    activeTab === 'all' || activeTab === 'build'
      ? items
      : items.filter((i) => i.category === activeTab);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {showModal && <TableModal onConfirm={handleTableConfirm} />}

      <div className="max-w-3xl mx-auto px-4 pb-32">

        {/* Category tabs */}
        <div className="flex gap-2 mt-6 mb-4 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === t.value
                  ? t.value === 'build'
                    ? 'bg-coral-500 text-white'
                    : 'bg-brand-600 text-white'
                  : t.value === 'build'
                  ? 'bg-coral-50 border border-coral-200 text-coral-600 hover:bg-coral-100'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Bowl builder */}
        {activeTab === 'build' ? (
          <BowlBuilder onAddToCart={addCustomBowl} onBack={() => setTab('all')} />
        ) : (
          <>
            <h2 className="text-xl font-bold text-slate-700 mb-3 capitalize">
              {activeTab === 'all'
                ? 'Volledig Menu'
                : TABS.find((t) => t.value === activeTab)?.label ?? activeTab}
            </h2>

            {filtered.length === 0 ? (
              <p className="text-center text-slate-400 py-16">
                Geen items beschikbaar.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((item) => {
                  // Total qty across all sizes of this item
                  const totalQty = item.sizes
                    ? item.sizes.reduce((sum, s) => {
                        const entry = cart.find(
                          (c) => c._id === `${item._id}_${s.label.toLowerCase()}`
                        );
                        return sum + (entry?.quantity ?? 0);
                      }, 0)
                    : (cart.find((c) => c._id === item._id)?.quantity ?? 0);

                  // Cart entries that belong to this item (for size-specific counts)
                  const cartEntries = cart.filter(
                    (c) =>
                      c._id === item._id ||
                      (item.sizes?.some(
                        (s) => c._id === `${item._id}_${s.label.toLowerCase()}`
                      ))
                  );

                  return (
                    <MenuCard
                      key={item._id}
                      item={item}
                      quantity={totalQty}
                      cartEntries={cartEntries}
                      onAdd={(sizeLabel) => addToCart(item, sizeLabel)}
                      onRemove={(sizeLabel) => {
                        const key = sizeLabel
                          ? `${item._id}_${sizeLabel.toLowerCase()}`
                          : item._id;
                        changeQty(key, -1);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Floating cart button */}
        {cartCount > 0 && !cartOpen && activeTab !== 'build' && (
          <button
            onClick={() => setCartOpen(true)}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 btn-primary shadow-lg
                       flex items-center gap-3 px-6 py-3 text-base z-40"
          >
            <span className="bg-white/30 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {cartCount}
            </span>
            Bestelling · €{cartTotal.toFixed(2)}
          </button>
        )}

        {/* Cart drawer */}
        {cartOpen && (
          <Cart
            cart={cart}
            tableNumber={effectiveTable}
            onClose={() => setCartOpen(false)}
            onChangeQty={changeQty}
            onRemove={removeFromCart}
            onOrderPlaced={() => {
              setCart([]);
              setCartOpen(false);
            }}
          />
        )}
      </div>
    </>
  );
}
