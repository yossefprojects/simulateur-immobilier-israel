# Prompt Claude Code — Simulateur Immobilier Israël

## Contexte du projet

Tu vas construire un simulateur immobilier professionnel pour le marché israélien.
Stack : React + Vite + TypeScript + Tailwind CSS.

Ce simulateur est destiné à trois types d'utilisateurs :
- **Acheteurs / investisseurs particuliers** : estimation rapide d'un bien
- **Investisseurs professionnels** : analyse rendement locatif, TRI, cash-flow
- **Promoteurs immobiliers** : bilan promoteur complet, faisabilité, sensibilité

---

## Architecture à créer

```
israel-sim/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── TabNavigation.tsx
│   │   ├── estimation/
│   │   │   ├── EstimationForm.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   ├── CoefficientWaterfall.tsx
│   │   │   └── SensitivityGrid.tsx
│   │   ├── urbanisme/
│   │   │   ├── UrbanismeForm.tsx
│   │   │   ├── ScoreRing.tsx
│   │   │   ├── ValuationBanner.tsx
│   │   │   ├── DroitsTable.tsx
│   │   │   ├── ProgressTimeline.tsx
│   │   │   └── SourceLinks.tsx
│   │   ├── investisseur/
│   │   │   ├── InvestisseurForm.tsx
│   │   │   ├── CashflowTable.tsx
│   │   │   └── ProjectionTable.tsx
│   │   └── promoteur/
│   │       ├── PromoteurForm.tsx
│   │       ├── BilanTable.tsx
│   │       └── SensitivityTable.tsx
│   ├── data/
│   │   ├── villes.ts        — prix par ville/quartier
│   │   ├── coefficients.ts  — tous les coefficients de correction
│   │   └── accords.ts       — statuts urbanistiques et accords municipaux
│   ├── hooks/
│   │   ├── useEstimation.ts
│   │   ├── useUrbanisme.ts
│   │   ├── useInvestisseur.ts
│   │   └── usePromoteur.ts
│   ├── utils/
│   │   ├── formatters.ts    — fmt(), fmtM(), fmtPct()
│   │   └── calculators.ts   — fonctions de calcul pures
│   ├── types/
│   │   └── index.ts         — tous les types TypeScript
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Données de référence (à implémenter dans src/data/)

### villes.ts

```typescript
export const VILLES = {
  tlv: {
    label: "Tel Aviv",
    quartiers: {
      "Florentin / Kerem HaTeimanim": { prixMoyen: 38000 },
      "Neve Tzedek":                  { prixMoyen: 52000 },
      "Rothschild / Centre":          { prixMoyen: 55000 },
      "Old North":                    { prixMoyen: 42000 },
      "Ramat Aviv":                   { prixMoyen: 35000 },
      "Jaffa":                        { prixMoyen: 28000 },
    }
  },
  herzliya: {
    label: "Herzliya",
    quartiers: {
      "Herzliya Pituach": { prixMoyen: 44000 },
      "Centre-ville":     { prixMoyen: 28000 },
      "Nordau":           { prixMoyen: 22000 },
    }
  },
  jerusalem: {
    label: "Jérusalem",
    quartiers: {
      "Rehavia":        { prixMoyen: 38000 },
      "Talbiyeh":       { prixMoyen: 40000 },
      "German Colony":  { prixMoyen: 35000 },
      "Har Nof":        { prixMoyen: 18000 },
      "Katamon":        { prixMoyen: 26000 },
    }
  },
  netanya: {
    label: "Netanya",
    quartiers: {
      "Ir Yamim":             { prixMoyen: 29000 },
      "Centre / bord de mer": { prixMoyen: 24000 },
      "Poleg":                { prixMoyen: 18000 },
      "Agamim":               { prixMoyen: 22000 },
    }
  },
  raanana: {
    label: "Ra'anana",
    quartiers: {
      "Centre Ra'anana": { prixMoyen: 25000 },
      "Kfar Saba Nord":  { prixMoyen: 18000 },
    }
  },
  haifa: {
    label: "Haïfa",
    quartiers: {
      "Carmel":          { prixMoyen: 20000 },
      "Merkaz HaCarmel": { prixMoyen: 22000 },
      "Hadar":           { prixMoyen: 14000 },
      "Bat Galim":       { prixMoyen: 16000 },
    }
  },
  beersheva: {
    label: "Beer Sheva",
    quartiers: {
      "Gimmel (ancien)": { prixMoyen: 8000 },
      "Nahal Beka":      { prixMoyen: 10000 },
      "Ramot":           { prixMoyen: 11000 },
    }
  },
}
```

### coefficients.ts

```typescript
// Surface (prix/m² dégressif avec la taille)
export const coefSurface = (m2: number): number => {
  if (m2 < 50)  return 1.22
  if (m2 < 70)  return 1.12
  if (m2 < 100) return 1.04
  if (m2 < 140) return 0.94
  return 0.87
}

