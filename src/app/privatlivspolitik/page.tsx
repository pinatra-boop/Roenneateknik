import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privatlivspolitik",
  description: "Rønne Autoteknik privatlivspolitik og behandling af personoplysninger.",
};

export default async function PrivatlivspolitikPage() {
  const g = await getContent("global");

  return (
    <>
      <Navbar phone={g.phone} phoneRaw={g.phoneRaw} tagline={g.tagline} />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold font-heading mb-8">Privatlivspolitik</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-text-muted">
            <section>
              <h2 className="text-xl font-bold text-text font-heading mb-3">Dataansvarlig</h2>
              <p>Rønne Autoteknik er dataansvarlig for behandlingen af de personoplysninger, vi modtager om dig.</p>
              <p className="mt-2">{g.address}<br />{g.email}<br />{g.phone}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-text font-heading mb-3">Hvilke oplysninger indsamler vi</h2>
              <p>Vi indsamler følgende oplysninger når du booker en tid eller kontakter os:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Navn, email og telefonnummer</li>
                <li>Adresse (valgfrit)</li>
                <li>Biloplysninger (nummerplade, mærke, model)</li>
                <li>Beskeder du sender til os</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-text font-heading mb-3">Formål med behandlingen</h2>
              <p>Vi bruger dine oplysninger til at:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Håndtere bookinger og aftaler</li>
                <li>Besvare henvendelser</li>
                <li>Sende bekræftelser og påmindelser</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-text font-heading mb-3">Opbevaring og sletning</h2>
              <p>Vi opbevarer dine oplysninger så længe det er nødvendigt for det formål, de er indsamlet til, og i overensstemmelse med gældende lovgivning.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-text font-heading mb-3">Dine rettigheder</h2>
              <p>Du har ret til at få indsigt i, rette eller slette de oplysninger vi har om dig. Kontakt os på {g.email} for at gøre brug af disse rettigheder.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
