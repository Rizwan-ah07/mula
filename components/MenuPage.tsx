'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import MenuCard from './MenuCard';
import Cart from './Cart';
import TableModal from './TableModal';
import BowlBuilder, { type BowlCartItem } from './BowlBuilder';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/locales/translations';
import type { CheckoutInfo } from '@/actions/orders';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MenuItemSize {
  label: string;
  price: number;
}

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: { nl: string; en: string; fr: string };
  category: 'poke' | 'puree' | 'sides' | 'drinks';
  image: string;
  ingredients: string[];
  sizes?: MenuItemSize[];
  hasDrinkOptions?: boolean;
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

const LS_KEY = 'mulaTableNumber';

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  items:       MenuItem[];
  tableNumber: number | null;
  isAdmin?:    boolean;
}

export default function MenuPage({ items, tableNumber, isAdmin }: Props) {
  const { language } = useLanguage();
  const [cart,           setCart]           = useState<CartItem[]>([]);
  const [activeTab,      setTab]            = useState<Tab>('build');
  const [cartOpen,       setCartOpen]       = useState(false);
  const [checkoutInfo,   setCheckoutInfo]   = useState<CheckoutInfo | null>(null);
  const [showModal,      setShowModal]      = useState(false);
  const [drinks,         setDrinks]         = useState<{ _id: string; name: string; available: boolean }[]>([]);
  const [activeDrinkItem, setActiveDrinkItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    fetch('/api/drinks')
      .then((res) => res.json())
      .then((data) => setDrinks(data))
      .catch((err) => console.error('Failed to load drinks', err));
  }, []);

  const TABS: { label: string; value: Tab }[] = [
    { label: t('tabs.custom', language), value: 'build'  },
    { label: t('tabs.all', language),    value: 'all'    },
    { label: t('tabs.poke', language),   value: 'poke'   },
    { label: t('tabs.puree', language),  value: 'puree'  },
    { label: t('tabs.sides', language),  value: 'sides'  },
    { label: t('tabs.drinks', language), value: 'drinks' },
  ];

  useEffect(() => {
    if (tableNumber && tableNumber > 0) {
      localStorage.setItem(LS_KEY, String(tableNumber));
      setCheckoutInfo({
        serviceType: 'dine_in',
        tableNumber,
        paymentMethod: 'cash',
      });
      return;
    }
    const saved  = localStorage.getItem(LS_KEY);
    const parsed = saved ? parseInt(saved, 10) : NaN;
    if (!isNaN(parsed) && parsed > 0) {
      setCheckoutInfo({
        serviceType: 'dine_in',
        tableNumber: parsed,
        paymentMethod: 'cash',
      });
    } else {
      setShowModal(true);
    }
  }, [tableNumber]);

  function handleCheckoutConfirm(info: CheckoutInfo) {
    if (info.serviceType === 'dine_in' && info.tableNumber) {
      localStorage.setItem(LS_KEY, String(info.tableNumber));
    } else {
      localStorage.removeItem(LS_KEY);
    }

    setCheckoutInfo(info);
    setShowModal(false);
  }

  function clearStoredTable() {
    localStorage.removeItem(LS_KEY);

    // Best-effort cleanup if a table cookie is introduced later.
    document.cookie = `${LS_KEY}=; Max-Age=0; path=/`;
    document.cookie = `table=; Max-Age=0; path=/`;
  }

  function handleDifferentTable() {
    clearStoredTable();
    setCheckoutInfo(null);
    setShowModal(true);
  }

  // ── Cart helpers ──────────────────────────────────────────────────────────

  function addToCart(item: MenuItem, sizeLabel?: string, drinkOption?: string) {
    if (item.hasDrinkOptions && !drinkOption) {
      setActiveDrinkItem(item);
      return;
    }

    const sizeObj = sizeLabel ? item.sizes?.find((s) => s.label === sizeLabel) : undefined;
    const price   = sizeObj ? sizeObj.price : item.price;
    const cartKey = drinkOption
      ? `${item._id}_${drinkOption.toLowerCase().replace(/\s+/g, '_')}`
      : sizeLabel
      ? `${item._id}_${sizeLabel.toLowerCase()}`
      : item._id;

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
          itemNotes:    drinkOption,
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

  const CAT_ORDER: Record<string, number> = { poke: 0, puree: 1, sides: 2, drinks: 3 };
  const sorted = [...items].sort((a, b) => (CAT_ORDER[a.category] ?? 99) - (CAT_ORDER[b.category] ?? 99));

  const filtered =
    activeTab === 'all' || activeTab === 'build'
      ? sorted
      : sorted.filter((i) => i.category === activeTab);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {showModal && (
        <TableModal
          initialTableNumber={tableNumber}
          onConfirm={handleCheckoutConfirm}
        />
      )}

      <div className="max-w-3xl mx-auto px-4 pb-32">

        {checkoutInfo && (
          <div className="mt-6 mb-1 flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2">
            <span className="text-sm font-medium text-slate-600">
              {checkoutInfo.serviceType === 'delivery'
                ? `🚚 ${t('cart.delivery', language)}`
                : checkoutInfo.serviceType === 'takeaway'
                ? `🛍 ${t('cart.takeaway', language)}`
                : `📍 Table ${checkoutInfo.tableNumber}`}
            </span>
            <button
              onClick={handleDifferentTable}
              className="text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              {t('menu.changeOrder', language)}
            </button>
          </div>
        )}

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
          <BowlBuilder isAdmin={isAdmin} onAddToCart={addCustomBowl} onBack={() => setTab('all')} />
        ) : (
          <>
            <h2 className="text-xl font-bold text-slate-700 mb-3 capitalize">
              {activeTab === 'all'
                ? t('menu.fullMenu', language)
                : TABS.find((t) => t.value === activeTab)?.label ?? activeTab}
            </h2>

            {filtered.length === 0 ? (
              <p className="text-center text-slate-400 py-16">
                {t('menu.noItems', language)}
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
                    : item.hasDrinkOptions
                    ? cart
                        .filter((c) => c._id.startsWith(`${item._id}_`))
                        .reduce((sum, c) => sum + c.quantity, 0)
                    : (cart.find((c) => c._id === item._id)?.quantity ?? 0);

                  // Cart entries that belong to this item (for size-specific counts)
                  const cartEntries = cart.filter(
                    (c) =>
                      c._id === item._id ||
                      (item.sizes?.some(
                        (s) => c._id === `${item._id}_${s.label.toLowerCase()}`
                      )) ||
                      (item.hasDrinkOptions && c._id.startsWith(`${item._id}_`))
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
                          : item.hasDrinkOptions
                          ? cart.find((c) => c._id.startsWith(`${item._id}_`))?._id
                          : item._id;
                        if (key) {
                          changeQty(key, -1);
                        }
                      }}
                      isAdmin={isAdmin}
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
            {t('menu.order', language)} · €{cartTotal.toFixed(2)}
          </button>
        )}

        {/* Cart drawer */}
        {cartOpen && (
          <Cart
            cart={cart}
            checkoutInfo={checkoutInfo}
            onClose={() => setCartOpen(false)}
            onChangeQty={changeQty}
            onRemove={removeFromCart}
            onOrderPlaced={() => {
              clearStoredTable();
              setCart([]);
              setCartOpen(false);
              setCheckoutInfo(null);
              setShowModal(true);
            }}
          />
        )}
      </div>

      {/* Drink Option Selector Modal */}
      {activeDrinkItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col transform transition-all scale-100 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  {t('drinkSelector.title', language)}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{activeDrinkItem.name}</p>
              </div>
              <button
                onClick={() => setActiveDrinkItem(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drink Options List */}
            <div className="p-5 overflow-y-auto space-y-3">
              {drinks.length === 0 ? (
                <p className="text-center text-slate-500 py-6">
                  {t('drinkSelector.noDrinks', language)}
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {drinks.map((drink) => {
                    const isAvailable = drink.available;
                    return (
                      <button
                        key={drink._id}
                        disabled={!isAvailable}
                        onClick={() => {
                          addToCart(activeDrinkItem, undefined, drink.name);
                          setActiveDrinkItem(null);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-left transition-all ${
                          isAvailable
                            ? 'bg-slate-50 border-slate-100 hover:bg-brand-50 hover:border-brand-300 text-slate-700 font-medium hover:text-brand-800 active:scale-[0.98]'
                            : 'bg-slate-50/50 border-slate-100/50 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-sm font-semibold">{drink.name}</span>
                        {!isAvailable && (
                          <span className="text-[10px] uppercase tracking-wider font-bold bg-red-50 text-red-500 px-2 py-0.5 rounded-md">
                            {t('drinkSelector.outOfStock', language)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
              <button
                onClick={() => setActiveDrinkItem(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                {t('menuCard.cancel', language)}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
