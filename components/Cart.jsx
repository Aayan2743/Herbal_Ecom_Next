// "use client";

// import { X, Minus, Plus, ShoppingBag } from "lucide-react";
// import { useCart } from "@/contexts/CartContext";
// import { useAuth } from "@/contexts/AuthContext";

// export default function Cart({ isOpen, onClose }) {
//   const { cart, updateQuantity, removeFromCart, getTotalItems, getTotalPrice } =
//     useCart();

//   const { isAuthenticated, openLogin } = useAuth();

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50">
//       {/* BACKDROP */}
//       <div className="absolute inset-0 bg-black/50" onClick={onClose} />

//       {/* CART */}
//       <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
//         <div className="flex flex-col h-full">
//           {/* HEADER */}
//           <div className="flex justify-between items-center p-4 border-b">
//             <h2 className="flex items-center gap-2 font-semibold">
//               <ShoppingBag className="w-5 h-5" />
//               My Cart ({getTotalItems()})
//             </h2>
//             <button onClick={onClose}>
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           {/* ITEMS */}
//           <div className="flex-1 overflow-y-auto p-4">
//             {cart.length === 0 ? (
//               <div className="text-center py-10 text-gray-500">
//                 Your cart is empty
//               </div>
//             ) : (
//               cart.map((item) => (
//                 <div
//                   key={`${item.id}-${item.variationId}`}
//                   className="flex gap-3 border rounded-lg p-3 mb-3"
//                 >
//                   <img
//                     src={item.image}
//                     className="w-16 h-16 rounded object-cover"
//                     alt={item.name}
//                   />

//                   <div className="flex-1">
//                     <p className="text-sm font-medium">{item.name}</p>
//                     <p className="font-semibold">₹{item.price}</p>
//                   </div>

//                   <div className="flex flex-col items-end gap-2">
//                     {/* QTY */}
//                     <div className="flex border rounded">
//                       <button
//                         onClick={() =>
//                           updateQuantity(
//                             item.id,
//                             item.variationId,
//                             item.quantity - 1,
//                           )
//                         }
//                         className="p-1"
//                       >
//                         <Minus className="w-3 h-3" />
//                       </button>

//                       <span className="px-2 text-sm">{item.quantity}</span>

//                       <button
//                         onClick={() =>
//                           updateQuantity(
//                             item.id,
//                             item.variationId,
//                             item.quantity + 1,
//                           )
//                         }
//                         className="p-1"
//                       >
//                         <Plus className="w-3 h-3" />
//                       </button>
//                     </div>

//                     {/* REMOVE */}
//                     <button
//                       onClick={() => removeFromCart(item.id, item.variationId)}
//                       className="text-xs text-red-600"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* FOOTER */}
//           {cart.length > 0 && (
//             <div className="border-t p-4">
//               <div className="flex justify-between mb-4">
//                 <span>Total</span>
//                 <span className="font-bold text-red-900">
//                   ₹{getTotalPrice()}
//                 </span>
//               </div>

//               {isAuthenticated ? (
//                 <button className="w-full bg-red-900 text-white py-3 rounded">
//                   Proceed to Pay
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => {
//                     onClose();
//                     openLogin();
//                   }}
//                   className="w-full bg-gray-400 text-white py-3 rounded"
//                 >
//                   Login First
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import CheckoutFlow from "./CheckoutFlow";

export default function Cart({ isOpen, onClose }) {
  const { cart, updateQuantity, removeFromCart, getTotalItems, getTotalPrice } =
    useCart();
  const { isAuthenticated, openLogin } = useAuth();

  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* CART OVERLAY */}
      <div className="fixed inset-0 z-50">
        {/* BACKDROP */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        {/* CART */}
        <div
          className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="flex items-center gap-2 font-semibold">
                <ShoppingBag className="w-5 h-5" />
                My Cart ({getTotalItems()})
              </h2>
              <button onClick={onClose}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ITEMS */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  Your cart is empty
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.id}-${item.variationId}`}
                    className="flex gap-3 border rounded-lg p-3 mb-3"
                  >
                    <img
                      src={item.image}
                      className="w-16 h-16 rounded object-cover"
                      alt={item.name}
                    />

                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="font-semibold">₹{item.price}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* QTY */}
                      <div className="flex border rounded">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.variationId,
                              item.quantity - 1,
                            )
                          }
                          className="p-1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span className="px-2 text-sm">{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.variationId,
                              item.quantity + 1,
                            )
                          }
                          className="p-1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          removeFromCart(item.id, item.variationId)
                        }
                        className="text-xs text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* FOOTER */}
            {cart.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between mb-4">
                  <span>Total</span>
                  <span className="font-bold text-red-900">
                    ₹{getTotalPrice()}
                  </span>
                </div>

                {isAuthenticated ? (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-red-900 text-white py-3 rounded"
                  >
                    Proceed to Pay
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      openLogin();
                    }}
                    className="w-full bg-gray-400 text-white py-3 rounded"
                  >
                    Login First
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CHECKOUT FLOW */}
      <CheckoutFlow
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </>
  );
}
