'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onDevisClick: () => void;
}

export default function Header({ onDevisClick }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Get current locale from pathname (first segment)
  const currentLocale = pathname.split('/')[1] || 'fr';

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Redirect to new locale path
    const newPath = pathname.replace(`/${currentLocale}`, `/${lng}`);
    router.push(newPath);
  };

  const handleNavigation = (item: { label: string; id?: string; path?: string }) => {
    setIsMobileMenuOpen(false); // Close mobile menu if open
    if (item.path) {
      router.push(`/${currentLocale}${item.path}`);
    } else if (item.id) {
      if (pathname !== `/${currentLocale}`) {
        router.push(`/${currentLocale}/#` + item.id);
      } else {
        const element = document.getElementById(item.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    if (pathname !== `/${currentLocale}`) {
      router.push(`/${currentLocale}`);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: t('nav.home'), id: 'home' },
    { label: t('nav.services'), id: 'services' },
    { label: t('nav.job'), path: '/job' },
    { label: t('nav.contact'), id: 'contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-brand-dark/10 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 grid grid-cols-2 lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Logo */}
        <div className="flex flex-col items-start cursor-pointer justify-self-start" onClick={handleLogoClick}>
          <span className="text-3xl font-black font-montserrat uppercase tracking-tighter text-brand-dark leading-none">
            AKR<span className="text-accent-energy">Group</span>
          </span>
          <div className="w-full h-1 bg-gradient-to-r from-accent-energy via-accent-solar to-accent-telecom mt-1 rounded-full opactiy-80" />
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden lg:flex items-center gap-8 justify-self-center">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item)}
              className="font-montserrat font-bold text-sm uppercase tracking-wide text-brand-dark/70 hover:text-brand-dark transition-colors whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Action: Language + CTA + Mobile Toggle - Right Aligned */}
        <div className="flex items-center gap-6 justify-self-end">
          {/* Language Selector (Desktop) */}
          <div className="hidden sm:flex items-center gap-3 font-montserrat font-bold text-sm">
            <button
              onClick={() => changeLanguage('fr')}
              className={`${currentLocale === 'fr' ? 'text-brand-dark' : 'text-brand-dark/40'} transition-colors`}
            >
              FR
            </button>
            <span className="text-brand-dark/20">|</span>
            <button
              onClick={() => changeLanguage('nl')}
              className={`${currentLocale === 'nl' ? 'text-brand-dark' : 'text-brand-dark/40'} transition-colors`}
            >
              NL
            </button>
          </div>

          {/* CTA Button (Desktop) */}
          <button
            onClick={onDevisClick}
            className="hidden md:block px-6 py-2 bg-brand-dark text-white font-montserrat font-bold uppercase text-xs tracking-widest hover:bg-brand-primary transition-all shadow-lg shadow-brand-dark/20 whitespace-nowrap"
          >
            {t('nav.quote')}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-brand-dark hover:bg-brand-dark/5 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-brand-dark/10 shadow-xl py-6 px-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item)}
              className="text-left py-3 px-4 rounded-lg font-montserrat font-black text-lg uppercase tracking-wide text-brand-dark hover:bg-brand-dark/5 transition-colors"
            >
              {item.label}
            </button>
          ))}
          <div className="h-px bg-brand-dark/10 my-2" />
          <div className="flex items-center justify-between px-4 pb-2">
            <span className="font-montserrat font-bold text-sm text-brand-muted uppercase">Langue</span>
            <div className="flex items-center gap-3 font-montserrat font-bold text-sm">
              <button
                onClick={() => changeLanguage('fr')}
                className={`${currentLocale === 'fr' ? 'text-brand-dark' : 'text-brand-dark/40'} transition-colors`}
              >
                FR
              </button>
              <span className="text-brand-dark/20">|</span>
              <button
                onClick={() => changeLanguage('nl')}
                className={`${currentLocale === 'nl' ? 'text-brand-dark' : 'text-brand-dark/40'} transition-colors`}
              >
                NL
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              onDevisClick();
              setIsMobileMenuOpen(false);
            }}
            className="w-full py-4 bg-brand-dark text-white font-montserrat font-black uppercase text-xs tracking-widest hover:bg-brand-primary transition-all"
          >
            {t('nav.quote')}
          </button>
        </div>
      )}
    </header>
  );
}
