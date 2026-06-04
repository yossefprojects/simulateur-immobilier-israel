# Prompt Replit — Refonte complète TOUT le site simmoisrael.com
# Navbar + Home + 6 onglets calcul + AI Agent + Footer

## Règle principale
La logique de calcul, les formules, les données et les fonctionnalités
NE CHANGENT PAS. Seul le design, les styles, les animations et la typographie
sont améliorés.

## Palette (conservée et renforcée)
```css
:root {
  --navy:     #0A1628;
  --blue:     #1A3A5C;
  --blue2:    #2A5080;
  --gold:     #C9A84C;
  --gold2:    #E8C96A;
  --gold-lt:  rgba(201,168,76,0.12);
  --bg:       #F8F7F4;
  --white:    #FFFFFF;
  --text:     #0C1A2E;
  --muted:    #64748B;
  --border:   #E2E8F0;
  --green:    #0F6E56;
  --green-lt: #E6F4EF;
  --red:      #8B1A1A;
  --red-lt:   #FCEBEB;
  --amber:    #BA7517;
  --amber-lt: #FEF8EC;

  --font-serif: 'DM Serif Display', Georgia, serif;
  --font-sans:  'Plus Jakarta Sans', system-ui, sans-serif;

  --shadow-sm: 0 1px 3px rgba(10,22,40,0.08);
  --shadow-md: 0 4px 16px rgba(10,22,40,0.12);
  --shadow-lg: 0 16px 48px rgba(10,22,40,0.16);
  --radius-md: 10px;
  --radius-lg: 16px;
}
```

## INSTALL
```bash
npm install framer-motion
```

---

## 1 — COMPOSANTS UI PARTAGÉS
## (remplace tous les inputs, sliders, selects, labels, boutons du site)

Crée `src/components/ui/FormElements.jsx` :

