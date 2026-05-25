import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrugteBilerClient from "./BrugteBilerClient";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Brugte Biler",
  description: "Se vores udvalg af brugte biler til salg. Alle biler er gennemgået og klargøres inden salg.",
};

export default async function BrugteBilerPage() {
  const g = await getContent("global");

  return (
    <>
      <Navbar phone={g.phone} phoneRaw={g.phoneRaw} tagline={g.tagline} />
      <main className="pt-24 pb-20">
        {/* Header */}
        <div className="text-center mb-14 px-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-sm font-medium mb-4">
            Brugtbilsafdeling
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-4">
            Brugte biler til salg
          </h1>
          <p className="text-text-muted max-w-lg mx-auto">
            Alle vores brugte biler er gennemgået og klargøres inden salg.
            Fuld servicehistorik medfølger.
          </p>
        </div>

        <BrugteBilerClient />
      </main>
      <Footer />
    </>
  );
}
