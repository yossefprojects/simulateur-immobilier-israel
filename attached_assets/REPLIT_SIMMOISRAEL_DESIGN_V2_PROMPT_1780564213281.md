# Prompt Replit — Refonte design simmoisrael.com
# Design moderne, animé, sophistiqué — sans casser les outils

## Règle principale

Ce site est un simulateur (outil de calcul). Les animations s'appliquent
UNIQUEMENT à la page d'accueil (hero + grille d'accès rapide + footer).
Les onglets de calcul (Valuation, Investor analysis, etc.) restent intacts —
les formulaires et résultats ne sont pas touchés.

---

## INSTALL

```bash
npm install framer-motion
```

Ajouter dans `index.html` :
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

---

## MODIFICATION 1 — CSS global animé

Dans `src/index.css`, ajoute ces animations SANS toucher aux styles existants :

```css
/* ── Animations globales ── */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.7); }
}
@keyframes bounce-scroll {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(8px); }
}
@keyframes shimmer-gold {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes slide-in-left {
  from { opacity: 0; transform: translateX(-48px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(48px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes count-up {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ── Scroll reveal ── */
.reveal {
  opacity: 0;
  transform: translateY(36px);
  transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1),
              transform 0.65s cubic-bezier(0.16,1,0.3,1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
.reveal-left {
  opacity: 0;
  transform: translateX(-36px);
  transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1),
              transform 0.65s cubic-bezier(0.16,1,0.3,1);
}
.reveal-left.visible { opacity: 1; transform: translateX(0); }
.reveal-right {
  opacity: 0;
  transform: translateX(36px);
  transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1),
              transform 0.65s cubic-bezier(0.16,1,0.3,1);
}
.reveal-right.visible { opacity: 1; transform: translateX(0); }
```

---

## MODIFICATION 2 — Hook useScrollReveal

Crée `src/hooks/useScrollReveal.js` :

```javascript
import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    if (!els.length) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.12 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
```

---

## MODIFICATION 3 — NAVBAR : glassmorphism au scroll

Trouve le composant Header/Navbar existant.
Ajoute cet effet sans changer la structure :

```jsx
// Ajoute ce state et cet effet dans le composant Navbar existant
const [scrolled, setScrolled] = useState(false)

useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 50)
  window.addEventListener('scroll', onScroll)
  return () => window.removeEventListener('scroll', onScroll)
}, [])

// Sur le <nav> ou <header> existant, ajoute ces styles conditionnels :
style={{
  // ... styles existants conservés ...
  backdropFilter: scrolled ? 'blur(20px)' : 'none',
  boxShadow: scrolled ? '0 1px 0 rgba(201,168,76,0.2)' : 'none',
  transition: 'backdrop-filter 0.3s, box-shadow 0.3s',
}}
```

---

## MODIFICATION 4 — HERO : vidéo de fond + particules + animations

Trouve le composant hero/bannière existant (la section avec
"Estimate, invest, develop in Israel").

**Remplace son contenu** par ceci — en conservant le même
bouton CTA et les liens existants :

