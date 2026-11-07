export const GENRES = [
  { value: "Action", iconType: "zap" },
  { value: "Adventure", iconType: "compass" },
  { value: "RPG", iconType: "shield" },
  { value: "Strategy", iconType: "layers" },
  { value: "Simulation", iconType: "box" },
  { value: "Puzzle", iconType: "puzzle" },
  { value: "Horror", iconType: "ghost" },
  { value: "Casual", iconType: "coffee" },
  { value: "FPS"}
];

export const TAGS = [
  "Open World",
  "Story Rich",
  "Co-op",
  "Roguelike",
  "Crafting",
  "Exploration",
  "Survival",
  "Choices Matter",
  "Singleplayer"
];

export const EXAMPLE_IDEAS = {
  cozy: {
    title: "Cozy farm di luar angkasa",
    subtitle: "Simulation · Exploration",
    genres: ["Simulation", "Adventure"],
    tags: ["Exploration", "Crafting", "Singleplayer"],
    description: "Game cozy tentang membangun kebun kecil di planet asing. Pemain menjelajahi bioma baru, merawat tanaman unik, dan berteman dengan para penghuni luar angkasa."
  },
  mystery: {
    title: "Misteri kota yang tenggelam",
    subtitle: "Adventure · Story Rich",
    genres: ["Adventure", "Puzzle"],
    tags: ["Story Rich", "Exploration", "Choices Matter"],
    description: "Petualangan naratif menyusuri kota kuno yang tenggelam. Pecahkan teka-teki, temukan artefak, dan pilih rahasia mana yang akan diungkap kepada dunia."
  },
  tactics: {
    title: "Strategi koloni di Mars",
    subtitle: "Strategy · Survival",
    genres: ["Strategy", "Simulation"],
    tags: ["Survival", "Co-op", "Crafting"],
    description: "Bangun koloni pertama di Mars bersama kru kecil. Atur sumber daya, hadapi badai debu, dan buat keputusan yang menentukan masa depan para kolonis."
  }
};

export const MOCK_RESULTS = [
  {
    id: 1,
    title: "Moonlit Vale",
    label: "PALING MIRIP",
    score: 94,
    owners: "100–200 rb",
    ownersNum: 150000,
    genres: ["simulation", "adventure"],
    tags: ["Exploration", "Crafting"],
    allTags: ["Simulation", "Adventure", "Exploration", "Crafting"],
    mode: "Singleplayer",
    description: "Jelajahi lembah ajaib yang berubah mengikuti fase bulan. Bertani, berteman dengan roh hutan, dan temukan rahasia yang tersembunyi.",
    artClass: "game-art-one",
    artText: "MOONLIT\nVALE",
    artIcon: "moon"
  },
  {
    id: 2,
    title: "Abyssal Echo",
    label: "COCOK UNTUK IDEMU",
    score: 87,
    owners: "50–100 rb",
    ownersNum: 75000,
    genres: ["adventure", "puzzle"],
    tags: ["Story Rich", "Puzzle", "Choices Matter"],
    allTags: ["Adventure", "Story Rich", "Puzzle", "Choices Matter"],
    mode: "Singleplayer",
    description: "Petualangan naratif di reruntuhan bawah laut, dengan teka-teki kuno dan pilihan yang mengubah kisah setiap penyelam.",
    artClass: "game-art-two",
    artText: "ABYSSAL\nECHO",
    artIcon: "compass"
  },
  {
    id: 3,
    title: "Starfall Frontier",
    label: "MASIH RELEVAN",
    score: 81,
    owners: "20–50 rb",
    ownersNum: 35000,
    genres: ["strategy"],
    tags: ["Survival", "Co-op", "Crafting"],
    allTags: ["Strategy", "Survival", "Co-op", "Crafting"],
    mode: "Co-op",
    description: "Bangun koloni di planet asing. Kelola sumber daya, jelajahi dunia baru, dan bertahan bersama kru ekspedisi.",
    artClass: "game-art-three",
    artText: "STARFALL\nFRONTIER",
    artIcon: "layers"
  }
];