```jsx
// ── LABEL ────────────────────────────────────────────────────────────────────
export const Label = ({ children, required }) => (
  <label style={{
    display: 'block',
    fontSize: 11, fontWeight: 700,
    color: '#1A3A5C',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 6,
  }}>
    {children}
    {required && <span style={{ color: '#C9A84C', marginLeft: 3 }}>*</span>}
  </label>
)

// ── INPUT ─────────────────────────────────────────────────────────────────────
export const Input = ({ value, onChange, placeholder, type = 'text', style = {} }) => (
  <input
    type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{
      width: '100%',
      background: 'white',
      border: '1.5px solid #E2E8F0',
      borderRadius: 10,
      padding: '10px 14px',
      fontSize: 14, color: '#0C1A2E',
      outline: 'none',
      transition: 'border-color .2s, box-shadow .2s',
      fontFamily: 'inherit',
      ...style,
    }}
    onFocus={e => {
      e.target.style.borderColor = '#1A3A5C'
      e.target.style.boxShadow = '0 0 0 3px rgba(26,58,92,0.08)'
    }}
    onBlur={e => {
      e.target.style.borderColor = '#E2E8F0'
      e.target.style.boxShadow = 'none'
    }}
  />
)

// ── SELECT ────────────────────────────────────────────────────────────────────
export const Select = ({ value, onChange, children, style = {} }) => (
  <div style={{ position: 'relative' }}>
    <select
      value={value} onChange={onChange}
      style={{
        width: '100%',
        background: 'white',
        border: '1.5px solid #E2E8F0',
        borderRadius: 10,
        padding: '10px 36px 10px 14px',
        fontSize: 14, color: '#0C1A2E',
        outline: 'none', cursor: 'pointer',
        appearance: 'none',
        transition: 'border-color .2s',
        fontFamily: 'inherit',
        ...style,
      }}
      onFocus={e => e.target.style.borderColor = '#1A3A5C'}
      onBlur={e => e.target.style.borderColor = '#E2E8F0'}
    >
      {children}
    </select>
    {/* Flèche custom */}
    <div style={{
      position: 'absolute', right: 12, top: '50%',
      transform: 'translateY(-50%)',
      color: '#94A3B8', fontSize: 10,
      pointerEvents: 'none',
    }}>▼</div>
  </div>
)

// ── SLIDER ────────────────────────────────────────────────────────────────────
// Ajoute ce CSS global pour tous les sliders input[type=range] :
// (dans index.css)
/*
input[type=range] {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(to right, #C9A84C var(--val, 50%), #E2E8F0 var(--val, 50%));
  outline: none;
  cursor: pointer;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #1A3A5C;
  border: 2.5px solid #C9A84C;
  box-shadow: 0 2px 6px rgba(10,22,40,0.2);
  transition: transform .15s;
}
input[type=range]::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}
input[type=range]::-moz-range-thumb {
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #1A3A5C;
  border: 2.5px solid #C9A84C;
  cursor: pointer;
}
*/

// ── CARD RÉSULTAT (valeur principale) ─────────────────────────────────────────
export const ResultCard = ({ label, value, subValue, color = '#C9A84C', size = 'lg' }) => (
  <div style={{
    background: 'linear-gradient(135deg, #0A1628, #1A3A5C)',
    borderRadius: 14,
    padding: size === 'lg' ? '24px 28px' : '16px 20px',
    position: 'relative', overflow: 'hidden',
  }}>
    {/* Glow */}
    <div style={{
      position: 'absolute', top: -30, right: -30,
      width: 120, height: 120,
      background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
      pointerEvents: 'none',
    }} />
    <div style={{
      fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)',
      letterSpacing: '0.08em', textTransform: 'uppercase',
      marginBottom: 8,
    }}>
      {label}
    </div>
    <div style={{
      fontFamily: "'DM Serif Display', serif",
      fontSize: size === 'lg' ? 36 : 26,
      color, lineHeight: 1.1, marginBottom: 4,
    }}>
      {value}
    </div>
    {subValue && (
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
        {subValue}
      </div>
    )}
  </div>
)

// ── METRIC ROW (ligne de résultat) ────────────────────────────────────────────
export const MetricRow = ({ label, value, color, bold, border }) => (
  <div style={{
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '9px 0',
    borderBottom: border ? '1px solid #F1F5F9' : 'none',
    borderTop: bold ? '1.5px solid #E2E8F0' : 'none',
  }}>
    <span style={{
      fontSize: 13,
      fontWeight: bold ? 600 : 400,
      color: bold ? '#0C1A2E' : '#64748B',
    }}>
      {label}
    </span>
    <span style={{
      fontSize: 14,
      fontWeight: bold ? 700 : 500,
      color: color || (bold ? '#0C1A2E' : '#0C1A2E'),
      fontVariantNumeric: 'tabular-nums',
    }}>
      {value}
    </span>
  </div>
)

// ── SECTION TITLE (dans les onglets) ─────────────────────────────────────────
export const SectionTitle = ({ children }) => (
  <div style={{
    fontSize: 10, fontWeight: 700,
    color: '#C9A84C',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: 14, marginTop: 24,
    display: 'flex', alignItems: 'center', gap: 8,
  }}>
    <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.2)' }} />
    {children}
    <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.2)' }} />
  </div>
)

// ── BOUTON PRIMAIRE ───────────────────────────────────────────────────────────
export const BtnPrimary = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{
    background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
    color: '#0A1628', border: 'none',
    borderRadius: 50, padding: '11px 28px',
    fontSize: 14, fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(201,168,76,0.38)',
    transition: 'all .25s',
    display: 'inline-flex', alignItems: 'center', gap: 7,
    ...style,
  }}
  onMouseEnter={e => {
    e.currentTarget.style.transform = 'translateY(-1px)'
    e.currentTarget.style.boxShadow = '0 10px 26px rgba(201,168,76,0.48)'
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow = '0 6px 18px rgba(201,168,76,0.38)'
  }}
  >{children}</button>
)
```

---

## 2 — LAYOUT DES ONGLETS DE CALCUL — structure commune

