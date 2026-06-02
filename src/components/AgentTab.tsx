import { useState, useRef, useCallback, useEffect } from 'react'
import { Send, Loader2, Trash2, Copy, Check, FileDown, History, X, ChevronRight, Clock } from 'lucide-react'
import jsPDF from 'jspdf'
import { useLang } from '../i18n/LanguageContext'

const HISTORY_KEY = 'agent_ia_history_v1'
const MAX_HISTORY = 50

interface HistoryItem {
  id: string
  title: string
  input: string
  output: string
  date: number
}

function loadHistory(): HistoryItem[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]') } catch { return [] }
}
function saveHistory(items: HistoryItem[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, MAX_HISTORY)))
}
function makeTitle(input: string): string {
  const first = input.trim().split('\n')[0].replace(/[*#_]/g, '').trim()
  return first.length > 60 ? first.slice(0, 58) + '…' : first
}
function fmtDate(ts: number, lang: 'fr' | 'en' | 'he' = 'fr'): string {
  const d    = new Date(ts)
  const diffH = (Date.now() - ts) / 3600000
  const diffM = Math.round(diffH * 60)
  if (lang === 'he') {
    if (diffH < 1)  return `לפני ${diffM} ד׳`
    if (diffH < 24) return `לפני ${Math.round(diffH)} ש׳`
    if (diffH < 48) return 'אתמול'
    return d.toLocaleDateString('he-IL', { day: '2-digit', month: 'short' })
  }
  if (lang === 'en') {
    if (diffH < 1)  return `${diffM}m ago`
    if (diffH < 24) return `${Math.round(diffH)}h ago`
    if (diffH < 48) return 'yesterday'
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  }
  if (diffH < 1)   return `il y a ${diffM} min`
  if (diffH < 24)  return `il y a ${Math.round(diffH)}h`
  if (diffH < 48)  return 'hier'
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

const BASE_PROMPT = `Tu es un analyste senior de fonds de private equity immobilier spécialisé en Israël (Tel-Aviv et grandes villes).

Pour chaque projet décrit, tu produis un rapport d'analyse complet et chiffré.

HYPOTHESES DE BASE (marché israélien) :
- Construction standard : 18 000 à 28 000 NIS/m2 (Tel Aviv = haut de fourchette)
- Sous-sol : +40 % à +70 % du coût standard
- Démolition : 800 à 1 500 NIS/m2
- Honoraires (architecte, ingénierie, gestion) : 8 % à 12 % du coût travaux
- Imprévus : 7 % à 10 %
- Prix de revente marché TLV : 35 000 à 60 000 NIS/m2 selon quartier et standing

SCORING INVESTISSEMENT (0-100) :
- Rentabilité (0-30 pts) : ROI > 40 % = 30 pts | 25-40 % = 22 pts | 15-25 % = 15 pts | < 15 % = 5 pts | negatif = 0 pt
- Risque marche (0-20 pts) : TLV centre = fort potentiel | zones secondaires = risque moyen
- Risque construction (0-20 pts) : permis accorde = faible risque | projet complexe = risque eleve
- Securite financiere (0-15 pts) : marge elevee et stable = bon score
- Qualite du deal (0-15 pts) : ratio achat/valeur future, coherence, potentiel revalorisation

FORMAT DE REPONSE STRICT — utilise exactement ces balises, sans emoji, sans caractere special :

## 1. RESUME DU PROJET
[2-3 phrases synthétiques sur le projet]

## 2. DONNEES EXTRAITES
- Localisation : [valeur]
- Type de projet : [valeur]
- Surface existante : [valeur]
- Surface projetee : [valeur]
- Surface terrain : [valeur]
- Prix acquisition : [valeur]
- Permis de construire : [valeur]
- Etages / sous-sols : [valeur]
- Contraintes : [valeur]

## 3. HYPOTHESES RETENUES
- Cout construction/m2 : [valeur]
- Cout sous-sol/m2 : [valeur]
- Taux honoraires : [valeur]
- Taux imprevus : [valeur]
- Prix revente/m2 : [valeur]

## 4. ESTIMATION DES COUTS
- Construction : [montant NIS]
- Sous-sols : [montant NIS]
- Demolition : [montant NIS]
- Honoraires : [montant NIS]
- Imprevus : [montant NIS]
- Total travaux : [montant NIS]

## 5. ANALYSE FINANCIERE
- Cout acquisition : [montant NIS]
- Cout total projet : [montant NIS]
- Valeur de sortie estimee : [montant NIS]
- Marge brute : [montant NIS]
- ROI : [pourcentage]
- Cout revient / m2 : [valeur NIS/m2]

## 6. ANALYSE DES RISQUES
[3-5 points de risque principaux, un par ligne, commençant par -]

## 7. INVESTMENT SCORE
- Rentabilite : [X]/30
- Risque marche : [X]/20
- Risque construction : [X]/20
- Securite financiere : [X]/15
- Qualite du deal : [X]/15
- SCORE FINAL : [total sur 100]

## 8. CONCLUSION
- Statut : [EXCELLENT / BON / RISQUE MODERE / RISQUE ELEVE / A EVITER]
- Recommandation : [1-2 phrases claires]

REGLES ABSOLUES :
- Chiffres précis et cohérents même si des données manquent (utiliser les hypothèses)
- Aucun emoji, aucun symbole markdown (pas de **, pas de *, pas de #), uniquement le format ci-dessus
- Réponse professionnelle, synthétique, orientée décision d'investissement`

function makeSystemPrompt(lang: 'fr' | 'en' | 'he'): string {
  const directive: Record<string, string> = {
    fr: 'Réponds TOUJOURS en français.',
    en: 'Always respond in ENGLISH. Translate all labels and section titles to English, EXCEPT keep the structural markers "SCORE FINAL :" and "Statut :" exactly as-is (the UI parser depends on them).',
    he: 'ענה תמיד בעברית. תרגם את כל התוכן לעברית — למעט הסמנים המבניים "SCORE FINAL :" ו-"Statut :" שיש לשמור בדיוק כמו שהם (מנתח הממשק תלוי בהם).',
  }
  return `${directive[lang]}\n\n${BASE_PROMPT}`
}

function scoreColor(score: number) {
  if (score >= 80) return { bar: '#22c55e', bg: '#f0fdf4', border: '#86efac', text: '#15803d' }
  if (score >= 65) return { bar: '#f59e0b', bg: '#fffbeb', border: '#fcd34d', text: '#b45309' }
  if (score >= 50) return { bar: '#f97316', bg: '#fff7ed', border: '#fdba74', text: '#c2410c' }
  if (score >= 30) return { bar: '#ef4444', bg: '#fef2f2', border: '#fca5a5', text: '#b91c1c' }
  return { bar: '#991b1b', bg: '#fef2f2', border: '#fca5a5', text: '#7f1d1d' }
}

function scoreLabel(score: number, lang: 'fr' | 'en' | 'he') {
  if (lang === 'he') {
    if (score >= 80) return 'מצוין'
    if (score >= 65) return 'טוב'
    if (score >= 50) return 'בינוני'
    if (score >= 30) return 'מסוכן'
    return 'להימנע'
  }
  if (lang === 'en') {
    if (score >= 80) return 'EXCELLENT'
    if (score >= 65) return 'GOOD'
    if (score >= 50) return 'MODERATE'
    if (score >= 30) return 'RISKY'
    return 'AVOID'
  }
  if (score >= 80) return 'EXCELLENT'
  if (score >= 65) return 'BON'
  if (score >= 50) return 'MODÉRÉ'
  if (score >= 30) return 'RISQUÉ'
  return 'À ÉVITER'
}

const SECTION_COLORS: Record<number, string> = {
  1: '#1A3A5C', 2: '#1A3A5C', 3: '#1A3A5C',
  4: '#7c3aed', 5: '#0369a1',
  6: '#b45309', 7: '#C9A84C', 8: '#1A3A5C',
}

function cleanText(s: string) {
  return s.replace(/\*\*/g, '').replace(/\*/g, '').trim()
}

function RenderOutput({ text, lang }: { text: string; lang: 'fr' | 'en' | 'he' }) {
  if (!text) return null

  type Block =
    | { kind: 'section'; num: number; title: string }
    | { kind: 'kv'; key: string; value: string }
    | { kind: 'score_final'; score: number }
    | { kind: 'statut'; value: string }
    | { kind: 'bullet'; text: string }
    | { kind: 'para'; text: string }
    | { kind: 'spacer' }

  const blocks: Block[] = []
  let currentSectionNum = 0

  for (const raw of text.split('\n')) {
    const line = raw.trim()

    if (!line) { blocks.push({ kind: 'spacer' }); continue }
    if (line === '---') continue

    if (line.startsWith('## ')) {
      const heading = line.slice(3).trim()
      const numMatch = heading.match(/^(\d+)\.\s*(.+)/)
      if (numMatch) {
        currentSectionNum = parseInt(numMatch[1])
        blocks.push({ kind: 'section', num: currentSectionNum, title: numMatch[2].trim() })
      } else {
        blocks.push({ kind: 'section', num: 0, title: heading })
      }
      continue
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const content = cleanText(line.slice(2))
      const scoreMatch = content.match(/^SCORE FINAL\s*:\s*(\d+)/i)
      if (scoreMatch) { blocks.push({ kind: 'score_final', score: parseInt(scoreMatch[1]) }); continue }

      const colonIdx = content.indexOf(':')
      if (colonIdx > 0 && colonIdx < 55) {
        const k = content.slice(0, colonIdx).trim()
        const v = content.slice(colonIdx + 1).trim()
        if (v) {
          if (/^Statut$/i.test(k)) {
            blocks.push({ kind: 'statut', value: v.replace(/[()[\]/]/g, '').trim() })
          } else {
            blocks.push({ kind: 'kv', key: k, value: v })
          }
          continue
        }
      }
      blocks.push({ kind: 'bullet', text: content })
      continue
    }

    blocks.push({ kind: 'para', text: cleanText(line) })
  }

  // group consecutive kv blocks inside the same section into cards
  type GroupedBlock =
    | Block
    | { kind: 'kv_group'; items: { key: string; value: string }[]; sectionNum: number }

  const grouped: GroupedBlock[] = []
  let i = 0
  while (i < blocks.length) {
    const b = blocks[i]
    if (b.kind === 'kv') {
      const group: { key: string; value: string }[] = []
      while (i < blocks.length && blocks[i].kind === 'kv') {
        const kv = blocks[i] as { kind: 'kv'; key: string; value: string }
        group.push({ key: kv.key, value: kv.value })
        i++
      }
      grouped.push({ kind: 'kv_group', items: group, sectionNum: currentSectionNum })
    } else {
      grouped.push(b)
      i++
    }
  }

  const nodes: React.ReactNode[] = []
  let sectionNum = 0

  grouped.forEach((block, idx) => {
    if (block.kind === 'spacer') {
      nodes.push(<div key={idx} className="h-1" />)
      return
    }

    if (block.kind === 'section') {
      sectionNum = block.num
      const col = SECTION_COLORS[sectionNum] ?? '#1A3A5C'
      const isScore = sectionNum === 7
      nodes.push(
        <div key={idx} className="flex items-center gap-3 mt-6 mb-3">
          {block.num > 0 && (
            <span className="flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold shrink-0"
              style={{ background: col }}>{block.num}</span>
          )}
          <h3 className="text-xs font-bold uppercase tracking-widest"
            style={{ color: isScore ? '#C9A84C' : col }}>
            {block.title}
          </h3>
          <div className="flex-1 h-px" style={{ background: isScore ? '#fde68a' : '#e5e7eb' }} />
        </div>
      )
      return
    }

    if (block.kind === 'kv_group') {
      const isFinance   = [4,5].includes(sectionNum)
      const isScore7    = sectionNum === 7
      nodes.push(
        <div key={idx} className="rounded-lg overflow-hidden mb-3 border border-neutral-100">
          {block.items.map((item, j) => {
            const isMonetary = /NIS|₪|M₪|\d.*NIS/.test(item.value)
            const isPct      = item.value.includes('%')
            const isLast     = j === block.items.length - 1
            const scorePartMatch = item.value.match(/^(\d+)\/(\d+)$/)
            return (
              <div key={j} className={`flex items-start justify-between px-3 py-2 text-sm gap-4 ${!isLast ? 'border-b border-neutral-100' : ''} ${j % 2 === 0 ? 'bg-white' : 'bg-neutral-50/60'}`}>
                <span className="text-neutral-500 text-xs shrink-0 pt-0.5 min-w-0">{item.key}</span>
                {scorePartMatch ? (
                  <span className="flex items-center gap-1.5 font-semibold text-xs" style={{ color: '#C9A84C' }}>
                    <span className="text-base font-bold">{scorePartMatch[1]}</span>
                    <span className="text-neutral-400">/ {scorePartMatch[2]}</span>
                  </span>
                ) : (
                  <span className="font-semibold text-right text-xs"
                    style={{ color: isMonetary && isFinance ? '#C9A84C' : isPct ? '#1A3A5C' : isScore7 ? '#C9A84C' : '#1e293b' }}>
                    {item.value}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )
      return
    }

    if (block.kind === 'score_final') {
      const c = scoreColor(block.score)
      nodes.push(
        <div key={idx} className="my-4 p-4 rounded-xl" style={{ background: c.bg, border: `1.5px solid ${c.border}` }}>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-5xl font-black tabular-nums leading-none" style={{ color: c.bar }}>{block.score}</div>
              <div className="text-xs text-neutral-400 mt-1">/ 100</div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-neutral-400 uppercase tracking-widest mb-1">{lang === 'he' ? 'ציון השקעה' : 'Investment Score'}</div>
              <div className="text-lg font-bold mb-2" style={{ color: c.text }}>{scoreLabel(block.score, lang)}</div>
              <div className="h-2 rounded-full bg-white/70 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${block.score}%`, background: c.bar }} />
              </div>
            </div>
          </div>
        </div>
      )
      return
    }

    if (block.kind === 'statut') {
      const v   = block.value.toUpperCase()
      const isEx = v.includes('EXCELLENT')
      const isBon = v.startsWith('BON')
      const isMod = /MODERE|MODERÉ/.test(v)
      const isRisk = v.includes('RISQUE') && !isMod
      const bg = isEx ? '#dcfce7' : isBon ? '#fef9c3' : isMod ? '#ffedd5' : isRisk ? '#fee2e2' : '#fef2f2'
      const fg = isEx ? '#15803d' : isBon ? '#a16207' : isMod ? '#c2410c' : '#b91c1c'
      nodes.push(
        <div key={idx} className="my-2">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold tracking-wide" style={{ background: bg, color: fg }}>
            {block.value}
          </span>
        </div>
      )
      return
    }

    if (block.kind === 'bullet') {
      nodes.push(
        <div key={idx} className="flex items-start gap-2.5 py-1 text-sm text-neutral-700">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#C9A84C' }} />
          <span className="leading-relaxed">{block.text}</span>
        </div>
      )
      return
    }

    if (block.kind === 'para') {
      nodes.push(
        <p key={idx} className="text-sm text-neutral-600 leading-relaxed my-1">{block.text}</p>
      )
    }
  })

  return <div>{nodes}</div>
}

export function AgentTab() {
  const [input, setInput]         = useState('')
  const [output, setOutput]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [copied, setCopied]       = useState(false)
  const [pdfBusy, setPdfBusy]     = useState(false)
  const [history, setHistory]     = useState<HistoryItem[]>(() => loadHistory())
  const [showHistory, setShowHistory] = useState(false)
  const [activeId, setActiveId]   = useState<string | null>(null)
  const abortRef  = useRef<AbortController | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const { t, lang } = useLang()
  const ta          = t.agent

  useEffect(() => { saveHistory(history) }, [history])

  const handleCopy = useCallback(async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = output
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [output])

  const handleExportPdf = useCallback(() => {
    if (!output || pdfBusy) return
    setPdfBusy(true)
    try {
      const doc   = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const W     = 210
      const M     = 14
      const maxW  = W - M * 2
      const BLUE  : [number,number,number] = [26, 58, 92]
      const GOLD  : [number,number,number] = [201, 168, 76]
      const GRAY  : [number,number,number] = [80, 80, 80]
      const BLACK : [number,number,number] = [30, 30, 30]

      let y = 18
      const newPage = () => { doc.addPage(); y = 18 }
      const guard   = (h: number) => { if (y + h > 278) newPage() }

      doc.setFillColor(...BLUE)
      doc.rect(0, 0, W, 22, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('SIMULATEUR IMMOBILIER ISRAËL — RAPPORT AGENT IA', M, 10)
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' })}  ·  Claude · Replit AI`, M, 17)
      y = 30

      const lines = output.split('\n')
      for (const rawLine of lines) {
        const line = rawLine.trim()
        if (!line) { y += 2; continue }
        if (line === '---') { guard(4); doc.setDrawColor(...GOLD); doc.setLineWidth(0.3); doc.line(M, y, W - M, y); y += 4; continue }

        if (line.startsWith('## ')) {
          const title = line.slice(3)
          guard(10)
          doc.setFillColor(...BLUE)
          doc.rect(M, y, maxW, 7, 'F')
          doc.setTextColor(255, 255, 255)
          doc.setFontSize(8.5)
          doc.setFont('helvetica', 'bold')
          doc.text(title.toUpperCase(), M + 3, y + 5)
          doc.setTextColor(...BLACK)
          y += 10
          continue
        }

        if (line.startsWith('- ')) {
          const content = line.slice(2)
          const scoreMatch = content.match(/^SCORE FINAL\s*:\s*(\d+)/i)
          if (scoreMatch) {
            const score = parseInt(scoreMatch[1])
            guard(18)
            doc.setFillColor(245, 245, 240)
            doc.setDrawColor(...GOLD)
            doc.setLineWidth(0.5)
            doc.roundedRect(M, y, maxW, 14, 2, 2, 'FD')
            doc.setTextColor(...GOLD)
            doc.setFontSize(18)
            doc.setFont('helvetica', 'bold')
            doc.text(String(score), M + 5, y + 10)
            doc.setFontSize(8)
            doc.setTextColor(...GRAY)
            doc.text('/ 100  Investment Score', M + 18, y + 7)
            const label = scoreLabel(score, lang)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(...GOLD)
            doc.text(label, M + 18, y + 12)
            y += 18
            continue
          }

          const colonIdx = content.indexOf(':')
          if (colonIdx > 0 && colonIdx < 50) {
            const k = content.slice(0, colonIdx).trim()
            const v = content.slice(colonIdx + 1).trim()
            if (v) {
              const wrapped = doc.splitTextToSize(v, maxW * 0.5)
              const h = Math.max(6, wrapped.length * 4.5)
              guard(h)
              doc.setFontSize(8)
              doc.setFont('helvetica', 'bold')
              doc.setTextColor(...BLUE)
              doc.text(k, M, y + 4)
              doc.setFont('helvetica', 'normal')
              const isGold = /₪|NIS|M₪/.test(v)
              doc.setTextColor(isGold ? GOLD[0] : BLACK[0], isGold ? GOLD[1] : BLACK[1], isGold ? GOLD[2] : BLACK[2])
              doc.text(wrapped, W - M, y + 4, { align: 'right' })
              doc.setDrawColor(230, 230, 230)
              doc.setLineWidth(0.2)
              doc.line(M, y + h - 0.5, W - M, y + h - 0.5)
              y += h
              continue
            }
          }

          const bulletWrapped = doc.splitTextToSize('▸ ' + content.replace(/\*\*/g, ''), maxW - 5)
          const bh = Math.max(5, bulletWrapped.length * 4.5)
          guard(bh)
          doc.setFontSize(8)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(...GRAY)
          doc.text(bulletWrapped, M + 3, y + 4)
          y += bh
          continue
        }

        const paraWrapped = doc.splitTextToSize(line.replace(/\*\*/g, ''), maxW)
        const ph = Math.max(5, paraWrapped.length * 4.5)
        guard(ph)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...BLACK)
        doc.text(paraWrapped, M, y + 4)
        y += ph
      }

      const totalPages = (doc as jsPDF & { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(7)
        doc.setTextColor(160, 160, 160)
        doc.text('Simulateur Immobilier Israël  ·  Analyse indicative non contractuelle', M, 292)
        doc.text(`${i} / ${totalPages}`, W - M, 292, { align: 'right' })
      }

      doc.save(`rapport-agent-ia-${Date.now()}.pdf`)
    } finally {
      setPdfBusy(false)
    }
  }, [output, pdfBusy])

  const analyze = useCallback(async () => {
    if (!input.trim() || loading) return
    setLoading(true)
    setOutput('')
    setError('')
    setActiveId(null)

    const ctrl = new AbortController()
    abortRef.current = ctrl
    let finalOutput = ''

    try {
      const resp = await fetch('/api/claude/v1/messages', {
        method:  'POST',
        headers: {
          'content-type':       'application/json',
          'anthropic-version':  '2023-06-01',
        },
        body: JSON.stringify({
          model:      'claude-sonnet-4-6',
          max_tokens: 8192,
          stream:     true,
          system:     makeSystemPrompt(lang),
          messages:   [{ role: 'user', content: input }],
        }),
        signal: ctrl.signal,
      })

      if (!resp.ok || !resp.body) {
        const errText = await resp.text().catch(() => resp.statusText)
        throw new Error(`HTTP ${resp.status}: ${errText}`)
      }

      const reader  = resp.body.getReader()
      const decoder = new TextDecoder()
      let   buffer  = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (ctrl.signal.aborted) { reader.cancel(); break }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6).trim()
          if (payload === '[DONE]' || !payload) continue
          try {
            const evt = JSON.parse(payload)
            if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
              const text = evt.delta.text as string
              if (text) {
                finalOutput += text
                setOutput(prev => {
                  const next = prev + text
                  setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 10)
                  return next
                })
              }
            }
          } catch { /* ignore malformed lines */ }
        }
      }
    } catch (e: unknown) {
      if ((e as { name?: string }).name !== 'AbortError') {
        setError(ta.errorMsg)
        console.error('Claude error:', e)
      }
    } finally {
      setLoading(false)
      if (finalOutput.trim()) {
        const newItem: HistoryItem = {
          id:     crypto.randomUUID(),
          title:  makeTitle(input),
          input,
          output: finalOutput,
          date:   Date.now(),
        }
        setHistory(prev => [newItem, ...prev])
        setActiveId(newItem.id)
      }
    }
  }, [input, loading, ta.errorMsg, lang])

  const handleClear = () => {
    if (loading && abortRef.current) abortRef.current.abort()
    setInput('')
    setOutput('')
    setError('')
    setLoading(false)
    setActiveId(null)
  }

  const loadHistoryItem = (item: HistoryItem) => {
    setInput(item.input)
    setOutput(item.output)
    setError('')
    setActiveId(item.id)
    setShowHistory(false)
  }

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setHistory(prev => prev.filter(h => h.id !== id))
    if (activeId === id) { setActiveId(null) }
  }

  const clearAllHistory = () => {
    setHistory([])
    setActiveId(null)
  }

  const EXAMPLES = [
    { label: ta.ex1, text: ta.ex1text },
    { label: ta.ex2, text: ta.ex2text },
    { label: ta.ex3, text: ta.ex3text },
  ]

  return (
    <div className="space-y-5">

      {/* Header + history toggle */}
      <div className="rounded-xl p-4 border border-neutral-200" style={{ background: 'linear-gradient(135deg, #f0f5fa 0%, #f9f8f4 100%)' }}>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-base">🤖</span>
          <h2 className="text-sm font-bold" style={{ color: '#1A3A5C' }}>{ta.title}</h2>
          <span className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowHistory(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
              style={showHistory
                ? { background: '#1A3A5C', borderColor: '#1A3A5C', color: 'white' }
                : { background: 'white', borderColor: '#d1d5db', color: '#374151' }}>
              <History size={12} />
              {ta.historyBtn}
              {history.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={showHistory ? { background: 'rgba(255,255,255,0.2)' } : { background: '#f3f4f6' }}>
                  {history.length}
                </span>
              )}
            </button>
            <span className="text-xs text-neutral-400 hidden sm:block">{ta.poweredBy}</span>
          </span>
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed">{ta.subtitle}</p>
      </div>

      {/* History panel */}
      {showHistory && (
        <div className="rounded-xl border border-neutral-200 overflow-hidden" style={{ background: '#fafaf9' }}>
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-200" style={{ background: '#f3f4f6' }}>
            <div className="flex items-center gap-2">
              <Clock size={13} style={{ color: '#1A3A5C' }} />
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#1A3A5C' }}>
                {ta.historySaved}
              </span>
              <span className="text-xs text-neutral-400">({history.length})</span>
            </div>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button onClick={clearAllHistory}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50">
                  {ta.historyClear}
                </button>
              )}
              <button onClick={() => setShowHistory(false)}
                className="p-1 rounded hover:bg-neutral-200 transition-colors">
                <X size={13} className="text-neutral-400" />
              </button>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-neutral-400">
              {ta.historyEmpty}
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto">
              {history.map(item => (
                <button key={item.id} onClick={() => loadHistoryItem(item)}
                  className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-white transition-colors group"
                  style={activeId === item.id ? { background: '#eff6ff' } : {}}>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-neutral-800 truncate leading-snug" style={activeId === item.id ? { color: '#1A3A5C' } : {}}>
                      {item.title}
                    </div>
                    <div className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1">
                      <Clock size={9} />
                      {fmtDate(item.date, lang)}
                      {activeId === item.id && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                          {ta.historyActive}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={e => deleteHistoryItem(item.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 transition-all"
                      title="Supprimer">
                      <Trash2 size={11} className="text-red-400" />
                    </button>
                    <ChevronRight size={12} className="text-neutral-300" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Examples */}
      <div>
        <p className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wide">{ta.examplesTitle}</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => setInput(ex.text)}
              className="px-3 py-1.5 text-xs rounded-full border border-neutral-200 hover:border-amber-400 hover:bg-amber-50 transition-colors text-neutral-600 hover:text-amber-800">
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) analyze() }}
          rows={5}
          placeholder={ta.placeholder}
          disabled={loading}
          className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm resize-none focus:outline-none focus:border-amber-400 transition-colors"
          style={{ fontFamily: 'inherit' }}
        />
        <div className="flex items-center justify-between gap-2">
          <button onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors">
            <Trash2 size={12} /> {ta.clear}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 hidden sm:block">Ctrl+Enter</span>
            <button onClick={analyze} disabled={loading || !input.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: loading ? '#94a3b8' : '#1A3A5C', color: 'white' }}>
              {loading
                ? <><Loader2 size={14} className="animate-spin" /> {ta.submitting}</>
                : <><Send size={14} /> {ta.submit}</>
              }
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200">
          {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-100" style={{ background: '#f8f7f5' }}>
            <div className="flex items-center gap-2">
              <span className="text-sm">📊</span>
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#1A3A5C' }}>{ta.reportTitle}</span>
              {activeId && history.find(h => h.id === activeId) && (
                <span className="text-xs text-neutral-400">
                  · {fmtDate(history.find(h => h.id === activeId)!.date, lang)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {loading && (
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Loader2 size={10} className="animate-spin" /> {ta.generating}
                </span>
              )}
              {!loading && output && (
                <>
                  <button
                    onClick={handleCopy}
                    title="Copier le rapport"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border"
                    style={copied
                      ? { background: '#dcfce7', borderColor: '#86efac', color: '#15803d' }
                      : { background: 'white', borderColor: '#e5e7eb', color: '#6b7280' }}>
                    {copied ? <><Check size={11} /> {ta.copiedBtn}</> : <><Copy size={11} /> {ta.copyBtn}</>}
                  </button>
                  <button
                    onClick={handleExportPdf}
                    disabled={pdfBusy}
                    title="Exporter en PDF"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border disabled:opacity-50"
                    style={{ background: '#1A3A5C', borderColor: '#1A3A5C', color: 'white' }}>
                    {pdfBusy
                      ? <><Loader2 size={11} className="animate-spin" /> {ta.pdfBtn}…</>
                      : <><FileDown size={11} /> {ta.pdfBtn}</>}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="p-5">
            <RenderOutput text={output} lang={lang} />
            <div ref={outputRef} />
          </div>
        </div>
      )}

      <p className="text-xs text-neutral-400 text-center leading-relaxed pb-2">{ta.disclaimer}</p>
    </div>
  )
}
