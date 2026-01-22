"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/cart/get-my-orders");
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = ["All", "Processing", "Delivered"];

  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((o) => o.order_status === activeTab.toLowerCase());

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">My Orders</h2>

      {/* TABS (OLD DESIGN) */}
      <div className="flex gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`h-9 px-4 rounded-full text-sm ${
              activeTab === tab ? "bg-gray-900 text-white" : "bg-white border"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ORDER CARDS (OLD DESIGN) */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const firstItem = order.items?.[0];
          const image =
            firstItem?.variant?.images?.[0]?.image_url || "/logo.webp";

          return (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow p-4 flex gap-4 items-center"
            >
              {/* PRODUCT IMAGE */}
              <img
                src={image}
                alt=""
                className="w-20 h-20 rounded object-cover"
              />

              {/* DETAILS */}
              <div className="flex-1">
                <p className="text-sm text-indigo-600">Order #{order.id}</p>
                <p className="font-medium text-sm">
                  {firstItem?.product?.name || "Order"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toDateString()}
                </p>
              </div>

              {/* PRICE + VIEW */}
              <div className="text-right">
                <p className="font-semibold">₹{order.total_amount}</p>
                <button
                  onClick={() =>
                    router.push(`/account/orders/details?id=${order.id}`)
                  }
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View
                </button>
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <p className="text-sm text-gray-500">No orders found</p>
        )}
      </div>
    </div>
  );
}
