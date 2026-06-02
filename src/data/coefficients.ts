export const TYPES_PROJET: { label: string; value: number }[] = [
  { label: 'Résidentiel classique',        value: 1.00 },
  { label: 'Résidentiel luxe',             value: 1.30 },
  { label: 'Programme neuf',               value: 1.10 },
  { label: 'TAMA 38',                      value: 0.95 },
  { label: 'Pinouï Binouï',               value: 1.05 },
  { label: 'Mixte commerces + logements',  value: 1.15 },
]

export const coefSurface = (m2: number): number => {
  if (m2 < 50)  return 1.22
  if (m2 < 70)  return 1.12
  if (m2 < 100) return 1.04
  if (m2 < 140) return 0.94
  return 0.87
}

export const coefMer = (km: number): number => {
  if (km <= 0.2) return 1.35
  if (km <= 0.5) return 1.20
  if (km <= 1.5) return 1.10
  if (km <= 5)   return 1.02
  if (km <= 10)  return 0.96
  return 0.90
}

export const coefTransport = (km: number): number => {
  if (km <= 0.3) return 1.08
  if (km <= 1)   return 1.04
  if (km <= 3)   return 1.00
  if (km <= 8)   return 0.97
  return 0.93
}

export const coefEtage = (etage: number): number => {
  if (etage === 0) return 0.90
  if (etage <= 2)  return 0.97
  if (etage <= 8)  return 1.02
  if (etage <= 15) return 1.06
  return 1.12
}

export interface EquipementDef {
  key:   string
  label: string
  bonus: number
}

export const EQUIPEMENTS: EquipementDef[] = [
  { key: 'ascenseur', label: 'Ascenseur',        bonus: 0.05 },
  { key: 'parking',   label: 'Parking',          bonus: 0.10 },
  { key: 'mamad',     label: 'Mamad',            bonus: 0.06 },
  { key: 'terrasse',  label: 'Terrasse',         bonus: 0.07 },
  { key: 'vueMer',    label: 'Vue mer',          bonus: 0.20 },
  { key: 'vueDeg',    label: 'Vue dégagée',      bonus: 0.06 },
  { key: 'gardien',   label: 'Gardiennage',      bonus: 0.03 },
  { key: 'piscine',   label: 'Piscine commune',  bonus: 0.04 },
  { key: 'gym',       label: 'Salle de sport',   bonus: 0.03 },
]

// ─── TYPE DE BIEN (précis) ────────────────────────────────────────────────────
// Basé sur les écarts observés sur Nadlan Gov et Yad2 par catégorie

export interface TypeBienDef { value: string; label: string; coef: number }

export const TYPES_BIEN: TypeBienDef[] = [
  { value: 'dira',       label: 'Appartement (דירה)',           coef: 1.00 },
  { value: 'dirat_gan',  label: 'Appartement jardin (דירת גן)', coef: 0.92 },
  { value: 'penthouse',  label: 'Penthouse (פנטהאוז)',          coef: 1.32 },
  { value: 'cottage',    label: 'Maison / Villa (קוטג׳)',        coef: 1.20 },
  { value: 'studio',     label: 'Studio',                        coef: 1.10 },
]

// ─── ÉTAT DU BIEN (5 niveaux) ────────────────────────────────────────────────
// Écarts validés par les statistiques Nadlan Gov

export interface EtatBienDef { value: string; label: string; coef: number }

export const ETATS_BIEN: EtatBienDef[] = [
  { value: 'neuf_promoteur', label: 'Neuf promoteur', coef: 1.16 },
  { value: 'comme_neuf',     label: 'Comme neuf',     coef: 1.08 },
  { value: 'renove',         label: 'Rénové',         coef: 1.03 },
  { value: 'correct',        label: 'État correct',   coef: 1.00 },
  { value: 'a_renover',      label: 'À rénover',      coef: 0.87 },
]

// ─── NOMBRE DE PIÈCES ────────────────────────────────────────────────────────
// 3 pièces = référence (norme israélienne). Source : analyse Nadlan par taille.

export const coefPieces = (nb: number): number => {
  if (nb <= 1)  return 1.14
  if (nb <= 1.5) return 1.10
  if (nb <= 2)  return 1.07
  if (nb <= 3)  return 1.00
  if (nb <= 4)  return 0.97
  if (nb <= 5)  return 0.94
  return 0.90
}

// ─── BALCON (מרפסת) ──────────────────────────────────────────────────────────
// Impact moyen mesuré sur annonces Yad2 : +4–7% selon nombre de balcons

export const coefBalcon = (nb: number): number => {
  if (nb === 0) return 1.00
  if (nb === 1) return 1.04
  if (nb === 2) return 1.07
  return 1.09
}

// ─── PARKING ─────────────────────────────────────────────────────────────────
// 1 parking = 80 000–150 000 ₪ dans les grandes villes. Modélisé en % du prix.

export const coefParking = (nb: number): number => {
  if (nb === 0) return 1.00
  if (nb === 1) return 1.06
  return 1.10
}

// ─── ANNÉE DE CONSTRUCTION ───────────────────────────────────────────────────
// Biens récents : prime. Très anciens : décote (sauf potentiel TAMA 38).

export const coefAnneeConstruction = (annee: number): number => {
  const age = new Date().getFullYear() - annee
  if (age <= 3)  return 1.10
  if (age <= 10) return 1.04
  if (age <= 25) return 1.00
  if (age <= 40) return 0.96
  if (age <= 55) return 0.92
  return 0.87
}
