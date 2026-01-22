"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function EnhancedSidebar({
  selectedCategory,
  onFiltersChange,
}) {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const [price, setPrice] = useState({
    min: 0,
    max: 3000,
  });

  const [sortBy, setSortBy] = useState("popularity");

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const load = async () => {
      const [catRes, brandRes] = await Promise.all([
        api.get("/dashboard/pos/categories"),
        api.get("/dashboard/pos/brands"),
      ]);

      setCategories(
        (catRes.data?.data ?? []).filter(
          (c) => typeof c.id === "number"
        )
      );

      setBrands(brandRes.data?.data ?? []);
    };

    load();
  }, []);

  /* ================= HANDLERS ================= */

  const toggleBrand = (id) => {
    setSelectedBrands((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const applyFilters = () => {
    if (onFiltersChange) {
      onFiltersChange({
        brands: selectedBrands,
        price_min: price.min,
        price_max: price.max,
        sortBy,
      });
    }
  };

  /* ================= UI ================= */

  return (
    <aside className="w-72 border rounded-lg p-4 bg-white space-y-6">
      {/* ================= CATEGORY ================= */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>

        <button
          onClick={() => router.push("/products")}
          className={`block w-full text-left py-1 ${
            !selectedCategory ? "font-bold text-red-900" : ""
          }`}
        >
          All
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() =>
              router.push(`/products?category=${c.slug}`)
            }
            className={`block w-full text-left py-1 ${
              selectedCategory === c.slug
                ? "font-bold text-red-900"
                : "text-gray-700"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* ================= PRICE ================= */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>

        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={price.min}
            min={0}
            onChange={(e) =>
              setPrice({
                ...price,
                min: Number(e.target.value),
              })
            }
            className="w-20 border rounded px-2 py-1 text-sm"
            placeholder="Min"
          />
          <span className="text-gray-500">—</span>
          <input
            type="number"
            value={price.max}
            min={price.min}
            onChange={(e) =>
              setPrice({
                ...price,
                max: Number(e.target.value),
              })
            }
            className="w-20 border rounded px-2 py-1 text-sm"
            placeholder="Max"
          />
        </div>

        <div className="text-xs text-gray-500 mt-1">
          ₹{price.min} – ₹{price.max}
        </div>
      </div>

      {/* ================= BRAND ================= */}
      <div>
        <h3 className="font-semibold mb-3">Brands</h3>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((b) => (
            <label
              key={b.id}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(b.id)}
                onChange={() => toggleBrand(b.id)}
                className="accent-red-900"
              />
              {b.name}
            </label>
          ))}
        </div>
      </div>

      {/* ================= SORT ================= */}
      <div>
        <h3 className="font-semibold mb-3">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="popularity">Popularity</option>
          <option value="price_low_high">Price: Low → High</option>
          <option value="price_high_low">Price: High → Low</option>
        </select>
      </div>

      {/* ================= APPLY ================= */}
      <button
        onClick={applyFilters}
        className="w-full bg-red-900 text-white py-2 rounded-lg font-medium hover:bg-red-800 transition"
      >
        Apply Filters
      </button>
    </aside>
  );
}
