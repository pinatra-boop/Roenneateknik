import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingCTA from "@/components/sections/BookingCTA";
import { getContent, getAllContent } from "@/lib/content";
import { servicesData } from "@/lib/services-data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  if (!service) return { title: "Service ikke fundet" };
  return {
    title: service.title,
    description: service.description,
  };
}

export async function generateStaticParams() {
  return servicesData.map((s) => ({ slug: s.slug }));
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  if (!service) notFound();

  const content = await getAllContent();
  const g = content.global;

  return (
    <>
      <Navbar phone={g.phone} phoneRaw={g.phoneRaw} tagline={g.tagline} />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/services" className="inline-flex items-center gap-2 text-text-muted hover:text-accent text-sm mb-8 transition-colors">
            <ArrowLeft size={16} /> Alle services
          </Link>

          <div className="glass-light rounded-3xl border border-border p-8 sm:p-12 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-sm font-medium mb-3">
                  Service
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold font-heading">{service.title}</h1>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold gradient-text font-heading">{service.price}</p>
                <p className="text-text-muted text-sm flex items-center gap-1 justify-end mt-1">
                  <Clock size={14} /> {service.duration}
                </p>
              </div>
            </div>

            <p className="text-text-muted leading-relaxed mb-8">{service.description}</p>

            <div className="mb-8">
              <h2 className="font-bold font-heading mb-4">Hvad er inkluderet</h2>
              <ul className="space-y-2">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-text-muted">
                    <CheckCircle size={16} className="text-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light rounded-2xl text-white font-bold transition-all hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5"
            >
              Book {service.title} <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <BookingCTA content={content.booking_cta} />
      </main>
      <Footer />
    </>
  );
}
