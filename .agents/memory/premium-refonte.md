---
name: Premium refonte design
description: Full design overhaul decisions and constraints for the Israel real estate simulator
---

## Colors & Fonts
- Primary: `#1A3A5C` (dark navy blue) — header, active tab border uses `#C9A84C` (gold)
- Gold: `#C9A84C` — active tab underline, PDF button, chart accents
- Neutral-50: `#F8F7F4` — page background
- DM Serif Display (`font-display` class) — big numbers only (MetricCard, ResultBox, ScoreRing)
- Plus Jakarta Sans — all body text
- Both fonts loaded via Google Fonts in `index.html`

## Key Architecture
- 5 tabs: estimation / urbanisme / investisseur / promoteur / fiscalite
- All 5 tabs always mounted (hidden divs) so reportStore stays populated for PDF/Excel
- Tab banners: inline React JSX SVG components (BannerEstimation, etc.) defined in App.tsx
- MarketBanner above header, Footer at bottom

## JSX / TypeScript Gotchas
- Hebrew `ממ"ד` inside JSX string attributes: use template literal `{``...ממ"ד...``}` NOT `\"` inside double-quoted attribute (causes babel parse error)
- Recharts `Tooltip formatter` requires `(v: unknown) => [...]` cast — do `(v) => [(v as number).toLocaleString() + ...]`
- `DataTable` accent prop type is `'pos'|'neg'|'none'` literal — when building rows from `.map()` spread, add `as const` to each accent literal to avoid string widening

## Packages
- recharts + react-is (peer dep, must install both) + xlsx — all in dependencies
- Install: `npm install react-is recharts xlsx --legacy-peer-deps`

## New Files
- `src/components/FiscaliteTab.tsx` — Mas Rechisha/Shevach/Arnona/Olim calculators (pure local state)
- `src/components/Tooltip.tsx` — contextual ⓘ tooltip component
- `src/components/MarketBanner.tsx` — market data ticker bar
- `src/components/Footer.tsx` — Nadlan/CBS/GovMap/Mavat sources footer
- `src/utils/scenarios.ts` — localStorage key `immo_israel_scenarios`, max 10 entries
- `src/utils/shareUrl.ts` — hash-based URL sharing
- `src/utils/exportExcel.ts` — XLSX export using xlsx package

## Translations
- `fiscalite` key added to `tabs` object in all 3 languages (FR/EN/HE) in `translations.ts`
- FiscaliteTab is purely local state (no global hook, no reportStore registration)

**Why:** The app needed a premium professional look to match Israeli real estate market standards. All decisions were made for consistency — DM Serif only for numbers, gold only for interactive accents.
