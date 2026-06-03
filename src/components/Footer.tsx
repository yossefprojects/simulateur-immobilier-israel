import React from 'react'
import { useLang } from '../i18n/LanguageContext'

export const Footer: React.FC = () => {
  const { t } = useLang()
  const f = t.footer

  const SOURCES = [
    { name: 'Nadlan Gov', sub: f.subNadlan },
    { name: 'CBS Israël', sub: f.subCbs },
    { name: 'GovMap',     sub: f.subGovmap },
    { name: 'Mavat',      sub: f.subMavat },
  ]

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 px-6 py-8 mt-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-8 flex-wrap justify-around mb-6">
          {SOURCES.map(s => (
            <div key={s.name} className="text-center">
              <div className="text-lg font-semibold text-primary">{s.name}</div>
              <div className="text-xs text-neutral-500 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-500 text-center leading-relaxed">
          {f.disclaimer}
        </p>
      </div>
    </footer>
  )
}
