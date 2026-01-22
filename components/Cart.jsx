"use client";

import React from "react";
import { useEffect } from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

import CheckoutFlow from "./CheckoutFlow";

const Cart = ({ isOpen, onClose }) => {
  const [showCheckout, setShowCheckout] = React.useState(false);
  const { cart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } =
    useCart();
  const { isAuthenticated, openLogin } = useAuth();

  useEffect(() => {
    console.log("Cart Items:", cart);
  }, [cart]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Cart Sidebar */}
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                My Cart ({getTotalItems()})
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Start shopping to add items
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      // key={`${item.id}-${item.size}`}
                      key={`${item.id}-${item.variationId}`}
                      className="flex items-center space-x-3 border rounded-lg p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Size: {item.size}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{item.price}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border rounded">
                          {/* <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button> */}

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.variationId,
                                item.quantity - 1,
                              )
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => {
                              if (item.quantity >= item.stock) {
                                alert(
                                  `⚠️ Only ${item.stock} item(s) left in stock`,
                                );
                                return;
                              }

                              updateQuantity(
                                item.id,
                                item.variationId,
                                item.quantity + 1,
                              );
                            }}
                            className="p-1 hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-red-900">
                    ₹{getTotalPrice()}
                  </span>
                </div>

                {isAuthenticated ? (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-red-900 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors"
                  >
                    Proceed to Pay
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onClose();
                        openLogin();
                      }}
                      className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                    >
                      Login First
                    </button>
                    <p className="text-xs text-gray-500 text-center">
                      Please login to proceed with payment
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Flow */}
      <CheckoutFlow
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </>
  );
};

export default Cart;
