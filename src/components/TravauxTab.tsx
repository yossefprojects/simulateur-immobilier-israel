import React, { useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { SelectField, SliderField, SectionTitle, ResultBox } from './ui'

// ── Données de référence (stables, sans labels) ───────────────────────────────

const NIVEAUX_DATA = [
  { value: 'rafraichissement', min: 1200, max: 2200,  roi: 6,  color: '#E5F0FF', colorText: '#0E1B2A' },
  { value: 'standard',        min: 2500, max: 4500,  roi: 13, color: '#EAF3DE', colorText: '#27500A' },
  { value: 'lourde',          min: 5000, max: 8000,  roi: 20, color: '#FAEEDA', colorText: '#633806' },
  { value: 'luxe',            min: 9000, max: 14000, roi: 15, color: '#F3EAF8', colorText: '#4A1070' },
]

const POSTES_DATA = [
  { key: 'demolition',  pct: 0.09, emoji: '🔨' },
  { key: 'gros_oeuvre', pct: 0.08, emoji: '🧱' },
  { key: 'elec',        pct: 0.12, emoji: '⚡' },
  { key: 'plomberie',   pct: 0.10, emoji: '🔧' },
  { key: 'cuisine',     pct: 0.17, emoji: '🍳' },
  { key: 'sdb',         pct: 0.13, emoji: '🚿' },
  { key: 'sols',        pct: 0.10, emoji: '🪵' },
  { key: 'menuiserie',  pct: 0.11, emoji: '🚪' },
  { key: 'finitions',   pct: 0.10, emoji: '🖌️' },
]

const VILLES_COEF: Record<string, number> = {
  tel_aviv:    1.35,
  herzliya:    1.25,
  jerusalem:   1.15,
  raanana:     1.10,
  netanya:     1.00,
  haifa:       0.95,
  petah_tikva: 0.92,
  rishon:      0.95,
  beer_sheva:  0.85,
  ashkelon:    0.80,
  bat_yam:     1.05,
  ben_shemen:  1.00,
}

const VILLES_LABELS: Record<string, string> = {
  tel_aviv:    'Tel Aviv',
  herzliya:    'Herzliya Pituach',
  jerusalem:   'Jérusalem',
  raanana:     "Ra'anana / Kfar Saba",
  netanya:     'Netanya',
  haifa:       'Haïfa',
  petah_tikva: 'Petah Tikva',
  rishon:      'Rishon LeZion',
  beer_sheva:  'Beer Sheva',
  ashkelon:    'Ashkelon',
  bat_yam:     'Bat Yam',
  ben_shemen:  'Ben Shemen',
}

const VILLES_LABELS_HE: Record<string, string> = {
  tel_aviv:    'תל אביב',
  herzliya:    'הרצליה פיתוח',
  jerusalem:   'ירושלים',
  raanana:     'רעננה / כפר סבא',
  netanya:     'נתניה',
  haifa:       'חיפה',
  petah_tikva: 'פתח תקווה',
  rishon:      'ראשון לציון',
  beer_sheva:  'באר שבע',
  ashkelon:    'אשקלון',
  bat_yam:     'בת ים',
  ben_shemen:  'בן שמן',
}

const ACCES_DATA = [
  { value: 'facile',    coef: 1.00 },
  { value: 'moyen',     coef: 1.06 },
  { value: 'difficile', coef: 1.14 },
]

const ETAT_DATA = [
  { value: 'tres_bon', coef: 0.85 },
  { value: 'bon',      coef: 1.00 },
  { value: 'usage',    coef: 1.18 },
  { value: 'degrade',  coef: 1.38 },
]

// risques indexés par seuil d'année
const RISQUES_DATA = [
  { avant: 1960, coef: 1.30, risks: ['risk1','risk2','risk3'] as const },
  { avant: 1990, coef: 1.20, risks: ['risk4','risk5','risk6'] as const },
  { avant: 2000, coef: 1.10, risks: ['risk7','risk8','risk9'] as const },
  { avant: 9999, coef: 1.00, risks: [] as const },
]

type RiskKey = 'risk1'|'risk2'|'risk3'|'risk4'|'risk5'|'risk6'|'risk7'|'risk8'|'risk9'

// ── Utilitaires ───────────────────────────────────────────────────────────────

const fmt  = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)
const fmtM = (n: number) => `${(n / 1000).toFixed(0)}K₪`

// ── SourceCard ────────────────────────────────────────────────────────────────

