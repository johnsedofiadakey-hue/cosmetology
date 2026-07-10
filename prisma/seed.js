const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.systemSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyName: "Beauty Studio",
      primaryColor: "#052e16",
      secondaryColor: "#fef3c7",
      accentColor: "#10b981",
      fontFamily: "Inter",
      heroTitle: "Elevate Your Natural Beauty",
      heroSubtitle: "Professional cosmetology services tailored to you.",
      heroImage: "/beauty_hero_bg.png",
      contactEmail: "hello@beautystudio.com",
      contactPhone: "+1 (555) 000-0000",
      address: "123 Beauty Lane, Luxury District",
      whatsappNumber: "15550000000"
    },
  });

  const hairService = await prisma.service.upsert({
    where: { id: 'hair-1' },
    update: {},
    create: {
      id: 'hair-1',
      name: "Precision Cut & Balayage",
      description: "Our signature hair transformation.",
      price: 150.0,
      duration: 120,
      category: "Hair",
      image: "/service_hair.png"
    }
  });

  const developer = await prisma.inventoryItem.upsert({
    where: { id: 'inv-1' },
    update: {},
    create: {
      id: 'inv-1',
      name: "Developer 20vol",
      sku: "DEV-20",
      quantity: 1000,
      unit: "ml",
      minThreshold: 200
    }
  });

  const existingMaterial = await prisma.serviceMaterial.findFirst({
    where: { serviceId: hairService.id, inventoryItemId: developer.id }
  });

  if (!existingMaterial) {
    await prisma.serviceMaterial.create({
      data: {
        serviceId: hairService.id,
        inventoryItemId: developer.id,
        estimatedUsage: 100.0
      }
    });
  }

  const owner = await prisma.user.upsert({
    where: { email: 'admin@beautystudio.com' },
    update: {},
    create: {
      id: 'solo-owner-id',
      email: 'admin@beautystudio.com',
      password: bcrypt.hashSync('admin123', 10),
      name: 'Studio Owner',
      role: 'STAFF'
    }
  });

  await prisma.staff.upsert({
    where: { userId: 'solo-owner-id' },
    update: {},
    create: {
      id: 'solo-staff-id',
      userId: 'solo-owner-id',
      bio: 'Professional Cosmetologist with 10+ years experience.',
      specialties: 'Hair, Skin'
    }
  });

  const clientUser = await prisma.user.upsert({
    where: { email: 'jane@doe.com' },
    update: {},
    create: {
      id: 'default-client-user-id',
      email: 'jane@doe.com',
      password: bcrypt.hashSync('password123', 10),
      name: 'Jane Doe',
      role: 'CLIENT'
    }
  });

  await prisma.client.upsert({
    where: { userId: 'default-client-user-id' },
    update: {},
    create: {
      id: 'default-client-id',
      userId: 'default-client-user-id',
      phone: '+1 555-0101'
    }
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
