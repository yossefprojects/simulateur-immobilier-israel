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
    <div className="border-b border-neutral-200 px-6 py-1 flex gap-4 items-center whitespace-nowrap text-[11px] text-neutral-500 overflow-x-auto" style={{ background: '#0F2235', color: '#9aa6b4' }}>
      <span className="shrink-0">📊 {m.date} {MARKET_DATA.derniereMAJ}</span>
      <span className="shrink-0">
        {m.tauxBOI} <strong style={{ color: '#C9A84C' }}>{MARKET_DATA.tauxBOI}%</strong>
      </span>
      <span className="shrink-0">
        {m.tauxHypo} <strong style={{ color: '#C9A84C' }}>{MARKET_DATA.tauxHypo}%</strong>
      </span>
      <span className="shrink-0">
        {m.indiceCSB} <strong style={{ color: '#C9A84C' }}>{MARKET_DATA.indiceCSB}</strong>
      </span>
      <span className="shrink-0 font-medium" style={{ color: MARKET_DATA.evol12mois > 0 ? '#4ade80' : '#f87171' }}>
        {MARKET_DATA.evol12mois > 0 ? '▲' : '▼'} {Math.abs(MARKET_DATA.evol12mois)}% {m.over12months}
      </span>
    </div>
  )
}
