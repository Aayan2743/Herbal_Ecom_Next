"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/api";

export default function ProductsClient({ categorySlug, filters }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("dashboard/pos/products-all/", {
          params: {
            ...(categorySlug ? { category: categorySlug } : {}),
            ...filters,
          },
        });
        setProducts(res.data?.data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, JSON.stringify(filters)]);

  if (loading) {
    return <div className="p-10 text-center">Loading products...</div>;
  }

  if (!products.length) {
    return (
      <div className="p-10 text-center text-gray-500">No products found</div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          detailsUrl={`/product/details?slug=${product.slug}`}
        />
      ))}
    </div>
  );
}
