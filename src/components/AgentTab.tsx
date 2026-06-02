import { useState, useRef, useCallback } from 'react'
import { Send, Loader2, Trash2, Copy, Check, FileDown } from 'lucide-react'
import jsPDF from 'jspdf'
import { useLang } from '../i18n/LanguageContext'

const SYSTEM_PROMPT = `Tu es un assistant IA de niveau fonds d'investissement immobilier spécialisé en Israël (Tel Aviv et grandes villes).

Tu analyses des projets immobiliers complexes et tu prends des décisions d'investissement structurées comme un analyste senior de private equity immobilier.

---

# 🎯 OBJECTIF PRINCIPAL

Pour chaque projet, tu dois :

1. Comprendre la description immobilière
2. Extraire toutes les données pertinentes
3. Compléter les données manquantes avec hypothèses réalistes marché Israël
4. Calculer le coût total du projet
5. Estimer la valeur de sortie du projet fini
6. Calculer la rentabilité (ROI)
7. Évaluer les risques
8. Donner un **score d'investissement sur 100**
9. Donner une recommandation finale claire

---

# 📊 DONNÉES À EXTRAIRE

- Localisation (ville / quartier)
- Type de projet (rénovation / démolition / construction neuve)
- Surface existante (m²)
- Surface projetée (m²)
- Surface terrain (m²)
- Prix d'acquisition (NIS)
- Permis de construire (oui / non / inconnu)
- Nombre d'étages / sous-sols / penthouse
- Contraintes (succession, permis déjà accordé, etc.)

---

# 🧠 HYPOTHÈSES (ISRAËL / TEL AVIV)

Tu dois appliquer des hypothèses réalistes :

- Construction : 18 000 → 28 000 NIS/m² (Tel Aviv = haut de fourchette)
- Sous-sol : +40% à +70% du coût standard
- Démolition : 800 → 1 500 NIS/m²
- Honoraires (archi + ingénierie + gestion) : 8% → 12%
- Imprévus : 7% → 10%
- Prix de vente marché TLV : 35 000 → 60 000 NIS/m²

---

# 📐 CALCULS OBLIGATOIRES

Tu dois calculer : Coût construction, Coût sous-sol, Coût démolition, Honoraires, Imprévus, Coût total projet, Valeur de sortie, Marge brute, ROI (%).

---

# 🧠 SCORING INVESTISSEMENT (0–100)

Tu dois calculer un Investment Score global basé sur 5 critères :

1. Rentabilité (0–30 pts) : >40% ROI = 30 pts | 25–40% = 22 pts | 15–25% = 15 pts | <15% = 5 pts | négatif = 0 pts
2. Risque marché (0–20 pts) : TLV prime = haut potentiel | zones secondaires = risque moyen | zones incertaines = faible score
3. Risque construction (0–20 pts) : permis accordé = faible risque | projet complexe = risque élevé
4. Sécurité financière (0–15 pts) : marge élevée et stable = bon score
5. Qualité du deal (0–15 pts) : bon ratio achat/valeur future, cohérence, potentiel revalorisation

---

# 📊 INTERPRÉTATION SCORE
- 80–100 : 🟢 EXCELLENT INVESTISSEMENT
- 65–79 : 🟡 BON INVESTISSEMENT
- 50–64 : 🟠 RISQUE MODÉRÉ
- 30–49 : 🔴 RISQUE ÉLEVÉ
- <30 : ❌ À ÉVITER

---

# 🏗️ FORMAT DE RÉPONSE OBLIGATOIRE

## 1. 📌 Résumé du projet

## 2. 📍 Données extraites

## 3. 🧠 Hypothèses utilisées

## 4. 🏗️ Estimation des coûts
- Construction :
- Sous-sols :
- Démolition :
- Honoraires :
- Imprévus :

---

## 5. 💰 Analyse financière
- Coût total projet :
- Valeur de sortie :
- Marge brute :
- ROI :

---

## 6. ⚠️ Analyse des risques

---

## 7. 🧠 Investment Score (0–100)
- Rentabilité :
- Risque marché :
- Risque construction :
- Sécurité financière :
- Qualité du deal :
- SCORE FINAL :

---

## 8. 📊 Conclusion investisseur
- Statut : (EXCELLENT / BON / MOYEN / RISQUÉ / À ÉVITER)
- Recommandation claire

---

# ⚠️ RÈGLES IMPORTANTES
- Toujours produire des chiffres cohérents
- Toujours utiliser des hypothèses réalistes Israël
- Toujours être structuré et professionnel
- Ne jamais répondre vaguement
- Le scoring doit toujours être calculé, jamais ignoré`

