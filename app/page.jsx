// "use client";

// import React, { useEffect, useState } from "react";
// import LoadingAnimation from "@/components/LoadingAnimation";
// import AdBanner from "@/components/AdBanner";
// import CategorySection from "@/components/CategorySection";
// import { useRouter } from "next/navigation";
// import { getCategories } from "@/lib/services/category.service";
// import { getProducts } from "@/lib/services/product.service";
// import api from "@/lib/api";
// import { useSearchParams } from "next/navigation";

// // laravel code api calling

// export default function Home() {
//   const [loading, setLoading] = useState(true);
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const router = useRouter();

//   const searchParams = useSearchParams();
//   const activeCategory = searchParams.get("category");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await api.get("ecom/menu"); // ✅ await is required
//         console.log("resddddddddd", res.data); // ✅ log the actual response
//       } catch (err) {
//         console.error("Home API error", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData(); // ✅ don’t forget to call the function
//   }, []);

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         setLoading(true);

//         const res = await api.get(
//           `/ecom/products-main${activeCategory ? `?category=${activeCategory}` : ""}`,
//         );

//         setProducts(res.data.data.data);
//       } catch (err) {
//         console.error(err.response?.data || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProducts();
//   }, [activeCategory]); // ✅ now React is happy

//   if (loading) {
//     return <LoadingAnimation onComplete={() => {}} />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <main className="container mx-auto px-4 py-6">
//         <AdBanner />

//         {/* CATEGORY WISE PRODUCTS */}
//         <div className="space-y-12">
//           {categories.map((cat) => {
//             console.log("products", products);

//             const categoryProducts = products.filter(
//               (p) => p.categoryId == cat.id,
//             );

//             if (categoryProducts.length === 0) return null;

//             return (
//               <CategorySection
//                 key={cat.id}
//                 category={cat.name}
//                 categorySlug={cat.slug}
//                 products={categoryProducts}
//               />
//             );
//           })}
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import LoadingAnimation from "@/components/LoadingAnimation";
import AdBanner from "@/components/AdBanner";
import CategorySection from "@/components/CategorySection";
import api from "@/lib/api";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  /* ===== LOAD CATEGORIES ===== */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/ecom/menu");

        const normalized = res.data.map((c, index) => ({
          id: index + 1,
          name: c.label,
          slug: c.key,
        }));

        setCategories(normalized);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  /* ===== LOAD PRODUCTS ===== */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/ecom/products-main${activeCategory ? `?category=${activeCategory}` : ""}`,
        );

        setProducts(res.data.data.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [activeCategory]);

  if (loading) {
    return <LoadingAnimation onComplete={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <AdBanner />

        <div className="space-y-12">
          {categories.map((cat) => {
            const categoryProducts = products.filter(
              (p) => p.category?.slug === cat.slug,
            );

            if (!categoryProducts.length) return null;

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
