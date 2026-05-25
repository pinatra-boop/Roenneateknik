import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Share2, MessageSquare } from "lucide-react";
import { getContent } from "@/lib/content";

const services = [
  { href: "/services/olieskift", label: "Olieskift" },
  { href: "/services/bremseskift", label: "Bremseskift" },
  { href: "/services/synsforberedelse", label: "Synsforberedelse" },
  { href: "/services/daekskift", label: "Dækskift" },
  { href: "/services/klimaservice", label: "Klimaservice" },
  { href: "/services/fejldiagnose", label: "Fejldiagnose" },
];

const quickLinks = [
  { href: "/", label: "Forside" },
  { href: "/om-os", label: "Om Os" },
  { href: "/brugte-biler", label: "Brugte Biler" },
  { href: "/booking", label: "Book Tid" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/privatlivspolitik", label: "Privatlivspolitik" },
];

export default async function Footer() {
  const g = await getContent("global");

  return (
    <footer className="bg-primary-dark border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <p className="font-bold text-text font-heading">Rønne Autoteknik</p>
                <p className="text-accent text-xs">{g.tagline}</p>
              </div>
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-5">
              Professionel bilservice og reparation på Bornholm siden 2005.
              Vi sørger for, at din bil altid er i top stand.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-surface-light text-text-muted hover:text-accent hover:bg-accent/10 transition-colors" aria-label="Facebook">
                <Share2 size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-surface-light text-text-muted hover:text-accent hover:bg-accent/10 transition-colors" aria-label="Instagram">
                <MessageSquare size={18} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-text mb-4 font-heading">Services</h3>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-text-muted hover:text-accent text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-border group-hover:bg-accent transition-colors" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-text mb-4 font-heading">Hurtige Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-text-muted hover:text-accent text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-border group-hover:bg-accent transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-text mb-4 font-heading">Kontakt & Åbningstider</h3>
            <div className="space-y-3">
              <a href={`tel:${g.phoneRaw}`} className="flex items-center gap-3 text-sm text-text-muted hover:text-accent transition-colors group">
                <div className="p-2 rounded-lg bg-surface-light group-hover:bg-accent/10 transition-colors">
                  <Phone size={14} className="text-accent" />
                </div>
                {g.phone}
              </a>
              <a href={`mailto:${g.email}`} className="flex items-center gap-3 text-sm text-text-muted hover:text-accent transition-colors group">
                <div className="p-2 rounded-lg bg-surface-light group-hover:bg-accent/10 transition-colors">
                  <Mail size={14} className="text-accent" />
                </div>
                {g.email}
              </a>
              <div className="flex items-start gap-3 text-sm text-text-muted">
                <div className="p-2 rounded-lg bg-surface-light mt-0.5">
                  <MapPin size={14} className="text-accent" />
                </div>
                {g.address}
              </div>
              <div className="flex items-start gap-3 text-sm text-text-muted">
                <div className="p-2 rounded-lg bg-surface-light mt-0.5">
                  <Clock size={14} className="text-accent" />
                </div>
                <div>
                  {g.openingHours.slice(0, 3).map((h) => (
                    <p key={h.day}>{h.day.slice(0, 3)}: {h.hours}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} Rønne Autoteknik. Alle rettigheder forbeholdes.
          </p>
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <Link href="/privatlivspolitik" className="hover:text-accent transition-colors">Privatlivspolitik</Link>
            <Link href="/cookiepolitik" className="hover:text-accent transition-colors">Cookiepolitik</Link>
            <Link href="/admin" className="px-3 py-1.5 rounded-lg border border-border hover:border-accent/50 hover:text-accent transition-colors text-xs">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
