# Prompt Replit — Correction complète des traductions (FR / EN / עב)

## Problème

Le fichier de traductions (`src/i18n/` ou équivalent) est incomplet.
Beaucoup de textes restent en français quelle que soit la langue sélectionnée.
Voici la liste exhaustive de tout ce qui doit être corrigé, langue par langue.

---

## LISTE DES PROBLÈMES CONSTATÉS

### En mode EN (anglais) — textes qui restent en français

**Onglet Estimation — formulaire gauche :**
- `"Type de bien"` → doit être `"Property type"`
- `"Appartement (דירה)"` → doit être `"Apartment (דירה)"`
- `"Penthouse (פנטהאוז)"` → doit être `"Penthouse (פנטהאוז)"`
- `"Villa / Maison (קוטג׳)"` → doit être `"Villa / House (קוטג׳)"`
- `"Appartement jardin (דירת גן)"` → doit être `"Garden apartment (דירת גן)"`
- `"Studio"` → reste `"Studio"` ✓ (identique)
- `"État du bien"` → doit être `"Property condition"`
- `"Neuf promoteur"` → doit être `"New (developer)"`
- `"Comme neuf"` → doit être `"Like new"`
- `"Rénové"` → doit être `"Renovated"`
- `"État correct"` → doit être `"Good condition"`
- `"À rénover"` → doit être `"Needs renovation"`
- `"Nombre de pièces (חדרים)"` → doit être `"Rooms (חדרים)"`
- `"3 pièces"` → doit être `"3 rooms"`
- `"Studio"` (valeur slider) → reste `"Studio"` ✓
- `"Balcon / terrasse (מרפסת)"` → doit être `"Balcony / terrace (מרפסת)"`
- `"Aucun"` (balcon) → doit être `"None"`
- `"Parking (חנייה)"` → doit être `"Parking (חנייה)"`
- `"Aucun"` (parking) → doit être `"None"`
- `"Année de construction"` → doit être `"Year built"`

**Onglet Estimation — résultats droite :**
- `"Prix estimé"` → doit être `"Estimated price"`
- `"Fourchette :"` → doit être `"Range:"`
- Section `"DÉCOMPOSITION DES COEFFICIENTS"` → doit être `"COEFFICIENT BREAKDOWN"` ✓ (déjà correct)
- `"Base quartier"` (ligne waterfall) → doit être `"Neighbourhood base"`
- `"Surface"` → doit être `"Floor area"`
- `"Proximité mer"` → doit être `"Sea proximity"`
- `"Transports"` → doit être `"Transport"`
- `"Étage"` → doit être `"Floor"`
- `"Équipements"` → doit être `"Amenities"`
- `"Année construction"` → doit être `"Year built"`
- `"Type de bien"` (waterfall) → doit être `"Property type"`
- `"État du bien"` (waterfall) → doit être `"Condition"`
- `"Nombre de pièces"` (waterfall) → doit être `"Rooms"`
- `"Balcon / terrasse"` (waterfall) → doit être `"Balcony"`
- `"Parking"` (waterfall) → reste `"Parking"` ✓

**Bannière marché en haut de page (reste en français dans toutes les langues) :**
- `"Marché au"` → EN: `"Market as of"` / עב: `"שוק נכון ל"`
- `"Taux BOI :"` → EN: `"BOI rate:"` / עב: `"ריבית בנק ישראל:"`
- `"Taux hypothécaire moyen :"` → EN: `"Avg. mortgage rate:"` / עב: `"ריבית משכנתא ממוצעת:"`
- `"Indice CBS :"` → EN: `"CBS index:"` / עב: `"מדד הלמ\"ס:"`
- `"/ 12 mois"` → EN: `"/ 12 months"` / עב: `"/ 12 חודשים"`

---

### En mode עב (hébreu) — textes qui restent en français

**Tous les textes ci-dessus + les suivants :**

