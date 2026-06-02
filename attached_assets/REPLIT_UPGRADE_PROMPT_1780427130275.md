# Prompt de refonte complète — Simulateur Immobilier Israël
## https://israel-simzip.replit.app

Tu vas améliorer en profondeur ce simulateur immobilier existant.
Voici **toutes** les modifications à apporter, dans l'ordre de priorité.
Ne supprime aucune fonctionnalité existante. Améliore, enrichis, remplace.

---

## PARTIE 1 — DESIGN & IDENTITÉ VISUELLE

### 1.1 Nouvelle typographie

Installe et configure ces deux fonts via Google Fonts :

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

Règles d'application :
- **DM Serif Display** : tous les grands chiffres (prix estimé, score, marge) — font-family: 'DM Serif Display', serif
- **Plus Jakarta Sans** : tout le reste — font-family: 'Plus Jakarta Sans', sans-serif
- Supprimer toute référence à Inter, system-ui ou Arial dans le CSS global

### 1.2 Nouvelle palette de couleurs — identité premium

Remplace TOUTES les couleurs dans tailwind.config.js et le CSS global :

```js
// tailwind.config.js — colors
colors: {
  primary:   { DEFAULT: '#1A3A5C', light: '#2A5080', dark: '#0F2235' },
  gold:      { DEFAULT: '#C9A84C', light: '#E8C96A', dark: '#A07830' },
  success:   '#0F6E56',
  danger:    '#993C1D',
  warning:   '#BA7517',
  neutral:   { 50: '#F8F7F4', 100: '#EDEDEA', 200: '#D8D7D3', 500: '#6B7280', 900: '#111827' },
}
```

Applique :
- Header background : `#1A3A5C` (bleu ardoise israélien) au lieu du blanc
- Header texte et icône : blanc
- Onglet actif : bordure `#C9A84C` (or) au lieu du noir
- Bouton PDF : `#C9A84C` avec texte `#1A3A5C`
- Boutons langues FR/EN/עב : fond `rgba(255,255,255,0.15)` sur header sombre, actif en blanc plein
- Accent principal (sliders, badges prix) : `#1A3A5C`
- Valeurs positives : `#0F6E56`
- Valeurs négatives : `#993C1D`

### 1.3 Remplacement des bandeaux photo par des illustrations SVG

Supprime toutes les photos de bannière (toit rouge, mains sur plans, building générique). Remplace par des illustrations SVG intégrées, une par onglet.

**Onglet Estimation — skyline Tel Aviv :**
```svg
<svg viewBox="0 0 1200 160" preserveAspectRatio="xMidYMid slice">
  <rect width="1200" height="160" fill="#1A3A5C"/>
  <!-- Bâtiments -->
  <rect x="0"   y="80"  width="80"  height="80"  fill="#2A5080"/>
  <rect x="90"  y="40"  width="120" height="120" fill="#0F2235"/>
  <rect x="220" y="60"  width="90"  height="100" fill="#2A5080"/>
  <rect x="320" y="20"  width="100" height="140" fill="#0F2235"/>
  <rect x="430" y="50"  width="80"  height="110" fill="#1A3A5C"/>
  <rect x="520" y="70"  width="110" height="90"  fill="#2A5080"/>
  <rect x="640" y="30"  width="90"  height="130" fill="#0F2235"/>
  <rect x="740" y="55"  width="75"  height="105" fill="#2A5080"/>
  <rect x="825" y="25"  width="130" height="135" fill="#0F2235"/>
  <rect x="965" y="65"  width="85"  height="95"  fill="#1A3A5C"/>
  <rect x="1060" y="45" width="140" height="115" fill="#2A5080"/>
  <!-- Fenêtres -->
  <rect x="100" y="55"  width="8" height="6" fill="#C9A84C" opacity="0.8"/>
  <rect x="115" y="55"  width="8" height="6" fill="#C9A84C" opacity="0.6"/>
  <rect x="130" y="55"  width="8" height="6" fill="#C9A84C" opacity="0.9"/>
  <rect x="100" y="70"  width="8" height="6" fill="#C9A84C" opacity="0.5"/>
  <rect x="330" y="35"  width="8" height="6" fill="#C9A84C" opacity="0.9"/>
  <rect x="345" y="35"  width="8" height="6" fill="#C9A84C" opacity="0.6"/>
  <rect x="360" y="35"  width="8" height="6" fill="#C9A84C" opacity="0.8"/>
  <rect x="330" y="50"  width="8" height="6" fill="#C9A84C" opacity="0.7"/>
  <rect x="360" y="50"  width="8" height="6" fill="#C9A84C" opacity="0.5"/>
  <rect x="840" y="40"  width="8" height="6" fill="#C9A84C" opacity="0.9"/>
  <rect x="855" y="40"  width="8" height="6" fill="#C9A84C" opacity="0.6"/>
  <rect x="870" y="40"  width="8" height="6" fill="#C9A84C" opacity="0.8"/>
  <rect x="840" y="55"  width="8" height="6" fill="#C9A84C" opacity="0.5"/>
  <rect x="870" y="55"  width="8" height="6" fill="#C9A84C" opacity="0.7"/>
  <!-- Lune -->
  <circle cx="1150" cy="30" r="18" fill="#E8C96A" opacity="0.9"/>
  <!-- Eau -->
  <rect x="0" y="150" width="1200" height="10" fill="#0F2235" opacity="0.6"/>
</svg>
```

