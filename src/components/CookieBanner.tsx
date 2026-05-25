"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setTimeout(() => setVisible(true), 1500);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50"
        >
          <div className="glass rounded-2xl p-5 shadow-2xl border border-border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-accent/20 text-accent shrink-0">
                <Cookie size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-text mb-1">
                  Vi bruger cookies
                </p>
                <p className="text-sm text-text-muted leading-relaxed">
                  Vi bruger cookies til at forbedre din oplevelse og analysere
                  trafik. Læs vores{" "}
                  <a
                    href="/privatlivspolitik"
                    className="text-accent hover:underline"
                  >
                    privatlivspolitik
                  </a>
                  .
                </p>
              </div>
              <button
                onClick={decline}
                className="text-text-muted hover:text-text shrink-0"
                aria-label="Luk"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={accept}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm",
                  "bg-accent text-white hover:bg-accent-light transition-colors"
                )}
              >
                Accepter alle
              </button>
              <button
                onClick={decline}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-xl font-medium text-sm",
                  "bg-surface-light text-text-muted hover:text-text border border-border transition-colors"
                )}
              >
                Kun nødvendige
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
