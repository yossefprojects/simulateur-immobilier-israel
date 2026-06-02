# Prompt Replit — PDF multilingue (FR / EN / עב)

## Contexte

Le PDF est généré côté navigateur (frontend React).
La langue active est stockée dans un state React (probablement `langue` ou `lang`
dans le contexte ou le composant App).

Il faut :
1. Passer la langue active à la fonction d'export PDF
2. Traduire tous les textes hardcodés du PDF en 3 langues
3. Activer le RTL (droite à gauche) pour l'hébreu dans le PDF

---

## ÉTAPE 1 — Trouve la fonction d'export PDF

Cherche dans le code source le fichier qui contient la génération du PDF.
Ce sera probablement l'un de ces fichiers :
- `src/utils/exportPDF.js`
- `src/utils/pdf.js`
- `src/components/ExportButton.jsx`
- ou une fonction `exportPDF`, `generatePDF`, `handlePDF` dans `App.jsx`

---

## ÉTAPE 2 — Passe la langue à la fonction PDF

Dans le composant qui appelle l'export (probablement `App.jsx`) :

```jsx
// AVANT
<button onClick={() => exporterRapportPDF(data)}>PDF</button>

// APRÈS — passe la langue active
<button onClick={() => exporterRapportPDF(data, langue)}>PDF</button>
```

Dans la signature de la fonction PDF :

```javascript
// AVANT
export async function exporterRapportPDF(data) { ... }

// APRÈS
export async function exporterRapportPDF(data, langue = 'fr') { ... }
```

---

## ÉTAPE 3 — Dictionnaire de traductions PDF

Ajoute ce dictionnaire en haut du fichier d'export PDF
(ou dans `src/i18n/translations.js` si tu préfères centraliser) :

