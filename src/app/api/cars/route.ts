import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const brand = searchParams.get("brand");
  const fuel = searchParams.get("fuel");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const featured = searchParams.get("featured");

  const cars = await prisma.car.findMany({
    where: {
      active: true,
      sold: false,
      ...(brand && { brand: { equals: brand, mode: "insensitive" } }),
      ...(fuel && { fuel: { equals: fuel, mode: "insensitive" } }),
      ...(minPrice && { price: { gte: parseInt(minPrice) } }),
      ...(maxPrice && { price: { lte: parseInt(maxPrice) } }),
      ...(featured === "true" && { featured: true }),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(cars);
}
