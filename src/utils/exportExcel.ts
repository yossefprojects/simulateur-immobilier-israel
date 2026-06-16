import ExcelJS from 'exceljs'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExcelData {
  estimation?: {
    ville?:      string
    quartier?:   string
    surface?:    number
    prixBase?:   number
    coefTotal?:  number
    waterfall?:  { label: string; coef: number; prixCumul: number }[]
  }
  investisseur?: {
    prix:    number
    apport:  number
    taux:    number
    duree:   number
    loyer:   number
    vacance: number
    charges: number
    reval:   number
    horizon: number
  }
  promoteur?: {
    surfTerrain: number
    cos:         number
    ratioVend:   number
    prixVente:   number
    coutTerrain: number
    coutConst:   number
    tauxFrais:   number
    tauxCommerc: number
    tauxPortage: number
  }
}

// ─── Format constants ─────────────────────────────────────────────────────────

const NIS   = '#,##0'
const PCT2  = '0.00'
const PCT1  = '0.0'
const COEF  = '0.000'
const M2    = '#,##0'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setFormula(
  ws: ExcelJS.Worksheet,
  addr: string,
  formula: string,
  numFmt?: string,
) {
  const cell = ws.getCell(addr)
  cell.value = { formula }
  if (numFmt) cell.numFmt = numFmt
}

function setFmt(ws: ExcelJS.Worksheet, addr: string, numFmt: string) {
  ws.getCell(addr).numFmt = numFmt
}

// ─── Sheet 1 : Estimation ─────────────────────────────────────────────────────

function makeEstimationSheet(
  wb: ExcelJS.Workbook,
  est: NonNullable<ExcelData['estimation']>,
) {
  const ws = wb.addWorksheet('Estimation')
  const wf       = est.waterfall ?? []
  const surface  = est.surface  ?? 0
  const prixBase = est.prixBase ?? (wf[0]?.prixCumul ?? 0)
  const coef     = est.coefTotal ?? 1

  const rows: unknown[][] = [
    ['NADLANCONNECT SIMULATOR — ESTIMATION DU BIEN'],
    [],
    ['LOCALISATION', ''],
    ['Ville',    est.ville    ?? '—'],
    ['Quartier', est.quartier ?? '—'],
    [],
    ["PARAMÈTRES D'ENTRÉE  (modifiables dans Excel)", ''],
    ['Surface (m²)',                      surface],
    ['Prix de base quartier (₪/m²)',      prixBase],
    ['Coefficient total appliqué',        coef],
    [],
    ['RÉSULTATS — FORMULES AUTOMATIQUES', ''],
    ['Prix/m² estimé (₪)',        0],
    ['Prix total estimé (₪)',     0],
    ['Fourchette basse −8% (₪)',  0],
    ['Fourchette haute +8% (₪)',  0],
    [],
    ['DÉCOMPOSITION DES COEFFICIENTS', '', ''],
    ['Étape', 'Coefficient', 'Prix cumulé (₪/m²)'],
    ...wf.map(w => [w.label, w.coef, w.prixCumul]),
  ]

  rows.forEach(r => ws.addRow(r as ExcelJS.CellValue[]))

  setFormula(ws, 'B13', 'ROUND(B9*B10,0)', NIS)
  setFormula(ws, 'B14', 'B13*B8',          NIS)
  setFormula(ws, 'B15', 'ROUND(B14*0.92,0)', NIS)
  setFormula(ws, 'B16', 'ROUND(B14*1.08,0)', NIS)

  setFmt(ws, 'B8',  M2)
  setFmt(ws, 'B9',  NIS)
  setFmt(ws, 'B10', COEF)

  wf.forEach((_, i) => {
    const r = 20 + i
    setFmt(ws, `B${r}`, COEF)
    setFmt(ws, `C${r}`, NIS)
  })

  ws.getColumn(1).width = 40
  ws.getColumn(2).width = 20
  ws.getColumn(3).width = 20

  ws.mergeCells('A1:C1')
  ws.mergeCells('A3:C3')
  ws.mergeCells('A7:C7')
  ws.mergeCells('A12:C12')
  ws.mergeCells('A18:C18')
}

// ─── Sheet 2 : Investisseur ───────────────────────────────────────────────────

