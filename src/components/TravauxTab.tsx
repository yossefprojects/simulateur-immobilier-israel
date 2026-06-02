import React, { useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { SelectField, SliderField, SectionTitle, ResultBox } from './ui'

// ── Données de référence ────────────────────────────────────────────────────

const NIVEAUX = [
  { value: 'rafraichissement', label: 'Rafraîchissement (peinture, sols légers)', min: 1500, max: 2500 },
  { value: 'moyen',            label: 'Rénovation moyenne (cuisine, SDB, revêtements)', min: 2500, max: 4000 },
  { value: 'complet',          label: 'Rénovation complète (tout corps d\'état)', min: 4000, max: 6000 },
  { value: 'gut',              label: 'Gut renovation (restructuration totale)', min: 6000, max: 8500 },
  { value: 'luxe',             label: 'Rénovation luxe (matériaux premium)', min: 9000, max: 12000 },
]

const VILLES_COEF: Record<string, { label: string; coef: number }> = {
  tel_aviv:      { label: 'Tel Aviv',              coef: 1.35 },
  herzliya:      { label: 'Herzliya Pituach',      coef: 1.25 },
  jerusalem:     { label: 'Jérusalem',             coef: 1.15 },
  raanana:       { label: 'Ra\'anana / Kfar Saba', coef: 1.10 },
  netanya:       { label: 'Netanya',               coef: 1.00 },
  haifa:         { label: 'Haïfa',                 coef: 0.95 },
  beer_sheva:    { label: 'Beer Sheva',             coef: 0.85 },
  petah_tikva:   { label: 'Petah Tikva',           coef: 0.92 },
  rishon:        { label: 'Rishon LeZion',         coef: 0.95 },
  ashkelon:      { label: 'Ashkelon',              coef: 0.80 },
}

const POSTES = [
  { key: 'cuisine',    label: 'Cuisine',           pct: 0.20, emoji: '🍳' },
  { key: 'sdb',        label: 'Salle(s) de bain',  pct: 0.15, emoji: '🚿' },
  { key: 'revetements',label: 'Revêtements (sols/murs)', pct: 0.18, emoji: '🪵' },
  { key: 'elec',       label: 'Électricité',       pct: 0.12, emoji: '⚡' },
  { key: 'plomberie',  label: 'Plomberie',         pct: 0.10, emoji: '🔧' },
  { key: 'menuiserie', label: 'Menuiserie / portes',pct: 0.10, emoji: '🚪' },
  { key: 'peinture',   label: 'Peinture',          pct: 0.08, emoji: '🖌️' },
  { key: 'divers',     label: 'Divers / imprévus', pct: 0.07, emoji: '📦' },
]

const ANNEES_RISQUE: { avant: number; label: string; surcoût: number; risques: string[] }[] = [
  {
    avant: 1960,
    label: 'Avant 1960',
    surcoût: 0.30,
    risques: ['Risque amiante élevé (toiture, carrelage)', 'Plomberie en plomb possible', 'Structure à expertiser'],
  },
  {
    avant: 1990,
    label: '1960–1990',
    surcoût: 0.20,
    risques: ['Possible amiante dans les isolations', 'Tableaux électriques vétustes', 'Plomberie fonte'],
  },
  {
    avant: 2000,
    label: '1990–2000',
    surcoût: 0.10,
    risques: ['Normes parasismiques partielles', 'Humidité possible', 'Fenêtres simple vitrage'],
  },
  {
    avant: 9999,
    label: 'Après 2000',
    surcoût: 0.00,
    risques: [],
  },
]

function getRisque(annee: number) {
  return ANNEES_RISQUE.find(r => annee < r.avant) ?? ANNEES_RISQUE[ANNEES_RISQUE.length - 1]
}

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)
const fmtM = (n: number) => `${(n / 1000).toFixed(0)}K₪`

// ── SourceCard ──────────────────────────────────────────────────────────────

