import { NextRequest, NextResponse } from "next/server";
import { lookupLicensePlate } from "@/lib/licensePlate";

export async function GET(req: NextRequest) {
  const plate = req.nextUrl.searchParams.get("plate");
  if (!plate) {
    return NextResponse.json({ error: "Nummerplade mangler" }, { status: 400 });
  }

  const data = await lookupLicensePlate(plate).catch((err) => {
    console.error("License plate lookup error:", err);
    return null;
  });
  if (!data) {
    return NextResponse.json({ error: "Ingen data fundet" }, { status: 404 });
  }

  return NextResponse.json(data);
}
