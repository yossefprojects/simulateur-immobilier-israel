import {
  coefEtage, coefMer, coefSurface, coefTransport, EQUIPEMENTS,
  coefPieces, coefBalcon, coefParking, coefAnneeConstruction,
  TYPES_BIEN, ETATS_BIEN,
} from '../data/coefficients'
import { ACCORDS_MUNICIPAUX, STATUTS_PERMIS, STATUTS_PLAN } from '../data/accords'
import { VILLES } from '../data/villes'
import type {
  EstimationInputs, EstimationResult,
  InvestInputs, InvestResult,
  PromoteurInputs, PromoteurResult,
  UrbanismeInputs, UrbanismeResult,
  WaterfallStep,
} from '../types'

// ─── Estimation ───────────────────────────────────────────────────────────────

export function calcEstimation(inputs: EstimationInputs): EstimationResult | null {
  const ville = VILLES[inputs.ville]
  if (!ville) return null
  const quartier = ville.quartiers[inputs.quartier]
  if (!quartier) return null

  const base = quartier.prixMoyen

  // ── Coefficients existants ────────────────────────────────────────────────
  const cTypeProg  = inputs.typeProjet
  const cSurface   = coefSurface(inputs.surface)
  const cMer       = coefMer(inputs.distanceMer)
  const cTransport = coefTransport(inputs.distanceTransp)
  const cEtage     = coefEtage(inputs.etage)

  let cEquip = 1.0
  for (const eq of EQUIPEMENTS) {
    if (inputs.equipements[eq.key as keyof typeof inputs.equipements]) {
      cEquip += eq.bonus
    }
  }

  // ── Nouveaux coefficients ─────────────────────────────────────────────────
  const typeBienDef = TYPES_BIEN.find(t => t.value === inputs.typeBien)
  const cTypeBien   = typeBienDef ? typeBienDef.coef : 1.00

  const etatDef = ETATS_BIEN.find(e => e.value === inputs.etatBien)
  const cEtat   = etatDef ? etatDef.coef : 1.00

  const cPieces = inputs.nbPieces != null ? coefPieces(inputs.nbPieces) : 1.00
  const cBalcon = inputs.nbBalcons != null ? coefBalcon(inputs.nbBalcons) : 1.00
  const cParking = inputs.nbParkings != null ? coefParking(inputs.nbParkings) : 1.00
  const cAnnee  = inputs.anneeConstruction ? coefAnneeConstruction(inputs.anneeConstruction) : 1.00

  // Retire le bonus parking de l'ancien système si nbParkings est renseigné
  // (évite le double comptage)
  const cEquipFinal = inputs.nbParkings != null && inputs.equipements.parking
    ? cEquip - 0.10
    : cEquip

  // ── Coefficient total ─────────────────────────────────────────────────────
  const coefTotal =
    cTypeProg
    * cTypeBien
    * cSurface
    * cMer
    * cTransport
    * cEtage
    * cEquipFinal
    * cEtat
    * cPieces
    * cBalcon
    * cParking
    * cAnnee

  const prixM2    = Math.round(base * coefTotal)
  const prixTotal = Math.round(prixM2 * inputs.surface)

  // ── Waterfall (filtre les coefs neutres = 1.00) ───────────────────────────
  const steps: { label: string; coef: number }[] = [
    { label: 'Base quartier',      coef: 1          },
    { label: 'Type programme',     coef: cTypeProg  },
    { label: 'Type de bien',       coef: cTypeBien  },
    { label: 'Surface',            coef: cSurface   },
    { label: 'État du bien',       coef: cEtat      },
    { label: 'Nombre de pièces',   coef: cPieces    },
    { label: 'Proximité mer',      coef: cMer       },
    { label: 'Transports',         coef: cTransport },
    { label: 'Étage',              coef: cEtage     },
    { label: 'Balcon / terrasse',  coef: cBalcon    },
    { label: 'Parking',            coef: cParking   },
    { label: 'Équipements',        coef: cEquipFinal},
    { label: 'Année construction', coef: cAnnee     },
  ].filter(s => s.coef !== 1.00 || s.label === 'Base quartier')

  let running = base
  const waterfall: WaterfallStep[] = steps.map((s, i) => {
    if (i > 0) running = Math.round(running * s.coef)
    return { label: s.label, coef: s.coef, prixCumul: Math.round(running) }
  })

  return { prixM2, prixTotal, coefTotal, waterfall }
}

// ─── Urbanisme ────────────────────────────────────────────────────────────────

