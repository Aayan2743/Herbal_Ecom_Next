// "use client";

// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import api from "@/lib/api";
// import ProductDetail from "@/components/ProductDetail";

// export default function ProductDetailsPage() {
//   const searchParams = useSearchParams();
//   const slug = searchParams.get("slug");

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!slug) return;

//     const fetchProduct = async () => {
//       try {
//         const res = await api.get(`/ecom/products-main?slug=${slug}`);
//         setProduct(res.data.data);
//       } catch {
//         setProduct(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [slug]);

//   if (loading) {
//     return <div className="p-10 text-center">Loading product...</div>;
//   }

//   if (!product) {
//     return (
//       <div className="p-10 text-center text-gray-500">Product not found</div>
//     );
//   }

//   return <ProductDetail product={product} />;
// }

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductDetail from "@/components/ProductDetail";

export default function ProductDetailsPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/ecom/products-main?slug=${slug}`);

        // ✅ PAGINATED RESPONSE → TAKE FIRST ITEM
        const item = res.data?.data?.data?.[0] || null;

        setProduct(item);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div className="p-10 text-center">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500">Product not found</div>
    );
  }

  return <ProductDetail product={product} onBack={() => history.back()} />;
}
