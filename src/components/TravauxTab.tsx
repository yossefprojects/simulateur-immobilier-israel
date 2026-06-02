import React, { useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { SelectField, SliderField, SectionTitle, ResultBox } from './ui'

// ── Niveaux Israël (4 niveaux officiels) ─────────────────────────────────────

const NIVEAUX = [
  {
    value: 'rafraichissement',
    label: 'Rafraîchissement',
    desc: 'Peinture, sols légers, cosmétique — aucun gros œuvre',
    min: 1200, max: 2200,
    roi: 6,
    color: '#E5F0FF',
    colorText: '#1A3A5C',
  },
  {
    value: 'standard',
    label: 'Standard',
    desc: 'Cuisine, SDB, revêtements, électricité partielle',
    min: 2500, max: 4500,
    roi: 13,
    color: '#EAF3DE',
    colorText: '#27500A',
  },
  {
    value: 'lourde',
    label: 'Rénovation lourde',
    desc: 'Tout corps d\'état, structure, démolition partielle',
    min: 5000, max: 8000,
    roi: 20,
    color: '#FAEEDA',
    colorText: '#633806',
  },
  {
    value: 'luxe',
    label: 'Luxe',
    desc: 'Matériaux premium, domotique, finitions haut de gamme',
    min: 9000, max: 14000,
    roi: 15,
    color: '#F3EAF8',
    colorText: '#4A1070',
  },
]

// ── 9 postes obligatoires ─────────────────────────────────────────────────────

const POSTES = [
  { key: 'demolition',  label: 'Démolition',             pct: 0.09, emoji: '🔨' },
  { key: 'gros_oeuvre', label: 'Structure / gros œuvre', pct: 0.08, emoji: '🧱' },
  { key: 'elec',        label: 'Électricité',            pct: 0.12, emoji: '⚡' },
  { key: 'plomberie',   label: 'Plomberie',              pct: 0.10, emoji: '🔧' },
  { key: 'cuisine',     label: 'Cuisine',                pct: 0.17, emoji: '🍳' },
  { key: 'sdb',         label: 'Salles de bain',         pct: 0.13, emoji: '🚿' },
  { key: 'sols',        label: 'Sols',                   pct: 0.10, emoji: '🪵' },
  { key: 'menuiserie',  label: 'Menuiserie',             pct: 0.11, emoji: '🚪' },
  { key: 'finitions',   label: 'Finitions',              pct: 0.10, emoji: '🖌️' },
]

// ── Coefficient 1 : Localisation ──────────────────────────────────────────────

const VILLES_COEF: Record<string, { label: string; coef: number; zone: string }> = {
  tel_aviv:      { label: 'Tel Aviv',              coef: 1.35, zone: 'Centre premium' },
  herzliya:      { label: 'Herzliya Pituach',      coef: 1.25, zone: 'Centre' },
  jerusalem:     { label: 'Jérusalem',             coef: 1.15, zone: 'Centre' },
  raanana:       { label: 'Ra\'anana / Kfar Saba', coef: 1.10, zone: 'Centre' },
  netanya:       { label: 'Netanya',               coef: 1.00, zone: 'Base' },
  haifa:         { label: 'Haïfa',                 coef: 0.95, zone: 'Nord' },
  petah_tikva:   { label: 'Petah Tikva',           coef: 0.92, zone: 'Centre périphérie' },
  rishon:        { label: 'Rishon LeZion',         coef: 0.95, zone: 'Centre périphérie' },
  beer_sheva:    { label: 'Beer Sheva',             coef: 0.85, zone: 'Sud' },
  ashkelon:      { label: 'Ashkelon',              coef: 0.80, zone: 'Sud périphérie' },
}

// ── Coefficient 2 : Âge du bâtiment ──────────────────────────────────────────

const ANNEES_RISQUE: { avant: number; label: string; coef: number; risques: string[] }[] = [
  {
    avant: 1960,
    label: 'Avant 1960',
    coef: 1.30,
    risques: ['Risque amiante élevé (toiture, carrelage)', 'Plomberie en plomb possible', 'Structure à expertiser obligatoirement'],
  },
  {
    avant: 1990,
    label: '1960–1990',
    coef: 1.20,
    risques: ['Possible amiante dans les isolations', 'Tableaux électriques vétustes', 'Plomberie fonte'],
  },
  {
    avant: 2000,
    label: '1990–2000',
    coef: 1.10,
    risques: ['Normes parasismiques partielles', 'Humidité possible', 'Fenêtres simple vitrage'],
  },
  {
    avant: 9999,
    label: 'Après 2000',
    coef: 1.00,
    risques: [],
  },
]

function getRisque(annee: number) {
  return ANNEES_RISQUE.find(r => annee < r.avant) ?? ANNEES_RISQUE[ANNEES_RISQUE.length - 1]
}

// ── Coefficient 3 : Accessibilité chantier ────────────────────────────────────

const ACCESSIBILITE = [
  { value: 'facile',   label: 'Facile — RDC ou ascenseur, rue large',           coef: 1.00 },
  { value: 'moyen',    label: 'Moyen — 1er–3ème sans ascenseur, accès standard', coef: 1.06 },
  { value: 'difficile',label: 'Difficile — ≥ 4ème sans ascenseur, voie étroite', coef: 1.14 },
]

// ── Coefficient 4 : État initial du bien ──────────────────────────────────────

const ETAT_INITIAL = [
  { value: 'tres_bon', label: 'Très bon état — peu à refaire',         coef: 0.85 },
  { value: 'bon',      label: 'Bon état — usure normale',              coef: 1.00 },
  { value: 'usage',    label: 'Usagé — vétusté avancée, tout à refaire', coef: 1.18 },
  { value: 'degrade',  label: 'Dégradé — problèmes structurels possibles', coef: 1.38 },
]

// ── Utilitaires ───────────────────────────────────────────────────────────────

const fmt  = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)
const fmtM = (n: number) => `${(n / 1000).toFixed(0)}K₪`