Chaque onglet (Valuation, Investor, Developer P&L, Taxation, Renovation, Urban potential)
suit ce layout 2 colonnes. Applique ce style sur le conteneur principal de chaque onglet :

```jsx
// Conteneur principal de l'onglet (sous le header/bannière)
<div style={{
  maxWidth: 1280,
  margin: '0 auto',
  padding: '32px 40px 60px',
  display: 'grid',
  gridTemplateColumns: '1fr 1.15fr',
  gap: 32,
  alignItems: 'start',
}}>
  {/* Colonne gauche : formulaire */}
  <div style={{
    background: 'white',
    border: '1px solid #E2E8F0',
    borderRadius: 16,
    padding: '28px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  }}>
    {/* ... champs existants avec les nouveaux composants ... */}
  </div>

  {/* Colonne droite : résultats */}
  <div style={{
    display: 'flex', flexDirection: 'column', gap: 16,
  }}>
    {/* ... résultats ... */}
  </div>
</div>
```

---

## 3 — ONGLET VALUATION (/estimation)

### Formulaire — style des champs

Remplace les labels plats par `<Label>`, les inputs par `<Input>`,
les selects par `<Select>` du composant partagé.

### Résultats — bloc principal

```jsx
// Prix estimé principal
<ResultCard
  label="Estimated price"
  value="3.59M ₪"
  subValue="Range: 3.30M – 3.88M ₪"
  color="#C9A84C"
  size="lg"
/>

// Infos rapides sous le résultat
<div style={{
  display: 'flex', gap: 8, marginTop: 12,
}}>
  {[
    { label: '44 857 ₪/m²', bg: '#E6F1FB', color: '#0C447C' },
    { label: '80 m²',        bg: '#F0F9F4', color: '#0F6E56' },
    { label: 'Coef. ×1.068', bg: '#FEF8EC', color: '#BA7517' },
  ].map((chip, i) => (
    <span key={i} style={{
      background: chip.bg, color: chip.color,
      fontSize: 12, fontWeight: 600,
      padding: '4px 10px', borderRadius: 6,
    }}>
      {chip.label}
    </span>
  ))}
</div>
```

### Coefficient breakdown — barres redesignées

```jsx
// Remplace les barres grises par des barres avec couleurs sémantiques :
// Sur le conteneur COEFFICIENT BREAKDOWN :
<div style={{
  background: 'white', border: '1px solid #E2E8F0',
  borderRadius: 14, padding: '20px 24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
}}>
  <div style={{
    fontSize: 10, fontWeight: 700, color: '#C9A84C',
    letterSpacing: '0.12em', textTransform: 'uppercase',
    marginBottom: 16,
  }}>
    Coefficient breakdown
  </div>
  {/* Chaque ligne : */}
  {waterfall.map((row, i) => (
    <div key={i} style={{
      display: 'grid',
      gridTemplateColumns: '120px 1fr 80px',
      alignItems: 'center', gap: 12,
      marginBottom: 8,
    }}>
      <span style={{ fontSize: 11, color: '#64748B' }}>{row.label}</span>
      <div style={{
        height: 6, borderRadius: 3,
        background: '#F1F5F9', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 3,
          width: `${(row.value / maxValue) * 100}%`,
          background: row.positive ? '#0F6E56' : '#BA7517',
          transition: 'width .6s cubic-bezier(.16,1,.3,1)',
        }} />
      </div>
      <span style={{
        fontSize: 12, fontWeight: 600, color: '#0C1A2E',
        textAlign: 'right', fontVariantNumeric: 'tabular-nums',
      }}>
        {row.value.toLocaleString()} ₪
      </span>
    </div>
  ))}
</div>
```

### Sensibilité ±10%