const FIABILITE_CONFIG: Record<string, { bg: string; color: string }> = {
  confirmé: { bg: '#EAF3DE', color: '#27500A' },
  estimé:   { bg: '#FAEEDA', color: '#633806' },
  terrain:  { bg: '#E6F1FB', color: '#0C447C' },
}

interface SourceCardProps {
  fiabilite: 'confirmé' | 'estimé' | 'terrain'
  langLabel: string
  titre: string
  url: string | null
  date: string | null
  donnees: string[]
}

const SourceCard: React.FC<SourceCardProps> = ({ fiabilite, langLabel, titre, url, date, donnees }) => {
  const cfg = FIABILITE_CONFIG[fiabilite]
  return (
    <div style={{ background: 'white', border: '0.5px solid #E5E7EB', borderRadius: 10, padding: '12px 14px' }}>
      <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: cfg.bg, color: cfg.color, marginBottom: 6 }}>
        {langLabel}
      </span>
      <div style={{ marginBottom: 6 }}>
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: '#0E1B2A', textDecoration: 'none' }}>
            {titre} ↗
          </a>
        ) : (
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0E1B2A' }}>{titre}</span>
        )}
        {date && <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 6 }}>{date}</span>}
      </div>
      <ul style={{ paddingLeft: 14, margin: 0 }}>
        {donnees.map((d, i) => (
          <li key={i} style={{ fontSize: 11, color: '#4B5563', marginBottom: 3, lineHeight: 1.4 }}>{d}</li>
        ))}
      </ul>
    </div>
  )
}

// ── CoefBadge ─────────────────────────────────────────────────────────────────

const CoefBadge: React.FC<{ num: string; label: string; value: string; coef: number }> = ({ num, label, value, coef }) => {
  const isAbove = coef > 1.01
  const isBelow = coef < 0.99
  const bg    = (!isAbove && !isBelow) ? '#F3F4F6' : isAbove ? '#FAEEDA' : '#EAF3DE'
  const color = (!isAbove && !isBelow) ? '#4B5563' : isAbove ? '#633806' : '#27500A'
  return (
    <div style={{ background: bg, border: `0.5px solid ${isAbove ? '#F3D49A' : isBelow ? '#B5D89A' : '#E5E7EB'}`, borderRadius: 10, padding: '10px 14px', flex: '1 1 160px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#0E1B2A', marginBottom: 4, opacity: 0.7 }}>COEF {num}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#0E1B2A', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 6, lineHeight: 1.3 }}>{value}</div>
      <div style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color, background: 'white', borderRadius: 6, padding: '2px 8px', border: `0.5px solid ${isAbove ? '#F3D49A' : isBelow ? '#B5D89A' : '#E5E7EB'}` }}>
        ×{coef.toFixed(2)}
      </div>
    </div>
  )
}

// ── TravauxTab ────────────────────────────────────────────────────────────────

