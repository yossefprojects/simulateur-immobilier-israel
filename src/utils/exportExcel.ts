import * as XLSX from 'xlsx'

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

type CellObj = { t: string; f: string; z?: string }

function f(formula: string, z?: string): CellObj {
  return z ? { t: 'n', f: formula, z } : { t: 'n', f: formula }
}

const NIS   = '#,##0'       // thousands separator, no decimals
const PCT2  = '0.00'        // 2 decimal percentages
const PCT1  = '0.0'         // 1 decimal percentages
const COEF  = '0.000'       // coefficient like 1.068
const M2    = '#,##0'       // m² / price per m²

function applyFmt(ws: XLSX.WorkSheet, addr: string, z: string) {
  if (ws[addr]) ws[addr].z = z
}

// ─── Sheet 1 : Estimation ─────────────────────────────────────────────────────
//
// Inputs (editable by user in Excel):
//   B8  = Surface (m²)
//   B9  = Prix de base quartier (₪/m²)
//   B10 = Coefficient total
//
// Formulas:
//   B13 = Prix/m²   = ROUND(B9*B10, 0)
//   B14 = Prix total = B13*B8
//   B15 = Fourchette basse −8%  = ROUND(B14*0.92, 0)
//   B16 = Fourchette haute +8%  = ROUND(B14*1.08, 0)

function makeEstimationSheet(est: NonNullable<ExcelData['estimation']>): XLSX.WorkSheet {
  const wf       = est.waterfall ?? []
  const surface  = est.surface  ?? 0
  const prixBase = est.prixBase ?? (wf[0]?.prixCumul ?? 0)
  const coef     = est.coefTotal ?? 1

  const rows: unknown[][] = [
    ['SIMULATEUR IMMOBILIER ISRAËL — ESTIMATION DU BIEN'],          // R1
    [],                                                              // R2
    ['LOCALISATION', ''],                                            // R3
    ['Ville',    est.ville    ?? '—'],                              // R4
    ['Quartier', est.quartier ?? '—'],                              // R5
    [],                                                              // R6
    ['PARAMÈTRES D\'ENTRÉE  (modifiables dans Excel)', ''],         // R7
    ['Surface (m²)',                      surface],                 // R8  → B8
    ['Prix de base quartier (₪/m²)',      prixBase],                // R9  → B9
    ['Coefficient total appliqué',        coef],                    // R10 → B10
    [],                                                              // R11
    ['RÉSULTATS — FORMULES AUTOMATIQUES', ''],                      // R12
    ['Prix/m² estimé (₪)',        0],                               // R13 → B13
    ['Prix total estimé (₪)',     0],                               // R14 → B14
    ['Fourchette basse −8% (₪)',  0],                               // R15 → B15
    ['Fourchette haute +8% (₪)',  0],                               // R16 → B16
    [],                                                              // R17
    ['DÉCOMPOSITION DES COEFFICIENTS', '', ''],                     // R18
    ['Étape', 'Coefficient', 'Prix cumulé (₪/m²)'],                // R19
    ...wf.map(w => [w.label, w.coef, w.prixCumul]),
  ]

  const ws = XLSX.utils.aoa_to_sheet(rows)

  ws['B13'] = f('ROUND(B9*B10,0)', NIS)
  ws['B14'] = f('B13*B8',         NIS)
  ws['B15'] = f('ROUND(B14*0.92,0)', NIS)
  ws['B16'] = f('ROUND(B14*1.08,0)', NIS)

  applyFmt(ws, 'B8',  M2)
  applyFmt(ws, 'B9',  NIS)
  applyFmt(ws, 'B10', COEF)

  wf.forEach((_, i) => {
    const r = 20 + i
    applyFmt(ws, `B${r}`, COEF)
    applyFmt(ws, `C${r}`, NIS)
  })

  ws['!cols'] = [{ wch: 40 }, { wch: 20 }, { wch: 20 }]
  ws['!merges'] = [
    { s: { r:  0, c: 0 }, e: { r:  0, c: 2 } },
    { s: { r:  2, c: 0 }, e: { r:  2, c: 2 } },
    { s: { r:  6, c: 0 }, e: { r:  6, c: 2 } },
    { s: { r: 11, c: 0 }, e: { r: 11, c: 2 } },
    { s: { r: 17, c: 0 }, e: { r: 17, c: 2 } },
  ]
  return ws
}

