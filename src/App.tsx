import { useState, useEffect, useCallback } from 'react'
import { Building2, Download, FileSpreadsheet, History, X, Trash2 } from 'lucide-react'
import { EstimationTab }  from './components/EstimationTab'
import { UrbanismeTab }   from './components/UrbanismeTab'
import { InvestisseurTab, PromoteurTab } from './components/FinanceTab'
import { FiscaliteTab }   from './components/FiscaliteTab'
import { MarketBanner }   from './components/MarketBanner'
import { Footer }         from './components/Footer'
import { useLang }        from './i18n/LanguageContext'
import { Lang }           from './i18n/translations'
import { getReportData }  from './store/reportStore'
import { exportPDF }      from './utils/pdfExport'
import { exporterExcel }  from './utils/exportExcel'
import { lireScenarios, supprimerScenario, sauvegarderScenario, Scenario } from './utils/scenarios'

type Tab = 'estimation' | 'urbanisme' | 'investisseur' | 'promoteur' | 'fiscalite'

const LANGS: { key: Lang; label: string }[] = [
  { key: 'fr', label: 'FR' },
  { key: 'en', label: 'EN' },
  { key: 'he', label: 'עב' },
]

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t) }, [onDone])
  return <div className="toast">{msg}</div>
}

// ── SVG Banners ────────────────────────────────────────────────────────────────
const BannerEstimation = () => (
  <svg viewBox="0 0 1200 160" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
    <rect width="1200" height="160" fill="#1A3A5C"/>
    <rect x="0"    y="80"  width="80"  height="80"  fill="#2A5080"/>
    <rect x="90"   y="40"  width="120" height="120" fill="#0F2235"/>
    <rect x="220"  y="60"  width="90"  height="100" fill="#2A5080"/>
    <rect x="320"  y="20"  width="100" height="140" fill="#0F2235"/>
    <rect x="430"  y="50"  width="80"  height="110" fill="#1A3A5C"/>
    <rect x="520"  y="70"  width="110" height="90"  fill="#2A5080"/>
    <rect x="640"  y="30"  width="90"  height="130" fill="#0F2235"/>
    <rect x="740"  y="55"  width="75"  height="105" fill="#2A5080"/>
    <rect x="825"  y="25"  width="130" height="135" fill="#0F2235"/>
    <rect x="965"  y="65"  width="85"  height="95"  fill="#1A3A5C"/>
    <rect x="1060" y="45"  width="140" height="115" fill="#2A5080"/>
    <rect x="100" y="55" width="8" height="6" fill="#C9A84C" opacity="0.8"/>
    <rect x="115" y="55" width="8" height="6" fill="#C9A84C" opacity="0.6"/>
    <rect x="130" y="55" width="8" height="6" fill="#C9A84C" opacity="0.9"/>
    <rect x="330" y="35" width="8" height="6" fill="#C9A84C" opacity="0.9"/>
    <rect x="840" y="40" width="8" height="6" fill="#C9A84C" opacity="0.9"/>
    <rect x="855" y="40" width="8" height="6" fill="#C9A84C" opacity="0.6"/>
    <circle cx="1150" cy="30" r="18" fill="#E8C96A" opacity="0.9"/>
    <rect x="0" y="150" width="1200" height="10" fill="#0F2235" opacity="0.6"/>
  </svg>
)
const BannerUrbanisme = () => (
  <svg viewBox="0 0 1200 160" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
    <rect width="1200" height="160" fill="#0F2235"/>
    <line x1="0" y1="40"  x2="1200" y2="40"  stroke="#2A5080" strokeWidth="0.5" opacity="0.6"/>
    <line x1="0" y1="80"  x2="1200" y2="80"  stroke="#2A5080" strokeWidth="0.5" opacity="0.6"/>
    <line x1="0" y1="120" x2="1200" y2="120" stroke="#2A5080" strokeWidth="0.5" opacity="0.6"/>
    <line x1="150"  y1="0" x2="150"  y2="160" stroke="#2A5080" strokeWidth="0.5" opacity="0.6"/>
    <line x1="350"  y1="0" x2="350"  y2="160" stroke="#2A5080" strokeWidth="0.5" opacity="0.6"/>
    <line x1="600"  y1="0" x2="600"  y2="160" stroke="#2A5080" strokeWidth="0.5" opacity="0.6"/>
    <line x1="900"  y1="0" x2="900"  y2="160" stroke="#2A5080" strokeWidth="0.5" opacity="0.6"/>
    <rect x="160" y="45" width="180" height="70" fill="none" stroke="#C9A84C" strokeWidth="1.5" opacity="0.7"/>
    <rect x="360" y="10" width="230" height="110" fill="#C9A84C" opacity="0.08" stroke="#C9A84C" strokeWidth="2"/>
    <rect x="610" y="45" width="280" height="65" fill="none" stroke="#2A5080" strokeWidth="1" opacity="0.8"/>
    <rect x="910" y="25" width="180" height="90" fill="none" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5"/>
    <text x="440" y="65" fill="#C9A84C" fontSize="11" fontFamily="monospace" opacity="0.9">6627 / 142</text>
    <circle cx="475" cy="85" r="6" fill="#C9A84C" opacity="0.9"/>
    <circle cx="475" cy="85" r="12" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.4"/>
  </svg>
)
const BannerInvestisseur = () => (
  <svg viewBox="0 0 1200 160" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
    <rect width="1200" height="160" fill="#0F2235"/>
    <polygon points="0,140 200,120 400,100 600,75 800,50 1000,30 1200,15 1200,160 0,160" fill="#C9A84C" opacity="0.06"/>
    <polyline points="0,140 200,120 400,100 600,75 800,50 1000,30 1200,15" fill="none" stroke="#C9A84C" strokeWidth="2" opacity="0.8"/>
    <line x1="0" y1="40"  x2="1200" y2="40"  stroke="#2A5080" strokeWidth="0.5" opacity="0.4"/>
    <line x1="0" y1="80"  x2="1200" y2="80"  stroke="#2A5080" strokeWidth="0.5" opacity="0.4"/>
    <line x1="0" y1="120" x2="1200" y2="120" stroke="#2A5080" strokeWidth="0.5" opacity="0.4"/>
    <circle cx="400"  cy="100" r="4" fill="#C9A84C" opacity="0.7"/>
    <circle cx="800"  cy="50"  r="4" fill="#C9A84C" opacity="0.7"/>
    <circle cx="1200" cy="15"  r="5" fill="#C9A84C" opacity="0.9"/>
  </svg>
)
const BannerPromoteur = () => (
  <svg viewBox="0 0 1200 160" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
    <rect width="1200" height="160" fill="#1A3A5C"/>
    <rect x="80"  y="30"  width="200" height="100" fill="none" stroke="#C9A84C" strokeWidth="1.5" opacity="0.6"/>
    <rect x="100" y="50"  width="70"  height="60"  fill="none" stroke="#2A5080" strokeWidth="1" opacity="0.8"/>
    <rect x="185" y="50"  width="75"  height="60"  fill="none" stroke="#2A5080" strokeWidth="1" opacity="0.8"/>
    <rect x="320" y="20"  width="280" height="120" fill="none" stroke="#C9A84C" strokeWidth="2" opacity="0.9"/>
    <rect x="340" y="40"  width="80"  height="80"  fill="#C9A84C" opacity="0.08"/>
    <rect x="340" y="40"  width="80"  height="80"  fill="none" stroke="#C9A84C" strokeWidth="1"/>
    <rect x="700" y="60"  width="60"  height="100" fill="#0F2235"/>
    <rect x="770" y="40"  width="80"  height="120" fill="#0F2235"/>
    <rect x="860" y="50"  width="70"  height="110" fill="#0F2235"/>
    <rect x="940" y="30"  width="90"  height="130" fill="#0F2235"/>
    <rect x="770" y="40"  width="80"  height="120" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.7"/>
  </svg>
)
const BannerFiscalite = () => (
  <svg viewBox="0 0 1200 160" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
    <rect width="1200" height="160" fill="#1A3A5C"/>
    <line x1="600" y1="20"  x2="600" y2="140" stroke="#C9A84C" strokeWidth="2" opacity="0.7"/>
    <line x1="400" y1="60"  x2="800" y2="60"  stroke="#C9A84C" strokeWidth="1.5" opacity="0.8"/>
    <circle cx="400" cy="60" r="5" fill="#C9A84C" opacity="0.9"/>
    <circle cx="800" cy="60" r="5" fill="#C9A84C" opacity="0.9"/>
    <rect x="340" y="80" width="120" height="40" rx="4" fill="#2A5080" stroke="#C9A84C" strokeWidth="1" opacity="0.7"/>
    <rect x="740" y="80" width="120" height="40" rx="4" fill="#2A5080" stroke="#C9A84C" strokeWidth="1" opacity="0.7"/>
    <text x="100"  y="100" fill="#C9A84C" fontSize="28" fontFamily="monospace" opacity="0.2">8%</text>
    <text x="250"  y="60"  fill="#C9A84C" fontSize="20" fontFamily="monospace" opacity="0.15">3.5%</text>
    <text x="900"  y="110" fill="#C9A84C" fontSize="24" fontFamily="monospace" opacity="0.2">0%</text>
    <text x="1020" y="70"  fill="#C9A84C" fontSize="18" fontFamily="monospace" opacity="0.15">10%</text>
  </svg>
)