```javascript
const PDF_TRANSLATIONS = {

  // ── EN-TÊTES DE SECTION ───────────────────────────────────────────────────
  estimation: {
    fr: 'ESTIMATION',
    en: 'VALUATION',
    he: 'הערכת שווי',
  },
  potentielUrba: {
    fr: 'POTENTIEL URBANISTIQUE',
    en: 'URBAN POTENTIAL',
    he: 'פוטנציאל תכנוני',
  },
  analyseInv: {
    fr: 'ANALYSE INVESTISSEUR',
    en: 'INVESTOR ANALYSIS',
    he: 'ניתוח למשקיע',
  },
  bilanPromo: {
    fr: 'BILAN PROMOTEUR',
    en: "DEVELOPER P&L",
    he: 'מאזן יזם',
  },
  sensibilite: {
    fr: 'SENSIBILITÉ PRIX DE VENTE',
    en: 'SALE PRICE SENSITIVITY',
    he: 'רגישות מחיר מכירה',
  },

  // ── TITRES APP ────────────────────────────────────────────────────────────
  appTitle: {
    fr: 'Simulateur Immobilier Israël',
    en: 'Israel Real Estate Simulator',
    he: 'סימולטור נדל"ן ישראל',
  },
  appSubtitle: {
    fr: 'Valorisation marché · Potentiel urbanistique · Analyse financière',
    en: 'Market valuation · Urban potential · Financial analysis',
    he: 'הערכת שווי שוק · פוטנציאל תכנוני · ניתוח פיננסי',
  },

  // ── ESTIMATION ────────────────────────────────────────────────────────────
  prixEstime: {
    fr: 'Prix estimé',
    en: 'Estimated price',
    he: 'הערכת שווי',
  },
  fourchette: {
    fr: 'Fourchette',
    en: 'Range',
    he: 'טווח',
  },
  decomposition: {
    fr: 'DÉCOMPOSITION DES COEFFICIENTS',
    en: 'COEFFICIENT BREAKDOWN',
    he: 'פירוט מקדמים',
  },
  sensibiliteLabel: {
    fr: 'SENSIBILITÉ ±10%',
    en: '±10% SENSITIVITY',
    he: 'רגישות ±10%',
  },
  marche10moins: {
    fr: '-10% marché',
    en: '-10% market',
    he: 'שוק -10%',
  },
  estime: {
    fr: 'Estimé',
    en: 'Estimated',
    he: 'מוערך',
  },
  marche10plus: {
    fr: '+10% marché',
    en: '+10% market',
    he: 'שוק +10%',
  },
  // Champs formulaire
  ville: { fr: 'Ville', en: 'City', he: 'עיר' },
  quartier: { fr: 'Quartier', en: 'Neighbourhood', he: 'שכונה' },
  surface: { fr: 'Surface', en: 'Floor area', he: 'שטח' },
  etage: { fr: 'Étage', en: 'Floor', he: 'קומה' },
  distMer: { fr: 'Distance mer', en: 'Distance to sea', he: 'מרחק לים' },
  distTransport: { fr: 'Distance transports', en: 'Transport distance', he: 'מרחק לתחבורה' },
  // Waterfall
  wfBase: { fr: 'Base quartier', en: 'Neighbourhood base', he: 'בסיס שכונה' },
  wfSurface: { fr: 'Surface', en: 'Floor area', he: 'שטח' },
  wfMer: { fr: 'Proximité mer', en: 'Sea proximity', he: 'קרבה לים' },
  wfTransport: { fr: 'Transports', en: 'Transport', he: 'תחבורה' },
  wfEtage: { fr: 'Étage', en: 'Floor', he: 'קומה' },
  wfEquip: { fr: 'Équipements', en: 'Amenities', he: 'תוספות' },
  wfAnnee: { fr: 'Année construction', en: 'Year built', he: 'שנת בנייה' },

  // ── URBANISME ─────────────────────────────────────────────────────────────
  scoreUrba: { fr: '/ 100', en: '/ 100', he: '/ 100' },
  valActTot: { fr: 'Valeur actuelle totale', en: 'Current total value', he: 'שווי נוכחי כולל' },
  valProjTot: { fr: 'Valeur projetée totale', en: 'Projected total value', he: 'שווי מוקרן כולל' },
  plusValue: { fr: 'Plus-value potentielle', en: 'Potential capital gain', he: 'רווח הון פוטנציאלי' },
  coefUrba: { fr: 'Coef. urbanistique', en: 'Planning coefficient', he: 'מקדם תכנוני' },
  surfTerrain: { fr: 'Surface terrain', en: 'Plot area', he: 'שטח מגרש' },
  surfMax: { fr: 'Surface max construc.', en: 'Max buildable area', he: 'שטח בנייה מקסימלי' },
  droits: { fr: 'Droits restants', en: 'Remaining rights', he: 'זכויות נותרות' },
  potentielFaible: { fr: 'Potentiel faible', en: 'Low potential', he: 'פוטנציאל נמוך' },
  potentielModere: { fr: 'Potentiel modéré', en: 'Moderate potential', he: 'פוטנציאל בינוני' },
  potentielFort: { fr: 'Fort potentiel', en: 'Strong potential', he: 'פוטנציאל גבוה' },

  // ── INVESTISSEUR ──────────────────────────────────────────────────────────
  rendBrut: { fr: 'Rendement brut', en: 'Gross yield', he: 'תשואה גולמית' },
  rendNet: { fr: 'Rendement net', en: 'Net yield', he: 'תשואה נטו' },
  tri: { fr: 'TRI estimé', en: 'IRR (estimated)', he: 'IRR משוער' },
  mensualite: { fr: 'Mensualité crédit', en: 'Monthly payment', he: 'תשלום חודשי' },
  cashflow: { fr: 'Cash-flow mensuel', en: 'Monthly cash-flow', he: 'תזרים חודשי' },
  gainTotal: { fr: 'Gain total', en: 'Total gain', he: 'רווח כולל' },
  prixSortie: { fr: 'Prix de sortie à +10 ans', en: 'Exit price at +10 yrs', he: 'מחיר יציאה ב+10 שנים' },
  cashflowMensuel: { fr: 'CASH-FLOW MENSUEL', en: 'MONTHLY CASH-FLOW', he: 'תזרים חודשי' },
  loyerBrut: { fr: 'Loyer mensuel brut', en: 'Gross monthly rent', he: 'שכירות גולמית' },
  vacance: { fr: 'Vacance locative', en: 'Vacancy', he: 'ריקנות' },
  charges: { fr: 'Charges mensual.', en: 'Monthly expenses', he: 'הוצאות חודשיות' },
  mensualiteCredit: { fr: 'Mensualité crédit', en: 'Mortgage payment', he: 'תשלום משכנתא' },
  cashflowNet: { fr: 'Cash-flow net', en: 'Net cash-flow', he: 'תזרים נטו' },
  projection: { fr: 'PROJECTION SUR 10 ANS', en: 'PROJECTION OVER 10 YRS', he: 'תחזית ל-10 שנים' },
  annee: { fr: 'Année', en: 'Year', he: 'שנה' },
  valeur: { fr: 'Valeur', en: 'Value', he: 'שווי' },
  cfCumule: { fr: 'CF cumulé', en: 'Cumulative CF', he: 'תזרים מצטבר' },
  evolution: { fr: 'ÉVOLUTION DE LA VALEUR DU BIEN SUR 10 ANS', en: 'PROPERTY VALUE OVER 10 YEARS', he: 'התפתחות שווי הנכס ב-10 שנים' },

  // ── PROMOTEUR ─────────────────────────────────────────────────────────────
  margeBrute: { fr: 'Marge brute', en: 'Gross margin', he: 'רווח גולמי' },
  tauxMarge: { fr: 'Taux de marge / CA :', en: 'Margin rate / revenue:', he: 'שיעור רווח / הכנסות:' },
  structureBilan: { fr: 'STRUCTURE DU BILAN', en: 'P&L STRUCTURE', he: 'מבנה המאזן' },
  poste: { fr: 'Poste', en: 'Item', he: 'סעיף' },
  montant: { fr: 'Montant', en: 'Amount', he: 'סכום' },
  terrain: { fr: 'Terrain', en: 'Land', he: 'קרקע' },
  construction: { fr: 'Construction', en: 'Construction', he: 'בנייה' },
  honoraires: { fr: 'Honoraires techniques', en: 'Fees', he: 'שכ"ט' },
  commercial: { fr: 'Commercialisation', en: 'Marketing', he: 'שיווק' },
  portage: { fr: 'Portage financier', en: 'Carry cost', he: 'עלויות מימון' },
  ca: { fr: "Chiffre d'affaires", en: 'Revenue', he: 'הכנסות' },
  surfVend: { fr: 'Surface vendable', en: 'Sellable area', he: 'שטח מכיר' },
  prixRevient: { fr: 'Prix revient / m2', en: 'Break-even / m²', he: 'עלות / מ"ר' },
  // Sensibilité
  variation: { fr: 'Variation', en: 'Variation', he: 'שינוי' },
  caLabel: { fr: 'CA', en: 'Revenue', he: 'הכנסות' },
  margeLabel: { fr: 'Marge brute', en: 'Margin', he: 'רווח' },
  tauxLabel: { fr: '%', en: '%', he: '%' },
  indicateur: { fr: 'Indicateur', en: 'Indicator', he: 'אינדיקטור' },

  // ── FOOTER ────────────────────────────────────────────────────────────────
  footerLabel: {
    fr: 'Simulateur Immobilier Israël',
    en: 'Israel Real Estate Simulator',
    he: 'סימולטור נדל"ן ישראל',
  },
  page: { fr: 'Page', en: 'Page', he: 'עמוד' },
  sur: { fr: '/', en: '/', he: '/' },
}

// Helper — usage : T('prixEstime', langue)
function T(key, langue) {
  const lang = langue === 'עב' ? 'he' : langue === 'EN' ? 'en' : 'fr'
  return PDF_TRANSLATIONS[key]?.[lang] || PDF_TRANSLATIONS[key]?.['fr'] || key
}
```