// ─── Sheet 2 : Investisseur ───────────────────────────────────────────────────
//
// Inputs (rows 4–12):
//   B4  = Prix d'achat
//   B5  = Apport %
//   B6  = Taux hypothécaire annuel %
//   B7  = Durée (ans)
//   B8  = Loyer mensuel
//   B9  = Taux vacance %
//   B10 = Charges annuelles
//   B11 = Revalorisation annuelle %
//   B12 = Horizon (ans)
//
// Formulas (rows 15–23):
//   B15 = Capital emprunté     = ROUND(B4*(1-B5/100), 0)
//   B16 = Mensualité crédit    = ROUND(PMT(B6/100/12, B7*12, -B15), 0)
//   B17 = Loyer net mensuel    = ROUND(B8*(1-B9/100)-B10/12, 0)
//   B18 = Cash-flow mensuel    = B17-B16
//   B19 = Rendement brut %     = ROUND(B8*12/B4*100, 2)
//   B20 = Rendement net %      = ROUND((B8*12*(1-B9/100)-B10)/B4*100, 2)
//   B21 = Prix sortie           = ROUND(B4*(1+B11/100)^B12, 0)
//   B22 = Gain total            = ROUND(B18*12*B12+(B21-B4), 0)
//   B23 = TRI approx %          = ROUND(((1+B22/(B4*B5/100))^(1/B12)-1)*100, 2)
//
// Projection table starts at row 27:
//   A27 = 1, B27 = ROUND($B$4*(1+$B$11/100)^A27,0), C27 = ROUND($B$18*12*A27,0)
//   …

function makeInvestisseurSheet(inv: NonNullable<ExcelData['investisseur']>): XLSX.WorkSheet {
  const { prix, apport, taux, duree, loyer, vacance, charges, reval, horizon } = inv

  const projRows: unknown[][] = []
  for (let i = 0; i < horizon; i++) {
    const r = 27 + i
    projRows.push([i + 1, 0, 0])
    // formula cells assigned after sheet creation, so we store row number
    void r
  }

  const rows: unknown[][] = [
    ['ANALYSE INVESTISSEUR — SIMULATEUR ISRAËL'],              // R1
    [],                                                         // R2
    ['PARAMÈTRES D\'ENTRÉE  (modifiables dans Excel)', ''],    // R3
    ['Prix d\'achat (₪)',                      prix],          // R4  → B4
    ['Apport personnel (%)',                   apport],        // R5  → B5
    ['Taux hypothécaire annuel (%)',           taux],          // R6  → B6
    ['Durée du prêt (ans)',                    duree],         // R7  → B7
    ['Loyer mensuel (₪)',                      loyer],         // R8  → B8
    ['Taux de vacance (%)',                    vacance],       // R9  → B9
    ['Charges annuelles (₪)',                  charges],       // R10 → B10
    ['Revalorisation annuelle (%)',            reval],         // R11 → B11
    ['Horizon d\'investissement (ans)',        horizon],       // R12 → B12
    [],                                                         // R13
    ['RÉSULTATS — FORMULES AUTOMATIQUES', ''],                 // R14
    ['Capital emprunté (₪)',                   0],             // R15
    ['Mensualité crédit (₪)',                  0],             // R16
    ['Loyer net mensuel (₪)',                  0],             // R17
    ['Cash-flow mensuel (₪)',                  0],             // R18
    ['Rendement brut (%)',                     0],             // R19
    ['Rendement net (%)',                      0],             // R20
    ['Prix de sortie estimé (₪)',              0],             // R21
    ['Gain total (₪)',                         0],             // R22
    ['TRI approx. (%)',                        0],             // R23
    [],                                                         // R24
    ['PROJECTION PLURIANNUELLE', '', ''],                      // R25
    ['Année', 'Valeur du bien (₪)', 'CF cumulé (₪)'],         // R26
    ...projRows,
  ]

  const ws = XLSX.utils.aoa_to_sheet(rows)

  // Inputs
  applyFmt(ws, 'B4',  NIS)
  applyFmt(ws, 'B5',  PCT1)
  applyFmt(ws, 'B6',  PCT2)
  applyFmt(ws, 'B7',  '0')
  applyFmt(ws, 'B8',  NIS)
  applyFmt(ws, 'B9',  PCT1)
  applyFmt(ws, 'B10', NIS)
  applyFmt(ws, 'B11', PCT2)
  applyFmt(ws, 'B12', '0')

  // Results — formulas
  ws['B15'] = f('ROUND(B4*(1-B5/100),0)',                                NIS)
  ws['B16'] = f('ROUND(PMT(B6/100/12,B7*12,-B15),0)',                   NIS)
  ws['B17'] = f('ROUND(B8*(1-B9/100)-B10/12,0)',                        NIS)
  ws['B18'] = f('B17-B16',                                               NIS)
  ws['B19'] = f('ROUND(B8*12/B4*100,2)',                                 PCT2)
  ws['B20'] = f('ROUND((B8*12*(1-B9/100)-B10)/B4*100,2)',               PCT2)
  ws['B21'] = f('ROUND(B4*(1+B11/100)^B12,0)',                          NIS)
  ws['B22'] = f('ROUND(B18*12*B12+(B21-B4),0)',                         NIS)
  ws['B23'] = f('ROUND(((1+B22/(B4*B5/100))^(1/B12)-1)*100,2)',        PCT2)

  // Projection rows
  for (let i = 0; i < horizon; i++) {
    const r = 27 + i
    applyFmt(ws, `A${r}`, '0')
    ws[`B${r}`] = f(`ROUND($B$4*(1+$B$11/100)^A${r},0)`, NIS)
    ws[`C${r}`] = f(`ROUND($B$18*12*A${r},0)`,            NIS)
  }

  ws['!cols'] = [{ wch: 40 }, { wch: 22 }, { wch: 22 }]
  ws['!merges'] = [
    { s: { r:  0, c: 0 }, e: { r:  0, c: 2 } },
    { s: { r:  2, c: 0 }, e: { r:  2, c: 2 } },
    { s: { r: 13, c: 0 }, e: { r: 13, c: 2 } },
    { s: { r: 24, c: 0 }, e: { r: 24, c: 2 } },
  ]
  return ws
}

