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

  const dateStr = new Date().toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div className="w-full overflow-hidden text-[11px]" style={{ background: '#0E1B2A' }}>
      <div className="ticker-track">
        {[0, 1, 2, 3].map((copy) => (
          <div
            key={copy}
            className="flex items-center gap-5 shrink-0 px-2.5"
            style={{ height: 32 }}
            aria-hidden={copy !== 0}
          >
            <span className="flex items-center gap-1.5" style={{ color: '#9CABBF' }}>
              <TrendingUp size={12} />
              <span style={{ color: '#85B7EB' }}>
                {m.date}{' '}{dateStr}
              </span>
            </span>
            {marketItems.map((item) => (
              <span key={item.label} className="flex items-center gap-1.5" style={{ color: '#9CABBF' }}>
                <span>{item.label}</span>
                <span style={{ color: '#0F7B6C', fontWeight: 600 }}>{item.value}</span>
                {item.trend && (
                  <span style={{ color: '#0F6E56', fontWeight: 500 }}>{item.trend}</span>
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
