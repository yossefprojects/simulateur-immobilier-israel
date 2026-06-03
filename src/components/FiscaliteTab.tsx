import React, { useState } from 'react'
import { fmt, fmtM } from '../utils/formatters'
import { useLang } from '../i18n/LanguageContext'
import { SectionTitle, DataTable } from './ui'

// ── Mas Rechisha tranches 2025 ─────────────────────────────────────────────────
type Statut = 'resident' | 'etranger' | 'ole'
interface Tranche { jusqu_a: number; taux: number }

const TRANCHES_RESIDENT: Tranche[] = [
  { jusqu_a: 1_978_745,  taux: 0.000 },
  { jusqu_a: 2_347_040,  taux: 0.035 },
  { jusqu_a: 6_055_070,  taux: 0.050 },
  { jusqu_a: 20_183_565, taux: 0.080 },
  { jusqu_a: Infinity,   taux: 0.100 },
]
const TRANCHES_ETRANGER: Tranche[] = [
  { jusqu_a: 6_055_070, taux: 0.080 },
  { jusqu_a: Infinity,  taux: 0.100 },
]

function calcMasRechisha(prix: number, statut: Statut) {
  if (statut === 'ole') {
    const montant = prix * 0.005
    return { tranches: [{ label: '0.5% (Olé hadash)', montant }], total: montant }
  }
  const tranches = statut === 'etranger' ? TRANCHES_ETRANGER : TRANCHES_RESIDENT
  let prev = 0, total = 0
  const rows: { label: string; montant: number }[] = []
  for (const t of tranches) {
    if (prix <= prev) break
    const base = Math.min(prix, t.jusqu_a) - prev
    if (base <= 0) { prev = t.jusqu_a; continue }
    const montant = base * t.taux
    total += montant
    if (montant > 0) rows.push({ label: `${(t.taux * 100).toFixed(1)}% sur ${fmt(base)} ₪`, montant })
    prev = t.jusqu_a
  }
  return { tranches: rows, total }
}

// ── Mas Shevach ────────────────────────────────────────────────────────────────
function calcMasShevach(prixAchat: number, prixVente: number, anneeAchat: number, residencePrincipale: boolean) {
  const plusValue = prixVente - prixAchat
  if (plusValue <= 0) return { plusValue: 0, impot: 0, exonere: false }
  const duree = new Date().getFullYear() - anneeAchat
  const exonere = residencePrincipale && duree >= 1
  let impot = exonere ? 0 : plusValue * 0.25
  if (anneeAchat < 2014 && !exonere) {
    const anneesAvant2014 = 2014 - anneeAchat
    const totalAnnees     = new Date().getFullYear() - anneeAchat
    const ratioExonere    = totalAnnees > 0 ? anneesAvant2014 / totalAnnees : 0
    impot = plusValue * (1 - ratioExonere) * 0.25
  }
  return { plusValue, impot, exonere }
}

// ── Arnona ─────────────────────────────────────────────────────────────────────
const ARNONA_RATES: Record<string, { min: number; max: number }> = {
  tel_aviv:   { min: 120, max: 180 },
  herzliya:   { min: 90,  max: 140 },
  jerusalem:  { min: 80,  max: 120 },
  netanya:    { min: 70,  max: 110 },
  bat_yam:    { min: 75,  max: 115 },
  ben_shemen: { min: 60,  max: 100 },
  autre:      { min: 60,  max: 100 },
}

