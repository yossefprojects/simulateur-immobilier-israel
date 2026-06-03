# Prompt Replit — Plateforme immobilière Israël
# Mise en relation Agences × Promoteurs × Acheteurs

---

## Concept

Plateforme B2B2C tripartite pour le marché immobilier israélien :
- **Promoteurs** publient leurs programmes neufs
- **Agences immobilières** mandatées pour vendre ces programmes
- **Acheteurs** (résidents israéliens + diaspora francophone + investisseurs internationaux)
  découvrent, comparent et contactent via la plateforme

Modèle économique : abonnement mensuel (agences/promoteurs) + commission sur transaction.

---

## Stack technique

- **React + Vite + Tailwind CSS** (même stack que le simulateur)
- **Supabase** pour la base de données et l'authentification
- **Cloudinary** pour les photos des programmes
- Pas de backend custom — tout via Supabase

```bash
npm create vite@latest immo-israel-platform -- --template react
cd immo-israel-platform
npm install @supabase/supabase-js @supabase/auth-ui-react tailwindcss lucide-react react-router-dom
```

---

## Structure des pages (React Router)

```
/                          → Landing page publique
/programmes                → Catalogue des programmes (public)
/programme/:id             → Fiche détaillée d'un programme
/agences                   → Annuaire des agences (public)
/agence/:id                → Profil d'une agence
/dashboard/promoteur       → Espace promoteur (privé)
/dashboard/agence          → Espace agence (privé)
/dashboard/admin           → Back-office admin (privé)
/auth/login                → Connexion
/auth/register             → Inscription (agence ou promoteur)
```

---

## PARTIE 1 — BASE DE DONNÉES (Supabase)

Crée ces tables dans Supabase :

```sql
-- Profils utilisateurs étendus
create table profiles (
  id uuid references auth.users primary key,
  role text check (role in ('promoteur','agence','acheteur','admin')),
  nom text,
  email text,
  telephone text,
  ville text,
  logo_url text,
  description text,
  site_web text,
  abonnement text check (abonnement in ('gratuit','starter','pro','enterprise')),
  abonnement_expire_le date,
  valide boolean default false,
  created_at timestamp default now()
);

-- Programmes immobiliers (publiés par promoteurs)
create table programmes (
  id uuid default gen_random_uuid() primary key,
  promoteur_id uuid references profiles(id),
  titre text not null,
  description text,
  ville text,
  quartier text,
  adresse text,
  lat float,
  lng float,
  type text check (type in ('appartement','villa','penthouse','commercial','mixte')),
  statut text check (statut in ('en_etude','en_construction','livraison_proche','livre')),
  nb_logements int,
  surface_min int,
  surface_max int,
  prix_min int,
  prix_max int,
  annee_livraison int,
  tama38 boolean default false,
  pinoui_binoui boolean default false,
  programme_neuf boolean default true,
  images text[],
  documents text[],
  score_investissement int,
  actif boolean default true,
  created_at timestamp default now()
);

-- Mandats : agences autorisées à vendre un programme
create table mandats (
  id uuid default gen_random_uuid() primary key,
  programme_id uuid references programmes(id),
  agence_id uuid references profiles(id),
  type_mandat text check (type_mandat in ('exclusif','semi_exclusif','simple')),
  commission_pct float,
  date_debut date,
  date_fin date,
  actif boolean default true,
  created_at timestamp default now()
);

-- Leads / contacts acheteurs
create table leads (
  id uuid default gen_random_uuid() primary key,
  programme_id uuid references programmes(id),
  agence_id uuid references profiles(id),
  nom text,
  email text,
  telephone text,
  message text,
  budget_min int,
  budget_max int,
  localisation text,
  langue text check (langue in ('fr','en','he')),
  source text,
  statut text check (statut in ('nouveau','contact','visite','offre','signe','perdu')),
  created_at timestamp default now()
);

-- Transactions signées (pour commissionnement)
create table transactions (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references leads(id),
  programme_id uuid references programmes(id),
  agence_id uuid references profiles(id),
  promoteur_id uuid references profiles(id),
  prix_vente int,
  commission_agence float,
  commission_plateforme float,
  date_signature date,
  created_at timestamp default now()
);

-- Abonnements et paiements
create table abonnements (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references profiles(id),
  plan text check (plan in ('starter','pro','enterprise')),
  prix_mensuel float,
  date_debut date,
  date_fin date,
  actif boolean default true
);
```

---

## PARTIE 2 — TARIFICATION

Définis ces constantes dans `src/data/pricing.js` :

