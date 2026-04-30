import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const change = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  return (
    <div className="flex items-center gap-1 border rounded-lg overflow-hidden text-sm font-bold">
      <button
        onClick={() => change('ar')}
        className={`px-3 py-1.5 transition-colors ${
          i18n.language === 'ar'
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-muted text-muted-foreground'
        }`}
      >
        AR
      </button>
      <button
        onClick={() => change('fr')}
        className={`px-3 py-1.5 transition-colors ${
          i18n.language === 'fr'
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-muted text-muted-foreground'
        }`}
      >
        FR
      </button>
    </div>
  );
}