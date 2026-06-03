/**
 * ═════════════════════════════════════════════════════════════════════════════
 *  ISRAEL REAL ESTATE ENGINE — moteur de calcul partagé
 * ═════════════════════════════════════════════════════════════════════════════
 *
 *  Fichier AUTONOME (aucun import externe). Conçu pour être le moteur commun
 *  entre le simulateur et la plateforme de mise en relation.
 *
 *  Contenu :
 *    • Formatage          : fmt(), fmtM()
 *    • Données            : VILLES (villes + quartiers + prix ₪/m²), coefficients
 *    • Estimation         : calcEstimation()
 *    • Score investissmt. : calcInvestmentScore()
 *    • Coût travaux       : calcTravaux()
 *
 *  Tous les prix sont en shekels (₪). Données : Nadlan Gov / Yad2 / CBS (2025).
 *
 *  USAGE
 *  ─────
 *    import {
 *      calcEstimation, calcInvestmentScore, calcTravaux,
 *      VILLES, fmt, fmtM,
 *    } from './israelRealEstateEngine'
 * ═════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
//  1. FORMATAGE
// ─────────────────────────────────────────────────────────────────────────────

/** Formate un nombre avec séparateurs de milliers (ex: 1234567 → "1 234 567"). */
export const fmt = (n) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n)

/** Formate un montant en milliers de shekels (ex: 450000 → "450K₪"). */
export const fmtM = (n) => `${(n / 1000).toFixed(0)}K₪`

// ─────────────────────────────────────────────────────────────────────────────
//  2. DONNÉES VILLES / QUARTIERS (prix médian ₪/m² — Nadlan Gov Q1 2025)
// ─────────────────────────────────────────────────────────────────────────────

