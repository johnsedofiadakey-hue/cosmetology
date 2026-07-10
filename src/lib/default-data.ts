import bcrypt from "bcryptjs";

// LOÙ Beauty Hub brand palette, derived from the logo (blush rose + metallic
// gold on warm cream, ink-black wordmark). primaryColor is a deepened rose
// (not the pale logo pink directly) so it holds AA contrast under white
// button text; accentColor stays a true bright gold for icons/borders/chips
// but is intentionally NOT used for small body text (gold can't hit 4.5:1
// against white while still reading as "gold" — see components that swap to
// textPrimary/primary for actual copy instead).
export const defaultSettings = {
  id: 1,
  companyName: "LOÙ Beauty Hub",
  logoUrl: "/logo.jpg",
  primaryColor: "#A85F54",
  secondaryColor: "#FBF1EA",
  accentColor: "#C9A227",
  textPrimaryColor: "#241C1A",
  textSecondaryColor: "#7A6A63",
  fontFamily: "Playfair Display",
  heroTitle: "Elevate Your Natural Beauty",
  heroSubtitle: "Subtle. Intentional. Beautiful — cosmetology services tailored to you.",
  heroImage: "/lou_beauty_hero_bg.png",
  heroVideoUrl: "",
  heroMediaType: "image",
  contactEmail: "hello@loubeautyhub.com",
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
  // Off by default: clients pay by cash/Mobile Money in person, so booking
  // doesn't require an online deposit until Paystack is actually wired up.
  requireDeposit: false,
  enableOTP: true,
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

// Seed-only plaintext passwords, hashed below before ever landing in the
// store. Change these via the admin UI after first login in a real deployment.
export const defaultUsers = [
  {
    id: "solo-owner-id",
    email: "admin@loubeautyhub.com",
    password: bcrypt.hashSync("admin123", 10),
    name: "Studio Owner",
    role: "STAFF",
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "default-client-user-id",
    email: "jane@doe.com",
    password: bcrypt.hashSync("password123", 10),
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
