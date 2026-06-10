import { useState, useEffect, useCallback, useRef } from 'react'
import { Download, FileSpreadsheet, History, X, Trash2, Globe, Save, MoreVertical, FileText, Sparkles } from 'lucide-react'
import { EstimationTab }  from './components/EstimationTab'
import { UrbanismeTab }   from './components/UrbanismeTab'
import { InvestisseurTab, PromoteurTab } from './components/FinanceTab'
import { FiscaliteTab }   from './components/FiscaliteTab'
import { TravauxTab }     from './components/TravauxTab'
import { AgentTab }       from './components/AgentTab'
import { MarketBanner }   from './components/MarketBanner'
import { HeroSection, QuickAccess } from './components/HeroSection'
import { useScrollReveal } from './hooks/useScrollReveal'
import { Footer }         from './components/Footer'
import { useLang }        from './i18n/LanguageContext'
import { Lang }           from './i18n/translations'
import { getReportData }  from './store/reportStore'
import { exportPDF }      from './utils/pdfExport'
import { exporterExcel }  from './utils/exportExcel'
import { lireScenarios, supprimerScenario, sauvegarderScenario, Scenario } from './utils/scenarios'

type Tab = 'estimation' | 'urbanisme' | 'investisseur' | 'promoteur' | 'fiscalite' | 'travaux' | 'agent'
type View = Tab | 'home'

// ── Routing (clean per-tab URLs : /estimation, /fiscalite, …) ───────────────────
const TAB_KEYS: Tab[] = ['estimation', 'urbanisme', 'investisseur', 'promoteur', 'fiscalite', 'travaux', 'agent']

function viewToPath(v: View): string {
  return v === 'home' ? '/' : `/${v}`
}

