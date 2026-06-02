// ─── Estimation ───────────────────────────────────────────────────────────────

export interface Equipements {
  ascenseur: boolean
  parking:   boolean
  mamad:     boolean
  terrasse:  boolean
  vueMer:    boolean
  vueDeg:    boolean
  gardien:   boolean
  piscine:   boolean
  gym:       boolean
}

export interface EstimationInputs {
  ville:          string
  quartier:       string
  distanceMer:    number
  distanceTransp: number
  typeProjet:     number
  surface:        number
  etage:          number
  equipements:    Equipements
}

export interface EstimationResult {
  prixM2:     number
  prixTotal:  number
  coefTotal:  number
  waterfall:  WaterfallStep[]
}

export interface WaterfallStep {
  label:     string
  coef:      number
  prixCumul: number
}

// ─── Urbanisme ────────────────────────────────────────────────────────────────

export type PlanKey    = 'approved' | 'pending' | 'study' | 'protected' | 'renewal' | 'priority'
export type AccordKey  = 'none' | 'tama38_etude' | 'tama38_ok' | 'pb_etude' | 'pb_ok' | 'pc_ok' | 'chantier'
export type PermisKey  = 'none' | 'depose' | 'accorde' | 'opposition'

export interface UrbanismeInputs {
  gush:        string
  helka:       string
  ville:       string
  surfTerrain: number
  surfExist:   number
  planKey:     PlanKey
  etagesAut:   number
  cos:         number
  accordKey:   AccordKey
  permisKey:   PermisKey
  prixActuel:  number
}

export interface UrbanismeResult {
  score:        number
  scoreLabel:   string
  scoreColor:   string
  coefTotal:    number
  prixProj:     number
  gainM2:       number
  gainPct:      number
  surfMax:      number
  droits:       number
  valActTot:    number
  valProjTot:   number
  plusValue:    number
}

// ─── Investisseur ─────────────────────────────────────────────────────────────

export interface InvestInputs {
  prix:     number
  apport:   number
  taux:     number
  duree:    number
  loyer:    number
  vacance:  number
  charges:  number
  reval:    number
  horizon:  number
}

export interface InvestResult {
  mensualite:   number
  rendBrut:     number
  rendNet:      number
  cfMensuel:    number
  tri:          number
  prixSortie:   number
  gainTotal:    number
  projection:   { annee: number; valeur: number; cfCumul: number }[]
}

// ─── Promoteur ────────────────────────────────────────────────────────────────

export interface PromoteurInputs {
  surfTerrain:  number
  cos:          number
  ratioVend:    number
  prixVente:    number
  coutTerrain:  number
  coutConst:    number
  tauxFrais:    number
  tauxCommerc:  number
  tauxPortage:  number
}

export interface PromoteurResult {
  surfTotale:   number
  surfVendable: number
  ca:           number
  coutConst:    number
  frais:        number
  commerc:      number
  portage:      number
  coutTotal:    number
  margeBrute:   number
  margePct:     number
  margeSurCout: number
  prixRevientM2:number
  sensitivity:  { variation: number; ca: number; marge: number; pct: number }[]
}
