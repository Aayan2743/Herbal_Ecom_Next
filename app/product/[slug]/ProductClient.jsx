// //product/[slug]/ProductClient.jsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import ProductDetail from "@/components/ProductDetail";
// import Breadcrumb from "@/components/Breadcrumb";
// import { getProductBySlug } from "@/lib/services/product.service";

// export default function ProductClient() {
//   const { slug } = useParams(); // ✅ FIX
//   const router = useRouter();

//   console.log("slug:", slug);

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!slug) return;

//     const fetchProduct = async () => {
//       try {
//         const data = await getProductBySlug(slug);
//         console.log("sss", data);
//         setProduct(data);
//       } catch (err) {
//         console.error("Product load failed", err);
//         setProduct(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [slug]);

//   if (!slug) return null;

//   if (loading) {
//     return <div className="p-10 text-center">Loading...</div>;
//   }

//   if (!product) {
//     return <div className="p-10 text-center">Product not found</div>;
//   }

//   return (
//     <>
//       {/* <Breadcrumb category={product.categorySlug} productName={product.name} /> */}
//       <ProductDetail product={product} onBack={() => router.back()} />
//     </>
//   );
// }

// new code

"use client";

import { useRouter } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";

export default function ProductClient({ product }) {
  const router = useRouter();

  return <ProductDetail product={product} onBack={() => router.back()} />;
}
