"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { CheckCircle, Package, Truck, ShoppingBag } from "lucide-react";

export default function OrderDetailsPage({ params }) {
  const { id } = params;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const res = await api.get(`/cart/get-my-orders/${id}`);
    setOrder(res.data.data);
  };

  if (!order) return null;

  const subtotal = order.items.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow">
          <div className="bg-indigo-600 text-white p-6">
            <h2 className="text-xl font-semibold">Order #{order.id}</h2>
            <p className="text-sm opacity-90">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="p-6">
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="text-left py-2">Item</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3">{item.product.name}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-center">₹{item.price}</td>
                    <td className="text-right font-medium">
                      ₹{item.quantity * item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>

              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- ₹{order.discount_amount}</span>
                </div>
              )}

              <div className="flex justify-between font-semibold text-base border-t pt-2">
                <span>Total</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">Order Status</h3>

          <div className="space-y-4">
            {["placed", "packed", "shipped", "delivered"].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    order.order_status === step
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <CheckCircle size={16} />
                </div>
                <p className="text-sm capitalize">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