```javascript
export const PLANS = {
  // Pour les AGENCES
  agence: [
    {
      name: 'Starter',
      price: 490,           // ₪/mois
      annuel: 4490,         // ₪/an
      features: [
        'Profil agence vérifié',
        'Accès à 5 mandats simultanés',
        '20 leads/mois',
        'Chat avec promoteurs',
        'Badge "Agence partenaire"',
      ],
      cta: 'Commencer',
      highlight: false,
    },
    {
      name: 'Pro',
      price: 990,
      annuel: 8990,
      features: [
        'Profil agence premium',
        'Mandats illimités',
        'Leads illimités',
        'Statistiques avancées',
        'Mise en avant dans la recherche',
        'Accès aux programmes off-market',
        'Support dédié',
      ],
      cta: 'Choisir Pro',
      highlight: true,
    },
  ],
  // Pour les PROMOTEURS
  promoteur: [
    {
      name: 'Starter',
      price: 990,
      annuel: 8990,
      features: [
        '1 programme actif',
        'Jusqu\'à 3 mandats agences',
        'Tableau de bord leads',
        'Visibilité standard',
      ],
      cta: 'Commencer',
      highlight: false,
    },
    {
      name: 'Pro',
      price: 2490,
      annuel: 22900,
      features: [
        'Programmes illimités',
        'Mandats illimités',
        'Mise en avant "Programme vedette"',
        'Analytics complets',
        'API d\'intégration',
        'Compte manager dédié',
      ],
      cta: 'Choisir Pro',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: null,          // Sur devis
      annuel: null,
      features: [
        'Multi-sites / multi-programmes',
        'Marque blanche',
        'Intégration CRM',
        'SLA garanti',
        'Formation équipe',
      ],
      cta: 'Nous contacter',
      highlight: false,
    },
  ],
}

// Commissions sur transaction
export const COMMISSIONS = {
  plateforme_sur_vente: 0.1,  // 0.1% du prix de vente
  plateforme_sur_lead_converti: 500,  // ₪ fixe par transaction signée
}
```

---

## PARTIE 3 — LANDING PAGE PUBLIQUE (/)

```jsx
// src/pages/LandingPage.jsx

// Structure de la page (de haut en bas) :

// 1. NAVBAR
//    Logo | Programmes | Agences | Promoteurs | Tarifs | Se connecter | S'inscrire (CTA)

// 2. HERO SECTION
//    Headline : "La plateforme qui connecte promoteurs, agences et acheteurs en Israël"
//    Sous-titre : "Publiez vos programmes. Trouvez vos mandats. Vendez plus vite."
//    Deux CTA côte à côte :
//      [Je suis promoteur →]   [Je suis une agence →]
//    Stats : X programmes · X agences partenaires · X transactions

// 3. COMMENT ÇA MARCHE (3 colonnes)
//    Promoteur : "Publiez votre programme en 10 min"
//    Agence : "Obtenez vos mandats instantanément"
//    Acheteur : "Trouvez le bien parfait avec une agence locale"

// 4. PROGRAMMES EN VEDETTE
//    Grille de 6 cartes programmes (les plus récents / les mieux notés)

// 5. AGENCES PARTENAIRES
//    Logos / cartes des agences certifiées

// 6. TARIFS (2 colonnes : Agences | Promoteurs)
//    Cards avec les 3 plans de chaque côté

// 7. TÉMOIGNAGES

// 8. CTA FINAL
//    "Rejoignez la plateforme. Premiers 30 jours offerts."
//    [S'inscrire gratuitement]

// 9. FOOTER
//    Liens | Langues | Mentions légales | Contact
```

---

## PARTIE 4 — CATALOGUE PROGRAMMES (/programmes)

```jsx
// src/pages/Catalogue.jsx

// FILTRES (sidebar ou top bar) :
// - Ville (multiselect : Tel Aviv, Herzliya, Jérusalem, Netanya...)
// - Type (appartement / villa / penthouse / commercial)
// - Statut (en construction / livraison proche / livré)
// - Budget (slider min-max en ₪)
// - Surface (slider min-max en m²)
// - TAMA 38 (checkbox)
// - Pinouï-Binouï (checkbox)
// - Agence partenaire (checkbox)
// - Trié par : Date · Prix · Score investissement

// GRILLE DE CARTES PROGRAMME :
// Chaque carte affiche :
// - Photo principale (carousel)
// - Badge statut (couleur selon statut)
// - Ville / Quartier
// - Titre du programme
// - Surface min–max · Prix min–max
// - Nb logements disponibles
// - Logo promoteur
// - Score investissement /100 (si calculé)
// - Nb agences mandatées
// - Bouton "Voir le programme"

// VUE CARTE (Map view) :
// Toggle liste/carte en haut à droite
// Pins sur Google Maps (ou Leaflet) avec popup rapide
```

---

## PARTIE 5 — FICHE PROGRAMME (/programme/:id)

