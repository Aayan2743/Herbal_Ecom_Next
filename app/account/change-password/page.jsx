// "use client";

// import { useState } from "react";

// export default function ChangePasswordPage() {
//   const [form, setForm] = useState({
//     current: "",
//     newPassword: "",
//     confirm: "",
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (form.newPassword !== form.confirm) {
//       alert("Passwords do not match");
//       return;
//     }

//     // 🔴 Replace with API call
//     console.log("Password Updated", form);
//     alert("Password updated successfully");
//   };

//   return (
//     <>
//       <h2 className="text-xl font-semibold mb-6">
//         Change Password
//       </h2>

//       <form
//         onSubmit={handleSubmit}
//         className="max-w-md space-y-4"
//       >
//         <div>
//           <label className="text-sm text-gray-600">
//             Current Password
//           </label>
//           <input
//             type="password"
//             className="w-full h-11 border rounded-lg px-3 mt-1"
//             onChange={(e) =>
//               setForm({ ...form, current: e.target.value })
//             }
//             required
//           />
//         </div>

//         <div>
//           <label className="text-sm text-gray-600">
//             New Password
//           </label>
//           <input
//             type="password"
//             className="w-full h-11 border rounded-lg px-3 mt-1"
//             onChange={(e) =>
//               setForm({ ...form, newPassword: e.target.value })
//             }
//             required
//           />
//         </div>

//         <div>
//           <label className="text-sm text-gray-600">
//             Confirm New Password
//           </label>
//           <input
//             type="password"
//             className="w-full h-11 border rounded-lg px-3 mt-1"
//             onChange={(e) =>
//               setForm({ ...form, confirm: e.target.value })
//             }
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="h-11 px-6 bg-indigo-600 text-white rounded-lg text-sm"
//         >
//           Update Password
//         </button>
//       </form>
//     </>
//   );
// }

"use client";

import { useState } from "react";
import api from "@/lib/api"; // your existing axios instance

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/profile/change-password", {
        current_password: form.current,
        new_password: form.newPassword,
        confirm_new_password: form.confirm,
      });

      alert(res.data.message || "Password updated successfully");

      // reset form
      setForm({
        current: "",
        newPassword: "",
        confirm: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Change Password</h2>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="text-sm text-gray-600">Current Password</label>
          <input
            type="password"
            className="w-full h-11 border rounded-lg px-3 mt-1"
            value={form.current}
            onChange={(e) => setForm({ ...form, current: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">New Password</label>
          <input
            type="password"
            className="w-full h-11 border rounded-lg px-3 mt-1"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Confirm New Password</label>
          <input
            type="password"
            className="w-full h-11 border rounded-lg px-3 mt-1"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-11 px-6 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </>
  );
}
