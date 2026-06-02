import React from 'react'

const MARKET_DATA = {
  tauxBOI:     4.50,
  tauxHypo:    5.20,
  indiceCSB:   285.4,
  evol12mois:  +6.2,
  derniereMAJ: '01/06/2025',
}

export const MarketBanner: React.FC = () => (
  <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-1.5 flex gap-5 items-center flex-wrap text-xs text-neutral-500 overflow-x-auto">
    <span className="shrink-0">📊 Marché au {MARKET_DATA.derniereMAJ}</span>
    <span className="shrink-0">
      Taux BOI : <strong className="text-primary">{MARKET_DATA.tauxBOI}%</strong>
    </span>
    <span className="shrink-0">
      Taux hypothécaire moyen : <strong className="text-primary">{MARKET_DATA.tauxHypo}%</strong>
    </span>
    <span className="shrink-0">
      Indice CBS : <strong className="text-primary">{MARKET_DATA.indiceCSB}</strong>
    </span>
    <span className={`shrink-0 font-medium ${MARKET_DATA.evol12mois > 0 ? 'text-success' : 'text-danger'}`}>
      {MARKET_DATA.evol12mois > 0 ? '▲' : '▼'} {Math.abs(MARKET_DATA.evol12mois)}% / 12 mois
    </span>
  </div>
)