**Onglet Urbanistique — plan cadastral stylisé :**
```svg
<svg viewBox="0 0 1200 160" preserveAspectRatio="xMidYMid slice">
  <rect width="1200" height="160" fill="#0F2235"/>
  <!-- Grille cadastrale -->
  <line x1="0" y1="40"  x2="1200" y2="40"  stroke="#2A5080" stroke-width="0.5" opacity="0.6"/>
  <line x1="0" y1="80"  x2="1200" y2="80"  stroke="#2A5080" stroke-width="0.5" opacity="0.6"/>
  <line x1="0" y1="120" x2="1200" y2="120" stroke="#2A5080" stroke-width="0.5" opacity="0.6"/>
  <line x1="150" y1="0" x2="150" y2="160" stroke="#2A5080" stroke-width="0.5" opacity="0.6"/>
  <line x1="350" y1="0" x2="350" y2="160" stroke="#2A5080" stroke-width="0.5" opacity="0.6"/>
  <line x1="600" y1="0" x2="600" y2="160" stroke="#2A5080" stroke-width="0.5" opacity="0.6"/>
  <line x1="900" y1="0" x2="900" y2="160" stroke="#2A5080" stroke-width="0.5" opacity="0.6"/>
  <line x1="1100" y1="0" x2="1100" y2="160" stroke="#2A5080" stroke-width="0.5" opacity="0.6"/>
  <!-- Parcelles colorées -->
  <rect x="160" y="45"  width="180" height="70" fill="none" stroke="#C9A84C" stroke-width="1.5" opacity="0.7"/>
  <rect x="360" y="10"  width="230" height="110" fill="#C9A84C" opacity="0.08" stroke="#C9A84C" stroke-width="2"/>
  <rect x="360" y="10"  width="230" height="110" fill="none" stroke="#C9A84C" stroke-width="2"/>
  <rect x="610" y="45"  width="280" height="65" fill="none" stroke="#2A5080" stroke-width="1" opacity="0.8"/>
  <rect x="910" y="25"  width="180" height="90" fill="none" stroke="#C9A84C" stroke-width="1.5" opacity="0.5"/>
  <!-- Numéros de parcelle -->
  <text x="440" y="65" fill="#C9A84C" font-size="11" font-family="monospace" opacity="0.9">6627 / 142</text>
  <text x="230" y="85" fill="#2A5080" font-size="9" font-family="monospace" opacity="0.7">GUSH 6240</text>
  <!-- Point GPS pulsant (centre) -->
  <circle cx="475" cy="85" r="6" fill="#C9A84C" opacity="0.9"/>
  <circle cx="475" cy="85" r="12" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.4"/>
</svg>
```

**Onglet Investisseur — graphique financier abstrait :**
```svg
<svg viewBox="0 0 1200 160" preserveAspectRatio="xMidYMid slice">
  <rect width="1200" height="160" fill="#0F2235"/>
  <!-- Courbe haussière -->
  <polyline points="0,140 100,130 200,120 300,115 400,100 500,90 600,75 700,65 800,50 900,40 1000,30 1100,22 1200,15"
    fill="none" stroke="#C9A84C" stroke-width="2" opacity="0.8"/>
  <!-- Zone sous la courbe -->
  <polygon points="0,140 100,130 200,120 300,115 400,100 500,90 600,75 700,65 800,50 900,40 1000,30 1100,22 1200,15 1200,160 0,160"
    fill="#C9A84C" opacity="0.06"/>
  <!-- Grille horizontale -->
  <line x1="0" y1="40"  x2="1200" y2="40"  stroke="#2A5080" stroke-width="0.5" opacity="0.4"/>
  <line x1="0" y1="80"  x2="1200" y2="80"  stroke="#2A5080" stroke-width="0.5" opacity="0.4"/>
  <line x1="0" y1="120" x2="1200" y2="120" stroke="#2A5080" stroke-width="0.5" opacity="0.4"/>
  <!-- Points sur la courbe -->
  <circle cx="300"  cy="115" r="4" fill="#C9A84C" opacity="0.7"/>
  <circle cx="600"  cy="75"  r="4" fill="#C9A84C" opacity="0.7"/>
  <circle cx="900"  cy="40"  r="4" fill="#C9A84C" opacity="0.7"/>
  <circle cx="1200" cy="15"  r="5" fill="#C9A84C" opacity="0.9"/>
</svg>
```

