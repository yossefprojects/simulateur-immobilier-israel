import * as XLSX from 'xlsx'

interface ExcelData {
  estimation?: {
    ville?: string; quartier?: string; surface?: number
    prixTotal?: number; prixM2?: number
    waterfall?: { label: string; prixCumul: number }[]
  }
  urbanisme?: {
    score?: number; prixProj?: number; plusValue?: number
  }
  investisseur?: {
    rendBrut?: number; rendNet?: number; mensualite?: number
    tri?: number; cfMensuel?: number; prixSortie?: number; gainTotal?: number
    projection?: { annee: number; valeur: number; cfCumul: number }[]
  }
  promoteur?: {
    ca?: number; margeBrute?: number; margePct?: number
    coutConst?: number; frais?: number; commerc?: number; portage?: number
    coutTerrain?: number
    sensitivity?: { variation: number; ca: number; marge: number; pct: number }[]
  }
}

export function exporterExcel(data: ExcelData): void {
  const wb = XLSX.utils.book_new()
  const { estimation, investisseur, promoteur } = data

  if (estimation) {
    const estData: (string | number)[][] = [
      ['ESTIMATION DU BIEN', ''],
      ['Ville / Quartier', `${estimation.ville ?? ''} — ${estimation.quartier ?? ''}`],
      ['Surface', (estimation.surface ?? 0) + ' m²'],
      ['Prix estimé', estimation.prixTotal ?? 0],
      ['Prix au m²', estimation.prixM2 ?? 0],
      ['Fourchette basse', Math.round((estimation.prixTotal ?? 0) * 0.92)],
      ['Fourchette haute', Math.round((estimation.prixTotal ?? 0) * 1.08)],
      [],
      ['DÉCOMPOSITION DES COEFFICIENTS', ''],
      ...(estimation.waterfall ?? []).map(w => [w.label, w.prixCumul]),
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(estData), 'Estimation')
  }

  if (investisseur) {
    const inv = investisseur
    const invData: (string | number)[][] = [
      ['ANALYSE INVESTISSEUR', ''],
      ['Rendement brut', (inv.rendBrut ?? 0).toFixed(2) + '%'],
      ['Rendement net',  (inv.rendNet  ?? 0).toFixed(2) + '%'],
      ['Mensualité crédit', inv.mensualite ?? 0],
      ['TRI', (inv.tri ?? 0).toFixed(1) + '%'],
      ['Cash-flow mensuel', inv.cfMensuel ?? 0],
      ['Prix sortie', inv.prixSortie ?? 0],
      ['Gain total',  inv.gainTotal  ?? 0],
      [],
      ['PROJECTION', 'Valeur', 'CF cumulé'],
      ...(inv.projection ?? []).map(p => [`+${p.annee} ans`, p.valeur, p.cfCumul]),
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(invData), 'Investisseur')
  }

  if (promoteur) {
    const pro = promoteur
    const proData: (string | number)[][] = [
      ['BILAN PROMOTEUR', ''],
      ['CA prévisionnel',  pro.ca ?? 0],
      ['Terrain',         -(pro.coutTerrain ?? 0)],
      ['Construction',    -(pro.coutConst ?? 0)],
      ['Honoraires',      -(pro.frais ?? 0)],
      ['Commercialisation', -(pro.commerc ?? 0)],
      ['Portage',         -(pro.portage ?? 0)],
      ['MARGE BRUTE',     pro.margeBrute ?? 0],
      ['Taux de marge',   (pro.margePct ?? 0).toFixed(1) + '%'],
      [],
      ['SENSIBILITÉ', 'CA', 'Marge', 'Taux'],
      ...(pro.sensitivity ?? []).map(s => [
        (s.variation >= 0 ? '+' : '') + s.variation + '%',
        s.ca, s.marge, s.pct.toFixed(1) + '%',
      ]),
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(proData), 'Promoteur')
  }

  XLSX.writeFile(wb, 'simulation-immobilier-israel.xlsx')
}