export const TravauxTab: React.FC = () => {
  const { t, lang } = useLang()
  const tw = t.travaux

  const villeLabel  = (k: string) => lang === 'he' ? (VILLES_LABELS_HE[k] ?? VILLES_LABELS[k]) : VILLES_LABELS[k]
  const fiabLabel   = (key: string) =>
    key === 'confirmé' ? tw.fiabiliteConfirme :
    key === 'estimé'   ? tw.fiabiliteEstime :
    tw.fiabiliteTerrain

  const [surface,  setSurface]  = useState(80)
  const [niveau,   setNiveau]   = useState('standard')
  const [ville,    setVille]    = useState('tel_aviv')
  const [annee,    setAnnee]    = useState(1990)
  const [acces,    setAcces]    = useState('moyen')
  const [etatInit, setEtatInit] = useState('bon')

  // Labels traduits depuis t.travaux
  const niveauLabels: Record<string, { label: string; desc: string }> = {
    rafraichissement: { label: tw.rafLabel,   desc: tw.rafDesc   },
    standard:         { label: tw.stdLabel,   desc: tw.stdDesc   },
    lourde:           { label: tw.lourdLabel, desc: tw.lourdDesc },
    luxe:             { label: tw.luxeLabel,  desc: tw.luxeDesc  },
  }

  const posteLabels: Record<string, string> = {
    demolition:  tw.posteDemo,
    gros_oeuvre: tw.posteGros,
    elec:        tw.posteElec,
    plomberie:   tw.postePlo,
    cuisine:     tw.posteCui,
    sdb:         tw.posteSdb,
    sols:        tw.posteSols,
    menuiserie:  tw.posteMenu,
    finitions:   tw.posteFin,
  }

  const riskLabelMap: Record<number, string> = {
    1960: tw.riskLabel1960,
    1990: tw.riskLabel1990,
    2000: tw.riskLabel2000,
    9999: tw.riskLabelPost,
  }

  const riskTextMap: Record<RiskKey, string> = {
    risk1: tw.risk1, risk2: tw.risk2, risk3: tw.risk3,
    risk4: tw.risk4, risk5: tw.risk5, risk6: tw.risk6,
    risk7: tw.risk7, risk8: tw.risk8, risk9: tw.risk9,
  }

  const accesLabels: Record<string, string> = {
    facile:    tw.accesFacile,
    moyen:     tw.accesMoyen,
    difficile: tw.accesDiff,
  }

  const etatLabels: Record<string, string> = {
    tres_bon: tw.etatTresBon,
    bon:      tw.etatBon,
    usage:    tw.etatUsage,
    degrade:  tw.etatDegrade,
  }

  const niveauData  = NIVEAUX_DATA.find(n => n.value === niveau) ?? NIVEAUX_DATA[1]
  const coefVille   = VILLES_COEF[ville] ?? 1
  const risqueData  = RISQUES_DATA.find(r => annee < r.avant) ?? RISQUES_DATA[RISQUES_DATA.length - 1]
  const accesData   = ACCES_DATA.find(a => a.value === acces) ?? ACCES_DATA[1]
  const etatData    = ETAT_DATA.find(e => e.value === etatInit) ?? ETAT_DATA[1]
  const coefTotal   = coefVille * risqueData.coef * accesData.coef * etatData.coef

  const minTotal = Math.round(niveauData.min * surface * coefTotal)
  const maxTotal = Math.round(niveauData.max * surface * coefTotal)
  const midTotal = Math.round((minTotal + maxTotal) / 2)

  const riskLabel = riskLabelMap[risqueData.avant]

  return (
    <div>
      {/* ── Sélecteur niveau (cards visuelles) ── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#0E1B2A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          {tw.niveauTitle} <span style={{ color: '#0F7B6C' }}>— {tw.niveauRequired}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {NIVEAUX_DATA.map(n => {
            const nl = niveauLabels[n.value]
            return (
              <button
                key={n.value}
                onClick={() => setNiveau(n.value)}
                style={{
                  flex: '1 1 160px', padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                  textAlign: 'left', transition: 'all 0.15s',
                  background: niveau === n.value ? n.color : 'white',
                  border: niveau === n.value ? `2px solid ${n.colorText}` : '1.5px solid #E5E7EB',
                  opacity: niveau === n.value ? 1 : 0.75,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: n.colorText, marginBottom: 2 }}>{nl.label}</div>
                <div style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.35 }}>{nl.desc}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: n.colorText, marginTop: 5 }}>
                  {n.min.toLocaleString()}–{n.max.toLocaleString()} ₪/m²
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Grille principale ── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Colonne gauche */}
        <div>
          <SectionTitle>{tw.parametres}</SectionTitle>

          <SliderField
            label={tw.surfaceLabel}
            min={20} max={400} step={5}
            value={surface}
            display={`${surface} m²`}
            onChange={setSurface}
          />

          <SelectField
            label={tw.coef1}
            value={ville}
            options={Object.entries(VILLES_COEF).map(([k, v]) => ({ value: k, label: `${villeLabel(k)}  (×${v.toFixed(2)})` }))}
            onChange={setVille}
          />

          <SliderField
            label={tw.coef2}
            min={1930} max={2024} step={5}
            value={annee}
            display={`${annee} · ×${risqueData.coef.toFixed(2)}`}
            onChange={setAnnee}
          />

          <SelectField
            label={tw.coef3}
            value={acces}
            options={ACCES_DATA.map(a => ({ value: a.value, label: `${accesLabels[a.value]}  (×${a.coef.toFixed(2)})` }))}
            onChange={setAcces}
          />

          <SelectField
            label={tw.coef4}
            value={etatInit}
            options={ETAT_DATA.map(e => ({ value: e.value, label: `${etatLabels[e.value]}  (×${e.coef.toFixed(2)})` }))}
            onChange={setEtatInit}
          />

          {risqueData.risks.length > 0 && (
            <div className="mt-4 rounded-lg p-3" style={{ background: '#FAEEDA', border: '0.5px solid #F3D49A' }}>
              <div className="text-xs font-semibold mb-1.5" style={{ color: '#633806' }}>
                ⚠️ {tw.risquesTitle} — {riskLabel}
              </div>
              <ul className="space-y-1">
                {(risqueData.risks as unknown as RiskKey[]).map((r, i) => (
                  <li key={i} className="text-xs" style={{ color: '#633806' }}>• {riskTextMap[r]}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Colonne droite */}
        <div>
          <SectionTitle>{tw.budgetTitle}</SectionTitle>

          <ResultBox
            label={tw.budgetLabel}
            main={`${fmtM(minTotal)} – ${fmtM(maxTotal)}`}
            sub={`${tw.valeurCentrale} : ${fmt(midTotal)} ₪  ·  ${fmt(Math.round(midTotal / surface))} ₪/m²`}
            badges={[
              { text: `${tw.coefTotalBadge} ×${coefTotal.toFixed(2)}`, color: 'bg-amber-50 text-amber-700' },
              { text: `${tw.baseBadge} ${niveauData.min.toLocaleString()}–${niveauData.max.toLocaleString()} ₪/m²`, color: 'bg-neutral-100 text-neutral-600' },
            ]}
          />

          <div className="mt-3 rounded-lg p-3" style={{ background: niveauData.color, border: `0.5px solid ${niveauData.colorText}30` }}>
            <div className="text-xs font-semibold mb-1" style={{ color: niveauData.colorText }}>
              {tw.impactTitle}
            </div>
            <div className="text-xs" style={{ color: niveauData.colorText }}>
              {niveauLabels[niveau].label} → {tw.valorisation} <strong>+{niveauData.roi}%</strong>{' '}
              (Deal Estate Israel 2025–2026)
            </div>
          </div>

          <p style={{ fontSize: 11, color: '#6B7280', marginTop: 10, lineHeight: 1.5, borderLeft: '2px solid #0F7B6C', paddingLeft: 8 }}>
            {tw.mentionLegal}{' '}
            <strong style={{ color: '#0E1B2A' }}>{tw.mentionBold}</strong>
          </p>

          <SectionTitle>{tw.decomp}</SectionTitle>
          <div className="space-y-1.5">
            {POSTES_DATA.map(p => {
              const montant = Math.round(midTotal * p.pct)
              return (
                <div key={p.key}>
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="text-neutral-600">{posteLabels[p.key]}</span>
                    <span className="tabular-nums font-medium text-neutral-800">{fmt(montant)} ₪</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.round(p.pct * 100)}%`, background: '#0F7B6C', opacity: 0.65 + p.pct * 1.5 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Récapitulatif des 4 coefficients ── */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#0E1B2A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          {tw.coefSection}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <CoefBadge num="1" label={tw.coef1Name} value={villeLabel(ville)} coef={coefVille} />
          <CoefBadge num="2" label={tw.coef2Name} value={riskLabel}            coef={risqueData.coef} />
          <CoefBadge num="3" label={tw.coef3Name} value={accesLabels[acces].split('—')[0].trim()} coef={accesData.coef} />
          <CoefBadge num="4" label={tw.coef4Name} value={etatLabels[etatInit].split('—')[0].trim()} coef={etatData.coef} />
          <div style={{ background: '#0E1B2A', color: 'white', borderRadius: 10, padding: '10px 14px', flex: '1 1 160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.7, marginBottom: 4 }}>{tw.coefTotalNum}</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>×{coefTotal.toFixed(2)}</div>
            <div style={{ fontSize: 10, opacity: 0.65, marginTop: 2 }}>
              {coefTotal > 1.3 ? tw.alertSurcout : coefTotal < 0.95 ? tw.alertFavorable : tw.alertStandard}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION SOURCES ── */}
      <div style={{ marginTop: '2rem', borderTop: '0.5px solid #E5E7EB', paddingTop: '1.5rem' }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, color: '#0E1B2A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
          {tw.sourcesTitle}
        </h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          {Object.entries(FIABILITE_CONFIG).map(([key, cfg]) => (
            <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280' }}>
              <span style={{ display: 'inline-block', padding: '1px 6px', borderRadius: 4, fontWeight: 600, fontSize: 10, background: cfg.bg, color: cfg.color }}>{fiabLabel(key)}</span>
            </span>
          ))}
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>{tw.sourcesFiabilite}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          <SourceCard fiabilite="confirmé" langLabel={fiabLabel('confirmé')} titre="AllBatim.co.il"
            url="https://allbatim.com/fr/guides/cout-renovation-israel"
            date={lang === 'he' ? 'עדכון אפריל 2026' : 'Updated April 2026'}
            donnees={lang === 'he'
              ? ['רענון: 1,200–2,200 ₪/מ"ר','סטנדרטי: 2,500–4,500 ₪/מ"ר','שיפוץ כבד: 5,000–8,000 ₪/מ"ר','מטבח חדש: 30,000–80,000 ₪','חדר רחצה: 20,000–50,000 ₪']
              : lang === 'en'
              ? ['Refresh: 1,200–2,200 ₪/m²','Standard: 2,500–4,500 ₪/m²','Heavy reno: 5,000–8,000 ₪/m²','New kitchen: 30,000–80,000 ₪','Bathroom: 20,000–50,000 ₪']
              : ['Rafraîchissement : 1 200–2 200 ₪/m²','Standard : 2 500–4 500 ₪/m²','Rénovation lourde : 5 000–8 000 ₪/m²','Cuisine neuve : 30 000–80 000 ₪','Salle de bain : 20 000–50 000 ₪']} />

          <SourceCard fiabilite="confirmé" langLabel={fiabLabel('confirmé')} titre="DealEstateIsrael.com"
            url="https://dealestateisrael.com/renovation-costs-israel/" date="2025–2026"
            donnees={lang === 'he'
              ? ['קוסמטי: 1,000–2,500 ₪/מ"ר','סטנדרטי מלא: 3,000–5,500 ₪/מ"ר','שיפוץ מלא (Gut): 6,000–9,000 ₪/מ"ר','יוקרה: 9,000–14,000+ ₪/מ"ר','90מ"ר סטנדרטי = 270,000–450,000 ₪','ROI ירושלים מחודשת: 18–25% ב-18 חודשים']
              : lang === 'en'
              ? ['Cosmetic: 1,000–2,500 ₪/m²','Full standard: 3,000–5,500 ₪/m²','Gut renovation: 6,000–9,000 ₪/m²','Luxury: 9,000–14,000+ ₪/m²','90m² standard = 270,000–450,000 ₪','Jerusalem renovated ROI: 18–25% in 18 months']
              : ['Cosmétique : 1 000–2 500 ₪/m²','Standard complet : 3 000–5 500 ₪/m²','Gut renovation : 6 000–9 000 ₪/m²','Luxe : 9 000–14 000+ ₪/m²','90m² standard = 270 000–450 000 ₪','ROI Jérusalem rénové : 18–25% en 18 mois']} />

          <SourceCard fiabilite="confirmé" langLabel={fiabLabel('confirmé')} titre="Kablay.co.il"
            url="https://kablay.co.il/en/category/renovation/prices" date="2026"
            donnees={lang === 'he'
              ? ['פלטפורמת קבלנים ישראלית — טבלאות מחירים ישירות','משרד "תורנקי" (כולל מיזוג): החל מ-3,600 ₪/מ"ר','מחירי ייחוס המשמשים קבלנים מקומיים','הריסה חלקית: 150–400 ₪/מ"ר','שלד / בטון מזוין: 500–900 ₪/מ"ר']
              : lang === 'en'
              ? ['Israeli contractor platform — direct pricing tables','Turnkey office (HVAC incl.): from 3,600 ₪/m²','Reference pricing used by local contractors','Partial demolition: 150–400 ₪/m²','Shell / reinforced concrete: 500–900 ₪/m²']
              : ['Plateforme artisans israéliens — grilles tarifaires directes','Bureau turnkey (HVAC inclus) : à partir de 3 600 ₪/m²','Référence terrain utilisée par les kablanim locaux','Démolition partielle : 150–400 ₪/m²','Gros œuvre / béton armé : 500–900 ₪/m²']} />

          <SourceCard fiabilite="confirmé" langLabel={fiabLabel('confirmé')} titre="Marshanski.com"
            url="https://marshanski.com/timeline-and-cost-comparison-building-new-vs-renovating-existing-homes-in-israel/"
            date={lang === 'he' ? 'מרץ 2026' : 'March 2026'}
            donnees={lang === 'he'
              ? ['שיפוץ מלא (Gut): 4,000–9,000 ₪/מ"ר','ממצאי הריסה (בניינים ישנים): +15 עד +30%','לפני 1960: סיכון אסבסט — גג, ריצוף, בידוד','לפני 1990: לוחות חשמל ישנים, צנרת ברזל, לחות','לפני 2000: עמידות רעידות אדמה חלקית, זגוגית בודדת']
              : lang === 'en'
              ? ['Gut renovation: 4,000–9,000 ₪/m²','Demolition discoveries (old buildings): +15 to +30%','Before 1960: asbestos risk — roof, tiles, insulation','Before 1990: outdated panels, iron pipes, dampness','Before 2000: partial seismic compliance, single-pane']
              : ['Gut renovation : 4 000–9 000 ₪/m²','Découvertes démolition (bâtiments anciens) : +15 à +30%','Avant 1960 : risque amiante — toiture, carrelage, isolations','Avant 1990 : tableaux vétustes, plomberie fonte, humidité','Avant 2000 : parasismique partiel, simple vitrage']} />

          <SourceCard fiabilite="terrain" langLabel={fiabLabel('terrain')}
            titre={lang === 'he' ? 'Reddit r/aliyah + משקיעים בשטח' : 'Reddit r/aliyah + field investors'}
            url="https://www.reddit.com/r/aliyah/comments/1ttu0fm/" date="2024–2025"
            donnees={lang === 'he'
              ? ['תקציב אמיתי 20–30% מעל ההצעה: תופעה נפוצה מאוד','אפקט מדד הבנייה: השפעה על פרויקטים ארוכי טווח','פערי הצעות בין קבלנים: עד ×2 לאותו פרויקט','אבן ירושלים פרמיום: 300–600 ₪/מ"ר','החלפת חיווט לתלת-פאזי: 25,000–50,000 ₪']
              : lang === 'en'
              ? ['Real budget 20–30% over quote: very common','Madad index effect: impact on long projects','Quote spread between contractors: up to ×2','Premium Jerusalem stone: 300–600 ₪/m²','3-phase rewiring: 25,000–50,000 ₪']
              : ['Budget réel 20–30% au-dessus du devis : très fréquent','Effet Madad (index construction) : impact sur chantiers longs','Écarts de devis entre kablanim : jusqu\'à ×2 pour le même chantier','Sols Pierre de Jérusalem haut de gamme : 300–600 ₪/m²','Électricité tri-phasé en remplacement : 25 000–50 000 ₪']} />

          <SourceCard fiabilite="estimé" langLabel={fiabLabel('estimé')}
            titre={lang === 'he' ? 'מקדמים מחושבים (ללא מקור ישיר)' : lang === 'en' ? 'Extrapolated coefficients (no direct source)' : 'Coefficients extrapolés (sans source directe)'}
            url={null} date={null}
            donnees={lang === 'he'
              ? ['מקדם מיקום ×0.80–1.35: נגזר מפערי מחיר/מ"ר בין ערים','מקדם גיל ×1.00–1.30: מבוסס על עלויות נוספות Marshanski ו-AllBatim','מקדם נגישות ×1.00–1.14: הערכה סבירה BTP','מקדם מצב ראשוני ×0.85–1.38: מחושב מ-benchmarks קבלנים','חלוקת 9 סעיפים (מטבח 17%, חדר רחצה 13%…): נוהג BTP ישראלי']
              : lang === 'en'
              ? ['Location coef. ×0.80–1.35: derived from price/m² gaps between cities','Age coef. ×1.00–1.30: based on Marshanski & AllBatim overruns','Accessibility coef. ×1.00–1.14: reasoned construction estimate','Initial condition coef. ×0.85–1.38: from contractor benchmarks','9-item breakdown (kitchen 17%, bathroom 13%…): Israeli construction practice']
              : ['Coef. localisation ×0.80–1.35 : déduits des écarts de prix au m² entre villes','Coef. âge ×1.00–1.30 : basé sur les surcoûts Marshanski et AllBatim','Coef. accessibilité ×1.00–1.14 : estimation raisonnée BTP','Coef. état initial ×0.85–1.38 : extrapolé depuis benchmarks kablanim','Répartition 9 postes (cuisine 17%, SDB 13%…) : pratique BTP israélienne']} />
        </div>

        <div style={{ marginTop: '1rem', background: '#FAEEDA', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#633806', lineHeight: 1.6 }}>
          <strong>{lang === 'he' ? 'חשוב:' : lang === 'en' ? 'Important:' : 'Important :'}</strong>{' '}
          {tw.sourceImportant}{' '}
          <strong>{tw.avertissementBold}</strong>
        </div>
      </div>
    </div>
  )
}
