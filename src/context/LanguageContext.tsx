import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'ta' | 'en';

interface Translations {
  [key: string]: {
    ta: string;
    en: string;
  };
}

export const translations: Translations = {
  brandName: {
    ta: 'நேதாஜி மக்கள் பாதுகாப்பு இயக்கம்',
    en: 'Netaji Makkal Pathukappu Iyakkam',
  },
  brandSubtitle: {
    ta: 'தமிழ்நாடு மாநில மையம்',
    en: 'Tamil Nadu State Assembly',
  },
  navHome: { ta: 'முகப்பு', en: 'Home' },
  navParty: { ta: 'இயக்கம்', en: 'Iyakkam' },
  navAboutParty: { ta: 'இயக்கம் பற்றி', en: 'About Iyakkam' },
  navIdeology: { ta: 'கொள்கைகள்', en: 'Ideology & Principles' },
  navActions: { ta: 'செயல்பாடுகள்', en: 'Actions & Initiatives' },
  navLeadership: { ta: 'நிர்வாகிகள்', en: 'Leadership' },
  navAchievements: { ta: 'சாதனைகள்', en: 'Achievements' },
  navOrganization: { ta: 'அமைப்பு', en: 'Organization' },
  navMore: { ta: 'மேலும்', en: 'More' },
  navEvents: { ta: 'நிகழ்வுகள்', en: 'Events' },
  navNews: { ta: 'செய்திகள்', en: 'News & Bulletins' },
  navGallery: { ta: 'புகைப்படங்கள்', en: 'Gallery' },
  navHistory: { ta: 'வரலாறு', en: 'History' },
  navFaq: { ta: 'கேள்விகள்', en: 'FAQ' },
  navContact: { ta: 'தொடர்பு', en: 'Contact' },
  joinUs: { ta: 'இணையுங்கள்', en: 'Join Us' },
  memberLogin: { ta: 'உறுப்பினர் உள்நுழைவு', en: 'Member Login' },
  selectLang: { ta: 'மொழி', en: 'Language' },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ta');

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][lang] || translations[key]['en'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