**Onglet Estimation — formulaire :**
- `"Prix estimé"` → doit être `"הערכת שווי"`
- `"Fourchette :"` → doit être `"טווח :"`
- `"Base quartier"` (waterfall) → doit être `"בסיס שכונה"`
- `"Surface"` (waterfall) → doit être `"שטח"`
- `"Proximité mer"` (waterfall) → doit être `"קרבה לים"`
- `"Transports"` (waterfall) → doit être `"תחבורה"`
- `"Étage"` (waterfall) → doit être `"קומה"`
- `"Équipements"` (waterfall) → doit être `"תוספות"`
- `"Année construction"` (waterfall) → doit être `"שנת בנייה"`
- `"Type de bien"` (waterfall) → doit être `"סוג נכס"`
- `"État du bien"` (waterfall) → doit être `"מצב הנכס"`
- `"Type de bien"` (label champ) → doit être `"סוג נכס"`
- `"État du bien"` (label champ) → doit être `"מצב הנכס"`
- `"Appartement (דירה)"` → doit être `"דירה"`
- `"État correct"` → doit être `"מצב תקין"`
- `"Neuf promoteur"` → doit être `"חדש מקבלן"`
- `"Comme neuf"` → doit être `"כמו חדש"`
- `"Rénové"` → doit être `"משופץ"`
- `"À rénover"` → doit être `"דרוש שיפוץ"`
- `"Nombre de pièces (חדרים)"` → doit être `"מספר חדרים"`
- `"3 pièces"` → doit être `"3 חדרים"`
- `"Balcon / terrasse (מרפסת)"` → doit être `"מרפסת"`
- `"Aucun"` (balcon) → doit être `"אין"`
- `"Parking (חנייה)"` → doit être `"חנייה"`
- `"Aucun"` (parking) → doit être `"אין"`
- `"Année de construction"` → doit être `"שנת בנייה"`

---

## SOLUTION — Fichier de traductions complet à créer/remplacer

Trouve le fichier de traductions existant (probablement `src/i18n/translations.js`
ou `src/i18n/index.js` ou `src/contexts/LanguageContext.jsx`).

**Remplace-le entièrement par ce fichier complet :**