```jsx
// Remplace les 3 blocs plats par :
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
  {[
    { label: '-10% market', value: '3.23M ₪', accent: false },
    { label: 'Estimated',   value: '3.59M ₪', accent: true },
    { label: '+10% market', value: '3.95M ₪', accent: false },
  ].map((s, i) => (
    <div key={i} style={{
      background: s.accent ? '#0A1628' : 'white',
      border: s.accent ? 'none' : '1px solid #E2E8F0',
      borderRadius: 12, padding: '14px 12px',
      textAlign: 'center',
      boxShadow: s.accent ? '0 8px 24px rgba(10,22,40,0.2)' : 'none',
    }}>
      <div style={{
        fontSize: 10, color: s.accent ? 'rgba(255,255,255,0.45)' : '#94A3B8',
        marginBottom: 6, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        {s.label}
      </div>
      <div style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: 20,
        color: s.accent ? '#C9A84C' : '#0C1A2E',
      }}>
        {s.value}
      </div>
    </div>
  ))}
</div>
```

---

## 4 — ONGLET INVESTOR ANALYSIS (/investisseur)

### 6 métriques résultats — redesign

```jsx
// Grille 2×3 pour les 6 métriques
<div style={{
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
}}>
  {[
    { label: 'Gross yield', value: '4.50%', color: '#0F6E56', bg: '#E6F4EF' },
    { label: 'Net yield',   value: '3.67%', color: '#0F6E56', bg: '#E6F4EF' },
    { label: 'Monthly payment', value: '8 053 ₪', color: '#0C1A2E', bg: '#F8F7F4' },
    { label: 'IRR estimated', value: '5.7%',    color: '#1A3A5C', bg: '#EBF2FA' },
    { label: 'Monthly cash-flow', value: '-1 928 ₪', color: '#8B1A1A', bg: '#FCEBEB' },
    { label: 'Total gain', value: '589 880 ₪', color: '#0F6E56', bg: '#E6F4EF' },
  ].map((m, i) => (
    <div key={i} style={{
      background: m.bg,
      borderRadius: 12, padding: '14px 16px',
      border: `1px solid ${m.bg === '#F8F7F4' ? '#E2E8F0' : 'transparent'}`,
    }}>
      <div style={{
        fontSize: 10, color: '#94A3B8', fontWeight: 600,
        letterSpacing: '0.07em', textTransform: 'uppercase',
        marginBottom: 6,
      }}>
        {m.label}
      </div>
      <div style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: 22, color: m.color,
      }}>
        {m.value}
      </div>
    </div>
  ))}
</div>
```

### Cash-flow détail

```jsx
// Applique MetricRow sur chaque ligne du cash-flow
<div style={{
  background: 'white', border: '1px solid #E2E8F0',
  borderRadius: 14, padding: '18px 22px',
}}>
  <div style={{ fontSize: 10, fontWeight: 700, color: '#C9A84C',
    letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
    Monthly cash-flow
  </div>
  <MetricRow label="Gross monthly rent" value="+7 500 ₪" color="#0F6E56" border />
  <MetricRow label="Vacancy" value="-375 ₪" color="#8B1A1A" border />
  <MetricRow label="Monthly expenses" value="-1 000 ₪" color="#8B1A1A" border />
  <MetricRow label="Mortgage payment" value="-8 053 ₪" color="#8B1A1A" border />
  <MetricRow label="Monthly cash-flow" value="-1 928 ₪" color="#8B1A1A" bold />
</div>
```

---

## 5 — ONGLET DEVELOPER P&L (/promoteur)

### Hero marge brute

```jsx
// En haut des résultats, avant le donut chart :
<div style={{
  background: 'linear-gradient(135deg, #0A1628, #1A3A5C)',
  borderRadius: 16, padding: '28px 32px',
  textAlign: 'center',
  position: 'relative', overflow: 'hidden',
  marginBottom: 16,
}}>
  <div style={{
    position: 'absolute', top: -40, right: -40,
    width: 200, height: 200,
    background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  }} />
  <div style={{
    fontSize: 10, color: 'rgba(255,255,255,0.4)',
    letterSpacing: '0.1em', textTransform: 'uppercase',
    marginBottom: 8,
  }}>
    Gross margin
  </div>
  <div style={{
    fontFamily: "'DM Serif Display', serif",
    fontSize: 44, color: '#C9A84C', lineHeight: 1,
    marginBottom: 8,
  }}>
    42.64M ₪
  </div>
  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
    Margin rate / revenue: <strong style={{ color: 'white' }}>37.9%</strong>
  </div>
</div>
```

