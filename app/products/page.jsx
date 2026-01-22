"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import EnhancedSidebar from "@/components/EnhancedSidebar";
import ProductsClient from "./ProductsClient";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [filters, setFilters] = useState({});

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SIDEBAR */}
        <div className="lg:col-span-1">
          <EnhancedSidebar
            selectedCategory={category}
            onFiltersChange={setFilters}
          />
        </div>

        {/* PRODUCTS */}
        <div className="lg:col-span-3">
          <ProductsClient categorySlug={category} filters={filters} />
        </div>
      </div>
    </div>
  );
}