// Distance à la mer (en km)
export const coefMer = (km: number): number => {
  if (km <= 0.2) return 1.35
  if (km <= 0.5) return 1.20
  if (km <= 1.5) return 1.10
  if (km <= 5)   return 1.02
  if (km <= 10)  return 0.96
  return 0.90
}

// Distance aux transports (en km)
export const coefTransport = (km: number): number => {
  if (km <= 0.3) return 1.08
  if (km <= 1)   return 1.04
  if (km <= 3)   return 1.00
  if (km <= 8)   return 0.97
  return 0.93
}

// Étage
export const coefEtage = (etage: number): number => {
  if (etage === 0) return 0.90
  if (etage <= 2)  return 0.97
  if (etage <= 8)  return 1.02
  if (etage <= 15) return 1.06
  return 1.12
}

// Équipements (bonus cumulatifs)
export const EQUIPEMENTS = {
  ascenseur:  { label: "Ascenseur",       bonus: 0.05 },
  parking:    { label: "Parking",         bonus: 0.10 },
  mamad:      { label: "Mamad",           bonus: 0.06 },
  terrasse:   { label: "Terrasse",        bonus: 0.07 },
  vueMer:     { label: "Vue mer",         bonus: 0.20 },
  vueDeg:     { label: "Vue dégagée",     bonus: 0.06 },
  gardien:    { label: "Gardiennage",     bonus: 0.03 },
  piscine:    { label: "Piscine commune", bonus: 0.04 },
  gym:        { label: "Salle de sport",  bonus: 0.03 },
}
```

### accords.ts

```typescript
export const ACCORDS_MUNICIPAUX = {
  none:         { label: "Aucun projet",               coef: 1.00, score: 0  },
  tama38_etude: { label: "TAMA 38 en étude",           coef: 1.05, score: 15 },
  tama38_ok:    { label: "TAMA 38 approuvé",           coef: 1.15, score: 35 },
  pb_etude:     { label: "Pinouï-Binouï en étude",     coef: 1.10, score: 25 },
  pb_ok:        { label: "Pinouï-Binouï approuvé",     coef: 1.30, score: 55 },
  pc_ok:        { label: "Permis de construire obtenu",coef: 1.40, score: 70 },
  chantier:     { label: "Chantier démarré",           coef: 1.50, score: 85 },
}

export const STATUTS_PLAN = {
  approved:  { label: "Taba approuvée",          score: 30, coef: 1.00 },
  pending:   { label: "Plan en cours",           score: 20, coef: 0.97 },
  study:     { label: "En étude",                score: 10, coef: 0.94 },
  protected: { label: "Zone protégée/patrimoine",score: 0,  coef: 0.85 },
  renewal:   { label: "Renouvellement urbain",   score: 25, coef: 1.05 },
  priority:  { label: "Secteur prioritaire",     score: 22, coef: 1.03 },
}

export const STATUTS_PERMIS = {
  none:       { label: "Aucun permis déposé",       score: 0,   coef: 1.00 },
  depose:     { label: "Permis déposé (instruction)",score: 10, coef: 1.05 },
  accorde:    { label: "Permis accordé",            score: 25,  coef: 1.15 },
  opposition: { label: "Opposition en cours",       score: -10, coef: 0.93 },
}
```

---

## Formule de calcul (à implémenter dans utils/calculators.ts)

```
Prix estimé =
  prixBaseQuartier (₪/m²)
  × surface (m²)
  × coefTypeProjet
  × coefSurface(surface)
  × coefMer(distanceMer)
  × coefTransport(distanceTransport)
  × coefEtage(etage)
  × coefEquipements (1 + somme des bonus actifs)
