"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function OilSVG() {
  return (
    <svg viewBox="0 0 240 130" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="130" fill="#0a1929" />
      {/* engine block */}
      <rect x="120" y="40" width="90" height="55" rx="6" fill="#0f2d5a" stroke="#1e4080" strokeWidth="1.5" />
      <rect x="133" y="50" width="18" height="18" rx="3" fill="#132a4e" stroke="#2a5298" strokeWidth="1" />
      <rect x="159" y="50" width="18" height="18" rx="3" fill="#132a4e" stroke="#2a5298" strokeWidth="1" />
      <rect x="133" y="68" width="44" height="8" rx="2" fill="#1a3a6e" />
      <rect x="133" y="78" width="28" height="6" rx="2" fill="#1a3a6e" />
      {/* oil can */}
      <rect x="30" y="28" width="36" height="48" rx="5" fill="#1a3a6e" stroke="#3b82f6" strokeWidth="1.5" />
      <rect x="38" y="20" width="20" height="12" rx="3" fill="#1e4a8a" stroke="#3b82f6" strokeWidth="1.5" />
      <path d="M66 55 L88 55" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M88 55 L88 75" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
      {/* oil drops */}
      <ellipse cx="88" cy="82" rx="4" ry="5" fill="#60a5fa" opacity="0.9" />
      <ellipse cx="96" cy="92" rx="3" ry="4" fill="#93c5fd" opacity="0.7" />
      <ellipse cx="104" cy="86" rx="2.5" ry="3.5" fill="#60a5fa" opacity="0.6" />
      {/* label */}
      <rect x="36" y="38" width="20" height="14" rx="2" fill="#3b82f6" opacity="0.3" />
      <line x1="39" y1="43" x2="53" y2="43" stroke="#93c5fd" strokeWidth="1.5" />
      <line x1="39" y1="47" x2="50" y2="47" stroke="#93c5fd" strokeWidth="1" />
      {/* shimmer */}
      <ellipse cx="48" cy="100" rx="30" ry="6" fill="#3b82f6" opacity="0.1" />
      <text x="120" y="118" textAnchor="middle" fill="#60a5fa" fontSize="9" fontFamily="Arial" opacity="0.6">OLIESKIFT</text>
    </svg>
  );
}

function BrakeSVG() {
  return (
    <svg viewBox="0 0 240 130" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="130" fill="#0a1929" />
      {/* brake disc */}
      <circle cx="110" cy="63" r="46" fill="#1a1a2e" stroke="#ef4444" strokeWidth="2" />
      <circle cx="110" cy="63" r="36" fill="#0f1a2e" stroke="#dc2626" strokeWidth="1" />
      <circle cx="110" cy="63" r="12" fill="#1e2a3e" stroke="#ef4444" strokeWidth="1.5" />
      {/* disc holes */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 110 + 26 * Math.cos(rad);
        const y = 63 + 26 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="4" fill="#0a1929" stroke="#dc2626" strokeWidth="0.5" />;
      })}
      {/* ventilation slots */}
      {[30, 90, 150, 210, 270, 330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 110 + 16 * Math.cos(rad);
        const y1 = 63 + 16 * Math.sin(rad);
        const x2 = 110 + 22 * Math.cos(rad);
        const y2 = 63 + 22 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#991b1b" strokeWidth="2" />;
      })}
      {/* brake caliper */}
      <rect x="148" y="38" width="52" height="50" rx="8" fill="#1e2a3e" stroke="#ef4444" strokeWidth="1.5" />
      <rect x="155" y="48" width="12" height="30" rx="3" fill="#ef4444" opacity="0.7" />
      <rect x="180" y="48" width="12" height="30" rx="3" fill="#ef4444" opacity="0.7" />
      <circle cx="167" cy="63" r="5" fill="#dc2626" />
      <circle cx="183" cy="63" r="5" fill="#dc2626" />
      {/* heat lines */}
      <path d="M70 30 Q65 22 70 14" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M80 28 Q75 20 80 12" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
      <text x="120" y="118" textAnchor="middle" fill="#f87171" fontSize="9" fontFamily="Arial" opacity="0.6">BREMSESKIFT</text>
    </svg>
  );
}

