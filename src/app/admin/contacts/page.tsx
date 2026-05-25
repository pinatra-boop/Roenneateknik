"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Search, Eye, Archive, Phone, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  licensePlate?: string;
  status: string;
  createdAt: string;
}

const STATUS_COLORS = {
  NEW: "text-blue-400 bg-blue-500/15",
  READ: "text-text-muted bg-surface",
  REPLIED: "text-green-400 bg-green-500/15",
  ARCHIVED: "text-text-muted/50 bg-surface",
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Contact | null>(null);

  useEffect(() => {
    fetch("/api/admin/contacts-list")
      .then((r) => r.json())
      .then(setContacts)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
      toast.success("Status opdateret");
    }
  };

  const filtered = contacts.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const newCount = contacts.filter((c) => c.status === "NEW").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading flex items-center gap-3">
          Kontakter
          {newCount > 0 && (
            <span className="text-sm px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-normal">
              {newCount} nye
            </span>
          )}
        </h1>
        <p className="text-text-muted text-sm">{contacts.length} beskeder</p>
      </div>

      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Søg navn eller email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-light border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none text-sm"
        />
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton rounded-2xl h-20" />
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
            <p>Ingen beskeder</p>
          </div>
        ) : (
          filtered.map((contact) => (
            <div
              key={contact.id}
              onClick={() => {
                setSelected(contact);
                if (contact.status === "NEW") updateStatus(contact.id, "READ");
              }}
              className={cn(
                "glass-light rounded-2xl border p-5 cursor-pointer hover:border-accent/30 transition-all",
                contact.status === "NEW" ? "border-blue-500/30" : "border-border"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium text-text">{contact.name}</p>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-lg",
                        STATUS_COLORS[contact.status as keyof typeof STATUS_COLORS]
                      )}
                    >
                      {contact.status === "NEW"
                        ? "Ny"
                        : contact.status === "READ"
                        ? "Læst"
                        : contact.status === "REPLIED"
                        ? "Besvaret"
                        : "Arkiveret"}
                    </span>
                  </div>
                  <p className="text-text-muted text-sm truncate">{contact.message}</p>
                </div>
                <p className="text-xs text-text-muted shrink-0">
                  {formatDate(new Date(contact.createdAt))}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg glass-light rounded-3xl border border-border p-6"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-bold font-heading text-lg">{selected.name}</h3>
                <p className="text-text-muted text-sm">
                  {formatDate(new Date(selected.createdAt))}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-text-muted hover:text-text p-1"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 mb-5 text-sm">
              <a
                href={`mailto:${selected.email}`}
                className="flex items-center gap-3 text-text-muted hover:text-accent transition-colors"
              >
                <Mail size={14} className="text-accent" />
                {selected.email}
              </a>
              <a
                href={`tel:${selected.phone}`}
                className="flex items-center gap-3 text-text-muted hover:text-accent transition-colors"
              >
                <Phone size={14} className="text-accent" />
                {selected.phone}
              </a>
              {selected.licensePlate && (
                <p className="text-text-muted">
                  <span className="text-text-muted">Nummerplade: </span>
                  <span className="font-mono text-text">{selected.licensePlate}</span>
                </p>
              )}
            </div>

            <div className="bg-surface rounded-xl p-4 mb-5 text-sm text-text leading-relaxed">
              {selected.message}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(selected.id, "REPLIED")}
                className="flex-1 py-2.5 rounded-xl bg-green-500/15 text-green-400 text-sm font-medium hover:bg-green-500/25 transition-colors"
              >
                Markér besvaret
              </button>
              <button
                onClick={() => {
                  updateStatus(selected.id, "ARCHIVED");
                  setSelected(null);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-text-muted bg-surface-light text-sm hover:text-text transition-colors"
              >
                <Archive size={14} />
                Arkivér
              </button>
              <a
                href={`mailto:${selected.email}?subject=Re: Din henvendelse til Rønne Autoteknik`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-medium"
              >
                <Mail size={14} />
                Svar
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
