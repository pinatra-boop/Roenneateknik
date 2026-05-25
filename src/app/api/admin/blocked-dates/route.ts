import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAuth() {
  const session = await getServerSession(authOptions);
  return !!session;
}

export async function GET() {
  if (!(await checkAuth()))
    return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });

  const dates = await prisma.blockedDate.findMany({
    orderBy: { date: "asc" },
    where: { date: { gte: new Date() } },
  });
  return NextResponse.json(dates);
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth()))
    return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });

  const body = await req.json();
  const blocked = await prisma.blockedDate.create({
    data: {
      date: new Date(body.date),
      reason: body.reason,
      allDay: body.allDay ?? true,
      timeSlots: body.timeSlots ?? [],
    },
  });
  return NextResponse.json(blocked);
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAuth()))
    return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });

  const { id } = await req.json();
  await prisma.blockedDate.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