**Onglet Promoteur — plan architectural :**
```svg
<svg viewBox="0 0 1200 160" preserveAspectRatio="xMidYMid slice">
  <rect width="1200" height="160" fill="#1A3A5C"/>
  <!-- Plan de masse stylisé -->
  <rect x="80"  y="30"  width="200" height="100" fill="none" stroke="#C9A84C" stroke-width="1.5" opacity="0.6"/>
  <rect x="100" y="50"  width="70"  height="60"  fill="none" stroke="#2A5080" stroke-width="1" opacity="0.8"/>
  <rect x="185" y="50"  width="75"  height="60"  fill="none" stroke="#2A5080" stroke-width="1" opacity="0.8"/>
  <rect x="320" y="20"  width="280" height="120" fill="none" stroke="#C9A84C" stroke-width="2" opacity="0.9"/>
  <rect x="340" y="40"  width="80"  height="80"  fill="#C9A84C" opacity="0.08"/>
  <rect x="340" y="40"  width="80"  height="80"  fill="none" stroke="#C9A84C" stroke-width="1"/>
  <rect x="435" y="40"  width="80"  height="80"  fill="none" stroke="#2A5080" stroke-width="1" opacity="0.6"/>
  <rect x="530" y="40"  width="50"  height="80"  fill="none" stroke="#2A5080" stroke-width="1" opacity="0.6"/>
  <!-- Cotes architecturales -->
  <line x1="80" y1="145" x2="280" y2="145" stroke="#C9A84C" stroke-width="0.8" opacity="0.5"/>
  <line x1="80" y1="140" x2="80"  y2="150" stroke="#C9A84C" stroke-width="0.8" opacity="0.5"/>
  <line x1="280" y1="140" x2="280" y2="150" stroke="#C9A84C" stroke-width="0.8" opacity="0.5"/>
  <text x="155" y="158" fill="#C9A84C" font-size="9" font-family="monospace" opacity="0.6" text-anchor="middle">2 000 m²</text>
  <!-- Immeubles en 3D stylisé -->
  <rect x="700" y="60"  width="60"  height="100" fill="#0F2235"/>
  <rect x="770" y="40"  width="80"  height="120" fill="#0F2235"/>
  <rect x="860" y="50"  width="70"  height="110" fill="#0F2235"/>
  <rect x="940" y="30"  width="90"  height="130" fill="#0F2235"/>
  <rect x="1040" y="55" width="60"  height="105" fill="#0F2235"/>
  <rect x="1110" y="45" width="80"  height="115" fill="#0F2235"/>
  <!-- Façades -->
  <rect x="700" y="60"  width="60"  height="100" fill="none" stroke="#2A5080" stroke-width="0.5"/>
  <rect x="770" y="40"  width="80"  height="120" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.7"/>
</svg>
```

### 1.4 Animations et micro-interactions

Ajoute ce CSS global dans index.css :

```css
/* Transition entre onglets */
.tab-content {
  animation: tabFadeIn 0.2s ease-out;
}
@keyframes tabFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Flash sur les valeurs recalculées */
.value-updated {
  animation: valueFlash 0.4s ease-out;
}
@keyframes valueFlash {
  0%   { background-color: rgba(201, 168, 76, 0.25); }
  100% { background-color: transparent; }
}

/* Barres waterfall animées */
.waterfall-bar {
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.waterfall-bar:nth-child(1) { transition-delay: 0ms; }
.waterfall-bar:nth-child(2) { transition-delay: 60ms; }
.waterfall-bar:nth-child(3) { transition-delay: 120ms; }
.waterfall-bar:nth-child(4) { transition-delay: 180ms; }
.waterfall-bar:nth-child(5) { transition-delay: 240ms; }
.waterfall-bar:nth-child(6) { transition-delay: 300ms; }
.waterfall-bar:nth-child(7) { transition-delay: 360ms; }

/* Hover sur les sliders */
input[type="range"] {
  height: 6px;
  accent-color: #1A3A5C;
  cursor: pointer;
}
input[type="range"]:hover {
  accent-color: #C9A84C;
}

/* Focus ring accessible */
*:focus-visible {
  outline: 2px solid #C9A84C;
  outline-offset: 2px;
  border-radius: 4px;
}
```

Dans chaque composant React, applique la classe `value-updated` dynamiquement quand une valeur change :
```jsx
// Utilise useRef pour détecter le changement et toggler la classe
const prevVal = useRef(value)
useEffect(() => {
  if (prevVal.current !== value) {
    // Ajouter puis retirer la classe .value-updated sur l'élément
    prevVal.current = value
  }
}, [value])
```

---

## PARTIE 2 — UX & ERGONOMIE

### 2.1 Système de sauvegarde de scénarios (localStorage)

Crée un nouveau fichier `src/utils/scenarios.js` :

