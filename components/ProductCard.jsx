// "use client";

// import { ShoppingCart, Heart, ArrowLeft } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useCart } from "@/contexts/CartContext";
// import { useWishlist } from "@/contexts/WishlistContext";
// import { useAuth } from "@/contexts/AuthContext";

// export default function ProductCard({ product, showBack = false }) {
//   const router = useRouter();
//   const { addToCart } = useCart();
//   const { toggleWishlist, isInWishlist } = useWishlist();
//   const { isAuthenticated, openLogin } = useAuth();

//   const inWishlist = isInWishlist(product.id);

//   /* ---------------- HANDLERS ---------------- */

//   const handleAddToCart = (e) => {
//     e.stopPropagation();

//     addToCart({
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       image: product.image,
//     });
//   };

//   // ✅ FIXED ROUTE (QUERY PARAM)
//   const handleOpenProduct = () => {
//     router.push(`/product/details?slug=${product.slug}`);
//   };

//   const handleWishlist = (e) => {
//     e.stopPropagation();

//     if (!isAuthenticated) {
//       openLogin();
//       return;
//     }

//     toggleWishlist(product);
//   };

//   /* ---------------- UI ---------------- */

//   return (
//     <div className="relative bg-white rounded-xl border hover:shadow-lg transition overflow-hidden group">
//       {/* 🔙 Back Button */}
//       {showBack && (
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             router.back();
//           }}
//           className="absolute top-3 left-3 z-10 bg-white/90 p-2 rounded-full shadow hover:bg-gray-100"
//         >
//           <ArrowLeft className="w-4 h-4" />
//         </button>
//       )}

//       {/* ❤️ Wishlist */}
//       <button
//         onClick={handleWishlist}
//         className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow transition
//           ${
//             isAuthenticated
//               ? "bg-white/90 hover:bg-gray-100"
//               : "bg-gray-200 hover:bg-gray-300"
//           }`}
//         title={!isAuthenticated ? "Login to add wishlist" : ""}
//       >
//         <Heart
//           className={`w-4 h-4 transition ${
//             inWishlist
//               ? "fill-red-500 text-red-500"
//               : isAuthenticated
//                 ? "text-gray-600"
//                 : "text-gray-400"
//           }`}
//         />
//       </button>

//       {/* 🖼 Image */}
//       <div
//         onClick={handleOpenProduct}
//         className="h-52 overflow-hidden cursor-pointer"
//       >
//         <img
//           src={product.images?.image_url || "/placeholder.webp"}
//           alt={product.name}
//           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//         />
//       </div>

//       {/* 📦 Content */}
//       <div className="p-4 space-y-2">
//         <h3 className="text-sm font-medium line-clamp-2 text-gray-800">
//           {product.name}
//         </h3>

//         <p className="text-green-700 font-bold text-lg">
//           From ₹{product.price}
//         </p>

//         <button
//           onClick={handleAddToCart}
//           className="mt-3 w-full bg-red-900 text-white text-sm py-2 rounded-lg hover:bg-red-800 transition flex items-center justify-center gap-2"
//         >
//           <ShoppingCart className="w-4 h-4" />
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ProductCard({ product, showBack = false }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, openLogin } = useAuth();

  const inWishlist = isInWishlist(product.id);

  /* ===== DERIVED DATA (FROM API RESPONSE) ===== */

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    "/placeholder.webp";

  // price: base_price OR lowest variant extra_price
  const price =
    product.base_price ??
    (product.variant_combinations?.length
      ? Math.min(
          ...product.variant_combinations.map((v) =>
            Number(v.extra_price || 0),
          ),
        )
      : 0);

  /* ---------------- HANDLERS ---------------- */

  const handleAddToCart = (e) => {
    e.stopPropagation();

    addToCart({
      id: product.id,
      name: product.name,
      price,
      image: primaryImage,
    });
  };

  const handleOpenProduct = () => {
    router.push(`/product/details?slug=${product.slug}`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      openLogin();
      return;
    }

    toggleWishlist(product);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="relative bg-white rounded-xl border hover:shadow-lg transition overflow-hidden group">
      {/* 🔙 Back Button */}
      {showBack && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.back();
          }}
          className="absolute top-3 left-3 z-10 bg-white/90 p-2 rounded-full shadow hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      )}

      {/* ❤️ Wishlist */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow transition
          ${
            isAuthenticated
              ? "bg-white/90 hover:bg-gray-100"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
      >
        <Heart
          className={`w-4 h-4 transition ${
            inWishlist
              ? "fill-red-500 text-red-500"
              : isAuthenticated
                ? "text-gray-600"
                : "text-gray-400"
          }`}
        />
      </button>

      {/* 🖼 Image */}
      <div
        onClick={handleOpenProduct}
        className="h-52 overflow-hidden cursor-pointer"
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* 📦 Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-medium line-clamp-2 text-gray-800">
          {product.name}
        </h3>

        <p className="text-green-700 font-bold text-lg">From ₹{price}</p>

        <button
          onClick={handleAddToCart}
          className="mt-3 w-full bg-red-900 text-white text-sm py-2 rounded-lg hover:bg-red-800 transition flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
