import React, { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'

type Tool = 'estimation' | 'urbanisme' | 'investisseur' | 'promoteur' | 'fiscalite' | 'travaux' | 'agent'

// ── HERO ────────────────────────────────────────────────────────────────────
export const HeroSection: React.FC<{ onCTA: () => void }> = ({ onCTA }) => {
  const { t } = useLang()
  const h = t.home
  const isRtl = t.dir === 'rtl'

  const stats = [
    { val: '50 000+', lbl: h.stat1 },
    { val: '12',      lbl: h.stat2 },
    { val: '7',       lbl: h.stat3 },
  ]

  // Particules dorées — positions figées (ne se régénèrent pas au re-render)
  const particles = useMemo(
    () => Array.from({ length: 26 }).map(() => ({
      size:  1.5 + Math.random() * 2.5,
      left:  Math.random() * 100,
      top:   Math.random() * 100,
      delay: Math.random() * 5,
      dur:   4 + Math.random() * 6,
      op:    0.15 + Math.random() * 0.45,
    })),
    []
  )

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: 'min(88vh, 760px)' }}
    >
      {/* Photo de fond — Tel Aviv, effet Ken Burns (mouvement lent) */}
      <img
        src="/hero-telaviv.jpg"
        alt=""
        aria-hidden="true"
        className="kenburns-img absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />

      {/* Overlay dégradé navy */}
      <div className="absolute inset-0" style={{
        zIndex: 1,
        background: `linear-gradient(to bottom,
          rgba(10,22,40,0.62) 0%,
          rgba(12,30,48,0.74) 45%,
          rgba(10,22,40,0.92) 100%)`,
      }} />
      {/* Vignette latérale subtile */}
      <div className="absolute inset-0" style={{
        zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(8,16,28,0.55) 100%)',
      }} />

      {/* Particules dorées flottantes */}
      {particles.map((p, i) => (
        <div key={i} className="absolute rounded-full" style={{
          zIndex: 2,
          width: p.size, height: p.size,
          left: `${p.left}%`, top: `${p.top}%`,
          background: '#37B3A1',
          opacity: p.op,
          animation: `floatParticle ${p.dur}s ease-in-out ${p.delay}s infinite`,
        }} />
      ))}

      {/* Contenu */}
      <div className="relative text-center px-6 py-16" style={{ zIndex: 3, maxWidth: 820 }}>
        {/* Badge */}
        <div className="anim-fade-down inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
          style={{ background: 'rgba(55,179,161,0.12)', border: '1px solid rgba(55,179,161,0.35)' }}>
          <span className="rounded-full" style={{
            width: 6, height: 6, background: '#37B3A1',
            animation: 'pulseDot 2s ease-in-out infinite',
          }} />
          <span className="text-[11px] font-bold uppercase" style={{ color: '#37B3A1', letterSpacing: '0.12em' }}>
            {h.eyebrow}
          </span>
        </div>

        {/* Titre */}
        <h1 className="anim-fade-up text-white mb-5"
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(38px, 7vw, 68px)',
            fontWeight: 400, lineHeight: 1.08,
            animationDelay: '0.1s',
            textShadow: '0 2px 30px rgba(0,0,0,0.35)',
          }}>
          {h.title1}<br />
          <span className="shimmer-gold">{h.title2}</span>
        </h1>

        {/* Sous-titre */}
        <p className="anim-fade-up mx-auto mb-2" style={{
          color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(13px, 2vw, 16px)',
          lineHeight: 1.7, maxWidth: 560, animationDelay: '0.25s',
        }}>
          {h.subtitle}
        </p>
        <p className="anim-fade-up mx-auto mb-9" style={{
          color: 'rgba(255,255,255,0.42)', fontSize: 12, letterSpacing: '0.03em',
          animationDelay: '0.35s',
        }}>
          {h.subtitleNote}
        </p>

        {/* CTA */}
        <div className="anim-fade-up flex flex-wrap items-center justify-center gap-3.5 mb-14"
          style={{ animationDelay: '0.5s' }}>
          <button onClick={onCTA}
            className="inline-flex items-center gap-2 rounded-full px-9 py-3.5 text-[15px] font-bold transition-all hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #0F7B6C, #37B3A1)',
              color: '#fff', border: 'none',
              boxShadow: '0 8px 32px rgba(55,179,161,0.45)',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 14px 42px rgba(55,179,161,0.6)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(55,179,161,0.45)' }}>
            {h.cta}
            <ArrowRight size={17} className={isRtl ? 'rotate-180' : ''} />
          </button>
        </div>

        {/* Stats */}
        <div className="anim-fade-up flex justify-center" style={{ gap: 'clamp(28px, 6vw, 56px)', animationDelay: '0.65s' }}>
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(24px, 4vw, 32px)', color: '#37B3A1', lineHeight: 1 }}>
                {s.val}
              </div>
              <div className="mt-1.5" style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em' }}>
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div className="absolute flex flex-col items-center gap-1.5" style={{
        zIndex: 3, bottom: 26, left: '50%', transform: 'translateX(-50%)',
        animation: 'bounceScroll 2.4s ease-in-out infinite',
      }}>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
          {h.eyebrow.length ? '↓' : ''}
        </span>
        <div style={{ width: 1, height: 34, background: 'linear-gradient(to bottom, rgba(55,179,161,0.6), transparent)' }} />
      </div>
    </section>
  )
}

