import { prisma } from "./prisma";

export interface GlobalContent {
  tagline: string;
  phone: string;
  phoneRaw: string;
  email: string;
  address: string;
  openingHours: { day: string; hours: string }[];
}

export interface HeroContent {
  badge: string;
  heading1: string;
  heading2: string;
  heading3: string;
  subtext: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: { value: string; label: string }[];
  trustBadge1: string;
  trustBadge2: string;
}

export interface WhyUsContent {
  badge: string;
  heading: string;
  headingGradient: string;
  subtext: string;
  progressBars: { label: string; value: number }[];
  reasons: { title: string; description: string }[];
}

export interface BookingCTAContent {
  heading: string;
  subtext: string;
  ctaPrimary: string;
  ctaSecondary: string;
  hoursText: string;
}

export interface AboutContent {
  badge: string;
  heading: string;
  headingGradient: string;
  text1: string;
  text2: string;
  stats: { value: string; label: string }[];
  historyHeading: string;
  historySubtext: string;
  milestones: { year: string; text: string }[];
  teamHeading: string;
  teamSubtext: string;
  team: { name: string; role: string; experience: string; specialty: string }[];
  valuesHeading: string;
  values: { title: string; desc: string }[];
}

export interface ContentMap {
  global: GlobalContent;
  hero: HeroContent;
  why_us: WhyUsContent;
  booking_cta: BookingCTAContent;
  about: AboutContent;
}

