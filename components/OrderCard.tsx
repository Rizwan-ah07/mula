'use client';

import { useState } from 'react';
import { Clock, CheckCheck, ChefHat } from 'lucide-react';
import { updateOrderStatus } from '@/actions/orders';
import type { Order } from './ChefBoard';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/locales/translations';

interface Props {
  order:          Order;
  onStatusUpdate: (id: string, status: Order['status']) => void;
}

function elapsed(createdAt: string, language: string): string {
  const secs = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
  if (secs < 60) return `${secs}s ${t('kitchen.ago', language as any)}`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ${t('kitchen.ago', language as any)}`;
  return `${Math.floor(mins / 60)}h ${t('kitchen.ago', language as any)}`;
}

const STATUS_STYLES: Record<Order['status'], string> = {
  pending:   'bg-amber-500/20 text-amber-300 border-amber-500/30',
  preparing: 'bg-cyan-500/20  text-cyan-300  border-cyan-500/30',
  completed: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
};

export default function OrderCard({ order, onStatusUpdate }: Props) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);

  async function handleAction(newStatus: Order['status']) {
    setLoading(true);
    const result = await updateOrderStatus(order._id, newStatus);
    setLoading(false);
    if (result.success) onStatusUpdate(order._id, newStatus);
  }

  return (
    <div
      className={`rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 ${
        order.status === 'preparing'
          ? 'border-cyan-600/40 bg-slate-800/80'
          : 'border-slate-700 bg-slate-800'
      }`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 flex items-center justify-between ${
          order.status === 'preparing' ? 'bg-cyan-900/40' : 'bg-slate-700/50'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-white">T{order.tableNumber}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize
                            ${STATUS_STYLES[order.status]}`}>
            {t(`kitchen.${order.status}`, language)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 text-xs">
          <Clock className="w-3 h-3" />
          {elapsed(order.createdAt, language)}
        </div>
      </div>

      {/* Items */}
      <div className="px-4 py-3 flex-1 space-y-2.5">
        {order.items.map((item, idx) => (
          <div key={idx} className="space-y-0.5">
            <div className="flex items-start justify-between gap-2 text-sm">
              <span className="text-slate-200">
                <span className="font-black text-white mr-1.5">{item.quantity}×</span>
                {item.name}
              </span>
              <span className="text-slate-400 shrink-0 text-xs mt-0.5">
                €{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
            {/* Per-item notes (size / custom bowl details) */}
            {item.itemNotes && (
              <p className="text-slate-400 text-xs leading-relaxed pl-5">
                {item.itemNotes}
              </p>
            )}
          </div>
        ))}

        {/* Order-level notes */}
        {order.notes && (
          <div className="mt-2 bg-amber-900/30 border border-amber-700/40 rounded-lg px-3 py-1.5
                          text-xs text-amber-200">
            📝 {order.notes}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-700 flex items-center justify-between">
        <span className="text-slate-400 text-sm font-medium">
          €{order.total.toFixed(2)}
        </span>

        <div className="flex gap-2">
          {order.status === 'pending' && (
            <button
              onClick={() => handleAction('preparing')}
              disabled={loading}
              className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 active:scale-95
                         text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all
                         disabled:opacity-50"
            >
              <ChefHat className="w-3.5 h-3.5" />
              {loading ? '…' : t('kitchen.startPreparing', language)}
            </button>
          )}

          {order.status === 'preparing' && (
            <button
              onClick={() => handleAction('completed')}
              disabled={loading}
              className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 active:scale-95
                         text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all
                         disabled:opacity-50"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              {loading ? '…' : t('kitchen.markComplete', language)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
