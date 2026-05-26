"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Wrench, CheckCircle, X, Loader2, GripVertical } from "lucide-react";
import toast from "react-hot-toast";

interface ServiceData {
  id?: string;
  name: string;
  description: string;
  longDesc: string;
  price: string;
  duration: string;
  icon: string;
  featured: boolean;
  order: number;
  active: boolean;
}

const EMPTY: ServiceData = {
  name: "",
  description: "",
  longDesc: "",
  price: "",
  duration: "",
  icon: "",
  featured: false,
  order: 0,
  active: true,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceData | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    const res = await fetch("/api/admin/services");
    if (res.ok) setServices(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const url = isNew ? "/api/admin/services" : `/api/admin/services/${editing.id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fejl ved lagring");
      toast.success(isNew ? "Service oprettet" : "Service opdateret");
      setEditing(null);
      fetchServices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl ved lagring");
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Slet denne service? Eksisterende bookings beholder servicenavnet.")) return;
    const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success("Service slettet");
    } else {
      toast.error("Kunne ikke slette — service har tilknyttede bookings");
    }
  };

  const field = (key: keyof ServiceData, value: string | boolean | number) =>
    setEditing((prev) => prev ? { ...prev, [key]: value } : prev);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading">Services</h1>
          <p className="text-text-muted text-sm">{services.length} serviceydelser</p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-light text-white font-medium text-sm transition-colors"
        >
          <Plus size={16} />
          Tilføj service
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton rounded-2xl h-20" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <Wrench size={48} className="mx-auto mb-4 opacity-30" />
          <p>Ingen services endnu</p>
          <button
            onClick={() => setEditing({ ...EMPTY })}
            className="mt-4 px-4 py-2 rounded-xl bg-accent text-white text-sm"
          >
            Tilføj første service
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="glass-light rounded-2xl border border-border p-5 flex items-center gap-4"
            >
              <GripVertical size={16} className="text-border shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-text truncate">{svc.name}</p>
                  {svc.featured && (
                    <span className="text-xs px-2 py-0.5 rounded bg-accent/15 text-accent shrink-0">
                      Fremhævet
                    </span>
                  )}
                  {!svc.active && (
                    <span className="text-xs px-2 py-0.5 rounded bg-surface-light text-text-muted shrink-0">
                      Inaktiv
                    </span>
                  )}
                </div>
                <p className="text-text-muted text-sm truncate">{svc.description}</p>
                <div className="flex gap-4 mt-1">
                  {svc.price && (
                    <span className="text-xs text-accent font-medium">{svc.price}</span>
                  )}
                  {svc.duration && (
                    <span className="text-xs text-text-muted">{svc.duration}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setEditing(svc)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => deleteService(svc.id!)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/60 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-xl glass-light rounded-3xl border border-border p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold font-heading text-lg">
                  {editing.id ? "Rediger service" : "Tilføj ny service"}
                </h3>
                <button onClick={() => setEditing(null)} className="text-text-muted hover:text-text">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-text-muted mb-1">Navn *</label>
                  <input
                    value={editing.name}
                    onChange={(e) => field("name", e.target.value)}
                    placeholder="F.eks. Olieskift"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-text-muted mb-1">Kort beskrivelse *</label>
                  <input
                    value={editing.description}
                    onChange={(e) => field("description", e.target.value)}
                    placeholder="Vises på servicekort og i booking"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-text-muted mb-1">Lang beskrivelse</label>
                  <textarea
                    value={editing.longDesc}
                    onChange={(e) => field("longDesc", e.target.value)}
                    rows={4}
                    placeholder="Uddybende beskrivelse på servicens detaljeside"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Pris</label>
                    <input
                      value={editing.price}
                      onChange={(e) => field("price", e.target.value)}
                      placeholder="F.eks. Fra 499 kr."
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Varighed</label>
                    <input
                      value={editing.duration}
                      onChange={(e) => field("duration", e.target.value)}
                      placeholder="F.eks. 1-2 timer"
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Ikon (Lucide-navn)</label>
                    <input
                      value={editing.icon}
                      onChange={(e) => field("icon", e.target.value)}
                      placeholder="F.eks. wrench, car, zap"
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Rækkefølge</label>
                    <input
                      type="number"
                      value={editing.order}
                      onChange={(e) => field("order", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-6 pt-1">
                  {[
                    { key: "featured", label: "Fremhævet" },
                    { key: "active", label: "Aktiv" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() => field(key as keyof ServiceData, !editing[key as keyof ServiceData])}
                        className={`w-10 h-5 rounded-full transition-colors ${
                          editing[key as keyof ServiceData] ? "bg-accent" : "bg-surface-light"
                        } relative`}
                      >
                        <div
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                            editing[key as keyof ServiceData] ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </div>
                      <span className="text-sm text-text-muted">{label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setEditing(null)}
                    className="flex-1 py-3 rounded-xl bg-surface border border-border text-text-muted text-sm"
                  >
                    Annuller
                  </button>
                  <button
                    onClick={save}
                    disabled={saving || !editing.name.trim() || !editing.description.trim()}
                    className="flex-1 py-3 rounded-xl bg-accent text-white font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    Gem service
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
