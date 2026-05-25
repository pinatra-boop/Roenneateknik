import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAllContent } from "@/lib/content";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });
  const content = await getAllContent();
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });

  const { key, value } = await req.json();
  if (!key || value === undefined) {
    return NextResponse.json({ error: "key og value er påkrævet" }, { status: 400 });
  }

  await prisma.siteSettings.upsert({
    where: { key },
    update: { value: JSON.stringify(value) },
    create: { key, value: JSON.stringify(value) },
  });

  return NextResponse.json({ success: true });
}
