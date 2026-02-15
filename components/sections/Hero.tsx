'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface HeroProps {
  onDevisClick: () => void;
}

export default function Hero({ onDevisClick }: HeroProps) {
  const { t } = useTranslation();

  return (
    <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full relative"
        >
          <Image
            src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2940&auto=format&fit=crop"
            alt="Nature et enérgie"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        {/* Light Overlay for readability */}
        <div className="absolute inset-0 bg-white/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-20">
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-black font-montserrat leading-[1.1] tracking-tight text-brand-dark mb-8 uppercase drop-shadow-sm"
          >
            {t('hero.title_start')} <span className="text-accent-energy">{t('hero.title_highlight')}</span>,<br />
            {t('hero.title_end')} <span className="text-brand-primary">{t('hero.title_better')}</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-xl md:text-2xl text-brand-dark/80 font-medium max-w-2xl leading-relaxed mb-10"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <button
              onClick={onDevisClick}
              className="group relative px-8 py-5 bg-brand-dark text-white font-montserrat font-bold uppercase tracking-widest text-lg shadow-xl shadow-brand-dark/20 transition-all hover:scale-105 active:scale-95 hover:bg-brand-primary rounded-sm"
            >
              <div className="flex items-center gap-3">
                👉 {t('hero.cta')}
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
