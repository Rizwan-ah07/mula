'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Languages } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { t } from '@/locales/translations';

const NAV_LINKS = [
  { href: '/',        key: 'home'    },
  { href: '/menu',    key: 'menu'    },
  { href: '/contact', key: 'contact' },
];

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

// Routes where the nav bar should be hidden (kitchen display, etc.)
const HIDDEN_ON = ['/chef', '/kitchen'];

export default function Navbar() {
  const pathname    = usePathname();
  const { language, setLanguage } = useLanguage();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [langOpen,    setLangOpen]    = useState(false);

  // Transparent → solid on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  // Hide on kitchen routes
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  const isLight = scrolled || mobileOpen;

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isLight
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/40'
          : 'bg-transparent'
      }`}
    >
      {/* ── Desktop bar ── */}
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group select-none"
          aria-label="Mula Bowls — home"
        >
          <Image
            src="/logo.jpg"
            alt="Mula Bowls"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span
            className={`font-black text-xl tracking-tight transition-colors ${
              isLight ? 'text-brand-700' : 'text-white'
            }`}
          >
            Mula Bowls
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map(({ href, key }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? isLight
                        ? 'bg-brand-100 text-brand-700'
                        : 'bg-white/25 text-white'
                      : isLight
                      ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      : 'text-white/80 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {t(`nav.${key}`, language)}
                </Link>
              </li>
            );
          })}

          {/* Language switcher */}
          <li className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                isLight
                  ? 'text-slate-600 hover:bg-slate-100'
                  : 'text-white/80 hover:text-white hover:bg-white/15'
              }`}
              aria-label="Select language"
            >
              <Languages className="w-4 h-4" />
              <span className="uppercase">{language}</span>
            </button>

            {langOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[140px] z-50">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                        language === lang.code
                          ? 'bg-brand-50 text-brand-700 font-medium'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${
            isLight
              ? 'text-slate-700 hover:bg-slate-100'
              : 'text-white hover:bg-white/15'
          }`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t(`nav.${key}`, language)}
            </Link>
          ))}

          {/* Mobile language switcher */}
          <div className="pt-2 mt-2 border-t border-slate-200">
            <div className="text-xs font-medium text-slate-500 px-4 pb-2 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5" />
              Language
            </div>
            <div className="flex gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    language === lang.code
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="mr-1">{lang.flag}</span>
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
