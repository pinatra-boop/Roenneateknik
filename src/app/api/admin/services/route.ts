import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });

  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });

  const data = await req.json();

  if (!data.name?.trim()) {
    return NextResponse.json({ error: "Navn er påkrævet" }, { status: 400 });
  }

  const slug = data.name
    .toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const existing = await prisma.service.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const service = await prisma.service.create({
    data: {
      name: data.name.trim(),
      slug: finalSlug,
      description: data.description?.trim() ?? "",
      longDesc: data.longDesc?.trim() || null,
      price: data.price?.trim() || null,
      duration: data.duration?.trim() || null,
      icon: data.icon?.trim() || null,
      featured: data.featured ?? false,
      order: data.order ?? 0,
      active: data.active ?? true,
    },
  });

  return NextResponse.json(service, { status: 201 });
}