// ── Component ──────────────────────────────────────────────────────────────────
export const FiscaliteTab: React.FC = () => {
  const { t } = useLang()
  const tf = t.fiscalite

  const [prixAchat, setPrixAchat] = useState(2_500_000)
  const [statut,    setStatut]    = useState<Statut>('resident')
  const [sVente,    setSVente]    = useState(3_500_000)
  const [sAchat,    setSAchat]    = useState(2_000_000)
  const [sAnnee,    setSAnnee]    = useState(2015)
  const [sRP,       setSRP]       = useState(false)
  const [aVille,    setAVille]    = useState('tel_aviv')
  const [aSurface,  setASurface]  = useState(80)

  const arnonaVilleLabels: Record<string, string> = {
    tel_aviv:  tf.arnonaVTelAviv,
    herzliya:  tf.arnonaVHerzliya,
    jerusalem: tf.arnonaVJerusalem,
    netanya:   tf.arnonaVNetanya,
    bat_yam:   tf.arnonaVBatYam,
    ben_shemen: tf.arnonaVBenShemen,
    autre:     tf.arnonaVAutre,
  }

  const rechisha  = calcMasRechisha(prixAchat, statut)
  const shevach   = calcMasShevach(sAchat, sVente, sAnnee, sRP)
  const arnonRate = ARNONA_RATES[aVille] ?? ARNONA_RATES['autre']
  const arnonMin  = aSurface * arnonRate.min
  const arnonMax  = aSurface * arnonRate.max
  const totalMin  = rechisha.total + shevach.impot + arnonMin
  const totalPct  = prixAchat > 0 ? (rechisha.total / prixAchat) * 100 : 0

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* ── LEFT ── */}
      <div>
        <SectionTitle>{tf.masRecTitle}</SectionTitle>
        <div className="mb-3">
          <label className="block text-xs text-neutral-500 mb-1">{tf.prixAchat}</label>
          <input type="number" value={prixAchat} step={50000}
            onChange={e => setPrixAchat(Number(e.target.value) || 0)}
            className="w-full rounded border border-neutral-200 px-3 py-1.5 text-sm" />
        </div>
        <div className="mb-4">
          <label className="block text-xs text-neutral-500 mb-1">{tf.statut}</label>
          <div className="relative">
            <select value={statut} onChange={e => setStatut(e.target.value as Statut)}
              className="w-full appearance-none rounded border border-neutral-200 bg-white pl-3 pr-10 py-1.5 text-sm">
              <option value="resident">{tf.statutResident}</option>
              <option value="etranger">{tf.statutEtranger}</option>
              <option value="ole">{tf.statutOle}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>

        <SectionTitle>{tf.masShevTitle}</SectionTitle>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">{tf.prixAchat}</label>
            <input type="number" value={sAchat} step={50000}
              onChange={e => setSAchat(Number(e.target.value) || 0)}
              className="w-full rounded border border-neutral-200 px-3 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">{tf.prixVente}</label>
            <input type="number" value={sVente} step={50000}
              onChange={e => setSVente(Number(e.target.value) || 0)}
              className="w-full rounded border border-neutral-200 px-3 py-1.5 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">{tf.anneeAchat}</label>
            <input type="number" value={sAnnee} min={1990} max={2025}
              onChange={e => setSAnnee(Number(e.target.value) || 2015)}
              className="w-full rounded border border-neutral-200 px-3 py-1.5 text-sm" />
          </div>
          <div className="flex items-end pb-1.5">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={sRP} onChange={e => setSRP(e.target.checked)} className="accent-primary" />
              {tf.residPrincipale}
            </label>
          </div>
        </div>

        <SectionTitle>{tf.arnonaTitle}</SectionTitle>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">{tf.ville}</label>
            <div className="relative">
              <select value={aVille} onChange={e => setAVille(e.target.value)}
                className="w-full appearance-none rounded border border-neutral-200 bg-white pl-3 pr-10 py-1.5 text-sm">
                {Object.keys(ARNONA_RATES).map(k => (
                  <option key={k} value={k}>{arnonaVilleLabels[k]}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">{tf.surface}</label>
            <input type="number" value={aSurface} step={5}
              onChange={e => setASurface(Number(e.target.value) || 80)}
              className="w-full rounded border border-neutral-200 px-3 py-1.5 text-sm" />
          </div>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div>
        <SectionTitle>{tf.masRecResult}</SectionTitle>
        <div className="border border-neutral-100 rounded-xl p-4 mb-4">
          <DataTable rows={[
            ...rechisha.tranches.map(r => ({ label: r.label, value: fmt(Math.round(r.montant)) + ' ₪', accent: 'neg' as const })),
            { label: tf.totalMasRec, value: fmt(Math.round(rechisha.total)) + ' ₪', accent: 'neg' as const, bold: true },
            { label: tf.pctPrix,     value: totalPct.toFixed(2) + '%', bold: true },
          ]} />
        </div>

        <SectionTitle>{tf.masShevResult}</SectionTitle>
        <div className="border border-neutral-100 rounded-xl p-4 mb-4">
          {shevach.plusValue <= 0 ? (
            <p className="text-sm text-neutral-400">{tf.noPlusValue}</p>
          ) : shevach.exonere ? (
            <div className="text-sm text-success font-medium">{tf.exonere}</div>
          ) : (
            <DataTable rows={[
              { label: tf.plusValueBrute, value: '+' + fmtM(shevach.plusValue), accent: 'pos' as const },
              { label: tf.tauxShevach,    value: '25%' },
              { label: tf.impotEstime,    value: fmt(Math.round(shevach.impot)) + ' ₪', accent: 'neg' as const, bold: true },
              ...(sAnnee < 2014 ? [{ label: tf.linear, value: '' }] : []),
            ]} />
          )}
        </div>

        <SectionTitle>{tf.arnonaResult}</SectionTitle>
        <div className="border border-neutral-100 rounded-xl p-4 mb-4">
          <DataTable rows={[
            { label: tf.tauxMoyen, value: `${arnonRate.min} – ${arnonRate.max} ₪/m²/an` },
            { label: tf.arnonaMin, value: fmt(Math.round(arnonMin)) + ' ₪/an' },
            { label: tf.arnonaMax, value: fmt(Math.round(arnonMax)) + ' ₪/an', accent: 'neg' },
          ]} />
        </div>

        <SectionTitle>{tf.totalTitle}</SectionTitle>
        <div className={`rounded-xl p-4 mb-4 ${totalPct > 10 ? 'bg-red-50 border border-red-200' : 'bg-emerald-50 border border-emerald-200'}`}>
          <div className={`text-xs font-medium mb-1 ${totalPct > 10 ? 'text-red-700' : 'text-success'}`}>
            {totalPct > 10 ? tf.chargesElevees : tf.chargesRaison}
          </div>
          <div className="font-display text-2xl font-semibold">{fmtM(Math.round(totalMin))}</div>
          <div className="text-xs text-neutral-500 mt-1">{tf.totalSub}</div>
        </div>

        <SectionTitle>{tf.olimTitle}</SectionTitle>
        <div className="space-y-2 text-sm">
          {[tf.olimB1, tf.olimB2, tf.olimB3, tf.olimB4].map((item, i) => (
            <div key={i} className="text-neutral-700 bg-neutral-50 rounded-lg px-3 py-2">{item}</div>
          ))}
          <div className="flex gap-3 mt-3">
            <a href="https://www.nbn.org.il" target="_blank" rel="noopener noreferrer"
              className="text-xs text-primary hover:underline">→ Nefesh B'Nefesh</a>
            <a href="https://www.jewishagency.org" target="_blank" rel="noopener noreferrer"
              className="text-xs text-primary hover:underline">→ Jewish Agency</a>
          </div>
        </div>
      </div>
    </div>
  )
}
