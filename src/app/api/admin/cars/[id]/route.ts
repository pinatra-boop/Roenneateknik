import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAuth() {
  const session = await getServerSession(authOptions);
  return !!session;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth()))
    return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });
  const { id } = await params;
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) return NextResponse.json({ error: "Ikke fundet" }, { status: 404 });
  return NextResponse.json(car);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth()))
    return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });
  const { id } = await params;

  try {
    // Strip auto-managed fields that Prisma rejects in updates
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { equipment, images, id: _id, createdAt: _c, updatedAt: _u, ...rest } = await req.json();
    const car = await prisma.car.update({
      where: { id },
      data: {
        ...rest,
        ...(Array.isArray(equipment) && { equipment: { set: equipment } }),
        ...(Array.isArray(images) && { images: { set: images } }),
      },
    });
    return NextResponse.json(car);
  } catch (err) {
    console.error("Car update error:", err);
    return NextResponse.json({ error: "Fejl ved opdatering" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth()))
    return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });
  const { id } = await params;
  await prisma.car.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
