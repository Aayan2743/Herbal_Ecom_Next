"use client";

import React, { useEffect, useState } from "react";
import LoadingAnimation from "@/components/LoadingAnimation";
import AdBanner from "@/components/AdBanner";
import CategorySection from "@/components/CategorySection";
import { useRouter } from "next/navigation";
import { getCategories } from "@/lib/services/category.service";
import { getProducts } from "@/lib/services/product.service";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, prodData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        setCategories(catData);
        setProducts(prodData);
      } catch (err) {
        console.error("Home API error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingAnimation onComplete={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <AdBanner />

        {/* CATEGORY WISE PRODUCTS */}
        <div className="space-y-12">
          {categories.map((cat) => {
            console.log("products", products);

            const categoryProducts = products.filter(
              (p) => p.categoryId == cat.id
            );

            if (categoryProducts.length === 0) return null;

            return (
              <CategorySection
                key={cat.id}
                category={cat.name}
                categorySlug={cat.slug}
                products={categoryProducts}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
