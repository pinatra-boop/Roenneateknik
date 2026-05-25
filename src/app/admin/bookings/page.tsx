"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Edit,
  Eye,
  Calendar,
  BanIcon,
  Plus,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  licensePlate: string;
  carBrand?: string;
  carModel?: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  status: string;
  message?: string;
}

const STATUS_MAP = {
  PENDING: { label: "Afventer", color: "text-amber-400 bg-amber-500/15", icon: Clock },
  CONFIRMED: { label: "Bekræftet", color: "text-green-400 bg-green-500/15", icon: CheckCircle },
  CANCELLED: { label: "Annulleret", color: "text-red-400 bg-red-500/15", icon: XCircle },
  COMPLETED: { label: "Afsluttet", color: "text-blue-400 bg-blue-500/15", icon: CheckCircle },
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [blockDate, setBlockDate] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [showBlock, setShowBlock] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/bookings-list");
      if (res.ok) setBookings(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
      toast.success("Status opdateret");
      setSelected(null);
    } else {
      toast.error("Fejl ved opdatering");
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Slet denne booking?")) return;
    const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
      toast.success("Booking slettet");
      setSelected(null);
    }
  };

  const blockDateSubmit = async () => {
    const res = await fetch("/api/admin/blocked-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: blockDate, reason: blockReason, allDay: true }),
    });
    if (res.ok) {
      toast.success("Dato låst");
      setShowBlock(false);
      setBlockDate("");
      setBlockReason("");
    }
  };

  const filtered = bookings.filter((b) => {
    const matchSearch =
      !search ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.licensePlate.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading">Bookinger</h1>
          <p className="text-text-muted text-sm">{bookings.length} bookinger i alt</p>
        </div>
        <button
          onClick={() => setShowBlock(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-light border border-border text-text-muted hover:text-text hover:border-accent/30 transition-colors text-sm"
        >
          <BanIcon size={15} />
          Lås dato
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Søg kunde eller nummerplade..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-light border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-surface-light border border-border text-text text-sm focus:border-accent focus:outline-none"
        >
          <option value="">Alle statusser</option>
          <option value="PENDING">Afventer</option>
          <option value="CONFIRMED">Bekræftet</option>
          <option value="CANCELLED">Annulleret</option>
          <option value="COMPLETED">Afsluttet</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-light rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Kunde", "Bil", "Service", "Dato & Tid", "Status", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 text-xs text-text-muted font-medium uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-muted">
                    Indlæser...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-muted">
                    Ingen bookinger fundet
                  </td>
                </tr>
              ) : (
                filtered.map((booking) => {
                  const status = STATUS_MAP[booking.status as keyof typeof STATUS_MAP];
                  return (
                    <tr
                      key={booking.id}
                      className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-text text-sm">
                          {booking.customerName}
                        </p>
                        <p className="text-text-muted text-xs">{booking.email}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-muted">
                        <p className="font-mono text-text">{booking.licensePlate}</p>
                        {booking.carBrand && (
                          <p className="text-xs">
                            {booking.carBrand} {booking.carModel}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-text">
                        {booking.serviceType}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <p className="text-text">{formatDate(new Date(booking.date))}</p>
                        <p className="text-accent font-bold">kl. {booking.timeSlot}</p>
                      </td>
                      <td className="px-5 py-4">
                        {status && (
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium",
                              status.color
                            )}
                          >
                            <status.icon size={12} />
                            {status.label}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelected(booking)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                            title="Se detaljer"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => deleteBooking(booking.id)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Slet"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md glass-light rounded-3xl border border-border p-6"
          >
            <h3 className="font-bold font-heading text-lg mb-4">
              Booking – {selected.customerName}
            </h3>
            <div className="space-y-2 text-sm mb-6">
              {[
                { label: "Email", value: selected.email },
                { label: "Telefon", value: selected.phone },
                { label: "Nummerplade", value: selected.licensePlate },
                { label: "Service", value: selected.serviceType },
                { label: "Dato", value: formatDate(new Date(selected.date)) },
                { label: "Tid", value: `kl. ${selected.timeSlot}` },
                { label: "Besked", value: selected.message },
              ]
                .filter((i) => i.value)
                .map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <span className="text-text-muted w-28 shrink-0">{item.label}</span>
                    <span className="text-text">{item.value}</span>
                  </div>
                ))}
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-xs text-text-muted mb-2">Skift status:</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(STATUS_MAP).map(([key, { label, color }]) => (
                  <button
                    key={key}
                    onClick={() => updateStatus(selected.id, key)}
                    className={cn(
                      "py-2 px-3 rounded-xl text-sm font-medium border border-border transition-colors",
                      selected.status === key
                        ? color
                        : "text-text-muted hover:text-text hover:border-accent/30"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => deleteBooking(selected.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 text-sm transition-colors"
              >
                <Trash2 size={14} />
                Slet
              </button>
              <button
                onClick={() => setSelected(null)}
                className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-text-muted hover:text-text text-sm transition-colors"
              >
                Luk
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Block date modal */}
      {showBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm glass-light rounded-3xl border border-border p-6"
          >
            <h3 className="font-bold font-heading text-lg mb-4">Lås dato</h3>
            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Dato</label>
                <input
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1.5">
                  Årsag (valgfri)
                </label>
                <input
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Ferie, lukkeddag..."
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBlock(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-text-muted text-sm"
              >
                Annuller
              </button>
              <button
                onClick={blockDateSubmit}
                disabled={!blockDate}
                className="flex-1 py-2.5 rounded-xl bg-accent text-white font-bold text-sm disabled:opacity-50"
              >
                Lås dato
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
