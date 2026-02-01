import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@giuseppefalcone.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "changeme123";

  // Check if admin already exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin user ${adminEmail} already exists. Skipping seed.`);
    return;
  }

  // Create admin user
  const passwordHash = await hash(adminPassword, 12);

  const admin = await prisma.adminUser.create({
    data: {
      email: adminEmail,
      passwordHash,
      name: "Admin",
      role: "SUPER_ADMIN",
    },
  });

  console.log(`Created admin user: ${admin.email}`);

  // Create initial site settings
  await prisma.siteSettings.upsert({
    where: { slug: "main" },
    update: {},
    create: {
      slug: "main",
      siteName: "Giuseppe Falcone",
      tagline: "Master of 70s/80s/90s Classics",
      contactEmail: "booking@giuseppefalcone.com",
      bookingEnabled: true,
    },
  });

  console.log("Created site settings");

  // Create initial press kit
  await prisma.pressKit.upsert({
    where: { slug: "main" },
    update: {},
    create: {
      slug: "main",
      bioShort: "Giuseppe Falcone is a legendary DJ specializing in 70s disco, 80s synth-pop, and 90s dance classics. With over three decades of experience, he has mastered the art of creating unforgettable musical journeys through the golden era of dance music.",
      bioLong: "Born and raised in Italy, Giuseppe discovered his love for music in the vibrant disco era of the late 1970s. What started as a passion for collecting vinyl records soon evolved into a career that would span continents and generations.\n\nThrough the synth-driven revolution of the 80s and the explosive dance scene of the 90s, Giuseppe was there - not just as a witness, but as an active participant shaping the soundscape of countless dancefloors.\n\nEvery set is a carefully crafted journey through time. Giuseppe believes in the power of music to transport people, to trigger memories, and to create new ones.",
      achievements: [
        "35+ years of professional DJing",
        "Performed at 1200+ events worldwide",
        "Resident DJ at legendary nightclubs",
        "Featured in major music publications",
      ],
    },
  });

  console.log("Created press kit");
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
