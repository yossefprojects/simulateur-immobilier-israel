import React from 'react'
import { ChevronDown } from 'lucide-react'

// ─── Shared label style ───────────────────────────────────────────────────────

const fieldLabelClass =
  'block text-[11px] font-bold uppercase tracking-[0.07em] text-[#0E1B2A] mb-1.5'

// ─── SliderField ──────────────────────────────────────────────────────────────

interface SliderFieldProps {
  label:    string
  min:      number
  max:      number
  step:     number
  value:    number
  display:  string
  onChange: (v: number) => void
}

export const SliderField: React.FC<SliderFieldProps> = ({ label, min, max, step, value, display, onChange }) => {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0
  return (
    <div className="mb-3.5">
      <label className={fieldLabelClass}>{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          aria-valuemin={min} aria-valuemax={max} aria-valuenow={value}
          className="flex-1"
          style={{ ['--val' as string]: `${pct}%` }}
        />
        <span className="text-sm font-semibold shrink-0 whitespace-nowrap text-right tabular-nums text-[#0C1A2E]">{display}</span>
      </div>
    </div>
  )
}

// ─── NumberField ──────────────────────────────────────────────────────────────

interface NumberFieldProps {
  label:    string
  value:    number
  step?:    number
  onChange: (v: number) => void
}

export const NumberField: React.FC<NumberFieldProps> = ({ label, value, step = 1, onChange }) => (
  <div className="mb-3.5">
    <label className={fieldLabelClass}>{label}</label>
    <input
      type="number" value={value} step={step}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      className="w-full text-sm text-[#0C1A2E] bg-white"
      style={{
        border: '1.5px solid #E2E8F0',
        borderRadius: 10,
        padding: '9px 14px',
        outline: 'none',
        transition: 'border-color .2s, box-shadow .2s',
      }}
      onFocus={e => { e.currentTarget.style.borderColor = '#0E1B2A'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26,58,92,0.08)' }}
      onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none' }}
    />
  </div>
)

// ─── SelectField — custom chevron, RTL-aware ──────────────────────────────────

interface SelectFieldProps {
  label:    string
  value:    string | number
  options:  { value: string | number; label: string }[]
  onChange: (v: string) => void
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, value, options, onChange }) => (
  <div className="mb-3.5">
    <label className={fieldLabelClass}>{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none text-sm text-[#0C1A2E] bg-white truncate cursor-pointer ps-3.5 pe-10"
        style={{
          border: '1.5px solid #E2E8F0',
          borderRadius: 10,
          paddingTop: 9, paddingBottom: 9,
          outline: 'none',
          transition: 'border-color .2s, box-shadow .2s',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = '#0E1B2A'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26,58,92,0.08)' }}
        onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none' }}
      >
        {options.map(o => <option key={String(o.value)} value={o.value}>{o.label}</option>)}
      </select>
      <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
        <ChevronDown size={15} strokeWidth={2.4} className="text-[#94A3B8]" />
      </div>
    </div>
  </div>
)

// ─── MetricCard ───────────────────────────────────────────────────────────────

interface MetricCardProps {
  label:   React.ReactNode
  value:   string
  accent?: boolean
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, accent }) => (
  <div
    className="rounded-xl p-3.5"
    style={{
      background: accent ? 'linear-gradient(135deg, #0A1628, #0E1B2A)' : '#F8F7F4',
      border: accent ? 'none' : '1px solid #E2E8F0',
    }}
  >
    <div
      className="text-[10px] font-semibold uppercase tracking-[0.07em] mb-1.5"
      style={{ color: accent ? 'rgba(255,255,255,0.45)' : '#94A3B8' }}
    >
      {label}
    </div>
    <div
      className="font-display text-xl tabular-nums leading-tight"
      style={{ color: accent ? '#0F7B6C' : '#0C1A2E' }}
    >
      {value}
    </div>
  </div>
)

// ─── SectionTitle ─────────────────────────────────────────────────────────────

export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-2 mt-6 mb-3.5">
    <div className="flex-1 h-px" style={{ background: 'rgba(201,168,76,0.2)' }} />
    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0F7B6C]">{children}</span>
    <div className="flex-1 h-px" style={{ background: 'rgba(201,168,76,0.2)' }} />
  </div>
)

// ─── ResultBox — navy gradient hero result ────────────────────────────────────

interface ResultBoxProps {
  main:    string
  sub:     string
  label?:  string
  badges?: { text: string; color: string }[]
}

export const ResultBox: React.FC<ResultBoxProps> = ({ main, sub, label, badges }) => (
  <div
    className="relative overflow-hidden rounded-2xl mb-4 p-5 sm:px-7 sm:py-6"
    style={{ background: 'linear-gradient(135deg, #0A1628, #0E1B2A)' }}
  >
    <div
      className="absolute pointer-events-none"
      style={{
        top: -30, right: -30, width: 120, height: 120,
        background: 'radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)',
      }}
    />
    {label && (
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {label}
      </div>
    )}
    <div className="font-display text-3xl sm:text-4xl tabular-nums leading-none break-words" style={{ color: '#0F7B6C' }}>{main}</div>
    <div className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{sub}</div>
    {badges && (
      <div className="flex gap-2 flex-wrap mt-3">
        {badges.map((b, i) => (
          <span key={i} className={`text-xs px-2.5 py-1 rounded-md font-semibold ${b.color}`}>{b.text}</span>
        ))}
      </div>
    )}
  </div>
)

// ─── DataTable ────────────────────────────────────────────────────────────────

interface DataTableProps {
  rows: { label: string; value: string; accent?: 'pos' | 'neg' | 'none'; bold?: boolean }[]
}

export const DataTable: React.FC<DataTableProps> = ({ rows }) => (
  <table className="w-full text-xs border-collapse">
    <tbody>
      {rows.map((r, i) => (
        <tr
          key={i}
          className="border-b border-[#F1F5F9] last:border-0"
          style={r.bold ? { borderTop: '1.5px solid #E2E8F0' } : undefined}
        >
          <td className={`py-2 px-2 align-top ${r.bold ? 'font-semibold text-[#0C1A2E]' : 'text-[#64748B]'}`}>{r.label}</td>
          <td className={`py-2 px-2 text-right tabular-nums font-medium break-words
            ${r.accent === 'pos' ? 'text-success' : r.accent === 'neg' ? 'text-danger' : 'text-[#0C1A2E]'}
            ${r.bold ? 'font-bold' : ''}`}>
            {r.value}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)
