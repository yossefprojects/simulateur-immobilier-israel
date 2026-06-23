import React, { useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell } from 'recharts'
import { fmt, fmtM, fmtPct } from '../utils/formatters'
import { useInvestisseur } from '../hooks/useInvestisseur'
import { usePromoteur } from '../hooks/usePromoteur'
import { useLang } from '../i18n/LanguageContext'
import { setReportSection } from '../store/reportStore'
import { DataTable, MetricCard, NumberField, SectionTitle, SliderField } from './ui'
import { Tooltip } from './Tooltip'

// ── InvestisseurTab ────────────────────────────────────────────────────────────

export const InvestisseurTab: React.FC = () => {
  const { inputs, result, set } = useInvestisseur()
  const { t } = useLang()
  const ti = t.investisseur
  const cfPos = result.cfMensuel >= 0

  useEffect(() => {
    setReportSection('investisseur', { inputs, result })
  }, [inputs, result])

  const chartData = result.projection.map(p => ({
    annee:   `+${p.annee}`,
    valeur:  Math.round(p.valeur  / 1000),
    cfCumul: Math.round(p.cfCumul / 1000),
  }))

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <SectionTitle>{ti.bienFin}</SectionTitle>
        <NumberField label={ti.prixAchat} value={inputs.prix} step={50000} onChange={v => set('prix', v)} />
        <SliderField label={ti.apport} min={25} max={100} step={5}
          value={inputs.apport} display={inputs.apport + '%'} onChange={v => set('apport', v)} />
        <div className="mb-3">
          <label className="block text-xs text-neutral-500 mb-1">
            <Tooltip content={t.tooltips.taux}>
              {ti.taux}
            </Tooltip>
          </label>
          <input type="range" min={3} max={8} step={0.1} value={inputs.taux}
            onChange={e => set('taux', parseFloat(e.target.value))}
            className="w-full" style={{ ['--val' as string]: `${((inputs.taux - 3) / (8 - 3)) * 100}%` }}
            aria-label={ti.taux} aria-valuemin={3} aria-valuemax={8} aria-valuenow={inputs.taux} />
          <div className="text-right text-xs font-medium tabular-nums mt-0.5">{inputs.taux}%</div>
        </div>
        <SliderField label={ti.duree} min={10} max={30} step={1}
          value={inputs.duree} display={inputs.duree + ' ' + ti.ans} onChange={v => set('duree', v)} />

        <SectionTitle>{ti.revenus}</SectionTitle>
        <NumberField label={ti.loyer} value={inputs.loyer} step={500} onChange={v => set('loyer', v)} />
        <SliderField label={ti.vacance} min={0} max={20} step={1}
          value={inputs.vacance} display={inputs.vacance + '%'} onChange={v => set('vacance', v)} />
        <NumberField label={ti.charges} value={inputs.charges} step={1000} onChange={v => set('charges', v)} />
        <SliderField label={ti.reval} min={0} max={8} step={0.5}
          value={inputs.reval} display={inputs.reval + '%'} onChange={v => set('reval', v)} />
        <SliderField label={ti.horizon} min={3} max={20} step={1}
          value={inputs.horizon} display={inputs.horizon + ' ' + ti.ans} onChange={v => set('horizon', v)} />
      </div>

      <div>
        <SectionTitle>{ti.resultats}</SectionTitle>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <MetricCard label={ti.rendBrut}   value={fmtPct(result.rendBrut)} />
          <MetricCard label={ti.rendNet}    value={fmtPct(result.rendNet)} />
          <MetricCard label={ti.mensualite} value={fmt(result.mensualite) + ' ₪'} />
          <MetricCard label={
            <Tooltip content={t.tooltips.tri}>
              {ti.tri}
            </Tooltip>
          } value={fmtPct(result.tri, 1)} accent />
          <MetricCard label={`${ti.prixSortie} +${inputs.horizon} ${ti.ans}`} value={fmtM(result.prixSortie)} />
          <MetricCard label={ti.gainTotal} value={fmtM(result.gainTotal)} />
        </div>

        <SectionTitle>{ti.cashflow}</SectionTitle>
        <DataTable rows={[
          { label: ti.loyerBrut,    value: '+' + fmt(inputs.loyer) + ' ₪' },
          { label: ti.vacanceRow,   value: '-' + fmt(Math.round(inputs.loyer * inputs.vacance / 100)) + ' ₪', accent: 'neg' },
          { label: ti.chargesRow,   value: '-' + fmt(Math.round(inputs.charges / 12)) + ' ₪', accent: 'neg' },
          { label: ti.mensualiteRow,value: '-' + fmt(result.mensualite) + ' ₪', accent: 'neg' },
          { label: ti.cfRow, value: (cfPos ? '+' : '') + fmt(Math.round(result.cfMensuel)) + ' ₪', accent: cfPos ? 'pos' : 'neg', bold: true },
        ]} />

        <SectionTitle>{ti.projection} {inputs.horizon} {ti.ans}</SectionTitle>

        {/* Line chart */}
        <div className="bg-neutral-50 rounded-xl p-3 mb-3">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <XAxis dataKey="annee" tick={{ fontSize: 10, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} tickFormatter={v => v + 'k₪'} width={48} />
              <ReTooltip formatter={(v) => [(v as number).toLocaleString('fr-FR') + 'k₪']} />
              <ReferenceLine y={0} stroke="#D8D7D3" />
              <Line type="monotone" dataKey="valeur"  stroke="#0E1B2A" strokeWidth={2} dot={{ r: 2 }} name="Valeur bien" />
              <Line type="monotone" dataKey="cfCumul" stroke="#0F7B6C" strokeWidth={2} dot={{ r: 2 }} strokeDasharray="4 2" name="CF cumulé" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <DataTable rows={result.projection.map(p => ({
          label:  `+${p.annee} ${ti.ans}`,
          value:  fmtM(p.valeur) + ' | CF: ' + (p.cfCumul >= 0 ? '+' : '') + fmtM(p.cfCumul),
          accent: p.cfCumul >= 0 ? 'pos' : 'neg',
        }))} />
      </div>
    </div>
  )
}

