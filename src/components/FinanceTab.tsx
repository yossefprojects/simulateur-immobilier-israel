import React from 'react'
import { fmt, fmtM, fmtPct } from '../utils/formatters'
import { useInvestisseur } from '../hooks/useInvestisseur'
import { usePromoteur } from '../hooks/usePromoteur'
import { useLang } from '../i18n/LanguageContext'
import { DataTable, MetricCard, NumberField, SectionTitle, SliderField } from './ui'

// ─── InvestisseurTab ──────────────────────────────────────────────────────────

export const InvestisseurTab: React.FC = () => {
  const { inputs, result, set } = useInvestisseur()
  const { t } = useLang()
  const ti = t.investisseur
  const cfPos = result.cfMensuel >= 0

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <SectionTitle>{ti.bienFin}</SectionTitle>
        <NumberField label={ti.prixAchat} value={inputs.prix} step={50000} onChange={v => set('prix', v)} />
        <SliderField label={ti.apport} min={25} max={100} step={5}
          value={inputs.apport} display={inputs.apport + '%'} onChange={v => set('apport', v)} />
        <SliderField label={ti.taux} min={3} max={8} step={0.1}
          value={inputs.taux} display={inputs.taux + '%'} onChange={v => set('taux', v)} />
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
          <MetricCard label={ti.tri}        value={fmtPct(result.tri, 1)} accent />
          <MetricCard label={`${ti.prixSortie} +${inputs.horizon} ${ti.ans}`} value={fmtM(result.prixSortie)} />
          <MetricCard label={ti.gainTotal}  value={fmtM(result.gainTotal)} />
        </div>

        <SectionTitle>{ti.cashflow}</SectionTitle>
        <DataTable rows={[
          { label: ti.loyerBrut,    value: '+' + fmt(inputs.loyer) + ' ₪' },
          { label: ti.vacanceRow,   value: '-' + fmt(Math.round(inputs.loyer * inputs.vacance / 100)) + ' ₪', accent: 'neg' },
          { label: ti.chargesRow,   value: '-' + fmt(Math.round(inputs.charges / 12)) + ' ₪', accent: 'neg' },
          { label: ti.mensualiteRow,value: '-' + fmt(result.mensualite) + ' ₪', accent: 'neg' },
          { label: ti.cfRow,        value: (cfPos ? '+' : '') + fmt(Math.round(result.cfMensuel)) + ' ₪', accent: cfPos ? 'pos' : 'neg', bold: true },
        ]} />

        <SectionTitle>{ti.projection} {inputs.horizon} {ti.ans}</SectionTitle>
        <DataTable rows={result.projection.map(p => ({
          label:  `+${p.annee} ${ti.ans}`,
          value:  fmtM(p.valeur) + ' | CF: ' + (p.cfCumul >= 0 ? '+' : '') + fmtM(p.cfCumul),
          accent: p.cfCumul >= 0 ? 'pos' : 'neg',
        }))} />
      </div>
    </div>
  )
}

// ─── PromoteurTab ─────────────────────────────────────────────────────────────

export const PromoteurTab: React.FC = () => {
  const { inputs, result, set } = usePromoteur()
  const { t } = useLang()
  const tp = t.promoteur

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <SectionTitle>{tp.projet}</SectionTitle>
        <NumberField label={tp.surfTerrain} value={inputs.surfTerrain} step={100} onChange={v => set('surfTerrain', v)} />
        <SliderField label={tp.cos} min={1} max={8} step={0.5}
          value={inputs.cos} display={String(inputs.cos)} onChange={v => set('cos', v)} />
        <SliderField label={tp.ratioVend} min={60} max={90} step={1}
          value={inputs.ratioVend} display={inputs.ratioVend + '%'} onChange={v => set('ratioVend', v)} />
        <NumberField label={tp.prixVente} value={inputs.prixVente} step={500} onChange={v => set('prixVente', v)} />

        <SectionTitle>{tp.couts}</SectionTitle>
        <NumberField label={tp.coutTerrain}  value={inputs.coutTerrain} step={100000} onChange={v => set('coutTerrain', v)} />
        <NumberField label={tp.coutConst}    value={inputs.coutConst}   step={100}    onChange={v => set('coutConst', v)} />
        <SliderField label={tp.tauxFrais} min={5} max={20} step={1}
          value={inputs.tauxFrais} display={inputs.tauxFrais + '%'} onChange={v => set('tauxFrais', v)} />
        <SliderField label={tp.tauxCommerc} min={1} max={6} step={0.5}
          value={inputs.tauxCommerc} display={inputs.tauxCommerc + '%'} onChange={v => set('tauxCommerc', v)} />
        <SliderField label={tp.tauxPortage} min={2} max={12} step={0.5}
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
