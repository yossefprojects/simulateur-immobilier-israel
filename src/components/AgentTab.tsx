import { useState, useRef, useCallback, useEffect } from 'react'
import { Send, Loader2, Trash2, Copy, Check, FileDown, History, X, ChevronRight, ChevronDown, Sliders, Clock } from 'lucide-react'
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

const BASE_PROMPT = `Tu es un expert en évaluation immobilière agréé en Israël (שמאי מקרקעין מוסמך). Tu maîtrises les méthodes officielles reconnues par le Conseil des Shamaïm (מועצת שמאי המקרקעין בישראל), le droit foncier israélien, la fiscalité immobilière et les données de marché Nadlan Gov.

RÔLE ET LIMITES :
Tu es un outil d'aide à la décision, pas un Shamai agréé officiel. Tes évaluations sont indicatives, basées sur des données publiques (Nadlan Gov, CBS, BOI) et des méthodes reconnues. Elles ne remplacent pas un rapport de Shamai légalement signé (requis notamment pour un prêt hypothécaire). Rappelle cette limite une seule fois, brièvement, en première ligne du rapport.

SI INFORMATIONS MANQUANTES :
Ne bloque jamais. Calcule avec les données disponibles en posant des hypothèses raisonnables, et indique clairement ce qui est estimé. Tu peux lister en fin de rapport les informations à fournir pour affiner.

MÉTHODES D'ÉVALUATION (applique la plus pertinente, priorité au comparatif) :
1. Comparative (שיטת ההשוואה) — priorité : Valeur = Prix médian m2 quartier x Surface x coef. étage x état x vue x équipements x âge x type x pièces.
2. Revenu (שיטת ההכנסות) — si loué/investissement : Valeur = Loyer annuel net / Taux de capitalisation (2,5 a 4,5 %).
3. Résiduelle (שיטת העודף) — si terrain/développement : Valeur terrain = CA projet - coûts construction - frais (15-20 %) - marge promoteur (20-30 %) - financement.
4. Coût (שיטת העלות) — si bien très spécifique ou neuf.

PRIX MÉDIANS DE RÉFÉRENCE (Nadlan Gov Q1 2025, NIS/m2) :
Tel Aviv Neve Tzedek 58 000 ; Rothschild/Centre 62 000 ; Florentin 42 000 ; Old North 46 000 ; Ramat Aviv 38 000 ; Jaffa 31 000 ; Herzliya Pituach 50 000 ; Herzliya Centre 30 000 ; Jérusalem Rehavia/Talbiyeh 42 000 ; German Colony 38 000 ; Katamon 28 000 ; Netanya Ir Yamim 32 000 ; Netanya bord de mer 27 000 ; Ra'anana Centre 28 000 ; Haïfa Merkaz HaCarmel 25 000 ; Beer Sheva Ramot 12 000 ; Nahal Beka 11 000. Si le quartier est inconnu, estime par comparaison avec une zone proche et signale-le.

COEFFICIENTS D'AJUSTEMENT :
Étage : RDC x0,90 ; 1-2 x0,95 ; 3-5 x1,00 ; 6-10 x1,05 ; 11+ x1,10.
État : neuf x1,16 ; comme neuf x1,08 ; rénové x1,03 ; correct x1,00 ; à rénover x0,87.
Vue mer directe x1,15 a x1,25. Parking +1 x1,06 ; +2 x1,10. Balcon 1 x1,04 ; 2+ x1,07. Mamad x1,03.
Âge : <3 ans x1,10 ; 3-10 x1,04 ; 10-25 x1,00 ; 25-40 x0,96 ; >40 x0,92.
Type : appartement x1,00 ; penthouse x1,32 ; villa x1,20 ; appart. jardin x0,92.
Pièces : studio x1,14 ; 2P x1,07 ; 3P x1,00 ; 4P x0,97 ; 5P+ x0,94.

FISCALITÉ (obligatoire dans tout rapport) :
Mas Rechisha (מס רכישה) résident, bien principal : 0 % jusqu'à 1 978 745 ; 3,5 % jusqu'à 2 347 040 ; 5 % jusqu'à 6 055 070 ; 8 % jusqu'à 20 183 565 ; 10 % au-delà. Investisseur (2e bien +) : 8 % jusqu'à 6 055 070 puis 10 %. Olim hadashim (עולים חדשים) : 0,5 % jusqu'à 1 978 745 (réduction 7 ans).
Mas Shevach (מס שבח) : 25 % sur la plus-value réelle indexée CBS ; exonération résidence principale possible (habité 18 mois, délai 4 ans).
Heitel Hashvacha (היטל השבחה) : 50 % de la plus-value créée par un changement de plan (תב"ע), dû à la vente ou à l'obtention du permis.

URBANISME :
TAMA 38/1 (תמ"א 38, renforcement + étages) bonus +15 a +25 % ; TAMA 38/2 (démolition-reconstruction) +25 a +45 %. Éligibilité : immeuble construit avant 1980, accord 66 % des copropriétaires.
Pinouï-Binouï (פינוי בינוי) : zone municipale de démolition-reconstruction, bonus foncier +40 a +80 %.
Score urbanistique (0-100) : TAMA 38 actif +25 ; zone Pinouï-Binouï +35 ; droits à construire restants >30 % +20 ; plan récent (<5 ans) +10 ; permis accordé +10 (maximum 100).

TERMES HÉBREUX : inclus toujours le terme technique hébreu entre parenthèses, quelle que soit la langue du rapport.

FORMAT DE RÉPONSE STRICT — respecte EXACTEMENT ces balises. Aucun emoji. Aucun tableau. Aucun symbole markdown sauf "## " pour les titres de section et "- " pour les listes. Écris tous les grands nombres avec des espaces de milliers (ex : 5 800 000 NIS) et toujours "NIS", jamais le symbole ₪.

Première ligne du rapport (une seule fois) :
Rapport indicatif — ne remplace pas un rapport de Shamai (שמאות) légalement signé.

## 1. IDENTIFICATION DU BIEN
- Adresse : [valeur]
- Type : [valeur]
- Surface : [X m2]
- Étage : [X / X étages]
- Année de construction : [valeur]
- État : [valeur]
- Gush / Helka (גוש/חלקה) : [si connu, sinon Non communiqué]

## 2. VALEUR VÉNALE ESTIMÉE
- Prix estimé : [X NIS]
- Fourchette : [X - Y NIS]
- Prix au m2 estimé : [X NIS/m2]
- Prix au m2 marché (quartier) : [X NIS/m2]
- Méthode principale : [comparative / revenu / résiduelle / coût]
DÉCOMPOSITION DES COEFFICIENTS :
- Base quartier : [X NIS/m2]
- État : [xX]
- Étage : [xX]
- Équipements : [xX]
- Âge : [xX]
- Coefficient total : [xX]

## 3. ANALYSE DE MARCHÉ
- Tendance du quartier (12 mois) : [hausse / stabilité / baisse]
- Comparables récents : [2-3 transactions, ou données limitées]
- Délai de vente moyen estimé : [X semaines]
- Liquidité : [forte / moyenne / faible] - [justification courte]

## 4. ANALYSE FISCALE
POUR L'ACHETEUR :
- Mas Rechisha (מס רכישה) : [X NIS] ([X] %)
- Si olim hadashim (עולים חדשים) : [X NIS]
- Frais notaire et enregistrement : [X NIS]
- Coût total acquisition : [X NIS]
POUR LE VENDEUR :
- Prix d'acquisition présumé : [X NIS]
- Plus-value estimée : [X NIS]
- Mas Shevach (מס שבח) : [X NIS] ([X] %)
- Exonération résidence principale : [Oui / Non / Partielle]
- Heitel Hashvacha (היטל השבחה) : [X NIS, ou Non applicable]
- Produit net vendeur estimé : [X NIS]

## 5. POTENTIEL URBANISTIQUE
- Score urbanistique (תכנוני) : [X]/100
- Éligibilité TAMA 38 (תמ"א 38) : [Oui / Non / À vérifier] - [+X %]
- Zone Pinouï-Binouï (פינוי בינוי) : [Oui / Non / À vérifier] - [+X %]
- Droits à construire restants (זכויות בנייה) : [X m2 ou %]
- Valeur avec potentiel réalisé : [X NIS]

## 6. ANALYSE INVESTISSEMENT
- Loyer mensuel marché estimé : [X NIS/mois]
- Rendement brut : [X] %
- Rendement net : [X] %
- Cash-flow mensuel (crédit 70 % / 25 ans) : [X NIS/mois]
- Prix de sortie à 10 ans (+3 %/an) : [X NIS]
- TRI estimé sur 10 ans : [X] %
- SCORE FINAL : [note sur 100]

## 7. POINTS D'ATTENTION
- [point ou risque à vérifier 1]
- [point ou risque à vérifier 2]
- [point ou risque à vérifier 3]
- [point ou risque à vérifier 4]

## 8. RECOMMANDATION FINALE
- Statut : [ACHETER / VENDRE / ATTENDRE / DÉVELOPPER]
- Justification : [2-3 phrases synthétiques basées sur l'ensemble de l'analyse]

RÈGLES ABSOLUES :
- Conserve les marqueurs "SCORE FINAL :" et "Statut :" exactement (le rendu de l'interface en dépend).
- Fournis toujours la section 6 (estime le loyer de marché même si le bien n'est pas loué).
- Chiffres précis et cohérents même avec des données manquantes (hypothèses claires).
- Aucun emoji, aucun tableau, aucun astérisque. Uniquement "## " et "- ".
- Grands nombres avec espaces de milliers, toujours "NIS", jamais ₪.
- Termes techniques hébreux entre parenthèses.
- Ton expert, précis, honnête sur les incertitudes ; toujours utile malgré les limites des données.`

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
  6: '#C9A84C', 7: '#b91c1c', 8: '#1A3A5C',
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
      const isScore = sectionNum === 6
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
      const isFinance   = [2,4,5,6].includes(sectionNum)
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
                    style={{ color: isMonetary && isFinance ? '#C9A84C' : isPct ? '#1A3A5C' : '#1e293b' }}>
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
      // Recommandation Shamai : ACHETER / VENDRE / ATTENDRE / DÉVELOPPER (FR/EN/HE)
      const isBuy     = /ACHETER|ACHAT|BUY|לקנות|קני/.test(v)
      const isSell    = /VENDRE|SELL|למכור|מכיר/.test(v)
      const isWait    = /ATTENDRE|WAIT|HOLD|להמתין|המתנ|להחזיק/.test(v)
      const isDevelop = /DÉVELOPPER|DEVELOPPER|DEVELOP|לפתח|פיתוח/.test(v)
      // Anciens statuts conservés pour compatibilité
      const isEx   = v.includes('EXCELLENT') || v.includes('מצוין')
      const isBon  = v.startsWith('BON') || v.includes('GOOD') || v.includes('טוב')
      const isMod  = /MODERE|MODERÉ|MODERATE|בינוני/.test(v)
      const isRisk = /RISQUE|RISKY|מסוכן|AVOID|ÉVITER|EVITER|להימנע/.test(v) && !isMod
      const bg = isBuy ? '#dcfce7' : isDevelop ? '#ede9fe' : isWait ? '#ffedd5' : isSell ? '#dbeafe'
               : isEx ? '#dcfce7' : isBon ? '#fef9c3' : isMod ? '#ffedd5' : isRisk ? '#fee2e2' : '#f1f5f9'
      const fg = isBuy ? '#15803d' : isDevelop ? '#6d28d9' : isWait ? '#c2410c' : isSell ? '#1d4ed8'
               : isEx ? '#15803d' : isBon ? '#a16207' : isMod ? '#c2410c' : isRisk ? '#b91c1c' : '#1A3A5C'
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
  const [showQuick, setShowQuick] = useState(false)
  const [quick, setQuick]         = useState<Record<string, string>>({})
  const [activeId, setActiveId]   = useState<string | null>(null)
  const abortRef  = useRef<AbortController | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const { t, lang } = useLang()
  const ta          = t.agent

  useEffect(() => { saveHistory(history) }, [history])

  // Pré-remplissage depuis NadlanConnect :
  // 1) paramètre URL `?prompt=...` au chargement
  // 2) postMessage { type: 'NADLAN_LISTING', prompt } depuis le site NadlanConnect
  useEffect(() => {
    if (window.location.search) {
      const urlPrompt = new URLSearchParams(window.location.search).get('prompt')
      if (urlPrompt) setInput(urlPrompt)
      // Nettoie l'URL : on retire la query string (params NadlanConnect)
      // tout en conservant le chemin et le hash (utilisé pour le partage).
      window.history.replaceState(null, '', window.location.pathname + window.location.hash)
    }

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://nadlan-connect.replit.app') return
      if (e.data?.type === 'NADLAN_LISTING' && typeof e.data.prompt === 'string') {
        setInput(e.data.prompt)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

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
      const M     = 16
      const maxW  = W - M * 2
      const NAVY  : [number,number,number] = [26, 58, 92]
      const GOLD  : [number,number,number] = [201, 168, 76]
      const GRAY  : [number,number,number] = [90, 90, 90]
      const BLACK : [number,number,number] = [33, 37, 41]
      const LINE  : [number,number,number] = [224, 224, 224]

      // Normalise le texte pour la police PDF (Helvetica/WinAnsi) : supprime les
      // glyphes non supportés (₪, puces unicode, espaces fines, signes maths…).
      const sanitize = (s: string) => s
        // Helvetica (WinAnsi) ne supporte pas l'hébreu : retire les parenthèses
        // contenant un terme hébreu (ex : "Mas Rechisha (מס רכישה)" -> "Mas Rechisha").
        .replace(/\s*\([^)]*[\u0590-\u05FF][^)]*\)/g, '')
        .replace(/\u20AA/g, ' NIS')
        .replace(/[\u202F\u00A0\u2007\u2008\u2009\u2006\u2005]/g, ' ')
        .replace(/\u2212/g, '-')
        .replace(/[\u2013\u2014]/g, '-')
        .replace(/[\u2018\u2019\u2032]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u25B8\u25BA\u2023\u2022\u25AA\u25CF\u25A0\u00AA\u00BA]/g, '-')
        .replace(/\u00D7/g, 'x')
        .replace(/\u2026/g, '...')
        .replace(/ {2,}/g, ' ')
        .trim()

      let y = 18
      const newPage = () => { doc.addPage(); y = 20 }
      const guard   = (h: number) => { if (y + h > 276) newPage() }

      // ── En-tête ──
      doc.setFillColor(...NAVY)
      doc.rect(0, 0, W, 24, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('RAPPORT D\'EVALUATION IMMOBILIERE  —  AGENT SHAMAI IA', M, 11)
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      doc.text(`Genere le ${new Date().toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' })}   ·   Estimation indicative (ne remplace pas un Shamai agree)`, M, 18)
      doc.setFillColor(...GOLD)
      doc.rect(0, 24, W, 1, 'F')
      y = 34

      // Découpe une ligne en segments normal / gras (**...**)
      const richSegs = (text: string) => text
        .split(/(\*\*[^*]+\*\*)/g)
        .filter(Boolean)
        .map(p => (p.startsWith('**') && p.endsWith('**'))
          ? { t: p.slice(2, -2), b: true }
          : { t: p, b: false })

      // Écrit du texte avec gras inline + retour à la ligne automatique
      const drawRich = (text: string, x: number, width: number, size: number, color: [number,number,number], gap = 4.4, guardFirst = true) => {
        doc.setFontSize(size)
        const words: { w: string; b: boolean }[] = []
        richSegs(sanitize(text)).forEach(s =>
          s.t.split(/(\s+)/).forEach(tok => { if (tok.length) words.push({ w: tok, b: s.b }) }))
        let cx = x
        if (guardFirst) guard(gap)
        for (const { w, b } of words) {
          doc.setFont('helvetica', b ? 'bold' : 'normal')
          const ww = doc.getTextWidth(w)
          if (cx + ww > x + width && cx > x) {
            y += gap; guard(gap); cx = x
            if (/^\s+$/.test(w)) continue
          }
          doc.setTextColor(...color)
          doc.text(w, cx, y + 3.2)
          cx += ww
        }
        y += gap
      }

      const lines = output.split('\n')
      let firstSection = true
      for (const rawLine of lines) {
        const line = rawLine.trim()
        if (!line)          { y += 1.8; continue }
        if (line === '---') { continue }

        // ── Titre de section : "## n. TITRE" ──
        if (line.startsWith('## ')) {
          y += firstSection ? 0 : 3
          firstSection = false
          guard(13)
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(10.5)
          doc.setTextColor(...NAVY)
          doc.text(sanitize(line.slice(3)).toUpperCase(), M, y + 4)
          doc.setDrawColor(...GOLD)
          doc.setLineWidth(0.5)
          doc.line(M, y + 6.4, M + maxW, y + 6.4)
          y += 11
          continue
        }

        if (line.startsWith('- ')) {
          const content = line.slice(2)

          // ── Carte Investment Score ──
          const scoreMatch = content.match(/^SCORE FINAL\s*:\s*(\d+)/i)
          if (scoreMatch) {
            const score = parseInt(scoreMatch[1])
            const band  = score >= 70 ? { bg: [232,245,233] as [number,number,number], fg: [27,94,32]  as [number,number,number] }
                        : score >= 45 ? { bg: [255,243,224] as [number,number,number], fg: [180,83,9]  as [number,number,number] }
                        :               { bg: [253,235,235] as [number,number,number], fg: [153,27,27] as [number,number,number] }
            guard(28)
            doc.setFillColor(...band.bg)
            doc.setDrawColor(...band.fg)
            doc.setLineWidth(0.4)
            doc.roundedRect(M, y, maxW, 23, 3, 3, 'FD')
            doc.setTextColor(...band.fg)
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(36)
            const sw = doc.getTextWidth(String(score))
            doc.text(String(score), M + 9, y + 16)
            doc.setFontSize(10)
            doc.text('/100', M + 9 + sw + 2, y + 16)
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(8)
            doc.setTextColor(...GRAY)
            doc.text('INVESTMENT SCORE', M + 52, y + 9.5)
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(15)
            doc.setTextColor(...band.fg)
            doc.text(scoreLabel(score, lang), M + 52, y + 17)
            y += 28
            continue
          }

          // ── Ligne clé : valeur ──
          const colonIdx = content.indexOf(':')
          if (colonIdx > 0 && colonIdx < 46 && !content.slice(0, colonIdx).includes('**')) {
            const k = sanitize(content.slice(0, colonIdx).trim())
            const v = sanitize(content.slice(colonIdx + 1).trim())
            if (v) {
              const wrapped = doc.splitTextToSize(v, maxW * 0.52)
              const h = Math.max(6.5, wrapped.length * 4.4 + 2)
              guard(h)
              doc.setFontSize(8.2)
              doc.setFont('helvetica', 'bold')
              doc.setTextColor(...NAVY)
              doc.text(k, M, y + 4)
              doc.setFont('helvetica', 'normal')
              const isGold = /\bNIS\b/.test(v)
              doc.setTextColor(isGold ? GOLD[0] : BLACK[0], isGold ? GOLD[1] : BLACK[1], isGold ? GOLD[2] : BLACK[2])
              doc.text(wrapped, W - M, y + 4, { align: 'right' })
              doc.setDrawColor(...LINE)
              doc.setLineWidth(0.2)
              doc.line(M, y + h - 0.8, W - M, y + h - 0.8)
              y += h
              continue
            }
          }

          // ── Puce enrichie (gras inline supporté) ──
          guard(5)                       // garantit que la puce et sa 1re ligne tiennent ensemble
          doc.setFillColor(...GOLD)
          doc.circle(M + 1.1, y + 1.6, 0.8, 'F')
          drawRich(content, M + 4.5, maxW - 4.5, 8.2, GRAY, 4.4, false)
          y += 1.2
          continue
        }

        // ── Sous-titre en capitales (ex : "DETAIL DU CALCUL :") ──
        if (line === line.toUpperCase() && /[A-Z]/.test(line) && line.length < 70) {
          y += 2
          guard(7)
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(8.2)
          doc.setTextColor(...NAVY)
          doc.text(sanitize(line.replace(/:$/, '')), M, y + 3.5)
          y += 6.5
          continue
        }

        // ── Paragraphe ──
        guard(5)
        drawRich(line, M, maxW, 8.2, BLACK)
        y += 1
      }

      // ── Annexe : annonce analysée (police réduite, en fin de document) ──
      if (input.trim()) {
        y += 5
        guard(16)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10.5)
        doc.setTextColor(...NAVY)
        doc.text('ANNEXE  —  DONNEES DU BIEN', M, y + 4)
        doc.setDrawColor(...GOLD)
        doc.setLineWidth(0.5)
        doc.line(M, y + 6.4, M + maxW, y + 6.4)
        y += 11
        const annex = doc.splitTextToSize(sanitize(input.trim()), maxW)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(7.4)
        doc.setTextColor(...GRAY)
        for (const ln of annex) { guard(4); doc.text(ln, M, y + 3); y += 4 }
      }

      // ── Pied de page ──
      const totalPages = (doc as jsPDF & { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setDrawColor(...LINE)
        doc.setLineWidth(0.2)
        doc.line(M, 288, W - M, 288)
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(160, 160, 160)
        doc.text('Simulateur Immobilier Israel   ·   Analyse indicative non contractuelle', M, 292)
        doc.text(`${i} / ${totalPages}`, W - M, 292, { align: 'right' })
      }

      doc.save(`rapport-shamai-${Date.now()}.pdf`)
    } finally {
      setPdfBusy(false)
    }
  }, [output, pdfBusy, input, lang])

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
    { label: ta.ex4, text: ta.ex4text },
  ]

  const QUICK_KEYS = ['ville', 'type', 'surface', 'etage', 'annee', 'etat', 'objectif'] as const

  const composeQuick = () => {
    const f = ta.quick.fields as Record<string, { label: string; ph: string }>
    const lines = QUICK_KEYS
      .filter(k => quick[k]?.trim())
      .map(k => `- ${f[k].label} : ${quick[k].trim()}`)
    if (lines.length === 0) return
    const free = input.trim()
    const msg = [
      ta.quick.intro,
      ...lines,
      free ? `\n${ta.quick.more} : ${free}` : '',
      `\n${ta.quick.reportLine}`,
    ].filter(Boolean).join('\n').trim()
    setInput(msg)
    setShowQuick(false)
  }

  return (
    <div className="space-y-5">

      {/* Compact header + main card */}
      <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>

        {/* Compact dark header */}
        <div style={{ background: '#0D1B3E', padding: '20px 32px' }}>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base shrink-0">🤖</span>
              <h2 className="text-white truncate" style={{ fontSize: 18, fontWeight: 500 }}>{ta.title}</h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowHistory(v => !v)}
                className="flex items-center gap-1.5 rounded-full transition-all"
                style={showHistory
                  ? { padding: '4px 12px', fontSize: 12, border: '0.5px solid #C9A84C', background: 'rgba(201,168,76,0.18)', color: '#C9A84C' }
                  : { padding: '4px 12px', fontSize: 12, border: '0.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
                <History size={12} />
                {ta.historyBtn}
                {history.length > 0 && (
                  <span className="font-semibold" style={{ color: showHistory ? '#C9A84C' : 'rgba(255,255,255,0.85)' }}>
                    {history.length}
                  </span>
                )}
              </button>
              <span className="hidden sm:inline-flex items-center rounded-full"
                style={{ padding: '4px 12px', fontSize: 12, border: '0.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
                {ta.poweredBy}
              </span>
            </div>
          </div>
          <p className="mt-1.5 leading-relaxed" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{ta.subtitle}</p>
        </div>

        {/* Main card body */}
        <div className="bg-white space-y-5" style={{ padding: 24 }}>

          {/* Examples */}
          <div>
            <p className="mb-2 uppercase" style={{ fontSize: 11, letterSpacing: '0.08em', color: '#9ca3af', fontWeight: 600 }}>{ta.examplesTitle}</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex, i) => (
                <button key={i} onClick={() => setInput(ex.text)}
                  className="rounded-full transition-colors bg-white hover:bg-[#FBF5E6] hover:text-[#0D1B3E]"
                  style={{ border: '0.5px solid rgba(0,0,0,0.12)', padding: '5px 14px', fontSize: 12, color: '#374151' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)' }}>
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick fields */}
          <div className="rounded-lg overflow-hidden" style={{ border: '0.5px solid rgba(0,0,0,0.12)' }}>
            <button
              onClick={() => setShowQuick(v => !v)}
              className="w-full flex items-center justify-between uppercase transition-colors"
              style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#6b7280' }}>
              <span className="flex items-center gap-2">
                <Sliders size={13} /> {ta.quick.title}
              </span>
              <ChevronDown size={14} className={`transition-transform ${showQuick ? 'rotate-180' : ''}`} />
            </button>
            {showQuick && (
              <div style={{ padding: '0 16px 16px' }}>
                <p className="mb-3" style={{ fontSize: 11, color: '#9ca3af' }}>{ta.quick.hint}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 10 }}>
                  {QUICK_KEYS.map(k => {
                    const f = (ta.quick.fields as Record<string, { label: string; ph: string }>)[k]
                    const fullWidth = k === 'objectif'
                    return (
                      <div key={k} className={`flex flex-col gap-1 ${fullWidth ? 'sm:col-span-2' : ''}`}>
                        <label className="uppercase" style={{ fontSize: 11, letterSpacing: '0.04em', fontWeight: 500, color: '#6b7280' }}>{f.label}</label>
                        <input
                          type="text"
                          value={quick[k] ?? ''}
                          onChange={e => setQuick(q => ({ ...q, [k]: e.target.value }))}
                          placeholder={f.ph}
                          className="rounded-lg focus:outline-none transition-colors"
                          style={{ background: '#F7F5F0', border: '0.5px solid rgba(0,0,0,0.12)', padding: '8px 10px', fontSize: 13 }}
                          onFocus={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.background = '#fff' }}
                          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.background = '#F7F5F0' }}
                        />
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={composeQuick}
                    className="flex items-center gap-1.5 rounded-lg font-semibold transition-all"
                    style={{ background: '#C9A84C', color: '#0D1B3E', padding: '8px 16px', fontSize: 12 }}>
                    <ChevronRight size={13} /> {ta.quick.compose}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main textarea */}
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) analyze() }}
            placeholder={ta.placeholder}
            disabled={loading}
            className="w-full rounded-[10px] focus:outline-none transition-colors"
            style={{ minHeight: 140, padding: '14px 16px', border: '0.5px solid rgba(0,0,0,0.12)', background: '#fff', fontSize: 14, lineHeight: 1.6, color: '#1e293b', resize: 'vertical', fontFamily: 'inherit' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#C9A84C' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)' }}
          />

          {/* Bottom action row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <button onClick={handleClear}
              className="flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              style={{ fontSize: 13, color: '#9ca3af', background: 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#374151' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af' }}>
              <Trash2 size={13} /> {ta.clear}
            </button>
            <span className="hidden sm:inline-flex items-center self-center"
              style={{ fontSize: 11, background: '#F0EDE6', borderRadius: 4, padding: '2px 6px', color: '#9ca3af' }}>
              Ctrl+Enter
            </span>
            <button onClick={analyze} disabled={loading || !input.trim()}
              className="flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              style={{ background: loading ? '#cbb878' : '#C9A84C', color: '#0D1B3E', padding: '10px 22px', fontSize: 14 }}
              onMouseEnter={e => { if (!loading && input.trim()) e.currentTarget.style.background = '#b8963e' }}
              onMouseLeave={e => { e.currentTarget.style.background = loading ? '#cbb878' : '#C9A84C' }}>
              {loading
                ? <><Loader2 size={14} className="animate-spin" /> {ta.submitting}</>
                : <><Send size={14} /> {ta.submit}</>
              }
            </button>
          </div>
        </div>
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

      <p className="text-center leading-relaxed pb-2" style={{ fontSize: 12, color: '#9ca3af', marginTop: 16 }}>{ta.disclaimer}</p>
    </div>
  )
}
