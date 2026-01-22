// app/product/[slug]/page.jsx
// working code
// import { notFound } from "next/navigation";
// import ProductClient from "./ProductClient";
// import { getProductBySlug } from "@/lib/services/product.service";

// export const dynamic = "force-dynamic"; // 🔥 IMPORTANT (disable cache)

// export default async function ProductPage({ params }) {
//   const { slug } = params;

//   const product = await getProductBySlug(slug);

//   if (!product) notFound();

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <ProductClient product={product} />
//     </div>
//   );
// }

// new code

// app/product/[slug]/page.jsx
// import { notFound } from "next/navigation";
// import ProductClient from "./ProductClient";
// import { getProductBySlug } from "@/lib/services/product.service";

// export const dynamic = "force-dynamic";

// /* =========================
//    ✅ SEO META (SSR SAFE)
// ========================= */
// export async function generateMetadata({ params }) {
//   const { slug } = params;
//   const product = await getProductBySlug(slug);

//   if (!product) {
//     return {
//       title: "Product not found",
//       description: "Product does not exist",
//     };
//   }

//   return {
//     title: product.seo?.title || product.name,

//     description:
//       product.seo?.description || `Buy ${product.name} at best price`,

//     keywords: product.seo?.keywords || "",

//     openGraph: {
//       title: product.seo?.title || product.name,
//       description:
//         product.seo?.description || `Buy ${product.name} at best price`,
//       images: product.image ? [product.image] : [],
//       type: "website", // ✅ FIXED
//     },

//     alternates: {
//       canonical: `http://localhost:3000/product/${slug}`,
//     },
//   };
// }

// /* =========================
//    ✅ PAGE (SSR)
// ========================= */
// export default async function ProductPage({ params }) {
//   const product = await getProductBySlug(params.slug);
//   if (!product) notFound();

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <ProductClient product={product} />
//     </div>
//   );
// }

// code 2

// app/product/[slug]/page.jsx
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";
import { getProductBySlug } from "@/lib/services/product.service";

export const dynamic = "force-dynamic";

/* =========================
   ✅ SEO META (SSR)
========================= */
export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product not found",
      description: "Product does not exist",
    };
  }

  return {
    title: product.seo?.title || product.name,
    description:
      product.seo?.description || `Buy ${product.name} at best price`,
    keywords: product.seo?.keywords || "",

    openGraph: {
      title: product.seo?.title || product.name,
      description:
        product.seo?.description || `Buy ${product.name} at best price`,
      images: product.image ? [`http://localhost:3000${product.image}`] : [],
      type: "website",
    },

    alternates: {
      canonical: `http://localhost:3000/product/${params.slug}`,
    },
  };
}

/* =========================
   ✅ PAGE (SSR)
========================= */
export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  /* =========================
     ✅ PRODUCT JSON-LD SCHEMA
  ========================= */
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image ? [`http://localhost:3000${product.image}`] : [],
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Sridevi Herbal & Co",
    },
    category: product.categoryName,
    offers: {
      "@type": "Offer",
      url: `http://localhost:3000/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.variations?.[0]?.price ?? product.price,
      availability:
        product.variations?.[0]?.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviews || 0,
        }
      : undefined,
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* ✅ JSON-LD injected SERVER-SIDE */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      <ProductClient product={product} />
    </div>
  );
}
