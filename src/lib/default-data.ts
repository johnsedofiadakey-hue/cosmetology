export const defaultSettings = {
  id: 1,
  companyName: "LOU Beauty Hub",
  logoUrl: "/logo.jpg",
  primaryColor: "#052e16",
  secondaryColor: "#fef3c7",
  accentColor: "#10b981",
  textPrimaryColor: "#18181b",
  textSecondaryColor: "#71717a",
  fontFamily: "Inter",
  heroTitle: "Elevate Your Natural Beauty",
  heroSubtitle: "Professional cosmetology services tailored to you.",
  heroImage: "/beauty_hero_bg.png",
  heroVideoUrl: "",
  heroMediaType: "image",
  contactEmail: "hello@beautystudio.com",
  contactPhone: "+233 00 000 0000",
  address: "Accra, Ghana",
  whatsappNumber: "233000000000",
  instagramUrl: "",
  facebookUrl: "",
  tiktokUrl: "",
  youtubeUrl: "",
  twitterUrl: "",
  currencySymbol: "GH₵",
  paystackPublicKey: "",
  enableOTP: false,
  updatedAt: new Date(0).toISOString(),
};

export const defaultServices = [
  {
    id: "hair-1",
    name: "Precision Cut & Balayage",
    description: "Our signature hair transformation.",
    price: 150,
    duration: 120,
    category: "Hair",
    image: "/service_hair.png",
    materials: [],
  },
  {
    id: "skin-1",
    name: "Signature Glow Facial",
    description: "A restorative skin treatment for a radiant finish.",
    price: 120,
    duration: 75,
    category: "Skin",
    image: "/service_skin.png",
    materials: [],
  },
  {
    id: "nails-1",
    name: "Luxury Nail Ritual",
    description: "Detailed nail care with a polished, long-lasting result.",
    price: 80,
    duration: 60,
    category: "Nails",
    image: "/service_nails.png",
    materials: [],
  },
];

export const defaultInventory = [
  {
    id: "inv-1",
    name: "Developer 20vol",
    sku: "DEV-20",
    quantity: 1000,
    unit: "ml",
    minThreshold: 200,
    lastRestocked: new Date(0).toISOString(),
    projectedUsage: 0,
    projectedBalance: 1000,
    isForecastingLow: false,
  },
];

export const defaultUsers = [
  {
    id: "solo-owner-id",
    email: "admin@beautystudio.com",
    password: "admin123",
    name: "Studio Owner",
    role: "STAFF",
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "default-client-user-id",
    email: "jane@doe.com",
    password: "password123",
    name: "Jane Doe",
    role: "CLIENT",
    createdAt: new Date(0).toISOString(),
  },
];

export const defaultClients = [
  {
    id: "default-client-id",
    userId: "default-client-user-id",
    phone: "+1 555-0101",
    notes: "",
  },
];

export const defaultStore = {
  settings: defaultSettings,
  services: defaultServices,
  inventory: defaultInventory,
  users: defaultUsers,
  clients: defaultClients,
  staff: [
    {
      id: "solo-staff-id",
      userId: "solo-owner-id",
      bio: "Professional Cosmetologist with 10+ years experience.",
      specialties: "Hair, Skin",
      isActive: true,
    },
  ],
  appointments: [],
  formulations: [],
  portfolio: [],
};