export const CONTENT_DEFAULTS: ContentMap = {
  global: {
    tagline: "Professionelt Autoværksted",
    phone: "56 00 00 00",
    phoneRaw: "+4556000000",
    email: "info@ronneautoteknik.dk",
    address: "Storegade 1, 3700 Rønne",
    openingHours: [
      { day: "Mandag", hours: "08:00 – 17:00" },
      { day: "Tirsdag", hours: "08:00 – 17:00" },
      { day: "Onsdag", hours: "08:00 – 17:00" },
      { day: "Torsdag", hours: "08:00 – 17:00" },
      { day: "Fredag", hours: "08:00 – 17:00" },
      { day: "Lørdag", hours: "08:00 – 13:00" },
      { day: "Søndag", hours: "Lukket" },
    ],
  },
  hero: {
    badge: "Dit service værksted på Bornholm",
    heading1: "Din bil",
    heading2: "fortjener det",
    heading3: "bedste",
    subtext:
      "Professionel service og reparation af alle bilmærker. Vi kombinerer moderne teknologi med årtiers erfaring for at holde din bil i perfekt stand – til en fair pris.",
    ctaPrimary: "Book tid online",
    ctaSecondary: "Ring til os",
    stats: [
      { value: "19+", label: "Års erfaring" },
      { value: "4.8★", label: "Trustpilot" },
      { value: "2.500+", label: "Tilfredse kunder" },
      { value: "100%", label: "Certificeret" },
    ],
    trustBadge1: "4.8 på Trustpilot",
    trustBadge2: "Alle bilmærker",
  },
  why_us: {
    badge: "Hvorfor vælge os",
    heading: "Mere end blot et",
    headingGradient: "autoværksted",
    subtext:
      "Hos Rønne Autoteknik er vi ikke tilfredse, før du er det. Vi kombinerer faglig ekspertise med en personlig service, der gør hele oplevelsen nem og tryg for dig.",
    progressBars: [
      { label: "Kundetilfredshed", value: 98 },
      { label: "Løste opgaver rettidigt", value: 95 },
      { label: "Anbefaler os videre", value: 97 },
    ],
    reasons: [
      { title: "Alle bilmærker", description: "Vi servicerer alle mærker og modeller – fra veteran til moderne el-bil. Ingen bil er for gammel eller for ny." },
      { title: "Hurtig ekspedition", description: "Vi respekterer din tid. De fleste opgaver klares samme dag eller inden for 24 timer." },
      { title: "Moderne udstyr", description: "Vi investerer løbende i det nyeste diagnostik- og serviceudstyr til alle bilmærker." },
      { title: "Fair priser", description: "Ingen skjulte gebyrer. Du får et klart tilbud inden arbejdet begynder." },
      { title: "2 års garanti", description: "Alle reparationer og udskiftninger er dækket af 2 års garanti på arbejde og dele." },
      { title: "El-biler & hybrider", description: "Vi servicerer alle typer køretøjer inkl. el-biler og plug-in hybrider." },
    ],
  },
  booking_cta: {
    heading: "Klar til at booke?",
    subtext:
      "Book din tid online på under 2 minutter. Vi bekræfter din booking med det samme og sender en email-kvittering.",
    ctaPrimary: "Book tid online",
    ctaSecondary: "Ring: 56 00 00 00",
    hoursText: "Mandag – Fredag: 08:00–17:00 · Lørdag: 08:00–13:00",
  },
  about: {
    badge: "Om Rønne Autoteknik",
    heading: "Passion for biler –",
    headingGradient: "siden 2005",
    text1:
      "Rønne Autoteknik er Bornholms foretrukne autoværksted. Gennem næsten to årtier har vi kombineret faglig ekspertise med en personlig service, der sætter kunden i centrum.",
    text2:
      "Vi er AutoMester-godkendt og servicerer alle bilmærker – fra ældre veteraner til moderne el-biler. Vores hold af erfarne mekanikere sikrer, at din bil altid er i top stand.",
    stats: [
      { value: "19+", label: "Års erfaring" },
      { value: "2.500+", label: "Kunder" },
      { value: "15.000+", label: "Reparationer" },
      { value: "4.8★", label: "Gennemsnit" },
    ],
    historyHeading: "Vores historie",
    historySubtext: "Fra beskedne start til Bornholms mest betroede værksted",
    milestones: [
      { year: "2005", text: "Rønne Autoteknik åbner dørene med 3 ansatte" },
      { year: "2010", text: "AutoMester godkendelse opnået" },
      { year: "2015", text: "Ny hal med moderne diagnostikudstyr" },
      { year: "2018", text: "El-bil certificering – klar til fremtiden" },
      { year: "2022", text: "Online booking system lanceret" },
      { year: "2024", text: "500+ tilfredse kunder og fortsat vækst" },
    ],
    teamHeading: "Mød teamet",
    teamSubtext: "Erfarne fagfolk der brænder for biler",
    team: [
      { name: "Thomas Bornholm", role: "Indehaver & Mekaniker", experience: "20+ års erfaring", specialty: "Motor & gearkasse" },
      { name: "Maria Jensen", role: "Servicekoordinator", experience: "12 års erfaring", specialty: "Kundekontakt & booking" },
      { name: "Lars Andersen", role: "Elektriker & Mekaniker", experience: "10 års erfaring", specialty: "El-biler & diagnostik" },
      { name: "Søren Petersen", role: "Mekaniker", experience: "8 års erfaring", specialty: "Bremser & hjulophæng" },
    ],
    valuesHeading: "Vores værdier",
    values: [
      { title: "Ærlighed", desc: "Vi giver dig altid et klart billede af, hvad der skal laves og hvad det koster – ingen ubehagelige overraskelser." },
      { title: "Kvalitet", desc: "Vi bruger kun originale eller godkendte reservedele og arbejder efter de højeste faglige standarder." },
      { title: "Fællesskab", desc: "Vi er en del af Bornholms samfund og tager ansvar for de mennesker vi servicerer – både lokale og turister." },
    ],
  },
};

export async function getContent<K extends keyof ContentMap>(key: K): Promise<ContentMap[K]> {
  try {
    const setting = await prisma.siteSettings.findUnique({ where: { key } });
    if (!setting?.value) return CONTENT_DEFAULTS[key];
    return { ...CONTENT_DEFAULTS[key], ...JSON.parse(setting.value) } as ContentMap[K];
  } catch {
    return CONTENT_DEFAULTS[key];
  }
}

export async function getAllContent(): Promise<ContentMap> {
  try {
    const keys = Object.keys(CONTENT_DEFAULTS) as (keyof ContentMap)[];
    const settings = await prisma.siteSettings.findMany({ where: { key: { in: keys } } });
    const result = structuredClone(CONTENT_DEFAULTS) as ContentMap;
    for (const s of settings) {
      if (s.key in CONTENT_DEFAULTS) {
        const k = s.key as keyof ContentMap;
        try {
          (result as unknown as Record<string, unknown>)[k] = {
            ...(CONTENT_DEFAULTS[k] as object),
            ...JSON.parse(s.value),
          };
        } catch { /* keep default */ }
      }
    }
    return result;
  } catch {
    return CONTENT_DEFAULTS;
  }
}
