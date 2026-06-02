# Prompt Replit — Affichage des sources dans l'onglet Travaux

## Objectif

Ajouter une section "Sources & fiabilité" en bas de l'onglet Travaux,
et une mention légale courte sous chaque résultat de calcul.
Ne touche à aucun autre onglet.

---

## MODIFICATION 1 — Mention courte sous le résultat principal

Dans `TravauxTab.jsx`, juste après le bloc "résultat principal"
(la div avec le prix estimé et la fourchette), ajoute :

```jsx
<p style={{
  fontSize: 11,
  color: '#6B7280',
  marginTop: 8,
  lineHeight: 1.5,
  borderLeft: '2px solid #C9A84C',
  paddingLeft: 8,
}}>
  Estimation indicative basée sur AllBatim, Deal Estate Israel et Kablay (2025–2026).
  Les écarts réels peuvent atteindre ±20–30% selon le kablan.{' '}
  <strong style={{ color: '#1A3A5C' }}>Obtenez au minimum 3 devis.</strong>
</p>
```

---

## MODIFICATION 2 — Section sources complète en bas de l'onglet

Toujours dans `TravauxTab.jsx`, après toute la grille (colonne gauche + droite),
ajoute ce bloc pleine largeur :

```jsx
{/* ── SECTION SOURCES ── */}
<div style={{
  marginTop: '2rem',
  borderTop: '0.5px solid #E5E7EB',
  paddingTop: '1.5rem',
  gridColumn: '1 / -1',   // pleine largeur si dans un grid
}}>

  <h3 style={{
    fontSize: 12,
    fontWeight: 600,
    color: '#1A3A5C',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '1rem',
  }}>
    Sources et niveau de fiabilité des estimations
  </h3>

  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>

    {/* Carte source 1 — AllBatim */}
    <SourceCard
      fiabilite="confirmé"
      titre="AllBatim.co.il"
      url="https://allbatim.com/fr/guides/cout-renovation-israel"
      date="Mis à jour avril 2026"
      donnees={[
        'Rafraîchissement : 1 500–2 500 ₪/m²',
        'Rénovation moyenne : 2 500–4 000 ₪/m²',
        'Rénovation complète : 4 000–6 000 ₪/m²',
        'Cuisine neuve : 30 000–80 000 ₪',
        'Salle de bain : 20 000–50 000 ₪',
      ]}
    />

    {/* Carte source 2 — Deal Estate */}
    <SourceCard
      fiabilite="confirmé"
      titre="DealEstateIsrael.com"
      url="https://dealestateisrael.com/renovation-costs-israel/"
      date="2025"
      donnees={[
        'Cosmétique : 1 000–2 500 ₪/m²',
        'Standard complet : 3 000–5 500 ₪/m²',
        'Gut renovation : 6 000–8 500 ₪/m²',
        'Luxe : 9 000–12 000+ ₪/m²',
        '90m² standard = 270 000–450 000 ₪',
        'ROI Jérusalem rénové : 18–25% en 18 mois',
      ]}
    />

    {/* Carte source 3 — Kablay */}
    <SourceCard
      fiabilite="confirmé"
      titre="Kablay.co.il"
      url="https://kablay.co.il/en/category/renovation/prices"
      date="2026"
      donnees={[
        'Plateforme artisans israéliens avec grilles tarifaires directes',
        'Bureau complet turnkey (HVAC inclus) : à partir de 3 600 ₪/m²',
        'Référence terrain utilisée par les entrepreneurs locaux',
      ]}
    />

    {/* Carte source 4 — Marshanski */}
    <SourceCard
      fiabilite="confirmé"
      titre="Marshanski.com"
      url="https://marshanski.com/timeline-and-cost-comparison-building-new-vs-renovating-existing-homes-in-israel/"
      date="Mars 2026"
      donnees={[
        'Gut renovation : 4 000–9 000 ₪/m²',
        'Découvertes en démolition (bâtiments anciens) : +15 à +30% du budget',
        'Avant 1990 : risque amiante (toiture, carrelage)',
        'Avant 2000 : tableaux électriques vétustes, plomberie fonte, humidité',
      ]}
    />

    {/* Carte source 5 — Reddit / terrain */}
    <SourceCard
      fiabilite="terrain"
      titre="Reddit r/aliyah + retours investisseurs"
      url="https://www.reddit.com/r/aliyah/comments/1ttu0fm/"
      date="2024–2025"
      donnees={[
        'Budget 20–30% au-dessus du devis initial : très fréquent',
        'Effet Madad (index construction) : impact direct sur chantiers longs',
        'Écarts de devis entre kablanim : jusqu\'à ×2 pour le même chantier',
      ]}
    />

    {/* Carte ce qui est estimé */}
    <SourceCard
      fiabilite="estimé"
      titre="Coefficients extrapolés (sans source directe)"
      url={null}
      date={null}
      donnees={[
        'Coef. localisation par ville (×0.80 à ×1.35) : déduits des écarts de prix immobiliers entre villes',
        'Répartition % par poste (cuisine 20%, SDB 15%...) : pratique BTP générale, non publié en Israël',
        'Impact sur la valeur après travaux (+3 à +38%) : extrapolé depuis les ROI régionaux Deal Estate',
        'Coef. complexité chantier (sans ascenseur, accès difficile) : estimation raisonnée',
      ]}
    />

  </div>

  {/* Avertissement global */}
  <div style={{
    marginTop: '1rem',
    background: '#FAEEDA',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 12,
    color: '#633806',
    lineHeight: 1.6,
  }}>
    <strong>Important :</strong> Ces estimations sont des ordres de grandeur basés sur des données
    de marché publiques 2025–2026. Les prix réels varient fortement selon le kablan, les matériaux
    choisis, la découverte de problèmes structurels, et l'évolution de l'index construction (Madad).
    Ce simulateur ne remplace pas un devis professionnel.
    <strong> Consultez au minimum 3 kablanim avant de vous engager.</strong>
  </div>

</div>
```

