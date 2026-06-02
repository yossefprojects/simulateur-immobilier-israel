import React from 'react'
import { fmt, fmtM, fmtPct } from '../utils/formatters'
import { useInvestisseur } from '../hooks/useInvestisseur'
import { usePromoteur } from '../hooks/usePromoteur'
import { DataTable, MetricCard, NumberField, SectionTitle, SliderField } from './ui'

// ─── InvestisseurTab ──────────────────────────────────────────────────────────

export const InvestisseurTab: React.FC = () => {
  const { inputs, result, set } = useInvestisseur()
  const cfPos = result.cfMensuel >= 0

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <SectionTitle>Bien et financement</SectionTitle>
        <NumberField label="Prix d'achat (₪)" value={inputs.prix} step={50000} onChange={v => set('prix', v)} />
        <SliderField label="Apport personnel (%)" min={25} max={100} step={5}
          value={inputs.apport} display={inputs.apport + '%'} onChange={v => set('apport', v)} />
        <SliderField label="Taux hypothécaire (%)" min={3} max={8} step={0.1}
          value={inputs.taux} display={inputs.taux + '%'} onChange={v => set('taux', v)} />
        <SliderField label="Durée du prêt (années)" min={10} max={30} step={1}
          value={inputs.duree} display={inputs.duree + ' ans'} onChange={v => set('duree', v)} />

        <SectionTitle>Revenus locatifs</SectionTitle>
        <NumberField label="Loyer mensuel (₪)" value={inputs.loyer} step={500} onChange={v => set('loyer', v)} />
        <SliderField label="Taux de vacance (%)" min={0} max={20} step={1}
          value={inputs.vacance} display={inputs.vacance + '%'} onChange={v => set('vacance', v)} />
        <NumberField label="Charges annuelles (₪)" value={inputs.charges} step={1000} onChange={v => set('charges', v)} />
        <SliderField label="Revalorisation annuelle (%)" min={0} max={8} step={0.5}
          value={inputs.reval} display={inputs.reval + '%'} onChange={v => set('reval', v)} />
        <SliderField label="Horizon (années)" min={3} max={20} step={1}
          value={inputs.horizon} display={inputs.horizon + ' ans'} onChange={v => set('horizon', v)} />
      </div>

      <div>
        <SectionTitle>Résultats</SectionTitle>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <MetricCard label="Rendement brut"   value={fmtPct(result.rendBrut)} />
          <MetricCard label="Rendement net"    value={fmtPct(result.rendNet)} />
          <MetricCard label="Mensualité crédit" value={fmt(result.mensualite) + ' ₪'} />
          <MetricCard label="TRI estimé"        value={fmtPct(result.tri, 1)} accent />
          <MetricCard label={`Prix sortie +${inputs.horizon}ans`} value={fmtM(result.prixSortie)} />
          <MetricCard label="Gain total"         value={fmtM(result.gainTotal)} />
        </div>

        <SectionTitle>Cash-flow mensuel</SectionTitle>
        <DataTable rows={[
          { label: 'Loyer mensuel brut',   value: '+' + fmt(inputs.loyer) + ' ₪' },
          { label: 'Vacance locative',      value: '-' + fmt(Math.round(inputs.loyer * inputs.vacance / 100)) + ' ₪', accent: 'neg' },
          { label: 'Charges mensualisées', value: '-' + fmt(Math.round(inputs.charges / 12)) + ' ₪', accent: 'neg' },
          { label: 'Mensualité crédit',    value: '-' + fmt(result.mensualite) + ' ₪', accent: 'neg' },
          { label: 'Cash-flow mensuel',    value: (cfPos ? '+' : '') + fmt(Math.round(result.cfMensuel)) + ' ₪', accent: cfPos ? 'pos' : 'neg', bold: true },
        ]} />

        <SectionTitle>Projection sur {inputs.horizon} ans</SectionTitle>
        <DataTable rows={result.projection.map(p => ({
          label:  `+${p.annee} ans`,
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

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <SectionTitle>Projet de promotion</SectionTitle>
        <NumberField label="Surface terrain (m²)"   value={inputs.surfTerrain} step={100} onChange={v => set('surfTerrain', v)} />
        <SliderField label="COS" min={1} max={8} step={0.5}
          value={inputs.cos} display={String(inputs.cos)} onChange={v => set('cos', v)} />
        <SliderField label="Ratio surface vendable (%)" min={60} max={90} step={1}
          value={inputs.ratioVend} display={inputs.ratioVend + '%'} onChange={v => set('ratioVend', v)} />
        <NumberField label="Prix de vente moyen (₪/m²)" value={inputs.prixVente} step={500} onChange={v => set('prixVente', v)} />

        <SectionTitle>Coûts</SectionTitle>
        <NumberField label="Coût terrain (₪)" value={inputs.coutTerrain} step={100000} onChange={v => set('coutTerrain', v)} />
        <NumberField label="Coût construction (₪/m²)" value={inputs.coutConst} step={100} onChange={v => set('coutConst', v)} />
        <SliderField label="Frais techniques et honoraires (%)" min={5} max={20} step={1}
          value={inputs.tauxFrais} display={inputs.tauxFrais + '%'} onChange={v => set('tauxFrais', v)} />
        <SliderField label="Commercialisation (%)" min={1} max={6} step={0.5}
          value={inputs.tauxCommerc} display={inputs.tauxCommerc + '%'} onChange={v => set('tauxCommerc', v)} />
        <SliderField label="Portage financier (%)" min={2} max={12} step={0.5}
          value={inputs.tauxPortage} display={inputs.tauxPortage + '%'} onChange={v => set('tauxPortage', v)} />
      </div>

      <div>
        <SectionTitle>Résultats du bilan</SectionTitle>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <MetricCard label="CA prévisionnel"     value={fmtM(result.ca)} />
          <MetricCard label="Marge brute"         value={fmtM(result.margeBrute)} accent={result.margeBrute > 0} />
          <MetricCard label="Taux de marge / CA"  value={fmtPct(result.margePct, 1)} />
          <MetricCard label="Marge / coût total"  value={fmtPct(result.margeSurCout, 1)} />
          <MetricCard label="Surface vendable"    value={fmt(result.surfVendable) + ' m²'} />
          <MetricCard label="Prix revient / m²"   value={fmt(result.prixRevientM2) + ' ₪/m²'} />
        </div>

        <SectionTitle>Structure du bilan</SectionTitle>
        <DataTable rows={[
          { label: 'Terrain',            value: '-' + fmtM(inputs.coutTerrain), accent: 'neg' },
          { label: 'Construction',       value: '-' + fmtM(result.coutConst),   accent: 'neg' },
          { label: 'Honoraires',         value: '-' + fmtM(result.frais),       accent: 'neg' },
          { label: 'Commercialisation',  value: '-' + fmtM(result.commerc),     accent: 'neg' },
          { label: 'Portage financier',  value: '-' + fmtM(result.portage),     accent: 'neg' },
          { label: "Chiffre d'affaires", value: '+' + fmtM(result.ca),          accent: 'pos', bold: true },
          { label: 'Marge brute',        value: (result.margeBrute >= 0 ? '+' : '') + fmtM(result.margeBrute), accent: result.margeBrute >= 0 ? 'pos' : 'neg', bold: true },
        ]} />

        <SectionTitle>Sensibilité prix de vente</SectionTitle>
        <DataTable rows={result.sensitivity.map(s => ({
          label:  (s.variation >= 0 ? '+' : '') + s.variation + '% prix vente',
          value:  fmtM(s.ca) + ' → ' + fmtM(s.marge) + ' (' + s.pct.toFixed(1) + '%)',
          accent: s.marge >= 0 ? 'pos' : 'neg',
          bold:   s.variation === 0,
        }))} />
      </div>
    </div>
  )
}