export function calcUrbanisme(inputs: UrbanismeInputs): UrbanismeResult {
  const plan   = STATUTS_PLAN[inputs.planKey]
  const accord = ACCORDS_MUNICIPAUX[inputs.accordKey]
  const permis = STATUTS_PERMIS[inputs.permisKey]

  const surfMax = inputs.surfTerrain * inputs.cos
  const droits  = Math.max(0, surfMax - inputs.surfExist)

  const rawScore =
    20
    + plan.score   * 0.5
    + accord.score * 0.6
    + permis.score * 0.4
    + (inputs.etagesAut > 15 ? 10 : inputs.etagesAut > 8 ? 5 : 0)
    + (droits > 500 ? 8 : droits > 200 ? 4 : 0)

  const score = Math.min(100, Math.max(0, Math.round(rawScore)))

  const scoreColor = score >= 70 ? '#0F6E56' : score >= 45 ? '#BA7517' : '#993C1D'
  const scoreLabel = score >= 70 ? 'Fort potentiel' : score >= 45 ? 'Potentiel modéré' : 'Potentiel faible'

  const coefTotal = plan.coef * accord.coef * permis.coef
  const prixProj  = Math.round(inputs.prixActuel * coefTotal)
  const gainM2    = prixProj - inputs.prixActuel
  const gainPct   = inputs.prixActuel > 0 ? ((prixProj - inputs.prixActuel) / inputs.prixActuel) * 100 : 0

  const valActTot  = Math.round(inputs.prixActuel * surfMax)
  const valProjTot = Math.round(prixProj * surfMax)
  const plusValue  = valProjTot - valActTot

  return {
    score, scoreLabel, scoreColor,
    coefTotal, prixProj, gainM2, gainPct,
    surfMax, droits,
    valActTot, valProjTot, plusValue,
  }
}

// ─── Investisseur ─────────────────────────────────────────────────────────────

export function calcInvestisseur(inputs: InvestInputs): InvestResult {
  const apport   = inputs.prix * (inputs.apport / 100)
  const emprunt  = inputs.prix - apport
  const n        = inputs.duree * 12
  const r        = inputs.taux / 100 / 12
  const mensualite = emprunt * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

  const loyerNetAn = inputs.loyer * 12 * (1 - inputs.vacance / 100)
  const cfAn       = loyerNetAn - inputs.charges - mensualite * 12
  const cfMensuel  = cfAn / 12

  const rendBrut = (inputs.loyer * 12 / inputs.prix) * 100
  const rendNet  = ((loyerNetAn - inputs.charges) / inputs.prix) * 100

  const prixSortie = inputs.prix * Math.pow(1 + inputs.reval / 100, inputs.horizon)
  const gainTotal  = cfAn * inputs.horizon + (prixSortie - inputs.prix)
  const tri        = (Math.pow((apport + gainTotal) / apport, 1 / inputs.horizon) - 1) * 100

  const projection = Array.from({ length: inputs.horizon }, (_, i) => {
    const annee  = i + 1
    const valeur = Math.round(inputs.prix * Math.pow(1 + inputs.reval / 100, annee))
    return { annee, valeur, cfCumul: Math.round(cfAn * annee) }
  })

  return {
    mensualite: Math.round(mensualite),
    rendBrut, rendNet, cfMensuel, tri,
    prixSortie: Math.round(prixSortie),
    gainTotal:  Math.round(gainTotal),
    projection,
  }
}

// ─── Promoteur ────────────────────────────────────────────────────────────────

export function calcPromoteur(inputs: PromoteurInputs): PromoteurResult {
  const surfTotale   = inputs.surfTerrain * inputs.cos
  const surfVendable = surfTotale * (inputs.ratioVend / 100)
  const ca           = surfVendable * inputs.prixVente
  const coutConst    = surfTotale * inputs.coutConst
  const frais        = coutConst * (inputs.tauxFrais / 100)
  const commerc      = ca * (inputs.tauxCommerc / 100)
  const portage      = (inputs.coutTerrain + coutConst) * (inputs.tauxPortage / 100)
  const coutTotal    = inputs.coutTerrain + coutConst + frais + commerc + portage
  const margeBrute   = ca - coutTotal
  const margePct     = ca > 0 ? (margeBrute / ca) * 100 : 0
  const margeSurCout = coutTotal > 0 ? (margeBrute / coutTotal) * 100 : 0
  const prixRevientM2= surfVendable > 0 ? coutTotal / surfVendable : 0

  const sensitivity = [-15, -10, -5, 0, 5, 10, 15].map(v => {
    const ca2    = ca * (1 + v / 100)
    const marge2 = ca2 - coutTotal
    return {
      variation: v,
      ca:    Math.round(ca2),
      marge: Math.round(marge2),
      pct:   ca2 > 0 ? (marge2 / ca2) * 100 : 0,
    }
  })

  return {
    surfTotale: Math.round(surfTotale),
    surfVendable: Math.round(surfVendable),
    ca: Math.round(ca),
    coutConst: Math.round(coutConst),
    frais: Math.round(frais),
    commerc: Math.round(commerc),
    portage: Math.round(portage),
    coutTotal: Math.round(coutTotal),
    margeBrute: Math.round(margeBrute),
    margePct, margeSurCout,
    prixRevientM2: Math.round(prixRevientM2),
    sensitivity,
  }
}
