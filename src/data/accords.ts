import type { AccordKey, PermisKey, PlanKey } from '../types'

export interface AccordDef {
  label: string
  coef:  number
  score: number
}

export const ACCORDS_MUNICIPAUX: Record<AccordKey, AccordDef> = {
  none:         { label: 'Aucun projet / zone ordinaire',    coef: 1.00, score: 0  },
  tama38_etude: { label: 'TAMA 38 — en étude',              coef: 1.05, score: 15 },
  tama38_ok:    { label: 'TAMA 38 — approuvé',              coef: 1.15, score: 35 },
  pb_etude:     { label: 'Pinouï-Binouï — en étude',        coef: 1.10, score: 25 },
  pb_ok:        { label: 'Pinouï-Binouï — approuvé',        coef: 1.30, score: 55 },
  pc_ok:        { label: 'Permis de construire obtenu',      coef: 1.40, score: 70 },
  chantier:     { label: 'Chantier démarré',                 coef: 1.50, score: 85 },
}

export const STATUTS_PLAN: Record<PlanKey, AccordDef> = {
  approved:  { label: 'Plan approuvé (Taba validée)',       coef: 1.00, score: 30 },
  pending:   { label: "Plan en cours d'approbation",        coef: 0.97, score: 20 },
  study:     { label: 'En étude / avant-projet',            coef: 0.94, score: 10 },
  protected: { label: 'Zone protégée / patrimoine',         coef: 0.85, score: 0  },
  renewal:   { label: 'Zone de renouvellement urbain',      coef: 1.05, score: 25 },
  priority:  { label: 'Secteur prioritaire municipal',      coef: 1.03, score: 22 },
}

export const STATUTS_PERMIS: Record<PermisKey, AccordDef> = {
  none:       { label: 'Aucun permis déposé',               coef: 1.00, score: 0   },
  depose:     { label: "Permis déposé (en instruction)",    coef: 1.05, score: 10  },
  accorde:    { label: 'Permis accordé',                    coef: 1.15, score: 25  },
  opposition: { label: 'Opposition en cours',               coef: 0.93, score: -10 },
}

export const SOURCES_EXTERNES = [
  {
    label:   'Mavat — Plans urbanistiques',
    labelEn: 'Mavat — Urban planning',
    labelHe: 'Mavat — תוכניות עירוניות',
    url: 'https://mavat.iplan.gov.il',
  },
  {
    label:   'GovMap — Cadastre et zonage',
    labelEn: 'GovMap — Cadastre & zoning',
    labelHe: 'GovMap — קדסטר וייעוד קרקע',
    url: 'https://www.govmap.gov.il',
  },
  {
    label:   'Nadlan Gov — Transactions officielles',
    labelEn: 'Nadlan Gov — Official transactions',
    labelHe: 'Nadlan Gov — עסקאות רשמיות',
    url: 'https://www.nadlan.gov.il',
  },
  {
    label:   'Israel Land Authority (ILA)',
    labelEn: 'Israel Land Authority (ILA)',
    labelHe: 'רשות מקרקעי ישראל (רמ"י)',
    url: 'https://www.gov.il/en/departments/israel_land_authority',
  },
  {
    label:   'CBS Israël — Statistiques',
    labelEn: 'CBS Israel — Statistics',
    labelHe: 'הלשכה המרכזית לסטטיסטיקה (למ"ס)',
    url: 'https://www.cbs.gov.il',
  },
  {
    label:   "Banque d'Israël — Taux et rapports",
    labelEn: 'Bank of Israel — Rates & reports',
    labelHe: 'בנק ישראל — ריבית ודוחות',
    url: 'https://www.boi.org.il/en',
  },
]