function makeInvestisseurSheet(
  wb: ExcelJS.Workbook,
  inv: NonNullable<ExcelData['investisseur']>,
) {
  const ws = wb.addWorksheet('Investisseur')
  const { prix, apport, taux, duree, loyer, vacance, charges, reval, horizon } = inv

  const projRows: unknown[][] = []
  for (let i = 0; i < horizon; i++) {
    projRows.push([i + 1, 0, 0])
  }

  const rows: unknown[][] = [
    ['ANALYSE INVESTISSEUR — SIMULATEUR ISRAËL'],
    [],
    ["PARAMÈTRES D'ENTRÉE  (modifiables dans Excel)", ''],
    ["Prix d'achat (₪)",                      prix],
    ['Apport personnel (%)',                   apport],
    ['Taux hypothécaire annuel (%)',           taux],
    ['Durée du prêt (ans)',                    duree],
    ['Loyer mensuel (₪)',                      loyer],
    ['Taux de vacance (%)',                    vacance],
    ['Charges annuelles (₪)',                  charges],
    ['Revalorisation annuelle (%)',            reval],
    ["Horizon d'investissement (ans)",         horizon],
    [],
    ['RÉSULTATS — FORMULES AUTOMATIQUES', ''],
    ['Capital emprunté (₪)',                   0],
    ['Mensualité crédit (₪)',                  0],
    ['Loyer net mensuel (₪)',                  0],
    ['Cash-flow mensuel (₪)',                  0],
    ['Rendement brut (%)',                     0],
    ['Rendement net (%)',                      0],
    ['Prix de sortie estimé (₪)',              0],
    ['Gain total (₪)',                         0],
    ['TRI approx. (%)',                        0],
    [],
    ['PROJECTION PLURIANNUELLE', '', ''],
    ['Année', 'Valeur du bien (₪)', 'CF cumulé (₪)'],
    ...projRows,
  ]

  rows.forEach(r => ws.addRow(r as ExcelJS.CellValue[]))

  setFmt(ws, 'B4',  NIS)
  setFmt(ws, 'B5',  PCT1)
  setFmt(ws, 'B6',  PCT2)
  setFmt(ws, 'B7',  '0')
  setFmt(ws, 'B8',  NIS)
  setFmt(ws, 'B9',  PCT1)
  setFmt(ws, 'B10', NIS)
  setFmt(ws, 'B11', PCT2)
  setFmt(ws, 'B12', '0')

  setFormula(ws, 'B15', 'ROUND(B4*(1-B5/100),0)',                               NIS)
  setFormula(ws, 'B16', 'ROUND(PMT(B6/100/12,B7*12,-B15),0)',                   NIS)
  setFormula(ws, 'B17', 'ROUND(B8*(1-B9/100)-B10/12,0)',                        NIS)
  setFormula(ws, 'B18', 'B17-B16',                                               NIS)
  setFormula(ws, 'B19', 'ROUND(B8*12/B4*100,2)',                                 PCT2)
  setFormula(ws, 'B20', 'ROUND((B8*12*(1-B9/100)-B10)/B4*100,2)',               PCT2)
  setFormula(ws, 'B21', 'ROUND(B4*(1+B11/100)^B12,0)',                          NIS)
  setFormula(ws, 'B22', 'ROUND(B18*12*B12+(B21-B4),0)',                         NIS)
  setFormula(ws, 'B23', 'ROUND(((1+B22/(B4*B5/100))^(1/B12)-1)*100,2)',        PCT2)

  for (let i = 0; i < horizon; i++) {
    const r = 27 + i
    setFmt(ws, `A${r}`, '0')
    setFormula(ws, `B${r}`, `ROUND($B$4*(1+$B$11/100)^A${r},0)`, NIS)
    setFormula(ws, `C${r}`, `ROUND($B$18*12*A${r},0)`,            NIS)
  }

  ws.getColumn(1).width = 40
  ws.getColumn(2).width = 22
  ws.getColumn(3).width = 22

  ws.mergeCells('A1:C1')
  ws.mergeCells('A3:C3')
  ws.mergeCells('A14:C14')
  ws.mergeCells('A25:C25')
}

// ─── Sheet 3 : Promoteur ──────────────────────────────────────────────────────

