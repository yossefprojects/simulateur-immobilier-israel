import React, { useState } from 'react'
import { Building2, Download } from 'lucide-react'
import { EstimationTab }  from './components/EstimationTab'
import { UrbanismeTab }   from './components/UrbanismeTab'
import { InvestisseurTab, PromoteurTab } from './components/FinanceTab'
import { useLang } from './i18n/LanguageContext'
import { Lang } from './i18n/translations'
import { getReportData } from './store/reportStore'
import { exportPDF } from './utils/pdfExport'

type Tab = 'estimation' | 'urbanisme' | 'investisseur' | 'promoteur'

const LANGS: { key: Lang; label: string }[] = [
  { key: 'fr', label: 'FR' },
  { key: 'en', label: 'EN' },
  { key: 'he', label: 'עב' },
]

// Unsplash photos, one per tab — 1600×320 crop for the banner
const TAB_PHOTOS: Record<Tab, string> = {
  estimation:
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&w=1600&h=320&fit=crop&q=75',
  urbanisme:
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&w=1600&h=320&fit=crop&q=75',
  investisseur:
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&w=1600&h=320&fit=crop&q=75',
  promoteur:
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&w=1600&h=320&fit=crop&q=75',
}

export default function App() {
  const [active, setActive]       = useState<Tab>('estimation')
  const [exporting, setExporting] = useState(false)
  const { lang, setLang, t }      = useLang()

  const TABS: { key: Tab; label: string; sub: string }[] = [
    { key: 'estimation',   label: t.tabs.estimation,   sub: t.appSubtitle.split(' · ')[0] },
    { key: 'urbanisme',    label: t.tabs.urbanisme,    sub: t.appSubtitle.split(' · ')[1] },
    { key: 'investisseur', label: t.tabs.investisseur, sub: t.appSubtitle.split(' · ')[2] },
    { key: 'promoteur',    label: t.tabs.promoteur,    sub: t.appSubtitle.split(' · ')[2] },
  ]

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => {
      try { exportPDF(getReportData(), t, lang) }
      finally { setExporting(false) }
    }, 50)
  }

  const activeTab = TABS.find(tb => tb.key === active)!

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Building2 size={22} className="text-blue-600 shrink-0" />
            <div>
              <h1 className="text-lg font-medium text-gray-900">{t.appTitle}</h1>
              <p className="text-xs text-gray-400">{t.appSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50"
            >
              <Download size={13} />
              {exporting ? '…' : 'PDF'}
            </button>

            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
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
        </div>
      </header>

      {/* ── Tab nav ── */}
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

      {/* ── Photo banner ── */}
      <div className="relative h-36 overflow-hidden">
        {TABS.map(tab => (
          <img
            key={tab.key}
            src={TAB_PHOTOS[tab.key]}
            alt=""
            aria-hidden
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              active === tab.key ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* text overlay */}
        <div className="relative max-w-5xl mx-auto px-6 h-full flex flex-col justify-center">
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">
            {activeTab.sub}
          </p>
          <h2 className="text-white text-2xl font-medium">{activeTab.label}</h2>
        </div>
      </div>

      {/* ── Content — all tabs always mounted so the report store stays populated ── */}
      <main className="max-w-5xl mx-auto px-6 py-6">
        <div className={active === 'estimation'   ? '' : 'hidden'}><EstimationTab /></div>
        <div className={active === 'urbanisme'    ? '' : 'hidden'}><UrbanismeTab /></div>
        <div className={active === 'investisseur' ? '' : 'hidden'}><InvestisseurTab /></div>
        <div className={active === 'promoteur'    ? '' : 'hidden'}><PromoteurTab /></div>
      </main>
    </div>
  )
}
