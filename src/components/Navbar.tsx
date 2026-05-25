"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Forside" },
  { href: "/om-os", label: "Om Os" },
  {
    label: "Services",
    href: "/services",
    children: [
      { href: "/services/olieskift", label: "Olieskift" },
      { href: "/services/bremseskift", label: "Bremseskift" },
      { href: "/services/synsforberedelse", label: "Synsforberedelse" },
      { href: "/services/daekskift", label: "Dækskift" },
      { href: "/services/klimaservice", label: "Klimaservice" },
      { href: "/services/fejldiagnose", label: "Fejldiagnose" },
    ],
  },
  { href: "/brugte-biler", label: "Brugte Biler" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Navbar({
  phone = "56 00 00 00",
  phoneRaw = "+4556000000",
  tagline = "Professionelt Autoværksted",
}: {
  phone?: string;
  phoneRaw?: string;
  tagline?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glass shadow-lg shadow-black/20 py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/30 group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <p className="font-bold text-text leading-tight text-sm sm:text-base font-heading">
                  Rønne Autoteknik
                </p>
                <p className="text-accent text-xs hidden sm:block">{tagline}</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                        pathname.startsWith("/services")
                          ? "text-accent bg-accent/10"
                          : "text-text-muted hover:text-text hover:bg-surface-light"
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform",
                          dropdownOpen && "rotate-180"
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-52 glass rounded-2xl p-2 shadow-xl shadow-black/20"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "block px-4 py-2.5 rounded-xl text-sm transition-colors",
                                pathname === child.href
                                  ? "text-accent bg-accent/10"
                                  : "text-text-muted hover:text-text hover:bg-surface-light"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                          <Link
                            href="/services"
                            className="block px-4 py-2.5 rounded-xl text-sm text-accent font-medium border-t border-border mt-1 pt-2"
                          >
                            Alle services →
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                      pathname === link.href
                        ? "text-accent bg-accent/10"
                        : "text-text-muted hover:text-text hover:bg-surface-light"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={`tel:${phoneRaw}`}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
              >
                <Phone size={15} />
                <span>{phone}</span>
              </a>
              <Link
                href="/booking"
                className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-light text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5"
              >
                Book tid
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-light transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-72 glass-light overflow-y-auto">
              <div className="pt-20 pb-6 px-4">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      <Link
                        href={link.href}
                        className={cn(
                          "block px-4 py-3 rounded-xl text-base font-medium transition-colors",
                          pathname === link.href
                            ? "text-accent bg-accent/10"
                            : "text-text-muted hover:text-text hover:bg-surface-light"
                        )}
                      >
                        {link.label}
                      </Link>
                      {link.children && (
                        <div className="ml-4 mt-1 space-y-1">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 rounded-xl text-sm text-text-muted hover:text-text transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-3 border-t border-border pt-6">
                  <a
                    href={`tel:${phoneRaw}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-light text-text"
                  >
                    <Phone size={18} className="text-accent" />
                    <span>{phone}</span>
                  </a>
                  <Link
                    href="/booking"
                    className="block text-center py-3 px-4 rounded-xl bg-accent text-white font-semibold hover:bg-accent-light transition-colors"
                  >
                    Book tid online
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
