export interface QuartierData {
  prixMoyen: number
}

export interface VilleData {
  label:     string
  quartiers: Record<string, QuartierData>
}

// Prix médian au m² — transactions Nadlan Gov Q1 2025

export const VILLES: Record<string, VilleData> = {
  tlv: {
    label: 'Tel Aviv',
    quartiers: {
      'Florentin / Kerem HaTeimanim': { prixMoyen: 42000 },
      'Neve Tzedek':                  { prixMoyen: 58000 },
      'Rothschild / Centre':          { prixMoyen: 62000 },
      'Old North':                    { prixMoyen: 46000 },
      'Ramat Aviv':                   { prixMoyen: 38000 },
      'Jaffa':                        { prixMoyen: 31000 },
      'Bat Yam (frontière)':          { prixMoyen: 22000 },
    },
  },
  herzliya: {
    label: 'Herzliya',
    quartiers: {
      'Herzliya Pituach': { prixMoyen: 50000 },
      'Centre-ville':     { prixMoyen: 30000 },
      'Nordau':           { prixMoyen: 24000 },
      'Neve Amirim':      { prixMoyen: 20000 },
    },
  },
  jerusalem: {
    label: 'Jérusalem',
    quartiers: {
      'Rehavia':          { prixMoyen: 40000 },
      'Talbiyeh':         { prixMoyen: 44000 },
      'German Colony':    { prixMoyen: 38000 },
      'Har Nof':          { prixMoyen: 19000 },
      'Katamon':          { prixMoyen: 28000 },
      'Malha / Holyland': { prixMoyen: 25000 },
      'Pisgat Zeev':      { prixMoyen: 16000 },
    },
  },
  netanya: {
    label: 'Netanya',
    quartiers: {
      'Ir Yamim':             { prixMoyen: 32000 },
      'Centre / bord de mer': { prixMoyen: 27000 },
      'Poleg':                { prixMoyen: 20000 },
      'Agamim':               { prixMoyen: 24000 },
      'Kiryat HaSharon':      { prixMoyen: 18000 },
    },
  },
  raanana: {
    label: "Ra'anana",
    quartiers: {
      "Centre Ra'anana": { prixMoyen: 28000 },
      'Kfar Saba Nord':  { prixMoyen: 20000 },
      'Neve Zemer':      { prixMoyen: 22000 },
    },
  },
  haifa: {
    label: 'Haïfa',
    quartiers: {
      'Carmel':          { prixMoyen: 22000 },
      'Merkaz HaCarmel': { prixMoyen: 25000 },
      'Hadar':           { prixMoyen: 15000 },
      'Bat Galim':       { prixMoyen: 18000 },
      'Neve Shaanan':    { prixMoyen: 16000 },
    },
  },
  beersheva: {
    label: 'Beer Sheva',
    quartiers: {
      'Gimmel (ancien)': { prixMoyen: 9000  },
      'Nahal Beka':      { prixMoyen: 11000 },
      'Ramot':           { prixMoyen: 12000 },
      'Dalet':           { prixMoyen: 10000 },
    },
  },
  petah_tikva: {
    label: 'Petah Tikva',
    quartiers: {
      'Centre':          { prixMoyen: 20000 },
      'Kiryat Matalon':  { prixMoyen: 18000 },
      'Neve Ilan':       { prixMoyen: 22000 },
    },
  },
  rishon: {
    label: 'Rishon LeZion',
    quartiers: {
      'Centre Rishon':     { prixMoyen: 20000 },
      'Nahalat Yehuda':    { prixMoyen: 23000 },
      'Rehovot':           { prixMoyen: 18000 },
    },
  },
  ashkelon: {
    label: 'Ashkelon',
    quartiers: {
      'Centre':      { prixMoyen: 15000 },
      'Bord de mer': { prixMoyen: 18000 },
      'Barnea':      { prixMoyen: 13000 },
    },
  },
}