```jsx
function HeroSection({ onEstimate }) {
  return (
    <section style={{
      position: 'relative',
      minHeight: '92vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>

      {/* ── Vidéo de fond ── */}
      <video
        autoPlay muted loop playsInline
        poster="https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=1200&q=80"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', zIndex: 0,
        }}
      >
        {/*
          Vidéo libre de droits recommandée :
          https://www.pexels.com/video/aerial-view-of-city-buildings-3571264/
          Télécharge-la et place-la dans /public/hero-tlv.mp4
          OU utilise directement l'URL Pexels si elle fonctionne
        */}
        <source src="/hero-tlv.mp4" type="video/mp4" />
      </video>

      {/* ── Overlay gradient ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: `
          linear-gradient(
            to bottom,
            rgba(10,22,40,0.55) 0%,
            rgba(10,22,40,0.70) 40%,
            rgba(10,22,40,0.88) 100%
          )
        `,
      }} />

      {/* ── Particules dorées flottantes ── */}
      {Array.from({ length: 24 }).map((_, i) => {
        const size  = 1.5 + Math.random() * 2.5
        const delay = Math.random() * 4
        const dur   = 3 + Math.random() * 5
        return (
          <div key={i} style={{
            position: 'absolute',
            width:  size + 'px',
            height: size + 'px',
            borderRadius: '50%',
            background: '#C9A84C',
            left:    Math.random() * 100 + '%',
            top:     Math.random() * 100 + '%',
            opacity: 0.15 + Math.random() * 0.45,
            zIndex: 2,
            animation: `float ${dur}s ease-in-out ${delay}s infinite`,
          }} />
        )
      })}

      {/* ── Contenu ── */}
      <div style={{
        position: 'relative', zIndex: 3,
        textAlign: 'center',
        padding: '0 24px',
        maxWidth: 780,
        margin: '0 auto',
      }}>

        {/* Badge animé */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center', gap: 8,
          background: 'rgba(201,168,76,0.12)',
          border: '1px solid rgba(201,168,76,0.35)',
          borderRadius: 24,
          padding: '5px 16px',
          marginBottom: 24,
          animation: 'fadeInDown 0.7s ease forwards',
        }}>
          <span style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: '#C9A84C',
            animation: 'pulse-dot 2s infinite',
          }} />
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: '#C9A84C',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            🇮🇱 Israeli Real Estate Market
          </span>
        </div>

        {/* Titre */}
        <h1 style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: 'clamp(38px, 7vw, 70px)',
          fontWeight: 400,
          color: 'white',
          lineHeight: 1.1,
          marginBottom: 18,
          animation: 'fadeInUp 0.9s ease 0.15s both',
        }}>
          Estimate, invest,<br />
          <span style={{
            background: 'linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer-gold 3s linear infinite',
          }}>
            develop in Israel
          </span>
        </h1>

        {/* Sous-titre */}
        <p style={{
          fontSize: 'clamp(14px, 2vw, 17px)',
          color: 'rgba(255,255,255,0.65)',
          lineHeight: 1.7,
          marginBottom: 14,
          animation: 'fadeInUp 0.9s ease 0.3s both',
        }}>
          Price per m² · Urban potential · Developer P&L · Taxation
        </p>
        <p style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.35)',
          marginBottom: 36,
          letterSpacing: '0.03em',
          animation: 'fadeInUp 0.9s ease 0.4s both',
        }}>
          Based on Nadlan Gov, CBS and BOI data — updated 2025
        </p>

        {/* CTA */}
        <div style={{
          display: 'flex', gap: 14,
          justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'fadeInUp 0.9s ease 0.5s both',
          marginBottom: 56,
        }}>
          <button
            onClick={onEstimate}
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
              color: '#0A1628',
              border: 'none',
              borderRadius: 50,
              padding: '14px 36px',
              fontSize: 15, fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(201,168,76,0.45)',
              transition: 'transform 0.25s, box-shadow 0.25s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 14px 40px rgba(201,168,76,0.55)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(201,168,76,0.45)'
            }}
          >
            Estimate a property →
          </button>

          <a href="https://nadlan-connect.replit.app" target="_blank" style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 50,
            padding: '14px 28px',
            fontSize: 14, fontWeight: 600,
            textDecoration: 'none',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'
            e.currentTarget.style.background = 'rgba(201,168,76,0.08)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
          }}
          >
            🏗️ NadlanConnect →
          </a>
        </div>

        {/* Stats 3 chiffres */}
        <div style={{
          display: 'flex', gap: 48,
          justifyContent: 'center',
          animation: 'fadeInUp 0.9s ease 0.7s both',
        }}>
          {[
            { val: '50K+', lbl: 'Nadlan transactions' },
            { val: '12',   lbl: 'Cities covered' },
            { val: '7',    lbl: 'Tools integrated' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 30, color: '#C9A84C', lineHeight: 1,
              }}>{s.val}</div>
              <div style={{
                fontSize: 10, color: 'rgba(255,255,255,0.4)',
                marginTop: 4, letterSpacing: '0.06em',
              }}>{s.lbl}</div>
            </div>
          ))}
        </div>

      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%',
        zIndex: 3,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 6,
        animation: 'bounce-scroll 2.5s infinite',
      }}>
        <span style={{
          fontSize: 9, color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.14em', textTransform: 'uppercase',
        }}>scroll</span>
        <div style={{
          width: 1, height: 36,
          background: 'linear-gradient(to bottom, rgba(201,168,76,0.5), transparent)',
        }} />
      </div>

    </section>
  )
}
```

---

## MODIFICATION 5 — GRILLE D'ACCÈS RAPIDE : cartes animées