---

## MODIFICATION 3 — Composant SourceCard à créer

Dans `src/components/ui.jsx` (ou dans `TravauxTab.jsx` directement),
ajoute ce composant :

```jsx
const FIABILITE_CONFIG = {
  'confirmé': {
    label: '✓ Confirmé',
    bg: '#EAF3DE',
    color: '#27500A',
  },
  'estimé': {
    label: '~ Estimé / extrapolé',
    bg: '#FAEEDA',
    color: '#633806',
  },
  'terrain': {
    label: '↗ Retour terrain',
    bg: '#E6F1FB',
    color: '#0C447C',
  },
}

function SourceCard({ fiabilite, titre, url, date, donnees }) {
  const config = FIABILITE_CONFIG[fiabilite] || FIABILITE_CONFIG['estimé']
  return (
    <div style={{
      background: 'white',
      border: '0.5px solid #E5E7EB',
      borderRadius: 10,
      padding: '12px 14px',
    }}>
      {/* Badge fiabilité */}
      <span style={{
        display: 'inline-block',
        fontSize: 10,
        fontWeight: 600,
        padding: '2px 7px',
        borderRadius: 4,
        background: config.bg,
        color: config.color,
        marginBottom: 6,
      }}>
        {config.label}
      </span>

      {/* Titre + lien */}
      <div style={{ marginBottom: 6 }}>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 13, fontWeight: 600, color: '#1A3A5C', textDecoration: 'none' }}
          >
            {titre} ↗
          </a>
        ) : (
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1A3A5C' }}>{titre}</span>
        )}
        {date && (
          <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 6 }}>{date}</span>
        )}
      </div>

      {/* Données extraites */}
      <ul style={{ paddingLeft: 14, margin: 0 }}>
        {donnees.map((d, i) => (
          <li key={i} style={{ fontSize: 11, color: '#4B5563', marginBottom: 3, lineHeight: 1.4 }}>
            {d}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## MODIFICATION 4 — Légende des badges dans le header de la section

Juste avant la grille de cartes, ajoute la légende :

```jsx
<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
  {Object.entries(FIABILITE_CONFIG).map(([key, cfg]) => (
    <span key={key} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 11,
      color: '#6B7280',
    }}>
      <span style={{
        display: 'inline-block',
        padding: '1px 6px',
        borderRadius: 4,
        fontWeight: 600,
        fontSize: 10,
        background: cfg.bg,
        color: cfg.color,
      }}>
        {cfg.label}
      </span>
    </span>
  ))}
  <span style={{ fontSize: 11, color: '#9CA3AF' }}>— niveau de fiabilité de chaque donnée</span>
</div>
```

---

## Résumé des modifications

| Fichier | Modification |
|---|---|
| `src/components/TravauxTab.jsx` | Mention courte sous le prix + section Sources complète |
| `src/components/ui.jsx` | Nouveau composant `SourceCard` |

Aucun autre fichier n'est touché.
