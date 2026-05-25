import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import { CalendarDays, Shield, Clock, CheckCircle } from "lucide-react";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Book Tid Online",
  description:
    "Book tid på Rønne Autoteknik. Vælg service, dato og tidspunkt. Vi henter automatisk dine biloplysninger.",
};

const features = [
  { icon: CalendarDays, text: "Vælg din dato og tid" },
  { icon: Shield, text: "Ingen bindende bestilling" },
  { icon: Clock, text: "Bekræftelse inden for 24 timer" },
  { icon: CheckCircle, text: "Gratis opslag af biloplysninger" },
];

export default async function BookingPage() {
  const g = await getContent("global");
  return (
    <>
      <Navbar phone={g.phone} phoneRaw={g.phoneRaw} tagline={g.tagline} />
      <main className="pt-24 pb-20">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-b from-primary to-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-sm font-medium mb-4">
              <CalendarDays size={14} />
              Online booking
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-4">
              Book din tid
            </h1>
            <p className="text-text-muted max-w-lg mx-auto mb-8">
              Under 2 minutter. Vi bekræfter din booking og sender dig en
              email-kvittering med alle detaljer.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {features.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-sm text-text-muted"
                >
                  <Icon size={14} className="text-accent" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-6">
          <div className="glass-light rounded-3xl border border-border p-6 sm:p-8 shadow-2xl">
            <BookingForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