Trouve la grille des 6 outils (Valuation, Investor analysis, etc.).
Remplace les cartes statiques par ceci :

```jsx
function ToolsGrid({ onNavigate }) {
  const tools = [
    {
      emoji: '🏢',
      title: 'Valuation',
      sub: 'Price/m² · Market coefficients',
      tab: 'estimation',
      color: '#1A3A5C',
    },
    {
      emoji: '📈',
      title: 'Investor analysis',
      sub: 'IRR · Cash-flow · Yield',
      tab: 'investisseur',
      color: '#0F6E56',
    },
    {
      emoji: '🏗️',
      title: 'Developer P&L',
      sub: 'Margin · Revenue · Sensitivity ±15%',
      tab: 'promoteur',
      color: '#C9A84C',
    },
    {
      emoji: '⚖️',
      title: 'Taxation',
      sub: 'Purchase tax · Capital gains · Olim',
      tab: 'fiscalite',
      color: '#7F77DD',
    },
    {
      emoji: '🔨',
      title: 'Renovation costs',
      sub: 'Renovation cost · Auto quote',
      tab: 'travaux',
      color: '#BA7517',
    },
    {
      emoji: '🗺️',
      title: 'Urban potential',
      sub: 'TAMA 38 · Pinui-Binui · Score',
      tab: 'urbanisme',
      color: '#2A5080',
    },
  ]

  return (
    <section style={{
      padding: '80px 24px 100px',
      background: '#F8F7F4',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Titre section */}
        <div className="reveal" style={{
          textAlign: 'center', marginBottom: 52,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700,
            color: '#C9A84C', letterSpacing: '0.14em',
            textTransform: 'uppercase', marginBottom: 10,
          }}>
            Professional tools
          </div>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(26px, 4vw, 42px)',
            color: '#0A1628', fontWeight: 400,
          }}>
            Choose your tool
          </h2>
        </div>

        {/* Grille 3×2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {tools.map((tool, i) => (
            <ToolCard
              key={i}
              tool={tool}
              delay={i * 0.08}
              onClick={() => onNavigate(tool.tab)}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

function ToolCard({ tool, delay, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="reveal"
      style={{ transitionDelay: `${delay}s` }}
    >
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          background: hovered ? '#0A1628' : 'white',
          border: hovered
            ? `1.5px solid ${tool.color}`
            : '1px solid #E2E8F0',
          borderRadius: 16,
          padding: '28px 24px',
          textAlign: 'left',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
          transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
          boxShadow: hovered
            ? `0 16px 48px rgba(0,0,0,0.14), 0 0 0 1px ${tool.color}30`
            : '0 1px 4px rgba(0,0,0,0.05)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow en fond au hover */}
        {hovered && (
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(circle at 30% 30%, ${tool.color}12 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />
        )}

        {/* Emoji icône */}
        <div style={{
          fontSize: 32,
          marginBottom: 16,
          transition: 'transform 0.25s',
          transform: hovered ? 'scale(1.15)' : 'scale(1)',
          display: 'inline-block',
        }}>
          {tool.emoji}
        </div>

        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 17, fontWeight: 700,
          color: hovered ? 'white' : '#0A1628',
          marginBottom: 6,
          transition: 'color 0.2s',
        }}>
          {tool.title}
        </div>

        <div style={{
          fontSize: 12,
          color: hovered ? 'rgba(255,255,255,0.55)' : '#64748B',
          lineHeight: 1.5,
          transition: 'color 0.2s',
        }}>
          {tool.sub}
        </div>

        {/* Flèche animée */}
        <div style={{
          position: 'absolute',
          bottom: 20, right: 20,
          width: 28, height: 28,
          borderRadius: '50%',
          background: hovered ? tool.color : '#F1F5F9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12,
          color: hovered ? '#0A1628' : '#94A3B8',
          transition: 'all 0.25s',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}>
          →
        </div>

        {/* Barre colorée en bas */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0,
          height: 2,
          width: hovered ? '100%' : '0%',
          background: tool.color,
          transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </button>
    </div>
  )
}
```

---

## MODIFICATION 6 — SECTION SOURCES : redesignée et animée

Remplace le footer de sources (Nadlan Gov, CBS, GovMap, Mavat)
par cette version plus soignée :