const TAB_BANNERS: Record<Tab, React.ReactNode> = {
  estimation:   <BannerEstimation />,
  urbanisme:    <BannerUrbanisme />,
  investisseur: <BannerInvestisseur />,
  promoteur:    <BannerPromoteur />,
  fiscalite:    <BannerFiscalite />,
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive]           = useState<Tab>('estimation')
  const [exporting, setExporting]     = useState(false)
  const [exportingXls, setExportingXls] = useState(false)
  const [toast, setToast]             = useState<string | null>(null)
  const [showScenarios, setShowScenarios] = useState(false)
  const [scenarios, setScenarios]     = useState<Scenario[]>([])
  const [saveModal, setSaveModal]     = useState(false)
  const [saveName, setSaveName]       = useState('')
  const { lang, setLang, t }          = useLang()

  useEffect(() => {
    if (showScenarios) setScenarios(lireScenarios())
  }, [showScenarios])

  const TABS: { key: Tab; label: string }[] = [
    { key: 'estimation',   label: t.tabs.estimation   },
    { key: 'urbanisme',    label: t.tabs.urbanisme     },
    { key: 'investisseur', label: t.tabs.investisseur  },
    { key: 'promoteur',    label: t.tabs.promoteur     },
    { key: 'fiscalite',    label: t.tabs.fiscalite     },
  ]

  const showToast = useCallback((msg: string) => setToast(msg), [])

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => {
      try { exportPDF(getReportData(), t, lang) }
      finally { setExporting(false) }
    }, 50)
  }

  const handleExportExcel = () => {
    setExportingXls(true)
    setTimeout(() => {
      try {
        const d = getReportData() as Record<string, Record<string, Record<string, unknown>>>
        exporterExcel({
          estimation: d.estimation ? {
            ville:     d.estimation.inputs?.ville     as string,
            quartier:  d.estimation.inputs?.quartier  as string,
            surface:   d.estimation.inputs?.surface   as number,
            prixTotal: d.estimation.result?.prixTotal as number,
            prixM2:    d.estimation.result?.prixM2    as number,
            waterfall: d.estimation.result?.waterfall as { label: string; prixCumul: number }[],
          } : undefined,
          investisseur: d.investisseur ? {
            rendBrut:   d.investisseur.result?.rendBrut   as number,
            rendNet:    d.investisseur.result?.rendNet     as number,
            mensualite: d.investisseur.result?.mensualite as number,
            tri:        d.investisseur.result?.tri         as number,
            cfMensuel:  d.investisseur.result?.cfMensuel  as number,
            prixSortie: d.investisseur.result?.prixSortie as number,
            gainTotal:  d.investisseur.result?.gainTotal  as number,
            projection: d.investisseur.result?.projection as { annee: number; valeur: number; cfCumul: number }[],
          } : undefined,
          promoteur: d.promoteur ? {
            ca:          d.promoteur.result?.ca          as number,
            margeBrute:  d.promoteur.result?.margeBrute  as number,
            margePct:    d.promoteur.result?.margePct    as number,
            coutConst:   d.promoteur.result?.coutConst   as number,
            frais:       d.promoteur.result?.frais       as number,
            commerc:     d.promoteur.result?.commerc     as number,
            portage:     d.promoteur.result?.portage     as number,
            coutTerrain: d.promoteur.inputs?.coutTerrain as number,
            sensitivity: d.promoteur.result?.sensitivity as { variation: number; ca: number; marge: number; pct: number }[],
          } : undefined,
        })
      } finally { setExportingXls(false) }
    }, 50)
  }

  const handleSave = () => {
    if (!saveName.trim()) return
    const d = getReportData() as Record<string, Record<string, Record<string, unknown>>>
    sauvegarderScenario(saveName.trim(), {
      ville:      d.estimation?.inputs?.ville,
      prixEstime: d.estimation?.result?.prixTotal,
      ...getReportData(),
    })
    setSaveModal(false); setSaveName('')
    showToast('Scénario sauvegardé ✓')
  }

  const handleTabKey = useCallback((e: React.KeyboardEvent, idx: number) => {
    const keys = ['estimation','urbanisme','investisseur','promoteur','fiscalite'] as Tab[]
    if (e.key === 'ArrowRight') { e.preventDefault(); setActive(keys[Math.min(idx+1, keys.length-1)]) }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); setActive(keys[Math.max(idx-1, 0)]) }
    if (e.key === 'Home')       { e.preventDefault(); setActive(keys[0]) }
    if (e.key === 'End')        { e.preventDefault(); setActive(keys[keys.length-1]) }
  }, [])

  const activeTab = TABS.find(tb => tb.key === active)!
  const subParts  = t.appSubtitle.split(' · ')
  const bannerSub: Record<Tab, string> = {
    estimation:   subParts[0] ?? '',
    urbanisme:    subParts[1] ?? '',
    investisseur: subParts[2] ?? '',
    promoteur:    subParts[2] ?? '',
    fiscalite:    lang==='fr' ? 'Mas Rechisha · Mas Shevach · Arnona'
                : lang==='en' ? 'Purchase tax · Capital gains · Property tax'
                :               'מס רכישה · מס שבח · ארנונה',
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <MarketBanner />

      {/* Header */}
      <header style={{ background: '#1A3A5C' }} className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Building2 size={22} className="text-gold shrink-0" />
            <div>
              <h1 className="text-lg font-semibold text-white">{t.appTitle}</h1>
              <p className="text-xs text-white/60 hidden sm:block">{t.appSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            <button onClick={() => setSaveModal(true)} title="Sauvegarder ce scénario"
              className="px-2.5 py-1.5 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors">
              💾
            </button>
            <button onClick={() => setShowScenarios(true)} title="Mes scénarios"
              className="px-2.5 py-1.5 rounded-lg text-white/80 hover:bg-white/10 transition-colors">
              <History size={15} />
            </button>
            <button onClick={handleExportExcel} disabled={exportingXls} title="Export Excel"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
              <FileSpreadsheet size={13} />
              {exportingXls ? '…' : 'XLS'}
            </button>
            <button onClick={handleExport} disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
              style={{ background: '#C9A84C', color: '#1A3A5C' }}>
              {exporting ? <><span className="spinner" /> …</> : <><Download size={13} /> PDF</>}
            </button>
            <div className="flex items-center rounded-lg p-0.5" style={{ background: 'rgba(255,255,255,0.12)' }}>
              {LANGS.map(l => (
                <button key={l.key} onClick={() => setLang(l.key)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    lang === l.key ? 'bg-white text-primary' : 'text-white/70 hover:text-white'
                  }`}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="bg-white border-b border-neutral-200 shadow-sm" role="tablist">
        <div className="max-w-5xl mx-auto px-6 flex overflow-x-auto">
          {TABS.map((tab, idx) => (
            <button key={tab.key} role="tab" aria-selected={active === tab.key}
              onClick={() => setActive(tab.key)}
              onKeyDown={e => handleTabKey(e, idx)}
              className={`px-4 py-3 text-sm border-b-2 transition-colors whitespace-nowrap focus:outline-none ${
                active === tab.key ? 'font-semibold text-primary' : 'border-transparent text-neutral-500 hover:text-primary'
              }`}
              style={active === tab.key ? { borderBottomColor: '#C9A84C' } : {}}>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* SVG Banner */}
      <div className="h-36 overflow-hidden relative">
        {TAB_BANNERS[active]}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 h-full flex flex-col justify-center">
          <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">{bannerSub[active]}</p>
          <h2 className="text-white text-2xl font-semibold">{activeTab.label}</h2>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-6" role="tabpanel">
        <div className={active === 'estimation'   ? 'tab-content' : 'hidden'}><EstimationTab /></div>
        <div className={active === 'urbanisme'    ? 'tab-content' : 'hidden'}><UrbanismeTab /></div>
        <div className={active === 'investisseur' ? 'tab-content' : 'hidden'}><InvestisseurTab /></div>
        <div className={active === 'promoteur'    ? 'tab-content' : 'hidden'}><PromoteurTab /></div>
        <div className={active === 'fiscalite'    ? 'tab-content' : 'hidden'}><FiscaliteTab /></div>
      </main>

      <Footer />
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      {/* Save scenario modal */}
      {saveModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-base font-semibold text-primary mb-4">💾 Sauvegarder ce scénario</h3>
            <input type="text" value={saveName} onChange={e => setSaveName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
              placeholder="Ex : Appartement Neve Tzedek 80m²"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm mb-4 focus:outline-none"
              autoFocus />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setSaveModal(false)} className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-800">Annuler</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold rounded-lg text-white" style={{ background: '#1A3A5C' }}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {/* Scenarios panel */}
      {showScenarios && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setShowScenarios(false)} />
          <div className="w-80 bg-white shadow-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-100">
              <h3 className="font-semibold text-primary">Mes scénarios</h3>
              <button onClick={() => setShowScenarios(false)} className="text-neutral-400 hover:text-neutral-700"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {scenarios.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center mt-8">Aucun scénario sauvegardé.<br/>Cliquez sur 💾 pour en créer un.</p>
              ) : scenarios.map(s => (
                <div key={s.id} className="border border-neutral-100 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-neutral-900 truncate">{s.nom}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">{s.date}</div>
                      {s.ville && <div className="text-xs text-primary mt-0.5">📍 {String(s.ville)}</div>}
                      {s.prixEstime && <div className="text-xs font-medium text-success mt-0.5">{((s.prixEstime as number)/1e6).toFixed(2)}M₪</div>}
                    </div>
                    <button onClick={() => { supprimerScenario(s.id); setScenarios(lireScenarios()) }}
                      className="text-neutral-300 hover:text-danger shrink-0 mt-0.5">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