### Tableau bilan P&L

```jsx
// Remplace les lignes plates par ce style :
<div style={{
  background: 'white', border: '1px solid #E2E8F0',
  borderRadius: 14, overflow: 'hidden',
}}>
  {/* Header */}
  <div style={{
    background: '#1A3A5C',
    display: 'grid', gridTemplateColumns: '1fr auto',
    padding: '10px 18px',
  }}>
    <span style={{ fontSize: 11, fontWeight: 700, color: 'white', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Item</span>
    <span style={{ fontSize: 11, fontWeight: 700, color: 'white', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Amount</span>
  </div>
  {/* Lignes */}
  {bilianRows.map((row, i) => (
    <div key={i} style={{
      display: 'grid', gridTemplateColumns: '1fr auto',
      padding: '10px 18px',
      background: row.isBold
        ? (row.positive ? '#E6F4EF' : '#FCEBEB')
        : (i % 2 === 0 ? '#F8F7F4' : 'white'),
      borderTop: row.isBold ? '1.5px solid #E2E8F0' : 'none',
    }}>
      <span style={{ fontSize: 13, fontWeight: row.isBold ? 700 : 400, color: '#0C1A2E' }}>
        {row.label}
      </span>
      <span style={{
        fontSize: 14, fontWeight: row.isBold ? 700 : 500,
        color: row.positive ? '#0F6E56' : '#8B1A1A',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {row.value}
      </span>
    </div>
  ))}
</div>
```

### Tableau sensibilité

```jsx
// Chaque ligne sensibilité avec couleur conditionnelle :
{sensibilite.map((row, i) => {
  const isBase = row.variation === '+0%'
  const isNeg = row.variation.startsWith('-')
  const mag = Math.abs(parseInt(row.variation))
  const bg = isBase ? '#EBF2FA'
    : isNeg ? (mag >= 10 ? '#FCEBEB' : mag >= 5 ? '#FEF8EC' : '#F8F7F4')
    : (mag >= 10 ? '#E6F4EF' : mag >= 5 ? '#F0FDF4' : '#F8F7F4')
  return (
    <div key={i} style={{
      display: 'grid',
      gridTemplateColumns: '60px 1fr 1fr 60px 80px',
      gap: 8, padding: '9px 16px',
      background: bg,
      border: isBase ? '1.5px solid #1A3A5C' : 'none',
      borderRadius: isBase ? 8 : 0,
      alignItems: 'center',
    }}>
      <span style={{ fontSize: 13, fontWeight: isBase ? 700 : 400, color: isBase ? '#1A3A5C' : '#0C1A2E' }}>
        {row.variation}
      </span>
      <span style={{ fontSize: 13, color: '#0C1A2E', fontVariantNumeric: 'tabular-nums' }}>{row.ca}</span>
      <span style={{ fontSize: 13, color: isNeg ? '#8B1A1A' : '#0F6E56', fontVariantNumeric: 'tabular-nums' }}>{row.marge}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: isNeg ? '#8B1A1A' : '#0F6E56' }}>{row.pct}</span>
      {/* Mini bar */}
      <div style={{ height: 6, borderRadius: 3, background: '#E2E8F0', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${(parseFloat(row.pct) / 50) * 100}%`,
          borderRadius: 3,
          background: isBase ? '#C9A84C' : (isNeg ? '#FCA5A5' : '#52B788'),
        }} />
      </div>
    </div>
  )
})}
```

---

## 6 — ONGLET TAXATION (/fiscalite)

### Résultats redesignés

```jsx
// Mas Rechisha result
<div style={{
  background: 'white', border: '1px solid #E2E8F0',
  borderRadius: 14, padding: '20px',
}}>
  <div style={{
    fontSize: 10, fontWeight: 700, color: '#C9A84C',
    letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12,
  }}>
    Mas Rechisha result
  </div>
  <MetricRow label="3.5% sur 368 295 ₪" value="12 890 ₪" color="#8B1A1A" border />
  <MetricRow label="5.0% sur 152 960 ₪" value="7 648 ₪" color="#8B1A1A" border />
  <MetricRow label="Total Mas Rechisha" value="20 538 ₪" color="#8B1A1A" bold />
  {/* Pourcentage en badge */}
  <div style={{ marginTop: 12 }}>
    <span style={{
      background: '#FCEBEB', color: '#8B1A1A',
      fontSize: 12, fontWeight: 700,
      padding: '4px 10px', borderRadius: 6,
    }}>
      0.82% of purchase price
    </span>
  </div>
