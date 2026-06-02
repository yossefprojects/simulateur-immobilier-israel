export function genererURL(inputs: Record<string, unknown>): string {
  const params = new URLSearchParams()
  Object.entries(inputs).forEach(([k, v]) => {
    if (v !== null && typeof v === 'object') {
      Object.entries(v as Record<string, unknown>).forEach(([k2, v2]) => {
        if (v2) params.append(k2, '1')
      })
    } else {
      params.set(k, String(v))
    }
  })
  return `${window.location.origin}${window.location.pathname}#${params.toString()}`
}

export function lireURL(): Record<string, string> | null {
  const hash = window.location.hash.slice(1)
  if (!hash) return null
  return Object.fromEntries(new URLSearchParams(hash))
}

export async function copierLien(inputs: Record<string, unknown>): Promise<void> {
  const url = genererURL(inputs)
  await navigator.clipboard.writeText(url)
}