// ── PromoteurTab ───────────────────────────────────────────────────────────────

const DONUT_COLORS = ['#993C1D','#0E1B2A','#534AB7','#E2761A','#0F6E56','#0F7B6C']

export const PromoteurTab: React.FC = () => {
  const { inputs, result, set } = usePromoteur()
  const { t } = useLang()
  const tp = t.promoteur

  useEffect(() => {
    setReportSection('promoteur', { inputs, result })
  }, [inputs, result])

  const donutData = [
    { name: tp.terrain,       value: inputs.coutTerrain,           color: DONUT_COLORS[0] },
    { name: tp.construction,  value: result.coutConst,             color: DONUT_COLORS[1] },
    { name: tp.honoraires,    value: result.frais,                 color: DONUT_COLORS[2] },
    { name: tp.commerc,       value: result.commerc,               color: DONUT_COLORS[3] },
    { name: tp.portage,       value: result.portage,               color: DONUT_COLORS[4] },
    { name: tp.margeBrute,    value: Math.max(0, result.margeBrute), color: DONUT_COLORS[5] },
  ].filter(d => d.value > 0)

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <SectionTitle>{tp.projet}</SectionTitle>
        <NumberField label={tp.surfTerrain} value={inputs.surfTerrain} step={100} onChange={v => set('surfTerrain', v)} />
        <div className="mb-3">
          <label className="block text-xs text-neutral-500 mb-1">
            <Tooltip content={t.tooltips.cos}>
              {tp.cos}
            </Tooltip>
          </label>
          <input type="range" min={1} max={8} step={0.5} value={inputs.cos}
            onChange={e => set('cos', parseFloat(e.target.value))}
            className="w-full" style={{ ['--val' as string]: `${((inputs.cos - 1) / (8 - 1)) * 100}%` }}
            aria-label={tp.cos} />
          <div className="text-right text-xs font-medium tabular-nums mt-0.5">{inputs.cos}</div>
        </div>
        <SliderField label={tp.ratioVend} min={60} max={90} step={1}
          value={inputs.ratioVend} display={inputs.ratioVend + '%'} onChange={v => set('ratioVend', v)} />
        <NumberField label={tp.prixVente} value={inputs.prixVente} step={500} onChange={v => set('prixVente', v)} />

        <SectionTitle>{tp.couts}</SectionTitle>
        <NumberField label={tp.coutTerrain} value={inputs.coutTerrain} step={100000} onChange={v => set('coutTerrain', v)} />
        <NumberField label={tp.coutConst}   value={inputs.coutConst}   step={100}    onChange={v => set('coutConst', v)} />
        <SliderField label={tp.tauxFrais}   min={5}  max={20} step={1}
          value={inputs.tauxFrais}   display={inputs.tauxFrais   + '%'} onChange={v => set('tauxFrais', v)} />
        <SliderField label={tp.tauxCommerc} min={1}  max={6}  step={0.5}
          value={inputs.tauxCommerc} display={inputs.tauxCommerc + '%'} onChange={v => set('tauxCommerc', v)} />
        <SliderField label={tp.tauxPortage} min={2}  max={12} step={0.5}
          value={inputs.tauxPortage} display={inputs.tauxPortage + '%'} onChange={v => set('tauxPortage', v)} />
      </div>

      <div>
        <SectionTitle>{tp.resultats}</SectionTitle>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <MetricCard label={tp.ca}          value={fmtM(result.ca)} />
          <MetricCard label={tp.margeBrute}  value={fmtM(result.margeBrute)} accent={result.margeBrute > 0} />
          <MetricCard label={tp.tauxMargeCA} value={fmtPct(result.margePct, 1)} />
          <MetricCard label={tp.margeCout}   value={fmtPct(result.margeSurCout, 1)} />
          <MetricCard label={tp.surfVend}    value={fmt(result.surfVendable) + ' m²'} />
          <MetricCard label={tp.prixRevient} value={fmt(result.prixRevientM2) + ' ₪/m²'} />
        </div>

        {/* Donut chart */}
        <div className="bg-neutral-50 rounded-xl p-3 mb-4">
          <div className="flex justify-center">
            <PieChart width={200} height={170}>
              <Pie data={donutData} cx={100} cy={85} innerRadius={48} outerRadius={80} dataKey="value" paddingAngle={2}>
                {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <ReTooltip formatter={(v) => [fmtM(v as number)]} />
            </PieChart>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-1">
            {donutData.map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-neutral-600">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color }} />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        <SectionTitle>{tp.structure}</SectionTitle>
        <DataTable rows={[
          { label: tp.terrain,      value: '-' + fmtM(inputs.coutTerrain),   accent: 'neg' },
          { label: tp.construction, value: '-' + fmtM(result.coutConst),     accent: 'neg' },
          { label: tp.honoraires,   value: '-' + fmtM(result.frais),         accent: 'neg' },
          { label: tp.commerc,      value: '-' + fmtM(result.commerc),       accent: 'neg' },
          { label: tp.portage,      value: '-' + fmtM(result.portage),       accent: 'neg' },
          { label: tp.caRow,        value: '+' + fmtM(result.ca),            accent: 'pos', bold: true },
          { label: tp.margeBrute,   value: (result.margeBrute >= 0 ? '+' : '') + fmtM(result.margeBrute), accent: result.margeBrute >= 0 ? 'pos' : 'neg', bold: true },
        ]} />

        <SectionTitle>{tp.sensib}</SectionTitle>
        <DataTable rows={result.sensitivity.map(s => ({
          label:  (s.variation >= 0 ? '+' : '') + s.variation + '% ' + tp.prixVente.split(' ')[0],
          value:  fmtM(s.ca) + ' → ' + fmtM(s.marge) + ' (' + s.pct.toFixed(1) + '%)',
          accent: s.marge >= 0 ? 'pos' : 'neg',
          bold:   s.variation === 0,
        }))} />
      </div>
    </div>
  )
}