```javascript
const KEY = 'immo_israel_scenarios'

export function sauvegarderScenario(nom, data) {
  const scenarios = lireScenarios()
  const nouveau = { id: Date.now(), nom, date: new Date().toLocaleDateString('fr-FR'), ...data }
  scenarios.unshift(nouveau)
  localStorage.setItem(KEY, JSON.stringify(scenarios.slice(0, 10))) // max 10
  return nouveau
}

export function lireScenarios() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
  catch { return [] }
}

export function supprimerScenario(id) {
  const scenarios = lireScenarios().filter(s => s.id !== id)
  localStorage.setItem(KEY, JSON.stringify(scenarios))
}
```

Dans chaque onglet, ajoute un bouton "💾 Sauvegarder ce scénario" qui ouvre une modale simple :
- Input texte : "Nom du scénario" (ex. "Appartement Neve Tzedek 80m²")
- Bouton Confirmer → appelle `sauvegarderScenario()`
- Confirmation toast : "Scénario sauvegardé ✓"

Ajoute un panneau "Mes scénarios" accessible depuis le header (icône historique) :
- Liste des scénarios sauvegardés (nom + date + ville + prix estimé)
- Bouton "Charger" pour restaurer un scénario complet
- Bouton "Supprimer" (icône poubelle)
- Bouton "Comparer" (sélection de 2 scénarios → tableau comparatif côte à côte)

### 2.2 Partage de simulation par URL

Dans `src/utils/shareUrl.js` :

```javascript
export function genererURL(inputs) {
  const params = new URLSearchParams()
  Object.entries(inputs).forEach(([k, v]) => {
    if (typeof v === 'object') {
      Object.entries(v).forEach(([k2, v2]) => v2 && params.append(k2, '1'))
    } else {
      params.set(k, v)
    }
  })
  return `${window.location.origin}${window.location.pathname}#${params.toString()}`
}