export const CATALOG_GAMES = [
  {
    id: 1,
    title: "Willow Harbor",
    genre: "simulation",
    genreLabel: "Simulation",
    tags: ["cozy", "crafting", "story-rich"],
    tagLabels: ["Cozy", "Crafting", "Story Rich"],
    price: "$14.99",
    owners: 1500000,
    year: 2023,
    artClass: "catalog-art-one",
    artText: "WILLOW\nHARBOR",
    artIcon: "home",
    description: "Bangun kembali desa pesisir dan temukan kisah para penduduknya."
  },
  {
    id: 2,
    title: "Emberfall",
    genre: "rpg",
    genreLabel: "RPG",
    tags: ["fantasy", "choices-matter", "exploration"],
    tagLabels: ["Fantasy", "Choices Matter", "Exploration"],
    price: "$19.99",
    owners: 750000,
    year: 2022,
    artClass: "catalog-art-two",
    artText: "EMBER\nFALL",
    artIcon: "flame",
    description: "Jelajahi kerajaan yang tertutup abu dan tentukan nasib penghuninya."
  },
  {
    id: 3,
    title: "Deep Signal",
    genre: "adventure",
    genreLabel: "Adventure",
    tags: ["underwater", "mystery", "singleplayer"],
    tagLabels: ["Underwater", "Mystery", "Singleplayer"],
    price: "$11.99",
    owners: 320000,
    year: 2024,
    artClass: "catalog-art-three",
    artText: "DEEP\nSIGNAL",
    artIcon: "compass",
    description: "Ikuti sinyal misterius dari stasiun riset di dasar samudra."
  },
  {
    id: 4,
    title: "Garden of Ash",
    genre: "strategy",
    genreLabel: "Strategy",
    tags: ["base-building", "survival", "resource"],
    tagLabels: ["Base Building", "Survival", "Resource"],
    price: "$9.99",
    owners: 180000,
    year: 2023,
    artClass: "catalog-art-four",
    artText: "GARDEN\nOF ASH",
    artIcon: "plant",
    description: "Atur kebun di tanah berbahaya dan lindungi komunitas kecilmu."
  },
  {
    id: 5,
    title: "Neon Drift",
    genre: "action",
    genreLabel: "Action",
    tags: ["arcade", "racing", "score-attack"],
    tagLabels: ["Arcade", "Racing", "Score Attack"],
    price: "$7.99",
    owners: 85000,
    year: 2021,
    artClass: "catalog-art-five",
    artText: "NEON\nDRIFT",
    artIcon: "zap",
    description: "Balapan cepat melintasi kota futuristik yang tak pernah tidur."
  },
  {
    id: 6,
    title: "Hollow Hour",
    genre: "horror",
    genreLabel: "Horror",
    tags: ["psychological", "atmospheric", "investigation"],
    tagLabels: ["Psychological", "Atmospheric", "Investigation"],
    price: "$12.99",
    owners: 62000,
    year: 2024,
    artClass: "catalog-art-six",
    artText: "HOLLOW\nHOUR",
    artIcon: "ghost",
    description: "Selidiki hotel tua saat setiap jam membawa perubahan baru."
  }
];

