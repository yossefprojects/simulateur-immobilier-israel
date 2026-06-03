# Prompt Replit — Refonte de la page d'accueil

## Objectif

Transformer la page d'accueil actuelle en une vraie landing page professionnelle.
L'utilisateur doit comprendre en 3 secondes ce que fait le site et savoir par où commencer.

**Ne touche à aucun onglet existant.**
Modifie uniquement : le header, la bannière de marché, et ajoute un bloc hero + grille d'accès rapide avant les onglets.

---

## MODIFICATION 1 — Bannière de marché : 3 lignes → 1 ligne

### Actuellement
La bannière de marché prend 3 lignes au-dessus du header.

### À faire
Réduire à **une seule ligne horizontale compacte**, intégrée directement dans le header existant (ou juste au-dessus, hauteur max 24px).

```jsx
// Remplace le composant MarketBanner actuel par :
function MarketBanner() {
  return (
    <div style={{
      background: '#0A1628',
      padding: '4px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      overflowX: 'auto',
      fontSize: 11,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ color: '#6B7280' }}>
        📊 <span style={{ color: '#85B7EB' }}>Marché au {MARKET_DATA.derniereMAJ}</span>
      </span>
      <span style={{ color: '#6B7280' }}>
        BOI <strong style={{ color: '#C9A84C' }}>{MARKET_DATA.tauxBOI}%</strong>
      </span>
      <span style={{ color: '#6B7280' }}>
        Hypo <strong style={{ color: '#C9A84C' }}>{MARKET_DATA.tauxHypo}%</strong>
      </span>
      <span style={{ color: '#6B7280' }}>
        CBS <strong style={{ color: '#C9A84C' }}>{MARKET_DATA.indiceCSB}</strong>
      </span>
      <span style={{ color: MARKET_DATA.evol12mois > 0 ? '#0F6E56' : '#993C1D' }}>
        {MARKET_DATA.evol12mois > 0 ? '▲' : '▼'}{Math.abs(MARKET_DATA.evol12mois)}% / 12 mois
      </span>
    </div>
  )
}
```

---

## MODIFICATION 2 — Déplacer les boutons PDF / XLS / Sauvegarder

Les boutons **Sauvegarder**, **Historique**, **XLS** et **PDF** ne doivent plus s'afficher sur la page d'accueil.

### À faire
- Retire ces boutons du header / zone principale de la page d'accueil
- Garde uniquement les boutons **FR / EN / עב** dans le header
- Remets PDF et XLS dans chaque onglet résultat (en bas de la colonne droite, après les résultats)
- Remets Sauvegarder et Historique dans un menu discret (icône ··· ou engrenage) en haut à droite

---

## MODIFICATION 3 — Bloc Hero (NOUVEAU — avant les onglets)

