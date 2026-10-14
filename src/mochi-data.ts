export type Accessory =
  | "none"
  | "ribbon"
  | "beret"
  | "nightcap"
  | "scarf"
  | "glasses"
  | "flower"
  | "crown";
export type CareAction =
  | "pet"
  | "feed"
  | "sleep"
  | "hug"
  | "dance"
  | "talk"
  | "tickle"
  | "wake";
export type MochiProfile = {
  version: 1;
  visits: number;
  lastSeen: number;
  pets: number;
  feeds: number;
  naps: number;
  hugs: number;
  dances: number;
  talks: number;
  tickles: number;
  love: number;
  bestCatch: number;
  catchGames: number;
  bubbleGames: number;
  accessory: Accessory;
  unlocked: Accessory[];
};

export const accessories: {
  id: Accessory;
  name: string;
  hint: string;
  emoji: string;
}[] = [
  { id: "none", name: "Just Mochi", hint: "Sudah lucu dari awal.", emoji: "♡" },
  {
    id: "ribbon",
    name: "Pink ribbon",
    hint: "Elus Mochi 3 kali.",
    emoji: "🎀",
  },
  { id: "beret", name: "Berry beret", hint: "Beri 2 camilan.", emoji: "🍓" },
  {
    id: "nightcap",
    name: "Sleepy cap",
    hint: "Temani Mochi tidur.",
    emoji: "🌙",
  },
  { id: "scarf", name: "Hug scarf", hint: "Kirim satu peluk.", emoji: "🧣" },
  {
    id: "glasses",
    name: "Love glasses",
    hint: "Tangkap 3 hati dalam satu game.",
    emoji: "💗",
  },
  {
    id: "flower",
    name: "Daisy crown",
    hint: "Pecahkan semua bubble.",
    emoji: "🌼",
  },
  {
    id: "crown",
    name: "Little queen",
    hint: "Temukan semua 4 Mochi.",
    emoji: "👑",
  },
];

export const snacks = [
  {
    id: "strawberry",
    name: "Stroberi",
    emoji: "🍓",
    line: "Mochi: rasanya pink. Iya, pink sekarang rasa. Jangan debat sama kelinci.",
  },
  {
    id: "cookie",
    name: "Cookie",
    emoji: "🍪",
    line: "Satu buat Mochi, satu buat May. Cookie-nya virtual, sayangnya beneran.",
  },
  {
    id: "milk",
    name: "Susu hangat",
    emoji: "🥛",
    line: "Susu hangat diterima. Sekarang Mochi siap jadi bantal emosional.",
  },
  {
    id: "cake",
    name: "Kue kecil",
    emoji: "🍰",
    line: "Kue kecil, happy besar. Terima kasih udah nyuapin kelinci paling manja ini.",
  },
];

export const mochiSpeech: Record<CareAction, string[]> = {
  pet: [
    "Ihh May, dielus sedikit langsung jadi puding. Kelinci rasa sayang ♡",
    "Telinganya boleh panjang. Yang paling panjang tetep daftar alasan Mochi sayang kamu.",
    "Elus diterima. Mochi sekarang resmi nempel ke May.",
    "Ssst. Mochi lagi pura-pura cool. Padahal pipinya pink banget.",
    "Kalau ada lomba paling betah dielus Maybe, Mochi juara umum.",
  ],
  feed: [
    "Nom nom… ini kok enak? Oh, disuapin Maybe. Pantes.",
    "Camilan masuk. Mood naik. Telinga ikut berdiri.",
    "Mochi mengingatkan: May juga jangan lupa makan, ya. Kita ngemil bareng.",
    "Kelinci ini menerima suap. Suap camilan. Transparan dan penuh cinta.",
  ],
  sleep: [
    "Mochi mau tidur sebentar. Kamu juga boleh istirahat. Deadline nggak ikut masuk selimut.",
    "Zzz… mimpi jadi kelinci yang dibawain snack sama Maybe.",
    "Lampu diredupkan. Pikiran rame boleh istirahat di luar kamar dulu.",
  ],
  wake: [
    "Hah? Udah pagi? Belum? Yaudah, yang penting ada Maybe!",
    "Mochi bangun. Rambut rapi: tidak. Siap sayang Maybe: iya.",
    "Lima menit lagi… eh ada May! Oke langsung bangun.",
  ],
  hug: [
    "Peluknya nggak pakai syarat. Kamu cuma perlu jadi Maybe ♡",
    "Mochi kecil, tapi kapasitas peluknya unlimited.",
    "Peluk diterima. Radli titip satu lagi, katanya jangan lupa disampaikan.",
    "Kalau dunia terlalu berisik, sini kita pelukan sebentar.",
  ],
  dance: [
    "Gerakannya nggak jelas. Niat bikin Maybe senyum jelas banget.",
    "Mochi lagi audisi. Bakat: bergoyang sambil tetap bulet.",
    "Satu, dua, tiga… telinga kiri ketinggalan beat. Gapapa, tetap lucu.",
    "Dancing bunny detected. Produktivitas ditunda 8 detik.",
  ],
  talk: [
    "BREAKING NEWS: Maybe datang. Kamar ini otomatis jadi lebih hangat.",
    "Mochi udah rapat sama bantal. Hasilnya: Maybe layak dapat hal-hal lembut.",
    "Kalau gua bisa masuk chat, gua udah spam stiker peluk. — Mochi, mewakili Radli",
    "Semesta luas banget. Tapi kursi di sebelah Mochi selalu disimpan buat May.",
    "Kelinci apa yang paling supportif? Kelinci-ni selalu ada di pihak kamu. Maaf.",
    "Telinga Mochi panjang buat dengerin cerita kamu. Bukan buat nangkep deadline.",
    "Reminder mungil: kamu nggak perlu jadi sempurna buat disayang.",
    "Kalau hari ini capek, kita jadi dua kentang di bawah selimut dulu.",
  ],
  tickle: [
    "HEH MAY! Geli 😤 Pipinya ngambek, hatinya happy.",
    "Mochi mau protes tapi ketawa duluan. Kredibilitas kelinci galak: nol.",
    "JANGAN GELITIK… ya boleh sedikit. Sedikit banget. Hehe.",
  ],
};

export const hiddenEndingLetter =
  "May,\n\nKamu tadi cuma ngelus kelinci kecil, bagi camilan, ngajak dia istirahat, terus kirim peluk. Kelihatannya sepele, ya?\n\nTapi gua pengen lu ngasih kelembutan yang sama ke diri lu sendiri. Lu juga pantas dirawat tanpa harus capek banget dulu.\n\nKalau gua bisa nitip satu hal di dunia kecil ini, ini dia: nggak ada versi lu yang harus disembunyiin supaya gua tetap peduli. Yang berantakan, yang lagi bingung, yang hari ini cuma bisa rebahan. Semuanya boleh pulang ke sini.\n\nKursi di sebelah gua tetap punya lu.\n\n— Radli, selalu di tim Maybe ♡";
