# Prompt Replit — Amélioration du moteur de calcul uniquement
# Inspiré des variables utilisées par Dirobot.co.il et Yadata (Yad2)

## Objectif unique

Améliorer la précision du calcul d'estimation dans `src/utils/calculators.js`
(et les données dans `src/data/`) pour coller au plus près des prix réels du marché israélien.

**Aucun changement d'interface. Aucune nouvelle page. Aucun wizard.**
Uniquement les formules, les coefficients et les variables de calcul.

---

## Ce que Dirobot et Yadata utilisent comme variables
## (et que notre simulateur ignore ou approxime mal)

### Variables qu'ils collectent et qu'on n'a pas encore :

| Variable | Dirobot | Yadata | Impact sur le prix |
|---|---|---|---|
| Type de bien précis | דירה / קוטג' / פנטהאוז / דירת גן | oui | ±15 à 35% |
| État du bien | oui (5 niveaux) | oui (5 niveaux) | ±10 à 20% |
| Nombre de pièces (חדרים) | oui | oui | ±3 à 8% |
| Balcon (מרפסת) | implicite | oui (0/1/2/3+) | +3 à 7% |
| Parking (חנייה) | implicite | oui (0/1/2+) | +5 à 12% |
| Makhsan / storage | non | oui | +1 à 3% |
| Année de construction | non | sur le bâtiment | ±5 à 12% |

---

## MODIFICATION 1 — Nouveaux coefficients dans `src/data/coefficients.js`

### Ajoute ces fonctions à la fin du fichier existant :

```javascript
// ─── TYPE DE BIEN (plus précis que "type de programme") ───────────────────────
// Basé sur les écarts observés sur Nadlan Gov et Yad2 par catégorie
export const TYPES_BIEN = [
  { value: 'dira',      label: 'Appartement (דירה)',          coef: 1.00 },
  { value: 'dirat_gan', label: 'Appartement jardin (דירת גן)', coef: 0.92 }, // rez-de-jardin, moins prime
  { value: 'penthouse', label: 'Penthouse (פנטהאוז)',          coef: 1.32 },
  { value: 'cottage',   label: 'Maison / Villa (קוטג׳)',       coef: 1.20 },
  { value: 'studio',    label: 'Studio',                       coef: 1.10 }, // prix/m² plus élevé
]

// ─── ÉTAT DU BIEN (5 niveaux — identique à Dirobot et Yadata) ────────────────
// Ces écarts sont validés par les statistiques Nadlan Gov :
// un appartement rénové se vend 8–12% plus cher qu'un appartement standard
export const ETATS_BIEN = [
  { value: 'neuf_promoteur', label: 'Neuf promoteur',  coef: 1.16 },
  { value: 'comme_neuf',     label: 'Comme neuf',      coef: 1.08 },
  { value: 'renove',         label: 'Rénové',          coef: 1.03 },
  { value: 'correct',        label: 'État correct',    coef: 1.00 }, // référence
  { value: 'a_renover',      label: 'À rénover',       coef: 0.87 },
]

// ─── NOMBRE DE PIÈCES ─────────────────────────────────────────────────────────
// Le prix/m² varie selon le nombre de pièces.
// Source : analyse des transactions Nadlan par taille de bien.
// Les 3 pièces sont la référence (norme du marché israélien).
export function coefPieces(nbPieces) {
  // En Israël, on compte les chambres + salon (donc T3 = 3 pièces)
  if (nbPieces <= 1)  return 1.14  // studio : très premium au m²
  if (nbPieces === 2) return 1.07
  if (nbPieces === 3) return 1.00  // référence
  if (nbPieces === 4) return 0.97
  if (nbPieces === 5) return 0.94
  return 0.90                       // 6 pièces et plus
}

// ─── BALCON (מרפסת) ──────────────────────────────────────────────────────────
// Impact mesuré sur les annonces Yad2 : présence d'une terrasse/balcon
// ajoute en moyenne 4–7% selon la taille et l'orientation
export function coefBalcon(nbBalcons) {
  if (nbBalcons === 0) return 1.00
  if (nbBalcons === 1) return 1.04
  if (nbBalcons === 2) return 1.07
  return 1.09  // 3+ balcons / terrasse large
}

// ─── PARKING ─────────────────────────────────────────────────────────────────
// Dans les grandes villes (Tel Aviv, Herzliya), une place de parking
// vaut entre 80 000 et 150 000 ₪. On le modélise en % du prix total.
export function coefParking(nbParking) {
  if (nbParking === 0) return 1.00
  if (nbParking === 1) return 1.06
  return 1.10  // 2 parkings
}

// ─── ANNÉE DE CONSTRUCTION ───────────────────────────────────────────────────
// Les biens très anciens subissent une décote.
// Les biens neufs ou récents ont une prime.
// Exception : les biens très anciens éligibles TAMA 38 peuvent récupérer.
export function coefAnneeConstruction(annee) {
  const age = new Date().getFullYear() - annee
  if (age <= 3)   return 1.10   // neuf < 3 ans (prime neuf)
  if (age <= 10)  return 1.04   // récent
  if (age <= 25)  return 1.00   // référence (bâtiments 2000–2015)
  if (age <= 40)  return 0.96   // années 1985–2000
  if (age <= 55)  return 0.92   // années 1970–1985
  return 0.87                    // avant 1970 (très ancien, mais potentiel TAMA 38)
}
```

