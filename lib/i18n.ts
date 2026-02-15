'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from '../i18n/locales/fr.json';
import nl from '../i18n/locales/nl.json';

// Initialize i18next
if (!i18n.isInitialized) {
    i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources: {
                fr: { translation: fr },
                nl: { translation: nl },
            },
            fallbackLng: 'fr',
            supportedLngs: ['fr', 'nl'],
            interpolation: {
                escapeValue: false,
            },
            detection: {
                order: ['localStorage', 'navigator'],
                caches: ['localStorage'],
            },
            react: {
                useSuspense: false, // Avoid suspense for now to prevent hydration mismatches if not handled
            }
        });
}

export default i18n;
