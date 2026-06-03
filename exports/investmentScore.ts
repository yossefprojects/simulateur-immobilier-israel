/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Score d'investissement immobilier — logique extraite du simulateur
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Fichier AUTONOME, prêt à copier-coller dans la nouvelle plateforme.
 *  Aucune dépendance externe (pas d'import). Fonctionne avec Vite + React (TS).
 *
 *  Pour une version JavaScript pure (.js) : supprimez simplement les
 *  annotations de type (`: number`, les `interface`, `type`, etc.).
 *
 *  USAGE
 *  ─────
 *    import { calcInvestmentScore } from './investmentScore'
 *
 *    const result = calcInvestmentScore({
 *      surfTerrain: 500,   // surface du terrain (m²)
 *      surfExist:   200,   // surface déjà construite (m²)
 *      cos:         2.5,   // coefficient d'occupation des sols
 *      etagesAut:   12,    // nombre d'étages autorisés
 *      prixActuel:  25000, // prix actuel au m² (₪)
 *      planKey:    'approved',
 *      accordKey:  'tama38_ok',
 *      permisKey:  'accorde',
 *    })
 *
 *    result.score        // 0–100
 *    result.scoreLabel   // 'Fort potentiel' | 'Potentiel modéré' | 'Potentiel faible'
 *    result.scoreColor   // couleur hex associée
 *    result.plusValue    // plus-value totale estimée (₪)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export type PlanKey   = 'approved' | 'pending' | 'study' | 'protected' | 'renewal' | 'priority'
export type AccordKey = 'none' | 'tama38_etude' | 'tama38_ok' | 'pb_etude' | 'pb_ok' | 'pc_ok' | 'chantier'
export type PermisKey = 'none' | 'depose' | 'accorde' | 'opposition'

export interface InvestmentScoreInputs {
  surfTerrain: number   // surface du terrain (m²)
  surfExist:   number   // surface déjà construite (m²)
  cos:         number   // coefficient d'occupation des sols (COS)
  etagesAut:   number   // nombre d'étages autorisés
  prixActuel:  number   // prix actuel au m² (₪)
  planKey:     PlanKey  // statut du plan d'urbanisme (Taba)
  accordKey:   AccordKey // accord municipal / dispositif (TAMA 38, Pinouï-Binouï…)
  permisKey:   PermisKey // statut du permis de construire
}

export interface InvestmentScoreResult {
  score:      number   // score final 0–100
  scoreLabel: string   // libellé qualitatif
  scoreColor: string   // couleur hex pour l'affichage
  coefTotal:  number   // coefficient multiplicateur de valorisation
  prixProj:   number   // prix projeté au m² (₪)
  gainM2:     number   // gain au m² (₪)
  gainPct:    number   // gain en %
  surfMax:    number   // surface constructible max (m²)
  droits:     number   // droits à bâtir restants (m²)
  valActTot:  number   // valeur actuelle totale (₪)
  valProjTot: number   // valeur projetée totale (₪)
  plusValue:  number   // plus-value totale estimée (₪)
}

interface ScoreDef {
  label: string
  coef:  number
  score: number
}

// ─── Tables de référence (marché israélien) ─────────────────────────────────

export const STATUTS_PLAN: Record<PlanKey, ScoreDef> = {
  approved:  { label: 'Plan approuvé (Taba validée)',  coef: 1.00, score: 30 },
  pending:   { label: "Plan en cours d'approbation",   coef: 0.97, score: 20 },
  study:     { label: 'En étude / avant-projet',       coef: 0.94, score: 10 },
  protected: { label: 'Zone protégée / patrimoine',    coef: 0.85, score: 0  },
  renewal:   { label: 'Zone de renouvellement urbain', coef: 1.05, score: 25 },
  priority:  { label: 'Secteur prioritaire municipal', coef: 1.03, score: 22 },
}

export const ACCORDS_MUNICIPAUX: Record<AccordKey, ScoreDef> = {
  none:         { label: 'Aucun projet / zone ordinaire', coef: 1.00, score: 0  },
  tama38_etude: { label: 'TAMA 38 — en étude',            coef: 1.05, score: 15 },
  tama38_ok:    { label: 'TAMA 38 — approuvé',            coef: 1.15, score: 35 },
  pb_etude:     { label: 'Pinouï-Binouï — en étude',      coef: 1.10, score: 25 },
  pb_ok:        { label: 'Pinouï-Binouï — approuvé',      coef: 1.30, score: 55 },
  pc_ok:        { label: 'Permis de construire obtenu',   coef: 1.40, score: 70 },
  chantier:     { label: 'Chantier démarré',              coef: 1.50, score: 85 },
}

export const STATUTS_PERMIS: Record<PermisKey, ScoreDef> = {
  none:       { label: 'Aucun permis déposé',            coef: 1.00, score: 0   },
  depose:     { label: 'Permis déposé (en instruction)', coef: 1.05, score: 10  },
  accorde:    { label: 'Permis accordé',                 coef: 1.15, score: 25  },
  opposition: { label: 'Opposition en cours',            coef: 0.93, score: -10 },
}

// ─── Calcul du score d'investissement ───────────────────────────────────────

export function calcInvestmentScore(inputs: InvestmentScoreInputs): InvestmentScoreResult {
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
