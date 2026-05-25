"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Droplets,
  Disc3,
  CircleCheck,
  Wind,
  Activity,
  Settings,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Droplets,
    title: "Olieskift",
    description: "Komplet olieskift med filterudskiftning. Alle bilmærker.",
    price: "fra 599 kr.",
    href: "/services/olieskift",
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-400",
  },
  {
    icon: Disc3,
    title: "Bremseskift",
    description: "Udskiftning af bremser – for- og bagaksel. Hurtig service.",
    price: "fra 899 kr.",
    href: "/services/bremseskift",
    color: "from-red-500/20 to-red-600/5",
    iconColor: "text-red-400",
  },
  {
    icon: CircleCheck,
    title: "Synsforberedelse",
    description: "Vi klargør din bil til syn og retter eventuelle fejl.",
    price: "fra 499 kr.",
    href: "/services/synsforberedelse",
    color: "from-green-500/20 to-green-600/5",
    iconColor: "text-green-400",
  },
  {
    icon: Settings,
    title: "Dækskift",
    description: "Dækmontage og balancering. Opbevaring tilbydes.",
    price: "fra 399 kr.",
    href: "/services/daekskift",
    color: "from-orange-500/20 to-orange-600/5",
    iconColor: "text-orange-400",
  },
  {
    icon: Wind,
    title: "Klimaservice",
    description: "Opfyldning og kontrol af klimaanlæg. Køreklart sommeren.",
    price: "fra 699 kr.",
    href: "/services/klimaservice",
    color: "from-cyan-500/20 to-cyan-600/5",
    iconColor: "text-cyan-400",
  },
  {
    icon: Activity,
    title: "Fejldiagnose",
    description: "Computerbaseret fejlsøgning med moderne diagnostikudstyr.",
    price: "fra 349 kr.",
    href: "/services/fejldiagnose",
    color: "from-purple-500/20 to-purple-600/5",
    iconColor: "text-purple-400",
  },
];

export default function ServicesOverview() {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Grid */}
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
                className="group block glass-light rounded-2xl p-6 hover:border-accent/30 border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.color} mb-4`}
                >
                  <service.icon size={22} className={service.iconColor} />
                </div>
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
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
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