```javascript
// src/i18n/translations.js
export const translations = {

  // ─── NAVIGATION ──────────────────────────────────────────────────────────
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
  tabEstimation: {
    fr: 'Estimation',
    en: 'Valuation',
    he: 'הערכת שווי',
  },
  tabUrbanisme: {
    fr: 'Potentiel urbanistique',
    en: 'Urban potential',
    he: 'פוטנציאל תכנוני',
  },
  tabInvestisseur: {
    fr: 'Analyse investisseur',
    en: 'Investor analysis',
    he: 'ניתוח למשקיע',
  },
  tabPromoteur: {
    fr: 'Bilan promoteur',
    en: 'Developer P&L',
    he: 'מאזן יזם',
  },
  tabFiscalite: {
    fr: 'Fiscalité',
    en: 'Taxation',
    he: 'מיסוי',
  },

  // ─── BANNIÈRE MARCHÉ ─────────────────────────────────────────────────────
  marketBanner: {
    fr: 'Marché au',
    en: 'Market as of',
    he: 'שוק נכון ל',
  },
  tauxBOI: {
    fr: 'Taux BOI :',
    en: 'BOI rate:',
    he: 'ריבית בנק ישראל:',
  },
  tauxHypo: {
    fr: 'Taux hypothécaire moyen :',
    en: 'Avg. mortgage rate:',
    he: 'ריבית משכנתא ממוצעת:',
  },
  indiceCBS: {
    fr: 'Indice CBS :',
    en: 'CBS index:',
    he: 'מדד הלמ"ס:',
  },
  over12months: {
    fr: '/ 12 mois',
    en: '/ 12 months',
    he: '/ 12 חודשים',
  },

  // ─── ONGLET ESTIMATION — FORMULAIRE ──────────────────────────────────────
  sectionLocalisation: {
    fr: 'LOCALISATION',
    en: 'LOCATION',
    he: 'מיקום',
  },
  labelVille: {
    fr: 'Ville',
    en: 'City',
    he: 'עיר',
  },
  labelQuartier: {
    fr: 'Quartier',
    en: 'Neighbourhood',
    he: 'שכונה',
  },
  labelDistanceMer: {
    fr: 'Distance à la mer',
    en: 'Distance to sea',
    he: 'מרחק לים',
  },
  labelDistanceTransport: {
    fr: 'Distance transports (métro/tram)',
    en: 'Transport distance (metro/tram)',
    he: 'מרחק לתחבורה (מטרו/רכבת קלה)',
  },
  sectionProjet: {
    fr: 'PROJET',
    en: 'PROPERTY',
    he: 'נכס',
  },
  labelTypeProjet: {
    fr: 'Type de programme',
    en: 'Programme type',
    he: 'סוג פרויקט',
  },
  labelTypeBien: {
    fr: 'Type de bien',
    en: 'Property type',
    he: 'סוג נכס',
  },
  labelEtatBien: {
    fr: 'État du bien',
    en: 'Property condition',
    he: 'מצב הנכס',
  },
  labelSurface: {
    fr: 'Surface (m²)',
    en: 'Floor area (m²)',
    he: 'שטח (מ"ר)',
  },
  labelEtage: {
    fr: 'Étage',
    en: 'Floor',
    he: 'קומה',
  },
  labelNbPieces: {
    fr: 'Nombre de pièces (חדרים)',
    en: 'Rooms (חדרים)',
    he: 'מספר חדרים',
  },
  labelBalcon: {
    fr: 'Balcon / terrasse (מרפסת)',
    en: 'Balcony / terrace (מרפסת)',
    he: 'מרפסת',
  },
  labelParking: {
    fr: 'Parking (חנייה)',
    en: 'Parking (חנייה)',
    he: 'חנייה',
  },
  labelAnneeConstruction: {
    fr: 'Année de construction',
    en: 'Year built',
    he: 'שנת בנייה',
  },
  sectionEquipements: {
    fr: 'ÉQUIPEMENTS',
    en: 'AMENITIES',
    he: 'תוספות ומתקנים',
  },
  aucun: {
    fr: 'Aucun',
    en: 'None',
    he: 'אין',
  },
  rdc: {
    fr: 'RDC',
    en: 'Ground',
    he: 'קרקע',
  },
  pieces: {
    fr: 'pièces',
    en: 'rooms',
    he: 'חדרים',
  },
  studio: {
    fr: 'Studio',
    en: 'Studio',
    he: 'סטודיו',
  },

  // ─── TYPES DE BIEN ───────────────────────────────────────────────────────
  typeDira: {
    fr: 'Appartement (דירה)',
    en: 'Apartment (דירה)',
    he: 'דירה',
  },
  typePenthouse: {
    fr: 'Penthouse (פנטהאוז)',
    en: 'Penthouse (פנטהאוז)',
    he: 'פנטהאוז',
  },
  typeCottage: {
    fr: 'Villa / Maison (קוטג׳)',
    en: 'Villa / House (קוטג׳)',
    he: 'קוטג׳',
  },
  typeDiratGan: {
    fr: 'Appartement jardin (דירת גן)',
    en: 'Garden apartment (דירת גן)',
    he: 'דירת גן',
  },
  typeStudio: {
    fr: 'Studio',
    en: 'Studio',
    he: 'סטודיו',
  },

  // ─── ÉTATS DU BIEN ───────────────────────────────────────────────────────
  etatNeufPromoteur: {
    fr: 'Neuf promoteur',
    en: 'New (developer)',
    he: 'חדש מקבלן',
  },
  etatCommeNeuf: {
    fr: 'Comme neuf',
    en: 'Like new',
    he: 'כמו חדש',
  },
  etatRenove: {
    fr: 'Rénové',
    en: 'Renovated',
    he: 'משופץ',
  },
  etatCorrect: {
    fr: 'État correct',
    en: 'Good condition',
    he: 'מצב תקין',
  },
  etatARenover: {
    fr: 'À rénover',
    en: 'Needs renovation',
    he: 'דרוש שיפוץ',
  },

  // ─── RÉSULTATS ESTIMATION ────────────────────────────────────────────────
  prixEstime: {
    fr: 'Prix estimé',
    en: 'Estimated price',
    he: 'הערכת שווי',
  },
  fourchette: {
    fr: 'Fourchette :',
    en: 'Range:',
    he: 'טווח :',
  },
  sectionDecomposition: {
    fr: 'DÉCOMPOSITION DES COEFFICIENTS',
    en: 'COEFFICIENT BREAKDOWN',
    he: 'פירוט מקדמים',
  },
  // Étapes waterfall
  wfBaseQuartier: {
    fr: 'Base quartier',
    en: 'Neighbourhood base',
    he: 'בסיס שכונה',
  },
  wfTypeProjet: {
    fr: 'Type programme',
    en: 'Programme type',
    he: 'סוג פרויקט',
  },
  wfTypeBien: {
    fr: 'Type de bien',
    en: 'Property type',
    he: 'סוג נכס',
  },
  wfSurface: {
    fr: 'Surface',
    en: 'Floor area',
    he: 'שטח',
  },
  wfEtatBien: {
    fr: 'État du bien',
    en: 'Condition',
    he: 'מצב הנכס',
  },
  wfPieces: {
    fr: 'Nombre de pièces',
    en: 'Rooms',
    he: 'חדרים',
  },
  wfMer: {
    fr: 'Proximité mer',
    en: 'Sea proximity',
    he: 'קרבה לים',
  },
  wfTransport: {
    fr: 'Transports',
    en: 'Transport',
    he: 'תחבורה',
  },
  wfEtage: {
    fr: 'Étage',
    en: 'Floor',
    he: 'קומה',
  },
  wfBalcon: {
    fr: 'Balcon / terrasse',
    en: 'Balcony',
    he: 'מרפסת',
  },
  wfParking: {
    fr: 'Parking',
    en: 'Parking',
    he: 'חנייה',
  },
  wfEquipements: {
    fr: 'Équipements',
    en: 'Amenities',
    he: 'תוספות',
  },
  wfAnnee: {
    fr: 'Année construction',
    en: 'Year built',
    he: 'שנת בנייה',
  },
  sectionSensibilite: {
    fr: 'SENSIBILITÉ ±10%',
    en: '±10% SENSITIVITY',
    he: 'רגישות ±10%',
  },
  sensiBas: {
    fr: '-10% marché',
    en: '-10% market',
    he: 'שוק -10%',
  },
  senseEstime: {
    fr: 'Estimé',
    en: 'Estimated',
    he: 'מוערך',
  },
  sensiHaut: {
    fr: '+10% marché',
    en: '+10% market',
    he: 'שוק +10%',
  },

  // ─── ONGLET URBANISTIQUE ─────────────────────────────────────────────────
  sectionCadastre: {
    fr: 'IDENTIFICATION CADASTRALE',
    en: 'LAND REGISTRY',
    he: 'זיהוי קדסטרלי',
  },
  labelGush: {
    fr: 'Numéro de gush (bloc)',
    en: 'Gush (block number)',
    he: 'גוש',
  },
  labelHelka: {
    fr: 'Numéro de helka (parcelle)',
    en: 'Helka (parcel number)',
    he: 'חלקה',
  },
  labelSurfaceTerrain: {
    fr: 'Surface terrain (m²)',
    en: 'Plot area (m²)',
    he: 'שטח מגרש (מ"ר)',
  },
  labelSurfaceExist: {
    fr: 'Surface construite existante (m²)',
    en: 'Existing built area (m²)',
    he: 'שטח בנוי קיים (מ"ר)',
  },
  sectionStatutUrba: {
    fr: 'STATUT URBANISTIQUE (TABA / תב"ע)',
    en: 'PLANNING STATUS (TABA / תב"ע)',
    he: 'סטטוס תכנוני (תב"ע)',
  },
  labelPlanLocal: {
    fr: 'Plan local',
    en: 'Local plan',
    he: 'תוכנית מקומית',
  },
  labelEtagesAut: {
    fr: 'Étages autorisés',
    en: 'Permitted floors',
    he: 'קומות מותרות',
  },
  labelCOS: {
    fr: "COS (coefficient d'occupation du sol)",
    en: 'FAR (floor area ratio)',
    he: 'מקדם בנייה (COS)',
  },
  sectionAccords: {
    fr: 'ACCORDS ET PROGRAMMES MUNICIPAUX',
    en: 'MUNICIPAL PROGRAMMES',
    he: 'הסכמים ותוכניות עירוניות',
  },
  labelAccordMunicipal: {
    fr: 'Statut du projet municipal',
    en: 'Municipal project status',
    he: 'סטטוס פרויקט עירוני',
  },
  labelPermis: {
    fr: 'Permis de construire',
    en: 'Building permit',
    he: 'היתר בנייה',
  },
  labelPrixActuel: {
    fr: 'Prix actuel au m² (₪/m²)',
    en: 'Current price per m² (₪/m²)',
    he: 'מחיר נוכחי למ"ר (₪/מ"ר)',
  },
  sectionScoreUrba: {
    fr: 'SCORE URBANISTIQUE',
    en: 'PLANNING SCORE',
    he: 'ציון תכנוני',
  },
  sectionValorisationProj: {
    fr: 'VALORISATION PROJETÉE',
    en: 'PROJECTED VALUATION',
    he: 'שווי מוקרן',
  },
  labelValeurActTot: {
    fr: 'Valeur actuelle totale',
    en: 'Current total value',
    he: 'שווי נוכחי כולל',
  },
  labelValeurProjTot: {
    fr: 'Valeur projetée totale',
    en: 'Projected total value',
    he: 'שווי מוקרן כולל',
  },
  labelPlusValue: {
    fr: 'Plus-value potentielle',
    en: 'Potential capital gain',
    he: 'רווח הון פוטנציאלי',
  },
  labelCoefUrba: {
    fr: 'Coef. urbanistique total',
    en: 'Total planning coefficient',
    he: 'מקדם תכנוני כולל',
  },
  sectionDroits: {
    fr: 'DROITS À CONSTRUIRE',
    en: 'BUILDING RIGHTS',
    he: 'זכויות בנייה',
  },
  labelSurfaceMax: {
    fr: 'Surface max constructible',
    en: 'Max buildable area',
    he: 'שטח בנייה מקסימלי',
  },
  labelDroitsRestants: {
    fr: 'Droits restants',
    en: 'Remaining rights',
    he: 'זכויות נותרות',
  },
  labelEtagesAut2: {
    fr: 'Étages autorisés',
    en: 'Permitted floors',
    he: 'קומות מותרות',
  },
  sectionAvancement: {
    fr: "AVANCEMENT DU DOSSIER",
    en: 'PERMIT PROGRESS',
    he: 'התקדמות התיק',
  },

  // ─── ONGLET INVESTISSEUR ─────────────────────────────────────────────────
  sectionBienFinancement: {
    fr: 'BIEN ET FINANCEMENT',
    en: 'PROPERTY & FINANCING',
    he: 'נכס ומימון',
  },
  labelPrixAchat: {
    fr: "Prix d'achat (₪)",
    en: 'Purchase price (₪)',
    he: 'מחיר רכישה (₪)',
  },
  labelApport: {
    fr: 'Apport personnel (%)',
    en: 'Down payment (%)',
    he: 'הון עצמי (%)',
  },
  labelTauxHypo: {
    fr: 'Taux hypothécaire (%)',
    en: 'Mortgage rate (%)',
    he: 'ריבית משכנתא (%)',
  },
  labelDureePret: {
    fr: 'Durée du prêt (années)',
    en: 'Loan term (years)',
    he: 'תקופת הלוואה (שנים)',
  },
  sectionRevenus: {
    fr: 'REVENUS LOCATIFS',
    en: 'RENTAL INCOME',
    he: 'הכנסות שכירות',
  },
  labelLoyerMensuel: {
    fr: 'Loyer mensuel (₪)',
    en: 'Monthly rent (₪)',
    he: 'שכירות חודשית (₪)',
  },
  labelVacance: {
    fr: 'Taux de vacance (%)',
    en: 'Vacancy rate (%)',
    he: 'שיעור ריקנות (%)',
  },
  labelCharges: {
    fr: 'Charges annuelles (₪)',
    en: 'Annual expenses (₪)',
    he: 'הוצאות שנתיות (₪)',
  },
  labelReval: {
    fr: 'Revalorisation annuelle (%)',
    en: 'Annual appreciation (%)',
    he: 'עליית ערך שנתית (%)',
  },
  labelHorizon: {
    fr: 'Horizon (années)',
    en: 'Investment horizon (years)',
    he: 'אופק השקעה (שנים)',
  },
  sectionResultatsInv: {
    fr: 'RÉSULTATS',
    en: 'RESULTS',
    he: 'תוצאות',
  },
  labelRendBrut: {
    fr: 'Rendement brut',
    en: 'Gross yield',
    he: 'תשואה גולמית',
  },
  labelRendNet: {
    fr: 'Rendement net',
    en: 'Net yield',
    he: 'תשואה נטו',
  },
  labelMensualite: {
    fr: 'Mensualité crédit',
    en: 'Monthly payment',
    he: 'תשלום חודשי',
  },
  labelTRI: {
    fr: 'TRI estimé',
    en: 'IRR (estimated)',
    he: 'IRR משוער',
  },
  labelPrixSortie: {
    fr: 'Prix sortie',
    en: 'Exit price',
    he: 'מחיר יציאה',
  },
  labelGainTotal: {
    fr: 'Gain total',
    en: 'Total gain',
    he: 'רווח כולל',
  },
  sectionCashflow: {
    fr: 'CASH-FLOW MENSUEL',
    en: 'MONTHLY CASH-FLOW',
    he: 'תזרים חודשי',
  },
  labelLoyerBrut: {
    fr: 'Loyer mensuel brut',
    en: 'Gross monthly rent',
    he: 'שכירות חודשית גולמית',
  },
  labelVacanceLine: {
    fr: 'Vacance locative',
    en: 'Vacancy',
    he: 'ריקנות',
  },
  labelChargesLine: {
    fr: 'Charges mensualisées',
    en: 'Monthly expenses',
    he: 'הוצאות חודשיות',
  },
  labelMensualiteLine: {
    fr: 'Mensualité crédit',
    en: 'Mortgage payment',
    he: 'תשלום משכנתא',
  },
  labelCashflowNet: {
    fr: 'Cash-flow mensuel',
    en: 'Monthly cash-flow',
    he: 'תזרים חודשי נטו',
  },
  sectionProjection: {
    fr: 'PROJECTION SUR',
    en: 'PROJECTION OVER',
    he: 'תחזית ל',
  },
  yrs: {
    fr: 'ans',
    en: 'yrs',
    he: 'שנים',
  },

  // ─── ONGLET PROMOTEUR ────────────────────────────────────────────────────
  sectionPromoProjet: {
    fr: 'PROJET DE PROMOTION',
    en: 'DEVELOPMENT PROJECT',
    he: 'פרויקט יזמי',
  },
  labelSurfaceTer: {
    fr: 'Surface terrain (m²)',
    en: 'Plot area (m²)',
    he: 'שטח מגרש (מ"ר)',
  },
  labelCOSPromo: {
    fr: 'COS',
    en: 'FAR',
    he: 'מקדם בנייה',
  },
  labelRatioVend: {
    fr: 'Ratio surface vendable (%)',
    en: 'Sellable area ratio (%)',
    he: 'יחס שטח מכיר (%)',
  },
  labelPrixVente: {
    fr: 'Prix de vente moyen (₪/m²)',
    en: 'Average sale price (₪/m²)',
    he: 'מחיר מכירה ממוצע (₪/מ"ר)',
  },
  sectionCouts: {
    fr: 'COÛTS',
    en: 'COSTS',
    he: 'עלויות',
  },
  labelCoutTerrain: {
    fr: 'Coût terrain (₪)',
    en: 'Land cost (₪)',
    he: 'עלות קרקע (₪)',
  },
  labelCoutConst: {
    fr: 'Coût construction (₪/m²)',
    en: 'Construction cost (₪/m²)',
    he: 'עלות בנייה (₪/מ"ר)',
  },
  labelFrais: {
    fr: 'Frais techniques et honoraires (%)',
    en: 'Technical fees & consultants (%)',
    he: 'שכ"ט ויועצים (%)',
  },
  labelCommerc: {
    fr: 'Commercialisation (%)',
    en: 'Marketing & sales (%)',
    he: 'שיווק ומכירות (%)',
  },
  labelPortage: {
    fr: 'Portage financier (%)',
    en: 'Financing carry cost (%)',
    he: 'עלויות מימון (%)',
  },
  sectionResultatsPromo: {
    fr: 'RÉSULTATS DU BILAN',
    en: 'P&L RESULTS',
    he: 'תוצאות המאזן',
  },
  labelCA: {
    fr: 'CA prévisionnel',
    en: 'Projected revenue',
    he: 'הכנסות צפויות',
  },
  labelMargeBrute: {
    fr: 'Marge brute',
    en: 'Gross margin',
    he: 'רווח גולמי',
  },
  labelMargePct: {
    fr: 'Taux de marge / CA',
    en: 'Margin rate / revenue',
    he: 'שיעור רווח / הכנסות',
  },
  labelMargeSurCout: {
    fr: 'Marge / coût total',
    en: 'Margin / total cost',
    he: 'רווח / עלות כוללת',
  },
  labelSurfVend: {
    fr: 'Surface vendable',
    en: 'Sellable area',
    he: 'שטח מכיר',
  },
  labelPrixRevient: {
    fr: 'Prix revient / m²',
    en: 'Break-even price / m²',
    he: 'מחיר עלות / מ"ר',
  },
  sectionBilanStruct: {
    fr: 'STRUCTURE DU BILAN',
    en: 'P&L STRUCTURE',
    he: 'מבנה המאזן',
  },
  bilanTerrain: {
    fr: 'Terrain',
    en: 'Land',
    he: 'קרקע',
  },
  bilanConstruction: {
    fr: 'Construction',
    en: 'Construction',
    he: 'בנייה',
  },
  bilanHonoraires: {
    fr: 'Honoraires techniques',
    en: 'Fees',
    he: 'שכ"ט',
  },
  bilanCommerc: {
    fr: 'Commercialisation',
    en: 'Marketing',
    he: 'שיווק',
  },
  bilanPortage: {
    fr: 'Portage financier',
    en: 'Carry cost',
    he: 'עלויות מימון',
  },
  bilanCA: {
    fr: "Chiffre d'affaires",
    en: 'Revenue',
    he: 'הכנסות',
  },
  bilanMarge: {
    fr: 'Marge brute',
    en: 'Gross margin',
    he: 'רווח גולמי',
  },
  sectionSensibilitePromo: {
    fr: 'SENSIBILITÉ PRIX DE VENTE',
    en: 'SALE PRICE SENSITIVITY',
    he: 'רגישות מחיר מכירה',
  },
  sensiVariation: {
    fr: 'Variation',
    en: 'Variation',
    he: 'שינוי',
  },
  sensiCA: {
    fr: 'CA',
    en: 'Revenue',
    he: 'הכנסות',
  },
  sensiMarge: {
    fr: 'Marge',
    en: 'Margin',
    he: 'רווח',
  },
  sensiTaux: {
    fr: 'Taux',
    en: 'Rate',
    he: 'שיעור',
  },
}

// Helper pour utiliser les traductions
export function t(key, lang) {
  if (!translations[key]) {
    console.warn(`Missing translation key: ${key}`)
    return key
  }
  return translations[key][lang] || translations[key]['fr'] || key
}
```

