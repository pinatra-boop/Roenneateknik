import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingCTA from "@/components/sections/BookingCTA";
import { Award, Users, MapPin, Calendar, Wrench } from "lucide-react";
import { getAllContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Om Os",
  description: "Lær Rønne Autoteknik at kende. Vi har serviceret biler på Bornholm siden 2005 med faglig stolthed og en personlig tilgang.",
};

const STAT_ICONS = [Calendar, Users, Wrench, Award];

export default async function OmOsPage() {
  const content = await getAllContent();
  const g = content.global;
  const a = content.about;

  return (
    <>
      <Navbar phone={g.phone} phoneRaw={g.phoneRaw} tagline={g.tagline} />
      <main className="pt-24">
        {/* Hero */}
        <section className="section-padding bg-gradient-to-b from-primary to-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-sm font-medium mb-4">
                  {a.badge}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-5">
                  {a.heading}{" "}
                  <span className="gradient-text">{a.headingGradient}</span>
                </h1>
                <p className="text-text-muted leading-relaxed mb-5">{a.text1}</p>
                <p className="text-text-muted leading-relaxed">{a.text2}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {a.stats.map(({ value, label }, i) => {
                  const Icon = STAT_ICONS[i % STAT_ICONS.length];
                  return (
                    <div key={label} className="glass-light rounded-2xl p-5 border border-border text-center">
                      <div className="inline-flex p-3 rounded-xl bg-accent/15 mb-3">
                        <Icon size={20} className="text-accent" />
                      </div>
                      <p className="text-3xl font-bold gradient-text font-heading">{value}</p>
                      <p className="text-text-muted text-sm mt-1">{label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-heading mb-3">{a.historyHeading}</h2>
              <p className="text-text-muted">{a.historySubtext}</p>
            </div>
            <div className="relative">
              <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
              {a.milestones.map((m, i) => (
                <div key={m.year} className={`flex gap-6 mb-8 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "sm:text-right" : "sm:text-left"} pl-14 sm:pl-0`}>
                    <div className="glass-light rounded-2xl border border-border p-4">
                      <p className="text-accent font-bold text-lg font-heading">{m.year}</p>
                      <p className="text-text-muted text-sm mt-1">{m.text}</p>
                    </div>
                  </div>
                  <div className="absolute left-6 sm:relative sm:left-auto flex-shrink-0 sm:flex items-center sm:w-12 justify-center">
                    <div className="w-3 h-3 rounded-full bg-accent ring-4 ring-accent/20" />
                  </div>
                  <div className="hidden sm:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section-padding bg-gradient-to-b from-surface to-surface/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-heading mb-3">{a.teamHeading}</h2>
              <p className="text-text-muted">{a.teamSubtext}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {a.team.map((member) => (
                <div key={member.name} className="glass-light rounded-2xl border border-border p-6 text-center hover:border-accent/30 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-primary-light/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent font-heading">{member.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-bold text-text font-heading">{member.name}</h3>
                  <p className="text-accent text-sm mt-1">{member.role}</p>
                  <p className="text-text-muted text-xs mt-2">{member.experience}</p>
                  <div className="mt-3 px-3 py-1.5 rounded-lg bg-surface border border-border">
                    <p className="text-text-muted text-xs">{member.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-heading mb-3">{a.valuesHeading}</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {a.values.map(({ title, desc }) => (
                <div key={title} className="glass-light rounded-2xl border border-border p-6">
                  <h3 className="font-bold text-text font-heading mb-2">{title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
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