---

## ÉTAPE 4 — Applique les traductions dans le code de génération PDF

Remplace **chaque string hardcodé** dans la fonction PDF par un appel `T()`.

Exemples concrets :

```javascript
// AVANT
drawText('ESTIMATION', x, y)
drawText('Prix estimé', x, y)
drawText('Base quartier', x, y)
drawText('Marge brute', x, y)
drawText('Page 1 / 3', x, y)

// APRÈS
drawText(T('estimation', langue), x, y)
drawText(T('prixEstime', langue), x, y)
drawText(T('wfBase', langue), x, y)
drawText(T('margeBrute', langue), x, y)
drawText(`${T('page', langue)} 1 ${T('sur', langue)} 3`, x, y)
```

Le waterfall dans le code ressemble probablement à :

```javascript
// AVANT
const waterfall = [
  { label: 'Base quartier', ... },
  { label: 'Surface', ... },
  { label: 'Proximité mer', ... },
  { label: 'Transports', ... },
  { label: 'Étage', ... },
  { label: 'Équipements', ... },
  { label: 'Année construction', ... },
]

// APRÈS — labels traduits
const waterfall = [
  { label: T('wfBase', langue), ... },
  { label: T('wfSurface', langue), ... },
  { label: T('wfMer', langue), ... },
  { label: T('wfTransport', langue), ... },
  { label: T('wfEtage', langue), ... },
  { label: T('wfEquip', langue), ... },
  { label: T('wfAnnee', langue), ... },
]
```

