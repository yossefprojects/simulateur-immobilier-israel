import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { fmt, fmtM, fmtPct } from './formatters'
import type { ReportStore } from '../store/reportStore'
import { translations, type Translations } from '../i18n/translations'

const BLUE   = [24, 95, 165]   as [number, number, number]
const GREEN  = [15, 110, 86]   as [number, number, number]
const AMBER  = [186, 117, 23]  as [number, number, number]
const RED    = [153, 60, 29]   as [number, number, number]
const GRAY50 = [249, 250, 251] as [number, number, number]
const GRAY90 = [17, 24, 39]    as [number, number, number]
const GRAYMD = [107, 114, 128] as [number, number, number]
const WHITE  = [255, 255, 255] as [number, number, number]

const W = 210
const M = 14

type Accent = 'pos' | 'neg' | 'none'

function sectionHeader(doc: jsPDF, title: string, y: number): number {
  doc.setFillColor(...BLUE)
  doc.rect(M, y, W - M * 2, 7, 'F')
  doc.setTextColor(...WHITE)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text(title.toUpperCase(), M + 3, y + 5)
  doc.setTextColor(...GRAY90)
  return y + 10
}

function miniTable(
  doc: jsPDF,
  rows: [string, string, Accent][],
  startY: number,
): number {
  autoTable(doc, {
    startY,
    margin: { left: M, right: M },
    tableWidth: W - M * 2,
    head: [],
    body: rows.map(([l, v]) => [l, v]),
    styles: { fontSize: 8, cellPadding: 1.8 },
    columnStyles: {
      0: { textColor: GRAYMD, cellWidth: 105 },
      1: { halign: 'right', fontStyle: 'bold', cellWidth: W - M * 2 - 105 },
    },
    didParseCell(data) {
      if (data.column.index === 1 && data.section === 'body') {
        const accent = rows[data.row.index]?.[2]
        if (accent === 'pos') data.cell.styles.textColor = GREEN
        else if (accent === 'neg') data.cell.styles.textColor = RED
      }
    },
    theme: 'plain',
    alternateRowStyles: { fillColor: GRAY50 },
  })
  return (doc as any).lastAutoTable.finalY + 4
}

function highlightBox(
  doc: jsPDF,
  mainText: string,
  subText: string,
  color: [number, number, number],
  y: number,
): number {
  doc.setFillColor(...GRAY50)
  doc.roundedRect(M, y, W - M * 2, 14, 2, 2, 'F')
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...color)
  doc.text(mainText, M + 4, y + 6.5)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAYMD)
  doc.text(subText, M + 4, y + 11.5)
  doc.setTextColor(...GRAY90)
  return y + 18
}