function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e'
  if (score >= 65) return '#eab308'
  if (score >= 50) return '#f97316'
  if (score >= 30) return '#ef4444'
  return '#991b1b'
}

function scoreLabel(score: number): string {
  if (score >= 80) return '🟢 EXCELLENT'
  if (score >= 65) return '🟡 BON'
  if (score >= 50) return '🟠 MODÉRÉ'
  if (score >= 30) return '🔴 RISQUÉ'
  return '❌ À ÉVITER'
}

function renderBold(text: string, key: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  if (parts.length === 1) return text
  return (
    <span key={key}>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} style={{ color: '#1A3A5C', fontWeight: 700 }}>{p.slice(2, -2)}</strong>
          : p
      )}
    </span>
  )
}

function RenderOutput({ text }: { text: string }) {
  if (!text) return null
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []

  lines.forEach((line, i) => {
    const trimmed = line.trim()

    if (!trimmed) {
      nodes.push(<div key={`sp${i}`} className="h-1.5" />)
      return
    }

    if (trimmed === '---') {
      nodes.push(<div key={i} className="border-t border-neutral-200 my-3" />)
      return
    }

    if (trimmed.startsWith('## ')) {
      const heading = trimmed.slice(3)
      const isScore = heading.includes('Score') || heading.includes('score')
      nodes.push(
        <div key={i} className={`flex items-center gap-2 mt-5 mb-2 pb-1.5 border-b ${isScore ? 'border-amber-300' : 'border-neutral-200'}`}>
          <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: isScore ? '#C9A84C' : '#1A3A5C' }}>
            {heading}
          </h3>
        </div>
      )
      return
    }

    if (trimmed.startsWith('- ')) {
      const content = trimmed.slice(2)

      const scoreMatch = content.match(/^SCORE FINAL\s*:\s*(\d+)/i)
      if (scoreMatch) {
        const score = parseInt(scoreMatch[1])
        const col = scoreColor(score)
        nodes.push(
          <div key={i} className="my-3 p-4 rounded-xl flex items-center gap-5" style={{ background: '#f9f8f6', border: `2px solid ${col}` }}>
            <div className="text-5xl font-extrabold tabular-nums" style={{ color: col }}>{score}</div>
            <div>
              <div className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Investment Score / 100</div>
              <div className="text-lg font-bold" style={{ color: col }}>{scoreLabel(score)}</div>
              <div className="mt-2 h-2 rounded-full bg-neutral-200 w-36 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${score}%`, background: col }} />
              </div>
            </div>
          </div>
        )
        return
      }

      const statutMatch = content.match(/^Statut\s*:\s*(.+)/i)
      if (statutMatch) {
        const statut = statutMatch[1].trim().replace(/[()]/g, '').trim()
        const isEx  = /EXCELLENT/i.test(statut)
        const isBon = /^BON/i.test(statut)
        const isMod = /MOYEN|MODÉR/i.test(statut)
        const isRisk = /RISQUÉ/i.test(statut)
        const bg = isEx ? '#dcfce7' : isBon ? '#fef9c3' : isMod ? '#ffedd5' : isRisk ? '#fee2e2' : '#fecaca'
        const fg = isEx ? '#15803d' : isBon ? '#a16207' : isMod ? '#c2410c' : isRisk ? '#b91c1c' : '#7f1d1d'
        nodes.push(
          <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold mt-1 mb-1" style={{ background: bg, color: fg }}>
            {statut}
          </span>
        )
        return
      }

      const colonIdx = content.indexOf(':')
      if (colonIdx > 0 && colonIdx < 50) {
        const k = content.slice(0, colonIdx).trim()
        const v = content.slice(colonIdx + 1).trim()
        if (v) {
          const isMonetary = /₪|NIS|M₪/.test(v)
          const isPct = v.includes('%')
          nodes.push(
            <div key={i} className="flex justify-between items-start py-1.5 text-sm border-b border-neutral-100 gap-3">
              <span className="text-neutral-500 shrink-0">{renderBold(k, `k${i}`)}</span>
              <span className="font-semibold text-right" style={{ color: isMonetary ? '#C9A84C' : isPct ? '#1A3A5C' : '#334155' }}>
                {renderBold(v, `v${i}`)}
              </span>
            </div>
          )
          return
        }
      }

      nodes.push(
        <div key={i} className="flex items-start gap-2 py-0.5 text-sm text-neutral-700">
          <span className="mt-0.5 shrink-0 text-xs" style={{ color: '#C9A84C' }}>▸</span>
          <span>{renderBold(content, `b${i}`)}</span>
        </div>
      )
      return
    }

    nodes.push(
      <p key={i} className="text-sm text-neutral-700 leading-relaxed my-0.5">
        {renderBold(trimmed, `p${i}`)}
      </p>
    )
  })

  return <div className="space-y-0.5">{nodes}</div>
}

