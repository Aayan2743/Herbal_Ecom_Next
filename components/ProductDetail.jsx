"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Star, Heart, Share2, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

export default function ProductDetail({ product, onBack }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    console.log("Product Item:", product);
  }, [product]);

  useEffect(() => {
    if (!product.variations?.length) return;

    const firstInStock = product.variations.find((v) => v.stock > 0);

    if (firstInStock) {
      setSelectedVariation(firstInStock);
    }
  }, [product.variations]);

  /* ================= STATE ================= */

  const [selectedVariation, setSelectedVariation] = useState(
    product.variations?.[0] ?? null,
  );

  const [selectedImage, setSelectedImage] = useState(0);

  const inWishlist = isInWishlist(product.id);

  /* ================= DERIVED ================= */

  const price = selectedVariation?.price ?? product.price;
  const stock = selectedVariation?.stock ?? product.stock;
  console.log("stock", stock);

  const images = useMemo(() => {
    if (selectedVariation?.images?.length) {
      return selectedVariation.images.map((img) => img.image_url);
    }

    return product.images?.map((img) => img.image_url) || [];
  }, [selectedVariation, product.images]);

  useEffect(() => {
    if (!images.length && product.image) {
      setSelectedImage(0);
    }
  }, [images, product.image]);

  /* ================= ACTIONS ================= */

  // const handleAddToCart = () => {
  //   if (!selectedVariation) return;

  //   addToCart({
  //     id: product.id,
  //     variationId: selectedVariation.id,
  //     name: `${product.name} (${selectedVariation.name})`,
  //     price: selectedVariation.price,
  //     image: images[0],
  //     stock: stock,
  //   });
  // };

  const handleAddToCart = () => {
    if (!selectedVariation) return;
    console.log("add to cart", stock);
    if (stock == 0) {
      // console.warn("Attempted to add out-of-stock item");
      alert("❌ This product is out of stock");

      return;
    }

    addToCart({
      id: product.id,
      variationId: selectedVariation.id,
      name: `${product.name} (${selectedVariation.name})`,
      price: selectedVariation.price,
      image: images[0],
      stock: stock,
    });
  };

  const handleWishlistToggle = () => {
    inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* BACK */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT : IMAGES */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={
                images[selectedImage] || product.image || "/placeholder.webp"
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 rounded-lg border overflow-hidden ${
                  selectedImage === i ? "border-[#8B1D3D]" : "border-gray-200"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT : DETAILS */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>

            <div className="flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{product.rating ?? 4.3}</span>
              <span className="text-sm text-gray-500">
                ({product.reviews ?? 120} reviews)
              </span>
            </div>
          </div>

          {/* PRICE */}
          <div className="text-3xl font-bold text-green-700">₹{price}</div>

          {/* VARIATIONS */}
          {product.variations?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Select Variant</h3>

              <div className="flex flex-wrap gap-2">
                {product.variations.map((v) => (
                  <button
                    key={v.id}
                    disabled={v.stock === 0}
                    onClick={() => {
                      setSelectedVariation(v);
                      setSelectedImage(0);
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      selectedVariation?.id === v.id
                        ? "border-[#8B1D3D] bg-[#F7E9ED]"
                        : "border-gray-300"
                    } ${v.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={stock == 0}
              className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2
              ${
                stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#8B1D3D] hover:bg-[#7a1835] text-white"
              }
            `}
            >
              <ShoppingCart className="w-5 h-5" />
              {stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              onClick={handleWishlistToggle}
              className={`p-3 rounded-lg border ${
                inWishlist
                  ? "border-red-300 text-red-500"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`}
              />
            </button>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="font-semibold mb-1">Description</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {product.description ??
                "High-quality herbal product crafted using traditional formulations and modern quality standards."}
            </p>
          </div>

          {/* SHARE */}
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
