"use client";

import React, { useEffect, useState } from "react";
import { Check, CreditCard, MapPin, Package, ArrowLeft, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

const CheckoutFlow = ({ isOpen, onClose }) => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(getTotalPrice());
  const [couponError, setCouponError] = useState("");

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  /* ================= FETCH ADDRESSES ================= */

  useEffect(() => {
    if (isOpen && user) {
      fetchAddresses();
    }
  }, [isOpen, user]);

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await api.get("/cart/get-address");
      const list = res.data.data || [];
      setAddresses(list);

      if (list.length > 0) {
        setSelectedAddress(list[0].id); // auto select
      }
    } catch (err) {
      console.error("Address fetch failed", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;

    try {
      setCouponLoading(true);
      setCouponError("");

      const res = await api.post("/cart/apply-coupon", {
        code: couponCode,
        amount: getTotalPrice(),
      });

      if (res.data.success) {
        setDiscount(res.data.discount);
        setFinalAmount(res.data.finalAmount);
      }
    } catch (err) {
      setDiscount(0);
      setFinalAmount(getTotalPrice());
      setCouponError(err.response?.data?.message || "Invalid coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setFinalAmount(getTotalPrice());
    setCouponError("");
  };

  const handleRazorpayPayment = async () => {
    const resScript = await loadRazorpayScript();
    if (!resScript) {
      alert("Razorpay SDK failed");
      return;
    }

    // 1️⃣ Create order
    const orderRes = await api.post("/cart/create-order", {
      // amount: getTotalPrice(),
      amount: finalAmount,
    });

    const { order } = orderRes.data;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Sridevi Herbal & Co",
      description: "Order Payment",
      order_id: order.id,

      // handler: async function (response) {
      //   // 2️⃣ Verify payment
      //   const verifyRes = await api.post("/cart/verify-payment", response);

      //   if (verifyRes.data.success) {
      //     alert("Payment successful 🎉");
      //     clearCart();
      //     onClose();
      //   } else {
      //     alert("Payment verification failed");
      //   }
      // },

      handler: async function (response) {
        try {
          // 1️⃣ Verify payment
          const verifyRes = await api.post("/cart/verify-payment", response);

          if (!verifyRes.data.success) {
            alert("Payment verification failed");
            return;
          }

          // 2️⃣ SAVE ORDER IN DB

          const orderRes = await api.post("/cart/save-order", {
            address_id: selectedAddress,
            items: cart.map((item) => ({
              product_id: item.id,
              variation_id: item.variationId,
              quantity: item.quantity,
              price: item.price,
            })),
            coupon_code: couponCode || null,
            discount,
            subtotal: getTotalPrice(),
            total_amount: finalAmount,
            payment_method: "razorpay",
            payment_id: response.razorpay_payment_id,
          });

          // 3️⃣ CONSOLE ORDER ✅
          console.log("ORDER CREATED:", orderRes.data);

          alert("Payment successful 🎉");

          // 4️⃣ CLEANUP
          clearCart();
          setCouponCode("");
          setDiscount(0);
          setFinalAmount(getTotalPrice());

          onClose();
        } catch (err) {
          console.error("ORDER CREATION FAILED:", err);
          alert("Order creation failed");
        }
      },

      prefill: {
        name: user?.name,
        contact: user?.phone,
      },

      theme: {
        color: "#7f1d1d",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  /* ================= AUTO OPEN ADDRESS FORM ================= */

  useEffect(() => {
    if (isOpen && addresses.length === 0 && !loadingAddresses) {
      setShowAddressForm(true);
    }
  }, [isOpen, addresses, loadingAddresses]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchOnOpen = async () => {
      try {
        setLoadingAddresses(true);

        const res = await api.get("/cart/get-address");
        const list = res.data.data || [];

        setAddresses(list);

        if (list.length > 0) {
          setSelectedAddress(list[0].id); // auto select
          setShowAddressForm(false);
        } else {
          setShowAddressForm(true); // force add
        }

        setCurrentStep(1);
      } catch (err) {
        console.error("Fetch address on checkout open failed", err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchOnOpen();
  }, [isOpen]);

  /* ================= PINCODE LOOKUP ================= */

  const handlePincodeChange = async (pin) => {
    setAddressForm((prev) => ({ ...prev, pincode: pin }));

    if (pin.length !== 6) return;

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      if (data[0]?.Status === "Success") {
        const po = data[0].PostOffice[0];
        setAddressForm((prev) => ({
          ...prev,
          city: po.District,
          state: po.State,
          country: po.Country,
        }));
      }
    } catch (err) {
      console.error("Pincode error");
    }
  };

  /* ================= SAVE ADDRESS ================= */

  const handleSaveAddress = async () => {
    const { name, phone, address, pincode } = addressForm;
    if (!name || !phone || !address || !pincode) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await api.post("/cart/add-address", addressForm);
      const newAddress = res.data.data;

      setAddresses((prev) => [newAddress, ...prev]);
      setSelectedAddress(newAddress.id);
      setShowAddressForm(false);
    } catch (err) {
      alert("Failed to save address");
    }
  };

  /* ================= PLACE ORDER ================= */

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
    clearCart();
    setCurrentStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center p-5 bg-red-900 text-white">
          <h2 className="text-lg font-semibold">Checkout</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* STEP 1: ADDRESS */}
          {currentStep === 1 && (
            <>
              <button
                onClick={() => setShowAddressForm(true)}
                className="w-full border border-dashed border-red-900 text-red-900 py-3 rounded mb-4 font-medium"
              >
                + Add New Address
              </button>

              {loadingAddresses && <p>Loading addresses...</p>}

              {!loadingAddresses && addresses.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                  <p>No address found</p>
                  <p className="text-xs">Please add a delivery address</p>
                </div>
              )}

              {addresses.map((a) => (
                <div
                  key={a.id}
                  onClick={() => setSelectedAddress(a.id)}
                  className={`border p-4 rounded mb-3 cursor-pointer ${
                    selectedAddress === a.id ? "border-red-900 bg-red-50" : ""
                  }`}
                >
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-sm">{a.phone}</p>
                  <p className="text-sm">
                    {a.address}, {a.city}, {a.state} - {a.pincode}
                  </p>
                </div>
              ))}
            </>
          )}

          {/* STEP 2: PAYMENT */}
          {currentStep === 2 && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "cod", name: "Cash on Delivery", icon: "💰" },
                { id: "upi", name: "UPI Payment", icon: "📱" },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedPaymentMethod(m.id)}
                  className={`border p-4 rounded cursor-pointer ${
                    selectedPaymentMethod === m.id
                      ? "border-red-900 bg-red-50"
                      : ""
                  }`}
                >
                  <div className="text-xl">{m.icon}</div>
                  <p className="font-semibold">{m.name}</p>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: CONFIRM */}
          {currentStep === 3 && (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border p-3 rounded mb-3"
                >
                  <img
                    src={item.image}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm">Qty: {item.quantity}</p>
                    <p className="font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon Discount</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{finalAmount}</span>
                </div>
              </div>

              {/* COUPON SECTION */}
              <div className="border rounded-lg p-4 mt-4 space-y-2">
                <p className="font-medium text-sm">Apply Coupon</p>

                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    placeholder="Enter coupon code"
                    className="flex-1 border rounded px-3 py-2 text-sm"
                    disabled={discount > 0}
                  />

                  {discount > 0 ? (
                    <button
                      onClick={handleRemoveCoupon}
                      className="px-4 py-2 text-sm bg-gray-200 rounded"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="px-4 py-2 text-sm bg-red-900 text-white rounded"
                    >
                      {couponLoading ? "Applying..." : "Apply"}
                    </button>
                  )}
                </div>

                {couponError && (
                  <p className="text-xs text-red-600">{couponError}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t p-5 flex justify-between items-center">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center gap-1 text-sm"
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              disabled={currentStep === 1 && addresses.length === 0}
              onClick={() => {
                if (currentStep === 2 && !selectedPaymentMethod) {
                  alert("Select payment method");
                  return;
                }
                setCurrentStep(currentStep + 1);
              }}
              className={`px-6 py-2 rounded ${
                currentStep === 1 && addresses.length === 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-red-900 text-white"
              }`}
            >
              Next
            </button>
          ) : (
            <button
              // onClick={handlePlaceOrder}
              onClick={handleRazorpayPayment}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              Place Order
            </button>
          )}
        </div>
      </div>

      {/* ADD ADDRESS MODAL */}
      {showAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3">Add Address</h3>

            <div className="space-y-2 text-sm">
              <input
                placeholder="Full Name"
                className="w-full px-3 py-2 border rounded"
                onChange={(e) =>
                  setAddressForm({ ...addressForm, name: e.target.value })
                }
              />
              <input
                placeholder="Mobile Number"
                maxLength={10}
                className="w-full px-3 py-2 border rounded"
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
              <textarea
                placeholder="House No, Street, Area"
                rows={2}
                className="w-full px-3 py-2 border rounded"
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    address: e.target.value,
                  })
                }
              />
              <input
                placeholder="Pincode"
                maxLength={6}
                className="w-full px-3 py-2 border rounded"
                onChange={(e) => handlePincodeChange(e.target.value)}
              />
              <input
                value={addressForm.city}
                readOnly
                className="w-full px-3 py-2 bg-gray-100 border rounded"
              />
              <input
                value={addressForm.state}
                readOnly
                className="w-full px-3 py-2 bg-gray-100 border rounded"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddressForm(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="px-4 py-2 bg-red-900 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutFlow;
