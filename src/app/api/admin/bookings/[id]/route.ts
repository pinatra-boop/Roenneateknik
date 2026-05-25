import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  return true;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth()))
    return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const booking = await prisma.booking.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(booking);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth()))
    return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });

  const { id } = await params;
  await prisma.booking.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