export function exportPDF(store: ReportStore, t: Translations, lang: string): void {
  // jsPDF's built-in fonts don't support Hebrew — use English labels for PDF when HE is active
  const pt: Translations = lang === 'he' ? translations.en : t

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  // ── Cover header ────────────────────────────────────────────────────────────
  doc.setFillColor(...BLUE)
  doc.rect(0, 0, W, 28, 'F')
  doc.setTextColor(...WHITE)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(pt.appTitle, M, 12)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(pt.appSubtitle, M, 19)
  doc.text(dateStr, W - M, 19, { align: 'right' })
  doc.setTextColor(...GRAY90)

  let y = 34

  // ── 1. ESTIMATION ───────────────────────────────────────────────────────────
  const est = store.estimation
  if (est?.result) {
    y = sectionHeader(doc, pt.tabs.estimation, y)
    const te = pt.estimation

    const inputRows: [string, string, Accent][] = [
      [te.ville,      est.inputs.ville,                                    'none'],
      [te.quartier,   est.inputs.quartier,                                 'none'],
      [te.surface,    est.inputs.surface + ' m²',                          'none'],
      [te.etage,      est.inputs.etage === 0 ? te.rdc : String(est.inputs.etage), 'none'],
      [te.distMer,    est.inputs.distanceMer + ' km',                      'none'],
      [te.distTransp, est.inputs.distanceTransp + ' km',                   'none'],
    ]
    y = miniTable(doc, inputRows, y)

    y = highlightBox(
      doc,
      fmtM(est.result.prixTotal),
      `${te.fourchette} : ${fmtM(Math.round(est.result.prixTotal * 0.92))} – ${fmtM(Math.round(est.result.prixTotal * 1.08))}`,
      BLUE,
      y,
    )

    const teMap = te as Record<string, string>
    const wfRows: [string, string, Accent][] = est.result.waterfall.map(s => [
      teMap[s.label] ?? s.label,
      fmt(s.prixCumul) + ' \u20aa',
      'none',
    ])
    y = miniTable(doc, wfRows, y)
    y += 2
  }

  // ── 2. URBANISME ────────────────────────────────────────────────────────────
  const urb = store.urbanisme
  if (urb) {
    if (y > 225) { doc.addPage(); y = 20 }
    y = sectionHeader(doc, pt.tabs.urbanisme, y)
    const tu = pt.urbanisme

    const score = urb.result.score
    const scoreColor = score >= 70 ? GREEN : score >= 45 ? AMBER : RED
    const scoreLabel = score >= 70 ? pt.scoreLabels.fort
                     : score >= 45 ? pt.scoreLabels.modere
                     : pt.scoreLabels.faible

    y = highlightBox(doc, `${score} / 100`, scoreLabel, scoreColor, y)

    const urbRows: [string, string, Accent][] = [
      [tu.valActTot,   fmtM(urb.result.valActTot),  'none'],
      [tu.valProjTot,  fmtM(urb.result.valProjTot), 'pos'],
      [tu.plusValue,
        (urb.result.plusValue >= 0 ? '+' : '') + fmtM(urb.result.plusValue),
        urb.result.plusValue >= 0 ? 'pos' : 'neg'],
      [tu.coefUrb,     '\u00d7' + urb.result.coefTotal.toFixed(3), 'none'],
      [tu.surfTerrainRow, fmt(urb.inputs.surfTerrain) + ' m\u00b2', 'none'],
      [tu.surfMax,     fmt(urb.result.surfMax)  + ' m\u00b2', 'none'],
      [tu.droitsRest,  fmt(urb.result.droits)   + ' m\u00b2', urb.result.droits > 0 ? 'pos' : 'none'],
    ]
    y = miniTable(doc, urbRows, y)
    y += 2
  }

  // ── 3. INVESTISSEUR ─────────────────────────────────────────────────────────
  const inv = store.investisseur
  if (inv) {
    if (y > 215) { doc.addPage(); y = 20 }
    y = sectionHeader(doc, pt.tabs.investisseur, y)
    const ti = pt.investisseur
    const cfPos = inv.result.cfMensuel >= 0

    y = highlightBox(
      doc,
      fmtPct(inv.result.rendBrut) + ' / ' + fmtPct(inv.result.rendNet),
      `${ti.rendBrut} / ${ti.rendNet}`,
      BLUE,
      y,
    )

    const invRows: [string, string, Accent][] = [
      [ti.mensualite,   fmt(inv.result.mensualite) + ' \u20aa', 'none'],
      [ti.tri,          fmtPct(inv.result.tri, 1),              'none'],
      [ti.cfRow,        (cfPos ? '+' : '') + fmt(Math.round(inv.result.cfMensuel)) + ' \u20aa', cfPos ? 'pos' : 'neg'],
      [ti.prixSortie,   fmtM(inv.result.prixSortie),            'pos'],
      [ti.gainTotal,    fmtM(inv.result.gainTotal),             inv.result.gainTotal >= 0 ? 'pos' : 'neg'],
    ]
    y = miniTable(doc, invRows, y)

    const projRows: [string, string, Accent][] = inv.result.projection.map(p => [
      `+${p.annee} ${ti.ans}`,
      fmtM(p.valeur) + '  |  CF ' + (p.cfCumul >= 0 ? '+' : '') + fmtM(p.cfCumul),
      p.cfCumul >= 0 ? 'pos' : 'neg',
    ])
    y = miniTable(doc, projRows, y)
    y += 2
  }

  // ── 4. PROMOTEUR ────────────────────────────────────────────────────────────
  const prom = store.promoteur
  if (prom) {
    if (y > 200) { doc.addPage(); y = 20 }
    y = sectionHeader(doc, pt.tabs.promoteur, y)
    const tp = pt.promoteur
    const mOk = prom.result.margeBrute >= 0

    y = highlightBox(
      doc,
      fmtM(prom.result.margeBrute),
      `${tp.tauxMargeCA} : ${fmtPct(prom.result.margePct, 1)}`,
      mOk ? GREEN : RED,
      y,
    )

    const promRows: [string, string, Accent][] = [
      [tp.caRow,        '+' + fmtM(prom.result.ca),              'pos'],
      [tp.terrain,      '-' + fmtM(prom.inputs.coutTerrain),     'neg'],
      [tp.construction, '-' + fmtM(prom.result.coutConst),       'neg'],
      [tp.honoraires,   '-' + fmtM(prom.result.frais),           'neg'],
      [tp.commerc,      '-' + fmtM(prom.result.commerc),         'neg'],
      [tp.portage,      '-' + fmtM(prom.result.portage),         'neg'],
      [tp.margeBrute,   (mOk ? '+' : '') + fmtM(prom.result.margeBrute), mOk ? 'pos' : 'neg'],
      [tp.surfVend,     fmt(prom.result.surfVendable) + ' m\u00b2', 'none'],
      [tp.prixRevient,  fmt(prom.result.prixRevientM2) + ' \u20aa/m\u00b2', 'none'],
    ]
    y = miniTable(doc, promRows, y)

    if (y > 220) { doc.addPage(); y = 20 }
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...GRAY90)
    doc.text(tp.sensib.toUpperCase(), M, y + 4)
    y += 7

    autoTable(doc, {
      startY: y,
      margin: { left: M, right: M },
      tableWidth: W - M * 2,
      head: [[tp.variation, tp.caRow, tp.margeBrute, '%']],
      body: prom.result.sensitivity.map(s => [
        (s.variation >= 0 ? '+' : '') + s.variation + '%',
        fmtM(s.ca),
        fmtM(s.marge),
        s.pct.toFixed(1) + '%',
      ]),
      styles: { fontSize: 7.5, cellPadding: 1.6 },
      headStyles: { fillColor: BLUE, textColor: WHITE, fontStyle: 'bold', fontSize: 7.5 },
      theme: 'striped',
      alternateRowStyles: { fillColor: GRAY50 },
      didParseCell(data) {
        if (data.section === 'body' && data.column.index >= 2) {
          const marge = prom.result.sensitivity[data.row.index]?.marge ?? 0
          data.cell.styles.textColor = marge >= 0 ? GREEN : RED
        }
        if (data.section === 'body' && data.row.index === 3) {
          data.cell.styles.fontStyle = 'bold'
        }
      },
    })
    y = (doc as any).lastAutoTable.finalY + 4
  }

  // ── Footer on every page ─────────────────────────────────────────────────────
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p)
    doc.setFontSize(7)
    doc.setTextColor(156, 163, 175)
    doc.text(pt.appTitle + ' \u2014 ' + dateStr, M, 292)
    doc.text(`${p} / ${pageCount}`, W - M, 292, { align: 'right' })
  }

  const filenames: Record<string, string> = {
    fr: 'rapport-immobilier-israel.pdf',
    en: 'israel-real-estate-report.pdf',
    he: 'israel-real-estate-report.pdf',
  }
  doc.save(filenames[lang] ?? 'rapport-immobilier-israel.pdf')
}
