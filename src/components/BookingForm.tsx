"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Car,
  MessageSquare,
  CheckCircle,
  Loader2,
  Search,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, isSunday, isSaturday, startOfDay } from "date-fns";
import { da } from "date-fns/locale";

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "13:00", "13:30", "14:00",
  "14:30", "15:00", "15:30", "16:00", "16:30",
];

const SATURDAY_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
];

const SERVICES = [
  "Olieskift",
  "Bremseskift",
  "Synsforberedelse",
  "Dækskift",
  "Klimaservice",
  "Fejldiagnose",
  "Stor service",
  "Lille service",
  "Andet",
];

const schema = z.object({
  customerName: z.string().min(2, "Navn er for kort"),
  email: z.string().email("Ugyldig email"),
  phone: z.string().min(8, "Ugyldigt telefonnummer"),
  licensePlate: z.string().min(2, "Ugyldig nummerplade"),
  serviceType: z.string().min(1, "Vælg en service"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CarInfo {
  brand: string;
  model: string;
  year: number;
  fuel: string;
  variant?: string;
  engine?: string;
  vin?: string;
}

interface SlotAvailability {
  bookedSlots: string[];
  blockedSlots: string[];
}

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [carInfo, setCarInfo] = useState<CarInfo | null>(null);
  const [manualCarEntry, setManualCarEntry] = useState(false);
  const [manualBrand, setManualBrand] = useState("");
  const [manualModel, setManualModel] = useState("");
  const [manualYear, setManualYear] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const [availability, setAvailability] = useState<SlotAvailability>({
    bookedSlots: [],
    blockedSlots: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (step > 1 && formRef.current) {
      const top = formRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  }, [step]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const licensePlate = watch("licensePlate");

  const lookupPlate = useCallback(async () => {
    if (!licensePlate || licensePlate.length < 2) return;
    setLookingUp(true);
    setManualCarEntry(false);
    try {
      const res = await fetch(
        `/api/license-plate?plate=${encodeURIComponent(licensePlate)}`
      );
      if (res.ok) {
        const data = await res.json();
        setCarInfo(data);
        setManualCarEntry(false);
        toast.success("Biloplysninger hentet!");
      } else {
        setCarInfo(null);
        setManualCarEntry(true);
        toast("Ingen oplysninger fundet – udfyld manuelt", { icon: "✏️" });
      }
    } catch {
      setCarInfo(null);
      setManualCarEntry(true);
      toast("Udfyld biloplysninger manuelt", { icon: "✏️" });
    } finally {
      setLookingUp(false);
    }
  }, [licensePlate]);

  const loadAvailability = useCallback(async (date: Date) => {
    try {
      const res = await fetch(
        `/api/booking?date=${date.toISOString().split("T")[0]}`
      );
      if (res.ok) {
        const data = await res.json();
        setAvailability(data);
      }
    } catch {
      // Silent fail
    }
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime("");
    loadAvailability(date);
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedDate || !selectedTime) {
      toast.error("Vælg dato og tidspunkt");
      return;
    }

    setSubmitting(true);
    try {
      const effectiveCarInfo = carInfo ?? (manualBrand ? {
        brand: manualBrand,
        model: manualModel,
        year: manualYear ? parseInt(manualYear) : undefined,
        fuel: "",
      } : null);

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          carBrand: effectiveCarInfo?.brand,
          carModel: effectiveCarInfo?.model,
          carYear: effectiveCarInfo?.year,
          carFuel: effectiveCarInfo?.fuel,
          carVariant: effectiveCarInfo?.variant,
          carEngine: effectiveCarInfo?.engine,
          carVin: effectiveCarInfo?.vin,
          date: selectedDate.toISOString(),
          timeSlot: selectedTime,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Fejl ved booking");
        return;
      }

      setSuccess(true);
    } catch {
      toast.error("Netværksfejl, prøv igen");
    } finally {
      setSubmitting(false);
    }
  };

  // Calendar generation
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0
  };

  const isDateAvailable = (date: Date) => {
    if (isSunday(date)) return false;
    if (date < startOfDay(new Date())) return false;
    return true;
  };

  const currentYear = currentMonth.getFullYear();
  const currentMonthIdx = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonthIdx);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonthIdx);

  const availableSlots = selectedDate
    ? isSaturday(selectedDate)
      ? SATURDAY_SLOTS
      : TIME_SLOTS
    : [];

  const isSlotUnavailable = (slot: string) => {
    return (
      availability.bookedSlots.includes(slot) ||
      availability.blockedSlots.includes("ALL") ||
      availability.blockedSlots.includes(slot)
    );
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-8"
      >
        <div className="inline-flex p-5 rounded-full bg-green-500/20 mb-6">
          <CheckCircle size={48} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-bold font-heading mb-3">
          Booking modtaget!
        </h2>
        <p className="text-text-muted mb-2">
          Tak for din booking. Vi bekræfter den snarest muligt.
        </p>
        <p className="text-text-muted text-sm">
          Du modtager en bekræftelse på din email.
        </p>
        {selectedDate && (
          <div className="mt-6 glass-light rounded-2xl p-5 inline-block">
            <p className="text-text font-semibold">
              {format(selectedDate, "EEEE d. MMMM yyyy", { locale: da })}
            </p>
            <p className="text-accent font-bold text-xl mt-1">kl. {selectedTime}</p>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Step indicator */}
      <div className="flex items-center gap-2 justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => step > s && setStep(s)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                step === s
                  ? "bg-accent text-white shadow-lg shadow-accent/30"
                  : step > s
                  ? "bg-green-500 text-white cursor-pointer"
                  : "bg-surface-light text-text-muted"
              )}
            >
              {step > s ? "✓" : s}
            </button>
            {s < 3 && (
              <div
                className={cn(
                  "w-12 h-0.5 rounded-full transition-colors",
                  step > s ? "bg-green-500" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Choose service & date */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold font-heading mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-accent" />
                Vælg service og dato
              </h3>

              {/* Service selector */}
              <div className="mb-6">
                <label className="block text-sm text-text-muted mb-2">
                  Service *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SERVICES.map((service) => (
                    <label key={service} className="cursor-pointer">
                      <input
                        type="radio"
                        value={service}
                        {...register("serviceType")}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "px-3 py-2.5 rounded-xl border text-sm text-center transition-all",
                          watch("serviceType") === service
                            ? "border-accent bg-accent/15 text-accent font-medium"
                            : "border-border bg-surface-light text-text-muted hover:border-accent/30"
                        )}
                      >
                        {service}
                      </div>
                    </label>
                  ))}
                </div>
                {errors.serviceType && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.serviceType.message}
                  </p>
                )}
              </div>

              {/* Calendar */}
              <div className="glass-light rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(currentYear, currentMonthIdx - 1)
                      )
                    }
                    className="p-2 rounded-xl hover:bg-surface text-text-muted hover:text-text transition-colors"
                  >
                    ←
                  </button>
                  <h4 className="font-semibold capitalize">
                    {format(currentMonth, "MMMM yyyy", { locale: da })}
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(currentYear, currentMonthIdx + 1)
                      )
                    }
                    className="p-2 rounded-xl hover:bg-surface text-text-muted hover:text-text transition-colors"
                  >
                    →
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"].map((d) => (
                    <div
                      key={d}
                      className="text-center text-xs text-text-muted py-1 font-medium"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(currentYear, currentMonthIdx, day);
                    const available = isDateAvailable(date);
                    const isSelected =
                      selectedDate?.toDateString() === date.toDateString();
                    const isToday =
                      new Date().toDateString() === date.toDateString();

                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={!available}
                        onClick={() => handleDateSelect(date)}
                        className={cn(
                          "aspect-square rounded-xl text-sm font-medium transition-all",
                          isSelected
                            ? "bg-accent text-white shadow-lg shadow-accent/30"
                            : isToday
                            ? "border border-accent text-accent"
                            : available
                            ? "hover:bg-surface text-text hover:text-accent"
                            : "text-text-muted/30 cursor-not-allowed"
                        )}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time slots */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="flex items-center gap-2 text-sm text-text-muted mb-3">
                  <Clock size={14} className="text-accent" />
                  Ledige tider d.{" "}
                  {format(selectedDate, "d. MMMM", { locale: da })}
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {availableSlots.map((slot) => {
                    const unavailable = isSlotUnavailable(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={unavailable}
                        onClick={() => setSelectedTime(slot)}
                        className={cn(
                          "py-2 px-3 rounded-xl text-sm font-medium transition-all",
                          selectedTime === slot
                            ? "bg-accent text-white shadow-md shadow-accent/30"
                            : unavailable
                            ? "bg-surface-light text-text-muted/30 cursor-not-allowed line-through"
                            : "bg-surface-light text-text-muted hover:text-text hover:border-accent/30 border border-border"
                        )}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <button
              type="button"
              disabled={!selectedDate || !selectedTime || !watch("serviceType")}
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl bg-accent hover:bg-accent-light text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-accent/25"
            >
              Fortsæt
            </button>
          </motion.div>
        )}

        {/* Step 2: Car info & license plate */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <h3 className="text-lg font-semibold font-heading flex items-center gap-2">
              <Car size={20} className="text-accent" />
              Biloplysninger
            </h3>

            <div>
              <label className="block text-sm text-text-muted mb-2">
                Nummerplade *
              </label>
              <div className="flex gap-2">
                <input
                  {...register("licensePlate")}
                  placeholder="AB 12 345"
                  className="flex-1 px-4 py-3 rounded-xl bg-surface-light border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none uppercase transition-colors"
                  style={{ textTransform: "uppercase" }}
                />
                <button
                  type="button"
                  onClick={lookupPlate}
                  disabled={lookingUp}
                  className="px-4 py-3 rounded-xl bg-accent hover:bg-accent-light text-white transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {lookingUp ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Search size={16} />
                  )}
                  <span className="hidden sm:inline">Hent bildata</span>
                </button>
              </div>
              {errors.licensePlate && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.licensePlate.message}
                </p>
              )}
            </div>

            {/* Car info display – auto lookup */}
            <AnimatePresence>
              {carInfo && !manualCarEntry && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass-light rounded-2xl p-5 border border-accent/30"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <p className="text-sm font-medium text-green-400">
                      Biloplysninger fundet
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { label: "Mærke", value: carInfo.brand },
                      { label: "Model", value: carInfo.model },
                      { label: "Årgang", value: carInfo.year },
                      { label: "Brændstof", value: carInfo.fuel },
                      { label: "Variant", value: carInfo.variant },
                      { label: "Motor", value: carInfo.engine },
                    ]
                      .filter((item) => item.value)
                      .map((item) => (
                        <div key={item.label}>
                          <p className="text-text-muted">{item.label}</p>
                          <p className="text-text font-medium">{item.value}</p>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Manuel bilinfo – vises når opslag fejler */}
            <AnimatePresence>
              {manualCarEntry && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass-light rounded-2xl p-5 border border-border"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Edit3 size={14} className="text-accent" />
                    <p className="text-sm font-medium text-text-muted">
                      Udfyld biloplysninger manuelt (valgfrit)
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-text-muted mb-1">Bilmærke</label>
                      <input
                        value={manualBrand}
                        onChange={(e) => setManualBrand(e.target.value)}
                        placeholder="fx Volkswagen"
                        className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm placeholder:text-text-muted/50 focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">Model</label>
                      <input
                        value={manualModel}
                        onChange={(e) => setManualModel(e.target.value)}
                        placeholder="fx Golf"
                        className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm placeholder:text-text-muted/50 focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-text-muted mb-1">Årgang</label>
                      <input
                        value={manualYear}
                        onChange={(e) => setManualYear(e.target.value)}
                        placeholder="fx 2019"
                        type="number"
                        min="1990"
                        max="2030"
                        className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm placeholder:text-text-muted/50 focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-2xl border border-border bg-surface-light text-text-muted hover:text-text transition-colors font-medium"
              >
                ← Tilbage
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-4 rounded-2xl bg-accent hover:bg-accent-light text-white font-bold transition-all hover:shadow-lg hover:shadow-accent/25"
              >
                Fortsæt
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Contact info & submit */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <h3 className="text-lg font-semibold font-heading flex items-center gap-2">
              <User size={20} className="text-accent" />
              Dine oplysninger
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">
                  Fulde navn *
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    {...register("customerName")}
                    placeholder="Anders Hansen"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-light border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
                {errors.customerName && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.customerName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">
                  Telefon *
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="+45 56 00 00 00"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-light border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="anders@email.dk"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-light border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none transition-colors"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">
                Kommentar (valgfri)
              </label>
              <div className="relative">
                <MessageSquare
                  size={16}
                  className="absolute left-3.5 top-3.5 text-text-muted"
                />
                <textarea
                  {...register("message")}
                  rows={3}
                  placeholder="Beskriv problemet eller hvad du ønsker udført..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-light border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="glass-light rounded-2xl p-5 border border-border">
              <h4 className="font-semibold mb-3 text-sm text-text-muted uppercase tracking-wide">
                Opsummering
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Service</span>
                  <span className="text-text font-medium">
                    {watch("serviceType")}
                  </span>
                </div>
                {selectedDate && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Dato</span>
                    <span className="text-text font-medium">
                      {format(selectedDate, "d. MMMM yyyy", { locale: da })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-muted">Tidspunkt</span>
                  <span className="text-accent font-bold">kl. {selectedTime}</span>
                </div>
                {(carInfo || manualBrand) && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Bil</span>
                    <span className="text-text font-medium">
                      {carInfo
                        ? `${carInfo.brand} ${carInfo.model}`
                        : `${manualBrand} ${manualModel}`.trim()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-4 rounded-2xl border border-border bg-surface-light text-text-muted hover:text-text transition-colors font-medium"
              >
                ← Tilbage
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-4 rounded-2xl bg-accent hover:bg-accent-light text-white font-bold transition-all disabled:opacity-70 hover:shadow-lg hover:shadow-accent/25 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sender...
                  </>
                ) : (
                  "Bekræft booking"
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