const FIABILITE_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  confirmé: { label: '✓ Confirmé',           bg: '#EAF3DE', color: '#27500A' },
  estimé:   { label: '~ Estimé / extrapolé', bg: '#FAEEDA', color: '#633806' },
  terrain:  { label: '↗ Retour terrain',     bg: '#E6F1FB', color: '#0C447C' },
}

interface SourceCardProps {
  fiabilite: 'confirmé' | 'estimé' | 'terrain'
  titre: string
  url: string | null
  date: string | null
  donnees: string[]
}

const SourceCard: React.FC<SourceCardProps> = ({ fiabilite, titre, url, date, donnees }) => {
  const cfg = FIABILITE_CONFIG[fiabilite]
  return (
    <div style={{ background: 'white', border: '0.5px solid #E5E7EB', borderRadius: 10, padding: '12px 14px' }}>
      <span style={{
        display: 'inline-block', fontSize: 10, fontWeight: 600,
        padding: '2px 7px', borderRadius: 4,
        background: cfg.bg, color: cfg.color, marginBottom: 6,
      }}>
        {cfg.label}
      </span>
      <div style={{ marginBottom: 6 }}>
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 13, fontWeight: 600, color: '#1A3A5C', textDecoration: 'none' }}>
            {titre} ↗
          </a>
        ) : (
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1A3A5C' }}>{titre}</span>
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

// ── TravauxTab ──────────────────────────────────────────────────────────────

export const TravauxTab: React.FC = () => {
  const { lang } = useLang()

  const [surface,   setSurface]   = useState(80)
  const [niveau,    setNiveau]    = useState('moyen')
  const [ville,     setVille]     = useState('tel_aviv')
  const [annee,     setAnnee]     = useState(1990)
  const [sansAscenseur, setSansAscenseur] = useState(false)

  const niveauData = NIVEAUX.find(n => n.value === niveau) ?? NIVEAUX[1]
  const villeData  = VILLES_COEF[ville]
  const risque     = getRisque(annee)

  const coefComplexite = sansAscenseur ? 1.05 : 1.00
  const coefRisque     = 1 + risque.surcoût

  const minTotal = Math.round(niveauData.min * surface * villeData.coef * coefComplexite * coefRisque)
  const maxTotal = Math.round(niveauData.max * surface * villeData.coef * coefComplexite * coefRisque)
  const midTotal = Math.round((minTotal + maxTotal) / 2)

  const roiPct = niveau === 'luxe' ? 15 : niveau === 'gut' ? 22 : niveau === 'complet' ? 18 : niveau === 'moyen' ? 12 : 6

  const isRtl = lang === 'he'

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ── Grille principale ── */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Colonne gauche — Paramètres */}
        <div>
          <SectionTitle>Paramètres du chantier</SectionTitle>

          <SliderField
            label="Surface à rénover (m²)"
            min={20} max={400} step={5}
            value={surface}
            display={`${surface} m²`}
            onChange={setSurface}
          />

          <SelectField
            label="Niveau de rénovation"
            value={niveau}
            options={NIVEAUX.map(n => ({ value: n.value, label: n.label }))}
            onChange={setNiveau}
          />

          <SelectField
            label="Ville"
            value={ville}
            options={Object.entries(VILLES_COEF).map(([k, v]) => ({ value: k, label: v.label }))}
            onChange={setVille}
          />

          <SliderField
            label="Année de construction du bâtiment"
            min={1930} max={2024} step={5}
            value={annee}
            display={String(annee)}
            onChange={setAnnee}
          />

          <div className="mb-3 flex items-center gap-2">
            <input
              type="checkbox"
              id="sansAscenseur"
              checked={sansAscenseur}
              onChange={e => setSansAscenseur(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="sansAscenseur" className="text-xs text-neutral-500 cursor-pointer">
              Accès difficile (sans ascenseur, étages élevés, voie étroite) +5%
            </label>
          </div>

          {/* Risques bâtiment */}
          {risque.risques.length > 0 && (
            <div className="mt-4 rounded-lg p-3" style={{ background: '#FAEEDA', border: '0.5px solid #F3D49A' }}>
              <div className="text-xs font-semibold mb-1.5" style={{ color: '#633806' }}>
                ⚠️ Risques bâtiment ({risque.label})
              </div>
              <ul className="space-y-1">
                {risque.risques.map((r, i) => (
                  <li key={i} className="text-xs" style={{ color: '#633806' }}>• {r}</li>
                ))}
              </ul>
              {risque.surcoût > 0 && (
                <div className="text-xs font-semibold mt-2" style={{ color: '#633806' }}>
                  Surcoût estimé intégré : +{Math.round(risque.surcoût * 100)}%
                </div>
              )}
            </div>
          )}
        </div>

        {/* Colonne droite — Résultats */}
        <div>
          <SectionTitle>Estimation du budget</SectionTitle>

          <ResultBox
            label="Budget estimé (fourchette)"
            main={`${fmtM(minTotal)} – ${fmtM(maxTotal)}`}
            sub={`Valeur centrale : ${fmt(midTotal)} ₪ · ${fmt(Math.round(midTotal / surface))} ₪/m²`}
            badges={[
              { text: `Coef. ville ×${villeData.coef.toFixed(2)}`, color: 'bg-blue-50 text-blue-700' },
              { text: `${niveauData.min.toLocaleString()}–${niveauData.max.toLocaleString()} ₪/m² base`, color: 'bg-neutral-100 text-neutral-600' },
            ]}
          />

          {/* Mention légale courte */}
          <p style={{
            fontSize: 11, color: '#6B7280', marginTop: 8, lineHeight: 1.5,
            borderLeft: '2px solid #C9A84C', paddingLeft: 8,
          }}>
            Estimation indicative basée sur AllBatim, Deal Estate Israel et Kablay (2025–2026).
            Les écarts réels peuvent atteindre ±20–30% selon le kablan.{' '}
            <strong style={{ color: '#1A3A5C' }}>Obtenez au minimum 3 devis.</strong>
          </p>

          {/* Décomposition par poste */}
          <SectionTitle>Décomposition par poste</SectionTitle>
          <div className="space-y-1.5">
            {POSTES.map(p => {
              const montant = Math.round(midTotal * p.pct)
              const largeur = Math.round(p.pct * 100)
              return (
                <div key={p.key}>
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="text-neutral-600">{p.emoji} {p.label}</span>
                    <span className="tabular-nums font-medium text-neutral-800">{fmt(montant)} ₪</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${largeur}%`, background: '#C9A84C', opacity: 0.7 + p.pct * 0.3 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* ROI après travaux */}
          <div className="mt-4 rounded-lg p-3" style={{ background: '#EAF3DE', border: '0.5px solid #B5D89A' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#27500A' }}>
              📈 Impact sur la valeur du bien après travaux
            </div>
            <div className="text-xs" style={{ color: '#27500A' }}>
              Niveau <strong>{niveauData.label.split('(')[0].trim()}</strong> →{' '}
              valorisation estimée <strong>+{roiPct}%</strong> selon les données Deal Estate Israel (Jerusalem 18–25% en 18 mois).
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION SOURCES ── */}
      <div style={{ marginTop: '2rem', borderTop: '0.5px solid #E5E7EB', paddingTop: '1.5rem' }}>

        <h3 style={{
          fontSize: 12, fontWeight: 600, color: '#1A3A5C',
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem',
        }}>
          Sources et niveau de fiabilité des estimations
        </h3>

        {/* Légende */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          {Object.entries(FIABILITE_CONFIG).map(([key, cfg]) => (
            <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280' }}>
              <span style={{
                display: 'inline-block', padding: '1px 6px', borderRadius: 4,
                fontWeight: 600, fontSize: 10, background: cfg.bg, color: cfg.color,
              }}>
                {cfg.label}
              </span>
            </span>
          ))}
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>— niveau de fiabilité de chaque donnée</span>
        </div>

        {/* Grille de cartes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>

          <SourceCard
            fiabilite="confirmé"
            titre="AllBatim.co.il"
            url="https://allbatim.com/fr/guides/cout-renovation-israel"
            date="Mis à jour avril 2026"
            donnees={[
              'Rafraîchissement : 1 500–2 500 ₪/m²',
              'Rénovation moyenne : 2 500–4 000 ₪/m²',
              'Rénovation complète : 4 000–6 000 ₪/m²',
              'Cuisine neuve : 30 000–80 000 ₪',
              'Salle de bain : 20 000–50 000 ₪',
            ]}
          />

          <SourceCard
            fiabilite="confirmé"
            titre="DealEstateIsrael.com"
            url="https://dealestateisrael.com/renovation-costs-israel/"
            date="2025"
            donnees={[
              'Cosmétique : 1 000–2 500 ₪/m²',
              'Standard complet : 3 000–5 500 ₪/m²',
              'Gut renovation : 6 000–8 500 ₪/m²',
              'Luxe : 9 000–12 000+ ₪/m²',
              '90m² standard = 270 000–450 000 ₪',
              'ROI Jérusalem rénové : 18–25% en 18 mois',
            ]}
          />

          <SourceCard
            fiabilite="confirmé"
            titre="Kablay.co.il"
            url="https://kablay.co.il/en/category/renovation/prices"
            date="2026"
            donnees={[
              'Plateforme artisans israéliens avec grilles tarifaires directes',
              'Bureau complet turnkey (HVAC inclus) : à partir de 3 600 ₪/m²',
              'Référence terrain utilisée par les entrepreneurs locaux',
            ]}
          />

          <SourceCard
            fiabilite="confirmé"
            titre="Marshanski.com"
            url="https://marshanski.com/timeline-and-cost-comparison-building-new-vs-renovating-existing-homes-in-israel/"
            date="Mars 2026"
            donnees={[
              'Gut renovation : 4 000–9 000 ₪/m²',
              'Découvertes en démolition (bâtiments anciens) : +15 à +30% du budget',
              'Avant 1990 : risque amiante (toiture, carrelage)',
              'Avant 2000 : tableaux électriques vétustes, plomberie fonte, humidité',
            ]}
          />

          <SourceCard
            fiabilite="terrain"
            titre="Reddit r/aliyah + retours investisseurs"
            url="https://www.reddit.com/r/aliyah/comments/1ttu0fm/"
            date="2024–2025"
            donnees={[
              'Budget 20–30% au-dessus du devis initial : très fréquent',
              'Effet Madad (index construction) : impact direct sur chantiers longs',
              'Écarts de devis entre kablanim : jusqu\'à ×2 pour le même chantier',
            ]}
          />

          <SourceCard
            fiabilite="estimé"
            titre="Coefficients extrapolés (sans source directe)"
            url={null}
            date={null}
            donnees={[
              'Coef. localisation par ville (×0.80 à ×1.35) : déduits des écarts de prix immobiliers entre villes',
              'Répartition % par poste (cuisine 20%, SDB 15%...) : pratique BTP générale, non publié en Israël',
              'Impact sur la valeur après travaux (+3 à +38%) : extrapolé depuis les ROI régionaux Deal Estate',
              'Coef. complexité chantier (sans ascenseur, accès difficile) : estimation raisonnée',
            ]}
          />

        </div>

        {/* Avertissement global */}
        <div style={{
          marginTop: '1rem', background: '#FAEEDA', borderRadius: 8,
          padding: '10px 14px', fontSize: 12, color: '#633806', lineHeight: 1.6,
        }}>
          <strong>Important :</strong> Ces estimations sont des ordres de grandeur basés sur des données
          de marché publiques 2025–2026. Les prix réels varient fortement selon le kablan, les matériaux
          choisis, la découverte de problèmes structurels, et l'évolution de l'index construction (Madad).
          Ce simulateur ne remplace pas un devis professionnel.
          <strong> Consultez au minimum 3 kablanim avant de vous engager.</strong>
        </div>

      </div>
    </div>
  )
}