function pathToView(pathname: string): View {
  const slug = pathname.replace(/^\/+|\/+$/g, '').toLowerCase()
  return (TAB_KEYS as string[]).includes(slug) ? (slug as View) : 'home'
}

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
  <svg width="100%" viewBox="0 0 680 120" preserveAspectRatio="xMidYMid slice" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="680" height="120" fill="#0F2235"/>
    <circle cx="60"  cy="18" r="1.2" fill="#ffffff" opacity=".6"/>
    <circle cx="130" cy="10" r="1"   fill="#ffffff" opacity=".5"/>
    <circle cx="220" cy="22" r="1.4" fill="#ffffff" opacity=".7"/>
    <circle cx="370" cy="8"  r="1"   fill="#ffffff" opacity=".4"/>
    <circle cx="490" cy="16" r="1.2" fill="#ffffff" opacity=".6"/>
    <circle cx="580" cy="9"  r="1"   fill="#ffffff" opacity=".5"/>
    <circle cx="640" cy="25" r="1.4" fill="#ffffff" opacity=".7"/>
    <circle cx="620" cy="22" r="14" fill="#E8C96A" opacity=".85"/>
    <rect x="0"   y="70" width="55"  height="50" fill="#112840"/>
    <rect x="60"  y="55" width="80"  height="65" fill="#112840"/>
    <rect x="145" y="65" width="50"  height="55" fill="#112840"/>
    <rect x="200" y="42" width="70"  height="78" fill="#112840"/>
    <rect x="275" y="60" width="60"  height="60" fill="#112840"/>
    <rect x="340" y="48" width="85"  height="72" fill="#112840"/>
    <rect x="430" y="58" width="55"  height="62" fill="#112840"/>
    <rect x="490" y="36" width="90"  height="84" fill="#112840"/>
    <rect x="585" y="62" width="95"  height="58" fill="#112840"/>
    <rect x="10"  y="78" width="40"  height="42" fill="#0F2235"/>
    <rect x="70"  y="60" width="60"  height="60" fill="#0F2235"/>
    <rect x="155" y="72" width="38"  height="48" fill="#0F2235"/>
    <rect x="210" y="50" width="55"  height="70" fill="#0F2235"/>
    <rect x="285" y="66" width="48"  height="54" fill="#0F2235"/>
    <rect x="350" y="30" width="65"  height="90" fill="#0C2040"/>
    <rect x="380" y="20" width="5"   height="12" fill="#C9A84C" opacity=".7"/>
    <rect x="75"  y="68" width="7" height="5" rx=".5" fill="#C9A84C" opacity=".75"/>
    <rect x="88"  y="68" width="7" height="5" rx=".5" fill="#C9A84C" opacity=".5"/>
    <rect x="75"  y="78" width="7" height="5" rx=".5" fill="#C9A84C" opacity=".4"/>
    <rect x="215" y="58" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".8"/>
    <rect x="228" y="58" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".5"/>
    <rect x="215" y="68" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".6"/>
    <rect x="354" y="38" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".9"/>
    <rect x="366" y="38" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".6"/>
    <rect x="378" y="38" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".8"/>
    <rect x="354" y="50" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".5"/>
    <rect x="366" y="50" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".7"/>
    <rect x="378" y="50" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".4"/>
    <rect x="354" y="62" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".8"/>
    <rect x="378" y="62" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".6"/>
    <rect x="495" y="44" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".7"/>
    <rect x="507" y="44" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".5"/>
    <rect x="519" y="44" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".8"/>
    <rect x="495" y="56" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".4"/>
    <rect x="519" y="56" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".6"/>
    <rect x="0" y="112" width="680" height="8" fill="#0C1E30"/>
    <rect x="60"  y="113" width="55" height="4" rx="1" fill="#1A3A5C" opacity=".4"/>
    <rect x="200" y="113" width="70" height="4" rx="1" fill="#1A3A5C" opacity=".3"/>
    <rect x="350" y="113" width="65" height="5" rx="1" fill="#C9A84C" opacity=".15"/>
  </svg>
)
const BannerUrbanisme = () => (
  <svg width="100%" viewBox="0 0 680 120" preserveAspectRatio="xMidYMid slice" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="680" height="120" fill="#0C1E30"/>
    <line x1="0"   y1="30"  x2="680" y2="30"  stroke="#1A3A5C" strokeWidth=".8" opacity=".8"/>
    <line x1="0"   y1="60"  x2="680" y2="60"  stroke="#1A3A5C" strokeWidth=".8" opacity=".8"/>
    <line x1="0"   y1="90"  x2="680" y2="90"  stroke="#1A3A5C" strokeWidth=".8" opacity=".8"/>
    <line x1="80"  y1="0"   x2="80"  y2="120" stroke="#1A3A5C" strokeWidth=".8" opacity=".8"/>
    <line x1="200" y1="0"   x2="200" y2="120" stroke="#1A3A5C" strokeWidth=".8" opacity=".8"/>
    <line x1="340" y1="0"   x2="340" y2="120" stroke="#1A3A5C" strokeWidth=".8" opacity=".8"/>
    <line x1="480" y1="0"   x2="480" y2="120" stroke="#1A3A5C" strokeWidth=".8" opacity=".8"/>
    <line x1="600" y1="0"   x2="600" y2="120" stroke="#1A3A5C" strokeWidth=".8" opacity=".8"/>
    <rect x="90"  y="10" width="100" height="80" fill="#C9A84C" opacity=".06" stroke="#C9A84C" strokeWidth="1.5"/>
    <rect x="210" y="6"  width="120" height="55" fill="none"    stroke="#1A3A5C" strokeWidth="1" opacity=".9"/>
    <rect x="210" y="68" width="120" height="45" fill="none"    stroke="#1A3A5C" strokeWidth=".8" opacity=".6"/>
    <rect x="350" y="8"  width="120" height="104" fill="#C9A84C" opacity=".1" stroke="#C9A84C" strokeWidth="2"/>
    <rect x="490" y="10" width="100" height="45" fill="none"    stroke="#1A3A5C" strokeWidth="1" opacity=".7"/>
    <rect x="490" y="62" width="100" height="50" fill="none"    stroke="#1A3A5C" strokeWidth=".8" opacity=".5"/>
    <text x="128" y="55" fontFamily="monospace" fontSize="9" fill="#C9A84C" opacity=".7" textAnchor="middle">6627 / 142</text>
    <text x="270" y="38" fontFamily="monospace" fontSize="8" fill="#2A5080" opacity=".9" textAnchor="middle">GUSH 5240</text>
    <text x="410" y="56" fontFamily="monospace" fontSize="9" fill="#C9A84C" opacity=".9" textAnchor="middle">6640 / 88</text>
    <circle cx="410" cy="80" r="7" fill="#C9A84C" opacity=".25"/>
    <circle cx="410" cy="80" r="4" fill="#C9A84C" opacity=".6"/>
    <circle cx="410" cy="80" r="2" fill="#C9A84C"/>
    <line x1="0"   y1="60" x2="680" y2="60" stroke="#ffffff" strokeWidth="2.5" opacity=".04"/>
    <line x1="340" y1="0"  x2="340" y2="120" stroke="#ffffff" strokeWidth="2.5" opacity=".04"/>
  </svg>
)
const BannerInvestisseur = () => (
  <svg width="100%" viewBox="0 0 680 120" preserveAspectRatio="xMidYMid slice" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="680" height="120" fill="#0C1E30"/>
    <line x1="60" y1="20"  x2="660" y2="20"  stroke="#1A3A5C" strokeWidth=".5" opacity=".8"/>
    <line x1="60" y1="50"  x2="660" y2="50"  stroke="#1A3A5C" strokeWidth=".5" opacity=".8"/>
    <line x1="60" y1="80"  x2="660" y2="80"  stroke="#1A3A5C" strokeWidth=".5" opacity=".8"/>
    <line x1="60" y1="110" x2="660" y2="110" stroke="#1A3A5C" strokeWidth=".5" opacity=".8"/>
    <line x1="60" y1="10" x2="60" y2="115" stroke="#1A3A5C" strokeWidth=".8" opacity=".9"/>
    <text x="52" y="23"  fontFamily="monospace" fontSize="8" fill="#C9A84C" opacity=".7" textAnchor="end">5M₪</text>
    <text x="52" y="53"  fontFamily="monospace" fontSize="8" fill="#C9A84C" opacity=".7" textAnchor="end">3M₪</text>
    <text x="52" y="83"  fontFamily="monospace" fontSize="8" fill="#C9A84C" opacity=".7" textAnchor="end">2M₪</text>
    <text x="120"  y="116" fontFamily="monospace" fontSize="8" fill="#2A5080" textAnchor="middle">+1</text>
    <text x="240"  y="116" fontFamily="monospace" fontSize="8" fill="#2A5080" textAnchor="middle">+3</text>
    <text x="420"  y="116" fontFamily="monospace" fontSize="8" fill="#2A5080" textAnchor="middle">+6</text>
    <text x="600"  y="116" fontFamily="monospace" fontSize="8" fill="#C9A84C" textAnchor="middle">+10 ans</text>
    <polygon points="60,90 120,86 180,82 240,78 300,72 360,66 420,58 480,50 540,41 600,32 660,24 660,110 60,110" fill="#C9A84C" opacity=".08"/>
    <polyline points="60,90 120,86 180,82 240,78 300,72 360,66 420,58 480,50 540,41 600,32 660,24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="120" cy="86" r="3" fill="#C9A84C"/>
    <circle cx="240" cy="78" r="3" fill="#C9A84C"/>
    <circle cx="420" cy="58" r="3" fill="#C9A84C"/>
    <circle cx="600" cy="32" r="4" fill="#C9A84C"/>
    <polyline points="60,80 120,82 180,84 240,86 300,88 360,90 420,92 480,94 540,96 600,98 660,100" fill="none" stroke="#378ADD" strokeWidth="1.5" strokeDasharray="5,3" strokeLinecap="round" opacity=".7"/>
    <text x="664" y="22" fontFamily="monospace" fontSize="9" fill="#C9A84C" fontWeight="bold">2.82M₪</text>
    <rect x="80" y="12" width="8" height="2" rx="1" fill="#C9A84C"/>
    <text x="92" y="15" fontFamily="monospace" fontSize="8" fill="#C9A84C" opacity=".8">Valeur du bien</text>
    <line x1="180" y1="13" x2="190" y2="13" stroke="#378ADD" strokeWidth="1.5" strokeDasharray="3,2"/>
    <text x="194" y="15" fontFamily="monospace" fontSize="8" fill="#378ADD" opacity=".8">CF cumulé</text>
  </svg>
)
const BannerPromoteur = () => (
  <svg width="100%" viewBox="0 0 680 120" preserveAspectRatio="xMidYMid slice" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="680" height="120" fill="#0A1C2E"/>
    <line x1="80" y1="10" x2="80"  y2="110" stroke="#2A5080" strokeWidth="3"/>
    <line x1="80" y1="18" x2="280" y2="18"  stroke="#2A5080" strokeWidth="2.5"/>
    <line x1="80"  y1="18" x2="100" y2="38" stroke="#2A5080" strokeWidth="1.2" opacity=".6"/>
    <line x1="140" y1="18" x2="160" y2="38" stroke="#2A5080" strokeWidth="1.2" opacity=".6"/>
    <line x1="200" y1="18" x2="220" y2="38" stroke="#2A5080" strokeWidth="1.2" opacity=".6"/>
    <line x1="260" y1="18" x2="280" y2="38" stroke="#2A5080" strokeWidth="1.2" opacity=".6"/>
    <line x1="240" y1="18" x2="240" y2="55" stroke="#C9A84C" strokeWidth="1" opacity=".7"/>
    <rect x="228" y="55" width="24" height="14" rx="2" fill="#C9A84C" opacity=".4"/>
    <rect x="300" y="30" width="180" height="90" fill="none"   stroke="#2A5080" strokeWidth="1.5"/>
    <rect x="300" y="90" width="180" height="30" fill="#112840"/>
    <rect x="300" y="60" width="180" height="30" fill="#0E2035" stroke="#1A3A5C" strokeWidth=".5"/>
    <rect x="300" y="30" width="180" height="30" fill="none"   stroke="#1A3A5C" strokeWidth=".5" opacity=".5"/>
    <line x1="320" y1="30" x2="320" y2="10" stroke="#2A5080" strokeWidth="1.5"/>
    <line x1="350" y1="30" x2="350" y2="8"  stroke="#2A5080" strokeWidth="1.5"/>
    <line x1="380" y1="30" x2="380" y2="10" stroke="#2A5080" strokeWidth="1.5"/>
    <line x1="410" y1="30" x2="410" y2="8"  stroke="#2A5080" strokeWidth="1.5"/>
    <line x1="440" y1="30" x2="440" y2="10" stroke="#2A5080" strokeWidth="1.5"/>
    <line x1="460" y1="30" x2="460" y2="8"  stroke="#2A5080" strokeWidth="1.5"/>
    <line x1="308" y1="12" x2="462" y2="12" stroke="#2A5080" strokeWidth="1.2" opacity=".5"/>
    <rect x="315" y="96" width="18" height="18" rx="1" fill="#1A3A5C" stroke="#2A5080" strokeWidth=".8"/>
    <rect x="345" y="96" width="18" height="18" rx="1" fill="#1A3A5C" stroke="#2A5080" strokeWidth=".8"/>
    <rect x="375" y="96" width="18" height="18" rx="1" fill="#C9A84C" opacity=".3" stroke="#C9A84C" strokeWidth=".8"/>
    <rect x="405" y="96" width="18" height="18" rx="1" fill="#1A3A5C" stroke="#2A5080" strokeWidth=".8"/>
    <rect x="435" y="96" width="18" height="18" rx="1" fill="#1A3A5C" stroke="#2A5080" strokeWidth=".8"/>
    <rect x="315" y="66" width="18" height="18" rx="1" fill="#C9A84C" opacity=".25" stroke="#C9A84C" strokeWidth=".8"/>
    <rect x="345" y="66" width="18" height="18" rx="1" fill="#1A3A5C" stroke="#2A5080" strokeWidth=".8"/>
    <rect x="405" y="66" width="18" height="18" rx="1" fill="#C9A84C" opacity=".25" stroke="#C9A84C" strokeWidth=".8"/>
    <rect x="435" y="66" width="18" height="18" rx="1" fill="#1A3A5C" stroke="#2A5080" strokeWidth=".8"/>
    <rect x="510" y="50" width="60"  height="70" fill="#112840" stroke="#1A3A5C" strokeWidth=".5"/>
    <rect x="580" y="35" width="90"  height="85" fill="#0E2035" stroke="#1A3A5C" strokeWidth=".5"/>
    <rect x="520" y="57" width="8" height="7" rx=".5" fill="#C9A84C" opacity=".5"/>
    <rect x="533" y="57" width="8" height="7" rx=".5" fill="#C9A84C" opacity=".3"/>
    <rect x="590" y="44" width="9" height="7" rx=".5" fill="#C9A84C" opacity=".6"/>
    <rect x="605" y="44" width="9" height="7" rx=".5" fill="#C9A84C" opacity=".4"/>
    <rect x="620" y="44" width="9" height="7" rx=".5" fill="#C9A84C" opacity=".5"/>
    <rect x="0" y="110" width="680" height="10" fill="#081624"/>
  </svg>
)
const BannerFiscalite = () => (
  <svg width="100%" viewBox="0 0 680 120" preserveAspectRatio="xMidYMid slice" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="680" height="120" fill="#0C1E30"/>
    <rect x="60"  y="15" width="120" height="90" rx="4" fill="#112840" stroke="#1A3A5C" strokeWidth="1"/>
    <rect x="60"  y="15" width="120" height="22" rx="4" fill="#1A3A5C"/>
    <rect x="60"  y="29" width="120" height="8"  fill="#1A3A5C"/>
    <text x="120" y="31" fontFamily="monospace" fontSize="9" fill="#C9A84C" textAnchor="middle" fontWeight="bold">מס רכישה</text>
    <rect x="72" y="46" width="60" height="3" rx="1" fill="#2A5080"/>
    <rect x="72" y="53" width="85" height="3" rx="1" fill="#2A5080"/>
    <rect x="72" y="60" width="70" height="3" rx="1" fill="#2A5080"/>
    <rect x="72" y="67" width="90" height="3" rx="1" fill="#2A5080"/>
    <rect x="72" y="74" width="50" height="3" rx="1" fill="#2A5080"/>
    <text x="120" y="98" fontFamily="monospace" fontSize="12" fill="#C9A84C" textAnchor="middle" fontWeight="bold">₪48,000</text>
    <rect x="210" y="25" width="110" height="80" rx="4" fill="#112840" stroke="#1A3A5C" strokeWidth="1"/>
    <rect x="210" y="25" width="110" height="20" rx="4" fill="#163050"/>
    <text x="265" y="39" fontFamily="monospace" fontSize="8" fill="#85B7EB" textAnchor="middle">מס שבח</text>
    <rect x="220" y="52" width="55" height="3" rx="1" fill="#2A5080"/>
    <rect x="220" y="59" width="78" height="3" rx="1" fill="#2A5080"/>
    <rect x="220" y="66" width="65" height="3" rx="1" fill="#2A5080"/>
    <text x="265" y="90" fontFamily="monospace" fontSize="11" fill="#85B7EB" textAnchor="middle" fontWeight="bold">25%</text>
    <rect x="350" y="20" width="115" height="85" rx="4" fill="#112840" stroke="#C9A84C" strokeWidth="1.5"/>
    <rect x="350" y="20" width="115" height="20" rx="4" fill="#1A3050"/>
    <text x="407" y="34" fontFamily="monospace" fontSize="8" fill="#C9A84C" textAnchor="middle">עולה חדש</text>
    <rect x="360" y="47" width="55" height="3" rx="1" fill="#2A5080"/>
    <rect x="360" y="54" width="78" height="3" rx="1" fill="#2A5080"/>
    <rect x="360" y="61" width="45" height="3" rx="1" fill="#2A5080"/>
    <text x="407" y="85" fontFamily="monospace" fontSize="10" fill="#C9A84C" textAnchor="middle" fontWeight="bold">0.5%</text>
    <text x="407" y="97" fontFamily="monospace" fontSize="8" fill="#C9A84C" opacity=".6" textAnchor="middle">réduction olim</text>
    <circle cx="560" cy="60" r="38" fill="#112840" stroke="#C9A84C" strokeWidth="2"/>
    <circle cx="560" cy="60" r="30" fill="none" stroke="#C9A84C" strokeWidth=".8" opacity=".3"/>
    <text x="560" y="68" fontFamily="Georgia,serif" fontSize="28" fill="#C9A84C" textAnchor="middle" fontWeight="bold">₪</text>
    <line x1="560" y1="14"  x2="560" y2="8"   stroke="#C9A84C" strokeWidth="1.5" opacity=".3"/>
    <line x1="560" y1="106" x2="560" y2="112"  stroke="#C9A84C" strokeWidth="1.5" opacity=".3"/>
    <line x1="514" y1="60"  x2="508" y2="60"   stroke="#C9A84C" strokeWidth="1.5" opacity=".3"/>
    <line x1="606" y1="60"  x2="612" y2="60"   stroke="#C9A84C" strokeWidth="1.5" opacity=".3"/>
    <line x1="527" y1="27"  x2="523" y2="23"   stroke="#C9A84C" strokeWidth="1.2" opacity=".2"/>
    <line x1="593" y1="93"  x2="597" y2="97"   stroke="#C9A84C" strokeWidth="1.2" opacity=".2"/>
    <line x1="593" y1="27"  x2="597" y2="23"   stroke="#C9A84C" strokeWidth="1.2" opacity=".2"/>
    <line x1="527" y1="93"  x2="523" y2="97"   stroke="#C9A84C" strokeWidth="1.2" opacity=".2"/>
  </svg>
)

