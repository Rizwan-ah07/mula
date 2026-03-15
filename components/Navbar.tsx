'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Waves } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',        label: 'Home'    },
  { href: '/menu',    label: 'Menu'    },
  { href: '/about',   label: 'About'   },
  { href: '/contact', label: 'Contact' },
];

// Routes where the nav bar should be hidden (kitchen display, etc.)
const HIDDEN_ON = ['/chef', '/kitchen'];

export default function Navbar() {
  const pathname    = usePathname();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

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
          <span
            className={`p-1.5 rounded-xl transition-colors ${
              isLight ? 'bg-brand-50' : 'bg-white/20'
            }`}
          >
            <Waves
              className={`w-5 h-5 transition-colors ${
                isLight ? 'text-brand-600' : 'text-white'
              }`}
            />
          </span>
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
          {NAV_LINKS.map(({ href, label }) => {
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
                  {label}
                </Link>
              </li>
            );
          })}
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
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
