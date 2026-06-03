import React, { createContext, useContext, useState } from 'react'
import { Lang, translations, Translations } from './translations'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const LanguageContext = createContext<LangCtx>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
})

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('en')
  const t = translations[lang]
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div dir={t.dir} className={t.dir === 'rtl' ? 'font-hebrew' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