export const INITIAL_MANAGE_GAMES = [
  {
    id: "1",
    name: "Willow Harbor",
    developer: "RekDev Demo Studio",
    appId: "2710021",
    genre: "Simulation",
    owners: "1,5 jt",
    ownersEstimated: 1500000,
    releaseYear: "2023",
    source: "Demo",
    artColor: "art-green",
    artInitial: "W",
    description: "Bangun kembali desa pesisir dan temukan kisah para penduduknya.",
    price: 14.99
  },
  {
    id: "2",
    name: "Emberfall",
    developer: "RekDev Demo Studio",
    appId: "2581470",
    genre: "RPG",
    owners: "750 rb",
    ownersEstimated: 750000,
    releaseYear: "2022",
    source: "Demo",
    artColor: "art-amber",
    artInitial: "E",
    description: "Jelajahi kerajaan yang tertutup abu dan tentukan nasib penghuninya.",
    price: 19.99
  },
  {
    id: "3",
    name: "Deep Signal",
    developer: "RekDev Demo Studio",
    appId: "3194300",
    genre: "Adventure",
    owners: "320 rb",
    ownersEstimated: 320000,
    releaseYear: "2024",
    source: "Demo",
    artColor: "art-blue",
    artInitial: "D",
    description: "Ikuti sinyal misterius dari stasiun riset di dasar samudra.",
    price: 11.99
  },
  {
    id: "4",
    name: "Garden of Ash",
    developer: "RekDev Demo Studio",
    appId: "2461950",
    genre: "Strategy",
    owners: "180 rb",
    ownersEstimated: 180000,
    releaseYear: "2023",
    source: "Demo",
    artColor: "art-sand",
    artInitial: "G",
    description: "Atur kebun di tanah berbahaya dan lindungi komunitas kecilmu.",
    price: 9.99
  },
  {
    id: "5",
    name: "Neon Drift",
    developer: "RekDev Demo Studio",
    appId: "1814200",
    genre: "Action",
    owners: "85 rb",
    ownersEstimated: 85000,
    releaseYear: "2021",
    source: "Demo",
    artColor: "art-pink",
    artInitial: "N",
    description: "Balapan cepat melintasi kota futuristik yang tak pernah tidur.",
    price: 7.99
  },
  {
    id: "6",
    name: "Hollow Hour",
    developer: "RekDev Demo Studio",
    appId: "3095180",
    genre: "Horror",
    owners: "62 rb",
    ownersEstimated: 62000,
    releaseYear: "2024",
    source: "Demo",
    artColor: "art-violet",
    artInitial: "H",
    description: "Selidiki hotel tua saat setiap jam membawa perubahan baru.",
    price: 12.99
  }
];

export const HISTORY_ACTIVITIES = [
  {
    id: 1,
    type: "edit",
    title: "Estimasi pemilik diperbarui",
    meta: "Willow Harbor · Data demo",
    date: "2026-10-08",
    dateFormatted: "8 Okt 2026"
  },
  {
    id: 2,
    type: "import",
    title: "Entri ditambahkan ke pratinjau",
    meta: "Hollow Hour · Data demo",
    date: "2026-10-05",
    dateFormatted: "5 Okt 2026"
  },
  {
    id: 3,
    type: "edit",
    title: "Genre diperbarui",
    meta: "Garden of Ash · Data demo",
    date: "2026-09-22",
    dateFormatted: "22 Sep 2026"
  },
  {
    id: 4,
    type: "import",
    title: "Pratinjau katalog disegarkan",
    meta: "6 game contoh · Data demo",
    date: "2026-08-14",
    dateFormatted: "14 Agu 2026"
  },
  {
    id: 5,
    type: "edit",
    title: "Metadata game ditinjau",
    meta: "Emberfall · Data demo",
    date: "2026-06-30",
    dateFormatted: "30 Jun 2026"
  }
];

export const MARKET_DATA = {
  totalOwners: "540 jt",
  avgOwners: "67,5 jt",
  topGenre: "Action",
  topGenreOwners: "182 jt",
  genres: [
    { name: "Action", percent: "100%", count: "182 jt", numeric: 182 },
    { name: "Adventure", percent: "53%", count: "96 jt", numeric: 96 },
    { name: "RPG", percent: "43%", count: "78 jt", numeric: 78 },
    { name: "Strategy", percent: "34%", count: "61 jt", numeric: 61 },
    { name: "Simulation", percent: "29%", count: "52 jt", numeric: 52 },
    { name: "Horror", percent: "16%", count: "30 jt", numeric: 30 },
    { name: "Puzzle", percent: "12%", count: "22 jt", numeric: 22 },
    { name: "Casual", percent: "10%", count: "19 jt", numeric: 19 }
  ],
  top5: [
    { rank: "01", name: "Action", owners: "182 jt pemilik", share: "100%", isFirst: true },
    { rank: "02", name: "Adventure", owners: "96 jt pemilik", share: "53%", isFirst: false },
    { rank: "03", name: "RPG", owners: "78 jt pemilik", share: "43%", isFirst: false },
    { rank: "04", name: "Strategy", owners: "61 jt pemilik", share: "34%", isFirst: false },
    { rank: "05", name: "Simulation", owners: "52 jt pemilik", share: "29%", isFirst: false }
  ]
};