export const VILLES = {
  tlv: {
    label: 'Tel Aviv', labelHe: 'תל אביב',
    quartiers: {
      'Florentin / Kerem HaTeimanim': { prixMoyen: 42000, labelHe: 'פלורנטין / כרם התימנים' },
      'Neve Tzedek':                  { prixMoyen: 58000, labelHe: 'נווה צדק' },
      'Rothschild / Centre':          { prixMoyen: 62000, labelHe: 'רוטשילד / מרכז' },
      'Old North':                    { prixMoyen: 46000, labelHe: 'צפון ישן' },
      'Ramat Aviv':                   { prixMoyen: 38000, labelHe: 'רמת אביב' },
      'Jaffa':                        { prixMoyen: 31000, labelHe: 'יפו' },
      'Bat Yam (frontière)':          { prixMoyen: 22000, labelHe: 'בת ים (גבול)' },
    },
  },
  herzliya: {
    label: 'Herzliya', labelHe: 'הרצליה',
    quartiers: {
      'Herzliya Pituach': { prixMoyen: 50000, labelHe: 'הרצליה פיתוח' },
      'Centre-ville':     { prixMoyen: 30000, labelHe: 'מרכז העיר' },
      'Nordau':           { prixMoyen: 24000, labelHe: 'נורדאו' },
      'Neve Amirim':      { prixMoyen: 20000, labelHe: 'נווה אמירים' },
    },
  },
  jerusalem: {
    label: 'Jérusalem', labelHe: 'ירושלים',
    quartiers: {
      'Rehavia':          { prixMoyen: 40000, labelHe: 'רחביה' },
      'Talbiyeh':         { prixMoyen: 44000, labelHe: 'טלביה' },
      'German Colony':    { prixMoyen: 38000, labelHe: 'המושבה הגרמנית' },
      'Har Nof':          { prixMoyen: 19000, labelHe: 'הר נוף' },
      'Katamon':          { prixMoyen: 28000, labelHe: 'קטמון' },
      'Malha / Holyland': { prixMoyen: 25000, labelHe: 'מלחה / הולילנד' },
      'Pisgat Zeev':      { prixMoyen: 16000, labelHe: 'פסגת זאב' },
    },
  },
  netanya: {
    label: 'Netanya', labelHe: 'נתניה',
    quartiers: {
      'Ir Yamim':             { prixMoyen: 32000, labelHe: 'עיר ימים' },
      'Centre / bord de mer': { prixMoyen: 27000, labelHe: 'מרכז / חוף הים' },
      'Poleg':                { prixMoyen: 20000, labelHe: 'פולג' },
      'Agamim':               { prixMoyen: 24000, labelHe: 'אגמים' },
      'Kiryat HaSharon':      { prixMoyen: 18000, labelHe: 'קריית השרון' },
    },
  },
  raanana: {
    label: "Ra'anana", labelHe: 'רעננה',
    quartiers: {
      "Centre Ra'anana": { prixMoyen: 28000, labelHe: 'מרכז רעננה' },
      'Kfar Saba Nord':  { prixMoyen: 20000, labelHe: 'כפר סבא צפון' },
      'Neve Zemer':      { prixMoyen: 22000, labelHe: 'נווה זמר' },
    },
  },
  haifa: {
    label: 'Haïfa', labelHe: 'חיפה',
    quartiers: {
      'Carmel':          { prixMoyen: 22000, labelHe: 'הכרמל' },
      'Merkaz HaCarmel': { prixMoyen: 25000, labelHe: 'מרכז הכרמל' },
      'Hadar':           { prixMoyen: 15000, labelHe: 'הדר' },
      'Bat Galim':       { prixMoyen: 18000, labelHe: 'בת גלים' },
      'Neve Shaanan':    { prixMoyen: 16000, labelHe: 'נווה שאנן' },
    },
  },
  beersheva: {
    label: 'Beer Sheva', labelHe: 'באר שבע',
    quartiers: {
      'Gimmel (ancien)': { prixMoyen: 9000,  labelHe: 'גימל (ישן)' },
      'Nahal Beka':      { prixMoyen: 11000, labelHe: 'נחל בקע' },
      'Ramot':           { prixMoyen: 12000, labelHe: 'רמות' },
      'Dalet':           { prixMoyen: 10000, labelHe: 'דלת' },
    },
  },
  petah_tikva: {
    label: 'Petah Tikva', labelHe: 'פתח תקווה',
    quartiers: {
      'Centre':         { prixMoyen: 20000, labelHe: 'מרכז' },
      'Kiryat Matalon': { prixMoyen: 18000, labelHe: 'קריית מטלון' },
      'Neve Ilan':      { prixMoyen: 22000, labelHe: 'נווה אילן' },
    },
  },
  rishon: {
    label: 'Rishon LeZion', labelHe: 'ראשון לציון',
    quartiers: {
      'Centre Rishon':  { prixMoyen: 20000, labelHe: 'מרכז ראשון' },
      'Nahalat Yehuda': { prixMoyen: 23000, labelHe: 'נחלת יהודה' },
      'Rehovot':        { prixMoyen: 18000, labelHe: 'רחובות' },
    },
  },
  ashkelon: {
    label: 'Ashkelon', labelHe: 'אשקלון',
    quartiers: {
      'Centre':      { prixMoyen: 15000, labelHe: 'מרכז' },
      'Bord de mer': { prixMoyen: 18000, labelHe: 'חוף הים' },
      'Barnea':      { prixMoyen: 13000, labelHe: 'ברנע' },
    },
  },
  bat_yam: {
    label: 'Bat Yam', labelHe: 'בת ים',
    quartiers: {
      'Bord de mer':  { prixMoyen: 28000, labelHe: 'חוף הים' },
      'Centre-ville': { prixMoyen: 24000, labelHe: 'מרכז העיר' },
      'Ramat Yosef':  { prixMoyen: 21000, labelHe: 'רמת יוסף' },
      'Pardes Katz':  { prixMoyen: 19000, labelHe: 'פרדס כץ' },
    },
  },
  ben_shemen: {
    label: 'Ben Shemen', labelHe: 'בן שמן',
    quartiers: {
      'Moshav Ben Shemen':      { prixMoyen: 26000, labelHe: 'מושב בן שמן' },
      'Kfar HaNoar Ben Shemen': { prixMoyen: 22000, labelHe: 'כפר הנוער בן שמן' },
      'Ginaton (voisinage)':    { prixMoyen: 24000, labelHe: 'גינתון (סביבה)' },
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
//  3. COEFFICIENTS D'ESTIMATION
// ─────────────────────────────────────────────────────────────────────────────

export const TYPES_PROJET = [
  { label: 'Résidentiel classique',       value: 1.00 },
  { label: 'Résidentiel luxe',            value: 1.30 },
  { label: 'Programme neuf',              value: 1.10 },
  { label: 'TAMA 38',                     value: 0.95 },
  { label: 'Pinouï Binouï',               value: 1.05 },
  { label: 'Mixte commerces + logements', value: 1.15 },
]

export const coefSurface = (m2) => {
  if (m2 < 50)  return 1.22
  if (m2 < 70)  return 1.12
  if (m2 < 100) return 1.04
  if (m2 < 140) return 0.94
  return 0.87
}

export const coefMer = (km) => {
  if (km <= 0.2) return 1.35
  if (km <= 0.5) return 1.20
  if (km <= 1.5) return 1.10
  if (km <= 5)   return 1.02
  if (km <= 10)  return 0.96
  return 0.90
}

export const coefTransport = (km) => {
  if (km <= 0.3) return 1.08
  if (km <= 1)   return 1.04
  if (km <= 3)   return 1.00
  if (km <= 8)   return 0.97
  return 0.93
}

export const coefEtage = (etage) => {
  if (etage === 0) return 0.90
  if (etage <= 2)  return 0.97
  if (etage <= 8)  return 1.02
  if (etage <= 15) return 1.06
  return 1.12
}

export const EQUIPEMENTS = [
  { key: 'ascenseur', label: 'Ascenseur',       bonus: 0.05 },
  { key: 'parking',   label: 'Parking',         bonus: 0.10 },
  { key: 'mamad',     label: 'Mamad',           bonus: 0.06 },
  { key: 'terrasse',  label: 'Terrasse',        bonus: 0.07 },
  { key: 'vueMer',    label: 'Vue mer',         bonus: 0.20 },
  { key: 'vueDeg',    label: 'Vue dégagée',     bonus: 0.06 },
  { key: 'gardien',   label: 'Gardiennage',     bonus: 0.03 },
  { key: 'piscine',   label: 'Piscine commune', bonus: 0.04 },
  { key: 'gym',       label: 'Salle de sport',  bonus: 0.03 },
]

export const TYPES_BIEN = [
  { value: 'dira',      label: 'Appartement (דירה)',           coef: 1.00 },
  { value: 'dirat_gan', label: 'Appartement jardin (דירת גן)', coef: 0.92 },
  { value: 'penthouse', label: 'Penthouse (פנטהאוז)',          coef: 1.32 },
  { value: 'cottage',   label: 'Maison / Villa (קוטג׳)',        coef: 1.20 },
  { value: 'studio',    label: 'Studio',                        coef: 1.10 },
]

export const ETATS_BIEN = [
  { value: 'neuf_promoteur', label: 'Neuf promoteur', coef: 1.16 },
  { value: 'comme_neuf',     label: 'Comme neuf',     coef: 1.08 },
  { value: 'renove',         label: 'Rénové',         coef: 1.03 },
  { value: 'correct',        label: 'État correct',   coef: 1.00 },
  { value: 'a_renover',      label: 'À rénover',      coef: 0.87 },
]

export const coefPieces = (nb) => {
  if (nb <= 1)   return 1.14
  if (nb <= 1.5) return 1.10
  if (nb <= 2)   return 1.07
  if (nb <= 3)   return 1.00
  if (nb <= 4)   return 0.97
  if (nb <= 5)   return 0.94
  return 0.90
}

export const coefBalcon = (nb) => {
  if (nb === 0) return 1.00
  if (nb === 1) return 1.04
  if (nb === 2) return 1.07
  return 1.09
}

export const coefParking = (nb) => {
  if (nb === 0) return 1.00
  if (nb === 1) return 1.06
  return 1.10
}

export const coefAnneeConstruction = (annee) => {
  const age = new Date().getFullYear() - annee
  if (age <= 3)  return 1.10
  if (age <= 10) return 1.04
  if (age <= 25) return 1.00
  if (age <= 40) return 0.96
  if (age <= 55) return 0.92
  return 0.87
}

// ─────────────────────────────────────────────────────────────────────────────
//  4. ESTIMATION — prix au m² d'un bien
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Estime le prix d'un bien.
 *
 * @param {Object} inputs
 * @param {string} inputs.ville             clé de VILLES (ex: 'tlv')
 * @param {string} inputs.quartier          nom exact du quartier dans VILLES[ville]
 * @param {number} inputs.distanceMer        distance à la mer (km)
 * @param {number} inputs.distanceTransp     distance aux transports (km)
 * @param {number} inputs.typeProjet         coefficient projet (voir TYPES_PROJET)
 * @param {number} inputs.surface            surface (m²)
 * @param {number} inputs.etage              étage
 * @param {Object} inputs.equipements        { ascenseur, parking, mamad, terrasse, vueMer, vueDeg, gardien, piscine, gym }
 * @param {string} [inputs.typeBien]         valeur de TYPES_BIEN
 * @param {string} [inputs.etatBien]         valeur de ETATS_BIEN
 * @param {number} [inputs.nbPieces]
 * @param {number} [inputs.nbBalcons]
 * @param {number} [inputs.nbParkings]
 * @param {number} [inputs.anneeConstruction]
 * @returns {{prixM2:number, prixTotal:number, coefTotal:number, waterfall:Array}|null}
 */
export function calcEstimation(inputs) {
  const ville = VILLES[inputs.ville]
  if (!ville) return null
  const quartier = ville.quartiers[inputs.quartier]
  if (!quartier) return null

  const base = quartier.prixMoyen

  const cTypeProg  = inputs.typeProjet
  const cSurface   = coefSurface(inputs.surface)
  const cMer       = coefMer(inputs.distanceMer)
  const cTransport = coefTransport(inputs.distanceTransp)
  const cEtage     = coefEtage(inputs.etage)

  let cEquip = 1.0
  for (const eq of EQUIPEMENTS) {
    if (inputs.equipements && inputs.equipements[eq.key]) cEquip += eq.bonus
  }

  const typeBienDef = TYPES_BIEN.find(t => t.value === inputs.typeBien)
  const cTypeBien   = typeBienDef ? typeBienDef.coef : 1.00

  const etatDef = ETATS_BIEN.find(e => e.value === inputs.etatBien)
  const cEtat   = etatDef ? etatDef.coef : 1.00

  const cPieces  = inputs.nbPieces != null ? coefPieces(inputs.nbPieces) : 1.00
  const cBalcon  = inputs.nbBalcons != null ? coefBalcon(inputs.nbBalcons) : 1.00
  const cParking = inputs.nbParkings != null ? coefParking(inputs.nbParkings) : 1.00
  const cAnnee   = inputs.anneeConstruction ? coefAnneeConstruction(inputs.anneeConstruction) : 1.00

  // Évite le double comptage du parking (ancien système + nouveau)
  const cEquipFinal = inputs.nbParkings != null && inputs.equipements && inputs.equipements.parking
    ? cEquip - 0.10
    : cEquip

  const coefTotal =
    cTypeProg * cTypeBien * cSurface * cMer * cTransport * cEtage *
    cEquipFinal * cEtat * cPieces * cBalcon * cParking * cAnnee

  const prixM2    = Math.round(base * coefTotal)
  const prixTotal = Math.round(prixM2 * inputs.surface)

  // Les labels sont des clés de traduction (wf*) — à traduire côté consommateur
  // (FR/EN/HE). Filtre les coefficients neutres (= 1.00), hormis la base.
  const steps = [
    { label: 'wfBaseQuartier', coef: 1          },
    { label: 'wfTypeProg',     coef: cTypeProg  },
    { label: 'wfTypeBien',     coef: cTypeBien  },
    { label: 'wfSurface',      coef: cSurface   },
    { label: 'wfEtatBien',     coef: cEtat      },
    { label: 'wfPieces',       coef: cPieces    },
    { label: 'wfMer',          coef: cMer       },
    { label: 'wfTransport',    coef: cTransport },
    { label: 'wfEtage',        coef: cEtage     },
    { label: 'wfBalcon',       coef: cBalcon    },
    { label: 'wfParking',      coef: cParking   },
    { label: 'wfEquipements',  coef: cEquipFinal},
    { label: 'wfAnnee',        coef: cAnnee     },
  ].filter(s => s.coef !== 1.00 || s.label === 'wfBaseQuartier')

  let running = base
  const waterfall = steps.map((s, i) => {
    if (i > 0) running = Math.round(running * s.coef)
    return { label: s.label, coef: s.coef, prixCumul: Math.round(running) }
  })

  return { prixM2, prixTotal, coefTotal, waterfall }
}

// ─────────────────────────────────────────────────────────────────────────────
//  5. SCORE D'INVESTISSEMENT (potentiel urbanistique)
// ─────────────────────────────────────────────────────────────────────────────

export const STATUTS_PLAN = {
  approved:  { label: 'Plan approuvé (Taba validée)',  coef: 1.00, score: 30 },
  pending:   { label: "Plan en cours d'approbation",   coef: 0.97, score: 20 },
  study:     { label: 'En étude / avant-projet',       coef: 0.94, score: 10 },
  protected: { label: 'Zone protégée / patrimoine',    coef: 0.85, score: 0  },
  renewal:   { label: 'Zone de renouvellement urbain', coef: 1.05, score: 25 },
  priority:  { label: 'Secteur prioritaire municipal', coef: 1.03, score: 22 },
}

export const ACCORDS_MUNICIPAUX = {
  none:         { label: 'Aucun projet / zone ordinaire', coef: 1.00, score: 0  },
  tama38_etude: { label: 'TAMA 38 — en étude',            coef: 1.05, score: 15 },
  tama38_ok:    { label: 'TAMA 38 — approuvé',            coef: 1.15, score: 35 },
  pb_etude:     { label: 'Pinouï-Binouï — en étude',      coef: 1.10, score: 25 },
  pb_ok:        { label: 'Pinouï-Binouï — approuvé',      coef: 1.30, score: 55 },
  pc_ok:        { label: 'Permis de construire obtenu',   coef: 1.40, score: 70 },
  chantier:     { label: 'Chantier démarré',              coef: 1.50, score: 85 },
}

export const STATUTS_PERMIS = {
  none:       { label: 'Aucun permis déposé',            coef: 1.00, score: 0   },
  depose:     { label: 'Permis déposé (en instruction)', coef: 1.05, score: 10  },
  accorde:    { label: 'Permis accordé',                 coef: 1.15, score: 25  },
  opposition: { label: 'Opposition en cours',            coef: 0.93, score: -10 },
}

/**
 * Calcule le score d'investissement /100 et la valorisation d'un terrain/bien.
 *
 * @param {Object} inputs
 * @param {number} inputs.surfTerrain  surface du terrain (m²)
 * @param {number} inputs.surfExist    surface déjà construite (m²)
 * @param {number} inputs.cos          coefficient d'occupation des sols
 * @param {number} inputs.etagesAut    nombre d'étages autorisés
 * @param {number} inputs.prixActuel   prix actuel au m² (₪)
 * @param {('approved'|'pending'|'study'|'protected'|'renewal'|'priority')} inputs.planKey
 * @param {('none'|'tama38_etude'|'tama38_ok'|'pb_etude'|'pb_ok'|'pc_ok'|'chantier')} inputs.accordKey
 * @param {('none'|'depose'|'accorde'|'opposition')} inputs.permisKey
 * @returns {Object}
 */
export function calcInvestmentScore(inputs) {
  const plan   = STATUTS_PLAN[inputs.planKey]
  const accord = ACCORDS_MUNICIPAUX[inputs.accordKey]
  const permis = STATUTS_PERMIS[inputs.permisKey]

  const surfMax = inputs.surfTerrain * inputs.cos
  const droits  = Math.max(0, surfMax - inputs.surfExist)

  const rawScore =
    20
    + plan.score   * 0.5
    + accord.score * 0.6
    + permis.score * 0.4
    + (inputs.etagesAut > 15 ? 10 : inputs.etagesAut > 8 ? 5 : 0)
    + (droits > 500 ? 8 : droits > 200 ? 4 : 0)

  const score = Math.min(100, Math.max(0, Math.round(rawScore)))

  const scoreColor = score >= 70 ? '#0F6E56' : score >= 45 ? '#BA7517' : '#993C1D'
  const scoreLabel = score >= 70 ? 'Fort potentiel' : score >= 45 ? 'Potentiel modéré' : 'Potentiel faible'

  const coefTotal = plan.coef * accord.coef * permis.coef
  const prixProj  = Math.round(inputs.prixActuel * coefTotal)
  const gainM2    = prixProj - inputs.prixActuel
  const gainPct   = inputs.prixActuel > 0 ? ((prixProj - inputs.prixActuel) / inputs.prixActuel) * 100 : 0

  const valActTot  = Math.round(inputs.prixActuel * surfMax)
  const valProjTot = Math.round(prixProj * surfMax)
  const plusValue  = valProjTot - valActTot

  return {
    score, scoreLabel, scoreColor,
    coefTotal, prixProj, gainM2, gainPct,
    surfMax, droits,
    valActTot, valProjTot, plusValue,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  6. COÛT DES TRAVAUX / RÉNOVATION
// ─────────────────────────────────────────────────────────────────────────────

export const NIVEAUX_TRAVAUX = [
  { value: 'rafraichissement', min: 1200, max: 2200,  roi: 6  },
  { value: 'standard',         min: 2500, max: 4500,  roi: 13 },
  { value: 'lourde',           min: 5000, max: 8000,  roi: 20 },
  { value: 'luxe',             min: 9000, max: 14000, roi: 15 },
]

export const POSTES_TRAVAUX = [
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

export const VILLES_COEF_TRAVAUX = {
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

export const ACCES_TRAVAUX = [
  { value: 'facile',    coef: 1.00 },
  { value: 'moyen',     coef: 1.06 },
  { value: 'difficile', coef: 1.14 },
]

export const ETAT_INITIAL_TRAVAUX = [
  { value: 'tres_bon', coef: 0.85 },
  { value: 'bon',      coef: 1.00 },
  { value: 'usage',    coef: 1.18 },
  { value: 'degrade',  coef: 1.38 },
]

// Surcoût selon l'ancienneté du bâtiment (indexé par seuil d'année)
export const RISQUES_TRAVAUX = [
  { avant: 1960, coef: 1.30 },
  { avant: 1990, coef: 1.20 },
  { avant: 2000, coef: 1.10 },
  { avant: 9999, coef: 1.00 },
]

/**
 * Calcule le coût d'une rénovation et la ventilation par poste.
 *
 * @param {Object} inputs
 * @param {number} inputs.surface                          surface à rénover (m²)
 * @param {('rafraichissement'|'standard'|'lourde'|'luxe')} inputs.niveau
 * @param {string} inputs.ville                            clé de VILLES_COEF_TRAVAUX (ex: 'tel_aviv')
 * @param {number} inputs.annee                            année de construction
 * @param {('facile'|'moyen'|'difficile')} inputs.acces    accès au chantier
 * @param {('tres_bon'|'bon'|'usage'|'degrade')} inputs.etatInit  état initial
 * @returns {Object}  { minTotal, maxTotal, midTotal, coefTotal, roi, postes, ... }
 */
export function calcTravaux(inputs) {
  const niveauData = NIVEAUX_TRAVAUX.find(n => n.value === inputs.niveau) ?? NIVEAUX_TRAVAUX[1]
  const coefVille  = VILLES_COEF_TRAVAUX[inputs.ville] ?? 1
  const risqueData = RISQUES_TRAVAUX.find(r => inputs.annee < r.avant) ?? RISQUES_TRAVAUX[RISQUES_TRAVAUX.length - 1]
  const accesData  = ACCES_TRAVAUX.find(a => a.value === inputs.acces) ?? ACCES_TRAVAUX[1]
  const etatData   = ETAT_INITIAL_TRAVAUX.find(e => e.value === inputs.etatInit) ?? ETAT_INITIAL_TRAVAUX[1]

  const coefTotal = coefVille * risqueData.coef * accesData.coef * etatData.coef

  const minTotal = Math.round(niveauData.min * inputs.surface * coefTotal)
  const maxTotal = Math.round(niveauData.max * inputs.surface * coefTotal)
  const midTotal = Math.round((minTotal + maxTotal) / 2)

  const postes = POSTES_TRAVAUX.map(p => ({
    key: p.key, emoji: p.emoji, pct: p.pct,
    montant: Math.round(midTotal * p.pct),
  }))

  return {
    minTotal, maxTotal, midTotal,
    coefTotal, coefVille,
    risqueCoef: risqueData.coef,
    accesCoef: accesData.coef,
    etatCoef: etatData.coef,
    prixM2Min: niveauData.min,
    prixM2Max: niveauData.max,
    roi: niveauData.roi,
    postes,
  }
}
