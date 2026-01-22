"use client";

import { usePathname, useRouter } from "next/navigation";

const menu = [
  { label: "My Account", path: "/account" },
  { label: "Edit Profile", path: "/account/profile" },
  { label: "My Orders", path: "/account/orders" },
  { label: "My Wishlist", path: "/account/wishlist" },
  { label: "Become Affiliate", path: "/account/affiliate" },
  { label: "Change Password", path: "/account/change-password" },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // 🔴 replace later with real auth cleanup
    localStorage.removeItem("token"); // if using token
    router.push("/");
  };

  return (
    <aside className="bg-white rounded-2xl shadow-sm p-5">
      <h3 className="text-lg font-semibold mb-5">Account</h3>

      <div className="space-y-2">
        {menu.map((item) => {
          const active = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full h-11 px-4 rounded-lg text-sm flex items-center justify-between transition-all
                ${
                  active
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <span>{item.label}</span>
              {active && (
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
              )}
            </button>
          );
        })}

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full h-11 px-4 rounded-lg text-sm flex items-center justify-between
                     text-red-600 hover:bg-red-50 transition-all mt-4"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
