'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import OrderCard from './OrderCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/locales/translations';


export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  itemNotes?: string;
}

export interface Order {
  _id: string;
  tableNumber: number;
  items: OrderItem[];
  notes: string;
  status: 'pending' | 'preparing' | 'completed';
  total: number;
  createdAt: string;
}

interface Props {
  initialOrders: Order[];
}

// Pusher channel / event names (must match lib/pusher-server.ts constants)
const CHANNEL = 'kitchen';
const E_NEW   = 'new-order';
const E_UPD   = 'order-updated';

export default function ChefBoard({ initialOrders }: Props) {
  const { language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(CHANNEL);

    channel.bind(E_NEW, (order: Order) => {
      setOrders((prev) => {
        // Prevent duplicates if SSR already included it
        if (prev.some((o) => o._id === order._id)) return prev;
        return [...prev, order];
      });
    });

    channel.bind(E_UPD, ({ _id, status }: { _id: string; status: Order['status'] }) => {
      setOrders((prev) =>
        status === 'completed'
          ? prev.filter((o) => o._id !== _id)
          : prev.map((o) => (o._id === _id ? { ...o, status } : o))
      );
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(CHANNEL);
      pusher.disconnect();
    };
  }, []);

  function handleStatusUpdate(id: string, status: Order['status']) {
    if (status === 'completed') {
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } else {
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
    }
  }

  const pending   = orders.filter((o) => o.status === 'pending');
  const preparing = orders.filter((o) => o.status === 'preparing');

  return (
    <div className="p-5">
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-500 gap-3">
          <span className="text-6xl">🌴</span>
          <p className="text-xl font-semibold">{t('kitchen.allClear', language)}</p>
          <p className="text-sm">{t('kitchen.newOrders', language)}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending column */}
          {pending.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block w-3 h-3 rounded-full bg-amber-400" />
                <h2 className="text-amber-300 font-semibold uppercase tracking-wider text-sm">
                  {t('kitchen.pending', language)} ({pending.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pending.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Preparing column */}
          {preparing.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block w-3 h-3 rounded-full bg-ocean-400 animate-pulse" />
                <h2 className="text-ocean-300 font-semibold uppercase tracking-wider text-sm">
                  {t('kitchen.preparing', language)} ({preparing.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {preparing.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
