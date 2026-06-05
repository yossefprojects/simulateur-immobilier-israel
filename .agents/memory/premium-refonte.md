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
- 7 tabs: estimation / urbanisme / investisseur / promoteur / fiscalite / travaux / agent
- `active` state is `View = Tab | 'home'`; default is `'home'` (a landing view, NOT a tab)
- Home view renders `HeroSection` + `QuickAccess` (src/components/HeroSection.tsx); CTA + grid cards call setActive(tab) to enter tools. Clicking the header logo returns to 'home'.
- All tab panels stay mounted (hidden divs) even on 'home' so reportStore stays populated for PDF/Excel; the per-tab SVG banner only renders when `active !== 'home'`.
- Header has: clickable logo (→home), Globe+language selector, and a kebab (MoreVertical) dropdown with Save/History/XLS/PDF (replaced the old standalone action bar).
- MarketBanner = single compact dark line (#0F2235 bg, gold values) above header; Footer at bottom.
- Tab banners: inline React JSX SVG components (BannerEstimation, etc.) defined in App.tsx

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

## Full-site visual refonte (cascade approach)
- Site-wide restyle is done by editing the SHARED primitives in `src/components/ui.tsx` (SliderField/NumberField/SelectField/MetricCard/SectionTitle/ResultBox/DataTable) while keeping prop APIs identical — every tab inherits the new look with ZERO change to calculation logic. Prefer this over rewriting each tab.
- **Range slider gold fill:** global CSS paints `input[type=range]` track via `linear-gradient(... var(--val,50%) ...)`. Any range input MUST set `style={{ ['--val']: pct% }}` or it shows a misleading 50% fill. `SliderField` does this automatically; raw `<input type="range">` that bypass SliderField (FinanceTab x2, UrbanismeTab) set `--val` inline.
- Footer is ONE shared dark 3-col `Footer.tsx` (i18n + `onNavigate` prop wired to `setActive`), rendered on ALL views incl. home. The old home-only `HomeSources` was removed to avoid duplication. Footer column headers use new i18n keys `footer.tools/sources/tagline` (present in all 3 langs).
- `bannerSub` literals in App.tsx are hardcoded FR/EN/HE strings — pre-existing, left as-is (not part of the visual refonte scope).

## AI Agent page (/agent) bespoke design
- The agent tab intentionally has NO decorative SVG banner: App.tsx gates it with `active !== 'home' && active !== 'agent'`. AgentTab renders its OWN compact dark header (`#0D1B3E`) instead. Don't re-enable the banner for agent.
- Active "AI Agent" nav tab uses a solid gold PILL (`background #C9A84C`, `color #0D1B3E`, rounded, `borderBottomColor transparent`) — only in the `isAgent && isActive` branch; other tabs keep the gold-underline style. Inactive agent tab keeps its cream/amber look.
- AgentTab layout: one white "main card" (`0.5px` border, radius 12, padding 24) holding examples chips + quick-fields accordion + textarea + action row; History pill + "Claude · Replit AI" badge live in the dark header. Disclaimer sits below the card. Spec source: `attached_assets/REPLIT_SIMMOISRAEL_FULLSITE_PROMPT_*` agent-page redesign prompt.

**Why:** The app needed a premium professional look to match Israeli real estate market standards. All decisions were made for consistency — DM Serif only for numbers, gold only for interactive accents.