---

## COMMENT APPLIQUER — Mise à jour de tous les composants

Dans chaque composant qui utilise `useLanguage()` (ou équivalent),
remplace tous les strings hardcodés par des appels à `t(key, lang)`.

**Exemple de remplacement :**

```jsx
// AVANT (string hardcodé)
<label>Type de bien</label>

// APRÈS (traduit)
<label>{t('labelTypeBien', lang)}</label>
```

```jsx
// AVANT (waterfall step label hardcodé)
{ label: 'Base quartier', coef: 1 }

// APRÈS (traduit)
{ label: t('wfBaseQuartier', lang), coef: 1 }
```

```jsx
// AVANT (option select hardcodée)
<option value="correct">État correct</option>

// APRÈS (traduit)
<option value="correct">{t('etatCorrect', lang)}</option>
```

```jsx
// AVANT (valeur slider hardcodée)
display={nbPieces === 1 ? 'Studio' : nbPieces + ' pièces'}

// APRÈS (traduit)
display={nbPieces === 1 ? t('studio', lang) : nbPieces + ' ' + t('pieces', lang)}
```

---

## CHECKLIST DE VALIDATION

Après avoir appliqué les corrections, vérifier en passant sur chaque langue :

**EN — tous ces textes doivent être en anglais :**
- [ ] Bannière marché : "Market as of" / "BOI rate" / "Avg. mortgage rate" / "CBS index"
- [ ] Waterfall : "Neighbourhood base" / "Floor area" / "Sea proximity" / "Transport" / "Floor" / "Amenities" / "Year built"
- [ ] Champs : "Property type" / "Property condition" / "Rooms" / "None" / "Year built"
- [ ] Options : "Apartment" / "Good condition" / "Needs renovation" / "Like new" / "Renovated"
- [ ] Résultat : "Estimated price" / "Range:"

**עב — tous ces textes doivent être en hébreu :**
- [ ] Bannière marché : "שוק נכון ל" / "ריבית בנק ישראל" / "ריבית משכנתא ממוצעת" / "מדד הלמ\"ס"
- [ ] Waterfall : "בסיס שכונה" / "שטח" / "קרבה לים" / "תחבורה" / "קומה" / "תוספות" / "שנת בנייה"
- [ ] Champs : "סוג נכס" / "מצב הנכס" / "מספר חדרים" / "אין" / "שנת בנייה"
- [ ] Options : "דירה" / "מצב תקין" / "דרוש שיפוץ" / "כמו חדש" / "משופץ"
- [ ] Résultat : "הערכת שווי" / "טווח :"
- [ ] Sliders : "3 חדרים" / "אין" (balcon/parking)
