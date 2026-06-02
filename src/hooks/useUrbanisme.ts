import { useMemo, useState } from 'react'
import type { AccordKey, PermisKey, PlanKey, UrbanismeInputs } from '../types'
import { calcUrbanisme } from '../utils/calculators'

export function useUrbanisme() {
  const [inputs, setInputs] = useState<UrbanismeInputs>({
    gush:        '',
    helka:       '',
    ville:       'tlv',
    surfTerrain: 800,
    surfExist:   400,
    planKey:     'approved' as PlanKey,
    etagesAut:   8,
    cos:         3,
    accordKey:   'none' as AccordKey,
    permisKey:   'none' as PermisKey,
    prixActuel:  25000,
  })

  const result = useMemo(() => calcUrbanisme(inputs), [inputs])

  const set = <K extends keyof UrbanismeInputs>(key: K, value: UrbanismeInputs[K]) =>
    setInputs(prev => ({ ...prev, [key]: value }))

  return { inputs, result, set }
}
