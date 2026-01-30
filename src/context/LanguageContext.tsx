// src/context/LanguageContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LangType } from '@/constants/text';

type LanguageContextType = {
  lang: LangType;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangType>('th');

  useEffect(() => {
    const savedLang = localStorage.getItem('app-language') as LangType;
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'th' ? 'en' : 'th';
    setLang(newLang);
    localStorage.setItem('app-language', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children} 
    </LanguageContext.Provider>
  ); //ดูเพิ่ม
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}