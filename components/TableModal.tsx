'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/locales/translations';

interface Props {
  onConfirm: (tableNumber: number) => void;
}

/**
 * Non-dismissible modal — the user MUST enter a valid table number.
 * Cannot be closed by pressing Escape or clicking outside.
 */
export default function TableModal({ onConfirm }: Props) {
  const { language } = useLanguage();
  const [value,  setValue]  = useState('');
  const [error,  setError]  = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input when the modal mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Block keyboard Escape
  useEffect(() => {
    const block = (e: KeyboardEvent) => {
      if (e.key === 'Escape') e.preventDefault();
    };
    window.addEventListener('keydown', block, { capture: true });
    return () => window.removeEventListener('keydown', block, { capture: true });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = parseInt(value.trim(), 10);
    if (!value.trim() || isNaN(num) || num <= 0 || num > 999) {
      setError(t('table.error', language));
      inputRef.current?.focus();
      return;
    }
    onConfirm(num);
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
            <label
              htmlFor="table-input"
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              {t('table.label', language)}
            </label>
            <input
              id="table-input"
              ref={inputRef}
              type="number"
              min={1}
              max={999}
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(''); }}
              placeholder={t('table.placeholder', language)}
              className={`w-full border-2 rounded-xl px-4 py-3 text-xl font-bold text-center
                          text-slate-800 focus:outline-none transition-colors ${
                            error
                              ? 'border-red-400 focus:border-red-500'
                              : 'border-slate-200 focus:border-brand-500'
                          }`}
            />

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
              {t('table.confirm', language)}
            </button>
          </form>

          <p className="text-center text-slate-400 text-xs mt-4">
            {t('table.helpText', language)}
          </p>
        </div>
      </div>
    </div>
  );
}
