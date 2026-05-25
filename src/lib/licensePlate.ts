"use server";

import https from "node:https";
import http from "node:http";

export interface CarInfo {
  brand: string;
  model: string;
  year: number;
  fuel: string;
  variant?: string;
  engine?: string;
  vin?: string;
}

function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const options = {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://www.tjekbil.dk/",
      },
      agent,
    };
    https.get(url, options, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve(body));
    }).on("error", reject);
  });
}

export async function lookupLicensePlate(plate: string): Promise<CarInfo | null> {
  const cleaned = plate.replace(/\s+/g, "").toUpperCase();
  if (!cleaned || cleaned.length < 2) return null;

  try {
    const body = await httpsGet(
      `https://www.tjekbil.dk/api/v3/dmr/regnr/${cleaned}`
    );
    const data = JSON.parse(body);
    const b = data?.basic;
    if (!b?.maerkeTypeNavn) return null;

    return {
      brand: b.maerkeTypeNavn || "",
      model: b.modelTypeNavn || "",
      year: parseInt(b.modelAar || "0") || 0,
      fuel: translateFuel(b.drivkraftTypeNavn || ""),
      variant: b.variantTypeNavn || "",
      engine: b.motorHestekraefter ? `${b.motorHestekraefter} hk` : "",
      vin: b.stelNr || "",
    };
  } catch {
    return null;
  }
}

function translateFuel(fuel: string): string {
  const map: Record<string, string> = {
    benzin: "Benzin",
    diesel: "Diesel",
    el: "El",
    electric: "El",
    hybrid: "Hybrid",
    "benzin/el": "Hybrid",
    "plug-in hybrid": "Plug-in Hybrid",
    petrol: "Benzin",
  };
  return map[fuel.toLowerCase()] || fuel;
}
