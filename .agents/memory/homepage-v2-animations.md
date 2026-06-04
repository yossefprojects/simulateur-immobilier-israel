---
name: Homepage V2 animation system
description: How the animated homepage is built and the constraints that must hold when touching it
---

# Homepage V2 (modern animated landing)

Animations live ONLY on the home view (`active === 'home'`): hero, tools grid, dark sources section. Calculator tool tabs must stay visually/functionally INTACT — never apply these animations to tool panes.

**Building blocks**
- CSS keyframes + `.reveal` / `.reveal-left` / `.reveal-right` scroll-reveal classes in `src/index.css`, with a `prefers-reduced-motion` guard that disables all of them.
- `useScrollReveal(deps)` hook (`src/hooks/useScrollReveal.ts`) wires an IntersectionObserver to elements with those classes. Called in `App.tsx` as `useScrollReveal([active, lang])` so reveals re-arm when returning to home or switching FR/EN/HE (DOM is re-rendered then).
- `HeroSection.tsx` exports `HeroSection`, `QuickAccess`, and `HomeSources`. Home renders full-bleed (outside the `max-w-5xl` container); the light `Footer` is hidden on home and replaced by `HomeSources`.
- Sticky header gets a glassmorphism state via a `scrolled` flag (scrollY > 24) in `App.tsx`.

**Why no external video:** chose local stock photo + CSS Ken Burns (`.kenburns-img`) + gold particles instead of an external `<video>` URL — reliable, no broken-URL risk. Hero photo is `public/hero-telaviv.jpg` (night Tel Aviv skyline, warm/gold tones matching the palette).

**i18n/RTL:** all visible strings come from `t.home.*` / `t.footer.*` / `t.tabs.*`. Direction via `t.dir === 'rtl'` → flip `textAlign`, row direction, and arrow rotation. Source brand names kept language-neutral (`Nadlan Gov`, `CBS`, `GovMap`, `Mavat`) — do NOT reintroduce locale-specific spellings like "CBS Israël".
