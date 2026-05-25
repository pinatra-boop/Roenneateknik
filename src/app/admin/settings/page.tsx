"use client";

import { useState } from "react";
import { Settings, Save, User, Bell, Clock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const openingHoursDefault = [
  { day: "Mandag", open: "08:00", close: "17:00", closed: false },
  { day: "Tirsdag", open: "08:00", close: "17:00", closed: false },
  { day: "Onsdag", open: "08:00", close: "17:00", closed: false },
  { day: "Torsdag", open: "08:00", close: "17:00", closed: false },
  { day: "Fredag", open: "08:00", close: "17:00", closed: false },
  { day: "Lørdag", open: "08:00", close: "13:00", closed: false },
  { day: "Søndag", open: "08:00", close: "13:00", closed: true },
];

export default function AdminSettingsPage() {
  const [hours, setHours] = useState(openingHoursDefault);
  const [saving, setSaving] = useState(false);
  const [workshopEmail, setWorkshopEmail] = useState("info@ronneautoteknik.dk");
  const [phone, setPhone] = useState("+45 56 00 00 00");

  const saveSettings = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Indstillinger gemt");
    setSaving(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading">Indstillinger</h1>
        <p className="text-text-muted text-sm">
          Konfigurer værkstedets oplysninger og åbningstider
        </p>
      </div>

      <div className="space-y-6">
        {/* Contact info */}
        <div className="glass-light rounded-2xl border border-border p-6">
          <h2 className="font-semibold font-heading flex items-center gap-2 mb-5">
            <User size={18} className="text-accent" />
            Kontaktoplysninger
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-1.5">
                Værkstedets email
              </label>
              <input
                value={workshopEmail}
                onChange={(e) => setWorkshopEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1.5">
                Telefonnummer
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Opening hours */}
        <div className="glass-light rounded-2xl border border-border p-6">
          <h2 className="font-semibold font-heading flex items-center gap-2 mb-5">
            <Clock size={18} className="text-accent" />
            Åbningstider
          </h2>
          <div className="space-y-3">
            {hours.map((day, i) => (
              <div key={day.day} className="flex items-center gap-3 text-sm">
                <span className="w-20 text-text-muted">{day.day}</span>
                {day.closed ? (
                  <span className="text-red-400 text-sm">Lukket</span>
                ) : (
                  <>
                    <input
                      type="time"
                      value={day.open}
                      onChange={(e) => {
                        const updated = [...hours];
                        updated[i] = { ...day, open: e.target.value };
                        setHours(updated);
                      }}
                      className="px-3 py-2 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                    />
                    <span className="text-text-muted">–</span>
                    <input
                      type="time"
                      value={day.close}
                      onChange={(e) => {
                        const updated = [...hours];
                        updated[i] = { ...day, close: e.target.value };
                        setHours(updated);
                      }}
                      className="px-3 py-2 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
                    />
                  </>
                )}
                <label className="ml-auto flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => {
                      const updated = [...hours];
                      updated[i] = { ...day, closed: !day.closed };
                      setHours(updated);
                    }}
                    className={`w-8 h-4 rounded-full transition-colors relative ${
                      day.closed ? "bg-surface-light" : "bg-accent"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                        day.closed ? "translate-x-0.5" : "translate-x-4"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-text-muted">Lukket</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Email notifications */}
        <div className="glass-light rounded-2xl border border-border p-6">
          <h2 className="font-semibold font-heading flex items-center gap-2 mb-5">
            <Bell size={18} className="text-accent" />
            Email notifikationer
          </h2>
          <div className="space-y-3">
            {[
              "Ny booking modtaget",
              "Ny kontaktbesked",
              "Booking bekræftelse til kunde",
              "Daglig oversigt over bookinger",
            ].map((item) => (
              <label key={item} className="flex items-center justify-between">
                <span className="text-sm text-text-muted">{item}</span>
                <div className="w-10 h-5 rounded-full bg-accent relative">
                  <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white" />
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent hover:bg-accent-light text-white font-bold transition-all disabled:opacity-70"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Gem indstillinger
        </button>
      </div>
    </div>
  );
}
