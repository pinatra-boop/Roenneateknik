"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone, Star, Shield, Wrench } from "lucide-react";
import { type HeroContent, CONTENT_DEFAULTS } from "@/lib/content";

export default function Hero({ content }: { content?: HeroContent }) {
  const c = content ?? CONTENT_DEFAULTS.hero;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-surface to-primary opacity-90" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(232,147,26,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,147,26,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary-light/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 border border-accent/30 text-accent text-sm font-medium mb-6"
            >
              <Shield size={14} />
              {c.badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading leading-tight mb-6"
            >
              {c.heading1}
              <br />
              <span className="gradient-text">{c.heading2}</span>
              <br />
              {c.heading3}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-text-muted text-lg leading-relaxed mb-8 max-w-lg"
            >
              {c.subtext}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/booking"
                className="group flex items-center justify-center gap-2 px-7 py-4 bg-accent hover:bg-accent-light rounded-2xl text-white font-bold text-base transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-1"
              >
                {c.ctaPrimary}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+4556000000"
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border border-border bg-surface-light/50 text-text hover:border-accent/50 hover:bg-surface-light font-semibold transition-all"
              >
                <Phone size={18} className="text-accent" />
                {c.ctaSecondary}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              {[
                { icon: Star, label: c.trustBadge1 },
                { icon: Wrench, label: c.trustBadge2 },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-text-muted">
                  <Icon size={14} className="text-accent" />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="glass-light rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-2xl" />
                <div className="relative h-64 bg-gradient-to-br from-primary to-surface-light rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
                  <div className="text-center">
                    <Wrench size={64} className="text-accent/40 mx-auto mb-3 animate-float" />
                    <p className="text-text-muted text-sm">Professionelt autoværksted</p>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/5 rounded-full" />
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-light/10 rounded-full" />
                </div>
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-6 glass rounded-2xl p-4 shadow-xl w-52"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-400 text-xs font-bold">✓</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text">Booking bekræftet</p>
                      <p className="text-xs text-text-muted">I dag kl. 10:00</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted">Olieskift + filter</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-12 border-t border-border"
        >
          {c.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-bold gradient-text font-heading">{stat.value}</p>
              <p className="text-text-muted text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#0a1929" />
        </svg>
      </div>
    </section>
  );
}
