export const fmt = (n: number): string =>
  Math.round(n).toLocaleString('fr-FR')

export const fmtM = (n: number): string =>
  n >= 1_000_000
    ? (n / 1_000_000).toFixed(2) + 'M₪'
    : fmt(n) + '₪'

export const fmtPct = (n: number, decimals = 2): string =>
  n.toFixed(decimals) + '%'

export const fmtM2 = (n: number): string =>
  fmt(n) + ' m²'
