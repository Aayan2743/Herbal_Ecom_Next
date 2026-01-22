// export default function AccountPage() {
//   return (
//     <>
//       <h2 className="text-xl font-semibold mb-6">
//         My Account
//       </h2>

//       {/* PROFILE CARD */}
//       <div className="bg-white border rounded-2xl p-5 mb-6">
//         <div className="flex items-center gap-5">
//           <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xl">
//             SA
//           </div>

//           <div>
//             <p className="font-medium text-lg">Sk Asif</p>
//             <p className="text-sm text-gray-600">
//               asif@email.com
//             </p>
//             <p className="text-sm text-gray-600">
//               +91 9XXXXXXXXX
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* QUICK STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="border rounded-xl p-4">
//           <p className="text-sm text-gray-500">Total Orders</p>
//           <p className="text-2xl font-semibold mt-1">12</p>
//         </div>

//         <div className="border rounded-xl p-4">
//           <p className="text-sm text-gray-500">Wishlist Items</p>
//           <p className="text-2xl font-semibold mt-1">5</p>
//         </div>

//         <div className="border rounded-xl p-4">
//           <p className="text-sm text-gray-500">Member Since</p>
//           <p className="text-2xl font-semibold mt-1">
//             Sep 2025
//           </p>
//         </div>
//       </div>

//       {/* QUICK ACTIONS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="border rounded-xl p-5 hover:shadow-sm transition">
//           <p className="font-medium mb-2">Manage Orders</p>
//           <p className="text-sm text-gray-600 mb-4">
//             View and track your orders
//           </p>
//           <a
//             href="/account/orders"
//             className="text-indigo-600 text-sm hover:underline"
//           >
//             Go to Orders →
//           </a>
//         </div>

//         <div className="border rounded-xl p-5 hover:shadow-sm transition">
//           <p className="font-medium mb-2">Wishlist</p>
//           <p className="text-sm text-gray-600 mb-4">
//             Products you saved for later
//           </p>
//           <a
//             href="/account/wishlist"
//             className="text-indigo-600 text-sm hover:underline"
//           >
//             View Wishlist →
//           </a>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function AccountPage() {
  const { user } = useAuth();

  if (!user) return null; // already protected by layout

  // Initials for avatar
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">My Account</h2>

      {/* PROFILE CARD */}
      <div className="bg-white border rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xl">
            {initials}
          </div>

          <div>
            <p className="font-medium text-lg">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-600">{user.phone || "—"}</p>
          </div>
        </div>
      </div>

      {/* QUICK STATS (placeholder / optional API) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-semibold mt-1">{user.totalOrders ?? 0}</p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-sm text-gray-500">Wishlist Items</p>
          <p className="text-2xl font-semibold mt-1">
            {user.wishlistCount ?? 0}
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-sm text-gray-500">Member Since</p>
          <p className="text-2xl font-semibold mt-1">
            {user.created_at
              ? new Date(user.created_at).toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-xl p-5 hover:shadow-sm transition">
          <p className="font-medium mb-2">Manage Orders</p>
          <p className="text-sm text-gray-600 mb-4">
            View and track your orders
          </p>
          <a
            href="/account/orders"
            className="text-indigo-600 text-sm hover:underline"
          >
            Go to Orders →
          </a>
        </div>

        <div className="border rounded-xl p-5 hover:shadow-sm transition">
          <p className="font-medium mb-2">Wishlist</p>
          <p className="text-sm text-gray-600 mb-4">
            Products you saved for later
          </p>
          <a
            href="/account/wishlist"
            className="text-indigo-600 text-sm hover:underline"
          >
            View Wishlist →
          </a>
        </div>
      </div>
    </>
  );
}