const BannerTravaux = () => (
  <svg width="100%" viewBox="0 0 680 120" preserveAspectRatio="xMidYMid slice" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="680" height="120" fill="#0C1E30"/>
    <rect x="40"  y="30" width="180" height="80" rx="3" fill="#112840" stroke="#2A5080" strokeWidth="1"/>
    <rect x="40"  y="30" width="180" height="18" rx="3" fill="#1A3A5C"/>
    <text x="130" y="44" fontFamily="monospace" fontSize="9" fill="#C9A84C" textAnchor="middle" fontWeight="bold">DEVIS KABLAN</text>
    <rect x="52" y="58" width="50" height="2.5" rx="1" fill="#2A5080"/>
    <rect x="52" y="64" width="80" height="2.5" rx="1" fill="#2A5080"/>
    <rect x="52" y="70" width="65" height="2.5" rx="1" fill="#2A5080"/>
    <rect x="52" y="76" width="90" height="2.5" rx="1" fill="#2A5080"/>
    <rect x="52" y="82" width="55" height="2.5" rx="1" fill="#2A5080"/>
    <text x="130" y="102" fontFamily="monospace" fontSize="11" fill="#C9A84C" textAnchor="middle" fontWeight="bold">₪ 320,000</text>
    <line x1="240" y1="25" x2="240" y2="115" stroke="#1A3A5C" strokeWidth="1.5" strokeDasharray="4,3" opacity=".6"/>
    <line x1="255" y1="25" x2="255" y2="115" stroke="#1A3A5C" strokeWidth="1.5" strokeDasharray="4,3" opacity=".4"/>
    <rect x="270" y="20" width="6" height="90" fill="#C9A84C" opacity=".7"/>
    <rect x="280" y="35" width="6" height="75" fill="#C9A84C" opacity=".5"/>
    <rect x="290" y="25" width="6" height="85" fill="#2A5080" opacity=".8"/>
    <rect x="300" y="45" width="6" height="65" fill="#C9A84C" opacity=".6"/>
    <rect x="310" y="30" width="6" height="80" fill="#2A5080" opacity=".7"/>
    <rect x="320" y="55" width="6" height="55" fill="#C9A84C" opacity=".4"/>
    <rect x="330" y="40" width="6" height="70" fill="#C9A84C" opacity=".8"/>
    <text x="300" y="115" fontFamily="monospace" fontSize="7" fill="#C9A84C" opacity=".6" textAnchor="middle">postes</text>
    <rect x="360" y="15" width="280" height="90" rx="4" fill="none" stroke="#1A3A5C" strokeWidth=".8" opacity=".5"/>
    <text x="370" y="30" fontFamily="monospace" fontSize="8" fill="#C9A84C" opacity=".8">🍳 Cuisine</text>
    <rect x="430" y="22" width="80" height="5" rx="2" fill="#C9A84C" opacity=".25"/>
    <rect x="430" y="22" width="64" height="5" rx="2" fill="#C9A84C" opacity=".6"/>
    <text x="516" y="28" fontFamily="monospace" fontSize="7" fill="#C9A84C">20%</text>
    <text x="370" y="45" fontFamily="monospace" fontSize="8" fill="#85B7EB" opacity=".8">🚿 SDB</text>
    <rect x="430" y="37" width="80" height="5" rx="2" fill="#85B7EB" opacity=".2"/>
    <rect x="430" y="37" width="48" height="5" rx="2" fill="#85B7EB" opacity=".5"/>
    <text x="516" y="43" fontFamily="monospace" fontSize="7" fill="#85B7EB">15%</text>
    <text x="370" y="60" fontFamily="monospace" fontSize="8" fill="#C9A84C" opacity=".8">🪵 Revêtements</text>
    <rect x="430" y="52" width="80" height="5" rx="2" fill="#C9A84C" opacity=".2"/>
    <rect x="430" y="52" width="58" height="5" rx="2" fill="#C9A84C" opacity=".5"/>
    <text x="516" y="58" fontFamily="monospace" fontSize="7" fill="#C9A84C">18%</text>
    <text x="370" y="75" fontFamily="monospace" fontSize="8" fill="#85B7EB" opacity=".8">⚡ Électricité</text>
    <rect x="430" y="67" width="80" height="5" rx="2" fill="#85B7EB" opacity=".2"/>
    <rect x="430" y="67" width="38" height="5" rx="2" fill="#85B7EB" opacity=".4"/>
    <text x="516" y="73" fontFamily="monospace" fontSize="7" fill="#85B7EB">12%</text>
    <text x="370" y="90" fontFamily="monospace" fontSize="8" fill="#C9A84C" opacity=".5">🔧 🚪 🖌️ ...</text>
    <rect x="0" y="110" width="680" height="10" fill="#081624"/>
  </svg>
)

