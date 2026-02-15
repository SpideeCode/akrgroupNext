'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SuccessScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessScreen({ isOpen, onClose }: SuccessScreenProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-dark/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-cream border-2 border-brand-dark max-w-md w-full p-12 text-center relative"
      >
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-accent-energy/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-24 h-24 border-2 border-brand-dark mb-8 mx-auto"
          >
            <CheckCircle className="w-12 h-12 text-accent-energy" />
          </motion.div>

          <h2 className="text-4xl font-black font-montserrat uppercase tracking-tighter text-brand-dark mb-6">
            {t('success_screen.title_start')} <span className="text-accent-energy">{t('success_screen.title_highlight')}</span>
          </h2>

          <p className="text-lg text-brand-dark/60 font-medium mb-12 leading-relaxed">
            {t('success_screen.message')}
          </p>

          <button
            onClick={onClose}
            className="w-full px-8 py-4 bg-brand-dark text-white font-montserrat font-black uppercase tracking-widest text-sm hover:bg-accent-energy transition-all shadow-[8px_8px_0px_0px_rgba(26,26,26,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            {t('success_screen.button')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
