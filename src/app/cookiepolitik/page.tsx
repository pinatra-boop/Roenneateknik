import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Cookiepolitik",
  description: "Rønne Autoteknik cookiepolitik.",
};

export default async function CookiepolitikPage() {
  const g = await getContent("global");

  return (
    <>
      <Navbar phone={g.phone} phoneRaw={g.phoneRaw} tagline={g.tagline} />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold font-heading mb-8">Cookiepolitik</h1>
          <div className="space-y-6 text-text-muted">
            <section>
              <h2 className="text-xl font-bold text-text font-heading mb-3">Hvad er cookies</h2>
              <p>Cookies er små tekstfiler, der gemmes på din computer eller enhed, når du besøger en hjemmeside. De bruges til at huske dine præferencer og forbedre din oplevelse.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-text font-heading mb-3">Hvilke cookies bruger vi</h2>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li><strong className="text-text">Nødvendige cookies:</strong> Bruges til at hjemmesiden fungerer korrekt, herunder login-session til admin.</li>
                <li><strong className="text-text">Funktionelle cookies:</strong> Husker dine valg og præferencer på siden.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-text font-heading mb-3">Samtykke</h2>
              <p>Ved at bruge vores hjemmeside accepterer du vores brug af cookies. Du kan til enhver tid slette cookies i din browsers indstillinger.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-text font-heading mb-3">Kontakt</h2>
              <p>Har du spørgsmål til vores cookiepolitik, er du velkommen til at kontakte os på {g.email}.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
