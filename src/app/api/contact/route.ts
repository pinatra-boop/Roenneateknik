import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2, "Navn er for kort"),
  email: z.string().email("Ugyldig email"),
  phone: z.string().min(8, "Ugyldigt telefonnummer"),
  address: z.string().optional(),
  city: z.string().optional(),
  licensePlate: z.string().optional(),
  carBrand: z.string().optional(),
  carModel: z.string().optional(),
  message: z.string().min(10, "Beskeden er for kort"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    await prisma.contact.create({ data });

    await sendContactNotification(data).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Intern fejl" }, { status: 500 });
  }
}
