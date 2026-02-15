'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

interface FormWizardProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode[];
  onSubmit: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  canProceed?: boolean;
}

export default function FormWizard({
  isOpen,
  onClose,
  children,
  onSubmit,
  currentStep,
  setCurrentStep,
  canProceed = true,
}: FormWizardProps) {
  useScrollLock(isOpen);

  const totalSteps = children.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-0 md:p-4 overflow-y-auto overflow-x-hidden safe-area-view">
      {/* Click outside to close (optional, but good UX) */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-brand-cream md:border-2 md:border-brand-dark w-full md:max-w-2xl md:my-8 relative md:rounded-lg shadow-2xl z-10 flex flex-col max-h-[100dvh] md:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar Top */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-dark/10 z-20">
          <motion.div
            className="bg-accent-energy h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "circOut" }}
          />
        </div>

        {/* Header */}
        <div className="p-6 md:p-10 border-b border-brand-dark/10 flex-shrink-0 bg-brand-cream z-10">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-muted mb-2 block">
                Questionnaire — Étape {currentStep + 1}/{totalSteps}
              </span>
              <h2 className="text-2xl md:text-3xl font-black font-montserrat uppercase tracking-tighter text-brand-dark">
                Demande de <span className="text-accent-energy">Devis</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 -mr-2 -mt-2 flex items-center justify-center rounded-full hover:bg-brand-dark/5 transition-colors group z-50 touch-manipulation"
              aria-label="Fermer"
            >
              <X className="w-6 h-6 text-brand-dark/50 group-hover:text-brand-dark transition-colors" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-brand-dark/20 scrollbar-track-transparent">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="min-h-[200px]"
            >
              {children[currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer / Navigation */}
        <div className="p-6 md:p-10 bg-brand-dark/5 flex justify-between gap-4 flex-shrink-0 mt-auto border-t border-brand-dark/5 safe-area-padding-bottom">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 md:px-8 py-4 font-montserrat font-bold uppercase text-xs tracking-widest text-brand-dark border-2 border-brand-dark transition-all hover:bg-brand-dark hover:text-white disabled:opacity-20 disabled:pointer-events-none disabled:border-brand-dark/20 min-h-[56px] md:min-h-[auto]"
          >
            <ChevronLeft className="w-5 h-5 md:w-4 md:h-4" />
            <span className="hidden md:inline">Retour</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex-[2] md:flex-none flex items-center justify-center gap-3 px-6 md:px-8 py-4 font-montserrat font-black uppercase text-xs tracking-widest bg-brand-dark text-white border-2 border-brand-dark transition-all hover:bg-accent-energy hover:border-accent-energy disabled:opacity-50 disabled:pointer-events-none min-h-[56px] md:min-h-[auto] shadow-lg md:shadow-none"
          >
            {currentStep === totalSteps - 1 ? 'Soumettre' : 'Continuer'}
            {currentStep < totalSteps - 1 && <ChevronRight className="w-5 h-5 md:w-4 md:h-4" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