const BannerAgent = () => (
  <svg width="100%" viewBox="0 0 680 120" preserveAspectRatio="xMidYMid slice" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="680" height="120" fill="#0A1A2E"/>
    <circle cx="340" cy="60" r="52" fill="none" stroke="#1A3A5C" strokeWidth="1" opacity=".6"/>
    <circle cx="340" cy="60" r="38" fill="none" stroke="#1A3A5C" strokeWidth=".7" opacity=".4"/>
    <circle cx="340" cy="60" r="22" fill="#112840" stroke="#C9A84C" strokeWidth="1.5" opacity=".8"/>
    <text x="340" y="65" fontFamily="monospace" fontSize="16" fill="#C9A84C" textAnchor="middle" fontWeight="bold">AI</text>
    <line x1="340" y1="8" x2="340" y2="22" stroke="#C9A84C" strokeWidth="1.5" opacity=".6"/>
    <line x1="340" y1="98" x2="340" y2="112" stroke="#C9A84C" strokeWidth="1.5" opacity=".6"/>
    <line x1="280" y1="60" x2="294" y2="60" stroke="#C9A84C" strokeWidth="1.5" opacity=".6"/>
    <line x1="386" y1="60" x2="400" y2="60" stroke="#C9A84C" strokeWidth="1.5" opacity=".6"/>
    <circle cx="80"  cy="30" r="10" fill="#112840" stroke="#C9A84C" strokeWidth="1" opacity=".7"/>
    <text x="80" y="34" fontFamily="monospace" fontSize="7" fill="#C9A84C" textAnchor="middle">ROI</text>
    <line x1="90" y1="33" x2="200" y2="52" stroke="#C9A84C" strokeWidth=".8" strokeDasharray="3,3" opacity=".4"/>
    <circle cx="200" cy="52" r="6" fill="#C9A84C" opacity=".4"/>
    <rect x="420" cy="45" y="40" width="70" height="20" rx="3" fill="#112840" stroke="#1A3A5C" strokeWidth="1"/>
    <text x="455" y="54" fontFamily="monospace" fontSize="7" fill="#85B7EB" textAnchor="middle">SCORE 78/100</text>
    <line x1="420" y1="50" x2="386" y2="57" stroke="#85B7EB" strokeWidth=".8" strokeDasharray="3,3" opacity=".4"/>
    <rect x="480" y="65" width="90" height="30" rx="3" fill="#0E2035" stroke="#C9A84C" strokeWidth="1" opacity=".7"/>
    <rect x="485" y="69" width="40" height="5" rx="2" fill="#2A5080"/>
    <rect x="485" y="77" width="60" height="5" rx="2" fill="#2A5080"/>
    <rect x="485" y="85" width="30" height="5" rx="2" fill="#C9A84C" opacity=".5"/>
    <rect x="50" y="68" width="100" height="28" rx="3" fill="#0E2035" stroke="#1A3A5C" strokeWidth="1" opacity=".6"/>
    <text x="100" y="82" fontFamily="monospace" fontSize="7" fill="#C9A84C" textAnchor="middle">מס רכישה</text>
    <text x="100" y="92" fontFamily="monospace" fontSize="8" fill="#C9A84C" textAnchor="middle" fontWeight="bold">₪240,000</text>
    <circle cx="600" cy="35" r="14" fill="#1A3050" stroke="#C9A84C" strokeWidth="1" opacity=".8"/>
    <text x="600" y="39" fontFamily="monospace" fontSize="8" fill="#C9A84C" textAnchor="middle" fontWeight="bold">PE</text>
    <polyline points="50,100 130,95 210,90 290,85 370,78 450,70 530,60 610,48" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
    <rect x="0" y="110" width="680" height="10" fill="#081624"/>
  </svg>
)

