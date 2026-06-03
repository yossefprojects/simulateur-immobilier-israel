import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'

type Tool = 'estimation' | 'urbanisme' | 'investisseur' | 'promoteur' | 'fiscalite' | 'travaux' | 'agent'

export const HeroSection: React.FC<{ onCTA: () => void }> = ({ onCTA }) => {
  const { t } = useLang()
  const h = t.home
  const isRtl = t.dir === 'rtl'

  const stats = [
    { val: '50 000+', lbl: h.stat1 },
    { val: '10',      lbl: h.stat2 },
    { val: '7',       lbl: h.stat3 },
  ]

  return (
    <div className="relative overflow-hidden rounded-2xl"
      style={{ background: 'linear-gradient(160deg, #0F2235 0%, #1A3A5C 100%)' }}>

      {/* Skyline */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.12 }}>
        <svg width="100%" height="100%" viewBox="0 0 800 140" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
          <rect x="0"   y="60" width="60"  height="80"  fill="white" />
          <rect x="70"  y="30" width="90"  height="110" fill="white" />
          <rect x="170" y="50" width="60"  height="90"  fill="white" />
          <rect x="240" y="15" width="80"  height="125" fill="white" />
          <rect x="330" y="40" width="70"  height="100" fill="white" />
          <rect x="410" y="25" width="100" height="115" fill="white" />
          <rect x="520" y="45" width="65"  height="95"  fill="white" />
          <rect x="595" y="10" width="90"  height="130" fill="white" />
          <rect x="695" y="55" width="105" height="85"  fill="white" />
        </svg>
      </div>

      <div className="relative text-center px-6 py-9 sm:py-11">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4"
          style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}>
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#C9A84C' }}>
            {h.eyebrow}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-white leading-tight mb-3"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 400 }}>
          {h.title1}<br />
          <span style={{ color: '#C9A84C' }}>{h.title2}</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-6 leading-relaxed" style={{ color: '#85B7EB', fontSize: 13, maxWidth: 520 }}>
          {h.subtitle}
          <br />
          <span style={{ fontSize: 11, opacity: 0.7 }}>{h.subtitleNote}</span>
        </p>

        {/* CTA */}
        <button onClick={onCTA}
          className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold mb-7 transition-transform hover:scale-[1.03]"
          style={{ background: '#C9A84C', color: '#0F2235', boxShadow: '0 4px 20px rgba(201,168,76,0.35)' }}>
          {h.cta}
          <ArrowRight size={17} className={isRtl ? 'rotate-180' : ''} />
        </button>

        {/* Stats */}
        <div className="flex justify-center" style={{ gap: 'clamp(20px, 5vw, 48px)' }}>
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-lg font-bold" style={{ color: '#C9A84C' }}>{s.val}</div>
              <div className="mt-0.5" style={{ fontSize: 10, color: '#8aa0b8' }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const QuickAccess: React.FC<{ onNavigate: (tab: Tool) => void }> = ({ onNavigate }) => {
  const { t } = useLang()
  const h = t.home

  const isRtl = t.dir === 'rtl'

  const items: { icon: string; title: string; sub: string; tab: Tool }[] = [
    { icon: '🏢', title: t.tabs.estimation,   sub: h.subEstimation,   tab: 'estimation'   },
    { icon: '📈', title: t.tabs.investisseur, sub: h.subInvestisseur, tab: 'investisseur' },
    { icon: '🏗️', title: t.tabs.promoteur,    sub: h.subPromoteur,    tab: 'promoteur'    },
    { icon: '⚖️', title: t.tabs.fiscalite,    sub: h.subFiscalite,    tab: 'fiscalite'    },
    { icon: '🔨', title: t.tabs.travaux,      sub: h.subTravaux,      tab: 'travaux'      },
    { icon: '🗺️', title: t.tabs.urbanisme,    sub: h.subUrbanisme,    tab: 'urbanisme'    },
  ]

  return (
    <div className="mt-7">
      {/* Agent IA — full-width bar */}
      <button onClick={() => onNavigate('agent')}
        className="w-full flex items-center gap-4 rounded-xl p-4 mb-4 transition-all hover:-translate-y-0.5"
        style={{
          background: 'linear-gradient(135deg, #1A3A5C 0%, #0F2235 100%)',
          border: '1px solid #C9A84C',
          textAlign: isRtl ? 'right' : 'left',
          flexDirection: isRtl ? 'row-reverse' : 'row',
        }}>
        <div className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 42, height: 42, background: 'rgba(201,168,76,0.18)', color: '#C9A84C', fontSize: 20 }}>✦</div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-semibold" style={{ color: '#fff' }}>{t.tabs.agent}</div>
          <div className="text-[12px] leading-snug" style={{ color: '#8aa0b8' }}>{h.subAgent}</div>
        </div>
        <ArrowRight size={18} style={{ color: '#C9A84C' }} className={`shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
      </button>

      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3 text-center">
        {h.chooseTool}
      </p>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        {items.map(item => (
          <button key={item.tab} onClick={() => onNavigate(item.tab)}
            className="group rounded-xl p-3 transition-all hover:-translate-y-0.5"
            style={{
              background: 'white',
              border: '1px solid #E5E7EB',
              textAlign: isRtl ? 'right' : 'left',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB' }}>
            <div className="text-xl mb-1.5">{item.icon}</div>
            <div className="text-[13px] font-semibold mb-0.5" style={{ color: '#1A3A5C' }}>{item.title}</div>
            <div className="text-[11px] leading-snug text-neutral-500">{item.sub}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