export function AgentTab() {
  const [input, setInput]     = useState('')
  const [output, setOutput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [copied, setCopied]   = useState(false)
  const [pdfBusy, setPdfBusy] = useState(false)
  const abortRef  = useRef<AbortController | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const { t }     = useLang()
  const ta        = t.agent

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
            const label = score >= 80 ? 'EXCELLENT' : score >= 65 ? 'BON' : score >= 50 ? 'MODÉRÉ' : score >= 30 ? 'RISQUÉ' : 'À ÉVITER'
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

    const ctrl = new AbortController()
    abortRef.current = ctrl

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
          system:     SYSTEM_PROMPT,
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
    }
  }, [input, loading, ta.errorMsg])

  const handleClear = () => {
    if (loading && abortRef.current) abortRef.current.abort()
    setInput('')
    setOutput('')
    setError('')
    setLoading(false)
  }

  const EXAMPLES = [
    { label: ta.ex1, text: ta.ex1text },
    { label: ta.ex2, text: ta.ex2text },
    { label: ta.ex3, text: ta.ex3text },
  ]

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-4 border border-neutral-200" style={{ background: 'linear-gradient(135deg, #f0f5fa 0%, #f9f8f4 100%)' }}>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-base">🤖</span>
          <h2 className="text-sm font-bold" style={{ color: '#1A3A5C' }}>{ta.title}</h2>
          <span className="ml-auto text-xs text-neutral-400 shrink-0">{ta.poweredBy}</span>
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed">{ta.subtitle}</p>
      </div>

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
          ⚠️ {error}
        </div>
      )}

      {output && (
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-100" style={{ background: '#f8f7f5' }}>
            <div className="flex items-center gap-2">
              <span className="text-sm">📊</span>
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#1A3A5C' }}>Rapport d'analyse — Private Equity</span>
            </div>
            <div className="flex items-center gap-2">
              {loading && (
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Loader2 size={10} className="animate-spin" /> génération…
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
                    {copied ? <><Check size={11} /> Copié</> : <><Copy size={11} /> Copier</>}
                  </button>
                  <button
                    onClick={handleExportPdf}
                    disabled={pdfBusy}
                    title="Exporter en PDF"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border disabled:opacity-50"
                    style={{ background: '#1A3A5C', borderColor: '#1A3A5C', color: 'white' }}>
                    {pdfBusy
                      ? <><Loader2 size={11} className="animate-spin" /> PDF…</>
                      : <><FileDown size={11} /> PDF</>}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="p-5">
            <RenderOutput text={output} />
            <div ref={outputRef} />
          </div>
        </div>
      )}

      <p className="text-xs text-neutral-400 text-center leading-relaxed pb-2">{ta.disclaimer}</p>
    </div>
  )
}
