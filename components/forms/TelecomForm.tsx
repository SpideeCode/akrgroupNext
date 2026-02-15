'use client';

import { useState } from 'react';
import FormWizard from '@/components/ui/FormWizard';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';

interface TelecomFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  provider: string;
  monthlyBill: string;
  isEngaged: string;
  engagementDuration: string;
  satisfactionIssues: string[];
  name: string;
  email: string;
  phone: string;
  postalCode: string;
}

export default function TelecomForm({ isOpen, onClose, onSuccess }: TelecomFormProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    provider: '',
    monthlyBill: '',
    isEngaged: '',
    engagementDuration: '',
    satisfactionIssues: [],
    name: '',
    email: '',
    phone: '',
    postalCode: '',
  });

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleIssue = (issue: string) => {
    const issues = formData.satisfactionIssues.includes(issue)
      ? formData.satisfactionIssues.filter(i => i !== issue)
      : [...formData.satisfactionIssues, issue];
    updateField('satisfactionIssues', issues);
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0: // Provider
        return !!formData.provider;
      case 1: // Bill
        return !!formData.monthlyBill;
      case 2: // Engagement
        if (formData.isEngaged === 'non') return true;
        if (formData.isEngaged === 'oui') return !!formData.engagementDuration;
        return false;
      case 3: // Satisfaction
        return formData.satisfactionIssues.length > 0;
      case 4: // Contact
        return !!formData.name && !!formData.email && !!formData.phone && !!formData.postalCode;
      default:
        return false;
    }
  };

  const handleStepChange = (newStep: number) => {
    // Logic for skipping steps if "Pas encore de fournisseur"
    if (formData.provider === 'Pas encore de fournisseur') {
      if (newStep > 0 && newStep < 4) {
        // If trying to go to 1, 2, or 3, skip to:
        // Forward: 0 -> 4
        // Backward: 4 -> 0
        if (currentStep === 0) {
          setCurrentStep(4);
        } else if (currentStep === 4) {
          setCurrentStep(0);
        }
        return;
      }
    }
    setCurrentStep(newStep);
  };

  const handleSubmit = async () => {
    try {
      // Prepare localized data for Admin
      const adminData = {
        "Fournisseur": formData.provider,
        "Facture Mensuelle": formData.provider === 'Pas encore de fournisseur' ? 'N/A' : `${formData.monthlyBill}€`,
        "Engagé": formData.provider === 'Pas encore de fournisseur' ? 'N/A' : (formData.isEngaged === 'oui' ? `Oui (${formData.engagementDuration})` : 'Non'),
        "Problèmes signalés": formData.provider === 'Pas encore de fournisseur' ? 'N/A' : formData.satisfactionIssues.join(', '),
      };

      const { error } = await supabase.from('quote_requests').upsert({
        service_type: 'telecom',
        form_data: adminData,
        contact_name: formData.name,
        contact_email: formData.email,
        contact_phone: formData.phone,
        contact_postal_code: formData.postalCode,
        status: 'pending',
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'service_type,contact_phone'
      });

      if (error) throw error;

      onSuccess();
      onClose();
      setCurrentStep(0);
      setFormData({
        provider: '',
        monthlyBill: '',
        isEngaged: '',
        engagementDuration: '',
        satisfactionIssues: [],
        name: '',
        email: '',
        phone: '',
        postalCode: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t('forms.submit_error'));
    }
  };

  const providers = [
    { value: 'Proximus', label: 'Proximus' },
    { value: 'Orange', label: 'Orange' },
    { value: 'Voo', label: 'Voo' },
    { value: 'Telenet', label: 'Telenet' },
    { value: 'EDPnet', label: 'EDPnet' },
    { value: 'Pas encore de fournisseur', label: t('forms.options.no_provider') },
    { value: 'Autre', label: t('forms.options.other') }
  ];

  const engagementDurations = [
    { value: 'Moins d’un an', label: t('forms.options.eng_less_1') },
    { value: 'Plus d’un an', label: t('forms.options.eng_more_1') },
    { value: 'Je ne sais pas', label: t('forms.options.eng_idk') }
  ];

  const satisfactionOptions = [
    { value: 'Qualité réseau', label: t('forms.options.issue_network') },
    { value: 'Prix', label: t('forms.options.issue_price') },
    { value: 'Service client', label: t('forms.options.issue_service') },
    { value: 'Coupure assez fréquente', label: t('forms.options.issue_outage') },
    { value: 'Je suis assez satisfait', label: t('forms.options.issue_satisfied') },
    { value: 'Autre', label: t('forms.options.other') }
  ];

  const steps = [
    // Step 1: Provider
    <div key="step1" className="space-y-6">
      <h3 className="text-2xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-6">
        {t('forms.step_provider')} <span className="text-accent-telecom">{t('forms.provider_label')}</span> d&apos;internet ? *
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {providers.map((p) => (
          <button
            key={p.value}
            onClick={() => updateField('provider', p.value)}
            className={`p-4 border-2 font-montserrat font-bold text-sm transition-all ${formData.provider === p.value
              ? 'border-brand-dark bg-brand-dark text-white'
              : 'border-brand-dark/10 hover:border-brand-dark/30 text-brand-dark/70'
              }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Bill
    <div key="step2" className="space-y-6">
      <h3 className="text-2xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-6">
        {t('forms.step_bill')} <span className="text-accent-telecom">{t('forms.bill_question')}</span> par mois ?
      </h3>
      <div className="relative">
        <input
          type="number"
          value={formData.monthlyBill}
          onChange={(e) => updateField('monthlyBill', e.target.value)}
          placeholder="Ex: 65"
          className="w-full text-4xl font-black text-brand-dark border-b-4 border-brand-dark/10 focus:border-accent-telecom outline-none py-4 bg-transparent text-center placeholder:text-brand-dark/20"
        />
        <span className="absolute right-1/4 top-1/2 -translate-y-1/2 text-2xl font-bold text-brand-dark/30">€</span>
      </div>
    </div>,

    // Step 3: Engagement
    <div key="step3" className="space-y-8">
      <div>
        <h3 className="text-xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-4">
          {t('forms.step_engagement')} <span className="text-accent-telecom">{t('forms.engaged_question')}</span> actuellement ?
        </h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              updateField('isEngaged', 'oui');
              updateField('engagementDuration', ''); // Reset duration if re-clicking
            }}
            className={`p-4 border-2 text-left font-montserrat font-bold text-sm transition-all ${formData.isEngaged === 'oui'
              ? 'border-brand-dark bg-brand-dark text-white'
              : 'border-brand-dark/10 hover:border-brand-dark/30 text-brand-dark/70'
              }`}
          >
            {t('forms.options.engaged_yes_long')}
          </button>
          <button
            onClick={() => {
              updateField('isEngaged', 'non');
              updateField('engagementDuration', '');
            }}
            className={`p-4 border-2 text-left font-montserrat font-bold text-sm transition-all ${formData.isEngaged === 'non'
              ? 'border-brand-dark bg-brand-dark text-white'
              : 'border-brand-dark/10 hover:border-brand-dark/30 text-brand-dark/70'
              }`}
          >
            {t('forms.options.engaged_no')}
          </button>
        </div>
      </div>

      {formData.isEngaged === 'oui' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h4 className="text-sm font-black font-montserrat uppercase tracking-widest text-brand-muted mb-4">
            {t('forms.options.engaged_how_long')}
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {engagementDurations.map(d => (
              <button
                key={d.value}
                onClick={() => updateField('engagementDuration', d.value)}
                className={`p-3 border-2 font-montserrat font-bold text-xs transition-all ${formData.engagementDuration === d.value
                  ? 'border-accent-telecom bg-accent-telecom text-white'
                  : 'border-brand-dark/10 hover:border-accent-telecom/50 text-brand-dark/60'
                  }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,

    // Step 4: Satisfaction
    <div key="step4" className="space-y-6">
      <h3 className="text-2xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-6">
        {t('forms.step_problems')} <span className="text-accent-telecom">{t('forms.problems_question')}</span> rencontrez-vous ?
      </h3>
      <p className="text-sm text-brand-muted font-medium mb-4">Plusieurs choix possibles</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {satisfactionOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => toggleIssue(option.value)}
            className={`p-3 border-2 font-montserrat font-bold text-xs transition-all text-left flex items-center justify-between min-h-[48px] ${formData.satisfactionIssues.includes(option.value)
              ? 'border-accent-telecom bg-accent-telecom text-white'
              : 'border-brand-dark/10 hover:border-brand-dark/30 text-brand-dark/70'
              }`}
          >
            {option.label}
            {formData.satisfactionIssues.includes(option.value) && (
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>,

    // Step 5: Contact
    <div key="step5" className="space-y-6">
      <h3 className="text-2xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-6">
        {t('forms.step_contact')} <span className="text-accent-telecom">{t('forms.contact_label')}</span>
      </h3>
      <div>
        <label className="text-xs font-black uppercase tracking-widest text-brand-muted block mb-2">{t('forms.name_label')}</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder={t('forms.name_placeholder')}
          className="w-full bg-white border-2 border-brand-dark/10 p-3 font-medium focus:border-accent-telecom focus:outline-none transition-colors"
        />
      </div>
      <div>
        <label className="text-xs font-black uppercase tracking-widest text-brand-muted block mb-2">{t('forms.email_label')}</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="E.g John@doe.com"
          className="w-full bg-white border-2 border-brand-dark/10 p-3 font-medium focus:border-accent-telecom focus:outline-none transition-colors"
        />
      </div>
      <div>
        <label className="text-xs font-black uppercase tracking-widest text-brand-muted block mb-2">{t('forms.phone_label')}</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="0470 12 34 56"
          className="w-full bg-white border-2 border-brand-dark/10 p-3 font-medium focus:border-accent-telecom focus:outline-none transition-colors"
        />
      </div>
      <div>
        <label className="text-xs font-black uppercase tracking-widest text-brand-muted block mb-2">{t('forms.postal_code_label')}</label>
        <input
          type="text"
          value={formData.postalCode}
          onChange={(e) => updateField('postalCode', e.target.value)}
          placeholder="1000"
          className="w-full bg-white border-2 border-brand-dark/10 p-3 font-medium focus:border-accent-telecom focus:outline-none transition-colors"
        />
      </div>
    </div>,
  ];

  return (
    <FormWizard
      isOpen={isOpen}
      onClose={onClose}
      currentStep={currentStep}
      setCurrentStep={handleStepChange}
      onSubmit={handleSubmit}
      canProceed={!!validateStep()}
    >
      {steps}
    </FormWizard>
  );
}
