'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, AlertCircle, Store, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/locales/translations';
import type { CheckoutInfo } from '@/actions/orders';

interface Props {
  initialTableNumber?: number | null;
  onConfirm: (info: CheckoutInfo) => void;
}

/**
 * Non-dismissible modal — the user MUST enter a valid table number.
 * Cannot be closed by pressing Escape or clicking outside.
 */
export default function TableModal({ initialTableNumber, onConfirm }: Props) {
  const { language } = useLanguage();
  const [serviceType, setServiceType] = useState<CheckoutInfo['serviceType'] | null>(null);
  const [tableValue, setTableValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input when the modal mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (initialTableNumber && initialTableNumber > 0) {
      setServiceType('dine_in');
      setTableValue(String(initialTableNumber));
    }
  }, [initialTableNumber]);

  // Block keyboard Escape
  useEffect(() => {
    const block = (e: KeyboardEvent) => {
      if (e.key === 'Escape') e.preventDefault();
    };
    window.addEventListener('keydown', block, { capture: true });
    return () => window.removeEventListener('keydown', block, { capture: true });
  }, []);

  function chooseService(type: CheckoutInfo['serviceType']) {
    setServiceType(type);
    setError('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!serviceType) {
      setError(t('table.error', language));
      return;
    }

    if (serviceType === 'dine_in') {
      const num = parseInt(tableValue.trim(), 10);
      if (!tableValue.trim() || isNaN(num) || num <= 0 || num > 999) {
        setError(t('table.error', language));
        inputRef.current?.focus();
        return;
      }

      onConfirm({
        serviceType,
        tableNumber: num,
        paymentMethod: 'cash',
      });
      return;
    }

    const name = nameValue.trim();
    const phone = phoneValue.trim();
    if (!name || !phone) {
      setError(t('table.error', language));
      inputRef.current?.focus();
      return;
    }

    onConfirm({
      serviceType,
      customerName: name,
      phoneNumber: phone,
      paymentMethod: 'cash',
    });
  }

  return (
    /* Backdrop — pointer-events consume clicks so nothing behind fires */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="table-modal-title"
      >
        {/* Colour bar */}
        <div className="h-2 bg-gradient-to-r from-brand-600 via-coral-500 to-gold-500" />

        <div className="px-8 py-8">
          {/* Icon + heading */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7 text-brand-600" />
            </div>
            <h2
              id="table-modal-title"
              className="text-2xl font-black text-slate-800"
            >
              {t('table.title', language)}
            </h2>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
              {t('table.subtitle', language)}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {!serviceType ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => chooseService('dine_in')}
                  className="rounded-2xl border-2 border-slate-200 hover:border-brand-500 bg-slate-50 hover:bg-brand-50 px-4 py-4 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                      <Store className="w-5 h-5 text-brand-700" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{t('table.dineIn', language)}</p>
                      <p className="text-sm text-slate-500">{t('table.tableLabel', language)}</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => chooseService('takeaway')}
                  className="rounded-2xl border-2 border-slate-200 hover:border-brand-500 bg-slate-50 hover:bg-brand-50 px-4 py-4 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-brand-700" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{t('table.takeaway', language)}</p>
                      <p className="text-sm text-slate-500">{t('table.cashOnly', language)}</p>
                    </div>
                  </div>
                </button>
              </div>
            ) : serviceType === 'dine_in' ? (
              <>
                <label
                  htmlFor="table-input"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  {t('table.tableLabel', language)}
                </label>
                <input
                  id="table-input"
                  ref={inputRef}
                  type="number"
                  min={1}
                  max={999}
                  value={tableValue}
                  onChange={(e) => { setTableValue(e.target.value); setError(''); }}
                  placeholder={t('table.tablePlaceholder', language)}
                  className={`w-full border-2 rounded-xl px-4 py-3 text-xl font-bold text-center
                              text-slate-800 focus:outline-none transition-colors ${
                                error
                                  ? 'border-red-400 focus:border-red-500'
                                  : 'border-slate-200 focus:border-brand-500'
                              }`}
                />
              </>
            ) : (
              <>
                <label
                  htmlFor="name-input"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  {t('table.nameLabel', language)}
                </label>
                <input
                  id="name-input"
                  ref={inputRef}
                  type="text"
                  value={nameValue}
                  onChange={(e) => { setNameValue(e.target.value); setError(''); }}
                  placeholder={t('table.namePlaceholder', language)}
                  className={`w-full border-2 rounded-xl px-4 py-3 text-base font-semibold text-center
                              text-slate-800 focus:outline-none transition-colors ${
                                error
                                  ? 'border-red-400 focus:border-red-500'
                                  : 'border-slate-200 focus:border-brand-500'
                              }`}
                />
                <label
                  htmlFor="phone-input"
                  className="block text-sm font-semibold text-slate-700 mb-1.5 mt-4"
                >
                  {t('table.phoneLabel', language)}
                </label>
                <input
                  id="phone-input"
                  type="tel"
                  value={phoneValue}
                  onChange={(e) => { setPhoneValue(e.target.value); setError(''); }}
                  placeholder={t('table.phonePlaceholder', language)}
                  className={`w-full border-2 rounded-xl px-4 py-3 text-base font-semibold text-center
                              text-slate-800 focus:outline-none transition-colors ${
                                error
                                  ? 'border-red-400 focus:border-red-500'
                                  : 'border-slate-200 focus:border-brand-500'
                              }`}
                />
                <p className="mt-2 text-xs text-slate-500 text-center">{t('table.cashOnly', language)}</p>
              </>
            )}

            {/* Inline error */}
            {error && (
              <div className="flex items-center gap-1.5 mt-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-5 w-full bg-brand-600 hover:bg-brand-700 active:scale-95
                         text-white font-bold py-3.5 rounded-xl text-base transition-all"
            >
              {serviceType === 'dine_in'
                ? t('table.confirmDineIn', language)
                : serviceType === 'takeaway'
                ? t('table.confirmTakeaway', language)
                : t('table.confirmDineIn', language)}
            </button>
          </form>

          {serviceType && (
            <button
              type="button"
              onClick={() => { setServiceType(null); setError(''); }}
              className="mt-3 w-full text-sm font-semibold text-slate-500 hover:text-slate-700"
            >
              {t('table.changeType', language)}
            </button>
          )}

          <p className="text-center text-slate-400 text-xs mt-4">
            {t('table.helpText', language)}
          </p>
        </div>
      </div>
    </div>
  );
}
