import React from 'react'
import { TrendingUp } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'

const MARKET_DATA = {
  tauxBOI:     4.50,
  tauxHypo:    5.20,
  indiceCSB:   285.4,
  evol12mois:  +6.2,
  derniereMAJ: '01/06/2025',
}

export const MarketBanner: React.FC = () => {
  const { t, lang } = useLang()
  const m = t.market

  const localeMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', he: 'he-IL' }
  const locale = localeMap[lang] ?? 'fr-FR'

  const marketItems = [
    { label: m.tauxBOI, value: `${MARKET_DATA.tauxBOI}%`, trend: null },
    { label: m.tauxHypo, value: `${MARKET_DATA.tauxHypo}%`, trend: null },
    { label: m.indiceCSB, value: `${MARKET_DATA.indiceCSB}`, trend: `▲ ${MARKET_DATA.evol12mois}% ${m.over12months}` },
  ]

  return (
    <div className="w-full text-[11px]" style={{ background: '#0A1628' }}>
      <div className="max-w-[1280px] mx-auto flex items-center gap-5 overflow-x-auto whitespace-nowrap px-6" style={{ height: 32 }}>
        <span className="flex items-center gap-1.5 shrink-0" style={{ color: '#9CABBF' }}>
          <TrendingUp size={12} />
          <span style={{ color: '#85B7EB' }}>
            {m.date}{' '}
            {new Date().toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </span>
        </span>
        {marketItems.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 shrink-0" style={{ color: '#9CABBF' }}>
            <span>{item.label}</span>
            <span style={{ color: '#C9A84C', fontWeight: 600 }}>{item.value}</span>
            {item.trend && (
              <span style={{ color: '#0F6E56', fontWeight: 500 }}>{item.trend}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