Insère ce bloc **entre le header et les onglets de navigation**.
Il s'affiche uniquement sur la page d'accueil (avant que l'utilisateur ait interagi).
Une fois qu'un onglet est sélectionné, ce bloc peut se replier ou rester visible selon l'espace disponible.

```jsx
// src/components/HeroSection.jsx  — nouveau fichier à créer

export function HeroSection({ onCTA }) {
  return (
    <div style={{
      background: 'linear-gradient(160deg, #0F2235 0%, #1A3A5C 100%)',
      padding: '32px 24px 28px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Skyline SVG en arrière-plan */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none'
      }}>
        <svg width="100%" height="100%" viewBox="0 0 800 140"
          preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
          <rect x="0"   y="60"  width="60"  height="80" fill="white"/>
          <rect x="70"  y="30"  width="90"  height="110" fill="white"/>
          <rect x="170" y="50"  width="60"  height="90" fill="white"/>
          <rect x="240" y="15"  width="80"  height="125" fill="white"/>
          <rect x="330" y="40"  width="70"  height="100" fill="white"/>
          <rect x="410" y="25"  width="100" height="115" fill="white"/>
          <rect x="520" y="45"  width="65"  height="95" fill="white"/>
          <rect x="595" y="10"  width="90"  height="130" fill="white"/>
          <rect x="695" y="55"  width="105" height="85" fill="white"/>
        </svg>
      </div>

      {/* Eyebrow */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'rgba(201, 168, 76, 0.15)',
        border: '1px solid rgba(201, 168, 76, 0.3)',
        borderRadius: 20,
        padding: '4px 12px',
        marginBottom: 16,
      }}>
        <span style={{ fontSize: 14 }}>🇮🇱</span>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#C9A84C',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Marché immobilier israélien
        </span>
      </div>

      {/* Titre principal */}
      <h1 style={{
        fontFamily: "'DM Serif Display', Georgia, serif",
        fontSize: 'clamp(22px, 5vw, 34px)',
        fontWeight: 400,
        color: 'white',
        lineHeight: 1.25,
        marginBottom: 12,
        position: 'relative',
      }}>
        Estimez, investissez,<br />
        <span style={{ color: '#C9A84C' }}>développez en Israël</span>
      </h1>

      {/* Sous-titre */}
      <p style={{
        fontSize: 13,
        color: '#85B7EB',
        lineHeight: 1.6,
        marginBottom: 20,
        maxWidth: 480,
        margin: '0 auto 20px',
        position: 'relative',
      }}>
        Valorisation au m² · Potentiel urbanistique · Bilan promoteur · Fiscalité
        <br />
        <span style={{ fontSize: 11, opacity: 0.7 }}>
          Basé sur les données Nadlan Gov, CBS et BOI — mis à jour 2025
        </span>
      </p>

      {/* CTA principal */}
      <button
        onClick={onCTA}
        style={{
          background: '#C9A84C',
          color: '#0F2235',
          border: 'none',
          borderRadius: 24,
          padding: '12px 28px',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 24,
          boxShadow: '0 4px 20px rgba(201, 168, 76, 0.35)',
          position: 'relative',
        }}
      >
        Estimer un bien
        <span style={{ fontSize: 16 }}>→</span>
      </button>

      {/* Chiffres de réassurance */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'clamp(16px, 4vw, 40px)',
        position: 'relative',
      }}>
        {[
          { val: '50 000+', lbl: 'transactions Nadlan' },
          { val: '10 villes', lbl: 'couvertes' },
          { val: '6 outils', lbl: 'intégrés' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#C9A84C' }}>
              {s.val}
            </div>
            <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>
              {s.lbl}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
```

### Intégration dans App.jsx

```jsx
import { HeroSection } from './components/HeroSection'

// Dans le JSX, entre le header et les onglets :
<HeroSection onCTA={() => setActive('estimation')} />
```

---

## MODIFICATION 4 — Grille d'accès rapide (NOUVEAU — sur l'onglet Estimation)

Ajoute cette grille **en haut de l'onglet Estimation**, avant le formulaire.
Elle sert de raccourci vers les 4 autres outils pour les utilisateurs qui arrivent directement.

```jsx
// En haut du composant EstimationTab (ou de la page principale), ajoute :

function QuickAccess({ onNavigate }) {
  const items = [
    {
      icon: '🏢',
      title: 'Estimer un bien',
      sub: 'Prix au m² · Coefficients marché',
      tab: 'estimation',
      active: true,
    },
    {
      icon: '📈',
      title: 'Analyser l\'investissement',
      sub: 'TRI · Cash-flow · Rendement',
      tab: 'investisseur',
      active: false,
    },
    {
      icon: '🏗️',
      title: 'Bilan promoteur',
      sub: 'Marge · CA · Sensibilité ±15%',
      tab: 'promoteur',
      active: false,
    },
    {
      icon: '⚖️',
      title: 'Fiscalité',
      sub: 'Mas Rechisha · Mas Shevach · Olim',
      tab: 'fiscalite',
      active: false,
    },
    {
      icon: '🔨',
      title: 'Travaux',
      sub: 'Coût rénovation · Dévis auto',
      tab: 'travaux',
      active: false,
    },
    {
      icon: '🗺️',
      title: 'Potentiel urbanistique',
      sub: 'TAMA 38 · Pinouï-Binouï · Score',
      tab: 'urbanisme',
      active: false,
    },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: 10,
      marginBottom: 24,
    }}>
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => onNavigate(item.tab)}
          style={{
            background: item.active ? '#1A3A5C' : 'white',
            border: item.active ? 'none' : '1px solid #E5E7EB',
            borderRadius: 10,
            padding: '12px 10px',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            if (!item.active) e.currentTarget.style.borderColor = '#C9A84C'
          }}
          onMouseLeave={e => {
            if (!item.active) e.currentTarget.style.borderColor = '#E5E7EB'
          }}
        >
          <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
          <div style={{
            fontSize: 12,
            fontWeight: 600,
            color: item.active ? 'white' : '#1A3A5C',
            marginBottom: 3,
          }}>
            {item.title}
          </div>
          <div style={{
            fontSize: 10,
            color: item.active ? '#85B7EB' : '#6B7280',
            lineHeight: 1.4,
          }}>
            {item.sub}
          </div>
        </button>
      ))}
    </div>
  )
}
```

---

## MODIFICATION 5 — Header : simplification

Le header actuel contient trop d'éléments. Garde uniquement l'essentiel :

```jsx
// Header simplifié
<header style={{
  background: '#1A3A5C',
  padding: '0 24px',
  height: 52,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  boxShadow: '0 1px 8px rgba(0,0,0,0.2)',
}}>

  {/* Logo + Titre */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    {/* Icône SVG logo (voir prompt REPLIT_ILLUSTRATIONS_PROMPT.md) */}
    <svg width="28" height="28" viewBox="0 0 52 52" fill="none">
      <rect width="52" height="52" rx="10" fill="#C9A84C"/>
      <rect x="13" y="8" width="26" height="36" rx="2" fill="#0F2235"/>
      <rect x="17" y="13" width="7" height="7" rx="1" fill="#C9A84C"/>
      <rect x="28" y="13" width="7" height="7" rx="1" fill="#C9A84C"/>
      <rect x="17" y="23" width="7" height="7" rx="1" fill="#C9A84C"/>
      <rect x="28" y="23" width="7" height="7" rx="1" fill="#C9A84C"/>
      <rect x="17" y="33" width="7" height="7" rx="1" fill="#C9A84C" opacity=".5"/>
      <rect x="28" y="33" width="7" height="7" rx="1" fill="#C9A84C" opacity=".5"/>
      <polyline points="5,47 13,42 21,44.5 30,39 47,43"
        stroke="#0F2235" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".5"/>
    </svg>
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
        Simulateur Immobilier
      </div>
      <div style={{ fontSize: 10, color: '#85B7EB', lineHeight: 1.2 }}>Israël</div>
    </div>
  </div>

  {/* Droite : langues uniquement */}
  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
    {['FR', 'EN', 'עב'].map(l => (
      <button
        key={l}
        onClick={() => setLangue(l)}
        style={{
          padding: '4px 10px',
          borderRadius: 6,
          border: langue === l ? 'none' : '1px solid rgba(255,255,255,0.2)',
          background: langue === l ? 'white' : 'transparent',
          color: langue === l ? '#1A3A5C' : 'rgba(255,255,255,0.6)',
          fontSize: 12,
          fontWeight: langue === l ? 700 : 400,
          cursor: 'pointer',
        }}
      >
        {l}
      </button>
    ))}

    {/* Menu secondaire (icône ···) */}
    <button
      style={{
        marginLeft: 8,
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        borderRadius: 6,
        padding: '4px 8px',
        color: 'white',
        cursor: 'pointer',
        fontSize: 14,
      }}
      title="Menu"
    >
      ···
    </button>
  </div>

</header>
```

Le menu **···** ouvre un dropdown avec : Sauvegarder · Historique · Exporter PDF · Exporter XLS.

---

## STRUCTURE FINALE DE LA PAGE

```
┌──────────────────────────────────────────┐
│  MARKET TICKER (1 ligne, 24px)           │  ← compact
├──────────────────────────────────────────┤
│  HEADER (logo + titre + langues + ···)   │  ← sticky, 52px
├──────────────────────────────────────────┤
│                                          │
│  HERO SECTION                            │  ← NOUVEAU
│  • Titre + sous-titre + CTA             │
│  • 3 chiffres de réassurance            │
│  • Skyline SVG en fond semi-transparent │
│                                          │
├──────────────────────────────────────────┤
│  ONGLETS DE NAVIGATION (6 onglets)       │  ← existants
├──────────────────────────────────────────┤
│                                          │
│  CONTENU DE L'ONGLET ACTIF              │
│  (Estimation par défaut)                │
│                                          │
│  En haut : grille accès rapide 2×3      │  ← NOUVEAU
│  Puis : formulaire + résultats          │  ← existant
│                                          │
└──────────────────────────────────────────┘
```

---

## FICHIERS À CRÉER / MODIFIER

| Fichier | Action |
|---|---|
| `src/components/HeroSection.jsx` | Créer |
| `src/App.jsx` | Header simplifié + intégration HeroSection |
| `src/components/EstimationTab.jsx` | Ajouter QuickAccess en haut |
| `src/components/MarketBanner.jsx` | Réduire à 1 ligne |

---

## CHECKLIST DE VALIDATION

- [ ] Bannière marché : 1 seule ligne, max 24px de hauteur
- [ ] Header : logo + titre + langues + menu ···
- [ ] Hero visible immédiatement sans scroller
- [ ] CTA "Estimer un bien →" navigue vers l'onglet Estimation
- [ ] 3 chiffres de réassurance sous le CTA
- [ ] Grille 2×3 visible en haut de l'onglet Estimation
- [ ] Boutons PDF/XLS visibles uniquement dans les onglets résultats
- [ ] Sur mobile : tout est lisible sans zoom, CTA cliquable facilement