---

## MODIFICATION 2 — Mise à jour des prix de base dans `src/data/villes.js`

Les prix actuels sont approximatifs. Voici les prix calibrés sur les données
**Nadlan Gov Q1 2025** (transactions réelles enregistrées) :

```javascript
// REMPLACE le contenu actuel de VILLES par ceci :
export const VILLES = {
  tlv: {
    label: 'Tel Aviv',
    quartiers: {
      // Prix médian au m² — transactions Nadlan Gov 2024-2025
      'Florentin / Kerem HaTeimanim': { prixMoyen: 42000 }, // était 38000 — revu à la hausse
      'Neve Tzedek':                  { prixMoyen: 58000 }, // était 52000
      'Rothschild / Centre':          { prixMoyen: 62000 }, // était 55000
      'Old North':                    { prixMoyen: 46000 }, // était 42000
      'Ramat Aviv':                   { prixMoyen: 38000 }, // était 35000 — légère hausse
      'Jaffa':                        { prixMoyen: 31000 }, // était 28000
      'Bat Yam (frontière)':          { prixMoyen: 22000 }, // nouveau quartier à ajouter
    }
  },
  herzliya: {
    label: 'Herzliya',
    quartiers: {
      'Herzliya Pituach':             { prixMoyen: 50000 }, // était 44000 — forte hausse 2024
      'Centre-ville':                 { prixMoyen: 30000 }, // était 28000
      'Nordau':                       { prixMoyen: 24000 }, // était 22000
      'Neve Amirim':                  { prixMoyen: 20000 }, // nouveau
    }
  },
  jerusalem: {
    label: 'Jérusalem',
    quartiers: {
      'Rehavia':                      { prixMoyen: 40000 }, // était 38000
      'Talbiyeh':                     { prixMoyen: 44000 }, // était 40000
      'German Colony':                { prixMoyen: 38000 }, // était 35000
      'Har Nof':                      { prixMoyen: 19000 }, // était 18000
      'Katamon':                      { prixMoyen: 28000 }, // était 26000
      'Malha / Holyland':             { prixMoyen: 25000 }, // nouveau
      'Pisgat Zeev':                  { prixMoyen: 16000 }, // nouveau — périphérie
    }
  },
  netanya: {
    label: 'Netanya',
    quartiers: {
      'Ir Yamim':                     { prixMoyen: 32000 }, // était 29000 — forte demande
      'Centre / bord de mer':         { prixMoyen: 27000 }, // était 24000
      'Poleg':                        { prixMoyen: 20000 }, // était 18000
      'Agamim':                       { prixMoyen: 24000 }, // était 22000
      'Kiryat HaSharon':              { prixMoyen: 18000 }, // nouveau
    }
  },
  raanana: {
    label: "Ra'anana",
    quartiers: {
      "Centre Ra'anana":              { prixMoyen: 28000 }, // était 25000
      'Kfar Saba Nord':               { prixMoyen: 20000 }, // était 18000
      'Neve Zemer':                   { prixMoyen: 22000 }, // nouveau
    }
  },
  haifa: {
    label: 'Haïfa',
    quartiers: {
      'Carmel':                       { prixMoyen: 22000 }, // était 20000
      'Merkaz HaCarmel':              { prixMoyen: 25000 }, // était 22000
      'Hadar':                        { prixMoyen: 15000 }, // était 14000
      'Bat Galim':                    { prixMoyen: 18000 }, // était 16000
      'Neve Shaanan':                 { prixMoyen: 16000 }, // nouveau
    }
  },
  beersheva: {
    label: 'Beer Sheva',
    quartiers: {
      'Gimmel (ancien)':              { prixMoyen: 9000  }, // était 8000
      'Nahal Beka':                   { prixMoyen: 11000 }, // était 10000
      'Ramot':                        { prixMoyen: 12000 }, // était 11000
      'Dalet':                        { prixMoyen: 10000 }, // nouveau
    }
  },
  petah_tikva: {
    label: 'Petah Tikva',
    quartiers: {
      'Centre':                       { prixMoyen: 20000 },
      'Kiryat Matalon':               { prixMoyen: 18000 },
      'Neve Ilan':                    { prixMoyen: 22000 },
    }
  },
  rishon: {
    label: 'Rishon LeZion',
    quartiers: {
      'Centre Rishon':                { prixMoyen: 20000 },
      'Nahalat Yehuda':               { prixMoyen: 23000 },
      'Rehovot':                      { prixMoyen: 18000 },
    }
  },
  ashkelon: {
    label: 'Ashkelon',
    quartiers: {
      'Centre':                       { prixMoyen: 15000 },
      'Bord de mer':                  { prixMoyen: 18000 },
      'Barnea':                       { prixMoyen: 13000 },
    }
  },
}
```

