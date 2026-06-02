import { useState, useRef, useCallback } from 'react'
import { Send, Loader2, Trash2 } from 'lucide-react'
import Anthropic from '@anthropic-ai/sdk'
import { useLang } from '../i18n/LanguageContext'

declare const __ANTHROPIC_BASE_URL__: string
declare const __ANTHROPIC_KEY__: string

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
  const [input, setInput]   = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const abortRef  = useRef<AbortController | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const { t }     = useLang()
  const ta        = t.agent

  const analyze = useCallback(async () => {
    if (!input.trim() || loading) return
    setLoading(true)
    setOutput('')
    setError('')

    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      const anthropic = new Anthropic({
        apiKey:  __ANTHROPIC_KEY__,
        baseURL: __ANTHROPIC_BASE_URL__,
        dangerouslyAllowBrowser: true,
      })

      const stream = anthropic.messages.stream({
        model:      'claude-sonnet-4-6',
        max_tokens: 8192,
        system:     SYSTEM_PROMPT,
        messages:   [{ role: 'user', content: input }],
      })

      for await (const event of stream) {
        if (ctrl.signal.aborted) break
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          const text = event.delta.text
          if (text) {
            setOutput(prev => {
              const next = prev + text
              setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 10)
              return next
            })
          }
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
            {loading && (
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" /> génération…
              </span>
            )}
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
