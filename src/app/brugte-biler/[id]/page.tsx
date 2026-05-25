import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarDetailClient from "./CarDetailClient";
import { formatPrice, formatMileage } from "@/lib/utils";
import { ArrowLeft, Phone, Mail, Gauge, Fuel, Settings2, Palette, Calendar } from "lucide-react";
import { getContent } from "@/lib/content";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) return { title: "Bil ikke fundet" };
  return { title: `${car.brand} ${car.model} ${car.year} – Rønne Autoteknik` };
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [car, g] = await Promise.all([
    prisma.car.findUnique({ where: { id } }),
    getContent("global"),
  ]);

  if (!car || !car.active) notFound();

  const specs = [
    { icon: Calendar, label: "Årgang", value: String(car.year) },
    { icon: Gauge, label: "Km-stand", value: formatMileage(car.mileage) },
    { icon: Fuel, label: "Brændstof", value: car.fuel },
    { icon: Settings2, label: "Gearkasse", value: car.transmission },
    ...(car.color ? [{ icon: Palette, label: "Farve", value: car.color }] : []),
  ];

  return (
    <>
      <Navbar phone={g.phone} phoneRaw={g.phoneRaw} tagline={g.tagline} />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            href="/brugte-biler"
            className="inline-flex items-center gap-2 text-text-muted hover:text-accent text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Tilbage til alle biler
          </Link>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: images + description */}
            <div className="lg:col-span-3 space-y-6">
              <CarDetailClient images={car.images} />

              {car.description && (
                <div className="glass-light rounded-2xl border border-border p-6">
                  <h2 className="font-bold font-heading mb-3">Om bilen</h2>
                  <p className="text-text-muted leading-relaxed whitespace-pre-line">
                    {car.description}
                  </p>
                </div>
              )}

              {car.equipment.length > 0 && (
                <div className="glass-light rounded-2xl border border-border p-6">
                  <h2 className="font-bold font-heading mb-4">Udstyr</h2>
                  <ul className="grid grid-cols-2 gap-2">
                    {(car.equipment as string[]).map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-text-muted">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: info + contact */}
            <div className="lg:col-span-2 space-y-5">
              {/* Title + price */}
              <div className="glass-light rounded-2xl border border-border p-6">
                <div className="flex items-start justify-between mb-1">
                  <h1 className="text-2xl font-bold font-heading">
                    {car.brand} {car.model}
                  </h1>
                  {car.sold && (
                    <span className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 text-xs font-bold">
                      Solgt
                    </span>
                  )}
                </div>
                <p className="text-text-muted mb-4">{car.year}</p>
                <p className="text-3xl font-bold text-accent">{formatPrice(car.price)}</p>
              </div>

              {/* Specs */}
              <div className="glass-light rounded-2xl border border-border p-6">
                <h2 className="font-bold font-heading mb-4 text-sm uppercase tracking-wide text-text-muted">
                  Specifikationer
                </h2>
                <div className="space-y-3">
                  {specs.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-text-muted">
                        <Icon size={14} className="text-accent" />
                        {label}
                      </span>
                      <span className="text-sm font-medium text-text">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              {!car.sold && (
                <div className="glass-light rounded-2xl border border-border p-6">
                  <h2 className="font-bold font-heading mb-4">Interesseret?</h2>
                  <p className="text-text-muted text-sm mb-5">
                    Kontakt os for en prøvetur eller mere information om bilen.
                  </p>
                  <div className="space-y-3">
                    <a
                      href="tel:+4556000000"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-accent hover:bg-accent-light text-white font-bold text-sm transition-colors"
                    >
                      <Phone size={16} />
                      Ring til os
                    </a>
                    <Link
                      href={`/kontakt?bil=${encodeURIComponent(`${car.brand} ${car.model} ${car.year}`)}`}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border bg-surface-light/50 hover:border-accent/40 text-text font-medium text-sm transition-colors"
                    >
                      <Mail size={16} className="text-accent" />
                      Send besked
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