```jsx
function SourcesSection() {
  const sources = [
    {
      name: 'Nadlan Gov',
      desc: 'Official transaction registry',
      icon: '📊',
      url: 'https://www.gov.il/en/departments/units/real_estate_transactions',
    },
    {
      name: 'CBS Israël',
      desc: 'Official price indices',
      icon: '📈',
      url: 'https://www.cbs.gov.il',
    },
    {
      name: 'GovMap',
      desc: 'Cadastral maps',
      icon: '🗺️',
      url: 'https://www.govmap.gov.il',
    },
    {
      name: 'Mavat',
      desc: 'Urban planning',
      icon: '🏛️',
      url: 'https://mavat.iplan.gov.il',
    },
  ]

  return (
    <section style={{
      background: '#0A1628',
      padding: '60px 24px 40px',
    }}>
      <div style={{
        maxWidth: 900, margin: '0 auto',
      }}>

        {/* Ligne or */}
        <div style={{
          height: 1,
          background: 'linear-gradient(to right, transparent, #C9A84C, transparent)',
          marginBottom: 48,
        }} />

        {/* Logos sources */}
        <div className="reveal" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(20px, 4vw, 60px)',
          flexWrap: 'wrap',
          marginBottom: 40,
        }}>
          {sources.map((s, i) => (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 6,
                textDecoration: 'none',
                opacity: 0.6,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
            >
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>
                {s.name}
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                {s.desc}
              </span>
            </a>
          ))}
        </div>

        {/* Disclaimer */}
        <p style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.25)',
          textAlign: 'center',
          lineHeight: 1.6,
          maxWidth: 600, margin: '0 auto 24px',
        }}>
          Estimates are provided for informational purposes only.
          For any investment decision, consult a certified real estate expert.
          Data based on Nadlan Gov transactions and the CBS index.
        </p>

        {/* Copyright */}
        <p style={{
          fontSize: 10,
          color: 'rgba(255,255,255,0.15)',
          textAlign: 'center',
        }}>
          © 2025 Israel Real Estate Simulator — simmoisrael.com
        </p>

      </div>
    </section>
  )
}
```

---

## MODIFICATION 7 — Assemblage de la page d'accueil

Dans le fichier principal (App.jsx ou la page d'accueil),
remplace la page d'accueil par :

```jsx
import { useScrollReveal } from './hooks/useScrollReveal'

function HomePage({ onNavigate }) {
  useScrollReveal()  // ← active les animations scroll sur toute la page

  return (
    <>
      <HeroSection onEstimate={() => onNavigate('estimation')} />
      <ToolsGrid onNavigate={onNavigate} />
      <SourcesSection />
    </>
  )
}
```

Le reste du site (onglets de calcul) reste IDENTIQUE.
Ne touche qu'à la page d'accueil.

---

## MODIFICATION 8 — Vidéo de fond (instructions)

Pour la vidéo du hero, deux options :

### Option A — Vidéo locale (recommandé)
1. Va sur https://www.pexels.com/video/aerial-view-of-city-buildings-3571264/
2. Télécharge la vidéo en qualité HD (720p suffit)
3. Renomme-la `hero-tlv.mp4`
4. Place-la dans le dossier `public/`
5. Le `<source src="/hero-tlv.mp4">` fonctionnera directement

### Option B — Image fallback si vidéo non disponible
Si la vidéo ne charge pas, le `poster` du `<video>` affichera automatiquement
cette image Tel Aviv depuis Unsplash :
```
https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=1400&q=80
```
Cette image est libre de droits (Unsplash license).

---

## RÉCAPITULATIF — Ce qui change vs ce qui reste intact

### ✅ Ce qui est modifié (page d'accueil uniquement)
| Élément | Avant | Après |
|---|---|---|
| Hero | SVG statique + fond fixe | Vidéo + particules + animations fadeIn |
| Titre | Static | Dégradé or animé shimmer |
| CTA | Bouton simple | Bouton avec hover lift + glow |
| Grille outils | Cartes flat sans vie | Cards avec hover dark mode + barre couleur |
| Sources footer | Texte simple | Section sombre stylisée + ligne or |
| Navbar | Fond fixe | Glassmorphism au scroll |

### 🔒 Ce qui NE change PAS (onglets de calcul)
- Onglet Valuation (formulaire + résultats)
- Onglet Investor analysis
- Onglet Developer P&L
- Onglet Taxation
- Onglet Renovation costs
- Onglet Urban potential
- Agent IA
- Toute la logique de calcul
- Les données Nadlan / CBS
