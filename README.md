# Simulateur Immobilier Israël

Simulateur professionnel de valorisation immobilière pour le marché israélien.

## Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3 + @tailwindcss/forms
- lucide-react (icônes)

## Installation

```bash
npm install
npm run dev
```

L'application est accessible sur http://localhost:5173

## Structure du projet

```
src/
├── types/index.ts          — Tous les types TypeScript
├── data/
│   ├── villes.ts           — Prix par ville et quartier (₪/m²)
│   ├── coefficients.ts     — Fonctions de correction et équipements
│   └── accords.ts          — Statuts urbanistiques, accords municipaux, sources
├── utils/
│   ├── formatters.ts       — fmt(), fmtM(), fmtPct(), fmtM2()
│   └── calculators.ts      — Fonctions de calcul pures (testables)
├── hooks/
│   ├── useEstimation.ts    — State + calcul onglet Estimation
│   ├── useUrbanisme.ts     — State + calcul onglet Urbanisme
│   ├── useInvestisseur.ts  — State + calcul onglet Investisseur
│   └── usePromoteur.ts     — State + calcul onglet Promoteur
└── components/
    ├── ui.tsx              — Composants partagés (SliderField, MetricCard, etc.)
    ├── EstimationTab.tsx
    ├── UrbanismeTab.tsx
    └── FinanceTab.tsx      — InvestisseurTab + PromoteurTab
```

## Onglets

| Onglet | Utilisateur cible | Ce qu'il fait |
|--------|------------------|---------------|
| Estimation | Tout profil | Prix estimé au m² avec coefficients multi-critères |
| Potentiel urbanistique | Promoteurs / investisseurs | Score urbanistique, accords municipaux (TAMA 38, Pinouï-Binouï), droits à construire |
| Analyse investisseur | Investisseurs | Rendement, TRI, cash-flow, projection annuelle |
| Bilan promoteur | Promoteurs | CA, marge, sensibilité ±15% |

## Formule de valorisation

```
Prix estimé = prixBaseQuartier × surface
  × coefTypeProjet
  × coefSurface(surface)
  × coefMer(distanceMer)
  × coefTransport(distanceTransp)
  × coefEtage(etage)
  × coefEquipements
```

## Score urbanistique (0–100)

```
score = clamp(
  20
  + statutPlan.score × 0.5
  + accordMunicipal.score × 0.6
  + permis.score × 0.4
  + bonus_étages
  + bonus_droitsRestants,
  0, 100
)
```

## Sources de données recommandées

| Source | URL |
|--------|-----|
| Nadlan Gov (transactions) | https://www.nadlan.gov.il |
| Mavat (plans urbanistiques) | https://mavat.iplan.gov.il |
| GovMap (cadastre) | https://www.govmap.gov.il |
| CBS Israël | https://www.cbs.gov.il |
| Israel Land Authority | https://www.gov.il/en/departments/israel_land_authority |
| Banque d'Israël | https://www.boi.org.il/en |

## Pour aller plus loin

- Connecter l'API Nadlan Gov pour les prix réels par adresse
- Intégrer GovMap API pour le zonage automatique via coordonnées GPS
- Ajouter un champ adresse avec géocodage (Google Maps / GovMap) pour les distances automatiques
- Exporter le bilan promoteur en PDF
- Ajouter des graphiques de projection (recharts ou chart.js)
