import React from 'react'
import { EQUIPEMENTS, TYPES_PROJET } from '../data/coefficients'
import { VILLES } from '../data/villes'
import type { Equipements } from '../types'
import { fmt, fmtM, fmtPct } from '../utils/formatters'
import { useEstimation } from '../hooks/useEstimation'
import { DataTable, MetricCard, ResultBox, SectionTitle, SelectField, SliderField } from './ui'

export const EstimationTab: React.FC = () => {
  const { inputs, result, set, setVille, toggleEquip } = useEstimation()

  const quartierOptions = Object.keys(VILLES[inputs.ville]?.quartiers ?? {}).map(q => ({ value: q, label: q }))
  const villeOptions    = Object.entries(VILLES).map(([k, v]) => ({ value: k, label: v.label }))

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* ── LEFT COLUMN ── */}
      <div>
        <SectionTitle>Localisation</SectionTitle>
        <SelectField label="Ville" value={inputs.ville} options={villeOptions} onChange={setVille} />
        <SelectField label="Quartier" value={inputs.quartier} options={quartierOptions} onChange={v => set('quartier', v)} />
        <SliderField label="Distance à la mer" min={0} max={20} step={0.5}
          value={inputs.distanceMer} display={inputs.distanceMer + ' km'}
          onChange={v => set('distanceMer', v)} />
        <SliderField label="Distance transports (métro/tram)" min={0} max={15} step={0.5}
          value={inputs.distanceTransp} display={inputs.distanceTransp + ' km'}
          onChange={v => set('distanceTransp', v)} />

        <SectionTitle>Projet</SectionTitle>
        <SelectField label="Type de programme" value={inputs.typeProjet}
          options={TYPES_PROJET.map(t => ({ value: t.value, label: t.label }))}
          onChange={v => set('typeProjet', parseFloat(v))} />
        <SliderField label="Surface (m²)" min={30} max={250} step={5}
          value={inputs.surface} display={inputs.surface + ' m²'}
          onChange={v => set('surface', v)} />
        <SliderField label="Étage" min={0} max={30} step={1}
          value={inputs.etage} display={inputs.etage === 0 ? 'RDC' : String(inputs.etage)}
          onChange={v => set('etage', v)} />

        <SectionTitle>Équipements</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {EQUIPEMENTS.map(eq => (
            <label key={eq.key} className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox"
                checked={inputs.equipements[eq.key as keyof Equipements]}
                onChange={() => toggleEquip(eq.key as keyof Equipements)}
                className="accent-blue-600"
              />
              {eq.label}
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
              sub={`Fourchette : ${fmtM(Math.round(result.prixTotal * 0.92))} – ${fmtM(Math.round(result.prixTotal * 1.08))}`}
              badges={[
                { text: fmt(result.prixM2) + ' ₪/m²', color: 'bg-blue-50 text-blue-800' },
                { text: inputs.surface + ' m²',         color: 'bg-emerald-50 text-emerald-800' },
                { text: 'Coef. ×' + result.coefTotal.toFixed(3), color: 'bg-amber-50 text-amber-800' },
              ]}
            />

            <SectionTitle>Décomposition des coefficients</SectionTitle>
            <div className="space-y-1.5">
              {result.waterfall.map((step, i) => {
                const pct = Math.round((step.prixCumul / result.prixM2) * 100)
                const colorClass = i === 0 ? 'bg-gray-300' : step.coef > 1 ? 'bg-emerald-500' : step.coef < 1 ? 'bg-orange-400' : 'bg-gray-300'
                return (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-32 text-gray-500 shrink-0">{step.label}</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${pct}%`, opacity: 0.45 + i * 0.08 }} />
                    </div>
                    <div className="w-20 text-right font-medium tabular-nums">{fmt(step.prixCumul)} ₪</div>
                  </div>
                )
              })}
            </div>

            <SectionTitle>Sensibilité ±10%</SectionTitle>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {[
                { label: '-10% marché', val: result.prixTotal * 0.90 },
                { label: 'Estimé',      val: result.prixTotal         },
                { label: '+10% marché', val: result.prixTotal * 1.10  },
              ].map((s, i) => (
                <MetricCard key={i} label={s.label} value={fmtM(Math.round(s.val))} accent={i === 1} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400 mt-4">Sélectionnez une ville et un quartier.</p>
        )}
      </div>
    </div>
  )
}
