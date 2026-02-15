'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Upload } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation'; // Added usePathname here
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export default function JobPageContent() {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname(); // Added hook usage
    const currentLocale = pathname.split('/')[1] || 'fr'; // Added locale extraction
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        phone: '',
        age: '',
        cvText: '', // Using text for now as file upload requires storage bucket
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const adminData = {
                "Nom": formData.nom,
                "Prénom": formData.prenom,
                "Âge": formData.age,
                "Info CV": formData.cvText || 'Non renseigné',
            };

            const { error } = await supabase.from('quote_requests').upsert({
                service_type: 'job',
                form_data: adminData,
                contact_name: `${formData.prenom} ${formData.nom}`,
                contact_phone: formData.phone,
                status: 'pending',
                created_at: new Date().toISOString(),
            }, {
                onConflict: 'service_type,contact_phone'
            });

            if (error) throw error;
            setSuccess(true);
            window.scrollTo(0, 0);

        } catch (error) {
            console.error('Error submitting job application:', error);
            alert("Une erreur est survenue lors de l'envoi de votre candidature.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Navigation logic handled by router in Header
    const handleDevisClick = () => router.push(`/${currentLocale}/#services`);

    if (success) {
        return (
            <div className="min-h-screen bg-brand-cream font-inter flex flex-col">
                <Header onDevisClick={handleDevisClick} />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white p-8 border-2 border-brand-dark text-center">
                        <div className="w-16 h-16 bg-accent-solar rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-4">
                            {t('job.success_title')}
                        </h2>
                        <p className="text-brand-muted mb-8">
                            {t('job.success_message')}
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-8 py-3 bg-brand-dark text-white font-black uppercase text-xs tracking-widest hover:bg-brand-primary transition-all"
                        >
                            {t('job.back_home')}
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-cream font-inter flex flex-col">
            <Header onDevisClick={handleDevisClick} />

            <main className="flex-1 pt-24">
                {/* Hero Section for Job */}
                <div className="relative bg-brand-dark text-white py-20 px-6 lg:px-12 mb-12 overflow-hidden min-h-[400px] flex items-center justify-center">
                    <div className="absolute inset-0 opacity-10">
                         <Image
                            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2968&auto=format&fit=crop"
                            alt="Job Hero Background"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-black font-montserrat uppercase tracking-tighter mb-6">
                            {t('job.hero_title')} <span className="text-accent-energy">{t('job.hero_title_highlight')}</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed max-w-2xl mx-auto">
                            {t('job.hero_description')}
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="max-w-2xl mx-auto px-6 pb-20">
                    <div className="bg-white border-2 border-brand-dark p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,51,102,0.1)]">
                        <h2 className="text-2xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-2">
                            {t('job.form_title')}
                        </h2>
                        <p className="text-brand-muted mb-8">{t('job.form_description')}</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-brand-muted block mb-2">{t('job.firstname')}</label>
                                    <input
                                        required
                                        name="prenom"
                                        type="text"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        placeholder={t('job.firstname_placeholder')}
                                        className="w-full bg-brand-cream border-2 border-brand-dark/10 p-3 font-medium focus:border-accent-energy focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-brand-muted block mb-2">{t('job.lastname')}</label>
                                    <input
                                        required
                                        name="nom"
                                        type="text"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        placeholder={t('job.lastname_placeholder')}
                                        className="w-full bg-brand-cream border-2 border-brand-dark/10 p-3 font-medium focus:border-accent-energy focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-brand-muted block mb-2">{t('job.phone')}</label>
                                    <input
                                        required
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="0470 12 34 56"
                                        className="w-full bg-brand-cream border-2 border-brand-dark/10 p-3 font-medium focus:border-accent-energy focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-brand-muted block mb-2">{t('job.age')}</label>
                                    <input
                                        required
                                        name="age"
                                        type="number"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder={t('job.age_placeholder')}
                                        className="w-full bg-brand-cream border-2 border-brand-dark/10 p-3 font-medium focus:border-accent-energy focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-brand-muted block mb-2">{t('job.cv_label')}</label>
                                <div className="relative">
                                    <textarea
                                        name="cvText"
                                        value={formData.cvText}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder={t('job.cv_placeholder')}
                                        className="w-full bg-brand-cream border-2 border-brand-dark/10 p-3 font-medium focus:border-accent-energy focus:outline-none transition-colors resize-none"
                                    />
                                    <div className="absolute right-3 top-3 pointer-events-none text-brand-dark/20">
                                        <Upload size={20} />
                                    </div>
                                </div>
                                <p className="text-[10px] text-brand-muted mt-2 italic">
                                    {t('job.motivation_hint')}
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-brand-dark text-white font-black uppercase text-xs tracking-widest hover:bg-accent-energy transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {loading ? t('common.sending') : t('job.submit')}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