// ─── Sheet 3 : Promoteur ──────────────────────────────────────────────────────
//
// Inputs (rows 4–12):
//   B4  = Surface terrain (m²)
//   B5  = COS
//   B6  = Ratio vendable %
//   B7  = Prix vente moyen (₪/m²)
//   B8  = Coût terrain (₪)
//   B9  = Coût construction (₪/m²)
//   B10 = Taux honoraires %
//   B11 = Taux commercialisation %
//   B12 = Taux portage %
//
// Formulas (rows 15–26):
//   B15 = Surf. totale   = ROUND(B4*B5, 0)
//   B16 = Surf. vendable = ROUND(B15*B6/100, 0)
//   B17 = CA              = ROUND(B16*B7, 0)
//   B18 = Coût constr.   = ROUND(B15*B9, 0)
//   B19 = Honoraires      = ROUND(B18*B10/100, 0)
//   B20 = Commerc.        = ROUND(B17*B11/100, 0)
//   B21 = Portage         = ROUND((B8+B18)*B12/100, 0)
//   B22 = Coût total      = ROUND(B8+B18+B19+B20+B21, 0)
//   B23 = Marge brute     = ROUND(B17-B22, 0)
//   B24 = Taux marge/CA % = ROUND(IF(B17>0,B23/B17*100,0), 1)
//   B25 = Marge/coût %    = ROUND(IF(B22>0,B23/B22*100,0), 1)
//   B26 = Prix rev./m²    = ROUND(IF(B16>0,B22/B16,0), 0)
//
// Sensitivity table (rows 30–36) — variations ±15% in A, all referencing B17/B22:
//   A30 = -15  B30 = ROUND((1+A30/100)*$B$17,0)  C30 = ROUND(B30-$B$22,0)
//   D30 = ROUND(IF(B30>0,C30/B30*100,0),1)
//   …

