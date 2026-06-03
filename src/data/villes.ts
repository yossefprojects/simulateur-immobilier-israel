export interface QuartierData {
  prixMoyen: number
  labelHe?:  string
}

export interface VilleData {
  label:    string
  labelHe?: string
  quartiers: Record<string, QuartierData>
}

// Prix médian au m² — transactions Nadlan Gov Q1 2025

export const VILLES: Record<string, VilleData> = {
  tlv: {
    label: 'Tel Aviv', labelHe: 'תל אביב',
    quartiers: {
      'Florentin / Kerem HaTeimanim': { prixMoyen: 42000, labelHe: 'פלורנטין / כרם התימנים' },
      'Neve Tzedek':                  { prixMoyen: 58000, labelHe: 'נווה צדק' },
      'Rothschild / Centre':          { prixMoyen: 62000, labelHe: 'רוטשילד / מרכז' },
      'Old North':                    { prixMoyen: 46000, labelHe: 'צפון ישן' },
      'Ramat Aviv':                   { prixMoyen: 38000, labelHe: 'רמת אביב' },
      'Jaffa':                        { prixMoyen: 31000, labelHe: 'יפו' },
      'Bat Yam (frontière)':          { prixMoyen: 22000, labelHe: 'בת ים (גבול)' },
    },
  },
  herzliya: {
    label: 'Herzliya', labelHe: 'הרצליה',
    quartiers: {
      'Herzliya Pituach': { prixMoyen: 50000, labelHe: 'הרצליה פיתוח' },
      'Centre-ville':     { prixMoyen: 30000, labelHe: 'מרכז העיר' },
      'Nordau':           { prixMoyen: 24000, labelHe: 'נורדאו' },
      'Neve Amirim':      { prixMoyen: 20000, labelHe: 'נווה אמירים' },
    },
  },
  jerusalem: {
    label: 'Jérusalem', labelHe: 'ירושלים',
    quartiers: {
      'Rehavia':          { prixMoyen: 40000, labelHe: 'רחביה' },
      'Talbiyeh':         { prixMoyen: 44000, labelHe: 'טלביה' },
      'German Colony':    { prixMoyen: 38000, labelHe: 'המושבה הגרמנית' },
      'Har Nof':          { prixMoyen: 19000, labelHe: 'הר נוף' },
      'Katamon':          { prixMoyen: 28000, labelHe: 'קטמון' },
      'Malha / Holyland': { prixMoyen: 25000, labelHe: 'מלחה / הולילנד' },
      'Pisgat Zeev':      { prixMoyen: 16000, labelHe: 'פסגת זאב' },
    },
  },
  netanya: {
    label: 'Netanya', labelHe: 'נתניה',
    quartiers: {
      'Ir Yamim':             { prixMoyen: 32000, labelHe: 'עיר ימים' },
      'Centre / bord de mer': { prixMoyen: 27000, labelHe: 'מרכז / חוף הים' },
      'Poleg':                { prixMoyen: 20000, labelHe: 'פולג' },
      'Agamim':               { prixMoyen: 24000, labelHe: 'אגמים' },
      'Kiryat HaSharon':      { prixMoyen: 18000, labelHe: 'קריית השרון' },
    },
  },
  raanana: {
    label: "Ra'anana", labelHe: 'רעננה',
    quartiers: {
      "Centre Ra'anana": { prixMoyen: 28000, labelHe: 'מרכז רעננה' },
      'Kfar Saba Nord':  { prixMoyen: 20000, labelHe: 'כפר סבא צפון' },
      'Neve Zemer':      { prixMoyen: 22000, labelHe: 'נווה זמר' },
    },
  },
  haifa: {
    label: 'Haïfa', labelHe: 'חיפה',
    quartiers: {
      'Carmel':          { prixMoyen: 22000, labelHe: 'הכרמל' },
      'Merkaz HaCarmel': { prixMoyen: 25000, labelHe: 'מרכז הכרמל' },
      'Hadar':           { prixMoyen: 15000, labelHe: 'הדר' },
      'Bat Galim':       { prixMoyen: 18000, labelHe: 'בת גלים' },
      'Neve Shaanan':    { prixMoyen: 16000, labelHe: 'נווה שאנן' },
    },
  },
  beersheva: {
    label: 'Beer Sheva', labelHe: 'באר שבע',
    quartiers: {
      'Gimmel (ancien)': { prixMoyen: 9000,  labelHe: 'גימל (ישן)' },
      'Nahal Beka':      { prixMoyen: 11000, labelHe: 'נחל בקע' },
      'Ramot':           { prixMoyen: 12000, labelHe: 'רמות' },
      'Dalet':           { prixMoyen: 10000, labelHe: 'דלת' },
    },
  },
  petah_tikva: {
    label: 'Petah Tikva', labelHe: 'פתח תקווה',
    quartiers: {
      'Centre':         { prixMoyen: 20000, labelHe: 'מרכז' },
      'Kiryat Matalon': { prixMoyen: 18000, labelHe: 'קריית מטלון' },
      'Neve Ilan':      { prixMoyen: 22000, labelHe: 'נווה אילן' },
    },
  },
  rishon: {
    label: 'Rishon LeZion', labelHe: 'ראשון לציון',
    quartiers: {
      'Centre Rishon':  { prixMoyen: 20000, labelHe: 'מרכז ראשון' },
      'Nahalat Yehuda': { prixMoyen: 23000, labelHe: 'נחלת יהודה' },
      'Rehovot':        { prixMoyen: 18000, labelHe: 'רחובות' },
    },
  },
  ashkelon: {
    label: 'Ashkelon', labelHe: 'אשקלון',
    quartiers: {
      'Centre':      { prixMoyen: 15000, labelHe: 'מרכז' },
      'Bord de mer': { prixMoyen: 18000, labelHe: 'חוף הים' },
      'Barnea':      { prixMoyen: 13000, labelHe: 'ברנע' },
    },
  },
  bat_yam: {
    label: 'Bat Yam', labelHe: 'בת ים',
    quartiers: {
      'Bord de mer':   { prixMoyen: 28000, labelHe: 'חוף הים' },
      'Centre-ville':  { prixMoyen: 24000, labelHe: 'מרכז העיר' },
      'Ramat Yosef':   { prixMoyen: 21000, labelHe: 'רמת יוסף' },
      'Pardes Katz':   { prixMoyen: 19000, labelHe: 'פרדס כץ' },
    },
  },
  ben_shemen: {
    label: 'Ben Shemen', labelHe: 'בן שמן',
    quartiers: {
      'Moshav Ben Shemen':      { prixMoyen: 26000, labelHe: 'מושב בן שמן' },
      'Kfar HaNoar Ben Shemen': { prixMoyen: 22000, labelHe: 'כפר הנוער בן שמן' },
      'Ginaton (voisinage)':    { prixMoyen: 24000, labelHe: 'גינתון (סביבה)' },
    },
  },
}
