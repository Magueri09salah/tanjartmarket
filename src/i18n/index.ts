import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './ar';
import fr from './fr';

const savedLang = localStorage.getItem('lang') || 'ar'; // ✅ Arabic default

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    fr: { translation: fr },
  },
  lng: savedLang,
  fallbackLng: 'ar',
  interpolation: { escapeValue: false },
});

// ✅ Apply direction on every page load
document.documentElement.dir  = savedLang === 'fr' ? 'ltr' : 'rtl';
document.documentElement.lang = savedLang;

export default i18n;