function makePromoteurSheet(
  wb: ExcelJS.Workbook,
  pro: NonNullable<ExcelData['promoteur']>,
) {
  const ws = wb.addWorksheet('Promoteur')
  const { surfTerrain, cos, ratioVend, prixVente,
          coutTerrain, coutConst, tauxFrais, tauxCommerc, tauxPortage } = pro

  const VARIATIONS = [-15, -10, -5, 0, 5, 10, 15]

  const rows: unknown[][] = [
    ['BILAN PROMOTEUR — SIMULATEUR ISRAËL'],
    [],
    ["PARAMÈTRES D'ENTRÉE  (modifiables dans Excel)", ''],
    ['Surface du terrain (m²)',                   surfTerrain],
    ["COS (coefficient d'occupation des sols)",   cos],
    ['Ratio surface vendable (%)',                 ratioVend],
    ['Prix de vente moyen (₪/m²)',                prixVente],
    ['Coût du terrain (₪)',                        coutTerrain],
    ['Coût de construction (₪/m²)',               coutConst],
    ['Taux honoraires & consultants (%)',          tauxFrais],
    ['Taux commercialisation & ventes (%)',        tauxCommerc],
    ['Taux portage financier (%)',                 tauxPortage],
    [],
    ['RÉSULTATS — FORMULES AUTOMATIQUES', ''],
    ['Surface totale constructible (m²)',          0],
    ['Surface vendable (m²)',                      0],
    ['CA prévisionnel (₪)',                        0],
    ['Coût construction total (₪)',                0],
    ['Honoraires (₪)',                             0],
    ['Commercialisation (₪)',                      0],
    ['Portage financier (₪)',                      0],
    ['Coût total projet (₪)',                      0],
    ['MARGE BRUTE (₪)',                            0],
    ['Taux de marge / CA (%)',                     0],
    ['Marge / coût total (%)',                     0],
    ['Prix de revient / m² vendable (₪/m²)',      0],
    [],
    ['SENSIBILITÉ AU PRIX DE VENTE', '', '', ''],
    ['Variation (%)', 'CA (₪)', 'Marge brute (₪)', 'Taux marge (%)'],
    ...VARIATIONS.map(v => [v, 0, 0, 0]),
  ]

  rows.forEach(r => ws.addRow(r as ExcelJS.CellValue[]))

  setFmt(ws, 'B4',  M2)
  setFmt(ws, 'B5',  COEF)
  setFmt(ws, 'B6',  PCT1)
  setFmt(ws, 'B7',  NIS)
  setFmt(ws, 'B8',  NIS)
  setFmt(ws, 'B9',  NIS)
  setFmt(ws, 'B10', PCT1)
  setFmt(ws, 'B11', PCT1)
  setFmt(ws, 'B12', PCT1)

  setFormula(ws, 'B15', 'ROUND(B4*B5,0)',                               M2)
  setFormula(ws, 'B16', 'ROUND(B15*B6/100,0)',                          M2)
  setFormula(ws, 'B17', 'ROUND(B16*B7,0)',                              NIS)
  setFormula(ws, 'B18', 'ROUND(B15*B9,0)',                              NIS)
  setFormula(ws, 'B19', 'ROUND(B18*B10/100,0)',                         NIS)
  setFormula(ws, 'B20', 'ROUND(B17*B11/100,0)',                         NIS)
  setFormula(ws, 'B21', 'ROUND((B8+B18)*B12/100,0)',                    NIS)
  setFormula(ws, 'B22', 'ROUND(B8+B18+B19+B20+B21,0)',                  NIS)
  setFormula(ws, 'B23', 'ROUND(B17-B22,0)',                             NIS)
  setFormula(ws, 'B24', 'ROUND(IF(B17>0,B23/B17*100,0),1)',             PCT1)
  setFormula(ws, 'B25', 'ROUND(IF(B22>0,B23/B22*100,0),1)',             PCT1)
  setFormula(ws, 'B26', 'ROUND(IF(B16>0,B22/B16,0),0)',                 NIS)

  VARIATIONS.forEach((_, i) => {
    const r = 30 + i
    setFmt(ws, `A${r}`, PCT1)
    setFormula(ws, `B${r}`, `ROUND((1+A${r}/100)*$B$17,0)`,             NIS)
    setFormula(ws, `C${r}`, `ROUND(B${r}-$B$22,0)`,                     NIS)
    setFormula(ws, `D${r}`, `ROUND(IF(B${r}>0,C${r}/B${r}*100,0),1)`,  PCT1)
  })

  ws.getColumn(1).width = 42
  ws.getColumn(2).width = 20
  ws.getColumn(3).width = 20
  ws.getColumn(4).width = 18

  ws.mergeCells('A1:D1')
  ws.mergeCells('A3:D3')
  ws.mergeCells('A14:D14')
  ws.mergeCells('A28:D28')
}

// ─── Main export function ─────────────────────────────────────────────────────

export async function exporterExcel(data: ExcelData): Promise<void> {
  const wb = new ExcelJS.Workbook()

  if (data.estimation)   makeEstimationSheet(wb, data.estimation)
  if (data.investisseur) makeInvestisseurSheet(wb, data.investisseur)
  if (data.promoteur)    makePromoteurSheet(wb, data.promoteur)

  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'simulation-immobilier-israel.xlsx'
  a.click()
  URL.revokeObjectURL(url)
}
