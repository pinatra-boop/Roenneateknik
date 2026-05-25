"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Car,
  CheckCircle,
  X,
  Loader2,
  Upload,
  ImageIcon,
} from "lucide-react";
import { formatPrice, formatMileage } from "@/lib/utils";
import toast from "react-hot-toast";

interface CarData {
  id?: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  color: string;
  description: string;
  equipment: string[];
  images: string[];
  featured: boolean;
  sold: boolean;
  active: boolean;
}

const EMPTY_CAR: CarData = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  fuel: "Benzin",
  transmission: "Manuel",
  color: "",
  description: "",
  equipment: [],
  images: [],
  featured: false,
  sold: false,
  active: true,
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CarData | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [equipmentInput, setEquipmentInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCars = async () => {
    const res = await fetch("/api/admin/cars-list");
    if (res.ok) setCars(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const uploadFiles = async (files: FileList | File[]) => {
    if (!editing) return;
    const fileArr = Array.from(files);
    if (!fileArr.length) return;

    setUploading(true);
    const form = new FormData();
    fileArr.forEach((f) => form.append("files", f));

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload fejlede");
      setEditing((prev) => prev ? { ...prev, images: [...prev.images, ...data.urls] } : prev);
      toast.success(`${data.urls.length} billede(r) uploadet`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload fejlede");
    } finally {
      setUploading(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const url = isNew ? "/api/admin/cars-list" : `/api/admin/cars/${editing.id}`;
      const method = isNew ? "POST" : "PATCH";
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...data } = editing;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success(isNew ? "Bil oprettet" : "Bil opdateret");
        setEditing(null);
        fetchCars();
      } else {
        toast.error("Fejl ved lagring");
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteCar = async (id: string) => {
    if (!confirm("Slet denne bil?")) return;
    const res = await fetch(`/api/admin/cars/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCars((prev) => prev.filter((c) => c.id !== id));
      toast.success("Bil slettet");
    }
  };

  const openEdit = (car: CarData) => {
    setEditing(car);
    setEquipmentInput("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading">Brugte Biler</h1>
          <p className="text-text-muted text-sm">{cars.length} biler</p>
        </div>
        <button
          onClick={() => openEdit({ ...EMPTY_CAR })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-light text-white font-medium text-sm transition-colors"
        >
          <Plus size={16} />
          Tilføj bil
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton rounded-2xl h-48" />
          ))}
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <Car size={48} className="mx-auto mb-4 opacity-30" />
          <p>Ingen biler endnu</p>
          <button
            onClick={() => openEdit({ ...EMPTY_CAR })}
            className="mt-4 px-4 py-2 rounded-xl bg-accent text-white text-sm"
          >
            Tilføj første bil
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div
              key={car.id}
              className="glass-light rounded-2xl border border-border p-5"
            >
              <div className="h-36 bg-surface rounded-xl mb-4 overflow-hidden">
                {car.images[0] ? (
                  <img
                    src={car.images[0]}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Car size={32} className="text-border" />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-text">
                    {car.brand} {car.model}
                  </p>
                  <p className="text-text-muted text-sm">{car.year}</p>
                </div>
                <p className="text-accent font-bold">{formatPrice(car.price)}</p>
              </div>
              <p className="text-text-muted text-xs mb-3">
                {formatMileage(car.mileage)} · {car.fuel} · {car.transmission}
              </p>
              <div className="flex items-center gap-2">
                {car.sold && (
                  <span className="text-xs px-2 py-0.5 rounded bg-red-500/15 text-red-400">
                    Solgt
                  </span>
                )}
                {car.featured && (
                  <span className="text-xs px-2 py-0.5 rounded bg-accent/15 text-accent">
                    Fremhævet
                  </span>
                )}
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => openEdit(car)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => deleteCar(car.id!)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create modal */}
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
                  {editing.id ? "Rediger bil" : "Tilføj ny bil"}
                </h3>
                <button
                  onClick={() => setEditing(null)}
                  className="text-text-muted hover:text-text"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Brand + Model */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Mærke *</label>
                    <input
                      value={editing.brand}
                      onChange={(e) => setEditing({ ...editing, brand: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Model *</label>
                    <input
                      value={editing.model}
                      onChange={(e) => setEditing({ ...editing, model: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Year / Price / Mileage */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Årgang</label>
                    <input
                      type="number"
                      value={editing.year}
                      onChange={(e) => setEditing({ ...editing, year: parseInt(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Pris (kr.)</label>
                    <input
                      type="number"
                      value={editing.price}
                      onChange={(e) => setEditing({ ...editing, price: parseInt(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Km-stand</label>
                    <input
                      type="number"
                      value={editing.mileage}
                      onChange={(e) => setEditing({ ...editing, mileage: parseInt(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Fuel + Transmission */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Brændstof</label>
                    <select
                      value={editing.fuel}
                      onChange={(e) => setEditing({ ...editing, fuel: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                    >
                      <option>Benzin</option>
                      <option>Diesel</option>
                      <option>El</option>
                      <option>Hybrid</option>
                      <option>Plug-in Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Gearkasse</label>
                    <select
                      value={editing.transmission}
                      onChange={(e) => setEditing({ ...editing, transmission: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                    >
                      <option>Manuel</option>
                      <option>Automatisk</option>
                    </select>
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-xs text-text-muted mb-1">Farve</label>
                  <input
                    value={editing.color}
                    onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                    placeholder="F.eks. Sort metallic"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs text-text-muted mb-1">Beskrivelse</label>
                  <textarea
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none resize-none"
                  />
                </div>

                {/* Equipment */}
                <div>
                  <label className="block text-xs text-text-muted mb-1">Udstyr</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={equipmentInput}
                      onChange={(e) => setEquipmentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && equipmentInput.trim()) {
                          e.preventDefault();
                          setEditing({
                            ...editing,
                            equipment: [...editing.equipment, equipmentInput.trim()],
                          });
                          setEquipmentInput("");
                        }
                      }}
                      placeholder="F.eks. Aircondition"
                      className="flex-1 px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (equipmentInput.trim()) {
                          setEditing({ ...editing, equipment: [...editing.equipment, equipmentInput.trim()] });
                          setEquipmentInput("");
                        }
                      }}
                      className="px-3 py-2.5 rounded-xl bg-accent hover:bg-accent-light text-white text-sm font-medium transition-colors"
                    >
                      Tilføj
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editing.equipment.map((eq, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-light text-text-muted text-xs"
                      >
                        {eq}
                        <button
                          onClick={() =>
                            setEditing({
                              ...editing,
                              equipment: editing.equipment.filter((_, idx) => idx !== i),
                            })
                          }
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image upload */}
                <div>
                  <label className="block text-xs text-text-muted mb-2">
                    Billeder ({editing.images.length})
                  </label>

                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-6 cursor-pointer transition-colors ${
                      dragOver
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50 hover:bg-surface"
                    }`}
                  >
                    {uploading ? (
                      <Loader2 size={24} className="text-accent animate-spin" />
                    ) : (
                      <Upload size={24} className="text-text-muted" />
                    )}
                    <p className="text-sm text-text-muted">
                      {uploading ? "Uploader…" : "Klik eller træk billeder hertil"}
                    </p>
                    <p className="text-xs text-text-muted/60">JPG, PNG, WebP · max 8 MB pr. billede</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="hidden"
                      onChange={(e) => e.target.files && uploadFiles(e.target.files)}
                    />
                  </div>

                  {/* Image previews */}
                  {editing.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {editing.images.map((img, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden aspect-video bg-surface">
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          {i === 0 && (
                            <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-accent text-white font-bold">
                              Forside
                            </span>
                          )}
                          <button
                            onClick={() =>
                              setEditing({
                                ...editing,
                                images: editing.images.filter((_, idx) => idx !== i),
                              })
                            }
                            className="absolute top-1 right-1 p-1 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {editing.images.length === 0 && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
                      <ImageIcon size={12} />
                      Ingen billeder endnu
                    </div>
                  )}
                </div>

                {/* Toggles */}
                <div className="flex gap-4">
                  {[
                    { key: "featured", label: "Fremhævet" },
                    { key: "sold", label: "Solgt" },
                    { key: "active", label: "Aktiv" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() =>
                          setEditing({
                            ...editing,
                            [key]: !editing[key as keyof CarData],
                          })
                        }
                        className={`w-10 h-5 rounded-full transition-colors ${
                          editing[key as keyof CarData] ? "bg-accent" : "bg-surface-light"
                        } relative`}
                      >
                        <div
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                            editing[key as keyof CarData] ? "translate-x-5" : "translate-x-0.5"
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
                    disabled={saving || !editing.brand || !editing.model}
                    className="flex-1 py-3 rounded-xl bg-accent text-white font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    Gem bil
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
