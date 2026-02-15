'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Mission from '@/components/sections/Mission';
import Features from '@/components/sections/Features';
import Services from '@/components/sections/Services';
import CallbackForm from '@/components/sections/CallbackForm';
import EnergieForm from '@/components/forms/EnergieForm';
import SolaireForm from '@/components/forms/SolaireForm';
import TelecomForm from '@/components/forms/TelecomForm';
import SuccessScreen from '@/components/ui/SuccessScreen';

type ServiceType = 'energie' | 'solaire' | 'telecom' | null;

export default function LandingPage() {
  const [activeForm, setActiveForm] = useState<ServiceType>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle scroll to hash on mount or when hash changes is handled by Next.js automatically for #ids
  // But we might need custom handling if coming from another page with state, though Next.js recommends using search params or hash.
  // The original code used location.state.scrollTo. We'll stick to native behavior for now unless issues arise.

  const handleServiceClick = (service: ServiceType) => {
    setActiveForm(service);
  };

  const handleFormClose = () => {
    setActiveForm(null);
  };

  const handleFormSuccess = () => {
    setShowSuccess(true);
  };

  const scrollToServices = () => {
    const servicesElement = document.getElementById('services');
    if (servicesElement) {
      servicesElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream font-inter">
      <Header onDevisClick={scrollToServices} />

      <main>
        <Hero onDevisClick={scrollToServices} />

        <div id="mission">
          <Mission />
        </div>

        <Features /> {/* Advantages */}

        <div id="services">
          <Services onServiceClick={handleServiceClick} />
        </div>

        <div id="contact">
          <CallbackForm /> {/* Un expert vous rappelle */}
        </div>
      </main>

      <Footer />

      <EnergieForm
        isOpen={activeForm === 'energie'}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />

      <SolaireForm
        isOpen={activeForm === 'solaire'}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />

      <TelecomForm
        isOpen={activeForm === 'telecom'}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />

      <SuccessScreen
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
