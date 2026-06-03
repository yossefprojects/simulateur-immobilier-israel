---
name: AgentTab renderer & PDF marker dependencies
description: The AI Agent tab's custom output renderer and PDF export depend on exact literal markers in the model's report — any prompt change must preserve them.
---

# AgentTab renderer / PDF marker contract

`src/components/AgentTab.tsx` does NOT use react-markdown. It has a bespoke
parser/renderer (`RenderOutput`) plus a jsPDF exporter, both of which key off
literal text the model is told to emit. Changing the system prompt without
keeping these markers silently breaks rendering.

**Hard constraints (any prompt edit must keep these):**
- Report body uses `## N. TITLE` sections + `- Key : Value` rows. **No markdown
  tables, no emoji.** Tables are rendered as key/value cards, not `<table>`.
- The mini score card requires a line `SCORE FINAL :` whose value is exactly
  `X/100` (no spaces inside) — `scorePartMatch` won't match otherwise.
- The final recommendation block requires a `Statut :` row whose value is one of
  the recognized statuses (ACHETER/VENDRE/ATTENDRE/DÉVELOPPER + EN/HE equivalents
  + legacy). The status->color map lives in the `statut` block.
- Section index drives colors and gold-value styling: score styling on section 6,
  finance gold values on sections [2,4,5,6]. Renumbering sections in the prompt
  shifts the coloring.

**Why:** Renderer and PDF are tightly coupled to the prompt's output format; the
spec required keeping the existing PDF logic, so the Shamai prompt was adapted to
this format rather than swapping in a markdown lib.

**PDF / Hebrew:** jsPDF Helvetica is WinAnsi-only and cannot render Hebrew. The
`sanitize()` step strips parentheticals containing Hebrew
(`/\s*\([^)]*[\u0590-\u05FF][^)]*\)/g`) and maps `₪`→`NIS`. HE-language PDFs were
already unsupported (pre-existing limitation), only FR/EN PDFs render cleanly.

**i18n shape:** the `Translations` type is derived from the `fr` object, so FR/EN/HE
`agent` blocks (incl. the nested `quick.fields`) must stay structurally identical
or `tsc` fails.