</div>
```

---

## 7 — ONGLET RENOVATION COSTS (/travaux)

### Niveaux de rénovation — cards redesignées

```jsx
// Remplace les 4 cards de niveau de rénovation :
{niveaux.map((n, i) => (
  <div
    key={i}
    onClick={() => setNiveau(n.value)}
    style={{
      background: selected === n.value ? '#0A1628' : 'white',
      border: selected === n.value
        ? '2px solid #C9A84C'
        : '1px solid #E2E8F0',
      borderRadius: 12, padding: '14px 16px',
      cursor: 'pointer',
      transition: 'all .2s',
      transform: selected === n.value ? 'scale(1.02)' : 'scale(1)',
    }}
  >
    <div style={{
      fontSize: 13, fontWeight: 700,
      color: selected === n.value ? 'white' : '#0C1A2E',
      marginBottom: 3,
    }}>
      {n.label}
    </div>
    <div style={{
      fontSize: 11,
      color: selected === n.value ? '#C9A84C' : '#94A3B8',
    }}>
      {n.range}
    </div>
  </div>
))}
```

### Budget principal

```jsx
<ResultCard
  label="Estimated budget (range)"
  value="315K – 567K ₪"
  subValue="Midpoint: 440 748 ₪ · 5 509 ₪/m²"
  color="#C9A84C"
  size="lg"
/>
```

---

## 8 — ONGLET AI AGENT (/agent)

### Card principale redesignée

```jsx
// Remplace la card "Shamai AI Agent" existante :
<div style={{
  background: 'white', border: '1px solid #E2E8F0',
  borderRadius: 16, overflow: 'hidden',
  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
}}>
  {/* Header card */}
  <div style={{
    background: 'linear-gradient(135deg, #0A1628, #1A3A5C)',
    padding: '20px 24px',
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))',
        border: '1.5px solid rgba(201,168,76,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18,
      }}>
        ⚖️
      </div>
      <div>
        <div style={{
          fontSize: 14, fontWeight: 700, color: 'white',
        }}>
          Shamai AI Agent — Property Valuation
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
          Licensed Israeli appraisal expert (indicative)
        </div>
      </div>
    </div>
    {/* Bouton History */}
    <button style={{
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.15)',
      color: 'rgba(255,255,255,0.6)',
      borderRadius: 8, padding: '5px 12px',
      fontSize: 12, cursor: 'pointer',
      transition: 'all .2s',
    }}>
      🕐 History
    </button>
  </div>

  {/* Pills exemples */}
  <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9' }}>
    <div style={{
      fontSize: 10, fontWeight: 600, color: '#94A3B8',
      letterSpacing: '0.08em', textTransform: 'uppercase',
      marginBottom: 8,
    }}>
      Example properties
    </div>
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {examples.map((ex, i) => (
        <button key={i} onClick={() => setInput(ex)} style={{
          background: '#F8F7F4', border: '1px solid #E2E8F0',
          borderRadius: 20, padding: '4px 12px',
          fontSize: 12, color: '#1A3A5C', cursor: 'pointer',
          transition: 'all .15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#1A3A5C'
          e.currentTarget.style.color = 'white'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#F8F7F4'
          e.currentTarget.style.color = '#1A3A5C'
        }}>
          {ex}
        </button>
      ))}
    </div>
  </div>

  {/* Textarea */}
  <div style={{ padding: '16px 20px' }}>
    <textarea
      value={input} onChange={e => setInput(e.target.value)}
      placeholder="E.g.: 4-room apartment, Neve Tzedek, 90m², floor 3/6, built 1985, renovated 2020, purpose: sale..."
      style={{
        width: '100%', minHeight: 120,
        background: '#FAFCFA',
        border: '1.5px solid #E2E8F0',
        borderRadius: 10, padding: '12px 14px',
        fontSize: 13, color: '#0C1A2E',
        resize: 'vertical', outline: 'none',
        fontFamily: 'inherit', lineHeight: 1.6,
        transition: 'border-color .2s',
      }}
      onFocus={e => e.target.style.borderColor = '#1A3A5C'}
      onBlur={e => e.target.style.borderColor = '#E2E8F0'}
    />
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', marginTop: 10,
    }}>
      <span style={{ fontSize: 11, color: '#94A3B8' }}>
        {input.length} characters
      </span>
      {/* Bouton Evaluate property */}
      <BtnPrimary onClick={handleSubmit}>
        ⚡ Evaluate property
      </BtnPrimary>
    </div>
  </div>
