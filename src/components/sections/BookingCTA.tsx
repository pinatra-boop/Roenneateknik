"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone, CalendarDays } from "lucide-react";
import { type BookingCTAContent, CONTENT_DEFAULTS } from "@/lib/content";

export default function BookingCTA({ content }: { content?: BookingCTAContent }) {
  const c = content ?? CONTENT_DEFAULTS.booking_cta;

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-accent/30" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(232,147,26,0.4) 1px, transparent 0)`,
              backgroundSize: "30px 30px",
            }}
          />
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary-light/30 rounded-full blur-2xl" />

          <div className="relative px-8 py-16 md:px-16 text-center">
            <div className="inline-flex p-4 rounded-2xl bg-accent/20 mb-6">
              <CalendarDays size={32} className="text-accent" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white mb-4">
              {c.heading}
            </h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              {c.subtext}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/booking"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light rounded-2xl text-white font-bold text-base transition-all hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-1"
              >
                {c.ctaPrimary}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+4556000000"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all"
              >
                <Phone size={18} />
                {c.ctaSecondary}
              </a>
            </div>
            <p className="text-white/50 text-sm mt-6">{c.hoursText}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
