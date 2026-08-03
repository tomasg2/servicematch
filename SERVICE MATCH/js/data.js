const categories = [
  { id: "catCleaning", key: "catCleaning" },
  { id: "catHandyman", key: "catHandyman" },
  { id: "catPainting", key: "catPainting" },
  { id: "catPlumbing", key: "catPlumbing" },
  { id: "catElectrical", key: "catElectrical" },
  { id: "catMoving", key: "catMoving" },
  { id: "catGarden", key: "catGarden" },
  { id: "catConstruction", key: "catConstruction" }
];

const cities = ["Praha", "Brno", "Ostrava", "Plzeň", "Liberec", "Olomouc", "České Budějovice", "Hradec Králové", "Pardubice"];

const mockProviders = [
  // CRAFTSMEN / COMPANIES
  {
    id: 101,
    type: "craftsman",
    name: "Petr Svoboda - Malířství & Natěračství",
    category: "catPainting",
    city: "Praha",
    rating: 4.95,
    reviewsCount: 38,
    pricePerHour: 350,
    languages: ["CZ", "EN"],
    isVerified: true,
    isFastReply: true,
    phone: "+420 774 123 456",
    ico: "74829104",
    bio: "Malování bytů, rodinných domů a kanceláří vč. úklidu po malování. Používáme ekologické barvy Dulux a Primalex.",
    jobsDone: 142,
    gallery: [
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop"
    ],
    reviews: [
      { author: "Martin K.", rating: 5, text: "Skvěle vymalovaný byt 3+1 za dva dny. Vše čisté, doporučuji!" },
      { author: "Elena V.", rating: 5, text: "Very professional painter, fast clean job!" }
    ]
  },
  {
    id: 102,
    type: "craftsman",
    name: "CleanHome s.r.o. - Profesionální úklid",
    category: "catCleaning",
    city: "Brno",
    rating: 4.88,
    reviewsCount: 52,
    pricePerHour: 290,
    languages: ["CZ", "UA", "EN"],
    isVerified: true,
    isFastReply: true,
    phone: "+420 608 987 654",
    ico: "09283741",
    bio: "Generální úklidy bytů, mytí oken, tepování sedaček a úklid novostaveb v Brně a okolí.",
    jobsDone: 210,
    gallery: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop"
    ],
    reviews: [
      { author: "Jana M.", rating: 5, text: "Pravidelný úklid našeho rodinného domu, vždy perfektní." }
    ]
  },
  {
    id: 103,
    type: "craftsman",
    name: "Instalatérství Horák & Syn",
    category: "catPlumbing",
    city: "Praha",
    rating: 4.92,
    reviewsCount: 29,
    pricePerHour: 450,
    languages: ["CZ"],
    isVerified: true,
    isFastReply: true,
    phone: "+420 731 555 888",
    ico: "88291039",
    bio: "Havarijní služba, rozvody vody a odpadů, montáže baterií, WC a bojlerů.",
    jobsDone: 95,
    gallery: [
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&auto=format&fit=crop"
    ],
    reviews: [
      { author: "Tomáš R.", rating: 5, text: "Přijel do hodiny od zavolání a opravil protékající záchod." }
    ]
  },
  {
    id: 104,
    type: "craftsman",
    name: "Elektro-Servis Procházka",
    category: "catElectrical",
    city: "Plzeň",
    rating: 4.90,
    reviewsCount: 19,
    pricePerHour: 420,
    languages: ["CZ", "EN"],
    isVerified: true,
    isFastReply: false,
    phone: "+420 777 444 333",
    ico: "12398472",
    bio: "Opravy elektroinstalace, zapojení spotřebičů, revize a montáž svítidel v Plzeňském kraji.",
    jobsDone: 68,
    gallery: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop"
    ],
    reviews: [
      { author: "Karel N.", rating: 5, text: "Rychlé zapojení indukční desky a nové zásuvky." }
    ]
  },

  // HELPERS / QUICK LABOR
  {
    id: 201,
    type: "helper",
    name: "Olena & Artem - Úklid a Pomocníci na stavbě",
    category: "catCleaning",
    city: "Praha",
    rating: 4.97,
    reviewsCount: 44,
    pricePerHour: 220,
    languages: ["UA", "CZ", "EN"],
    isVerified: true,
    isFastReply: true,
    phone: "+420 773 001 928",
    bio: "Spolehlivá dvojice s povolením k pobytu. Nabízíme precizní úklid domácností, mytí oken i pomocné práce na stavbě nebo zahradě.",
    jobsDone: 118,
    gallery: [
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop"
    ],
    reviews: [
      { author: "Lucie D.", rating: 5, text: "Olena u nás uklízí každý týden. Byt je naprosto zářivý!" },
      { author: "David P.", rating: 5, text: "Artem mi pomáhal nosit stavební materiál do 4. patra. Velmi pracovitý člověk." }
    ]
  },
  {
    id: 202,
    type: "helper",
    name: "Mykola K. - Hodinový pomocník & Stěhování",
    category: "catMoving",
    city: "Brno",
    rating: 4.91,
    reviewsCount: 31,
    pricePerHour: 200,
    languages: ["UA", "CZ"],
    isVerified: true,
    isFastReply: true,
    phone: "+420 792 334 112",
    bio: "Stěhování nábytku, pomoc na stavbě, sekání trávy, kopáčské práce a vyklízení sklepů. Vlastní dodávka k dispozici.",
    jobsDone: 83,
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop"
    ],
    reviews: [
      { author: "Radek S.", rating: 5, text: "Přestěhovali jsme celý byt 2+kk za 3 hodiny. Skvělá domluva." }
    ]
  },
  {
    id: 203,
    type: "helper",
    name: "Iryna S. - Úklid a žehlení",
    category: "catCleaning",
    city: "Ostrava",
    rating: 5.0,
    reviewsCount: 22,
    pricePerHour: 180,
    languages: ["UA", "CZ"],
    isVerified: true,
    isFastReply: true,
    phone: "+420 776 221 889",
    bio: "Nabízím jednorázový i pravidelný úklid bytů, kanceláří a žehlení prádla v Ostravě. Pečlivost a diskrétnost.",
    jobsDone: 64,
    gallery: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop"
    ],
    reviews: [
      { author: "Veronika K.", rating: 5, text: "Nejlepší úklid, co jsem kdy měla. Vše do detailu čisté." }
    ]
  },
  {
    id: 204,
    type: "helper",
    name: "Jan & Taras - Zahradníci & Terénní práce",
    category: "catGarden",
    city: "Praha",
    rating: 4.89,
    reviewsCount: 17,
    pricePerHour: 240,
    languages: ["CZ", "UA", "EN"],
    isVerified: false,
    isFastReply: true,
    phone: "+420 604 112 778",
    bio: "Kácení stromů, sekání trávy, stříhání živých plotů, čištění pozemků a pokládka trávníku.",
    jobsDone: 45,
    gallery: [
      "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600&auto=format&fit=crop"
    ],
    reviews: [
      { author: "Ondřej M.", rating: 5, text: "Zahrada prořezaná a uklizená za jedno odpoledne." }
    ]
  },
  {
    id: 205,
    type: "helper",
    name: "Vasyl Bondar - Hodinový manžel / Drobná údržba",
    category: "catHandyman",
    city: "Liberec",
    rating: 4.94,
    reviewsCount: 26,
    pricePerHour: 210,
    languages: ["UA", "CZ"],
    isVerified: true,
    isFastReply: true,
    phone: "+420 775 889 001",
    bio: "Sestavování nábytku IKEA/Asko, věšení obrazů, vrtání, výměna zámků a drobná údržba v domácnosti.",
    jobsDone: 72,
    gallery: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop"
    ],
    reviews: [
      { author: "Petra Š.", rating: 5, text: "Vasyl smontoval skříň a pověsil svítidla bez jediného problému." }
    ]
  }
];

