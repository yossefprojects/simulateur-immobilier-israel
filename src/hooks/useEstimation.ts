import { useMemo, useState } from 'react'
import { VILLES } from '../data/villes'
import type { Equipements, EstimationInputs } from '../types'
import { calcEstimation } from '../utils/calculators'

const DEFAULT_VILLE    = 'tlv'
const DEFAULT_QUARTIER = Object.keys(VILLES['tlv'].quartiers)[0]

const DEFAULT_EQ: Equipements = {
  ascenseur: false,
  parking:   true,
  mamad:     true,
  terrasse:  false,
  vueMer:    false,
  vueDeg:    false,
  gardien:   false,
  piscine:   false,
  gym:       false,
}

export function useEstimation() {
  const [inputs, setInputs] = useState<EstimationInputs>({
    ville:          DEFAULT_VILLE,
    quartier:       DEFAULT_QUARTIER,
    distanceMer:    3,
    distanceTransp: 5,
    typeProjet:     1.00,
    surface:        80,
    etage:          5,
    equipements:    DEFAULT_EQ,
  })

  const result = useMemo(() => calcEstimation(inputs), [inputs])

  const setVille = (ville: string) => {
    const firstQ = Object.keys(VILLES[ville]?.quartiers ?? {})[0] ?? ''
    setInputs(prev => ({ ...prev, ville, quartier: firstQ }))
  }

  const set = <K extends keyof EstimationInputs>(key: K, value: EstimationInputs[K]) =>
    setInputs(prev => ({ ...prev, [key]: value }))

  const toggleEquip = (key: keyof Equipements) =>
    setInputs(prev => ({
      ...prev,
      equipements: { ...prev.equipements, [key]: !prev.equipements[key] },
    }))

  return { inputs, result, set, setVille, toggleEquip }
}
