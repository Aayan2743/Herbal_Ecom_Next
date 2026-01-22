// "use client";

// import React, { useState } from "react";
// import { X, Phone, Lock } from "lucide-react";
// import { useAuth } from "@/contexts/AuthContext";
// import api from "@/lib/api";

// export default function LoginModal({ isOpen, onClose }) {
//   const { login } = useAuth();

//   const [mode, setMode] = useState("otp"); // "otp" | "password"
//   const [step, setStep] = useState(1); // OTP steps
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   /* ================= CLOSE ================= */
//   const handleClose = () => {
//     onClose();
//     setMode("otp");
//     setStep(1);
//     setPhone("");
//     setOtp("");
//     setPassword("");
//     setError("");
//     setName("");
//     setEmail("");
//   };

//   if (!isOpen) return null;

//   /* ================= SEND OTP ================= */
//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (phone.length !== 10) {
//       setError("Enter a valid 10-digit phone number");
//       return;
//     }

//     setLoading(true);
//     try {
//       await api.post("/auth/send-otp", {
//         phone: `91${phone}`,
//       });
//       setStep(2);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= VERIFY OTP ================= */
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (otp.length !== 6) {
//       setError("Enter a valid 6-digit OTP");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await api.post("/auth/verify-otp", {
//         phone: `91${phone}`,
//         otp,
//       });

//       login(res.data.token, res.data.user);
//       handleClose();
//     } catch (err) {
//       setError(err.response?.data?.message || "OTP verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= PASSWORD LOGIN ================= */
//   const handlePasswordLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (phone.length !== 10) {
//       setError("Enter a valid 10-digit phone number");
//       return;
//     }

//     if (!password) {
//       setError("Password is required");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await api.post("/auth/user-login", {
//         username: `91${phone}`,
//         password,
//       });

//       login(res.data.token, res.data.user);
//       handleClose();
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid credentials");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= REGISTER ================= */
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!name.trim()) {
//       setError("Name is required");
//       return;
//     }

//     if (!email.includes("@")) {
//       setError("Valid email is required");
//       return;
//     }

//     if (phone.length !== 10) {
//       setError("Enter a valid 10-digit phone number");
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await api.post("/auth/register", {
//         name,
//         email,
//         phone: `91${phone}`,
//         password,
//       });

//       // ✅ Auto login after register
//       login(res.data.token, res.data.user);
//       handleClose();
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black bg-opacity-50"
//         onClick={handleClose}
//       />

//       {/* Modal */}
//       <div className="relative bg-white rounded-lg w-full max-w-md mx-4 p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-bold text-gray-900">
//             {mode === "otp"
//               ? step === 1
//                 ? "Sign In"
//                 : "Verify OTP"
//               : "Sign In with Password"}
//           </h2>

//           <button
//             onClick={handleClose}
//             className="p-1 hover:bg-gray-100 rounded-full"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {error && (
//           <div className="mb-4 bg-red-100 text-red-700 p-3 rounded text-sm">
//             {error}
//           </div>
//         )}

//         {/* ================= OTP MODE ================= */}
//         {mode === "otp" && (
//           <>
//             {step === 1 ? (
//               <form onSubmit={handleSendOtp}>
//                 {/* Phone */}
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number
//                   </label>

//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Phone className="w-5 h-5 text-gray-400" />
//                     </div>

//                     <input
//                       type="tel"
//                       value={phone}
//                       onChange={(e) =>
//                         setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
//                       }
//                       placeholder="Enter 10-digit mobile number"
//                       className="w-full pl-12 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-900"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading || phone.length !== 10}
//                   className="w-full bg-red-900 text-white py-2 rounded-lg font-semibold hover:bg-red-800 disabled:bg-gray-400"
//                 >
//                   {loading ? "Sending OTP..." : "Send OTP"}
//                 </button>
//               </form>
//             ) : (
//               <form onSubmit={handleVerifyOtp}>
//                 <p className="text-sm text-gray-600 mb-4">
//                   We've sent a 6-digit OTP to +91 {phone}
//                 </p>

//                 <input
//                   type="text"
//                   value={otp}
//                   onChange={(e) =>
//                     setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
//                   }
//                   placeholder="Enter OTP"
//                   className="w-full px-3 py-2 border rounded-lg text-center text-lg tracking-widest focus:ring-2 focus:ring-red-900 mb-4"
//                   required
//                 />

//                 <button
//                   type="submit"
//                   disabled={loading || otp.length !== 6}
//                   className="w-full bg-red-900 text-white py-2 rounded-lg font-semibold hover:bg-red-800 disabled:bg-gray-400"
//                 >
//                   {loading ? "Verifying..." : "Verify & Continue"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => setStep(1)}
//                   className="w-full mt-2 text-sm text-red-900 hover:underline"
//                 >
//                   Change phone number
//                 </button>
//               </form>
//             )}
//           </>
//         )}

//         {/* ================= REGISTER MODE ================= */}
//         {mode === "register" && (
//           <form onSubmit={handleRegister}>
//             {/* Name */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-2">Name</label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg"
//                 placeholder="Enter your name"
//                 required
//               />
//             </div>

//             {/* Email */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-2">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg"
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>

//             {/* Phone */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-2">
//                 Phone Number
//               </label>
//               <input
//                 type="tel"
//                 value={phone}
//                 onChange={(e) =>
//                   setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
//                 }
//                 className="w-full px-3 py-2 border rounded-lg"
//                 placeholder="10-digit mobile number"
//                 required
//               />
//             </div>

//             {/* Password */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium mb-2">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg"
//                 placeholder="Create password"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-red-900 text-white py-2 rounded-lg font-semibold"
//             >
//               {loading ? "Creating Account..." : "Create Account"}
//             </button>
//           </form>
//         )}

//         {/* ================= PASSWORD MODE ================= */}
//         {mode === "password" && (
//           <form onSubmit={handlePasswordLogin}>
//             {/* Phone */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Phone Number
//               </label>

//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Phone className="w-5 h-5 text-gray-400" />
//                 </div>

//                 <input
//                   type="tel"
//                   value={phone}
//                   onChange={(e) =>
//                     setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
//                   }
//                   placeholder="Enter 10-digit mobile number"
//                   className="w-full pl-12 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-900"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>

//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="w-5 h-5 text-gray-400" />
//                 </div>

//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter password"
//                   className="w-full pl-12 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-900"
//                   required
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-red-900 text-white py-2 rounded-lg font-semibold hover:bg-red-800 disabled:bg-gray-400"
//             >
//               {loading ? "Signing In..." : "Sign In"}
//             </button>
//           </form>
//         )}

//         {/* ================= SWITCH LINK ================= */}
//         <p className="mt-4 text-sm text-center">
//           {mode === "otp" && (
//             <>
//               Prefer password?{" "}
//               <button
//                 type="button"
//                 onClick={() => setMode("password")}
//                 className="text-red-900 font-semibold hover:underline"
//               >
//                 Login with password
//               </button>
//             </>
//           )}

//           {mode === "password" && (
//             <>
//               New user?{" "}
//               <button
//                 type="button"
//                 onClick={() => setMode("register")}
//                 className="text-red-900 font-semibold hover:underline"
//               >
//                 Create account
//               </button>
//             </>
//           )}

//           {mode === "register" && (
//             <>
//               Already have an account?{" "}
//               <button
//                 type="button"
//                 onClick={() => setMode("password")}
//                 className="text-red-900 font-semibold hover:underline"
//               >
//                 Login
//               </button>
//             </>
//           )}
//         </p>

//         <p className="mt-4 text-xs text-gray-500 text-center">
//           By continuing, you agree to Sridevi Herbal & Co Terms & Privacy Policy
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { X, Phone, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

export default function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();

  const [mode, setMode] = useState("otp"); // otp | password | register
  const [step, setStep] = useState(1); // OTP steps
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= CLOSE ================= */
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

  /* ================= SEND OTP ================= */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (phone.length !== 10) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

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

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

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

  /* ================= PASSWORD LOGIN ================= */
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (phone.length !== 10 || !password) {
      setError("Phone & password required");
      return;
    }

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

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || phone.length !== 10 || password.length < 6) {
      setError("All fields are required (password min 6 chars)");
      return;
    }

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
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg w-full max-w-md mx-4 p-6">
        {/* ================= HEADER WITH NAVIGATION ================= */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {(mode !== "otp" || step === 2) && (
              <button
                onClick={() => {
                  if (mode === "otp" && step === 2) {
                    setStep(1);
                    setOtp("");
                  } else {
                    setMode("otp");
                    setStep(1);
                  }
                }}
                className="text-xl font-bold px-2 hover:bg-gray-100 rounded"
              >
                ←
              </button>
            )}

            <h2 className="text-xl font-bold">
              {mode === "otp"
                ? step === 1
                  ? "Login with OTP"
                  : "Verify OTP"
                : mode === "password"
                  ? "Login with Password"
                  : "Create Account"}
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded text-sm">
            {error}
          </div>
        )}

        {/* ================= OTP ================= */}
        {mode === "otp" && step === 1 && (
          <form onSubmit={handleSendOtp}>
            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="10-digit mobile number"
              className="w-full mb-4 px-3 py-2 border rounded-lg"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-900 text-white py-2 rounded-lg"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {mode === "otp" && step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter OTP"
              className="w-full mb-4 px-3 py-2 border rounded-lg text-center tracking-widest"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-900 text-white py-2 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>
        )}

        {/* ================= PASSWORD ================= */}
        {mode === "password" && (
          <form onSubmit={handlePasswordLogin}>
            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Phone"
              className="w-full mb-3 px-3 py-2 border rounded-lg"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full mb-4 px-3 py-2 border rounded-lg"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-900 text-white py-2 rounded-lg"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        )}

        {/* ================= REGISTER ================= */}
        {mode === "register" && (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full mb-3 px-3 py-2 border rounded-lg"
              required
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full mb-3 px-3 py-2 border rounded-lg"
              required
            />

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Phone"
              className="w-full mb-3 px-3 py-2 border rounded-lg"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full mb-4 px-3 py-2 border rounded-lg"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-900 text-white py-2 rounded-lg"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        {/* ================= FOOTER NAV ================= */}
        <div className="mt-4 text-center text-sm space-y-2">
          {mode === "otp" && step === 1 && (
            <>
              <button
                onClick={() => setMode("password")}
                className="text-red-900 font-semibold block"
              >
                Login with password
              </button>
              <button
                onClick={() => setMode("register")}
                className="text-red-900 font-semibold block"
              >
                Create new account
              </button>
            </>
          )}

          {mode === "password" && (
            <button
              onClick={() => setMode("register")}
              className="text-red-900 font-semibold"
            >
              New user? Create account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
