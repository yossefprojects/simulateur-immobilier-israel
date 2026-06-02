import { useMemo, useState } from 'react'
import type { InvestInputs } from '../types'
import { calcInvestisseur } from '../utils/calculators'

export function useInvestisseur() {
  const [inputs, setInputs] = useState<InvestInputs>({
    prix:    2_000_000,
    apport:  40,
    taux:    5.2,
    duree:   20,
    loyer:   7_500,
    vacance: 5,
    charges: 12_000,
    reval:   3.5,
    horizon: 10,
  })

  const result = useMemo(() => calcInvestisseur(inputs), [inputs])

  const set = <K extends keyof InvestInputs>(key: K, value: InvestInputs[K]) =>
    setInputs(prev => ({ ...prev, [key]: value }))

  return { inputs, result, set }
}
