import React, { useEffect } from 'react'
import { EQUIPEMENTS, TYPES_PROJET } from '../data/coefficients'
import { VILLES } from '../data/villes'
import type { Equipements } from '../types'
import { fmt, fmtM } from '../utils/formatters'
import { useEstimation } from '../hooks/useEstimation'
import { useLang } from '../i18n/LanguageContext'
import { setReportSection } from '../store/reportStore'
import { DataTable, MetricCard, ResultBox, SectionTitle, SelectField, SliderField } from './ui'

const PROJ_KEYS = ['residClassique','residLuxe','programmeNeuf','tama38','pb','mixte'] as const

export const EstimationTab: React.FC = () => {
  const { inputs, result, set, setVille, toggleEquip } = useEstimation()
  const { t } = useLang()
  const te = t.estimation

  useEffect(() => {
    setReportSection('estimation', { inputs, result })
  }, [inputs, result])

  const quartierOptions = Object.keys(VILLES[inputs.ville]?.quartiers ?? {}).map(q => ({ value: q, label: q }))
  const villeOptions    = Object.entries(VILLES).map(([k, v]) => ({ value: k, label: v.label }))

  const typesProjetOptions = TYPES_PROJET.map((tp, i) => ({
    value: tp.value,
    label: t.typesProjet[PROJ_KEYS[i]],
  }))

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
        <SelectField label={te.typeProjet} value={inputs.typeProjet}
          options={typesProjetOptions}
          onChange={v => set('typeProjet', parseFloat(v))} />
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
                className="accent-blue-600"
              />
              {equipLabels[eq.key] ?? eq.label}
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
                { text: fmt(result.prixM2) + ' ₪/' + te.m2, color: 'bg-blue-50 text-blue-800' },
                { text: inputs.surface + ' ' + te.m2,        color: 'bg-emerald-50 text-emerald-800' },
                { text: te.coef + ' ×' + result.coefTotal.toFixed(3), color: 'bg-amber-50 text-amber-800' },
              ]}
            />

            <SectionTitle>{te.decomp}</SectionTitle>
            <div className="space-y-1.5">
              {result.waterfall.map((step, i) => {
                const pct = Math.round((step.prixCumul / result.prixM2) * 100)
                const colorClass = i === 0 ? 'bg-gray-300' : step.coef > 1 ? 'bg-emerald-500' : step.coef < 1 ? 'bg-orange-400' : 'bg-gray-300'
                return (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-32 text-gray-500 shrink-0">{waterfallLabels[i] ?? step.label}</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${pct}%`, opacity: 0.45 + i * 0.08 }} />
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
          <p className="text-sm text-gray-400 mt-4">{te.selectPrompt}</p>
        )}
      </div>
    </div>
  )
}
