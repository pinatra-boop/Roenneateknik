import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeder database...");

  // Admin bruger
  const hashedPassword = await bcrypt.hash("admin123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@ronneautoteknik.dk" },
    update: {},
    create: {
      email: "admin@ronneautoteknik.dk",
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin bruger oprettet: admin@ronneautoteknik.dk / admin123!");

  // Services
  const services = [
    { name: "Olieskift", slug: "olieskift", description: "Komplet olieskift med filterudskiftning", price: "fra 599 kr.", duration: "30-60 min", order: 1 },
    { name: "Bremseskift", slug: "bremseskift", description: "Professionel udskiftning af bremseklodser og -skiver", price: "fra 899 kr.", duration: "60-120 min", order: 2 },
    { name: "Synsforberedelse", slug: "synsforberedelse", description: "Klargøring til syn", price: "fra 499 kr.", duration: "45-90 min", order: 3 },
    { name: "Dækskift", slug: "daekskift", description: "Dækmontage og balancering", price: "fra 399 kr.", duration: "30 min", order: 4 },
    { name: "Klimaservice", slug: "klimaservice", description: "Opfyldning og kontrol af klimaanlæg", price: "fra 699 kr.", duration: "60 min", order: 5 },
    { name: "Fejldiagnose", slug: "fejldiagnose", description: "Computerbaseret fejlsøgning", price: "fra 349 kr.", duration: "30-60 min", order: 6 },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: { ...service, featured: true },
    });
  }
  console.log("✅ Services oprettet");

  // Demo anmeldelser
  const reviews = [
    { author: "Mette Hansen", rating: 5, text: "Fantastisk service! Hurtig og fair pris." },
    { author: "Lars Nielsen", rating: 5, text: "Bestilte tid online – nemt og hurtigt. Vil varmt anbefale." },
    { author: "Sofie Andersen", rating: 5, text: "Har brugt dem i mange år. Altid imødekommende." },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review }).catch(() => {});
  }
  console.log("✅ Anmeldelser oprettet");

  console.log("\n🎉 Database seedet succesfuldt!");
  console.log("Login: admin@ronneautoteknik.dk");
  console.log("Kodeord: admin123!");
  console.log("\n⚠️  Husk at skifte adgangskoden i produktion!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