function InspectionSVG() {
  return (
    <svg viewBox="0 0 240 130" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="130" fill="#0a1929" />
      {/* car body */}
      <path d="M30 75 L50 75 L65 52 L155 52 L170 75 L200 75 L200 92 L30 92 Z" fill="#0f2d5a" stroke="#22c55e" strokeWidth="1.5" />
      <path d="M68 52 L80 38 L140 38 L152 52" fill="#0a1f3d" stroke="#22c55e" strokeWidth="1" />
      {/* windows */}
      <path d="M71 52 L82 40 L110 40 L110 52 Z" fill="#1a3a6e" stroke="#16a34a" strokeWidth="0.8" />
      <path d="M113 52 L113 40 L138 40 L148 52 Z" fill="#1a3a6e" stroke="#16a34a" strokeWidth="0.8" />
      {/* wheels */}
      <circle cx="68" cy="90" r="14" fill="#0f1a2e" stroke="#22c55e" strokeWidth="2" />
      <circle cx="68" cy="90" r="7" fill="#1a2a3e" stroke="#16a34a" strokeWidth="1" />
      <circle cx="162" cy="90" r="14" fill="#0f1a2e" stroke="#22c55e" strokeWidth="2" />
      <circle cx="162" cy="90" r="7" fill="#1a2a3e" stroke="#16a34a" strokeWidth="1" />
      {/* checkmark circle */}
      <circle cx="195" cy="32" r="22" fill="#052e16" stroke="#22c55e" strokeWidth="2" />
      <polyline points="184,32 192,40 208,24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* scan lines */}
      <line x1="30" y1="110" x2="200" y2="110" stroke="#22c55e" strokeWidth="0.5" opacity="0.3" strokeDasharray="4 3" />
      <text x="120" y="123" textAnchor="middle" fill="#4ade80" fontSize="9" fontFamily="Arial" opacity="0.6">SYNSFORBEREDELSE</text>
    </svg>
  );
}

function TireSVG() {
  return (
    <svg viewBox="0 0 240 130" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="130" fill="#0a1929" />
      {/* main tire */}
      <circle cx="100" cy="65" r="52" fill="#0d1b2a" stroke="#f97316" strokeWidth="2.5" />
      <circle cx="100" cy="65" r="38" fill="#0a1929" stroke="#ea580c" strokeWidth="1.5" />
      <circle cx="100" cy="65" r="16" fill="#1a2a3e" stroke="#f97316" strokeWidth="2" />
      {/* tread blocks */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 100 + 44 * Math.cos(rad) - 6;
        const y = 65 + 44 * Math.sin(rad) - 4;
        return (
          <rect key={i} x={x} y={y} width="12" height="8" rx="2"
            fill="#f97316" opacity="0.5"
            transform={`rotate(${angle}, ${x + 6}, ${y + 4})`} />
        );
      })}
      {/* rim spokes */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x2 = 100 + 14 * Math.cos(rad);
        const y2 = 65 + 14 * Math.sin(rad);
        const x3 = 100 + 36 * Math.cos(rad);
        const y3 = 65 + 36 * Math.sin(rad);
        return <line key={i} x1={x2} y1={y2} x2={x3} y2={y3} stroke="#f97316" strokeWidth="2.5" />;
      })}
      <circle cx="100" cy="65" r="6" fill="#f97316" />
      {/* wrench */}
      <path d="M170 30 Q185 20 195 30 L192 35 Q186 28 178 33 L182 50 L175 53 Z" fill="#fb923c" opacity="0.8" />
      <rect x="172" y="48" width="8" height="40" rx="3" fill="#fb923c" opacity="0.8" transform="rotate(-15, 176, 68)" />
      <text x="120" y="123" textAnchor="middle" fill="#fb923c" fontSize="9" fontFamily="Arial" opacity="0.6">DÆKSKIFT</text>
    </svg>
  );
}

function ACSvg() {
  return (
    <svg viewBox="0 0 240 130" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="130" fill="#0a1929" />
      {/* AC unit */}
      <rect x="20" y="30" width="90" height="60" rx="8" fill="#0f2d5a" stroke="#06b6d4" strokeWidth="1.5" />
      <rect x="28" y="42" width="74" height="36" rx="4" fill="#0a1f3d" stroke="#0891b2" strokeWidth="1" />
      {/* vents */}
      {[48, 56, 64, 72].map((y, i) => (
        <line key={i} x1="32" y1={y} x2="98" y2={y} stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
      ))}
      <rect x="28" y="38" width="74" height="6" rx="2" fill="#164e63" />
      <circle cx="96" cy="76" r="5" fill="#0e7490" stroke="#06b6d4" strokeWidth="1" />
      {/* air flow waves */}
      <path d="M115 48 Q125 44 135 48 Q145 52 155 48 Q165 44 175 48" stroke="#67e8f9" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M115 58 Q125 54 135 58 Q145 62 155 58 Q165 54 175 58" stroke="#67e8f9" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M115 68 Q125 64 135 68 Q145 72 155 68 Q165 64 175 68" stroke="#67e8f9" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* snowflake */}
      <g transform="translate(196, 55)">
        <line x1="0" y1="-18" x2="0" y2="18" stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round" />
        <line x1="-18" y1="0" x2="18" y2="0" stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round" />
        <line x1="-13" y1="-13" x2="13" y2="13" stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round" />
        <line x1="13" y1="-13" x2="-13" y2="13" stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round" />
        {[-18, 18, 0, 0, -13, 13, -13, 13].map((x, i) => {
          const y = [0, 0, -18, 18, -13, 13, 13, -13][i];
          return <circle key={i} cx={x} cy={y} r="3" fill="#22d3ee" />;
        })}
      </g>
      {/* temperature */}
      <text x="120" y="118" textAnchor="middle" fill="#22d3ee" fontSize="9" fontFamily="Arial" opacity="0.6">KLIMASERVICE</text>
    </svg>
  );
}

