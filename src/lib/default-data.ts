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
  // "Our Story" — the short homepage teaser plus the full elaborated
  // version on the dedicated /about page. aboutBody supports blank-line
  // separated paragraphs.
  aboutHeading: "Our Story",
  aboutImage: "/service_hair.png",
  aboutIntro: "LOÙ Beauty Hub is more than a beauty brand — it is a space created with intention, care, and love.",
  aboutBody: "LOÙ Beauty Hub is more than a beauty brand—it is a space created with intention, care, and love. A brand dedicated to enhancing the natural beauty of women, restoring confidence, and creating a safe, refined experience for every woman who walks through our doors.\n\nThis is for the woman finding her glow again.\nThe woman learning to see herself differently.\nThe woman stepping into her softness, her power, and her full potential.",
  aboutBadgeNumber: "10+",
  aboutBadgeLabel: "Years of Luxury Experience",
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
  // Paystack isn't wired up yet, so a deposit requirement doesn't charge
  // online — it shows the policy below and Mobile Money instructions
  // instead, and the appointment is confirmed pending manual deposit
  // verification by the studio.
  requireDeposit: false,
  momoNumber: "",
  momoName: "",
  bookingPolicy: "A non-refundable booking deposit is required to secure all appointments. Your deposit will be deducted from the total cost of your service.\n\nIf you need to reschedule your appointment, please notify us at least 3 hours before your scheduled appointment time.\n\nAppointments rescheduled with 3 hours' notice or more may transfer the existing deposit to the new appointment.\n\nCancellations, same-day reschedules made with less than 3 hours' notice, and no-shows will result in the forfeiture of your booking deposit.\n\nA new deposit will be required to book another appointment after a late cancellation or no-show.\n\nBy booking an appointment with us, you acknowledge and agree to this policy.",
  enableOTP: true,
  updatedAt: new Date(0).toISOString(),
};

// priceMax is set only for range-priced services ("100-250"); fixed-price
// services (e.g. "200") just use price. duration is an estimate the admin
// can fine-tune per service via the Services edit form.
export const defaultServices = [
  // Waxing
  { id: "wax-full-face", name: "Full Face", description: "", price: 200, duration: 30, category: "Waxing", image: "", materials: [] },
  { id: "wax-underarms", name: "Underarms", description: "", price: 100, priceMax: 250, duration: 20, category: "Waxing", image: "", materials: [] },
  { id: "wax-full-arms", name: "Full Arms", description: "", price: 250, priceMax: 350, duration: 45, category: "Waxing", image: "", materials: [] },
  { id: "wax-legs", name: "Half Legs / Full Legs", description: "", price: 200, priceMax: 550, duration: 60, category: "Waxing", image: "", materials: [] },
  { id: "wax-full-body", name: "Full Body", description: "", price: 500, priceMax: 1500, duration: 120, category: "Waxing", image: "", materials: [] },
  { id: "wax-bikini", name: "Bikini Line", description: "", price: 150, duration: 20, category: "Waxing", image: "", materials: [] },
  { id: "wax-brazilian", name: "Brazilian (Back to Front)", description: "", price: 300, duration: 30, category: "Waxing", image: "", materials: [] },

  // Lashes
  { id: "lash-classic", name: "Classic", description: "", price: 150, duration: 90, category: "Lashes", image: "", materials: [] },
  { id: "lash-hybrid", name: "Hybrid", description: "", price: 220, duration: 105, category: "Lashes", image: "", materials: [] },
  { id: "lash-volume", name: "Volume", description: "", price: 300, duration: 120, category: "Lashes", image: "", materials: [] },
  { id: "lash-mega-volume", name: "Mega Volume", description: "", price: 350, duration: 135, category: "Lashes", image: "", materials: [] },
  { id: "lash-bottom", name: "Bottom Lashes", description: "", price: 50, duration: 30, category: "Lashes", image: "", materials: [] },

  // Brows
  { id: "brow-microblading", name: "Microblading", description: "", price: 500, duration: 120, category: "Brows", image: "", materials: [] },
  { id: "brow-lamination", name: "Brow Lamination", description: "", price: 350, duration: 45, category: "Brows", image: "", materials: [] },

  // Lips
  { id: "lip-blush", name: "Lip Blush", description: "Semi-permanent tattoo that adds a natural flush of pinkness to your lips.", price: 300, priceMax: 350, duration: 90, category: "Lips", image: "", materials: [] },
  { id: "lip-combo", name: "Lip Combo", description: "Creates fuller and more defined lip edges.", price: 200, priceMax: 250, duration: 60, category: "Lips", image: "", materials: [] },

  // Teeth Whitening
  { id: "teeth-whitening", name: "Teeth Whitening", description: "30 minutes per session.", price: 150, duration: 30, category: "Teeth Whitening", image: "", materials: [] },

  // Facials
  { id: "facial-anti-aging", name: "Anti-Aging / Rejuvenating Facial", description: "", price: 400, priceMax: 600, duration: 60, category: "Facials", image: "", materials: [] },

  // Skin Tag Removal
  { id: "skin-tag-removal", name: "Skin Tag Removal", description: "", price: 200, priceMax: 250, duration: 30, category: "Skin Tag Removal", image: "", materials: [] },
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
