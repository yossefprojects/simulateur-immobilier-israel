import React, { useState } from 'react'
import { fmt, fmtM } from '../utils/formatters'
import { SectionTitle, DataTable } from './ui'

// ── Mas Rechisha tranches 2025 ────────────────────────────────────────────────
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

function calcMasRechisha(prix: number, statut: Statut): { tranches: { label: string; montant: number }[]; total: number } {
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

// ── Mas Shevach ───────────────────────────────────────────────────────────────
function calcMasShevach(prixAchat: number, prixVente: number, anneeAchat: number, residencePrincipale: boolean) {
  const plusValue = prixVente - prixAchat
  if (plusValue <= 0) return { plusValue: 0, impot: 0, exonere: false }
  const duree = new Date().getFullYear() - anneeAchat
  const exonere = residencePrincipale && duree >= 1
  let impot = exonere ? 0 : plusValue * 0.25
  // Linearisation pre-2014 (simplifiée)
  if (anneeAchat < 2014 && !exonere) {
    const anneesAvant2014 = 2014 - anneeAchat
    const totalAnnees     = new Date().getFullYear() - anneeAchat
    const ratioExonere    = totalAnnees > 0 ? anneesAvant2014 / totalAnnees : 0
    impot = plusValue * (1 - ratioExonere) * 0.25
  }
  return { plusValue, impot, exonere }
}

// ── Arnona ────────────────────────────────────────────────────────────────────
const ARNONA_RATES: Record<string, { min: number; max: number }> = {
  'Tel Aviv':    { min: 120, max: 180 },
  'Herzliya':   { min: 90,  max: 140 },
  'Jérusalem':  { min: 80,  max: 120 },
  'Netanya':    { min: 70,  max: 110 },
  'Autre':      { min: 60,  max: 100 },
}

// ── Component ─────────────────────────────────────────────────────────────────
export const FiscaliteTab: React.FC = () => {
  // Mas Rechisha
  const [prixAchat, setPrixAchat] = useState(2_500_000)
  const [statut, setStatut]       = useState<Statut>('resident')

  // Mas Shevach
  const [sVente,    setSVente]    = useState(3_500_000)
  const [sAchat,    setSAchat]    = useState(2_000_000)
  const [sAnnee,    setSAnnee]    = useState(2015)
  const [sRP,       setSRP]       = useState(false)

  // Arnona
  const [aVille,   setAVille]    = useState('Tel Aviv')
  const [aSurface, setASurface]  = useState(80)

  const rechisha  = calcMasRechisha(prixAchat, statut)
  const shevach   = calcMasShevach(sAchat, sVente, sAnnee, sRP)
  const arnonRate = ARNONA_RATES[aVille] ?? ARNONA_RATES['Autre']
  const arnonMin  = aSurface * arnonRate.min
  const arnonMax  = aSurface * arnonRate.max
  const totalMin  = rechisha.total + (shevach.impot) + arnonMin
  const totalPct  = prixAchat > 0 ? (rechisha.total / prixAchat) * 100 : 0

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* ── LEFT ── */}
      <div>
        {/* Mas Rechisha */}
        <SectionTitle>Mas Rechisha — Taxe d'achat 2025</SectionTitle>
        <div className="mb-3">
          <label className="block text-xs text-neutral-500 mb-1">Prix d'achat (₪)</label>
          <input type="number" value={prixAchat} step={50000}
            onChange={e => setPrixAchat(Number(e.target.value) || 0)}
            className="w-full rounded border border-neutral-200 px-3 py-1.5 text-sm" />
        </div>
        <div className="mb-4">
          <label className="block text-xs text-neutral-500 mb-1">Statut de l'acquéreur</label>
          <select value={statut} onChange={e => setStatut(e.target.value as Statut)}
            className="w-full appearance-none rounded border border-neutral-200 bg-white ps-3 pe-8 py-1.5 text-sm">
            <option value="resident">Résident (premier bien)</option>
            <option value="etranger">Non-résident (Zar)</option>
            <option value="ole">Olé Hadash (7 ans post-Aliyah)</option>
          </select>
        </div>

        {/* Mas Shevach */}
        <SectionTitle>Mas Shevach — Plus-value immobilière</SectionTitle>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Prix d'achat (₪)</label>
            <input type="number" value={sAchat} step={50000}
              onChange={e => setSAchat(Number(e.target.value) || 0)}
              className="w-full rounded border border-neutral-200 px-3 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Prix de vente (₪)</label>
            <input type="number" value={sVente} step={50000}
              onChange={e => setSVente(Number(e.target.value) || 0)}
              className="w-full rounded border border-neutral-200 px-3 py-1.5 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Année d'achat</label>
            <input type="number" value={sAnnee} min={1990} max={2025}
              onChange={e => setSAnnee(Number(e.target.value) || 2015)}
              className="w-full rounded border border-neutral-200 px-3 py-1.5 text-sm" />
          </div>
          <div className="flex items-end pb-1.5">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={sRP} onChange={e => setSRP(e.target.checked)} className="accent-primary" />
              Résidence principale
            </label>
          </div>
        </div>

        {/* Arnona */}
        <SectionTitle>Arnona — Taxe foncière annuelle</SectionTitle>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Ville</label>
            <select value={aVille} onChange={e => setAVille(e.target.value)}
              className="w-full appearance-none rounded border border-neutral-200 bg-white ps-3 pe-8 py-1.5 text-sm">
              {Object.keys(ARNONA_RATES).map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Surface (m²)</label>
            <input type="number" value={aSurface} step={5}
              onChange={e => setASurface(Number(e.target.value) || 80)}
              className="w-full rounded border border-neutral-200 px-3 py-1.5 text-sm" />
          </div>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div>
        {/* Mas Rechisha result */}
        <SectionTitle>Résultat Mas Rechisha</SectionTitle>
        <div className="border border-neutral-100 rounded-xl p-4 mb-4">
          <DataTable rows={[
            ...rechisha.tranches.map(r => ({ label: r.label, value: fmt(Math.round(r.montant)) + ' ₪', accent: 'neg' as const })),
            { label: 'Total Mas Rechisha', value: fmt(Math.round(rechisha.total)) + ' ₪', accent: 'neg' as const, bold: true },
            { label: '% du prix',          value: totalPct.toFixed(2) + '%', bold: true },
          ]} />
        </div>

        {/* Mas Shevach result */}
        <SectionTitle>Résultat Mas Shevach</SectionTitle>
        <div className="border border-neutral-100 rounded-xl p-4 mb-4">
          {shevach.plusValue <= 0 ? (
            <p className="text-sm text-neutral-400">Pas de plus-value (vente à perte).</p>
          ) : shevach.exonere ? (
            <div className="text-sm text-success font-medium">✓ Exonéré (résidence principale)</div>
          ) : (
            <DataTable rows={[
              { label: 'Plus-value brute',    value: '+' + fmtM(shevach.plusValue), accent: 'pos' as const },
              { label: 'Taux Mas Shevach',    value: '25%' },
              { label: 'Impôt estimé',        value: fmt(Math.round(shevach.impot)) + ' ₪', accent: 'neg' as const, bold: true },
              { label: sAnnee < 2014 ? 'Linéarisation pré-2014 appliquée' : '', value: '' },
            ].filter(r => r.label)} />
          )}
        </div>

        {/* Arnona result */}
        <SectionTitle>Arnona annuelle estimée</SectionTitle>
        <div className="border border-neutral-100 rounded-xl p-4 mb-4">
          <DataTable rows={[
            { label: 'Taux moyen',         value: `${arnonRate.min} – ${arnonRate.max} ₪/m²/an` },
            { label: 'Arnona min.',        value: fmt(Math.round(arnonMin)) + ' ₪/an' },
            { label: 'Arnona max.',        value: fmt(Math.round(arnonMax)) + ' ₪/an', accent: 'neg' },
          ]} />
        </div>

        {/* Total & badge */}
        <SectionTitle>Total des taxes à prévoir</SectionTitle>
        <div className={`rounded-xl p-4 mb-4 ${totalPct > 10 ? 'bg-red-50 border border-red-200' : 'bg-emerald-50 border border-emerald-200'}`}>
          <div className={`text-xs font-medium mb-1 ${totalPct > 10 ? 'text-red-700' : 'text-success'}`}>
            {totalPct > 10 ? '⚠ Charges fiscales élevées (> 10%)' : '✓ Charges fiscales raisonnables'}
          </div>
          <div className="font-display text-2xl font-semibold">{fmtM(Math.round(totalMin))}</div>
          <div className="text-xs text-neutral-500 mt-1">Mas Rechisha + Mas Shevach (si applicable) + Arnona min.</div>
        </div>

        {/* Olim advantages */}
        <SectionTitle>Avantages Olim Hadashim</SectionTitle>
        <div className="space-y-2 text-sm">
          {[
            '✓ Mas Rechisha : 0,5% sur le 1er bien (valable 7 ans post-Aliyah)',
            '✓ Réduction droits de douane sur effets personnels',
            '✓ Sal Klita (subvention absorption) : ~25 000 ₪/an pendant 1 an',
            '✓ Exonérations d\'impôt sur revenus étrangers (10 ans)',
          ].map((item, i) => (
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
