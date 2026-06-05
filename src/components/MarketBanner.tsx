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

  const items = (
    <>
      <span className="shrink-0" style={{ color: '#4B5563' }}>
        📊 <span style={{ color: '#85B7EB' }}>{m.date} {MARKET_DATA.derniereMAJ}</span>
      </span>
      <span className="shrink-0" style={{ color: '#4B5563' }}>
        {m.tauxBOI} <strong style={{ color: '#C9A84C' }}>{MARKET_DATA.tauxBOI}%</strong>
      </span>
      <span className="shrink-0" style={{ color: '#4B5563' }}>
        {m.tauxHypo} <strong style={{ color: '#C9A84C' }}>{MARKET_DATA.tauxHypo}%</strong>
      </span>
      <span className="shrink-0" style={{ color: '#4B5563' }}>
        {m.indiceCSB} <strong style={{ color: '#C9A84C' }}>{MARKET_DATA.indiceCSB}</strong>
      </span>
      <span className="shrink-0 font-medium" style={{ color: MARKET_DATA.evol12mois > 0 ? '#0F9D6E' : '#f87171' }}>
        {MARKET_DATA.evol12mois > 0 ? '▲' : '▼'} {Math.abs(MARKET_DATA.evol12mois)}% {m.over12months}
      </span>
    </>
  )

  return (
    <div className="overflow-hidden text-[11px]" style={{ background: '#060E1A', padding: '5px 0' }}>
      <div className="ticker-track" aria-hidden="false">
        {/* Two identical sequences placed back-to-back so the -50% loop is seamless */}
        <div className="flex gap-6 items-center" style={{ paddingInlineEnd: 24, paddingInlineStart: 24 }}>{items}</div>
        <div className="flex gap-6 items-center" style={{ paddingInlineEnd: 24 }} aria-hidden="true">{items}</div>
      </div>
    </div>
  )
}
