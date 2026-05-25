export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { CalendarDays, Car, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface UpcomingBooking {
  id: string;
  customerName: string;
  email: string;
  serviceType: string;
  licensePlate: string;
  date: Date;
  timeSlot: string;
  status: string;
}

async function getStats() {
  const [totalBookings, pendingBookings, totalCars, newContacts, upcomingBookings] =
    await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.car.count({ where: { active: true, sold: false } }),
      prisma.contact.count({ where: { status: "NEW" } }),
      prisma.booking.findMany({
        where: { date: { gte: new Date() }, status: { not: "CANCELLED" } },
        orderBy: { date: "asc" },
        take: 5,
        include: { service: true },
      }),
    ]);

  return { totalBookings, pendingBookings, totalCars, newContacts, upcomingBookings };
}

export default async function AdminDashboard() {
  const { totalBookings, pendingBookings, totalCars, newContacts, upcomingBookings } =
    await getStats();

  const stats = [
    {
      label: "Afventende bookinger",
      value: pendingBookings,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/15",
      href: "/admin/bookings?status=PENDING",
    },
    {
      label: "Alle bookinger",
      value: totalBookings,
      icon: CalendarDays,
      color: "text-blue-400",
      bg: "bg-blue-500/15",
      href: "/admin/bookings",
    },
    {
      label: "Biler til salg",
      value: totalCars,
      icon: Car,
      color: "text-green-400",
      bg: "bg-green-500/15",
      href: "/admin/cars",
    },
    {
      label: "Nye beskeder",
      value: newContacts,
      icon: MessageSquare,
      color: "text-purple-400",
      bg: "bg-purple-500/15",
      href: "/admin/contacts",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading">Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">
          Oversigt over Rønne Autoteknik
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link
            key={label}
            href={href}
            className="glass-light rounded-2xl p-5 border border-border hover:border-accent/30 transition-all hover:-translate-y-0.5"
          >
            <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className={`text-3xl font-bold font-heading ${color}`}>{value}</p>
            <p className="text-text-muted text-sm mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Upcoming bookings */}
      <div className="glass-light rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold font-heading flex items-center gap-2">
            <CalendarDays size={18} className="text-accent" />
            Kommende bookinger
          </h2>
          <Link
            href="/admin/bookings"
            className="text-accent text-sm hover:underline"
          >
            Se alle →
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-8">
            Ingen kommende bookinger
          </p>
        ) : (
          <div className="space-y-3">
            {(upcomingBookings as UpcomingBooking[]).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border hover:border-accent/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text truncate">
                    {booking.customerName}
                  </p>
                  <p className="text-text-muted text-sm">
                    {booking.serviceType} · {booking.licensePlate}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-text">
                    {formatDate(booking.date)}
                  </p>
                  <p className="text-accent text-sm font-bold">
                    kl. {booking.timeSlot}
                  </p>
                </div>
                <div>
                  {booking.status === "CONFIRMED" ? (
                    <CheckCircle size={18} className="text-green-400" />
                  ) : (
                    <AlertCircle size={18} className="text-amber-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
