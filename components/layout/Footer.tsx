
'use client';

import { Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'fr';

  return (
    <footer className="bg-brand-dark text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection width="100%">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* ... */}
            {/* ServicesLinks */}
            <div>
              <h4 className="font-montserrat font-black uppercase tracking-widest text-sm text-white/40 mb-8">
                {t('footer.services')}
              </h4>
              <ul className="space-y-4 font-medium text-white/70">
                <li><a href={`/${currentLocale}#energie`} className="hover:text-accent-energy transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent-energy" /> {t('services.energy.title')}</a></li>
                <li><a href={`/${currentLocale}#solaire`} className="hover:text-accent-solar transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent-solar" /> {t('services.solar.title')}</a></li>
                <li><a href={`/${currentLocale}#telecom`} className="hover:text-accent-telecom transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent-telecom" /> {t('services.telecom.title')}</a></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-montserrat font-black uppercase tracking-widest text-sm text-white/40 mb-8">
                {t('footer.follow')}
              </h4>
              <div className="flex gap-4">
                {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 border border-white/20 flex items-center justify-center hover:bg-white hover:text-brand-dark transition-all text-white rounded-sm">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium text-white/40">
          <p>© {new Date().getFullYear()} AKR Group. {t('footer.rights')} <span className="opacity-50">|</span> {t('footer.developed')} <a href="https://www.webora-da.be/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Webora</a></p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">{t('footer.legal')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
            <Link href="/admin/login" className="hover:text-white transition-colors">{t('footer.admin')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
