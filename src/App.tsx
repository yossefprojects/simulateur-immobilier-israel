import React, { useState } from 'react'
import { Building2 } from 'lucide-react'
import { EstimationTab }  from './components/EstimationTab'
import { UrbanismeTab }   from './components/UrbanismeTab'
import { InvestisseurTab, PromoteurTab } from './components/FinanceTab'
import { useLang } from './i18n/LanguageContext'
import { Lang } from './i18n/translations'

type Tab = 'estimation' | 'urbanisme' | 'investisseur' | 'promoteur'

const LANGS: { key: Lang; label: string }[] = [
  { key: 'fr', label: 'FR' },
  { key: 'en', label: 'EN' },
  { key: 'he', label: 'עב' },
]

export default function App() {
  const [active, setActive] = useState<Tab>('estimation')
  const { lang, setLang, t } = useLang()

  const TABS: { key: Tab; label: string }[] = [
    { key: 'estimation',   label: t.tabs.estimation   },
    { key: 'urbanisme',    label: t.tabs.urbanisme     },
    { key: 'investisseur', label: t.tabs.investisseur  },
    { key: 'promoteur',    label: t.tabs.promoteur     },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Building2 size={22} className="text-blue-600 shrink-0" />
            <div>
              <h1 className="text-lg font-medium text-gray-900">{t.appTitle}</h1>
              <p className="text-xs text-gray-400">{t.appSubtitle}</p>
            </div>
          </div>
          {/* Language switcher */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5 shrink-0">
            {LANGS.map(l => (
              <button
                key={l.key}
                onClick={() => setLang(l.key)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  lang === l.key
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 flex gap-0 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`px-4 py-3 text-sm border-b-2 transition-colors whitespace-nowrap ${
                active === tab.key
                  ? 'border-gray-900 text-gray-900 font-medium'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-6">
        {active === 'estimation'   && <EstimationTab />}
        {active === 'urbanisme'    && <UrbanismeTab />}
        {active === 'investisseur' && <InvestisseurTab />}
        {active === 'promoteur'    && <PromoteurTab />}
      </main>
    </div>
  )
}
