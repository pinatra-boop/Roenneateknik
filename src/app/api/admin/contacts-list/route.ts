import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });

  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(contacts);
}
