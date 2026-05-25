"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    author: "Mette Hansen",
    rating: 5,
    text: "Fantastisk service! De fik skiftet bremser på min bil inden for 2 timer. Prisen var fair og personalet var utrolig venligt. Vil varmt anbefale Rønne Autoteknik.",
    date: "November 2024",
    source: "Google",
  },
  {
    author: "Lars Nielsen",
    rating: 5,
    text: "Bestilte tid online – nemt og hurtigt. Bilen var færdig til aftalt tid, og de fandt en fejl jeg ikke vidste om og rettede den samme dag. Super professionelt.",
    date: "Oktober 2024",
    source: "Trustpilot",
  },
  {
    author: "Sofie Andersen",
    rating: 5,
    text: "Har brugt Rønne Autoteknik i mange år. Altid imødekommende, altid præcise og altid til en rimelig pris. Det er mit faste værksted!",
    date: "September 2024",
    source: "Google",
  },
  {
    author: "Michael Christensen",
    rating: 4,
    text: "Meget tilfreds med dækskiftet. Hurtigt, professionelt og god rådgivning om hvilke dæk der passede til min bil. Kommer igen!",
    date: "August 2024",
    source: "Google",
  },
  {
    author: "Camilla Petersen",
    rating: 5,
    text: "Brugte bookingsystemet for første gang – vildt nemt! De hentede alle biloplysninger automatisk fra nummerpladen. Fremtiden er nu!",
    date: "Juli 2024",
    source: "Trustpilot",
  },
  {
    author: "Thomas Møller",
    rating: 5,
    text: "Syndsforberedelse gik som smurt. De tjekker alt grundigt og forklarer klart hvad der skal laves. Ingen skjulte overraskelser på fakturaen.",
    date: "Juni 2024",
    source: "Google",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-amber-400 text-amber-400" : "text-border"}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm font-medium mb-4">
            ★ 4.8 på Trustpilot & Google
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4">
            Hvad siger vores kunder?
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            Over 500 anmeldelser fra rigtige kunder der har valgt Rønne
            Autoteknik.
          </p>
        </motion.div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <motion.div
              key={review.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-light rounded-2xl p-6 border border-border hover:border-amber-500/20 transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Stars rating={review.rating} />
                  <p className="font-semibold text-text mt-2">{review.author}</p>
                  <p className="text-text-muted text-xs">{review.date}</p>
                </div>
                <div className="p-2 rounded-xl bg-amber-500/10">
                  <Quote size={16} className="text-amber-400" />
                </div>
              </div>
              <p className="text-text-muted text-sm leading-relaxed">
                {review.text}
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      review.source === "Google"
                        ? "bg-blue-400"
                        : "bg-green-400"
                    }`}
                  />
                  {review.source}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trustpilot CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <a
            href="https://trustpilot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-text-muted text-sm hover:text-text transition-colors"
          >
            Se alle anmeldelser på Trustpilot
            <span className="text-green-400">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