// PUBLIC DEMANDS (POSTED BY CUSTOMERS WITH BUDGETS)
const mockDemands = [
  {
    id: 301,
    customerName: "Marek K. (Praha 4)",
    title: "Vymalování bytu 2+1 vč. materiálu a zakrytí nábytku",
    category: "catPainting",
    city: "Praha",
    budget: 4500,
    deadline: "Do konce týdne",
    phone: "+420 605 111 222",
    description: "Hledám šikovného malíře na vymalování bytu 2+1 v Praze 4 (cca 55 m²). Bílá barva, nábytek odsouváme sami."
  },
  {
    id: 302,
    customerName: "Lenka P. (Brno - Královo Pole)",
    title: "Generální úklid po malování a mytí 4 oken",
    category: "catCleaning",
    city: "Brno",
    budget: 2200,
    deadline: "Tento pátek odpoledne",
    phone: "+420 773 999 888",
    description: "Potřebujeme pečlivou paní/pána na generální úklid nově vymalovaného bytu. Mytí oken, vytření a úklid prachu."
  },
  {
    id: 303,
    customerName: "Zdeněk M. (Ostrava)",
    title: "Pomoc se stěhováním těžkého nábytku do 3. patra bez výtahu",
    category: "catMoving",
    city: "Ostrava",
    budget: 1800,
    deadline: "Zítra od 14:00",
    phone: "+420 732 444 555",
    description: "Hledám 2 silné pomocníky na cca 2 hodiny práce. Vynosení gauče, skříně a pračky do 3. patra."
  },
  {
    id: 304,
    customerName: "Michal V. (Plzeň)",
    title: "Sekání trávy a odvoz bioodpadu z velké zahrady (800 m²)",
    category: "catGarden",
    city: "Plzeň",
    budget: 2500,
    deadline: "Během tohoto víkendu",
    phone: "+420 777 222 333",
    description: "Posekání vysoké trávy na zahradě u rodinného domu a naložení na přívěs. Vlastní sekačka výhodou."
  }
];

const priceEstimates = {
  catCleaning: { base: 200, unit: "m² / hod", multiplier: 12 },
  catHandyman: { base: 250, unit: "hod", multiplier: 250 },
  catPainting: { base: 80, unit: "m² stěny", multiplier: 80 },
  catPlumbing: { base: 450, unit: "úkon", multiplier: 450 },
  catElectrical: { base: 420, unit: "hod", multiplier: 420 },
  catMoving: { base: 300, unit: "hod", multiplier: 300 },
  catGarden: { base: 220, unit: "hod", multiplier: 220 },
  catConstruction: { base: 200, unit: "hod", multiplier: 200 }
};
