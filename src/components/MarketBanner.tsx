import React from 'react'
import { useLang } from '../i18n/LanguageContext'

const MARKET_DATA = {
  tauxBOI:     4.50,
  tauxHypo:    5.20,
  indiceCSB:   285.4,
  evol12mois:  +6.2,
  derniereMAJ: '01/06/2025',
}

export const MarketBanner: React.FC = () => {
  const { t } = useLang()
  const m = t.market

  return (
    <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-1.5 flex gap-5 items-center flex-wrap text-xs text-neutral-500 overflow-x-auto">
      <span className="shrink-0">📊 {m.date} {MARKET_DATA.derniereMAJ}</span>
      <span className="shrink-0">
        {m.tauxBOI} <strong className="text-primary">{MARKET_DATA.tauxBOI}%</strong>
      </span>
      <span className="shrink-0">
        {m.tauxHypo} <strong className="text-primary">{MARKET_DATA.tauxHypo}%</strong>
      </span>
      <span className="shrink-0">
        {m.indiceCSB} <strong className="text-primary">{MARKET_DATA.indiceCSB}</strong>
      </span>
      <span className={`shrink-0 font-medium ${MARKET_DATA.evol12mois > 0 ? 'text-success' : 'text-danger'}`}>
        {MARKET_DATA.evol12mois > 0 ? '▲' : '▼'} {Math.abs(MARKET_DATA.evol12mois)}% {m.over12months}
      </span>
    </div>
  )
}
