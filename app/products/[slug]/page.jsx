// products/[slug]/page.jsx
"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import EnhancedSidebar from "@/components/EnhancedSidebar";
import ProductsClient from "../ProductsClient";

export default function CategoryPage() {
  const { slug } = useParams(); // ✅ ALWAYS WORKS
  const [filters, setFilters] = useState({});

  console.log("CATEGORY SLUG:", slug);

  if (!slug) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <EnhancedSidebar
            selectedCategory={slug}
            onFiltersChange={setFilters}
          />
        </div>

        <div className="lg:col-span-3">
          <ProductsClient categorySlug={slug} filters={filters} />
        </div>
      </div>
    </div>
  );
}

// products/[slug]/page.jsx

// import EnhancedSidebar from "@/components/EnhancedSidebar";
// import ProductsClient from "../ProductsClient";

// // REQUIRED for static export
// export async function generateStaticParams() {
//   const res = await fetch(
//     "http://localhost:3002/api/dashboard/product/products"
//   );

//   const json = await res.json();

//   // create category pages from product categories
//   const categories = new Set(
//     json.data.map((p) => p.category?.slug).filter(Boolean)
//   );

//   return Array.from(categories).map((slug) => ({ slug }));
// }

// export default function CategoryPage({ params }) {
//   const slug = params.slug;

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         <div className="lg:col-span-1">
//           <EnhancedSidebar selectedCategory={slug} />
//         </div>

//         <div className="lg:col-span-3">
//           <ProductsClient categorySlug={slug} filters={{}} />
//         </div>
//       </div>
//     </div>
//   );
// }
