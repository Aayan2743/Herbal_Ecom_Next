"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  User,
  ShoppingCart,
  ChevronDown,
  Heart,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";

import Cart from "./Cart";
import LoginModal from "./LoginModal";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [logo, setLogo] = useState("/logo.webp");

  const { getTotalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  /* ================= FETCH CATEGORIES ================= */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/dashboard/pos/categories");
        setCategories(
          (res.data?.data ?? []).filter(
            (c) => typeof c.id === "number"
          )
        );
      } catch (err) {
        console.error("Category load failed", err);
      }
    };

    loadCategories();
  }, []);

  /* ================= FETCH LOGO ================= */

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const res = await api.get("/dashboard/logo-settings-open");
        if (res.data?.status && res.data?.data?.logo) {
          setLogo(res.data.data.logo);
        }
      } catch (err) {
        console.error("Logo load failed", err);
      }
    };

    loadLogo();
  }, []);

  /* ================= HANDLERS ================= */

  const handleCategoryClick = (slug) => {
    setShowCategoryMenu(false);
    router.push(slug ? `/products?category=${slug}` : "/products");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogoClick = () => {
    setSearchQuery("");
    router.push("/");
  };

  /* ================= UI ================= */

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        {/* TOP BAR */}
        <div className="bg-[#8B1D3D] text-white py-2 text-center text-sm">
          🌿 Welcome to Sridevi Herbal & Co – Purely Natural Care 🌿
        </div>

        {/* MAIN HEADER */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-3"
            >
              <img src={logo} alt="Logo" className="w-10 h-10" />
              <div className="hidden md:block">
                <p className="text-xl font-bold text-[#8B1D3D]">
                  Sridevi Herbal & Co
                </p>
                <p className="text-xs text-gray-500">
                  Pure Herbal Living
                </p>
              </div>
            </button>

            {/* SEARCH */}
            <form
              onSubmit={handleSearch}
              className="relative flex-1 max-w-xl mx-4"
            >
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search herbal products..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1D3D]"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>

            {/* RIGHT MENU */}
            <div className="flex items-center gap-4">
              <a
                href="/about-us"
                className="hidden lg:block text-sm text-gray-600 hover:text-[#8B1D3D]"
              >
                About Us
              </a>

              {/* PROFILE */}
              <div className="relative">
                <button
                  onClick={() =>
                    isAuthenticated
                      ? setShowProfileMenu(!showProfileMenu)
                      : setShowLogin(true)
                  }
                  className="flex items-center gap-2 text-gray-600"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border rounded shadow-lg z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-xs text-gray-500">
                        Signed in as
                      </p>
                      <p className="font-semibold">
                        {user?.phone}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        router.push("/account");
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <Heart className="inline w-4 h-4 mr-2" />
                      My Account
                    </button>

                    <button
                      onClick={logout}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* CART */}
              <button
                onClick={() => setShowCart(true)}
                className="relative"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#8B1D3D] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORY NAV */}
        <nav className="bg-[#F7E9ED] border-t">
          <div className="container mx-auto px-4 py-2 flex justify-between">
            <div className="flex gap-6 overflow-x-auto">
              {categories.slice(0, 8).map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategoryClick(c.slug)}
                  className={`text-sm font-medium ${
                    activeCategory === c.slug
                      ? "text-[#8B1D3D] border-b-2 border-[#8B1D3D]"
                      : "text-gray-700 hover:text-[#8B1D3D]"
                  }`}
                >
                  {c.name}
                </button>
              ))}

              <button
                onClick={() => setShowCategoryMenu(true)}
                className="flex items-center gap-1 text-sm"
              >
                More <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-6 text-sm">
              <button
                onClick={() => router.push("/bath-powder-story")}
              >
                Bath Powder Story
              </button>
              <button
                onClick={() => router.push("/success-story")}
              >
                Success Story
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* CATEGORY MODAL */}
      {showCategoryMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full">
            <h3 className="font-semibold mb-4">All Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategoryClick(c.slug)}
                  className="text-left p-2 hover:bg-[#F7E9ED]"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Cart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      />
    </>
  );
}