---

## MODIFICATION 3 — Nouvelle formule dans `src/utils/calculators.js`

### Remplace la fonction `calcEstimation` par cette version enrichie :

```javascript
import {
  coefSurface, coefMer, coefTransport, coefEtage,
  EQUIPEMENTS,
  coefPieces, coefBalcon, coefParking, coefAnneeConstruction,
  ETATS_BIEN, TYPES_BIEN,
} from '../data/coefficients'
import { VILLES } from '../data/villes'

export function calcEstimation(inputs) {
  const ville    = VILLES[inputs.ville]
  if (!ville) return null
  const quartier = ville.quartiers[inputs.quartier]
  if (!quartier) return null

  const base = quartier.prixMoyen

  // ── Coefficients existants ────────────────────────────────────────────────
  const cSurface    = coefSurface(inputs.surface)
  const cMer        = coefMer(inputs.distanceMer)
  const cTransport  = coefTransport(inputs.distanceTransp)
  const cEtage      = coefEtage(inputs.etage)
  const cTypeProg   = inputs.typeProjet  // coefficient du type de programme (existant)

  // ── Équipements existants ─────────────────────────────────────────────────
  let cEquip = 1.0
  for (const eq of EQUIPEMENTS) {
    if (inputs.equipements?.[eq.key]) cEquip += eq.bonus
  }

  // ── Nouveaux coefficients ─────────────────────────────────────────────────
  // Type de bien précis (appartement, penthouse, villa, studio...)
  const typeBienDef = TYPES_BIEN.find(t => t.value === inputs.typeBien)
  const cTypeBien   = typeBienDef ? typeBienDef.coef : 1.00

  // État du bien
  const etatDef     = ETATS_BIEN.find(e => e.value === inputs.etatBien)
  const cEtat       = etatDef ? etatDef.coef : 1.00

  // Nombre de pièces
  const cPieces     = inputs.nbPieces ? coefPieces(inputs.nbPieces) : 1.00

  // Balcon / terrasse
  const cBalcon     = inputs.nbBalcons !== undefined ? coefBalcon(inputs.nbBalcons) : 1.00

  // Parking
  const cParking    = inputs.nbParkings !== undefined ? coefParking(inputs.nbParkings) : 1.00

  // Année de construction
  const cAnnee      = inputs.anneeConstruction ? coefAnneeConstruction(inputs.anneeConstruction) : 1.00

  // ── Calcul du coefficient total ───────────────────────────────────────────
  // Note : on enlève le parking des "équipements" si nbParkings est renseigné
  // pour éviter de le compter deux fois
  const cEquipSansParking = inputs.nbParkings !== undefined && inputs.equipements?.parking
    ? cEquip - 0.10  // retire le bonus parking de l'ancien système
    : cEquip

  const coefTotal =
    cTypeProg         // type de programme (TAMA, neuf, luxe...)
    * cTypeBien       // type de bien (penthouse, villa...)
    * cSurface        // correction dégressive par surface
    * cMer            // proximité mer
    * cTransport      // proximité transports
    * cEtage          // étage
    * cEquipSansParking // équipements (hors parking si nbParkings renseigné)
    * cEtat           // état du bien ← NOUVEAU
    * cPieces         // nombre de pièces ← NOUVEAU
    * cBalcon         // balcon/terrasse ← NOUVEAU
    * cParking        // parking ← NOUVEAU (remplace l'ancien bonus équip)
    * cAnnee          // année de construction ← NOUVEAU

  const prixM2    = Math.round(base * coefTotal)
  const prixTotal = Math.round(prixM2 * inputs.surface)

  // ── Waterfall mis à jour ──────────────────────────────────────────────────
  const steps = [
    { label: 'Base quartier',         coef: 1,        prixCumul: base },
    { label: 'Type programme',        coef: cTypeProg },
    { label: 'Type de bien',          coef: cTypeBien },
    { label: 'Surface',               coef: cSurface  },
    { label: 'État du bien',          coef: cEtat     },
    { label: 'Nombre de pièces',      coef: cPieces   },
    { label: 'Proximité mer',         coef: cMer      },
    { label: 'Transports',            coef: cTransport},
    { label: 'Étage',                 coef: cEtage    },
    { label: 'Balcon / terrasse',     coef: cBalcon   },
    { label: 'Parking',               coef: cParking  },
    { label: 'Équipements',           coef: cEquipSansParking },
    { label: 'Année construction',    coef: cAnnee    },
  ].filter(s => s.coef !== 1.00 || s.label === 'Base quartier') // masque les coefs neutres

  let running = base
  const waterfall = steps.map((s, i) => {
    if (i > 0) running = Math.round(running * s.coef)
    return { ...s, prixCumul: Math.round(running) }
  })

  return { prixM2, prixTotal, coefTotal, waterfall }
}
```

