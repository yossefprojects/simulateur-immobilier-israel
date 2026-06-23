import React from 'react'
import { useLang } from '../i18n/LanguageContext'

type View = 'home' | 'estimation' | 'urbanisme' | 'investisseur' | 'promoteur' | 'fiscalite' | 'travaux' | 'agent'

interface FooterProps {
  onNavigate?: (v: View) => void
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLang()
  const f = t.footer

  const TOOLS: { key: Exclude<View, 'home'>; label: string }[] = [
    { key: 'estimation',   label: t.tabs.estimation },
    { key: 'urbanisme',    label: t.tabs.urbanisme },
    { key: 'investisseur', label: t.tabs.investisseur },
    { key: 'promoteur',    label: t.tabs.promoteur },
    { key: 'fiscalite',    label: t.tabs.fiscalite },
    { key: 'travaux',      label: t.tabs.travaux },
    { key: 'agent',        label: `✦ ${t.tabs.agent}` },
  ]

  const SOURCES = [
    { name: 'Nadlan Gov', href: 'https://www.gov.il' },
    { name: 'CBS',        href: 'https://www.cbs.gov.il' },
    { name: 'GovMap',     href: 'https://www.govmap.gov.il' },
    { name: 'Mavat',      href: 'https://mavat.iplan.gov.il' },
    { name: 'BOI',        href: 'https://www.boi.org.il' },
  ]

  const linkClass = 'block text-[13px] no-underline mb-1.5 transition-colors'
  const linkStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.4)' }
  const onEnter = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.color = '#0F7B6C' }
  const onLeave = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }

  return (
    <footer style={{ background: '#0E1B2A' }}>
      {/* Sea divider */}
      <div className="mx-6 sm:mx-12" style={{ height: 1, background: 'linear-gradient(to right, transparent, #0F7B6C, transparent)' }} />

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-10 md:gap-12 px-6 sm:px-10 pt-12 pb-7">

        {/* Brand */}
        <div>
          <div className="font-display text-lg text-white mb-0.5">
            {t.appTitle}
          </div>
          <div className="text-[11px] mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {t.appSubtitle}
          </div>
          <p className="text-[13px] leading-relaxed max-w-[300px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {f.tagline}
          </p>
        </div>

        {/* Tools */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] mb-4" style={{ color: '#0F7B6C' }}>
            {f.tools}
          </div>
          {TOOLS.map(tool => (
            <button
              key={tool.key}
              onClick={() => onNavigate?.(tool.key)}
              className={`${linkClass} text-start w-full bg-transparent border-0 cursor-pointer p-0`}
              style={linkStyle}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
            >
              {tool.label}
            </button>
          ))}
        </div>

        {/* Data sources */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] mb-4" style={{ color: '#0F7B6C' }}>
            {f.sources}
          </div>
          {SOURCES.map(s => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
              style={linkStyle}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
            >
              ↗ {s.name}
            </a>
          ))}

          <a
            href="https://nadlanconnect.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 rounded-lg px-3.5 py-2 text-xs font-semibold no-underline transition-all"
            style={{ background: 'rgba(55,179,161,0.12)', border: '1px solid rgba(55,179,161,0.3)', color: '#37B3A1' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(55,179,161,0.2)'; e.currentTarget.style.borderColor = 'rgba(55,179,161,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(55,179,161,0.12)'; e.currentTarget.style.borderColor = 'rgba(55,179,161,0.3)' }}
          >
            <svg viewBox="0 0 56 56" className="h-4 w-4 shrink-0" aria-hidden="true"><rect width="56" height="56" rx="14" fill="#F7F5F0" /><rect x="16" y="18" width="13" height="26" rx="2" fill="#0E1B2A" /><rect x="28" y="24" width="13" height="20" rx="2" fill="#0F7B6C" /></svg> NadlanConnect →
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="px-6 sm:px-10 py-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.25)' }}>
          {f.disclaimer}
        </p>
      </div>
    </footer>
  )
}
