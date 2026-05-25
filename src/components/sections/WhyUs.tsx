"use client";

import { motion } from "framer-motion";
import { Award, Clock, Wrench, HeartHandshake, Shield, Zap } from "lucide-react";
import { type WhyUsContent, CONTENT_DEFAULTS } from "@/lib/content";

const ICONS = [Award, Clock, Wrench, HeartHandshake, Shield, Zap];

export default function WhyUs({ content }: { content?: WhyUsContent }) {
  const c = content ?? CONTENT_DEFAULTS.why_us;

  return (
    <section className="section-padding bg-gradient-to-b from-surface to-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-sm font-medium mb-4">
              {c.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-5">
              {c.heading}
              <br />
              <span className="gradient-text">{c.headingGradient}</span>
            </h2>
            <p className="text-text-muted leading-relaxed mb-8">{c.subtext}</p>

            {c.progressBars.map((item, i) => (
              <div key={item.label} className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-muted">{item.label}</span>
                  <span className="text-accent font-medium">{item.value}%</span>
                </div>
                <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full"
                  />
                </div>
              </div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {c.reasons.map((reason, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="glass-light rounded-2xl p-5 border border-border hover:border-accent/30 transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-accent/15 text-accent w-fit mb-3">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-semibold text-text mb-2 font-heading">{reason.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{reason.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
