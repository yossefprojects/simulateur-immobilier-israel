import React from 'react'
import { CheckCircle, Circle, Clock, ExternalLink } from 'lucide-react'
import { ACCORDS_MUNICIPAUX, SOURCES_EXTERNES, STATUTS_PERMIS, STATUTS_PLAN } from '../data/accords'
import { VILLES } from '../data/villes'
import type { AccordKey, PermisKey, PlanKey } from '../types'
import { fmt, fmtM, fmtPct } from '../utils/formatters'
import { useUrbanisme } from '../hooks/useUrbanisme'
import { DataTable, NumberField, SectionTitle, SelectField, SliderField } from './ui'

const ScoreRing: React.FC<{ score: number; color: string; label: string }> = ({ score, color, label }) => {
  const r = 34, circ = 2 * Math.PI * r
  const dash = (circ * score) / 100
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20 shrink-0">
        <svg viewBox="0 0 80 80" className="w-20 h-20">
          <circle cx="40" cy="40" r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <circle cx="40" cy="40" r={r} fill="none"
            stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${dash.toFixed(1)} ${(circ - dash).toFixed(1)}`}
            transform="rotate(-90 40 40)" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xl font-medium">{score}</div>
      </div>
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-gray-500 mt-0.5">Score urbanistique / 100</div>
      </div>
    </div>
  )
}

const TIMELINE_STEPS = [
  { label: 'Taba / plan local',    doneKeys: ['approved', 'renewal', 'priority'] as PlanKey[], activeKeys: ['pending', 'study'] as PlanKey[] },
]

export const UrbanismeTab: React.FC = () => {
  const { inputs, result, set } = useUrbanisme()

  const villeOptions   = Object.entries(VILLES).map(([k, v]) => ({ value: k, label: v.label }))
  const planOptions    = Object.entries(STATUTS_PLAN).map(([k, v]) => ({ value: k, label: v.label }))
  const accordOptions  = Object.entries(ACCORDS_MUNICIPAUX).map(([k, v]) => ({ value: k, label: v.label }))
  const permisOptions  = Object.entries(STATUTS_PERMIS).map(([k, v]) => ({ value: k, label: v.label }))

  const isChantier = inputs.accordKey === 'chantier'
  const hasPc      = inputs.accordKey === 'pc_ok' || isChantier
  const hasAccord  = ['tama38_ok','pb_ok','pc_ok','chantier'].includes(inputs.accordKey)
  const hasPlan    = ['approved','renewal','priority'].includes(inputs.planKey)
  const hasPermis  = inputs.permisKey === 'accorde'

  const timelineSteps = [
    { label: 'Taba / plan local',       desc: STATUTS_PLAN[inputs.planKey].label,           done: hasPlan,   active: ['pending','study'].includes(inputs.planKey) },
    { label: 'Accord municipal',         desc: ACCORDS_MUNICIPAUX[inputs.accordKey].label,  done: hasAccord, active: ['tama38_etude','pb_etude'].includes(inputs.accordKey) },
    { label: 'Permis de construire',     desc: STATUTS_PERMIS[inputs.permisKey].label,      done: hasPermis, active: inputs.permisKey === 'depose' },
    { label: 'Chantier démarré',         desc: isChantier ? 'Chantier en cours' : 'En attente', done: isChantier, active: false },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* ── LEFT ── */}
      <div>
        <SectionTitle>Identification cadastrale</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1">Numéro de gush (bloc)</label>
            <input type="text" value={inputs.gush} placeholder="ex. 6627"
              onChange={e => set('gush', e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm" />
          </div>
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1">Numéro de helka (parcelle)</label>
            <input type="text" value={inputs.helka} placeholder="ex. 142"
              onChange={e => set('helka', e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm" />
          </div>
        </div>
        <SelectField label="Ville" value={inputs.ville} options={villeOptions} onChange={v => set('ville', v)} />
        <NumberField label="Surface terrain (m²)" value={inputs.surfTerrain} step={50} onChange={v => set('surfTerrain', v)} />
        <NumberField label="Surface construite existante (m²)" value={inputs.surfExist} step={50} onChange={v => set('surfExist', v)} />

        <SectionTitle>Statut urbanistique (Taba / תב"ע)</SectionTitle>
        <SelectField label="Plan local" value={inputs.planKey} options={planOptions} onChange={v => set('planKey', v as PlanKey)} />
        <SliderField label="Étages autorisés" min={2} max={40} step={1}
          value={inputs.etagesAut} display={String(inputs.etagesAut)}
          onChange={v => set('etagesAut', v)} />
        <SliderField label="COS (coefficient d'occupation du sol)" min={0.5} max={8} step={0.5}
          value={inputs.cos} display={String(inputs.cos)}
          onChange={v => set('cos', v)} />

        <SectionTitle>Accords et programmes municipaux</SectionTitle>
        <SelectField label="Statut du projet municipal" value={inputs.accordKey} options={accordOptions} onChange={v => set('accordKey', v as AccordKey)} />
        <SelectField label="Permis de construire" value={inputs.permisKey} options={permisOptions} onChange={v => set('permisKey', v as PermisKey)} />
        <NumberField label="Prix actuel au m² (₪/m²)" value={inputs.prixActuel} step={500} onChange={v => set('prixActuel', v)} />
      </div>

      {/* ── RIGHT ── */}
      <div>
        <SectionTitle>Score urbanistique</SectionTitle>
        <ScoreRing score={result.score} color={result.scoreColor} label={result.scoreLabel} />

        <SectionTitle>Valorisation projetée</SectionTitle>
        <div className="border border-gray-100 rounded-xl p-4 mb-2">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-sm text-gray-400 line-through">{fmt(inputs.prixActuel)} ₪/m²</span>
            <span className="text-2xl font-medium">{fmt(result.prixProj)} ₪/m²</span>
            {result.gainM2 > 0 && (
              <span className="text-sm font-medium text-emerald-700">+{fmt(result.gainM2)} ₪/m² (+{result.gainPct.toFixed(1)}%)</span>
            )}
          </div>
          <DataTable rows={[
            { label: 'Valeur actuelle totale',  value: fmtM(result.valActTot) },
            { label: 'Valeur projetée totale',  value: fmtM(result.valProjTot), accent: result.gainM2 >= 0 ? 'pos' : 'neg' },
            { label: 'Plus-value potentielle',  value: (result.plusValue >= 0 ? '+' : '') + fmtM(result.plusValue), accent: result.plusValue >= 0 ? 'pos' : 'neg' },
            { label: 'Coef. urbanistique total',value: '×' + result.coefTotal.toFixed(3) },
          ]} />
        </div>

        <SectionTitle>Droits à construire</SectionTitle>
        <DataTable rows={[
          { label: 'Surface terrain',               value: fmt(inputs.surfTerrain) + ' m²' },
          { label: 'Surface max constructible',      value: fmt(result.surfMax) + ' m²' },
          { label: 'Surface existante',              value: fmt(inputs.surfExist) + ' m²' },
          { label: 'Droits restants',                value: fmt(result.droits) + ' m²', accent: result.droits > 0 ? 'pos' : 'none' },
          { label: "Étages autorisés",              value: String(inputs.etagesAut) },
        ]} />

        <SectionTitle>Avancement du dossier</SectionTitle>
        <div className="space-y-2">
          {timelineSteps.map((s, i) => {
            const Icon = s.done ? CheckCircle : s.active ? Clock : Circle
            const iconClass = s.done ? 'text-emerald-600' : s.active ? 'text-blue-500' : 'text-gray-300'
            return (
              <div key={i} className="flex gap-3 items-start">
                <Icon size={18} className={`${iconClass} shrink-0 mt-0.5`} />
                <div>
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className="text-xs text-gray-500">{s.desc}</div>
                </div>
              </div>
            )
          })}
        </div>

        <SectionTitle>Sources recommandées</SectionTitle>
        <div className="flex flex-col gap-1.5">
          {SOURCES_EXTERNES.map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
              <ExternalLink size={11} />
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
