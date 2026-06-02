const KEY = 'immo_israel_scenarios'

export interface Scenario {
  id: number
  nom: string
  date: string
  ville?: string
  prixEstime?: number
  data: unknown
}

export function sauvegarderScenario(nom: string, data: unknown): Scenario {
  const scenarios = lireScenarios()
  const d = data as Record<string, unknown>
  const nouveau: Scenario = {
    id: Date.now(),
    nom,
    date: new Date().toLocaleDateString('fr-FR'),
    ville: (d?.ville as string) ?? undefined,
    prixEstime: (d?.prixEstime as number) ?? undefined,
    data,
  }
  scenarios.unshift(nouveau)
  localStorage.setItem(KEY, JSON.stringify(scenarios.slice(0, 10)))
  return nouveau
}

export function lireScenarios(): Scenario[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
  catch { return [] }
}

export function supprimerScenario(id: number): void {
  const scenarios = lireScenarios().filter(s => s.id !== id)
  localStorage.setItem(KEY, JSON.stringify(scenarios))
}
