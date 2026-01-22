

// app/account/layout.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AccountLayout from "@/components/account/AccountLayout";

export default function AccountRootLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/"); // ⛔ block access to /account/*
    }
  }, [loading, isAuthenticated, router]);

  // ⏳ Show loader instead of blank screen
  if (loading) {
    return <div className="p-10 text-center">Checking your account…</div>;
  }

  // 🚫 Not authenticated → wait for redirect
  if (!isAuthenticated) {
    return null;
  }

  // ✅ Authenticated → render account UI
  return <AccountLayout>{children}</AccountLayout>;
}
