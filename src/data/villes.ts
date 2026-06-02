export interface QuartierData {
  prixMoyen: number
}

export interface VilleData {
  label:     string
  quartiers: Record<string, QuartierData>
}

export const VILLES: Record<string, VilleData> = {
  tlv: {
    label: 'Tel Aviv',
    quartiers: {
      'Florentin / Kerem HaTeimanim': { prixMoyen: 38000 },
      'Neve Tzedek':                  { prixMoyen: 52000 },
      'Rothschild / Centre':          { prixMoyen: 55000 },
      'Old North':                    { prixMoyen: 42000 },
      'Ramat Aviv':                   { prixMoyen: 35000 },
      'Jaffa':                        { prixMoyen: 28000 },
    },
  },
  herzliya: {
    label: 'Herzliya',
    quartiers: {
      'Herzliya Pituach': { prixMoyen: 44000 },
      'Centre-ville':     { prixMoyen: 28000 },
      'Nordau':           { prixMoyen: 22000 },
    },
  },
  jerusalem: {
    label: 'Jérusalem',
    quartiers: {
      'Rehavia':        { prixMoyen: 38000 },
      'Talbiyeh':       { prixMoyen: 40000 },
      'German Colony':  { prixMoyen: 35000 },
      'Har Nof':        { prixMoyen: 18000 },
      'Katamon':        { prixMoyen: 26000 },
    },
  },
  netanya: {
    label: 'Netanya',
    quartiers: {
      'Ir Yamim':              { prixMoyen: 29000 },
      'Centre / bord de mer':  { prixMoyen: 24000 },
      'Poleg':                 { prixMoyen: 18000 },
      'Agamim':                { prixMoyen: 22000 },
    },
  },
  raanana: {
    label: "Ra'anana",
    quartiers: {
      "Centre Ra'anana": { prixMoyen: 25000 },
      'Kfar Saba Nord':  { prixMoyen: 18000 },
    },
  },
  haifa: {
    label: 'Haïfa',
    quartiers: {
      'Carmel':          { prixMoyen: 20000 },
      'Merkaz HaCarmel': { prixMoyen: 22000 },
      'Hadar':           { prixMoyen: 14000 },
      'Bat Galim':       { prixMoyen: 16000 },
    },
  },
  beersheva: {
    label: 'Beer Sheva',
    quartiers: {
      'Gimmel (ancien)': { prixMoyen: 8000  },
      'Nahal Beka':      { prixMoyen: 10000 },
      'Ramot':           { prixMoyen: 11000 },
    },
  },
}
