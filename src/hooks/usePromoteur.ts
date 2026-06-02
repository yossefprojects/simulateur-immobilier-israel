import { useMemo, useState } from 'react'
import type { PromoteurInputs } from '../types'
import { calcPromoteur } from '../utils/calculators'

export function usePromoteur() {
  const [inputs, setInputs] = useState<PromoteurInputs>({
    surfTerrain: 2_000,
    cos:         3,
    ratioVend:   75,
    prixVente:   25_000,
    coutTerrain: 8_000_000,
    coutConst:   8_500,
    tauxFrais:   10,
    tauxCommerc: 2.5,
    tauxPortage: 5,
  })

  const result = useMemo(() => calcPromoteur(inputs), [inputs])

  const set = <K extends keyof PromoteurInputs>(key: K, value: PromoteurInputs[K]) =>
    setInputs(prev => ({ ...prev, [key]: value }))

  return { inputs, result, set }
}