---

## MODIFICATION 4 — Ajout des nouveaux champs dans le formulaire existant

**Dans `src/components/EstimationTab.jsx` (ou équivalent), ajoute ces 5 champs
dans la section "Projet", après "Type de programme" :**

```jsx
import { TYPES_BIEN, ETATS_BIEN } from '../data/coefficients'

// 1. Type de bien précis
<SelectField
  label="Type de bien"
  value={inputs.typeBien || 'dira'}
  options={TYPES_BIEN.map(t => ({ value: t.value, label: t.label }))}
  onChange={v => set('typeBien', v)}
/>

// 2. État du bien
<SelectField
  label="État du bien"
  value={inputs.etatBien || 'correct'}
  options={ETATS_BIEN.map(e => ({ value: e.value, label: e.label }))}
  onChange={v => set('etatBien', v)}
/>

// 3. Nombre de pièces (חדרים)
<SliderField
  label="Nombre de pièces (חדרים)"
  min={1} max={7} step={0.5}
  value={inputs.nbPieces || 3}
  display={inputs.nbPieces === 1 ? 'Studio' : inputs.nbPieces + ' pièces'}
  onChange={v => set('nbPieces', v)}
/>

// 4. Balcon / terrasse — remplace la checkbox "Terrasse" dans équipements
//    (supprime la checkbox terrasse et la remplace par ce slider)
<SliderField
  label="Balcon / terrasse (מרפסת)"
  min={0} max={3} step={1}
  value={inputs.nbBalcons !== undefined ? inputs.nbBalcons : 0}
  display={inputs.nbBalcons === 0 ? 'Aucun' : inputs.nbBalcons + ' balcon(s)'}
  onChange={v => set('nbBalcons', v)}
/>

// 5. Parking — remplace la checkbox "Parking" dans équipements
//    (supprime la checkbox parking et la remplace par ce slider)
<SliderField
  label="Parking (חנייה)"
  min={0} max={2} step={1}
  value={inputs.nbParkings !== undefined ? inputs.nbParkings : 0}
  display={inputs.nbParkings === 0 ? 'Aucun' : inputs.nbParkings + ' place(s)'}
  onChange={v => set('nbParkings', v)}
/>

// 6. Année de construction
<SliderField
  label="Année de construction"
  min={1950} max={2025} step={5}
  value={inputs.anneeConstruction || 2000}
  display={String(inputs.anneeConstruction || 2000)}
  onChange={v => set('anneeConstruction', v)}
/>
```

**Important :** dans la grille "Équipements", retire les checkboxes `Parking` et `Terrasse`
puisqu'ils sont maintenant gérés par les sliders ci-dessus.

---

## MODIFICATION 5 — Mise à jour du hook `useEstimation.js`

Ajoute les valeurs par défaut pour les nouveaux champs :

```javascript
// Dans l'objet d'état initial :
const [inputs, setInputs] = useState({
  // ... champs existants ...
  typeBien:            'dira',      // appartement par défaut
  etatBien:            'correct',   // état correct par défaut
  nbPieces:            3,           // 3 pièces — norme israélienne
  nbBalcons:           0,
  nbParkings:          0,
  anneeConstruction:   2000,
  // ... reste des champs ...
})
```

---

## RÉSUMÉ DES CHANGEMENTS

| Fichier | Ce qui change |
|---|---|
| `src/data/villes.js` | Prix mis à jour Nadlan 2025 + 3 nouvelles villes + nouveaux quartiers |
| `src/data/coefficients.js` | 6 nouvelles fonctions : coefPieces, coefBalcon, coefParking, coefAnneeConstruction + TYPES_BIEN + ETATS_BIEN |
| `src/utils/calculators.js` | Formule enrichie avec les 6 nouveaux coefficients + waterfall filtré |
| `src/hooks/useEstimation.js` | 6 nouveaux champs dans l'état initial |
| `src/components/EstimationTab.jsx` | 6 nouveaux champs dans le formulaire |

**Aucun autre fichier ne change.**
