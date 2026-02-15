'use client';

import { useState } from 'react';
import FormWizard from '@/components/ui/FormWizard';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';

interface SolaireFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  kwh: string;
  phase: string;
  tva: string;
  buildingAge: string;
  roofType: string;
  orientation: string;
  inclination: string;
  name: string;
  phone: string;
  email: string;
  postalCode: string;
}

export default function SolaireForm({ isOpen, onClose, onSuccess }: SolaireFormProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    kwh: '',
    phase: '',
    tva: '',
    buildingAge: '',
    roofType: '',
    orientation: '',
    inclination: '',
    name: '',
    phone: '',
    email: '',
    postalCode: '',
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return formData.kwh && formData.phase && formData.tva;
      case 1:
        return formData.buildingAge && formData.roofType && formData.orientation && formData.inclination;
      case 2:
        return formData.name && formData.phone;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase.from('quote_requests').upsert({
        service_type: 'solaire',
        form_data: formData,
        contact_name: formData.name,
        contact_email: formData.email || null,
        contact_phone: formData.phone,
        contact_postal_code: formData.postalCode || null,
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
        kwh: '',
        phase: '',
        tva: '',
        buildingAge: '',
        roofType: '',
        orientation: '',
        inclination: '',
        name: '',
        phone: '',
        email: '',
        postalCode: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t('forms.submit_error'));
    }
  };

  const phaseOptions = [
    { value: 'Monophasé', label: t('forms.options.monophase') },
    { value: 'Triphasé', label: t('forms.options.triphase') }
  ];

  const tvaOptions = [
    { value: '10%', label: '10%' },
    { value: '20%', label: '20%' }
  ];

  const ageOptions = [
    { value: 'Moins de 2 ans', label: t('forms.options.age_less_2') },
    { value: '2 à 15 ans', label: t('forms.options.age_2_15') },
    { value: 'Plus de 15 ans', label: t('forms.options.age_more_15') }
  ];

  const roofOptions = [
    { value: 'Tuiles', label: t('forms.options.roof_tiles') },
    { value: 'Ardoises', label: t('forms.options.roof_slates') },
    { value: 'Tôle', label: t('forms.options.roof_sheet') },
    { value: 'Bac acier', label: t('forms.options.roof_steel') },
    { value: 'Autre', label: t('forms.options.other') }
  ];

  const orientationOptions = [
    { value: 'Sud', label: t('forms.options.orient_south') },
    { value: 'Sud-Est', label: t('forms.options.orient_southeast') },
    { value: 'Sud-Ouest', label: t('forms.options.orient_southwest') },
    { value: 'Est', label: t('forms.options.orient_east') },
    { value: 'Ouest', label: t('forms.options.orient_west') },
    { value: 'Nord', label: t('forms.options.orient_north') }
  ];

  const inclinationOptions = [
    { value: '0-15°', label: t('forms.options.inc_flat') },
    { value: '15-30°', label: t('forms.options.inc_low') },
    { value: '30-45°', label: t('forms.options.inc_med') },
    { value: '45°+', label: t('forms.options.inc_high') }
  ];

  const steps = [
    <div key="step1" className="space-y-6">
      <h3 className="text-2xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-6">
        {t('forms.step_consumption')} <span className="text-accent-solar">{t('forms.step_consumption')}</span>
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.kwh_label')}
        </label>
        <input
          type="text"
          value={formData.kwh}
          onChange={(e) => updateField('kwh', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          placeholder="Ex: 5000"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.phase_label')}
        </label>
        <div className="grid grid-cols-2 gap-4">
          {phaseOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('phase', option.value)}
              className={`btn-option min-h-[56px] ${formData.phase === option.value ? 'btn-option-active' : 'btn-option-inactive'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.tva_label')}
        </label>
        <div className="grid grid-cols-2 gap-4">
          {tvaOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('tva', option.value)}
              className={`btn-option min-h-[56px] ${formData.tva === option.value ? 'btn-option-active' : 'btn-option-inactive'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {t('forms.tva_hint')}
        </p>
      </div>
    </div>,

    <div key="step2" className="space-y-6">
      <h3 className="text-2xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-6">
        {t('forms.step_habitat')} <span className="text-accent-solar">{t('forms.step_habitat')}</span>
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.building_age')}
        </label>
        <select
          value={formData.buildingAge}
          onChange={(e) => updateField('buildingAge', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
        >
          <option value="">{t('forms.select')}</option>
          {ageOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.roof_type')}
        </label>
        <select
          value={formData.roofType}
          onChange={(e) => updateField('roofType', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
        >
          <option value="">{t('forms.select')}</option>
          {roofOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.orientation')}
        </label>
        <select
          value={formData.orientation}
          onChange={(e) => updateField('orientation', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
        >
          <option value="">{t('forms.select')}</option>
          {orientationOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.inclination')}
        </label>
        <select
          value={formData.inclination}
          onChange={(e) => updateField('inclination', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
        >
          <option value="">{t('forms.select')}</option>
          {inclinationOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>,

    <div key="step3" className="space-y-6">
      <h3 className="text-2xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-6">
        {t('forms.step_last')} <span className="text-accent-solar">{t('forms.step_last')}</span>
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.name_label')}
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          placeholder={t('forms.name_placeholder')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.phone_label')}
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          placeholder="06 12 34 56 78"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.email_label')}
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          placeholder="votre@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.postal_code_label')}
        </label>
        <input
          type="text"
          value={formData.postalCode}
          onChange={(e) => updateField('postalCode', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          placeholder="75001"
        />
      </div>
    </div>,
  ];

  return (
    <FormWizard
      isOpen={isOpen}
      onClose={onClose}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      onSubmit={handleSubmit}
      canProceed={!!validateStep()}
    >
      {steps}
    </FormWizard>
  );
}
