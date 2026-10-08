import React, { createContext, useContext, useState, ReactNode } from 'react';
import eng from '../lang/eng.json';
import tam from '../lang/tam.json';

export type Language = 'ta' | 'en';
export type TranslateVars = Record<string, string | number>;

const dictionaries: Record<Language, unknown> = { en: eng, ta: tam };

function lookup(dict: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>((node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined), dict);
}

/** Raw value (string, array or object) for a dotted key in src/lang; falls back to English. */
export function translateRaw<T = unknown>(lang: Language, key: string): T | undefined {
  const value = lookup(dictionaries[lang], key);
  return (value !== undefined ? value : lookup(dictionaries.en, key)) as T | undefined;
}

/** Text for a dotted key in src/lang, e.g. translate('ta', 'nav.home'); {name} placeholders are filled from vars. */
export function translate(lang: Language, key: string, vars?: TranslateVars): string {
  const value = translateRaw(lang, key);
  if (typeof value !== 'string') return key;
  return vars ? value.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match)) : value;
}

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, vars?: TranslateVars) => string;
  tRaw: <T = unknown>(key: string) => T | undefined;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => (localStorage.getItem('nmpi_lang') === 'en' ? 'en' : 'ta'));
  const setLang = (next: Language) => {
    localStorage.setItem('nmpi_lang', next);
    setLangState(next);
  };

  const t = (key: string, vars?: TranslateVars): string => translate(lang, key, vars);
  const tRaw = <T = unknown,>(key: string): T | undefined => translateRaw<T>(lang, key);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tRaw }}>
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
