"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatPrice, formatMileage } from "@/lib/utils";
import { Search, Fuel, Gauge, Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarListing {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  color?: string;
  description?: string;
  images: string[];
  featured: boolean;
}

export default function BrugteBilerClient() {
  const [cars, setCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (fuelFilter) params.set("fuel", fuelFilter);
    if (maxPrice) params.set("maxPrice", maxPrice);

    fetch(`/api/cars?${params}`)
      .then((r) => r.json())
      .then(setCars)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fuelFilter, maxPrice]);

  const filtered = cars.filter(
    (c) =>
      !search ||
      `${c.brand} ${c.model}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Søg mærke eller model..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-light border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none"
          />
        </div>
        <select
          value={fuelFilter}
          onChange={(e) => setFuelFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-surface-light border border-border text-text focus:border-accent focus:outline-none min-w-36"
        >
          <option value="">Alle brændstoffer</option>
          <option value="Benzin">Benzin</option>
          <option value="Diesel">Diesel</option>
          <option value="El">El</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <select
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="px-4 py-3 rounded-xl bg-surface-light border border-border text-text focus:border-accent focus:outline-none min-w-36"
        >
          <option value="">Alle priser</option>
          <option value="100000">Under 100.000 kr.</option>
          <option value="200000">Under 200.000 kr.</option>
          <option value="300000">Under 300.000 kr.</option>
          <option value="500000">Under 500.000 kr.</option>
        </select>
      </div>

      {/* Car grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton rounded-2xl h-80" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <Car size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">Ingen biler matcher din søgning</p>
          <p className="text-sm mt-1">Prøv at ændre filtrene</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((car, i) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/brugte-biler/${car.id}`}
                className="group block glass-light rounded-2xl overflow-hidden border border-border hover:border-accent/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="relative h-48 bg-gradient-to-br from-surface to-surface-light overflow-hidden">
                  {car.images[0] ? (
                    <img
                      src={car.images[0]}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Car size={48} className="text-border" />
                    </div>
                  )}
                  {car.featured && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-accent text-white text-xs font-bold">
                      Fremhævet
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface/80 to-transparent" />
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-text font-heading">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-text-muted text-sm">{car.year}</p>
                    </div>
                    <p className="text-accent font-bold text-lg">
                      {formatPrice(car.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-text-muted text-sm">
                    <span className="flex items-center gap-1">
                      <Gauge size={13} className="text-accent" />
                      {formatMileage(car.mileage)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Fuel size={13} className="text-accent" />
                      {car.fuel}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-lg bg-surface border border-border">
                      {car.transmission}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
