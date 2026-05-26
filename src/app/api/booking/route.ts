import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation, sendBookingNotification } from "@/lib/email";
import { formatDate } from "@/lib/utils";

const bookingSchema = z.object({
  customerName: z.string().min(2, "Navn er for kort"),
  email: z.string().email("Ugyldig email"),
  phone: z.string().min(8, "Ugyldigt telefonnummer"),
  licensePlate: z.string().min(2, "Ugyldig nummerplade"),
  carBrand: z.string().optional(),
  carModel: z.string().optional(),
  carYear: z.number().optional(),
  carFuel: z.string().optional(),
  carVariant: z.string().optional(),
  carEngine: z.string().optional(),
  carVin: z.string().optional(),
  serviceType: z.string().min(1, "Vælg en service"),
  serviceId: z.string().optional(),
  date: z.string().min(1, "Vælg en dato"),
  timeSlot: z.string().min(1, "Vælg et tidspunkt"),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = bookingSchema.parse(body);

    // Check for double booking
    const existing = await prisma.booking.findFirst({
      where: {
        date: new Date(data.date),
        timeSlot: data.timeSlot,
        status: { not: "CANCELLED" },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Dette tidspunkt er allerede booket" },
        { status: 409 }
      );
    }

    // Check blocked dates
    const blocked = await prisma.blockedDate.findFirst({
      where: {
        date: new Date(data.date),
        OR: [{ allDay: true }, { timeSlots: { has: data.timeSlot } }],
      },
    });

    if (blocked) {
      return NextResponse.json(
        { error: "Denne dato eller dette tidspunkt er ikke tilgængeligt" },
        { status: 409 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { carVin: _carVin, ...bookingData } = data;
    const booking = await prisma.booking.create({
      data: {
        ...bookingData,
        date: new Date(data.date),
        carYear: data.carYear ?? null,
      },
    });

    const formattedDate = formatDate(new Date(data.date));
    const emailData = { ...data, date: formattedDate };
    const [confirmResult, notifyResult] = await Promise.allSettled([
      sendBookingConfirmation(emailData),
      sendBookingNotification(emailData),
    ]);
    if (confirmResult.status === "rejected") {
      console.error("Booking confirmation email failed:", confirmResult.reason);
    }
    if (notifyResult.status === "rejected") {
      console.error("Booking notification email failed:", notifyResult.reason);
    }

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Booking error:", err);
    return NextResponse.json(
      { error: "Intern fejl, prøv igen" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json([]);

  const bookings = await prisma.booking.findMany({
    where: {
      date: new Date(date),
      status: { not: "CANCELLED" },
    },
    select: { timeSlot: true },
  });

  const blocked = await prisma.blockedDate.findMany({
    where: { date: new Date(date) },
  });

  const bookedSlots = (bookings as { timeSlot: string }[]).map((b) => b.timeSlot);
  const blockedSlots = (blocked as { allDay: boolean; timeSlots: string[] }[]).flatMap((b) =>
    b.allDay ? ["ALL"] : b.timeSlots
  );

  return NextResponse.json({ bookedSlots, blockedSlots });
}
