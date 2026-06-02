import React, { useEffect } from 'react'
import { EQUIPEMENTS, TYPES_PROJET } from '../data/coefficients'
import { VILLES } from '../data/villes'
import type { Equipements } from '../types'
import { fmt, fmtM } from '../utils/formatters'
import { useEstimation } from '../hooks/useEstimation'
import { useLang } from '../i18n/LanguageContext'
import { setReportSection } from '../store/reportStore'
import { MetricCard, ResultBox, SectionTitle, SelectField, SliderField } from './ui'
import { Tooltip } from './Tooltip'

const PROJ_KEYS = ['residClassique','residLuxe','programmeNeuf','tama38','pb','mixte'] as const

export const EstimationTab: React.FC = () => {
  const { inputs, result, set, setVille, toggleEquip } = useEstimation()
  const { t } = useLang()
  const te = t.estimation

  useEffect(() => {
    setReportSection('estimation', { inputs, result })
  }, [inputs, result])

  const quartierOptions    = Object.keys(VILLES[inputs.ville]?.quartiers ?? {}).map(q => ({ value: q, label: q }))
  const villeOptions       = Object.entries(VILLES).map(([k, v]) => ({ value: k, label: v.label }))
  const typesProjetOptions = TYPES_PROJET.map((tp, i) => ({ value: tp.value, label: t.typesProjet[PROJ_KEYS[i]] }))

  const equipLabels: Record<string, string> = {
    ascenseur: t.equipements.ascenseur,
    parking:   t.equipements.parking,
    mamad:     t.equipements.mamad,
    terrasse:  t.equipements.terrasse,
    vueMer:    t.equipements.vueMer,
    vueDeg:    t.equipements.vueDeg,
    gardien:   t.equipements.gardien,
    piscine:   t.equipements.piscine,
    gym:       t.equipements.gym,
  }

  const waterfallLabels = [
    te.baseQuartier, te.typeProgramme, te.surfaceLabel,
    te.proxMer, te.transports, te.etageLabel, te.equipLabel,
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* ── LEFT COLUMN ── */}
      <div>
        <SectionTitle>{te.localisation}</SectionTitle>
        <SelectField label={te.ville} value={inputs.ville} options={villeOptions} onChange={setVille} />
        <SelectField label={te.quartier} value={inputs.quartier} options={quartierOptions} onChange={v => set('quartier', v)} />
        <SliderField label={te.distMer} min={0} max={20} step={0.5}
          value={inputs.distanceMer} display={inputs.distanceMer + ' ' + te.km}
          onChange={v => set('distanceMer', v)} />
        <SliderField label={te.distTransp} min={0} max={15} step={0.5}
          value={inputs.distanceTransp} display={inputs.distanceTransp + ' ' + te.km}
          onChange={v => set('distanceTransp', v)} />

        <SectionTitle>{te.projet}</SectionTitle>
        <div className="mb-3">
          <label className="block text-xs text-neutral-500 mb-1">
            <Tooltip content="Programme national de renforcement sismique (TAMA 38) permettant d'ajouter des étages. Pinouï-Binouï : démolition-reconstruction avec relogement des locataires.">
              {te.typeProjet}
            </Tooltip>
          </label>
          <div className="relative">
            <select value={inputs.typeProjet}
              onChange={e => set('typeProjet', parseFloat(e.target.value))}
              className="w-full appearance-none rounded border border-neutral-200 bg-white ps-3 pe-8 py-1.5 text-sm truncate">
              {typesProjetOptions.map(o => <option key={String(o.value)} value={o.value}>{o.label}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>
        <SliderField label={te.surface} min={30} max={250} step={5}
          value={inputs.surface} display={inputs.surface + ' ' + te.m2}
          onChange={v => set('surface', v)} />
        <SliderField label={te.etage} min={0} max={30} step={1}
          value={inputs.etage} display={inputs.etage === 0 ? te.rdc : String(inputs.etage)}
          onChange={v => set('etage', v)} />

        <SectionTitle>{te.equipements}</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {EQUIPEMENTS.map(eq => (
            <label key={eq.key} className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox"
                checked={inputs.equipements[eq.key as keyof Equipements]}
                onChange={() => toggleEquip(eq.key as keyof Equipements)}
                className="accent-primary"
              />
              {eq.key === 'mamad' ? (
                <Tooltip content={`Pièce sécurisée renforcée (ממ"ד) obligatoire dans les logements israéliens depuis 1992, servant d'abri en cas de roquettes. Augmente la valeur du bien.`}>
                  {equipLabels[eq.key] ?? eq.label}
                </Tooltip>
              ) : (equipLabels[eq.key] ?? eq.label)}
            </label>
          ))}
        </div>
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div>
        {result ? (
          <>
            <ResultBox
              main={fmtM(result.prixTotal)}
              sub={`${te.fourchette} : ${fmtM(Math.round(result.prixTotal * 0.92))} – ${fmtM(Math.round(result.prixTotal * 1.08))}`}
              badges={[
                { text: fmt(result.prixM2) + ' ₪/' + te.m2,              color: 'bg-blue-50 text-blue-800' },
                { text: inputs.surface + ' ' + te.m2,                    color: 'bg-emerald-50 text-emerald-800' },
                { text: te.coef + ' ×' + result.coefTotal.toFixed(3),    color: 'bg-amber-50 text-amber-800' },
              ]}
            />

            <SectionTitle>{te.decomp}</SectionTitle>
            <div className="space-y-1.5">
              {result.waterfall.map((step, i) => {
                const pct = Math.round((step.prixCumul / result.prixM2) * 100)
                const colorClass = i === 0 ? 'bg-neutral-300' : step.coef > 1 ? 'bg-success' : step.coef < 1 ? 'bg-warning' : 'bg-neutral-300'
                return (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-32 text-neutral-500 shrink-0">{waterfallLabels[i] ?? step.label}</div>
                    <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full waterfall-bar ${colorClass}`} style={{ width: `${pct}%`, opacity: 0.45 + i * 0.08 }} />
                    </div>
                    <div className="w-20 text-right font-medium tabular-nums">{fmt(step.prixCumul)} ₪</div>
                  </div>
                )
              })}
            </div>

            <SectionTitle>{te.sensib}</SectionTitle>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {[
                { label: te.moins10, val: result.prixTotal * 0.90 },
                { label: te.estime,  val: result.prixTotal         },
                { label: te.plus10,  val: result.prixTotal * 1.10  },
              ].map((s, i) => (
                <MetricCard key={i} label={s.label} value={fmtM(Math.round(s.val))} accent={i === 1} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-neutral-400 mt-4">{te.selectPrompt}</p>
        )}
      </div>
    </div>
  )
}