</div>
```

---

## 9 — FOOTER — refonte complète

Remplace le footer existant par :

```jsx
<footer style={{ background: '#0A1628' }}>
  {/* Ligne gold */}
  <div style={{
    height: 1, margin: '0 48px',
    background: 'linear-gradient(to right, transparent, #C9A84C, transparent)',
  }} />

  <div style={{
    maxWidth: 1280, margin: '0 auto',
    padding: '48px 40px 28px',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: 48,
  }}>

    {/* Brand */}
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
        {/* Logo existant conservé */}
        <div>
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 18, color: 'white',
          }}>
            Israel Real Estate<span style={{ color: '#C9A84C' }}> Simulator</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
            Market valuation · Urban potential · Financial analysis
          </div>
        </div>
      </div>
      <p style={{
        fontSize: 13, color: 'rgba(255,255,255,0.35)',
        lineHeight: 1.7, marginBottom: 20, maxWidth: 300,
      }}>
        Indicative estimates based on Nadlan Gov, CBS and BOI data.
        Not a substitute for a certified Shamai report.
      </p>
      {/* Réseaux sociaux */}
      <div style={{ display: 'flex', gap: 8 }}>
        {['💼','📸','✉️'].map((icon, i) => (
          <a key={i} href="#" style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 14,
            textDecoration: 'none', transition: 'all .2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'
            e.currentTarget.style.background = 'rgba(201,168,76,0.08)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
          }}
          >{icon}</a>
        ))}
      </div>
    </div>

    {/* Outils */}
    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, color: '#C9A84C',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        marginBottom: 16,
      }}>Tools</div>
      {[
        { label: 'Valuation', href: '/estimation' },
        { label: 'Urban potential', href: '/urbanisme' },
        { label: 'Investor analysis', href: '/investisseur' },
        { label: 'Developer P&L', href: '/promoteur' },
        { label: 'Taxation', href: '/fiscalite' },
        { label: 'Renovation costs', href: '/travaux' },
        { label: '✦ AI Agent', href: '/agent' },
      ].map(l => (
        <a key={l.href} href={l.href} style={{
          display: 'block', fontSize: 13,
          color: 'rgba(255,255,255,0.4)',
          textDecoration: 'none', marginBottom: 7,
          transition: 'color .2s',
        }}
        onMouseEnter={e => e.target.style.color = '#C9A84C'}
        onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
        >{l.label}</a>
      ))}
    </div>

    {/* Sources + NadlanConnect */}
    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, color: '#C9A84C',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        marginBottom: 16,
      }}>Data sources</div>
      {[
        { label: 'Nadlan Gov', href: 'https://www.gov.il' },
        { label: 'CBS Israël', href: 'https://www.cbs.gov.il' },
        { label: 'GovMap', href: 'https://www.govmap.gov.il' },
        { label: 'Mavat', href: 'https://mavat.iplan.gov.il' },
        { label: 'BOI', href: 'https://www.boi.org.il' },
      ].map(l => (
        <a key={l.href} href={l.href} target="_blank" rel="noopener" style={{
          display: 'block', fontSize: 13,
          color: 'rgba(255,255,255,0.4)',
          textDecoration: 'none', marginBottom: 7,
          transition: 'color .2s',
        }}
        onMouseEnter={e => e.target.style.color = '#C9A84C'}
        onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
        >↗ {l.label}</a>
      ))}

      {/* Lien NadlanConnect */}
      <a href="https://nadlanconnect.com" target="_blank" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        marginTop: 16,
        background: 'rgba(201,168,76,0.1)',
        border: '1px solid rgba(201,168,76,0.25)',
        color: '#C9A84C', borderRadius: 8,
        padding: '7px 14px', fontSize: 12, fontWeight: 600,
        textDecoration: 'none', transition: 'all .2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(201,168,76,0.18)'
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(201,168,76,0.1)'
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'
      }}
      >
        🏗️ NadlanConnect →
      </a>
    </div>
  </div>

  {/* Copyright */}
  <div style={{
    borderTop: '1px solid rgba(255,255,255,0.05)',
    padding: '16px 40px', textAlign: 'center',
  }}>
    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>
      © 2025 Israel Real Estate Simulator — simmoisrael.com ·
      Indicative estimates. Data: Nadlan Gov, CBS, BOI.
    </p>
  </div>
