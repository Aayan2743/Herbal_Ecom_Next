"use client";

import { useRouter } from "next/navigation";

const wishlist = [
  {
    id: 1,
    name: "Herbal Hair Pack Powder",
    price: 699,
    image: "/logo.webp",
  },
  {
    id: 2,
    name: "Chandamama Bath Powder",
    price: 499,
    image: "/logo.webp",
  },
];

export default function WishlistPage() {
  const router = useRouter();

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">My Wishlist</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border p-5 flex gap-5 items-center transition hover:shadow-md"
          >
            {/* IMAGE */}
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 rounded-xl object-cover bg-gray-50"
            />

            {/* DETAILS */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm md:text-base truncate">
                {item.name}
              </p>

              <p className="font-semibold text-lg mt-1">
                ₹{item.price}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-4 mt-4 text-sm">
                <button
                  onClick={() => router.push("/product")}
                  className="text-indigo-600 hover:underline"
                >
                  View
                </button>

                <button className="text-red-500 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
