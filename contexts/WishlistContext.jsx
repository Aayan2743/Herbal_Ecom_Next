// "use client";

// import { createContext, useContext, useState } from "react";

// const WishlistContext = createContext(null);

// export const WishlistProvider = ({ children }) => {
//   const [wishlist, setWishlist] = useState([]);

//   const addToWishlist = (product) => {
//     setWishlist((prev) =>
//       prev.find((p) => p.id === product.id)
//         ? prev
//         : [...prev, product]
//     );
//   };

//   const removeFromWishlist = (productId) => {
//     setWishlist((prev) =>
//       prev.filter((p) => p.id !== productId)
//     );
//   };

//   const isInWishlist = (productId) => {
//     return wishlist.some((p) => p.id === productId);
//   };

//   const getWishlistCount = () => wishlist.length;

//   const clearWishlist = () => setWishlist([]);

//   return (
//     <WishlistContext.Provider
//       value={{
//         wishlist,
//         addToWishlist,
//         removeFromWishlist,
//         isInWishlist,
//         getWishlistCount,
//         clearWishlist,
//       }}
//     >
//       {children}
//     </WishlistContext.Provider>
//   );
// };

// export const useWishlist = () => {
//   const ctx = useContext(WishlistContext);
//   if (!ctx) {
//     throw new Error(
//       "useWishlist must be used inside WishlistProvider"
//     );
//   }
//   return ctx;
// };

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD WISHLIST AFTER LOGIN ================= */
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  /* ================= FETCH FROM API ================= */
  // const fetchWishlist = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await api.get("/cart/get-wishlist");
  //     console.log("res", res);
  //     setWishlist(res.data.data || []);
  //   } catch (err) {
  //     console.error("Failed to load wishlist", err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const res = await api.get("/cart/get-wishlist");

      if (res.data?.success === false) {
        // backend returned logical error
        setError(res.data.message || "Failed to load wishlist");
        setWishlist([]);
        return;
      }

      setWishlist(res.data.data || []);
    } catch (err) {
      // axios error handling
      const message =
        err.response?.data?.message || err.message || "Something went wrong";

      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= TOGGLE (ADD / REMOVE) ================= */
  const toggleWishlist = async (product) => {
    try {
      await api.post("/cart/wishlist-toggle", {
        product_id: product.id,
      });

      // Refresh wishlist after toggle
      fetchWishlist();
    } catch (err) {
      console.error("Wishlist toggle failed", err.message);
    }
  };

  /* ================= HELPERS ================= */
  const isInWishlist = (productId) => wishlist.some((p) => p.id === productId);

  const getWishlistCount = () => wishlist.length;

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        getWishlistCount,
        clearWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return ctx;
};
