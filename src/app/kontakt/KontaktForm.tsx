"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  Search,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GlobalContent } from "@/lib/content";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email("Ugyldig email"),
  phone: z.string().min(8),
  address: z.string().optional(),
  city: z.string().optional(),
  licensePlate: z.string().optional(),
  message: z.string().min(10, "Beskeden er for kort"),
});

type FormData = z.infer<typeof schema>;

export default function KontaktForm({ global: g }: { global: GlobalContent }) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [carInfo, setCarInfo] = useState<{ brand: string; model: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const lookupPlate = async () => {
    const plate = watch("licensePlate");
    if (!plate) return;
    setLookingUp(true);
    try {
      const res = await fetch(`/api/license-plate?plate=${encodeURIComponent(plate)}`);
      if (res.ok) {
        const data = await res.json();
        setCarInfo(data);
        toast.success("Biloplysninger fundet");
      }
    } finally {
      setLookingUp(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSuccess(true);
        toast.success("Besked sendt!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Fejl ved afsendelse");
      }
    } catch {
      toast.error("Netværksfejl");
    } finally {
      setSubmitting(false);
    }
  };

  const contactItems = [
    { icon: Phone, title: "Ring til os", content: g.phone, href: `tel:${g.phoneRaw}` },
    { icon: Mail, title: "Send email", content: g.email, href: `mailto:${g.email}` },
    { icon: MapPin, title: "Besøg os", content: g.address, href: "https://maps.google.com/?q=Rønne+Autoteknik" },
  ];

  return (
    <div className="grid lg:grid-cols-5 gap-10">
      {/* Left: info */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-2 space-y-6"
      >
        {contactItems.map(({ icon: Icon, title, content, href }) => (
          <a
            key={title}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center gap-4 glass-light rounded-2xl p-5 border border-border hover:border-accent/30 transition-all group"
          >
            <div className="p-3 rounded-xl bg-accent/15 text-accent group-hover:bg-accent/25 transition-colors">
              <Icon size={20} />
            </div>
            <div>
              <p className="text-text-muted text-sm">{title}</p>
              <p className="text-text font-semibold">{content}</p>
            </div>
          </a>
        ))}

        {/* Opening hours */}
        <div className="glass-light rounded-2xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-accent" />
            <h3 className="font-semibold font-heading">Åbningstider</h3>
          </div>
          {g.openingHours.map((item) => {
            const today = new Date().toLocaleDateString("da-DK", { weekday: "long" });
            const isToday = today.charAt(0).toUpperCase() + today.slice(1) === item.day;
            return (
              <div
                key={item.day}
                className={cn(
                  "flex justify-between py-2 text-sm border-b border-border last:border-0",
                  isToday ? "text-accent font-medium" : "text-text-muted"
                )}
              >
                <span>{item.day}</span>
                <span className={item.hours === "Lukket" ? "text-red-400" : ""}>
                  {item.hours}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Right: form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-3"
      >
        {success ? (
          <div className="glass-light rounded-3xl border border-border p-10 text-center">
            <div className="inline-flex p-4 rounded-full bg-green-500/20 mb-4">
              <CheckCircle size={40} className="text-green-400" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-2">Besked sendt!</h3>
            <p className="text-text-muted">Tak for din besked. Vi vender tilbage snarest muligt.</p>
          </div>
        ) : (
          <div className="glass-light rounded-3xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-bold font-heading mb-6">Send os en besked</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-muted mb-1.5">Navn *</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      {...register("name")}
                      placeholder="Anders Hansen"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none"
                    />
                  </div>
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-1.5">Telefon *</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="+45 56 00 00 00"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-1.5">Email *</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="din@email.dk"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-muted mb-1.5">Adresse</label>
                  <input
                    {...register("address")}
                    placeholder="Storegade 1"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-1.5">By</label>
                  <input
                    {...register("city")}
                    placeholder="Rønne"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-1.5">Nummerplade (valgfri)</label>
                <div className="flex gap-2">
                  <input
                    {...register("licensePlate")}
                    placeholder="AB 12 345"
                    className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none uppercase"
                  />
                  <button
                    type="button"
                    onClick={lookupPlate}
                    disabled={lookingUp}
                    className="px-4 rounded-xl bg-surface-light border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
                  >
                    {lookingUp ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  </button>
                </div>
                {carInfo && (
                  <p className="text-green-400 text-xs mt-1">{carInfo.brand} {carInfo.model}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-1.5">Besked *</label>
                <div className="relative">
                  <MessageSquare size={15} className="absolute left-3.5 top-3.5 text-text-muted" />
                  <textarea
                    {...register("message")}
                    rows={4}
                    placeholder="Beskriv dit spørgsmål eller problem..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none resize-none"
                  />
                </div>
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-accent hover:bg-accent-light text-white font-bold transition-all disabled:opacity-70 hover:shadow-lg hover:shadow-accent/25 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Sender...</>
                ) : (
                  <><Send size={18} /> Send besked</>
                )}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