function DiagSVG() {
  return (
    <svg viewBox="0 0 240 130" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="130" fill="#0a1929" />
      {/* diagnostic device */}
      <rect x="20" y="20" width="70" height="90" rx="8" fill="#1a1a3e" stroke="#a855f7" strokeWidth="1.5" />
      <rect x="28" y="30" width="54" height="38" rx="4" fill="#0d0d1f" stroke="#7c3aed" strokeWidth="1" />
      {/* screen content - graph */}
      <polyline points="32,58 40,50 48,55 56,44 64,48 72,38 78,42" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="28" y="72" width="54" height="6" rx="2" fill="#2e1065" />
      <rect x="28" y="82" width="40" height="6" rx="2" fill="#2e1065" />
      <rect x="28" y="92" width="30" height="6" rx="2" fill="#2e1065" />
      {/* OBD connector */}
      <rect x="30" y="100" width="50" height="6" rx="2" fill="#6d28d9" />
      {/* cable */}
      <path d="M55 106 Q55 118 90 118 Q125 118 125 106" stroke="#7c3aed" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* car ECU chip */}
      <rect x="115" y="70" width="70" height="50" rx="6" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.5" />
      <rect x="124" y="79" width="52" height="32" rx="3" fill="#0d0d1f" />
      {/* chip pins */}
      {[76, 84, 92, 100, 108].map((y, i) => (
        <g key={i}>
          <rect x="112" y={y} width="6" height="3" rx="1" fill="#7c3aed" />
          <rect x="182" y={y} width="6" height="3" rx="1" fill="#7c3aed" />
        </g>
      ))}
      {/* error codes on chip */}
      <text x="150" y="92" textAnchor="middle" fill="#c084fc" fontSize="7" fontFamily="monospace">P0300</text>
      <text x="150" y="102" textAnchor="middle" fill="#a855f7" fontSize="7" fontFamily="monospace">P0420</text>
      <text x="150" y="112" textAnchor="middle" fill="#7c3aed" fontSize="7" fontFamily="monospace">B1234</text>
      {/* glow */}
      <ellipse cx="150" cy="120" rx="40" ry="5" fill="#7c3aed" opacity="0.15" />
      <text x="120" y="128" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="Arial" opacity="0.6">FEJLDIAGNOSE</text>
    </svg>
  );
}

const services = [
  {
    Illustration: OilSVG,
    title: "Olieskift",
    description: "Komplet olieskift med filterudskiftning. Alle bilmærker.",
    price: "fra 599 kr.",
    href: "/services/olieskift",
    border: "hover:border-blue-500/40",
    glow: "hover:shadow-blue-500/10",
  },
  {
    Illustration: BrakeSVG,
    title: "Bremseskift",
    description: "Udskiftning af bremser – for- og bagaksel. Hurtig service.",
    price: "fra 899 kr.",
    href: "/services/bremseskift",
    border: "hover:border-red-500/40",
    glow: "hover:shadow-red-500/10",
  },
  {
    Illustration: InspectionSVG,
    title: "Synsforberedelse",
    description: "Vi klargør din bil til syn og retter eventuelle fejl.",
    price: "fra 499 kr.",
    href: "/services/synsforberedelse",
    border: "hover:border-green-500/40",
    glow: "hover:shadow-green-500/10",
  },
  {
    Illustration: TireSVG,
    title: "Dækskift",
    description: "Dækmontage og balancering. Opbevaring tilbydes.",
    price: "fra 399 kr.",
    href: "/services/daekskift",
    border: "hover:border-orange-500/40",
    glow: "hover:shadow-orange-500/10",
  },
  {
    Illustration: ACSvg,
    title: "Klimaservice",
    description: "Opfyldning og kontrol af klimaanlæg. Køreklart sommeren.",
    price: "fra 699 kr.",
    href: "/services/klimaservice",
    border: "hover:border-cyan-500/40",
    glow: "hover:shadow-cyan-500/10",
  },
  {
    Illustration: DiagSVG,
    title: "Fejldiagnose",
    description: "Computerbaseret fejlsøgning med moderne diagnostikudstyr.",
    price: "fra 349 kr.",
    href: "/services/fejldiagnose",
    border: "hover:border-purple-500/40",
    glow: "hover:shadow-purple-500/10",
  },
];

export default function ServicesOverview() {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-sm font-medium mb-4">
            Vores ydelser
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4">
            Alt hvad din bil behøver
          </h2>
          <p className="text-text-muted max-w-xl mx-auto leading-relaxed">
            Fra rutineservice til komplekse reparationer – vi håndterer det
            hele med faglig stolthed og moderne udstyr.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={service.href}
                className={`group block glass-light rounded-2xl border border-border ${service.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${service.glow} overflow-hidden`}
              >
                <div className="h-36 w-full overflow-hidden">
                  <service.Illustration />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-text text-lg mb-2 font-heading">
                    {service.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-accent font-semibold text-sm">
                      {service.price}
                    </span>
                    <span className="flex items-center gap-1 text-text-muted text-sm group-hover:text-accent transition-colors">
                      Se mere
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-border bg-surface-light hover:border-accent/50 text-text font-medium transition-all hover:-translate-y-0.5"
          >
            Se alle services
            <ArrowRight size={16} className="text-accent" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
