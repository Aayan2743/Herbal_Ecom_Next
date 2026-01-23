"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

export default function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();

  const [mode, setMode] = useState("otp"); // otp | password | register
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    onClose();
    setMode("otp");
    setStep(1);
    setPhone("");
    setOtp("");
    setPassword("");
    setName("");
    setEmail("");
    setError("");
  };

  if (!isOpen) return null;

  /* ================= API HANDLERS ================= */

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (phone.length !== 10)
      return setError("Enter valid 10-digit mobile number");

    setLoading(true);
    try {
      await api.post("/auth/send-otp", { phone: `91${phone}` });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) return setError("Invalid OTP");

    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", {
        phone: `91${phone}`,
        otp,
      });
      login(res.data.token, res.data.user);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!password || phone.length !== 10)
      return setError("Phone & password required");

    setLoading(true);
    try {
      const res = await api.post("/auth/user-login", {
        username: `91${phone}`,
        password,
      });
      login(res.data.token, res.data.user);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || password.length < 6 || phone.length !== 10)
      return setError("Fill all fields correctly");

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        phone: `91${phone}`,
        password,
      });
      login(res.data.token, res.data.user);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 rounded-3xl bg-white p-8 shadow-2xl animate-fadeIn">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "otp"
              ? step === 1
                ? "Welcome Back"
                : "Verify OTP"
              : mode === "password"
                ? "Sign In"
                : "Create Account"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {mode === "otp" && step === 1 && "Login quickly using OTP"}
            {mode === "otp" &&
              step === 2 &&
              "Enter the OTP sent to your mobile"}
            {mode === "password" && "Use your password to continue"}
            {mode === "register" && "Create an account to get started"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* OTP STEP 1 */}
        {mode === "otp" && step === 1 && (
          <form onSubmit={handleSendOtp}>
            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Mobile number"
              className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-base
                         focus:border-red-700 focus:ring-2 focus:ring-red-100 outline-none"
            />

            <PrimaryButton loading={loading} text="Send OTP" />

            <Divider />

            <SecondaryActions setMode={setMode} />
          </form>
        )}

        {/* OTP STEP 2 */}
        {mode === "otp" && step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter OTP"
              className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-center tracking-widest
                         focus:border-red-700 focus:ring-2 focus:ring-red-100 outline-none"
            />
            <PrimaryButton loading={loading} text="Verify & Login" />
          </form>
        )}

        {/* PASSWORD LOGIN */}
        {mode === "password" && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <Input
              placeholder="Mobile number"
              value={phone}
              setValue={setPhone}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              setValue={setPassword}
            />
            <PrimaryButton loading={loading} text="Sign In" />

            <button
              type="button"
              onClick={() => setMode("register")}
              className="w-full text-sm font-semibold text-red-900 hover:underline"
            >
              New user? Create account
            </button>
          </form>
        )}

        {/* REGISTER */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <Input placeholder="Name" value={name} setValue={setName} />
            <Input placeholder="Email" value={email} setValue={setEmail} />
            <Input
              placeholder="Mobile number"
              value={phone}
              setValue={setPhone}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              setValue={setPassword}
            />
            <PrimaryButton loading={loading} text="Create Account" />
          </form>
        )}
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const PrimaryButton = ({ text, loading }) => (
  <button
    disabled={loading}
    className="w-full mt-6 rounded-2xl bg-gradient-to-r from-red-900 to-red-700
               py-4 text-white text-base font-semibold hover:opacity-90
               transition disabled:opacity-60"
  >
    {loading ? "Please wait..." : text}
  </button>
);

const Divider = () => (
  <div className="my-7 flex items-center gap-3">
    <div className="h-px flex-1 bg-gray-200" />
    <span className="text-xs text-gray-400 uppercase tracking-wide">or</span>
    <div className="h-px flex-1 bg-gray-200" />
  </div>
);

const SecondaryActions = ({ setMode }) => (
  <div className="space-y-3">
    <button
      type="button"
      onClick={() => setMode("password")}
      className="w-full rounded-2xl border border-gray-200 bg-white py-4
                 font-medium text-gray-800 hover:border-red-700 hover:shadow-sm transition"
    >
      Login with Password
    </button>

    <button
      type="button"
      onClick={() => setMode("register")}
      className="w-full rounded-2xl border border-gray-200 bg-white py-4
                 font-semibold text-red-900 hover:bg-red-50 transition"
    >
      Create New Account
    </button>
  </div>
);

const Input = ({ placeholder, value, setValue, type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={(e) =>
      setValue(
        type === "tel"
          ? e.target.value.replace(/\D/g, "").slice(0, 10)
          : e.target.value,
      )
    }
    placeholder={placeholder}
    className="w-full rounded-2xl border border-gray-200 px-5 py-4
               focus:border-red-700 focus:ring-2 focus:ring-red-100 outline-none"
  />
);
