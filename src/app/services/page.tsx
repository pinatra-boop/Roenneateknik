import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingCTA from "@/components/sections/BookingCTA";
import { getAllContent } from "@/lib/content";
import Link from "next/link";
import {
  Droplets, Disc3, CircleCheck, Settings, Wind, Activity,
  Zap, Shield, Thermometer, ArrowRight, Clock, BadgeCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Se alle vores autoservice-ydelser: olieskift, bremseskift, synsforberedelse, dækskift og meget mere.",
};

const services = [
  {
    icon: Droplets,
    title: "Olieskift",
    slug: "olieskift",
    price: "fra 599 kr.",
    duration: "30-60 min",
    description:
      "Vi udfører olieskift på alle bilmærker og modeller. Inkluderer udskiftning af oliefilter og kontrol af olieniveau. Vi bruger olie af den type og viskositet, der er anbefalet til din bil.",
    includes: [
      "Aftapning af gammel olie",
      "Nyt oliefilter",
      "Påfyldning af godkendt motorolie",
      "Kontrol og nulstilling af service-indikator",
      "Generel visuel kontrol",
    ],
  },
  {
    icon: Disc3,
    title: "Bremseskift",
    slug: "bremseskift",
    price: "fra 899 kr.",
    duration: "60-120 min",
    description:
      "Professionel udskiftning af bremseklodser og/eller skiver. Vi arbejder med alle bilmærker og bruger originale eller godkendte kvalitetsdele.",
    includes: [
      "Kontrol af bremsebelægning",
      "Udskiftning af klodser/skiver efter behov",
      "Rengøring og smøring",
      "Prøvekørsel og kontrol",
    ],
  },
  {
    icon: CircleCheck,
    title: "Synsforberedelse",
    slug: "synsforberedelse",
    price: "fra 499 kr.",
    duration: "45-90 min",
    description:
      "Vi gennemgår din bil grundigt inden syn og udbedrer eventuelle fejl, så du er sikker på at bestå.",
    includes: [
      "Komplet synspunkter-gennemgang",
      "Lys og signalgivere",
      "Bremser og styretøj",
      "Dæk og fælge",
      "Udstødning og emissioner",
    ],
  },
  {
    icon: Settings,
    title: "Dækskift",
    slug: "daekskift",
    price: "fra 399 kr.",
    duration: "30-45 min",
    description:
      "Hurtig og professionel dækmontage med balancering. Vi tilbyder også sæsonopbevaring af dine ekstra dæk.",
    includes: [
      "Af- og påmontering",
      "Balancering",
      "Dæktryks-kontrol",
      "Tilbud om opbevaring",
    ],
  },
  {
    icon: Wind,
    title: "Klimaservice",
    slug: "klimaservice",
    price: "fra 699 kr.",
    duration: "60 min",
    description:
      "Opfyldning og kontrol af klimaanlæg. Vi tjekker for lækager og sikrer, at dit anlæg fungerer optimalt.",
    includes: [
      "Afpresning og kontrol",
      "Opfyldning af kølemiddel",
      "Tilsætning af olie",
      "Kabinefilter kontrol",
    ],
  },
  {
    icon: Activity,
    title: "Fejldiagnose",
    slug: "fejldiagnose",
    price: "fra 349 kr.",
    duration: "30-60 min",
    description:
      "Med moderne diagnostikudstyr finder vi fejlen i din bil hurtigt og præcist. Fejlkoder læses og fejlfindes.",
    includes: [
      "Komputer-diagnostik",
      "Fejlkode-analyse",
      "Rapport med fund",
      "Tilbud på udbedring",
    ],
  },
  {
    icon: Zap,
    title: "El-bil service",
    slug: "el-bil-service",
    price: "Kontakt os",
    duration: "Varierer",
    description:
      "Vi er certificeret til service og vedligeholdelse af el-biler og plug-in hybrider.",
    includes: [
      "Batteri-inspektion",
      "Softwareopdatering",
      "Ladeport kontrol",
      "Chassis og bremser",
    ],
  },
  {
    icon: Shield,
    title: "Stor service",
    slug: "stor-service",
    price: "fra 1.499 kr.",
    duration: "2-3 timer",
    description:
      "En komplet gennemgang af alle vitale komponenter i din bil. Anbefales hvert 2. år eller 30.000 km.",
    includes: [
      "Olieskift",
      "Alle filtre",
      "Tændingsanlæg",
      "Bremser",
      "Væskeniveauer",
      "Over 30 kontrolpunkter",
    ],
  },
];

export default async function ServicesPage() {
  const content = await getAllContent();
  const g = content.global;
  return (
    <>
      <Navbar phone={g.phone} phoneRaw={g.phoneRaw} tagline={g.tagline} />
      <main className="pt-24">
        {/* Header */}
        <section className="section-padding bg-gradient-to-b from-primary to-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-sm font-medium mb-4">
              Vores ydelser
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-4">
              Professionel service til alle biler
            </h1>
            <p className="text-text-muted max-w-2xl mx-auto leading-relaxed">
              Fra hurtig rutinemaintenance til komplekse reparationer. Vi
              servicerer alle bilmærker og modeller med moderne udstyr og
              erfarne hænder.
            </p>
          </div>
        </section>

        {/* Services grid */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <div
                  key={service.slug}
                  className="glass-light rounded-2xl border border-border p-6 hover:border-accent/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-accent/15 text-accent shrink-0 group-hover:bg-accent/25 transition-colors">
                      <service.icon size={22} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h2 className="font-bold text-xl font-heading">
                          {service.title}
                        </h2>
                        <div className="text-right shrink-0 ml-3">
                          <p className="text-accent font-bold">{service.price}</p>
                          <p className="text-text-muted text-xs flex items-center gap-1 justify-end">
                            <Clock size={10} />
                            {service.duration}
                          </p>
                        </div>
                      </div>
                      <p className="text-text-muted text-sm leading-relaxed mb-4">
                        {service.description}
                      </p>
                      <div className="space-y-1.5 mb-4">
                        {service.includes.map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-2 text-sm text-text-muted"
                          >
                            <BadgeCheck size={13} className="text-accent shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                      <Link
                        href="/booking"
                        className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline font-medium"
                      >
                        Book {service.title.toLowerCase()}
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <BookingCTA content={content.booking_cta} />
      </main>
      <Footer />
    </>
  );
}
