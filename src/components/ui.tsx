import React from 'react'
import { ChevronDown } from 'lucide-react'

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

export const SliderField: React.FC<SliderFieldProps> = ({ label, min, max, step, value, display, onChange }) => (
  <div className="mb-3">
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <div className="flex items-center gap-3">
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="flex-1 h-1 accent-blue-600"
      />
      <span className="text-sm font-medium w-16 text-right tabular-nums">{display}</span>
    </div>
  </div>
)

// ─── NumberField ──────────────────────────────────────────────────────────────

interface NumberFieldProps {
  label:    string
  value:    number
  step?:    number
  onChange: (v: number) => void
}

export const NumberField: React.FC<NumberFieldProps> = ({ label, value, step = 1, onChange }) => (
  <div className="mb-3">
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <input
      type="number" value={value} step={step}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm"
    />
  </div>
)

// ─── SelectField — custom arrow, RTL-aware via logical properties ──────────────

interface SelectFieldProps {
  label:    string
  value:    string | number
  options:  { value: string | number; label: string }[]
  onChange: (v: string) => void
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, value, options, onChange }) => (
  <div className="mb-3">
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none rounded border border-gray-200 bg-white ps-3 pe-8 py-1.5 text-sm truncate"
      >
        {options.map(o => <option key={String(o.value)} value={o.value}>{o.label}</option>)}
      </select>
      <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2">
        <ChevronDown size={14} className="text-gray-400" />
      </div>
    </div>
  </div>
)

// ─── MetricCard ───────────────────────────────────────────────────────────────

interface MetricCardProps {
  label:   string
  value:   string
  accent?: boolean
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, accent }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <div className={`text-lg font-medium tabular-nums ${accent ? 'text-blue-700' : 'text-gray-900'}`}>{value}</div>
  </div>
)

// ─── SectionTitle ─────────────────────────────────────────────────────────────

export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-5 mb-2">{children}</div>
)

// ─── ResultBox ────────────────────────────────────────────────────────────────

interface ResultBoxProps {
  main:    string
  sub:     string
  badges?: { text: string; color: string }[]
}

export const ResultBox: React.FC<ResultBoxProps> = ({ main, sub, badges }) => (
  <div className="bg-gray-50 rounded-xl p-4 mb-4">
    <div className="text-xs text-gray-500 mb-1">Prix estimé</div>
    <div className="text-4xl font-medium tabular-nums">{main}</div>
    <div className="text-sm text-gray-500 mt-1">{sub}</div>
    {badges && (
      <div className="flex gap-2 flex-wrap mt-3">
        {badges.map((b, i) => (
          <span key={i} className={`text-xs px-2 py-0.5 rounded font-medium ${b.color}`}>{b.text}</span>
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
        <tr key={i} className="border-b border-gray-100 last:border-0">
          <td className={`py-1.5 px-2 text-gray-500 ${r.bold ? 'font-medium' : ''}`}>{r.label}</td>
          <td className={`py-1.5 px-2 text-right tabular-nums font-medium
            ${r.accent === 'pos' ? 'text-emerald-700' : r.accent === 'neg' ? 'text-orange-700' : 'text-gray-900'}
            ${r.bold ? 'font-semibold' : ''}`}>
            {r.value}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)