</footer>
```

---

## 10 — BANNIÈRE DE MARCHÉ — compact 1 ligne

```jsx
// La bannière CBS/BOI en haut — remplace le style existant par :
<div style={{
  background: '#060E1A',
  padding: '5px 32px',
  display: 'flex', alignItems: 'center',
  gap: 24, overflowX: 'auto',
  fontSize: 11, whiteSpace: 'nowrap',
}}>
  {/* Chaque item : */}
  <span style={{ color: '#4B5563' }}>
    📊 <span style={{ color: '#85B7EB' }}>Market as of {date}</span>
  </span>
  <span style={{ color: '#4B5563' }}>
    BOI <strong style={{ color: '#C9A84C' }}>4.5%</strong>
  </span>
  <span style={{ color: '#4B5563' }}>
    Avg. mortgage <strong style={{ color: '#C9A84C' }}>5.2%</strong>
  </span>
  <span style={{ color: '#4B5563' }}>
    CBS <strong style={{ color: '#C9A84C' }}>285.4</strong>
  </span>
  <span style={{ color: '#0F6E56' }}>▲ 6.2% / 12 months</span>
</div>
```

---

## RÉCAPITULATIF — pages et composants touchés

| Page / Composant | Modifications |
|---|---|
| Bannière marché | Fond plus sombre, plus compact |
| Home | useScrollReveal sur tout, CountUp sur stats, cartes outils dark hover |
| Onglet Valuation | Inputs/selects redesignés, barres waterfall colorées, sensibilité en cards |
| Onglet Investor | 6 métriques colorées, cash-flow MetricRows, sparkline amélioré |
| Onglet Developer P&L | Hero marge brute, tableau bilan lignes colorées, sensibilité avec mini-bars |
| Onglet Taxation | ResultCards pour les taxes, MetricRows colorées |
| Onglet Renovation | Cards niveaux avec hover dark, ResultCard budget |
| Onglet Urban potential | Score redesigné, résultats en MetricRows |
| Onglet AI Agent | Header card bleu marine, pills exemples hover dark, textarea focus states, bouton BtnPrimary |
| Footer | 3 colonnes, réseaux sociaux, sources cliquables, lien NadlanConnect, ligne gold |
| Composants partagés | Label, Input, Select, Slider CSS, ResultCard, MetricRow, SectionTitle, BtnPrimary |
