import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KontaktForm from "./KontaktForm";
import { getAllContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontakt Rønne Autoteknik. Ring, skriv eller besøg os på Bornholm.",
};

export default async function KontaktPage() {
  const content = await getAllContent();
  const g = content.global;

  return (
    <>
      <Navbar phone={g.phone} phoneRaw={g.phoneRaw} tagline={g.tagline} />
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-sm font-medium mb-4">
              Kontakt os
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-4">
              Kom i kontakt
            </h1>
            <p className="text-text-muted max-w-lg mx-auto">
              Har du spørgsmål? Vi er klar til at hjælpe dig.
            </p>
          </div>

          <KontaktForm global={g} />

          {/* Map */}
          <div className="mt-14">
            <div className="rounded-3xl overflow-hidden border border-border h-80 bg-surface-light flex items-center justify-center">
              <div className="text-center text-text-muted">
                <MapPin size={40} className="text-accent mx-auto mb-3" />
                <p className="font-medium">{g.address}</p>
                <a
                  href="https://maps.google.com/?q=Storegade+1,3700+Rønne"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent text-sm hover:underline mt-2 inline-block"
                >
                  Åbn i Google Maps →
                </a>
                <p className="text-xs mt-4 max-w-xs mx-auto">
                  Indsæt din Google Maps API-nøgle i .env.local for at vise et interaktivt kort her.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