// ── SourceCard ────────────────────────────────────────────────────────────────

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

// ── CoefBadge ─────────────────────────────────────────────────────────────────

interface CoefBadgeProps {
  num: string
  label: string
  value: string
  coef: number
  neutral?: boolean
}

const CoefBadge: React.FC<CoefBadgeProps> = ({ num, label, value, coef, neutral }) => {
  const isAbove = coef > 1.01
  const isBelow = coef < 0.99
  const bg    = neutral || (!isAbove && !isBelow) ? '#F3F4F6' : isAbove ? '#FAEEDA' : '#EAF3DE'
  const color = neutral || (!isAbove && !isBelow) ? '#4B5563' : isAbove ? '#633806' : '#27500A'
  return (
    <div style={{
      background: bg, border: `0.5px solid ${isAbove ? '#F3D49A' : isBelow ? '#B5D89A' : '#E5E7EB'}`,
      borderRadius: 10, padding: '10px 14px', flex: '1 1 160px',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#1A3A5C', marginBottom: 4, opacity: 0.7 }}>
        COEF {num}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#1A3A5C', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 6, lineHeight: 1.3 }}>{value}</div>
      <div style={{
        display: 'inline-block', fontSize: 13, fontWeight: 700,
        color, background: 'white', borderRadius: 6, padding: '2px 8px',
        border: `0.5px solid ${isAbove ? '#F3D49A' : isBelow ? '#B5D89A' : '#E5E7EB'}`,
      }}>
        ×{coef.toFixed(2)}
      </div>
    </div>
  )
}

// ── TravauxTab ────────────────────────────────────────────────────────────────

export const TravauxTab: React.FC = () => {
  const { lang } = useLang()

  const [surface,    setSurface]    = useState(80)
  const [niveau,     setNiveau]     = useState('standard')
  const [ville,      setVille]      = useState('tel_aviv')
  const [annee,      setAnnee]      = useState(1990)
  const [acces,      setAcces]      = useState('moyen')
  const [etatInit,   setEtatInit]   = useState('bon')

  const niveauData  = NIVEAUX.find(n => n.value === niveau) ?? NIVEAUX[1]
  const villeData   = VILLES_COEF[ville]
  const risque      = getRisque(annee)
  const accesData   = ACCESSIBILITE.find(a => a.value === acces) ?? ACCESSIBILITE[0]
  const etatData    = ETAT_INITIAL.find(e => e.value === etatInit) ?? ETAT_INITIAL[1]

  const coefTotal   = villeData.coef * risque.coef * accesData.coef * etatData.coef

  const minTotal = Math.round(niveauData.min * surface * coefTotal)
  const maxTotal = Math.round(niveauData.max * surface * coefTotal)
  const midTotal = Math.round((minTotal + maxTotal) / 2)

  const isRtl = lang === 'he'

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ── Sélecteur niveau (cards visuelles) ── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#1A3A5C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Niveau de rénovation Israël <span style={{ color: '#C9A84C' }}>— champ obligatoire</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {NIVEAUX.map(n => (
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
              <div style={{ fontSize: 13, fontWeight: 700, color: n.colorText, marginBottom: 2 }}>{n.label}</div>
              <div style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.35 }}>{n.desc}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: n.colorText, marginTop: 5 }}>
                {n.min.toLocaleString()}–{n.max.toLocaleString()} ₪/m²
              </div>
            </button>
          ))}
        </div>
      </div>

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
            label="Coef 1 · Localisation — Ville"
            value={ville}
            options={Object.entries(VILLES_COEF).map(([k, v]) => ({ value: k, label: `${v.label}  (×${v.coef.toFixed(2)})` }))}
            onChange={setVille}
          />

          <SliderField
            label="Coef 2 · Âge — Année de construction"
            min={1930} max={2024} step={5}
            value={annee}
            display={`${annee}  ·  ${risque.label}  ×${risque.coef.toFixed(2)}`}
            onChange={setAnnee}
          />

          <SelectField
            label="Coef 3 · Accessibilité chantier"
            value={acces}
            options={ACCESSIBILITE.map(a => ({ value: a.value, label: `${a.label}  (×${a.coef.toFixed(2)})` }))}
            onChange={setAcces}
          />

          <SelectField
            label="Coef 4 · État initial du bien"
            value={etatInit}
            options={ETAT_INITIAL.map(e => ({ value: e.value, label: `${e.label}  (×${e.coef.toFixed(2)})` }))}
            onChange={setEtatInit}
          />

          {/* Risques bâtiment */}
          {risque.risques.length > 0 && (
            <div className="mt-4 rounded-lg p-3" style={{ background: '#FAEEDA', border: '0.5px solid #F3D49A' }}>
              <div className="text-xs font-semibold mb-1.5" style={{ color: '#633806' }}>
                ⚠️ Risques bâtiment — {risque.label}
              </div>
              <ul className="space-y-1">
                {risque.risques.map((r, i) => (
                  <li key={i} className="text-xs" style={{ color: '#633806' }}>• {r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Colonne droite — Résultats */}
        <div>
          <SectionTitle>Estimation du budget</SectionTitle>

          <ResultBox
            label="Budget estimé (fourchette)"
            main={`${fmtM(minTotal)} – ${fmtM(maxTotal)}`}
            sub={`Valeur centrale : ${fmt(midTotal)} ₪  ·  ${fmt(Math.round(midTotal / surface))} ₪/m²`}
            badges={[
              { text: `Coef. total ×${coefTotal.toFixed(2)}`, color: 'bg-amber-50 text-amber-700' },
              { text: `Base ${niveauData.min.toLocaleString()}–${niveauData.max.toLocaleString()} ₪/m²`, color: 'bg-neutral-100 text-neutral-600' },
            ]}
          />

          {/* Impact valeur */}
          <div className="mt-3 rounded-lg p-3" style={{ background: niveauData.color, border: `0.5px solid ${niveauData.colorText}30` }}>
            <div className="text-xs font-semibold mb-1" style={{ color: niveauData.colorText }}>
              📈 Impact sur la valeur du bien
            </div>
            <div className="text-xs" style={{ color: niveauData.colorText }}>
              Niveau <strong>{niveauData.label}</strong> → valorisation estimée <strong>+{niveauData.roi}%</strong>
              {' '}(Deal Estate Israel 2025–2026)
            </div>
          </div>

          {/* Mention légale */}
          <p style={{
            fontSize: 11, color: '#6B7280', marginTop: 10, lineHeight: 1.5,
            borderLeft: '2px solid #C9A84C', paddingLeft: 8,
          }}>
            Estimation indicative — données AllBatim, Deal Estate Israel, Kablay (2026).
            Écarts réels ±20–30% selon le kablan.{' '}
            <strong style={{ color: '#1A3A5C' }}>Obtenez au minimum 3 devis.</strong>
          </p>

          {/* Décomposition par poste */}
          <SectionTitle>Décomposition — 9 postes</SectionTitle>
          <div className="space-y-1.5">
            {POSTES.map(p => {
              const montant = Math.round(midTotal * p.pct)
              return (
                <div key={p.key}>
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="text-neutral-600">{p.emoji} {p.label}</span>
                    <span className="tabular-nums font-medium text-neutral-800">{fmt(montant)} ₪</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.round(p.pct * 100)}%`, background: '#C9A84C', opacity: 0.65 + p.pct * 1.5 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Récapitulatif des 4 coefficients appliqués ── */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#1A3A5C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Les 4 coefficients appliqués
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <CoefBadge
            num="1" label="Localisation"
            value={villeData.label}
            coef={villeData.coef}
          />
          <CoefBadge
            num="2" label="Âge du bâtiment"
            value={risque.label}
            coef={risque.coef}
          />
          <CoefBadge
            num="3" label="Accessibilité"
            value={accesData.label.split('—')[0].trim()}
            coef={accesData.coef}
          />
          <CoefBadge
            num="4" label="État initial"
            value={etatData.label.split('—')[0].trim()}
            coef={etatData.coef}
          />
          <div style={{
            background: '#1A3A5C', color: 'white',
            borderRadius: 10, padding: '10px 14px', flex: '1 1 160px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.7, marginBottom: 4 }}>COEF TOTAL</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>×{coefTotal.toFixed(2)}</div>
            <div style={{ fontSize: 10, opacity: 0.65, marginTop: 2 }}>
              {coefTotal > 1.3 ? '⚠️ Surcoût important' : coefTotal < 0.95 ? '✓ Contexte favorable' : 'Contexte standard'}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION SOURCES — investor grade ── */}
      <div style={{ marginTop: '2rem', borderTop: '0.5px solid #E5E7EB', paddingTop: '1.5rem' }}>

        <h3 style={{
          fontSize: 12, fontWeight: 600, color: '#1A3A5C',
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem',
        }}>
          📚 Sources travaux — coûts ₪/m² · fourchettes Israël · benchmarks kablanim
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>

          <SourceCard
            fiabilite="confirmé"
            titre="AllBatim.co.il"
            url="https://allbatim.com/fr/guides/cout-renovation-israel"
            date="Mis à jour avril 2026"
            donnees={[
              'Rafraîchissement : 1 200–2 200 ₪/m²',
              'Standard : 2 500–4 500 ₪/m²',
              'Rénovation lourde : 5 000–8 000 ₪/m²',
              'Cuisine neuve : 30 000–80 000 ₪',
              'Salle de bain : 20 000–50 000 ₪',
            ]}
          />

          <SourceCard
            fiabilite="confirmé"
            titre="DealEstateIsrael.com"
            url="https://dealestateisrael.com/renovation-costs-israel/"
            date="2025–2026"
            donnees={[
              'Cosmétique : 1 000–2 500 ₪/m²',
              'Standard complet : 3 000–5 500 ₪/m²',
              'Gut renovation : 6 000–9 000 ₪/m²',
              'Luxe : 9 000–14 000+ ₪/m²',
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
              'Plateforme artisans israéliens — grilles tarifaires directes',
              'Bureau turnkey (HVAC inclus) : à partir de 3 600 ₪/m²',
              'Référence terrain utilisée par les kablanim locaux',
              'Démolition partielle : 150–400 ₪/m²',
              'Gros œuvre / béton armé : 500–900 ₪/m²',
            ]}
          />

          <SourceCard
            fiabilite="confirmé"
            titre="Marshanski.com"
            url="https://marshanski.com/timeline-and-cost-comparison-building-new-vs-renovating-existing-homes-in-israel/"
            date="Mars 2026"
            donnees={[
              'Gut renovation : 4 000–9 000 ₪/m²',
              'Découvertes démolition (bâtiments anciens) : +15 à +30%',
              'Avant 1960 : risque amiante — toiture, carrelage, isolations',
              'Avant 1990 : tableaux vétustes, plomberie fonte, humidité',
              'Avant 2000 : parasismique partiel, simple vitrage',
            ]}
          />

          <SourceCard
            fiabilite="terrain"
            titre="Reddit r/aliyah + investisseurs terrain"
            url="https://www.reddit.com/r/aliyah/comments/1ttu0fm/"
            date="2024–2025"
            donnees={[
              'Budget réel 20–30% au-dessus du devis : très fréquent',
              'Effet Madad (index construction) : impact sur chantiers longs',
              'Écarts de devis entre kablanim : jusqu\'à ×2 pour le même chantier',
              'Sols Pierre de Jérusalem haut de gamme : 300–600 ₪/m²',
              'Électricité tri-phasé en remplacement : 25 000–50 000 ₪',
            ]}
          />

          <SourceCard
            fiabilite="estimé"
            titre="Coefficients extrapolés (sans source directe)"
            url={null}
            date={null}
            donnees={[
              'Coef. localisation ×0.80–1.35 : déduits des écarts de prix au m² entre villes',
              'Coef. âge ×1.00–1.30 : basé sur les surcoûts Marshanski et AllBatim',
              'Coef. accessibilité ×1.00–1.14 : estimation raisonnée BTP',
              'Coef. état initial ×0.85–1.38 : extrapolé depuis benchmarks kablanim',
              'Répartition 9 postes (cuisine 17%, SDB 13%…) : pratique BTP israélienne',
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