---

## ÉTAPE 5 — RTL pour l'hébreu (spécifique jsPDF)

Si la librairie utilisée est **jsPDF** :

```javascript
// En haut de la fonction, après avoir déterminé la langue
const isRTL = langue === 'עב'

// Pour jsPDF, inverser l'alignement du texte en mode RTL
function drawText(text, x, y, options = {}) {
  if (isRTL) {
    // En RTL, x=right anchor au lieu de x=left anchor
    const pageWidth = doc.internal.pageSize.getWidth()
    const mirroredX = pageWidth - x
    doc.text(text, mirroredX, y, { align: 'right', ...options })
  } else {
    doc.text(text, x, y, options)
  }
}
```

Si la librairie utilisée est **html2canvas + impression d'une div HTML** :

```javascript
// Ajouter dir="rtl" sur le conteneur HTML quand langue = 'עב'
const container = document.createElement('div')
if (isRTL) {
  container.setAttribute('dir', 'rtl')
  container.style.textAlign = 'right'
  container.style.direction = 'rtl'
}
```

---

## ÉTAPE 6 — Valeurs dynamiques traduites

Les valeurs dynamiques (labels des scores, potentiels) doivent aussi être traduites.
Cherche dans le code les conditions du type :

```javascript
// AVANT
const scoreLabel = score >= 70 ? 'Fort potentiel' : score >= 45 ? 'Potentiel modéré' : 'Potentiel faible'

// APRÈS
const scoreLabel = score >= 70
  ? T('potentielFort', langue)
  : score >= 45
    ? T('potentielModere', langue)
    : T('potentielFaible', langue)
```

---

## ÉTAPE 7 — Titre de la fenêtre / nom du fichier téléchargé

```javascript
// AVANT
doc.save('rapport-immobilier-israel.pdf')

// APRÈS — nom du fichier dans la langue active
const filenames = {
  fr: 'rapport-immobilier-israel.pdf',
  en: 'israel-real-estate-report.pdf',
  he: 'דוח-נדלן-ישראל.pdf',
}
const lang = langue === 'עב' ? 'he' : langue === 'EN' ? 'en' : 'fr'
doc.save(filenames[lang])
```

---

## Résumé des fichiers à modifier

| Fichier | Modification |
|---|---|
| Fichier d'export PDF (exportPDF.js ou équivalent) | Ajouter `PDF_TRANSLATIONS` + helper `T()` + remplacer tous les strings |
| `App.jsx` (ou composant avec le bouton PDF) | Passer `langue` en paramètre à l'appel de la fonction |

---

## Checklist de validation

Après les modifications, tester en changeant la langue AVANT de cliquer PDF :

**Mode FR :**
- [ ] "ESTIMATION", "Prix estimé", "Base quartier", "Marge brute"
- [ ] "Page 1 / 3"
- [ ] Nom du fichier : `rapport-immobilier-israel.pdf`

**Mode EN :**
- [ ] "VALUATION", "Estimated price", "Neighbourhood base", "Gross margin"
- [ ] "Page 1 / 3"
- [ ] Nom du fichier : `israel-real-estate-report.pdf`

**Mode עב :**
- [ ] "הערכת שווי", "הערכת שווי" (prix), "בסיס שכונה", "רווח גולמי"
- [ ] Texte aligné à droite (RTL)
- [ ] Nom du fichier : `דוח-נדלן-ישראל.pdf`
