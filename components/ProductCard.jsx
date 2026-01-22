// "use client";

// import { ShoppingCart, Heart, ArrowLeft } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useCart } from "@/contexts/CartContext";
// import { useWishlist } from "@/contexts/WishlistContext";
// import { useAuth } from "@/contexts/AuthContext";

// export default function ProductCard({ product, showBack = false }) {
//   const router = useRouter();
//   const { addToCart } = useCart();
//   const { addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist } =
//     useWishlist();

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

//   const handleWishlist_old = (e) => {
//     e.stopPropagation();

//     inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
//   };

//   console.log("ddddd", product);
//   const handleOpenProduct = () => {
//     router.push(`/product/${product.slug}`);
//   };

//   const handleWishlist = (e) => {
//     e.stopPropagation();

//     // 🔐 NOT LOGGED IN → OPEN LOGIN MODAL
//     if (!isAuthenticated) {
//       openLogin();
//       return;
//     }

//     toggleWishlist(product);

//     // ✅ LOGGED IN → TOGGLE WISHLIST
//     inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
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
//         onClick={(e) => {
//           e.stopPropagation();

//           // 🔐 Not logged in → open login modal
//           if (!isAuthenticated) {
//             openLogin();
//             return;
//           }

//           // ✅ Logged in → toggle wishlist
//           handleWishlist(e);
//         }}
//         className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow transition
//     ${
//       isAuthenticated
//         ? "bg-white/90 hover:bg-gray-100"
//         : "bg-gray-200 hover:bg-gray-300"
//     }`}
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
//           src={product.image || "/placeholder.webp"}
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

  /* ---------------- HANDLERS ---------------- */

  const handleAddToCart = (e) => {
    e.stopPropagation();

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const handleOpenProduct = () => {
    router.push(`/product/${product.slug}`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();

    // 🔐 Not logged in → open login modal
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    // ✅ Logged in → API toggle (DB is source of truth)
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
        title={!isAuthenticated ? "Login to add wishlist" : ""}
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
          src={product.image || "/placeholder.webp"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* 📦 Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-medium line-clamp-2 text-gray-800">
          {product.name}
        </h3>

        <p className="text-green-700 font-bold text-lg">
          From ₹{product.price}
        </p>

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
