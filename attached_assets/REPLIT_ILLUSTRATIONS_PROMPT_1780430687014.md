# Prompt Replit — Remplacement des illustrations de bannière

## Problème à corriger

Chaque onglet affiche une illustration générique qui ne correspond pas au contenu
(graphique avec sliders sur l'onglet Fiscalité, photo de toit sur Estimation, etc.).

Remplace l'illustration de chaque onglet par le SVG ci-dessous.
Ne touche à rien d'autre — uniquement les bannières visuelles en haut de chaque onglet.

Dans le code, trouve le composant ou la div qui contient l'illustration/bannière
de chaque onglet (probablement une div avec une classe type `banner`, `hero`,
`tab-illustration` ou un `<img>` ou un `<svg>` existant) et remplace son contenu
par le SVG correspondant.

Chaque SVG doit avoir :
- `width="100%"`
- `viewBox="0 0 680 120"`
- `preserveAspectRatio="xMidYMid slice"`
- hauteur du conteneur : `160px` (ou la hauteur actuelle si différente)

---

## ONGLET 1 — Estimation : skyline Tel Aviv de nuit

```svg
<svg width="100%" viewBox="0 0 680 120" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <rect width="680" height="120" fill="#0F2235"/>
  <circle cx="60"  cy="18" r="1.2" fill="#ffffff" opacity=".6"/>
  <circle cx="130" cy="10" r="1"   fill="#ffffff" opacity=".5"/>
  <circle cx="220" cy="22" r="1.4" fill="#ffffff" opacity=".7"/>
  <circle cx="370" cy="8"  r="1"   fill="#ffffff" opacity=".4"/>
  <circle cx="490" cy="16" r="1.2" fill="#ffffff" opacity=".6"/>
  <circle cx="580" cy="9"  r="1"   fill="#ffffff" opacity=".5"/>
  <circle cx="640" cy="25" r="1.4" fill="#ffffff" opacity=".7"/>
  <circle cx="620" cy="22" r="14" fill="#E8C96A" opacity=".85"/>
  <rect x="0"   y="70" width="55"  height="50" fill="#112840"/>
  <rect x="60"  y="55" width="80"  height="65" fill="#112840"/>
  <rect x="145" y="65" width="50"  height="55" fill="#112840"/>
  <rect x="200" y="42" width="70"  height="78" fill="#112840"/>
  <rect x="275" y="60" width="60"  height="60" fill="#112840"/>
  <rect x="340" y="48" width="85"  height="72" fill="#112840"/>
  <rect x="430" y="58" width="55"  height="62" fill="#112840"/>
  <rect x="490" y="36" width="90"  height="84" fill="#112840"/>
  <rect x="585" y="62" width="95"  height="58" fill="#112840"/>
  <rect x="10"  y="78" width="40"  height="42" fill="#0F2235"/>
  <rect x="70"  y="60" width="60"  height="60" fill="#0F2235"/>
  <rect x="155" y="72" width="38"  height="48" fill="#0F2235"/>
  <rect x="210" y="50" width="55"  height="70" fill="#0F2235"/>
  <rect x="285" y="66" width="48"  height="54" fill="#0F2235"/>
  <rect x="350" y="30" width="65"  height="90" fill="#0C2040"/>
  <rect x="380" y="20" width="5"   height="12" fill="#C9A84C" opacity=".7"/>
  <rect x="75"  y="68" width="7" height="5" rx=".5" fill="#C9A84C" opacity=".75"/>
  <rect x="88"  y="68" width="7" height="5" rx=".5" fill="#C9A84C" opacity=".5"/>
  <rect x="75"  y="78" width="7" height="5" rx=".5" fill="#C9A84C" opacity=".4"/>
  <rect x="215" y="58" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".8"/>
  <rect x="228" y="58" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".5"/>
  <rect x="215" y="68" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".6"/>
  <rect x="354" y="38" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".9"/>
  <rect x="366" y="38" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".6"/>
  <rect x="378" y="38" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".8"/>
  <rect x="354" y="50" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".5"/>
  <rect x="366" y="50" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".7"/>
  <rect x="378" y="50" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".4"/>
  <rect x="354" y="62" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".8"/>
  <rect x="378" y="62" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".6"/>
  <rect x="495" y="44" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".7"/>
  <rect x="507" y="44" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".5"/>
  <rect x="519" y="44" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".8"/>
  <rect x="495" y="56" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".4"/>
  <rect x="519" y="56" width="8" height="6" rx=".5" fill="#C9A84C" opacity=".6"/>
  <rect x="0" y="112" width="680" height="8" fill="#0C1E30"/>
  <rect x="60"  y="113" width="55" height="4" rx="1" fill="#1A3A5C" opacity=".4"/>
  <rect x="200" y="113" width="70" height="4" rx="1" fill="#1A3A5C" opacity=".3"/>
  <rect x="350" y="113" width="65" height="5" rx="1" fill="#C9A84C" opacity=".15"/>
</svg>
```

---

## ONGLET 2 — Potentiel urbanistique : plan cadastral

```svg
<svg width="100%" viewBox="0 0 680 120" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <rect width="680" height="120" fill="#0C1E30"/>
  <line x1="0"   y1="30"  x2="680" y2="30"  stroke="#1A3A5C" stroke-width=".8" opacity=".8"/>
  <line x1="0"   y1="60"  x2="680" y2="60"  stroke="#1A3A5C" stroke-width=".8" opacity=".8"/>
  <line x1="0"   y1="90"  x2="680" y2="90"  stroke="#1A3A5C" stroke-width=".8" opacity=".8"/>
  <line x1="80"  y1="0"   x2="80"  y2="120" stroke="#1A3A5C" stroke-width=".8" opacity=".8"/>
  <line x1="200" y1="0"   x2="200" y2="120" stroke="#1A3A5C" stroke-width=".8" opacity=".8"/>
  <line x1="340" y1="0"   x2="340" y2="120" stroke="#1A3A5C" stroke-width=".8" opacity=".8"/>
  <line x1="480" y1="0"   x2="480" y2="120" stroke="#1A3A5C" stroke-width=".8" opacity=".8"/>
  <line x1="600" y1="0"   x2="600" y2="120" stroke="#1A3A5C" stroke-width=".8" opacity=".8"/>
  <rect x="90"  y="10" width="100" height="80" fill="#C9A84C" opacity=".06" stroke="#C9A84C" stroke-width="1.5"/>
  <rect x="210" y="6"  width="120" height="55" fill="none"    stroke="#1A3A5C" stroke-width="1" opacity=".9"/>
  <rect x="210" y="68" width="120" height="45" fill="none"    stroke="#1A3A5C" stroke-width=".8" opacity=".6"/>
  <rect x="350" y="8"  width="120" height="104" fill="#C9A84C" opacity=".1" stroke="#C9A84C" stroke-width="2"/>
  <rect x="490" y="10" width="100" height="45" fill="none"    stroke="#1A3A5C" stroke-width="1" opacity=".7"/>
  <rect x="490" y="62" width="100" height="50" fill="none"    stroke="#1A3A5C" stroke-width=".8" opacity=".5"/>
  <text x="128" y="55" font-family="monospace" font-size="9" fill="#C9A84C" opacity=".7" text-anchor="middle">6627 / 142</text>
  <text x="270" y="38" font-family="monospace" font-size="8" fill="#2A5080" opacity=".9" text-anchor="middle">GUSH 5240</text>
  <text x="410" y="56" font-family="monospace" font-size="9" fill="#C9A84C" opacity=".9" text-anchor="middle">6640 / 88</text>
  <circle cx="410" cy="80" r="7" fill="#C9A84C" opacity=".25"/>
  <circle cx="410" cy="80" r="4" fill="#C9A84C" opacity=".6"/>
  <circle cx="410" cy="80" r="2" fill="#C9A84C"/>
  <line x1="0"   y1="60" x2="680" y2="60" stroke="#ffffff" stroke-width="2.5" opacity=".04"/>
  <line x1="340" y1="0"  x2="340" y2="120" stroke="#ffffff" stroke-width="2.5" opacity=".04"/>
</svg>
```

---

## ONGLET 3 — Analyse investisseur : courbe de rendement

```svg
<svg width="100%" viewBox="0 0 680 120" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <rect width="680" height="120" fill="#0C1E30"/>
  <line x1="60" y1="20"  x2="660" y2="20"  stroke="#1A3A5C" stroke-width=".5" opacity=".8"/>
  <line x1="60" y1="50"  x2="660" y2="50"  stroke="#1A3A5C" stroke-width=".5" opacity=".8"/>
  <line x1="60" y1="80"  x2="660" y2="80"  stroke="#1A3A5C" stroke-width=".5" opacity=".8"/>
  <line x1="60" y1="110" x2="660" y2="110" stroke="#1A3A5C" stroke-width=".5" opacity=".8"/>
  <line x1="60" y1="10" x2="60" y2="115" stroke="#1A3A5C" stroke-width=".8" opacity=".9"/>
  <text x="52" y="23"  font-family="monospace" font-size="8" fill="#C9A84C" opacity=".7" text-anchor="end">5M₪</text>
  <text x="52" y="53"  font-family="monospace" font-size="8" fill="#C9A84C" opacity=".7" text-anchor="end">3M₪</text>
  <text x="52" y="83"  font-family="monospace" font-size="8" fill="#C9A84C" opacity=".7" text-anchor="end">2M₪</text>
  <text x="120"  y="116" font-family="monospace" font-size="8" fill="#2A5080" text-anchor="middle">+1</text>
  <text x="240"  y="116" font-family="monospace" font-size="8" fill="#2A5080" text-anchor="middle">+3</text>
  <text x="420"  y="116" font-family="monospace" font-size="8" fill="#2A5080" text-anchor="middle">+6</text>
  <text x="600"  y="116" font-family="monospace" font-size="8" fill="#C9A84C" text-anchor="middle">+10 ans</text>
  <polygon points="60,90 120,86 180,82 240,78 300,72 360,66 420,58 480,50 540,41 600,32 660,24 660,110 60,110"
    fill="#C9A84C" opacity=".08"/>
  <polyline points="60,90 120,86 180,82 240,78 300,72 360,66 420,58 480,50 540,41 600,32 660,24"
    fill="none" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="120" cy="86" r="3" fill="#C9A84C"/>
  <circle cx="240" cy="78" r="3" fill="#C9A84C"/>
  <circle cx="420" cy="58" r="3" fill="#C9A84C"/>
  <circle cx="600" cy="32" r="4" fill="#C9A84C"/>
  <polyline points="60,80 120,82 180,84 240,86 300,88 360,90 420,92 480,94 540,96 600,98 660,100"
    fill="none" stroke="#378ADD" stroke-width="1.5" stroke-dasharray="5,3" stroke-linecap="round" opacity=".7"/>
  <text x="664" y="22" font-family="monospace" font-size="9" fill="#C9A84C" font-weight="bold">2.82M₪</text>
  <rect x="80" y="12" width="8" height="2" rx="1" fill="#C9A84C"/>
  <text x="92" y="15" font-family="monospace" font-size="8" fill="#C9A84C" opacity=".8">Valeur du bien</text>
  <line x1="180" y1="13" x2="190" y2="13" stroke="#378ADD" stroke-width="1.5" stroke-dasharray="3,2"/>
  <text x="194" y="15" font-family="monospace" font-size="8" fill="#378ADD" opacity=".8">CF cumulé</text>
</svg>
```

---

## ONGLET 4 — Bilan promoteur : bâtiment en construction avec grue

```svg
<svg width="100%" viewBox="0 0 680 120" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <rect width="680" height="120" fill="#0A1C2E"/>
  <line x1="80" y1="10" x2="80"  y2="110" stroke="#2A5080" stroke-width="3"/>
  <line x1="80" y1="18" x2="280" y2="18"  stroke="#2A5080" stroke-width="2.5"/>
  <line x1="80"  y1="18" x2="100" y2="38" stroke="#2A5080" stroke-width="1.2" opacity=".6"/>
  <line x1="140" y1="18" x2="160" y2="38" stroke="#2A5080" stroke-width="1.2" opacity=".6"/>
  <line x1="200" y1="18" x2="220" y2="38" stroke="#2A5080" stroke-width="1.2" opacity=".6"/>
  <line x1="260" y1="18" x2="280" y2="38" stroke="#2A5080" stroke-width="1.2" opacity=".6"/>
  <line x1="240" y1="18" x2="240" y2="55" stroke="#C9A84C" stroke-width="1" opacity=".7"/>
  <rect x="228" y="55" width="24" height="14" rx="2" fill="#C9A84C" opacity=".4"/>
  <rect x="300" y="30" width="180" height="90" fill="none"   stroke="#2A5080" stroke-width="1.5"/>
  <rect x="300" y="90" width="180" height="30" fill="#112840"/>
  <rect x="300" y="60" width="180" height="30" fill="#0E2035" stroke="#1A3A5C" stroke-width=".5"/>
  <rect x="300" y="30" width="180" height="30" fill="none"   stroke="#1A3A5C" stroke-width=".5" opacity=".5"/>
  <line x1="320" y1="30" x2="320" y2="10" stroke="#2A5080" stroke-width="1.5"/>
  <line x1="350" y1="30" x2="350" y2="8"  stroke="#2A5080" stroke-width="1.5"/>
  <line x1="380" y1="30" x2="380" y2="10" stroke="#2A5080" stroke-width="1.5"/>
  <line x1="410" y1="30" x2="410" y2="8"  stroke="#2A5080" stroke-width="1.5"/>
  <line x1="440" y1="30" x2="440" y2="10" stroke="#2A5080" stroke-width="1.5"/>
  <line x1="460" y1="30" x2="460" y2="8"  stroke="#2A5080" stroke-width="1.5"/>
  <line x1="308" y1="12" x2="462" y2="12" stroke="#2A5080" stroke-width="1.2" opacity=".5"/>
  <rect x="315" y="96" width="18" height="18" rx="1" fill="#1A3A5C" stroke="#2A5080" stroke-width=".8"/>
  <rect x="345" y="96" width="18" height="18" rx="1" fill="#1A3A5C" stroke="#2A5080" stroke-width=".8"/>
  <rect x="375" y="96" width="18" height="18" rx="1" fill="#C9A84C" opacity=".3" stroke="#C9A84C" stroke-width=".8"/>
  <rect x="405" y="96" width="18" height="18" rx="1" fill="#1A3A5C" stroke="#2A5080" stroke-width=".8"/>
  <rect x="435" y="96" width="18" height="18" rx="1" fill="#1A3A5C" stroke="#2A5080" stroke-width=".8"/>
  <rect x="315" y="66" width="18" height="18" rx="1" fill="#C9A84C" opacity=".25" stroke="#C9A84C" stroke-width=".8"/>
  <rect x="345" y="66" width="18" height="18" rx="1" fill="#1A3A5C" stroke="#2A5080" stroke-width=".8"/>
  <rect x="405" y="66" width="18" height="18" rx="1" fill="#C9A84C" opacity=".25" stroke="#C9A84C" stroke-width=".8"/>
  <rect x="435" y="66" width="18" height="18" rx="1" fill="#1A3A5C" stroke="#2A5080" stroke-width=".8"/>
  <rect x="510" y="50" width="60"  height="70" fill="#112840" stroke="#1A3A5C" stroke-width=".5"/>
  <rect x="580" y="35" width="90"  height="85" fill="#0E2035" stroke="#1A3A5C" stroke-width=".5"/>
  <rect x="520" y="57" width="8" height="7" rx=".5" fill="#C9A84C" opacity=".5"/>
  <rect x="533" y="57" width="8" height="7" rx=".5" fill="#C9A84C" opacity=".3"/>
  <rect x="590" y="44" width="9" height="7" rx=".5" fill="#C9A84C" opacity=".6"/>
  <rect x="605" y="44" width="9" height="7" rx=".5" fill="#C9A84C" opacity=".4"/>
  <rect x="620" y="44" width="9" height="7" rx=".5" fill="#C9A84C" opacity=".5"/>
  <rect x="0" y="110" width="680" height="10" fill="#081624"/>
</svg>
```

---

## ONGLET 5 — Fiscalité : documents officiels israéliens + shekel

```svg
<svg width="100%" viewBox="0 0 680 120" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <rect width="680" height="120" fill="#0C1E30"/>
  <rect x="60"  y="15" width="120" height="90" rx="4" fill="#112840" stroke="#1A3A5C" stroke-width="1"/>
  <rect x="60"  y="15" width="120" height="22" rx="4" fill="#1A3A5C"/>
  <rect x="60"  y="29" width="120" height="8"  fill="#1A3A5C"/>
  <text x="120" y="31" font-family="monospace" font-size="9" fill="#C9A84C" text-anchor="middle" font-weight="bold">מס רכישה</text>
  <rect x="72" y="46" width="60" height="3" rx="1" fill="#2A5080"/>
  <rect x="72" y="53" width="85" height="3" rx="1" fill="#2A5080"/>
  <rect x="72" y="60" width="70" height="3" rx="1" fill="#2A5080"/>
  <rect x="72" y="67" width="90" height="3" rx="1" fill="#2A5080"/>
  <rect x="72" y="74" width="50" height="3" rx="1" fill="#2A5080"/>
  <text x="120" y="98" font-family="monospace" font-size="12" fill="#C9A84C" text-anchor="middle" font-weight="bold">₪48,000</text>
  <rect x="210" y="25" width="110" height="80" rx="4" fill="#112840" stroke="#1A3A5C" stroke-width="1"/>
  <rect x="210" y="25" width="110" height="20" rx="4" fill="#163050"/>
  <text x="265" y="39" font-family="monospace" font-size="8" fill="#85B7EB" text-anchor="middle">מס שבח</text>
  <rect x="220" y="52" width="55" height="3" rx="1" fill="#2A5080"/>
  <rect x="220" y="59" width="78" height="3" rx="1" fill="#2A5080"/>
  <rect x="220" y="66" width="65" height="3" rx="1" fill="#2A5080"/>
  <text x="265" y="90" font-family="monospace" font-size="11" fill="#85B7EB" text-anchor="middle" font-weight="bold">25%</text>
  <rect x="350" y="20" width="115" height="85" rx="4" fill="#112840" stroke="#C9A84C" stroke-width="1.5"/>
  <rect x="350" y="20" width="115" height="20" rx="4" fill="#1A3050"/>
  <text x="407" y="34" font-family="monospace" font-size="8" fill="#C9A84C" text-anchor="middle">עולה חדש</text>
  <rect x="360" y="47" width="55" height="3" rx="1" fill="#2A5080"/>
  <rect x="360" y="54" width="78" height="3" rx="1" fill="#2A5080"/>
  <rect x="360" y="61" width="45" height="3" rx="1" fill="#2A5080"/>
  <text x="407" y="85" font-family="monospace" font-size="10" fill="#C9A84C" text-anchor="middle" font-weight="bold">0.5%</text>
  <text x="407" y="97" font-family="monospace" font-size="8" fill="#C9A84C" opacity=".6" text-anchor="middle">réduction olim</text>
  <circle cx="560" cy="60" r="38" fill="#112840" stroke="#C9A84C" stroke-width="2"/>
  <circle cx="560" cy="60" r="30" fill="none" stroke="#C9A84C" stroke-width=".8" opacity=".3"/>
  <text x="560" y="68" font-family="Georgia,serif" font-size="28" fill="#C9A84C" text-anchor="middle" font-weight="bold">₪</text>
  <line x1="560" y1="14"  x2="560" y2="8"   stroke="#C9A84C" stroke-width="1.5" opacity=".3"/>
  <line x1="560" y1="106" x2="560" y2="112"  stroke="#C9A84C" stroke-width="1.5" opacity=".3"/>
  <line x1="514" y1="60"  x2="508" y2="60"   stroke="#C9A84C" stroke-width="1.5" opacity=".3"/>
  <line x1="606" y1="60"  x2="612" y2="60"   stroke="#C9A84C" stroke-width="1.5" opacity=".3"/>
  <line x1="527" y1="27"  x2="523" y2="23"   stroke="#C9A84C" stroke-width="1.2" opacity=".2"/>
  <line x1="593" y1="93"  x2="597" y2="97"   stroke="#C9A84C" stroke-width="1.2" opacity=".2"/>
  <line x1="593" y1="27"  x2="597" y2="23"   stroke="#C9A84C" stroke-width="1.2" opacity=".2"/>
  <line x1="527" y1="93"  x2="523" y2="97"   stroke="#C9A84C" stroke-width="1.2" opacity=".2"/>
</svg>
```

---

## Résumé des fichiers à modifier

| Onglet | SVG à remplacer |
|---|---|
| Estimation | Skyline Tel Aviv nuit |
| Potentiel urbanistique | Plan cadastral avec Gush/Helka |
| Analyse investisseur | Courbe valeur bien + CF cumulé |
| Bilan promoteur | Chantier avec grue |
| Fiscalité | Documents מס רכישה / מס שבח / עולה חדש + pièce ₪ |

Ne modifie rien d'autre que les illustrations de bannière.
