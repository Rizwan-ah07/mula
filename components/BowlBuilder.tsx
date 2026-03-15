'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, ShoppingBag, ArrowLeft, Plus, Minus, Pencil, BanIcon } from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────────

const BASES    = ['Witte Rijst', 'Bruine Rijst', 'Sla', 'Mix (Sla & Rijst)'];
const PROTEINS = ['Crispy Chicken', 'Scampi', 'Zalm'];
const MIXINS   = [
  'Augurk', 'Ananas', 'Avocado', 'Edamame', 'Fetakaas',
  'Guacamole', 'Kerstomaatjes', 'Komkommer', 'Maïs', 'Mango',
  'Olijven', 'Rode Biet', 'Rode Ui', 'Surimi', 'Wortel', 'Zeewiersalade',
];
const DRESSINGS = [
  'Pokesaus', 'Sesamdressing', 'Sriracha Mayo',
  'Sushisaus', 'Teriake', 'Wasabi Mayo', 'Zoetzuur',
];
const TOPPINGS = [
  'Furikake', 'Gebakken Ui', 'Gedroogde Chili',
  'Jalapeños', 'Gember / Lente Ui', "Masago / Nacho's", 'Noten / Sesam-mix',
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface Selections {
  size:         'Medium' | 'Large' | null;
  base:         string | null;
  protein:      string | null;
  mixIns:       Record<string, number>;   // item → count, duplicates allowed
  mixInsDone:   boolean;                  // "Niets meer" clicked
  dressing:     string | null;
  toppings:     Record<string, number>;   // item → count, duplicates allowed
  toppingsDone: boolean;
}

export interface BowlCartItem {
  _id:         string;
  name:        string;
  price:       number;
  category:    string;
  image:       string;
  ingredients: string[];
  quantity:    number;
  itemNotes?:  string;
}

interface Props {
  onAddToCart: (item: BowlCartItem) => void;
  onBack:      () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sumMap(map: Record<string, number>): number {
  return Object.values(map).reduce((s, v) => s + v, 0);
}

function addToMap(map: Record<string, number>, key: string): Record<string, number> {
  return { ...map, [key]: (map[key] ?? 0) + 1 };
}

function removeFromMap(map: Record<string, number>, key: string): Record<string, number> {
  const next = (map[key] ?? 0) - 1;
  if (next <= 0) {
    const { [key]: _, ...rest } = map;
    return rest;
  }
  return { ...map, [key]: next };
}

function formatCountMap(map: Record<string, number>): string {
  return Object.entries(map)
    .filter(([, c]) => c > 0)
    .map(([item, c]) => (c > 1 ? `${item} ×${c}` : item))
    .join(', ');
}

function calcPrice(sel: Selections): number {
  const base         = sel.size === 'Large' ? 13.5 : 11.0;
  const mixInLimit   = sel.size === 'Large' ? 5 : 4;
  const extraMixIns  = Math.max(0, sumMap(sel.mixIns)  - mixInLimit);
  const extraToppings = Math.max(0, sumMap(sel.toppings) - 3);
  return base + extraMixIns + extraToppings;
}

// ── Step meta ─────────────────────────────────────────────────────────────────

const STEPS = [
  { n: 1, stap: 'STAP 1', title: 'Kies uw maat'     },
  { n: 2, stap: 'STAP 2', title: 'Kies uw basis'    },
  { n: 3, stap: 'STAP 3', title: 'Kies uw eiwitten' },
  { n: 4, stap: 'STAP 4', title: 'Kies uw mix-ins'  },
  { n: 5, stap: 'STAP 5', title: 'Kies uw dressing' },
  { n: 6, stap: 'STAP 6', title: 'Kies uw toppings' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function SizeCard({ label, price, mixIns, selected, onClick }: {
  label: string; price: number; mixIns: number; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-5 rounded-2xl border-2 w-full transition-all duration-150 ${
        selected
          ? 'bg-brand-600 border-brand-600 text-white shadow-lg scale-[1.02]'
          : 'bg-white border-slate-200 text-slate-700 hover:border-brand-400'
      }`}
    >
      <span className="text-2xl font-black">{label}</span>
      <span className={`text-lg font-bold ${selected ? 'text-white' : 'text-brand-600'}`}>
        €{price.toFixed(2)}
      </span>
      <span className={`text-xs ${selected ? 'text-white/80' : 'text-slate-400'}`}>
        {mixIns} mix-ins inbegrepen
      </span>
      {selected && <Check className="w-5 h-5 mt-1" />}
    </button>
  );
}

/** Single-select chip (Base, Protein, Dressing) */
function Chip({ label, selected, onClick }: {
  label: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm
                  font-medium transition-all duration-150 w-full ${
        selected
          ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
          : 'bg-white border-slate-200 text-slate-700 hover:border-brand-400 hover:bg-brand-50'
      }`}
    >
      {selected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
      {label}
    </button>
  );
}

/**
 * Counter chip for mix-ins and toppings.
 * When count = 0 → simple add button.
 * When count > 0 → −/count/+ row, always addable (extras cost €1).
 */
function CounterChip({ label, count, onAdd, onRemove, isExtra }: {
  label: string; count: number; onAdd: () => void; onRemove: () => void; isExtra: boolean;
}) {
  if (count === 0) {
    return (
      <button
        onClick={onAdd}
        className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200
                   bg-white text-slate-700 text-sm font-medium hover:border-brand-400 hover:bg-brand-50
                   transition-all w-full"
      >
        <span className="truncate">{label}</span>
        <Plus className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1" />
      </button>
    );
  }
  return (
    <div className={`flex items-center rounded-xl px-2 py-1.5 gap-1 ${
      isExtra ? 'bg-coral-500' : 'bg-brand-600'
    }`}>
      <button
        onClick={onRemove}
        className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg
                   bg-white/20 hover:bg-white/30 transition-colors"
      >
        <Minus className="w-3.5 h-3.5 text-white" />
      </button>
      <span className="flex-1 text-center text-white text-xs font-semibold truncate px-1">
        {label} <span className="opacity-75">×{count}</span>
      </span>
      <button
        onClick={onAdd}
        className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg
                   bg-white/20 hover:bg-white/30 transition-colors"
      >
        <Plus className="w-3.5 h-3.5 text-white" />
      </button>
    </div>
  );
}

// ── BowlBuilder ───────────────────────────────────────────────────────────────

export default function BowlBuilder({ onAddToCart, onBack }: Props) {
  const [step, setStep] = useState<number>(1);
  const [sel, setSel] = useState<Selections>({
    size: null, base: null, protein: null,
    mixIns: {}, mixInsDone: false,
    dressing: null,
    toppings: {}, toppingsDone: false,
  });

  const mixInLimit    = sel.size === 'Large' ? 5 : 4;
  const totalMixIns   = sumMap(sel.mixIns);
  const totalToppings = sumMap(sel.toppings);
  const extraMixIns   = Math.max(0, totalMixIns  - mixInLimit);
  const extraToppings = Math.max(0, totalToppings - 3);
  const currentPrice  = calcPrice(sel);
  const isSummary     = step === 7;
  const currentMeta   = STEPS[step - 1];

  // ── Validation ────────────────────────────────────────────────────────────

  function canProceed(): boolean {
    if (step === 1) return sel.size !== null;
    if (step === 2) return sel.base !== null;
    if (step === 3) return sel.protein !== null;
    if (step === 4) return totalMixIns >= 1 && (totalMixIns >= mixInLimit || sel.mixInsDone);
    if (step === 5) return sel.dressing !== null;
    if (step === 6) return totalToppings >= 1 && (totalToppings >= 3 || sel.toppingsDone);
    return false;
  }

  // ── Add to cart ───────────────────────────────────────────────────────────

  function handleAddToCart() {
    const price = currentPrice;
    const extras: string[] = [];
    if (extraMixIns > 0)   extras.push(`+${extraMixIns} extra mix-in${extraMixIns > 1 ? 's' : ''}`);
    if (extraToppings > 0) extras.push(`+${extraToppings} extra topping${extraToppings > 1 ? 's' : ''}`);

    const notes = [
      `Basis: ${sel.base}`,
      `Eiwit: ${sel.protein}`,
      `Mix-ins: ${formatCountMap(sel.mixIns)}`,
      `Dressing: ${sel.dressing}`,
      `Toppings: ${formatCountMap(sel.toppings)}`,
      ...(extras.length > 0 ? [`Extra: ${extras.join(', ')}`] : []),
    ].join(' · ');

    onAddToCart({
      _id:         `custom_poke_${Date.now()}`,
      name:        `Custom Pokebowl (${sel.size})`,
      price,
      category:    'poke',
      image:       '',
      ingredients: [],
      quantity:    1,
      itemNotes:   notes,
    });
  }

  // ── Progress ──────────────────────────────────────────────────────────────

  const progress = ((step - 1) / 6) * 100;
  const priceLabel = sel.size
    ? `€${currentPrice.toFixed(2)}${extraMixIns > 0 || extraToppings > 0 ? ' (+extra)' : ''}`
    : '';

  return (
    <div className="max-w-2xl mx-auto pb-32">
      {/* Back to menu */}
      <div className="mt-2 mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar menu
        </button>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🥣</span>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Bouw uw eigen Pokebowl</h2>
            <p className="text-sm text-slate-500">
              {isSummary ? 'Overzicht van uw keuzes' : `${currentMeta?.stap} · ${currentMeta?.title}`}
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-600 rounded-full transition-all duration-500"
            style={{ width: `${isSummary ? 100 : progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-slate-400">
          <span>{isSummary ? 'Klaar!' : `Stap ${step} van 6`}</span>
          <span className={extraMixIns > 0 || extraToppings > 0 ? 'text-coral-600 font-semibold' : ''}>
            {priceLabel}
          </span>
        </div>
      </div>

      {/* ── Step 1: Size ──────────────────────────────────────────────────── */}

      {step === 1 && (
        <div>
          <p className="text-sm text-slate-500 mb-4">
            Medium (4 mix-ins) of Large (5 mix-ins) — extra mix-ins / toppings kosten €1 per stuk
          </p>
          <div className="grid grid-cols-2 gap-4">
            <SizeCard label="Medium" price={11.0} mixIns={4} selected={sel.size === 'Medium'}
              onClick={() => setSel((p) => ({ ...p, size: 'Medium' }))} />
            <SizeCard label="Large"  price={13.5} mixIns={5} selected={sel.size === 'Large'}
              onClick={() => setSel((p) => ({ ...p, size: 'Large' }))} />
          </div>
        </div>
      )}

      {/* ── Step 2: Base ──────────────────────────────────────────────────── */}

      {step === 2 && (
        <div>
          <p className="text-sm text-slate-500 mb-4">Kies de basis voor uw bowl</p>
          <div className="grid grid-cols-2 gap-2.5">
            {BASES.map((b) => (
              <Chip key={b} label={b} selected={sel.base === b}
                onClick={() => setSel((p) => ({ ...p, base: b }))} />
            ))}
          </div>
        </div>
      )}

      {/* ── Step 3: Protein ───────────────────────────────────────────────── */}

      {step === 3 && (
        <div>
          <p className="text-sm text-slate-500 mb-4">Kies uw eiwitbron</p>
          <div className="grid grid-cols-2 gap-2.5">
            {PROTEINS.map((pr) => (
              <Chip key={pr} label={pr} selected={sel.protein === pr}
                onClick={() => setSel((p) => ({ ...p, protein: pr }))} />
            ))}
          </div>
        </div>
      )}

      {/* ── Step 4: Mix-ins ───────────────────────────────────────────────── */}

      {step === 4 && (
        <div>
          {/* Counter header */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500">
              Kies mix-ins
              <span className="text-xs text-slate-400 ml-1">(extra = +€1 per stuk)</span>
            </p>
            <span className={`text-sm font-bold px-3 py-0.5 rounded-full transition-colors ${
              totalMixIns > mixInLimit
                ? 'bg-coral-100 text-coral-700'
                : totalMixIns >= mixInLimit
                ? 'bg-brand-100 text-brand-700'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {totalMixIns} / {mixInLimit}
              {extraMixIns > 0 && ` (+€${extraMixIns})`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MIXINS.map((m) => (
              <CounterChip
                key={m} label={m}
                count={sel.mixIns[m] ?? 0}
                isExtra={totalMixIns >= mixInLimit && (sel.mixIns[m] ?? 0) > 0
                           ? (sumMap(sel.mixIns) - (sel.mixIns[m] ?? 0)) >= mixInLimit
                           : false}
                onAdd={()    => setSel((p) => ({ ...p, mixIns: addToMap(p.mixIns, m), mixInsDone: false }))}
                onRemove={() => setSel((p) => ({ ...p, mixIns: removeFromMap(p.mixIns, m) }))}
              />
            ))}
          </div>

          {/* "Niets meer" — shows when partially filled and not yet done */}
          {totalMixIns > 0 && totalMixIns < mixInLimit && (
            <button
              onClick={() => setSel((p) => ({ ...p, mixInsDone: !p.mixInsDone }))}
              className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm
                          font-medium transition-all ${
                sel.mixInsDone
                  ? 'bg-slate-700 border-slate-700 text-white'
                  : 'bg-slate-50 border-dashed border-slate-300 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <BanIcon className="w-4 h-4" />
              {sel.mixInsDone ? '✓ Niets meer — annuleer' : 'Niets meer voor mij'}
            </button>
          )}
        </div>
      )}

      {/* ── Step 5: Dressing ──────────────────────────────────────────────── */}

      {step === 5 && (
        <div>
          <p className="text-sm text-slate-500 mb-4">Kies 1 dressing</p>
          <div className="grid grid-cols-2 gap-2.5">
            {DRESSINGS.map((d) => (
              <Chip key={d} label={d} selected={sel.dressing === d}
                onClick={() => setSel((p) => ({ ...p, dressing: d }))} />
            ))}
          </div>
        </div>
      )}

      {/* ── Step 6: Toppings ──────────────────────────────────────────────── */}

      {step === 6 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500">
              Kies toppings
              <span className="text-xs text-slate-400 ml-1">(extra na 3 = +€1 per stuk)</span>
            </p>
            <span className={`text-sm font-bold px-3 py-0.5 rounded-full transition-colors ${
              totalToppings > 3
                ? 'bg-coral-100 text-coral-700'
                : totalToppings >= 3
                ? 'bg-brand-100 text-brand-700'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {totalToppings} / 3
              {extraToppings > 0 && ` (+€${extraToppings})`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {TOPPINGS.map((t) => (
              <CounterChip
                key={t} label={t}
                count={sel.toppings[t] ?? 0}
                isExtra={totalToppings > 3 && (sel.toppings[t] ?? 0) > 0
                           ? (sumMap(sel.toppings) - (sel.toppings[t] ?? 0)) >= 3
                           : false}
                onAdd={()    => setSel((p) => ({ ...p, toppings: addToMap(p.toppings, t), toppingsDone: false }))}
                onRemove={() => setSel((p) => ({ ...p, toppings: removeFromMap(p.toppings, t) }))}
              />
            ))}
          </div>

          {/* "Niets meer" for toppings */}
          {totalToppings > 0 && totalToppings < 3 && (
            <button
              onClick={() => setSel((p) => ({ ...p, toppingsDone: !p.toppingsDone }))}
              className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm
                          font-medium transition-all ${
                sel.toppingsDone
                  ? 'bg-slate-700 border-slate-700 text-white'
                  : 'bg-slate-50 border-dashed border-slate-300 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <BanIcon className="w-4 h-4" />
              {sel.toppingsDone ? '✓ Niets meer — annuleer' : 'Niets meer voor mij'}
            </button>
          )}
        </div>
      )}

      {/* ── Summary ───────────────────────────────────────────────────────── */}

      {isSummary && (
        <div className="space-y-4">
          {/* Price breakdown */}
          {(extraMixIns > 0 || extraToppings > 0) && (
            <div className="bg-coral-50 border border-coral-200 rounded-2xl px-4 py-3 space-y-1">
              <p className="text-sm font-bold text-coral-700">Prijsoverzicht</p>
              <div className="flex justify-between text-sm text-coral-700">
                <span>Basisbowl ({sel.size})</span>
                <span>€{(sel.size === 'Large' ? 13.5 : 11.0).toFixed(2)}</span>
              </div>
              {extraMixIns > 0 && (
                <div className="flex justify-between text-sm text-coral-700">
                  <span>{extraMixIns} extra mix-in{extraMixIns > 1 ? 's' : ''}</span>
                  <span>+€{extraMixIns.toFixed(2)}</span>
                </div>
              )}
              {extraToppings > 0 && (
                <div className="flex justify-between text-sm text-coral-700">
                  <span>{extraToppings} extra topping{extraToppings > 1 ? 's' : ''}</span>
                  <span>+€{extraToppings.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-coral-800 pt-1 border-t border-coral-200">
                <span>Totaal</span>
                <span>€{currentPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Selections with edit buttons */}
          <div className="card p-1 overflow-hidden">
            {([
              { label: 'Maat',     value: `${sel.size} · basisbowl €${sel.size === 'Large' ? '13.50' : '11.00'}`, targetStep: 1 },
              { label: 'Basis',    value: sel.base!,                   targetStep: 2 },
              { label: 'Eiwit',    value: sel.protein!,                targetStep: 3 },
              { label: 'Mix-ins',  value: formatCountMap(sel.mixIns),  targetStep: 4 },
              { label: 'Dressing', value: sel.dressing!,               targetStep: 5 },
              { label: 'Toppings', value: formatCountMap(sel.toppings), targetStep: 6 },
            ] as const).map(({ label, value, targetStep }) => (
              <div
                key={label}
                className="flex items-start gap-3 px-4 py-3 border-b border-slate-50 last:border-0
                           hover:bg-slate-50/60 transition-colors"
              >
                <span className="w-20 flex-shrink-0 text-xs font-bold text-slate-400 uppercase tracking-wide pt-0.5">
                  {label}
                </span>
                <span className="flex-1 text-sm text-slate-800 leading-snug">{value}</span>
                <button
                  onClick={() => setStep(targetStep)}
                  className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-semibold
                             flex-shrink-0 bg-brand-50 hover:bg-brand-100 px-2 py-1 rounded-lg transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Aanpassen
                </button>
              </div>
            ))}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-coral-500 hover:bg-coral-600 active:scale-95 text-white font-bold
                       py-4 rounded-2xl text-base flex items-center justify-center gap-3
                       transition-all shadow-lg shadow-coral-500/30"
          >
            <ShoppingBag className="w-5 h-5" />
            Toevoegen · €{currentPrice.toFixed(2)}
          </button>
        </div>
      )}

      {/* ── Back / Next navigation ────────────────────────────────────────── */}

      {!isSummary && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-40">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 bg-white border border-slate-200 shadow-md
                         text-slate-700 font-semibold px-5 py-3 rounded-2xl transition-all hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Terug
            </button>
          )}
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white
                       font-bold px-6 py-3 rounded-2xl transition-all shadow-md
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === 6 ? 'Overzicht' : 'Volgende'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
