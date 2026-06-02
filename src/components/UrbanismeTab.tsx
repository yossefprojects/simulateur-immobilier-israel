import React, { useEffect } from 'react'
import { CheckCircle, Circle, Clock, ExternalLink } from 'lucide-react'
import { ACCORDS_MUNICIPAUX, SOURCES_EXTERNES, STATUTS_PERMIS, STATUTS_PLAN } from '../data/accords'
import { VILLES } from '../data/villes'
import type { AccordKey, PermisKey, PlanKey } from '../types'
import { fmt, fmtM } from '../utils/formatters'
import { useUrbanisme } from '../hooks/useUrbanisme'
import { useLang } from '../i18n/LanguageContext'
import { setReportSection } from '../store/reportStore'
import { DataTable, NumberField, SectionTitle, SelectField, SliderField } from './ui'
import { Tooltip } from './Tooltip'

const ScoreRing: React.FC<{ score: number; color: string; label: string; sub: string }> = ({ score, color, label, sub }) => {
  const r = 34, circ = 2 * Math.PI * r
  const dash = (circ * score) / 100
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20 shrink-0">
        <svg viewBox="0 0 80 80" className="w-20 h-20" role="img" aria-label={`Score urbanistique : ${score} / 100 — ${label}`}>
          <circle cx="40" cy="40" r={r} fill="none" stroke="#EDEDEA" strokeWidth="8" />
          <circle cx="40" cy="40" r={r} fill="none"
            stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${dash.toFixed(1)} ${(circ - dash).toFixed(1)}`}
            transform="rotate(-90 40 40)" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold font-display">{score}</div>
      </div>
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-neutral-500 mt-0.5">{sub}</div>
      </div>
    </div>
  )
}

export const UrbanismeTab: React.FC = () => {
  const { inputs, result, set } = useUrbanisme()
  const { t } = useLang()
  const tu = t.urbanisme

  useEffect(() => {
    setReportSection('urbanisme', { inputs, result })
  }, [inputs, result])

  const villeOptions   = Object.entries(VILLES).map(([k, v]) => ({ value: k, label: v.label }))
  const planOptions    = Object.entries(STATUTS_PLAN).map(([k]) => ({ value: k, label: t.statutsPlan[k as PlanKey] }))
  const accordOptions  = Object.entries(ACCORDS_MUNICIPAUX).map(([k]) => ({ value: k, label: t.accordsMunicipaux[k as AccordKey] }))
  const permisOptions  = Object.entries(STATUTS_PERMIS).map(([k]) => ({ value: k, label: t.statutsPermis[k as PermisKey] }))

  const scoreLabel = result.score >= 70 ? t.scoreLabels.fort
                   : result.score >= 45 ? t.scoreLabels.modere
                   : t.scoreLabels.faible

  const isChantier = inputs.accordKey === 'chantier'
  const hasAccord  = ['tama38_ok','pb_ok','pc_ok','chantier'].includes(inputs.accordKey)
  const hasPlan    = ['approved','renewal','priority'].includes(inputs.planKey)
  const hasPermis  = inputs.permisKey === 'accorde'

  const timelineSteps = [
    { label: tu.taba,        desc: t.statutsPlan[inputs.planKey],          done: hasPlan,    active: ['pending','study'].includes(inputs.planKey) },
    { label: tu.accordMun,   desc: t.accordsMunicipaux[inputs.accordKey],  done: hasAccord,  active: ['tama38_etude','pb_etude'].includes(inputs.accordKey) },
    { label: tu.permisConstr,desc: t.statutsPermis[inputs.permisKey],      done: hasPermis,  active: inputs.permisKey === 'depose' },
    { label: tu.chantier,    desc: isChantier ? t.timelineDesc.chantierEnCours : t.timelineDesc.enAttente, done: isChantier, active: false },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* ── LEFT ── */}
      <div>
        <SectionTitle>{tu.cadastre}</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <div className="mb-3">
            <label className="block text-xs text-neutral-500 mb-1">
              <Tooltip content={t.tooltips.cadastre}>
                {tu.gush}
              </Tooltip>
            </label>
            <input type="text" value={inputs.gush} placeholder={tu.gushPlaceholder}
              onChange={e => set('gush', e.target.value)}
              className="w-full rounded border border-neutral-200 px-3 py-1.5 text-sm" />
          </div>
          <div className="mb-3">
            <label className="block text-xs text-neutral-500 mb-1">{tu.helka}</label>
            <input type="text" value={inputs.helka} placeholder={tu.helkaPlaceholder}
              onChange={e => set('helka', e.target.value)}
              className="w-full rounded border border-neutral-200 px-3 py-1.5 text-sm" />
          </div>
        </div>
        <SelectField label={tu.ville} value={inputs.ville} options={villeOptions} onChange={v => set('ville', v)} />
        <NumberField label={tu.surfTerrain} value={inputs.surfTerrain} step={50} onChange={v => set('surfTerrain', v)} />
        <NumberField label={tu.surfExist}   value={inputs.surfExist}   step={50} onChange={v => set('surfExist', v)} />

        <SectionTitle>{tu.statutUrb}</SectionTitle>
        <SelectField label={tu.planLocal} value={inputs.planKey} options={planOptions} onChange={v => set('planKey', v as PlanKey)} />
        <SliderField label={tu.etagesAut} min={2} max={40} step={1}
          value={inputs.etagesAut} display={String(inputs.etagesAut)}
          onChange={v => set('etagesAut', v)} />
        <div className="mb-3">
          <label className="block text-xs text-neutral-500 mb-1">
            <Tooltip content={t.tooltips.cos}>
              {tu.cos}
            </Tooltip>
          </label>
          <input type="range" min={0.5} max={8} step={0.5} value={inputs.cos}
            onChange={e => set('cos', parseFloat(e.target.value))}
            className="w-full" aria-label={tu.cos} aria-valuemin={0.5} aria-valuemax={8} aria-valuenow={inputs.cos} />
          <div className="text-right text-xs font-medium tabular-nums mt-0.5">{inputs.cos}</div>
        </div>

        <SectionTitle>{tu.accords}</SectionTitle>
        <div className="mb-3">
          <label className="block text-xs text-neutral-500 mb-1">
            <Tooltip content={t.tooltips.accords}>
              {tu.statutProjet}
            </Tooltip>
          </label>
          <div className="relative">
            <select value={inputs.accordKey} onChange={e => set('accordKey', e.target.value as AccordKey)}
              className="w-full appearance-none rounded border border-neutral-200 bg-white ps-3 pe-8 py-1.5 text-sm truncate">
              {accordOptions.map(o => <option key={String(o.value)} value={o.value}>{o.label}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>
        <SelectField label={tu.permis}     value={inputs.permisKey} options={permisOptions} onChange={v => set('permisKey', v as PermisKey)} />
        <NumberField label={tu.prixActuel} value={inputs.prixActuel} step={500} onChange={v => set('prixActuel', v)} />
      </div>

      {/* ── RIGHT ── */}
      <div>
        <SectionTitle>{tu.scoreTitle}</SectionTitle>
        <ScoreRing score={result.score} color={result.scoreColor} label={scoreLabel} sub={tu.scoreSub} />

        <SectionTitle>{tu.valorisation}</SectionTitle>
        <div className="border border-neutral-100 rounded-xl p-4 mb-2">
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            {result.prixProj !== inputs.prixActuel && (
              <span className="text-sm text-neutral-400 line-through">{fmt(inputs.prixActuel)} ₪/m²</span>
            )}
            <span className="font-display text-2xl font-semibold">{fmt(result.prixProj)} ₪/m²</span>
            {result.gainM2 > 0 && (
              <span className="text-sm font-medium text-success">+{fmt(result.gainM2)} ₪/m² (+{result.gainPct.toFixed(1)}%)</span>
            )}
          </div>
          <DataTable rows={[
            { label: tu.valActTot,  value: fmtM(result.valActTot) },
            { label: tu.valProjTot, value: fmtM(result.valProjTot), accent: result.gainM2 >= 0 ? 'pos' : 'neg' },
            { label: tu.plusValue,  value: (result.plusValue >= 0 ? '+' : '') + fmtM(result.plusValue), accent: result.plusValue >= 0 ? 'pos' : 'neg' },
            { label: tu.coefUrb,    value: '×' + result.coefTotal.toFixed(3) },
          ]} />
        </div>

        <SectionTitle>{tu.droits}</SectionTitle>
        <DataTable rows={[
          { label: tu.surfTerrainRow, value: fmt(inputs.surfTerrain) + ' m²' },
          { label: tu.surfMax,        value: fmt(result.surfMax) + ' m²' },
          { label: tu.surfExistRow,   value: fmt(inputs.surfExist) + ' m²' },
          { label: tu.droitsRest,     value: fmt(result.droits) + ' m²', accent: result.droits > 0 ? 'pos' : 'none' },
          { label: tu.etagesAutRow,   value: String(inputs.etagesAut) },
        ]} />

        <SectionTitle>{tu.avancement}</SectionTitle>
        <div className="space-y-2">
          {timelineSteps.map((s, i) => {
            const Icon = s.done ? CheckCircle : s.active ? Clock : Circle
            const iconClass = s.done ? 'text-success' : s.active ? 'text-primary' : 'text-neutral-200'
            return (
              <div key={i} className="flex gap-3 items-start">
                <Icon size={18} className={`${iconClass} shrink-0 mt-0.5`} />
                <div>
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className="text-xs text-neutral-500">{s.desc}</div>
                </div>
              </div>
            )
          })}
        </div>

        <SectionTitle>{tu.sources}</SectionTitle>
        <div className="flex flex-col gap-1.5">
          {SOURCES_EXTERNES.map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary hover:underline">
              <ExternalLink size={11} />
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