```jsx
// src/pages/FicheProgramme.jsx

// STRUCTURE :
// - Galerie photos plein écran (carousel)
// - Titre + ville + quartier + statut
// - Prix min–max · Surface min–max · Nb logements
// - Description longue
// - Caractéristiques (TAMA 38, ascenseur, parking, vue mer...)
// - Plan de masse / plan type (PDF viewer)
// - Carte Google Maps avec localisation
// - Score investissement (widget du simulateur intégré !)
// - Agences mandatées (liste avec contact direct)
// - Formulaire de contact (→ crée un lead dans Supabase)
// - Programmes similaires

// INTÉGRATION SIMULATEUR :
// Si l'utilisateur est connecté, proposer :
// "Calculer le rendement de ce bien" → ouvre le simulateur
// avec les données du programme pré-remplies (ville, prix, surface)
```

---

## PARTIE 6 — DASHBOARD PROMOTEUR (/dashboard/promoteur)

```jsx
// Tabs dans le dashboard :
// 1. Mes programmes (liste + statut + nb leads + nb mandats)
// 2. Mes agences mandatées (liste + type mandat + performance)
// 3. Leads reçus (tableau avec statut pipeline)
// 4. Analytiques (vues, contacts, conversions, par programme)
// 5. Mon abonnement + facturation

// AJOUT D'UN PROGRAMME (formulaire multi-étapes) :
// Étape 1 : Informations générales (titre, ville, type, statut)
// Étape 2 : Caractéristiques (surface, prix, nb logements, équipements)
// Étape 3 : Photos + documents (upload Cloudinary)
// Étape 4 : Mandats (inviter des agences ou rendre public)
// Étape 5 : Publication
```

---

## PARTIE 7 — DASHBOARD AGENCE (/dashboard/agence)

```jsx
// Tabs dans le dashboard :
// 1. Programmes disponibles (catalogue filtrable, demander un mandat)
// 2. Mes mandats (actifs + historique)
// 3. Mes leads (pipeline Kanban : Nouveau → Contact → Visite → Offre → Signé)
// 4. Performances (taux de conversion, CA généré, commissions)
// 5. Mon abonnement

// PIPELINE LEADS — Kanban visuel :
// Colonnes : Nouveau | Contacté | Visite | Offre | Signé | Perdu
// Chaque lead = carte draggable avec nom, programme, budget, date
```

---

## PARTIE 8 — COMPOSANTS UI CLÉS À CRÉER

```jsx
// src/components/ProgrammeCard.jsx
// Carte programme pour le catalogue

// src/components/AgenceCard.jsx
// Carte agence pour l'annuaire

// src/components/LeadForm.jsx
// Formulaire de contact acheteur (multilingue FR/EN/עב)

// src/components/PipelineKanban.jsx
// Kanban des leads pour les agences

// src/components/PricingTable.jsx
// Tableau des tarifs (agences + promoteurs)

// src/components/ScoreWidget.jsx
// Score investissement /100 intégré depuis le simulateur
// (réutilise calcUrbanisme() du simulateur existant)

// src/components/LangueSwitcher.jsx
// FR / EN / עב — même logique que le simulateur
```

---

## PARTIE 9 — DESIGN & IDENTITÉ VISUELLE

**Même palette que le simulateur** pour assurer la cohérence :
- Bleu marine : `#1A3A5C`
- Or : `#C9A84C`
- Fond clair : `#F8F7F4`

**Typographie** :
- DM Serif Display (titres)
- Plus Jakarta Sans (corps)

**Nom suggéré pour la plateforme** : `ImmoIsrael Pro` ou `NadlanConnect`

**Logo** : adapter le logo existant du simulateur avec le mot "Connect" ou "Pro"

---

## PARTIE 10 — MULTILINGUE

Même système que le simulateur. Ajouter les clés spécifiques à la plateforme :

```javascript
// Clés supplémentaires dans translations.js
promoteur: { fr: 'Promoteur', en: 'Developer', he: 'יזם' },
agence: { fr: 'Agence immobilière', en: 'Real estate agency', he: 'משרד תיווך' },
programme: { fr: 'Programme', en: 'Development', he: 'פרויקט' },
mandat: { fr: 'Mandat', en: 'Mandate', he: 'מנדט' },
acheteur: { fr: 'Acheteur', en: 'Buyer', he: 'קונה' },
lead: { fr: 'Contact', en: 'Lead', he: 'פנייה' },
```

---

## ORDRE DE DÉVELOPPEMENT RECOMMANDÉ

1. **Setup** : Vite + React + Tailwind + Supabase + React Router
2. **Auth** : inscription / connexion avec rôle (promoteur / agence)
3. **Landing page** publique
4. **Catalogue** programmes (lecture seule)
5. **Fiche programme** + formulaire lead
6. **Dashboard promoteur** : ajout programme + gestion mandats
7. **Dashboard agence** : candidature mandat + pipeline leads
8. **Tarifs + Stripe** pour les abonnements
9. **Analytics** dashboards
10. **Intégration simulateur** (score investissement pré-rempli)

---

## COMMANDE DE LANCEMENT

```bash
npm create vite@latest nadlan-connect -- --template react
cd nadlan-connect
npm install
npm run dev
```
