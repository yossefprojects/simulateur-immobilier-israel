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