function makePromoteurSheet(pro: NonNullable<ExcelData['promoteur']>): XLSX.WorkSheet {
  const { surfTerrain, cos, ratioVend, prixVente,
          coutTerrain, coutConst, tauxFrais, tauxCommerc, tauxPortage } = pro

  const VARIATIONS = [-15, -10, -5, 0, 5, 10, 15]

  const rows: unknown[][] = [
    ['BILAN PROMOTEUR — SIMULATEUR ISRAËL'],                          // R1
    [],                                                                // R2
    ['PARAMÈTRES D\'ENTRÉE  (modifiables dans Excel)', ''],           // R3
    ['Surface du terrain (m²)',                   surfTerrain],       // R4  → B4
    ['COS (coefficient d\'occupation des sols)',  cos],               // R5  → B5
    ['Ratio surface vendable (%)',                ratioVend],          // R6  → B6
    ['Prix de vente moyen (₪/m²)',               prixVente],          // R7  → B7
    ['Coût du terrain (₪)',                       coutTerrain],       // R8  → B8
    ['Coût de construction (₪/m²)',              coutConst],          // R9  → B9
    ['Taux honoraires & consultants (%)',         tauxFrais],         // R10 → B10
    ['Taux commercialisation & ventes (%)',       tauxCommerc],       // R11 → B11
    ['Taux portage financier (%)',                tauxPortage],       // R12 → B12
    [],                                                                // R13
    ['RÉSULTATS — FORMULES AUTOMATIQUES', ''],                        // R14
    ['Surface totale constructible (m²)',         0],                 // R15
    ['Surface vendable (m²)',                     0],                 // R16
    ['CA prévisionnel (₪)',                       0],                 // R17
    ['Coût construction total (₪)',               0],                 // R18
    ['Honoraires (₪)',                            0],                 // R19
    ['Commercialisation (₪)',                     0],                 // R20
    ['Portage financier (₪)',                     0],                 // R21
    ['Coût total projet (₪)',                     0],                 // R22
    ['MARGE BRUTE (₪)',                           0],                 // R23
    ['Taux de marge / CA (%)',                    0],                 // R24
    ['Marge / coût total (%)',                    0],                 // R25
    ['Prix de revient / m² vendable (₪/m²)',     0],                 // R26
    [],                                                                // R27
    ['SENSIBILITÉ AU PRIX DE VENTE', '', '', ''],                     // R28
    ['Variation (%)', 'CA (₪)', 'Marge brute (₪)', 'Taux marge (%)'],// R29
    ...VARIATIONS.map(v => [v, 0, 0, 0]),                            // R30–R36
  ]

  const ws = XLSX.utils.aoa_to_sheet(rows)

  // Inputs
  applyFmt(ws, 'B4',  M2)
  applyFmt(ws, 'B5',  COEF)
  applyFmt(ws, 'B6',  PCT1)
  applyFmt(ws, 'B7',  NIS)
  applyFmt(ws, 'B8',  NIS)
  applyFmt(ws, 'B9',  NIS)
  applyFmt(ws, 'B10', PCT1)
  applyFmt(ws, 'B11', PCT1)
  applyFmt(ws, 'B12', PCT1)

  // Results
  ws['B15'] = f('ROUND(B4*B5,0)',                               M2)
  ws['B16'] = f('ROUND(B15*B6/100,0)',                          M2)
  ws['B17'] = f('ROUND(B16*B7,0)',                              NIS)
  ws['B18'] = f('ROUND(B15*B9,0)',                              NIS)
  ws['B19'] = f('ROUND(B18*B10/100,0)',                         NIS)
  ws['B20'] = f('ROUND(B17*B11/100,0)',                         NIS)
  ws['B21'] = f('ROUND((B8+B18)*B12/100,0)',                    NIS)
  ws['B22'] = f('ROUND(B8+B18+B19+B20+B21,0)',                 NIS)
  ws['B23'] = f('ROUND(B17-B22,0)',                             NIS)
  ws['B24'] = f('ROUND(IF(B17>0,B23/B17*100,0),1)',            PCT1)
  ws['B25'] = f('ROUND(IF(B22>0,B23/B22*100,0),1)',            PCT1)
  ws['B26'] = f('ROUND(IF(B16>0,B22/B16,0),0)',                NIS)

  // Sensitivity (rows 30–36)
  VARIATIONS.forEach((_, i) => {
    const r = 30 + i
    applyFmt(ws, `A${r}`, PCT1)
    ws[`B${r}`] = f(`ROUND((1+A${r}/100)*$B$17,0)`,             NIS)
    ws[`C${r}`] = f(`ROUND(B${r}-$B$22,0)`,                     NIS)
    ws[`D${r}`] = f(`ROUND(IF(B${r}>0,C${r}/B${r}*100,0),1)`,  PCT1)
  })

  ws['!cols'] = [{ wch: 42 }, { wch: 20 }, { wch: 20 }, { wch: 18 }]
  ws['!merges'] = [
    { s: { r:  0, c: 0 }, e: { r:  0, c: 3 } },
    { s: { r:  2, c: 0 }, e: { r:  2, c: 3 } },
    { s: { r: 13, c: 0 }, e: { r: 13, c: 3 } },
    { s: { r: 27, c: 0 }, e: { r: 27, c: 3 } },
  ]
  return ws
}

// ─── Main export function ─────────────────────────────────────────────────────

export function exporterExcel(data: ExcelData): void {
  const wb = XLSX.utils.book_new()

  if (data.estimation) {
    XLSX.utils.book_append_sheet(wb, makeEstimationSheet(data.estimation), 'Estimation')
  }
  if (data.investisseur) {
    XLSX.utils.book_append_sheet(wb, makeInvestisseurSheet(data.investisseur), 'Investisseur')
  }
  if (data.promoteur) {
    XLSX.utils.book_append_sheet(wb, makePromoteurSheet(data.promoteur), 'Promoteur')
  }

  XLSX.writeFile(wb, 'simulation-immobilier-israel.xlsx')
}