export function lireURL() {
  const hash = window.location.hash.slice(1)
  if (!hash) return null
  const params = Object.fromEntries(new URLSearchParams(hash))
  return params
}
```

Ajoute un bouton "🔗 Copier le lien" dans chaque onglet résultat :
- Au clic : génère l'URL avec les paramètres courants
- Copie dans le presse-papier avec `navigator.clipboard.writeText()`
- Toast : "Lien copié ✓"

Au chargement de l'app (useEffect dans App.jsx), appeler `lireURL()` et reconstituer l'état si des paramètres sont présents.

### 2.3 Tooltips d'aide contextuelle

Crée un composant `src/components/Tooltip.jsx` :

```jsx
export function Tooltip({ content, children }) {
  const [visible, setVisible] = useState(false)
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {children}
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        aria-label="Aide"
        style={{ background: 'none', border: 'none', cursor: 'help', color: '#6B7280', fontSize: 13 }}
      >ⓘ</button>
      {visible && (
        <div role="tooltip" style={{
          position: 'absolute', bottom: '130%', left: '50%', transform: 'translateX(-50%)',
          background: '#1A3A5C', color: 'white', padding: '8px 12px', borderRadius: 8,
          fontSize: 12, lineHeight: 1.5, width: 220, zIndex: 100, pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {content}
        </div>
      )}
    </span>
  )
}
```

Applique les tooltips sur ces champs (textes à utiliser) :

| Champ | Texte du tooltip |
|---|---|
| COS | "Coefficient d'occupation du sol : ratio entre la surface de plancher constructible et la surface du terrain. Ex: COS 3 sur 1000m² = 3000m² constructibles." |
| Mamad | "Pièce sécurisée renforcée obligatoire dans les logements israéliens depuis 1992, servant d'abri en cas de roquettes. Augmente la valeur du bien." |
| TAMA 38 | "Programme national de renforcement sismique permettant aux propriétaires d'ajouter des étages en échange de travaux de consolidation." |
| Pinouï-Binouï | "Programme de démolition-reconstruction : l'immeuble est détruit et reconstruit plus grand. Les locataires sont relogés pendant les travaux." |
| Gush / Helka | "Références cadastrales israéliennes. Le Gush est le numéro de bloc, la Helka le numéro de parcelle. Disponibles sur GovMap.gov.il" |
| Taux hypothécaire | "Taux actuel de la Banque d'Israël : environ 4.5–5.5% en 2025. Les non-résidents obtiennent généralement un taux de 0.5–1% supérieur." |
| TRI | "Taux de Rendement Interne : taux d'actualisation qui annule la VAN. Un TRI > 8% est considéré excellent sur le marché israélien." |

### 2.4 Responsive mobile complet

Dans chaque composant onglet, applique ces règles :

```css
/* Mobile : 1 colonne, contrôles plus grands */
@media (max-width: 768px) {
  .grid-2-cols { grid-template-columns: 1fr !important; }
  
  input[type="range"] { height: 8px; }
  
  input[type="number"],
  select { font-size: 16px !important; } /* Évite le zoom iOS */
  
  /* Résultats en sticky bar en bas sur mobile */
  .result-sticky-mobile {
    position: sticky;
    bottom: 0;
    background: white;
    border-top: 1px solid #E5E7EB;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 50;
  }
}
```

Ajoute une barre sticky en bas de page sur mobile affichant :
- Prix estimé en gros
- Bouton "Voir les résultats" qui scroll jusqu'à la section résultats

### 2.5 Validation des champs avec messages d'erreur

Dans tous les champs numériques, ajoute une validation :

```jsx
// Exemple pour le prix d'achat
const [erreurs, setErreurs] = useState({})

function validerPrix(val) {
  if (val < 100000)   return "Le prix minimum est 100 000 ₪"
  if (val > 100000000) return "Valeur trop élevée"
  return null
}

// Dans le JSX :
<input
  type="number"
  value={prix}
  onChange={e => {
    const v = parseFloat(e.target.value)
    const err = validerPrix(v)
    setErreurs(prev => ({ ...prev, prix: err }))
    if (!err) setPrix(v)
  }}
  style={{ borderColor: erreurs.prix ? '#E24B4A' : undefined }}
/>
{erreurs.prix && (
  <p style={{ color: '#E24B4A', fontSize: 11, marginTop: 3 }}>{erreurs.prix}</p>
)}
```

Limites à appliquer :
- Surface : 10 à 1000 m²
- Étage : 0 à 50
- Distance mer / transports : 0 à 50 km
- Prix achat investisseur : 100 000 à 100 000 000 ₪
- Loyer mensuel : 1 000 à 100 000 ₪
- Taux hypothécaire : 1 à 15%
- Surface terrain promoteur : 100 à 100 000 m²

### 2.6 Feedback visuel sur le bouton PDF

```jsx
const [pdfLoading, setPdfLoading] = useState(false)

async function handleExportPDF() {
  setPdfLoading(true)
  try {
    await exporterRapportPDF(data)
  } finally {
    setPdfLoading(false)
  }
}

// Bouton :
<button onClick={handleExportPDF} disabled={pdfLoading}>
  {pdfLoading ? (
    <><span className="spinner" /> Génération...</>
  ) : (
    <><DownloadIcon /> PDF</>
  )}
</button>
```

---

## PARTIE 3 — NOUVELLES FONCTIONNALITÉS

### 3.1 Graphiques financiers (recharts)

Installe recharts : `npm install recharts`

**Dans l'onglet Analyse Investisseur**, ajoute sous le tableau de projection :

```jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

// Graphique de la valeur du bien sur l'horizon
const dataChart = result.projection.map(p => ({
  annee: `+${p.annee}ans`,
  valeur: Math.round(p.valeur / 1000),      // en milliers ₪
  cfCumul: Math.round(p.cfCumul / 1000),
}))

<ResponsiveContainer width="100%" height={200}>
  <LineChart data={dataChart} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
    <XAxis dataKey="annee" tick={{ fontSize: 11, fill: '#6B7280' }} />
    <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={v => v + 'k₪'} />
    <Tooltip formatter={(v) => [v.toLocaleString('fr-FR') + 'k₪']} />
    <ReferenceLine y={0} stroke="#E5E7EB" />
    <Line type="monotone" dataKey="valeur"  stroke="#1A3A5C" strokeWidth={2} dot={{ r: 3 }} name="Valeur bien" />
    <Line type="monotone" dataKey="cfCumul" stroke="#C9A84C" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" name="CF cumulé" />
  </LineChart>
</ResponsiveContainer>
```

**Dans l'onglet Bilan Promoteur**, ajoute un donut chart de répartition des coûts :

```jsx
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const bilanData = [
  { name: 'Terrain',          value: result.coutTerrain,  color: '#993C1D' },
  { name: 'Construction',     value: result.coutConst,    color: '#1A3A5C' },
  { name: 'Honoraires',       value: result.frais,        color: '#534AB7' },
  { name: 'Commercialisation',value: result.commerc,      color: '#BA7517' },
  { name: 'Portage',          value: result.portage,      color: '#0F6E56' },
  { name: 'Marge',            value: Math.max(0, result.margeBrute), color: '#C9A84C' },
]

<PieChart width={280} height={200}>
  <Pie data={bilanData} cx={90} cy={90} innerRadius={50} outerRadius={85} dataKey="value">
    {bilanData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
  </Pie>
  <Tooltip formatter={(v) => fmtM(v)} />
  <Legend iconType="circle" iconSize={8} />
</PieChart>
```

### 3.2 Onglet Fiscalité israélienne (nouveau)

Ajoute un 5ème onglet **"Fiscalité"** avec les composants suivants :

**Calculateur Mas Rechisha (taxe d'achat) :**
```
Tranches 2025 (résidents) :
- Jusqu'à 1 978 745 ₪ : 0%
- 1 978 746 – 2 347 040 ₪ : 3.5%
- 2 347 041 – 6 055 070 ₪ : 5%
- 6 055 071 – 20 183 565 ₪ : 8%
- Au-delà de 20 183 565 ₪ : 10%

Tranches étrangers non-résidents (Zar) :
- Jusqu'à 6 055 070 ₪ : 8%
- Au-delà : 10%

Olim hadashim (nouveaux immigrants) :
- Réduction à 0.5% pour un 1er bien dans les 7 ans suivant l'Aliyah
```

Inputs : Prix d'achat ₪ | Statut (Résident / Non-résident / Olé hadash) | Premier bien (oui/non)
Output : Montant Mas Rechisha calculé tranche par tranche + total

**Calculateur Mas Shevach (taxe sur plus-value) :**
```
Taux : 25% sur la plus-value réelle
Exonération : bien détenu > 18 mois + résidence principale
Linéarisation disponible pour les biens achetés avant 2014
```

Inputs : Prix d'achat ₪ | Année d'achat | Prix de vente ₪ | Résidence principale (oui/non)
Output : Plus-value imposable + montant Mas Shevach + économie si résidence principale

**Calculateur Arnona (taxe foncière annuelle) :**
```
Tarif approximatif selon la ville :
Tel Aviv : 120–180 ₪/m²/an
Herzliya : 90–140 ₪/m²/an
Jérusalem : 80–120 ₪/m²/an
Netanya : 70–110 ₪/m²/an
```

**Section avantages Olim :**
- Exonération Mas Rechisha (premier bien, 7 ans)
- Réduction droits de douane sur effets personnels
- Subventions absorption (Sal Klita)
- Lien vers Nefesh B'Nefesh + Jewish Agency

Afficher un récap "Total des taxes à prévoir" avec badge couleur (rouge si > 10% du prix).

### 3.3 Export Excel (.xlsx)

Installe SheetJS : `npm install xlsx`

Dans `src/utils/exportExcel.js` :

```javascript
import * as XLSX from 'xlsx'

export function exporterExcel({ estimation, urbanisme, investisseur, promoteur }) {
  const wb = XLSX.utils.book_new()

  // Feuille Estimation
  const estData = [
    ['ESTIMATION DU BIEN', ''],
    ['Ville / Quartier', `${estimation.ville} — ${estimation.quartier}`],
    ['Surface', estimation.surface + ' m²'],
    ['Prix estimé', estimation.prixTotal],
    ['Prix au m²', estimation.prixM2],
    ['Fourchette basse', Math.round(estimation.prixTotal * 0.92)],
    ['Fourchette haute', Math.round(estimation.prixTotal * 1.08)],
    [],
    ['DÉCOMPOSITION DES COEFFICIENTS', ''],
    ...estimation.waterfall.map(w => [w.label, w.prixCumul]),
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(estData), 'Estimation')

  // Feuille Investisseur
  const invData = [
    ['ANALYSE INVESTISSEUR', ''],
    ['Rendement brut', investisseur.rendBrut.toFixed(2) + '%'],
    ['Rendement net', investisseur.rendNet.toFixed(2) + '%'],
    ['Mensualité crédit', investisseur.mensualite],
    ['TRI', investisseur.tri.toFixed(1) + '%'],
    ['Cash-flow mensuel', investisseur.cfMensuel],
    ['Prix sortie', investisseur.prixSortie],
    ['Gain total', investisseur.gainTotal],
    [],
    ['PROJECTION', 'Valeur', 'CF cumulé'],
    ...investisseur.projection.map(p => [`+${p.annee} ans`, p.valeur, p.cfCumul]),
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(invData), 'Investisseur')

  // Feuille Promoteur
  const proData = [
    ['BILAN PROMOTEUR', ''],
    ['CA prévisionnel', promoteur.ca],
    ['Terrain', -promoteur.coutTerrain],
    ['Construction', -promoteur.coutConst],
    ['Honoraires', -promoteur.frais],
    ['Commercialisation', -promoteur.commerc],
    ['Portage', -promoteur.portage],
    ['MARGE BRUTE', promoteur.margeBrute],
    ['Taux de marge', promoteur.margePct.toFixed(1) + '%'],
    [],
    ['SENSIBILITÉ', 'CA', 'Marge', 'Taux'],
    ...promoteur.sensitivity.map(s => [
      (s.variation >= 0 ? '+' : '') + s.variation + '%',
      s.ca, s.marge, s.pct.toFixed(1) + '%'
    ]),
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(proData), 'Promoteur')

  XLSX.writeFile(wb, 'simulation-immobilier-israel.xlsx')
}
```

Ajoute un bouton "📊 Export Excel" à côté du bouton PDF dans le header.

### 3.4 Bannière de données marché en temps réel

En haut de chaque onglet, ajoute une petite barre d'information marché :

```jsx
// src/components/MarketBanner.jsx
// Données statiques mises à jour manuellement (ou via API si possible)

const MARKET_DATA = {
  tauxBOI: 4.50,        // Taux directeur Banque d'Israël
  tauxHypo: 5.20,       // Taux hypothécaire moyen du marché
  indiceCSB: 285.4,     // Indice CBS prix immobilier (base 100 = 2000)
  evol12mois: +6.2,     // Evolution sur 12 mois en %
  derniereMAJ: '01/06/2025'
}

export function MarketBanner() {
  return (
    <div style={{
      background: '#F8F7F4', borderBottom: '1px solid #E5E7EB',
      padding: '6px 24px', fontSize: 12, color: '#6B7280',
      display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap'
    }}>
      <span>📊 Marché au {MARKET_DATA.derniereMAJ}</span>
      <span>Taux BOI : <strong style={{color:'#1A3A5C'}}>{MARKET_DATA.tauxBOI}%</strong></span>
      <span>Taux hypothécaire moyen : <strong style={{color:'#1A3A5C'}}>{MARKET_DATA.tauxHypo}%</strong></span>
      <span>Indice CBS : <strong style={{color:'#1A3A5C'}}>{MARKET_DATA.indiceCSB}</strong></span>
      <span style={{color: MARKET_DATA.evol12mois > 0 ? '#0F6E56' : '#993C1D'}}>
        {MARKET_DATA.evol12mois > 0 ? '▲' : '▼'} {Math.abs(MARKET_DATA.evol12mois)}% sur 12 mois
      </span>
    </div>
  )
}
```

---

## PARTIE 4 — ACCESSIBILITÉ

### 4.1 ARIA sur tous les sliders

Sur chaque `<input type="range">`, ajoute systématiquement :

```jsx
<input
  type="range"
  aria-label="Distance à la mer en kilomètres"
  aria-valuemin={0}
  aria-valuemax={20}
  aria-valuenow={distanceMer}
  aria-valuetext={`${distanceMer} kilomètres`}
  ...
/>
```

### 4.2 Navigation clavier complète

- Tous les éléments interactifs doivent être focusables (tabIndex si nécessaire)
- L'ordre de tabulation doit être logique (haut → bas, gauche → droite)
- Les onglets doivent être navigables avec les touches flèches (ArrowLeft/ArrowRight)
- Ajouter `role="tablist"` sur la nav, `role="tab"` sur chaque onglet, `role="tabpanel"` sur chaque contenu

```jsx
// Navigation clavier sur les onglets
function handleTabKeydown(e, index) {
  if (e.key === 'ArrowRight') setActiveTab(Math.min(index + 1, tabs.length - 1))
  if (e.key === 'ArrowLeft')  setActiveTab(Math.max(index - 1, 0))
  if (e.key === 'Home')       setActiveTab(0)
  if (e.key === 'End')        setActiveTab(tabs.length - 1)
}
```

### 4.3 Support RTL hébreu complet

Quand la langue sélectionnée est `עב` :

```jsx
// Dans App.jsx
useEffect(() => {
  document.documentElement.lang = langue === 'עב' ? 'he' : langue === 'EN' ? 'en' : 'fr'
  document.documentElement.dir  = langue === 'עב' ? 'rtl' : 'ltr'
}, [langue])
```

Pour le CSS, utilise les propriétés logiques partout :
- `margin-left` → `margin-inline-start`
- `padding-right` → `padding-inline-end`
- `text-align: left` → `text-align: start`
- `border-left` → `border-inline-start`

### 4.4 Contrastes WCAG AA

Corrige ces contrastes insuffisants :
- Labels de section (ex. "LOCALISATION") : passe de `#9CA3AF` à `#4B5563`
- Texte secondaire dans les cartes : minimum `#6B7280` sur fond blanc
- Badges de coefficient : assure un ratio de contraste ≥ 4.5:1

### 4.5 Descriptions alternatives pour les SVG

Sur chaque graphique SVG :

```jsx
// Waterfall chart
<svg role="img" aria-labelledby="waterfall-title waterfall-desc">
  <title id="waterfall-title">Décomposition des coefficients de valorisation</title>
  <desc id="waterfall-desc">
    Graphique à barres montrant l'évolution du prix au m² :
    base quartier 38 000₪, après équipements 46 264₪.
    Coefficient total ×{coefTotal.toFixed(3)}
  </desc>
  ...
</svg>

// Score ring
<svg role="img" aria-label={`Score urbanistique : ${score} sur 100 — ${scoreLabel}`}>
  ...
</svg>
```

---

## PARTIE 5 — SEO & MARKETING

### 5.1 Meta tags SEO dans index.html

Remplace le `<head>` actuel par :

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Simulateur Immobilier Israël — Estimation, Investissement & Bilan Promoteur</title>
  <meta name="description" content="Estimez le prix d'un bien immobilier en Israël, analysez votre investissement locatif, calculez votre bilan promoteur. Données Nadlan Gov, coefficients par quartier, TAMA 38, Pinouï-Binouï." />
  <meta name="keywords" content="immobilier israël, prix m2 tel aviv, investissement israël, simulateur immobilier, TAMA 38, pinouï binouï, Nadlan, herzliya pituach, netanya, olim hadashim" />
  <meta name="author" content="Simulateur Immobilier Israël" />
  <meta property="og:title" content="Simulateur Immobilier Israël" />
  <meta property="og:description" content="Outil professionnel d'estimation immobilière pour le marché israélien. Estimation, fiscalité, rendement locatif, bilan promoteur." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://israel-simzip.replit.app" />
  <meta property="og:image" content="https://israel-simzip.replit.app/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="https://israel-simzip.replit.app" />
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
</head>
```

### 5.2 Module de capture email (lead generation)

Crée `src/components/LeadCapture.jsx` :

```jsx
export function LeadCapture({ prixEstime, onglet }) {
  const [email, setEmail] = useState('')
  const [envoye, setEnvoye] = useState(false)
  const [visible, setVisible] = useState(false)

  // Afficher après 30 secondes sur la page OU après une simulation complète
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 30000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible || envoye) return null

  return (
    <div style={{
      background: '#1A3A5C', color: 'white', borderRadius: 12,
      padding: '20px 24px', margin: '24px 0',
      display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'
    }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>
          📩 Recevoir ce rapport par email
        </div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>
          Simulation {onglet} · {prixEstime} · Gratuit, sans engagement
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 6, border: 'none', minWidth: 200, fontSize: 14 }}
        />
        <button
          onClick={() => {
            // Ici : envoyer vers votre backend / Mailchimp / Notion API
            console.log('Lead:', email, onglet, prixEstime)
            setEnvoye(true)
          }}
          style={{
            background: '#C9A84C', color: '#1A3A5C', border: 'none',
            padding: '8px 16px', borderRadius: 6, fontWeight: 600, cursor: 'pointer'
          }}
        >
          Recevoir →
        </button>
      </div>
      <button onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.6, cursor: 'pointer', fontSize: 18 }}>✕</button>
    </div>
  )
}
```

Intègre `<LeadCapture>` dans les onglets Estimation et Promoteur, juste au-dessus de la section résultats.

### 5.3 Bandeau de réassurance dans le footer

Ajoute un footer sur toutes les pages :

```jsx
export function Footer() {
  return (
    <footer style={{ background: '#F8F7F4', borderTop: '1px solid #E5E7EB', padding: '24px', marginTop: '48px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1A3A5C' }}>Nadlan Gov</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Source des transactions</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1A3A5C' }}>CBS Israël</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Indices officiels</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1A3A5C' }}>GovMap</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Données cadastrales</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1A3A5C' }}>Mavat</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Plans urbanistiques</div>
          </div>
        </div>
        <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center' }}>
          Les estimations sont fournies à titre indicatif. Pour toute décision d'investissement, consultez un expert immobilier certifié.
          Données basées sur les transactions Nadlan Gov et l'indice CBS.
        </p>
      </div>
    </footer>
  )
}
```

---

## CHECKLIST DE VALIDATION FINALE

Avant de considérer toutes les modifications terminées, vérifie chaque point :

**Design**
- [ ] Nouvelle typographie DM Serif Display + Plus Jakarta Sans appliquée partout
- [ ] Palette #1A3A5C / #C9A84C cohérente dans header, onglets actifs, CTA
- [ ] 4 illustrations SVG remplacent les photos génériques
- [ ] Animations fade-in sur les onglets (200ms)
- [ ] Animations staggered sur les barres waterfall
- [ ] Flash doré sur les valeurs recalculées

**UX**
- [ ] Sauvegarde de scénarios en localStorage (max 10)
- [ ] Partage par URL hash fonctionnel
- [ ] Tooltips ⓘ sur les 7 champs techniques
- [ ] Layout 1 colonne sur mobile avec sticky bar résultats
- [ ] Validation des champs avec messages d'erreur inline
- [ ] Spinner sur le bouton PDF pendant la génération

**Fonctionnalités**
- [ ] Graphique courbe recharts dans l'onglet Investisseur
- [ ] Donut chart recharts dans le Bilan Promoteur
- [ ] Onglet Fiscalité avec Mas Rechisha + Mas Shevach + Arnona + avantages olim
- [ ] Export Excel (.xlsx) fonctionnel
- [ ] Bannière données marché en haut de page

**Accessibilité**
- [ ] aria-label, aria-valuemin/max/now sur tous les sliders
- [ ] Navigation clavier onglets (flèches + Home/End)
- [ ] RTL fonctionnel quand langue = עב
- [ ] Contrastes WCAG AA corrigés
- [ ] Descriptions textuelles sur les SVG (aria-label/aria-labelledby)

**SEO & Marketing**
- [ ] Meta tags title, description, OG, Twitter Card dans index.html
- [ ] Composant LeadCapture intégré dans Estimation et Promoteur
- [ ] Footer avec sources et mentions légales
- [ ] `npm run build` passe sans erreur

---

## COMMANDES D'INSTALLATION

Lance dans le Shell Replit avant de commencer :

```bash
npm install recharts xlsx
```

Le reste des dépendances (lucide-react, tailwindcss) est déjà installé.
