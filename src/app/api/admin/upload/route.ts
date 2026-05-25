import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "cars");
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });

  await mkdir(UPLOAD_DIR, { recursive: true });

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "Ingen filer modtaget" }, { status: 400 });
  }

  const urls: string[] = [];

  for (const file of files) {
    const ext = extname(file.name).toLowerCase();
    if (!ALLOWED.has(ext)) {
      return NextResponse.json({ error: `Filtype ikke tilladt: ${ext}` }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: `Fil for stor (max 8 MB): ${file.name}` }, { status: 400 });
    }

    const filename = `${randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(UPLOAD_DIR, filename), buffer);
    urls.push(`/uploads/cars/${filename}`);
  }

  return NextResponse.json({ urls });
}
