import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();

  const service = await prisma.service.update({
    where: { id },
    data: {
      name: data.name?.trim(),
      description: data.description?.trim(),
      longDesc: data.longDesc?.trim() || null,
      price: data.price?.trim() || null,
      duration: data.duration?.trim() || null,
      icon: data.icon?.trim() || null,
      featured: data.featured,
      order: data.order,
      active: data.active,
    },
  });

  return NextResponse.json(service);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });

  const { id } = await params;
  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