```

**Score urbanistique** (0–100) :
```
score = clamp(
  20
  + planStatut.score × 0.5
  + accordMunicipal.score × 0.6
  + permis.score × 0.4
  + (etagesAutorisés > 15 ? 10 : etagesAutorisés > 8 ? 5 : 0)
  + (droitsRestants > 500 ? 8 : droitsRestants > 200 ? 4 : 0),
  0, 100
)
```

**Droits à construire** :
```
surfaceMax    = surfaceTerrain × COS
droitsRestants = surfaceMax − surfaceExistante
```

**Bilan promoteur** :
```
surfaceTotale  = terrain × COS
surfaceVendable= surfaceTotale × ratioVendable
CA             = surfaceVendable × prixVente
coutConstruct  = surfaceTotale × coutParM2
frais          = coutConstruct × tauxFrais
commerc        = CA × tauxCommercialisation
portage        = (coutTerrain + coutConstruct) × tauxPortage
coutTotal      = terrain + coutConstruct + frais + commerc + portage
margeB         = CA − coutTotal
```

---

## UI et comportement attendus

### Onglets principaux
1. **Estimation** — formulaire gauche + résultats droite, recalcul en temps réel
2. **Potentiel urbanistique** — score ring SVG + valorisation projetée + timeline d'avancement
3. **Analyse investisseur** — métriques financières + cash-flow + projection annuelle
4. **Bilan promoteur** — bilan structuré + sensibilité ±15% sur le prix de vente

### Composant `ScoreRing`
- SVG circulaire, rayon 34px, stroke-dasharray pour le remplissage
- Couleur dynamique : vert (#0F6E56) si score ≥ 70, orange (#BA7517) si ≥ 45, rouge (#993C1D) sinon
- Valeur du score affichée au centre en 20px/500

### Composant `CoefficientWaterfall`
- Barre horizontale par étape de calcul
- Largeur proportionnelle au prix courant / prix final
- Opacité croissante de l'étape 1 à 7
- Valeur ₪ affichée à droite de chaque barre

### Composant `ValuationBanner`
- Prix actuel barré → prix projeté en grand
- Plus-value en vert avec signe +

### Composant `ProgressTimeline`
- 4 étapes : Taba → Accord municipal → Permis → Chantier
- Icône check (vert) / clock (bleu) / circle (gris) selon état

---

## Formatage des nombres

```typescript
// utils/formatters.ts
export const fmt  = (n: number) => Math.round(n).toLocaleString('fr-FR')
export const fmtM = (n: number) =>
  n >= 1_000_000
    ? (n / 1_000_000).toFixed(2) + 'M₪'
    : fmt(n) + '₪'
export const fmtPct = (n: number) => n.toFixed(2) + '%'
```

---

## Liens externes à intégrer dans l'onglet Urbanisme

| Source          | URL                                  |
|-----------------|--------------------------------------|
| Mavat (plans)   | https://mavat.iplan.gov.il           |
| GovMap          | https://www.govmap.gov.il            |
| Nadlan Gov      | https://www.nadlan.gov.il            |
| Israel Land Auth| https://www.gov.il/en/departments/israel_land_authority |
| CBS Israël      | https://www.cbs.gov.il               |

---

## Instructions pour Claude Code

1. Initialise le projet avec `npm create vite@latest israel-sim -- --template react-ts`
2. Installe les dépendances : `tailwindcss`, `@tailwindcss/forms`, `lucide-react`
3. Configure Tailwind avec le preset `forms`
4. Crée tous les fichiers listés dans l'architecture ci-dessus
5. Implémenter chaque onglet avec ses composants dédiés
6. Tous les calculs doivent être dans `utils/calculators.ts` (fonctions pures, testables)
7. Chaque onglet a son propre custom hook dans `hooks/`
8. Le recalcul est déclenché à chaque changement d'input (pas de bouton "Calculer")
9. Les nombres affichés passent TOUJOURS par `fmt()` ou `fmtM()` — jamais de float brut à l'écran
10. Responsive : 2 colonnes sur desktop (≥768px), 1 colonne sur mobile

---

## Commande de lancement pour Claude Code

```bash
cd israel-sim && npm install && npm run dev
```