// ── GRILLE D'OUTILS ──────────────────────────────────────────────────────────
const TOOL_COLORS: Record<Tool, string> = {
  estimation:   '#0E1B2A',
  investisseur: '#0F6E56',
  promoteur:    '#0F7B6C',
  fiscalite:    '#7F77DD',
  travaux:      '#E2761A',
  urbanisme:    '#1C3049',
  agent:        '#0F7B6C',
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
    <section style={{ background: '#F7F5F0', padding: '72px 0 88px' }}>
      <div className="max-w-5xl mx-auto px-6">

        {/* Agent IA — bandeau pleine largeur avec photo */}
        <button onClick={() => onNavigate('agent')}
          className="reveal group relative w-full overflow-hidden flex items-center gap-4 rounded-2xl p-5 mb-10 transition-all hover:-translate-y-1"
          style={{ border: '1px solid #37B3A1', textAlign: isRtl ? 'right' : 'left', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          {/* Photo de fond */}
          <img src="/residential.jpg" alt="" aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ zIndex: 0 }} />
          <div className="absolute inset-0" style={{
            zIndex: 1,
            background: isRtl
              ? 'linear-gradient(to left, rgba(15,34,53,0.97) 30%, rgba(15,34,53,0.78) 100%)'
              : 'linear-gradient(to right, rgba(15,34,53,0.97) 30%, rgba(15,34,53,0.78) 100%)',
          }} />
          <div className="relative flex items-center justify-center rounded-full shrink-0" style={{
            zIndex: 2, width: 46, height: 46, background: 'rgba(55,179,161,0.2)', color: '#37B3A1', fontSize: 22,
          }}>✦</div>
          <div className="relative flex-1 min-w-0" style={{ zIndex: 2 }}>
            <div className="text-[16px] font-semibold" style={{ color: '#fff' }}>{t.tabs.agent}</div>
            <div className="text-[12px] leading-snug" style={{ color: 'rgba(255,255,255,0.6)' }}>{h.subAgent}</div>
          </div>
          <ArrowRight size={18} style={{ color: '#37B3A1', zIndex: 2 }} className={`relative shrink-0 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180' : ''}`} />
        </button>

        {/* Titre section */}
        <div className="reveal text-center mb-12">
          <div className="text-[11px] font-bold uppercase mb-2.5" style={{ color: '#0F7B6C', letterSpacing: '0.14em' }}>
            {t.appSubtitle.split(' · ')[0]}
          </div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(26px, 4vw, 40px)', color: '#0E1B2A', fontWeight: 400 }}>
            {h.chooseTool}
          </h2>
        </div>

        {/* Grille 3×2 */}
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {items.map((item, i) => (
            <ToolCard key={item.tab} item={item} color={TOOL_COLORS[item.tab]} delay={i * 0.07} isRtl={isRtl} onClick={() => onNavigate(item.tab)} />
          ))}
        </div>
      </div>
    </section>
  )
}

const ToolCard: React.FC<{
  item: { icon: string; title: string; sub: string; tab: Tool }
  color: string
  delay: number
  isRtl: boolean
  onClick: () => void
}> = ({ item, color, delay, isRtl, onClick }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="reveal" style={{ transitionDelay: `${delay}s` }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative w-full overflow-hidden rounded-2xl"
        style={{
          background: hovered ? '#0E1B2A' : 'white',
          border: hovered ? `1.5px solid ${color}` : '1px solid #E2E8F0',
          padding: '28px 24px',
          textAlign: isRtl ? 'right' : 'left',
          transition: 'all 0.28s cubic-bezier(0.16,1,0.3,1)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          boxShadow: hovered ? `0 18px 50px rgba(0,0,0,0.16)` : '0 1px 4px rgba(0,0,0,0.05)',
        }}>
        {hovered && (
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(circle at 30% 25%, ${color}1f 0%, transparent 70%)`,
          }} />
        )}

        <div className="relative inline-block mb-4" style={{
          fontSize: 32, transition: 'transform 0.28s',
          transform: hovered ? 'scale(1.15)' : 'scale(1)',
        }}>{item.icon}</div>

        <div className="relative text-[17px] font-bold mb-1.5" style={{
          color: hovered ? 'white' : '#0E1B2A', transition: 'color 0.2s',
        }}>{item.title}</div>

        <div className="relative text-[12px] leading-relaxed" style={{
          color: hovered ? 'rgba(255,255,255,0.55)' : '#64748B', transition: 'color 0.2s',
        }}>{item.sub}</div>

        {/* Flèche */}
        <div className="absolute flex items-center justify-center rounded-full" style={{
          bottom: 20, [isRtl ? 'left' : 'right']: 20,
          width: 28, height: 28,
          background: hovered ? color : '#F1F5F9',
          color: hovered ? '#0E1B2A' : '#94A3B8',
          transition: 'all 0.25s', transform: hovered ? 'scale(1.1)' : 'scale(1)',
        } as React.CSSProperties}>
          <ArrowRight size={13} className={isRtl ? 'rotate-180' : ''} />
        </div>

        {/* Barre colorée */}
        <div className="absolute bottom-0 left-0" style={{
          height: 2, width: hovered ? '100%' : '0%', background: color,
          transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </button>
    </div>
  )
}