const TAB_BANNERS: Record<Tab, React.ReactNode> = {
  estimation:   <BannerEstimation />,
  urbanisme:    <BannerUrbanisme />,
  investisseur: <BannerInvestisseur />,
  promoteur:    <BannerPromoteur />,
  fiscalite:    <BannerFiscalite />,
  travaux:      <BannerTravaux />,
  agent:        <BannerAgent />,
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive]           = useState<View>(() => pathToView(window.location.pathname))
  const [exporting, setExporting]     = useState(false)
  const [exportingXls, setExportingXls] = useState(false)
  const [toast, setToast]             = useState<string | null>(null)
  const [showScenarios, setShowScenarios] = useState(false)
  const [scenarios, setScenarios]     = useState<Scenario[]>([])
  const [saveModal, setSaveModal]     = useState(false)
  const [saveName, setSaveName]       = useState('')
  const [menuOpen, setMenuOpen]       = useState(false)
  const [langOpen, setLangOpen]       = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const { lang, setLang, t }          = useLang()

  // Reveal au scroll (page d'accueil)
  useScrollReveal([active, lang])

  // Effet glassmorphism sur le header au scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (showScenarios) setScenarios(lireScenarios())
  }, [showScenarios])

  // Synchronise l'URL avec l'onglet actif (URL propre par onglet)
  const routerReady = useRef(false)
  useEffect(() => {
    const target  = viewToPath(active)
    const current = window.location.pathname
    if (!routerReady.current) {
      // 1er rendu : canonicalise l'URL sans créer d'entrée d'historique,
      // en conservant search (ex. ?prompt= lu par AgentTab) et hash.
      routerReady.current = true
      if (current !== target) {
        window.history.replaceState(null, '', target + window.location.search + window.location.hash)
      }
      return
    }
    // Navigation utilisateur entre onglets : nouvelle entrée d'historique.
    if (current !== target) {
      window.history.pushState(null, '', target + window.location.hash)
    }
    window.scrollTo({ top: 0 })
  }, [active])

  // Navigation navigateur (boutons précédent / suivant)
  useEffect(() => {
    const onPop = () => setActive(pathToView(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const TABS: { key: Tab; label: string }[] = [
    { key: 'estimation',   label: t.tabs.estimation   },
    { key: 'urbanisme',    label: t.tabs.urbanisme     },
    { key: 'investisseur', label: t.tabs.investisseur  },
    { key: 'promoteur',    label: t.tabs.promoteur     },
    { key: 'fiscalite',    label: t.tabs.fiscalite     },
    { key: 'travaux',      label: t.tabs.travaux       },
    { key: 'agent',        label: t.tabs.agent         },
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
            ville:     d.estimation.inputs?.ville      as string,
            quartier:  d.estimation.inputs?.quartier   as string,
            surface:   d.estimation.inputs?.surface    as number,
            prixBase:  (d.estimation.result?.waterfall as { prixCumul: number }[] | undefined)?.[0]?.prixCumul ?? 0,
            coefTotal: d.estimation.result?.coefTotal  as number,
            waterfall: d.estimation.result?.waterfall  as { label: string; coef: number; prixCumul: number }[],
          } : undefined,
          investisseur: d.investisseur ? {
            prix:    d.investisseur.inputs?.prix    as number,
            apport:  d.investisseur.inputs?.apport  as number,
            taux:    d.investisseur.inputs?.taux    as number,
            duree:   d.investisseur.inputs?.duree   as number,
            loyer:   d.investisseur.inputs?.loyer   as number,
            vacance: d.investisseur.inputs?.vacance as number,
            charges: d.investisseur.inputs?.charges as number,
            reval:   d.investisseur.inputs?.reval   as number,
            horizon: d.investisseur.inputs?.horizon as number,
          } : undefined,
          promoteur: d.promoteur ? {
            surfTerrain: d.promoteur.inputs?.surfTerrain as number,
            cos:         d.promoteur.inputs?.cos         as number,
            ratioVend:   d.promoteur.inputs?.ratioVend   as number,
            prixVente:   d.promoteur.inputs?.prixVente   as number,
            coutTerrain: d.promoteur.inputs?.coutTerrain as number,
            coutConst:   d.promoteur.inputs?.coutConst   as number,
            tauxFrais:   d.promoteur.inputs?.tauxFrais   as number,
            tauxCommerc: d.promoteur.inputs?.tauxCommerc as number,
            tauxPortage: d.promoteur.inputs?.tauxPortage as number,
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
    const keys = ['estimation','urbanisme','investisseur','promoteur','fiscalite','travaux','agent'] as Tab[]
    if (e.key === 'ArrowRight') { e.preventDefault(); setActive(keys[Math.min(idx+1, keys.length-1)]) }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); setActive(keys[Math.max(idx-1, 0)]) }
    if (e.key === 'Home')       { e.preventDefault(); setActive(keys[0]) }
    if (e.key === 'End')        { e.preventDefault(); setActive(keys[keys.length-1]) }
  }, [])

  const activeTab = TABS.find(tb => tb.key === active)

  // Titre d'onglet propre (favoris / partage)
  useEffect(() => {
    const base = 'NadlanConnect Simulator'
    document.title = active === 'home' ? base : `${activeTab?.label ?? ''} — ${base}`
  }, [active, activeTab])

  const subParts  = t.appSubtitle.split(' · ')
  const bannerSub: Record<Tab, string> = {
    estimation:   subParts[0] ?? '',
    urbanisme:    subParts[1] ?? '',
    investisseur: subParts[2] ?? '',
    promoteur:    subParts[2] ?? '',
    fiscalite:    lang==='fr' ? 'Mas Rechisha · Mas Shevach · Arnona'
                : lang==='en' ? 'Purchase tax · Capital gains · Property tax'
                :               'מס רכישה · מס שבח · ארנונה',
    travaux:      lang==='fr' ? 'AllBatim · Deal Estate · Kablay · Marshanski 2025–2026'
                : lang==='en' ? 'AllBatim · Deal Estate · Kablay · Marshanski 2025–2026'
                :               'AllBatim · Deal Estate · Kablay · Marshanski 2025–2026',
    agent:        lang==='fr' ? 'Private Equity · Scoring investissement · Rapport complet'
                : lang==='en' ? 'Private Equity · Investment Scoring · Full Report'
                :               'Private Equity · ניקוד השקעה · דוח מלא',
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <MarketBanner />

      {/* Header — dark navy glassmorphism (ISR style) */}
      <header
        className="px-6 sticky top-0 z-30"
        style={{
          background: scrolled ? 'rgba(10,22,40,0.80)' : '#0A1628',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          boxShadow: scrolled ? '0 6px 24px rgba(0,0,0,0.15)' : 'none',
          paddingTop: scrolled ? 10 : 16,
          paddingBottom: scrolled ? 10 : 16,
          transition: 'background 0.3s, padding 0.3s, box-shadow 0.3s',
        }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <button onClick={() => setActive('home')} className="flex items-center gap-3 text-start group" title={t.appTitle}>
            <div className="shrink-0 h-8 w-8 rounded overflow-hidden">
              <img src="/logo.png" alt="NadlanConnect" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div>
              <h1 className="text-xl font-serif leading-tight text-white">
                Nadlan<span style={{ color: '#C9A84C' }}>Connect</span>
              </h1>
              <p className="text-[11px] uppercase tracking-[0.18em] hidden sm:block" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.appSubtitle}</p>
            </div>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            {/* Analyser un PDF — NadlanConnect platform */}
            <a
              href="https://nadlanconnect.com"
              target="_blank"
              rel="noopener noreferrer"
              title={t.platformOpen}
              aria-label={`NadlanConnect — ${t.analyzePdf}`}
              style={{
                background: 'transparent',
                color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 9999,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#FFFFFF' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            >
              <FileText size={15} />
              <span className="hidden sm:inline">{t.analyzePdf}</span>
            </a>

            {/* Simulateur IA — AI Agent tab */}
            <button
              onClick={() => setActive('agent')}
              title={t.simulatorIA}
              aria-label={t.simulatorIA}
              style={{
                background: '#C9A84C',
                color: '#0A1628',
                border: 'none',
                borderRadius: 9999,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(201,168,76,0.3)',
                transition: 'background 0.2s, box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E8C96A'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,168,76,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(201,168,76,0.3)' }}
            >
              <Sparkles size={15} />
              <span className="hidden sm:inline">{t.simulatorIA}</span>
            </button>

            {/* Language selector */}
            <div className="relative">
              <button onClick={() => setLangOpen(o => !o)} title={t.langTitle} aria-label={t.langTitle}
                aria-haspopup="menu" aria-expanded={langOpen}
                className="flex items-center gap-1 px-2 py-1.5 rounded-full transition-colors"
                style={{ color: 'rgba(255,255,255,0.6)' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'transparent' }}>
                <Globe size={16} />
                <span className="text-xs font-medium">{LANGS.find(l => l.key === lang)?.label}</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute end-0 mt-2 w-32 rounded-xl shadow-xl py-1.5 z-50" style={{ background: '#0A1628', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {LANGS.map(l => (
                      <button key={l.key} onClick={() => { setLang(l.key); setLangOpen(false) }}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm transition-colors"
                        style={{ color: lang === l.key ? '#C9A84C' : 'rgba(255,255,255,0.7)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                        {l.label}
                        {lang === l.key && <span style={{ color: '#C9A84C' }}>✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Kebab menu */}
            <div className="relative">
              <button onClick={() => setMenuOpen(o => !o)} title={t.menuLabel} aria-label={t.menuLabel}
                aria-haspopup="menu" aria-expanded={menuOpen}
                className="ml-1 p-1.5 rounded-full transition-colors"
                style={{ color: 'rgba(255,255,255,0.6)' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'transparent' }}>
                <MoreVertical size={18} />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute end-0 mt-2 w-52 rounded-xl shadow-xl py-1.5 z-50" style={{ background: '#0A1628', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <button onClick={() => { setMenuOpen(false); setSaveModal(true) }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                      <Save size={15} style={{ color: 'rgba(255,255,255,0.4)' }} /> {t.saveBtn}
                    </button>
                    <button onClick={() => { setMenuOpen(false); setShowScenarios(true) }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                      <History size={15} style={{ color: 'rgba(255,255,255,0.4)' }} /> {t.scenariosBtn}
                    </button>
                    <div className="my-1" style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />
                    <button onClick={() => { setMenuOpen(false); handleExportExcel() }} disabled={exportingXls}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors disabled:opacity-50"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                      <FileSpreadsheet size={15} style={{ color: 'rgba(255,255,255,0.4)' }} /> {exportingXls ? '…' : t.exportXls}
                    </button>
                    <button onClick={() => { setMenuOpen(false); handleExport() }} disabled={exporting}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                      style={{ color: '#C9A84C' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                      <Download size={15} /> {exporting ? '…' : t.exportPdf}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tab nav — dark to match header */}
      <nav className="border-b shadow-sm" role="tablist" style={{ background: '#0F1E30', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-5xl mx-auto px-6 flex overflow-x-auto">
          {TABS.map((tab, idx) => {
            const isAgent  = tab.key === 'agent'
            const isActive = active === tab.key
            return (
              <button key={tab.key} role="tab" aria-selected={isActive}
                onClick={() => setActive(tab.key)}
                onKeyDown={e => handleTabKey(e, idx)}
                className={`px-4 py-3 text-sm border-b-2 transition-all whitespace-nowrap focus:outline-none ${
                  isActive
                    ? 'font-semibold'
                    : 'border-transparent'
                } ${isAgent && !isActive ? 'font-semibold' : ''}`}
                style={
                  isAgent
                    ? isActive
                      ? { borderBottomColor: 'transparent', color: '#0D1B3E', background: '#C9A84C', borderRadius: 6, fontWeight: 500 }
                      : { borderBottomColor: '#e8c96a', color: '#C9A84C', background: 'rgba(201,168,76,0.1)', borderBottomWidth: 2 }
                    : isActive
                      ? { borderBottomColor: '#C9A84C', color: '#FFFFFF' }
                      : { color: 'rgba(255,255,255,0.5)' }
                }>
                {isAgent
                  ? <span className="flex items-center gap-1.5">
                      <span style={{ fontSize: 13 }}>✦</span>
                      {tab.label}
                    </span>
                  : tab.label
                }
              </button>
            )
          })}
        </div>
      </nav>

      {/* SVG Banner (tool views only — AI Agent has its own compact header) */}
      {active !== 'home' && active !== 'agent' && (
        <div className="h-24 sm:h-32 md:h-36 lg:h-40 overflow-hidden relative">
          {TAB_BANNERS[active as Tab]}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="relative max-w-5xl mx-auto px-6 h-full flex flex-col justify-center">
            <p className="text-white/60 text-[10px] sm:text-xs font-medium uppercase tracking-widest mb-0.5 sm:mb-1">{bannerSub[active as Tab]}</p>
            <h2 className="text-white text-lg sm:text-2xl font-semibold">{activeTab?.label}</h2>
          </div>
        </div>
      )}

      {/* Home landing — pleine largeur, animée */}
      {active === 'home' && (
        <main>
          <HeroSection onCTA={() => setActive('estimation')} />
          <QuickAccess onNavigate={setActive} />
        </main>
      )}

      {/* Tool content (kept mounted to preserve state) */}
      <main className={active === 'home' ? 'hidden' : 'max-w-5xl mx-auto px-6 pt-5 pb-6'} role="tabpanel">
        <div className={active === 'estimation'   ? 'tab-content' : 'hidden'}><EstimationTab /></div>
        <div className={active === 'urbanisme'    ? 'tab-content' : 'hidden'}><UrbanismeTab /></div>
        <div className={active === 'investisseur' ? 'tab-content' : 'hidden'}><InvestisseurTab /></div>
        <div className={active === 'promoteur'    ? 'tab-content' : 'hidden'}><PromoteurTab /></div>
        <div className={active === 'fiscalite'    ? 'tab-content' : 'hidden'}><FiscaliteTab /></div>
        <div className={active === 'travaux'      ? 'tab-content' : 'hidden'}><TravauxTab /></div>
        <div className={active === 'agent'        ? 'tab-content' : 'hidden'}><AgentTab /></div>
      </main>

      <Footer onNavigate={setActive} />
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
