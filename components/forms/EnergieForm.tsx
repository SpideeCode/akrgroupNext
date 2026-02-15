'use client';

import { useState } from 'react';
import FormWizard from '@/components/ui/FormWizard';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';

interface EnergieFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  address: string;
  status: string;
  energie: string;
  meterType: string;
  meterBrand: string;
  hasSolar: string;
  consumption: string;
  housingType: string;
  buildingType: string;
  heating: string;
  persons: string;
  hasCar: string;
  hasHeatPump: string;
  name: string;
  phone: string;
  email: string;
  postalCode: string;
}

export default function EnergieForm({ isOpen, onClose, onSuccess }: EnergieFormProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    address: '',
    status: '',
    energie: '',
    meterType: '',
    meterBrand: '',
    hasSolar: '',
    consumption: '',
    housingType: '',
    buildingType: '',
    heating: '',
    persons: '',
    hasCar: '',
    hasHeatPump: '',
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
        return formData.address && formData.status;
      case 1:
        return formData.energie && formData.meterType && formData.meterBrand;
      case 2:
        return formData.hasSolar && formData.consumption;
      case 3:
        return formData.housingType && formData.buildingType && formData.heating && formData.persons;
      case 4:
        return formData.hasCar && formData.hasHeatPump;
      case 5:
        return formData.name && formData.phone;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase.from('quote_requests').upsert({
        service_type: 'energie',
        form_data: formData,
        contact_name: formData.name,
        contact_email: formData.email || null,
        contact_phone: formData.phone,
        contact_postal_code: formData.postalCode || null,
        status: 'pending', // Revenir en attente si mise à jour
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'service_type,contact_phone'
      });

      if (error) throw error;

      onSuccess();
      onClose();
      setCurrentStep(0);
      setFormData({
        address: '',
        status: '',
        energie: '',
        meterType: '',
        meterBrand: '',
        hasSolar: '',
        consumption: '',
        housingType: '',
        buildingType: '',
        heating: '',
        persons: '',
        hasCar: '',
        hasHeatPump: '',
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

  const statusOptions = [
    { value: 'Propriétaire', label: t('forms.owner') },
    { value: 'Locataire', label: t('forms.tenant') }
  ];

  const energyOptions = [
    { value: 'Électricité', label: t('forms.options.electricity') },
    { value: 'Gaz', label: t('forms.options.gas') },
    { value: 'Électricité + Gaz', label: t('forms.options.elec_gas') }
  ];

  const meterOptions = [
    { value: 'Digital', label: t('forms.options.digital') },
    { value: 'Analogique', label: t('forms.options.analog') }
  ];

  const yesNoOptions = [
    { value: 'Oui', label: t('forms.yes') },
    { value: 'Non', label: t('forms.no') }
  ];

  const housingOptions = [
    { value: 'Maison', label: t('forms.options.house') },
    { value: 'Appartement', label: t('forms.options.apartment') }
  ];

  const buildingOptions = [
    { value: 'Ancien', label: t('forms.options.old') },
    { value: 'Neuf', label: t('forms.options.new') },
    { value: 'Rénové', label: t('forms.options.renovated') }
  ];

  const heatingOptions = [
    { value: 'Électrique', label: t('forms.options.heating_elec') },
    { value: 'Gaz', label: t('forms.options.heating_gas') },
    { value: 'Pompe à chaleur', label: t('forms.options.heating_pump') },
    { value: 'Autre', label: t('forms.options.other') }
  ];

  const steps = [
    <div key="step1" className="space-y-6">
      <h3 className="text-2xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-6">
        {t('forms.step_address')} <span className="text-accent-energy">{t('forms.step_status')}</span>
      </h3>
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-brand-muted mb-3">
          {t('forms.address_label')}
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => updateField('address', e.target.value)}
          className="w-full bg-transparent border-b-2 border-brand-dark py-4 focus:outline-none focus:border-accent-energy transition-colors font-medium text-lg"
          placeholder={t('forms.address_placeholder')}
        />
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-brand-muted mb-4">
          {t('forms.status_label')}
        </label>
        <div className="grid grid-cols-2 gap-4">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('status', option.value)}
              className={`btn-option min-h-[56px] ${formData.status === option.value ? 'btn-option-active' : 'btn-option-inactive'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>,

    <div key="step2" className="space-y-6">
      <h3 className="text-2xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-6">
        {t('forms.step_energy')} <span className="text-accent-energy">{t('forms.step_meter')}</span>
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.energy_type')}
        </label>
        <div className="grid grid-cols-2 gap-4">
          {energyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('energie', option.value)}
              className={`btn-option min-h-[56px] ${formData.energie === option.value ? 'btn-option-active' : 'btn-option-inactive'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.meter_type')}
        </label>
        <div className="grid grid-cols-2 gap-4">
          {meterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('meterType', option.value)}
              className={`btn-option min-h-[56px] ${formData.meterType === option.value ? 'btn-option-active' : 'btn-option-inactive'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.meter_brand')}
        </label>
        <select
          value={formData.meterBrand}
          onChange={(e) => updateField('meterBrand', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
        >
          <option value="">{t('forms.select_brand')}</option>
          <option value="Linky">Linky</option>
          <option value="Gazpar">Gazpar</option>
          <option value="Autre">{t('forms.options.other')}</option>
        </select>
      </div>
    </div>,

    <div key="step3" className="space-y-6">
      <h3 className="text-2xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-6">
        {t('forms.step_situation')} <span className="text-accent-energy">{t('forms.step_situation')}</span>
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.solar_question')}
        </label>
        <div className="grid grid-cols-2 gap-4">
          {yesNoOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('hasSolar', option.value)}
              className={`btn-option ${formData.hasSolar === option.value ? 'btn-option-active' : 'btn-option-inactive'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.consumption_label')}
        </label>
        <input
          type="text"
          value={formData.consumption}
          onChange={(e) => updateField('consumption', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          placeholder="Ex: 3000"
        />
      </div>
    </div>,

    <div key="step4" className="space-y-6">
      <h3 className="text-2xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-6">
        {t('forms.step_housing_info')} <span className="text-accent-energy">{t('forms.step_housing_info')}</span>
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.housing_type')}
        </label>
        <div className="grid grid-cols-2 gap-4">
          {housingOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('housingType', option.value)}
              className={`btn-option ${formData.housingType === option.value ? 'btn-option-active' : 'btn-option-inactive'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.building_type')}
        </label>
        <select
          value={formData.buildingType}
          onChange={(e) => updateField('buildingType', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
        >
          <option value="">{t('forms.select')}</option>
          {buildingOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.heating_type')}
        </label>
        <select
          value={formData.heating}
          onChange={(e) => updateField('heating', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
        >
          <option value="">{t('forms.select')}</option>
          {heatingOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.people_count')}
        </label>
        <input
          type="number"
          value={formData.persons}
          onChange={(e) => updateField('persons', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          placeholder="Ex: 4"
          min="1"
        />
      </div>
    </div>,

    <div key="step5" className="space-y-6">
      <h3 className="text-2xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-6">
        {t('forms.step_options')} <span className="text-accent-energy">{t('forms.step_options')}</span>
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.car_question')}
        </label>
        <div className="grid grid-cols-2 gap-4">
          {yesNoOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('hasCar', option.value)}
              className={`btn-option ${formData.hasCar === option.value ? 'btn-option-active' : 'btn-option-inactive'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.heat_pump_question')}
        </label>
        <div className="grid grid-cols-2 gap-4">
          {yesNoOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('hasHeatPump', option.value)}
              className={`btn-option ${formData.hasHeatPump === option.value ? 'btn-option-active' : 'btn-option-inactive'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>,

    <div key="step6" className="space-y-6">
      <h3 className="text-2xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-6">
        {t('forms.step_last')} <span className="text-accent-energy">{t('forms.step_last')}</span>
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
