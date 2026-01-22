"use client";

import { useState } from "react";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    // 🔴 Replace with API call
    console.log("Password Updated", form);
    alert("Password updated successfully");
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">
        Change Password
      </h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-4"
      >
        <div>
          <label className="text-sm text-gray-600">
            Current Password
          </label>
          <input
            type="password"
            className="w-full h-11 border rounded-lg px-3 mt-1"
            onChange={(e) =>
              setForm({ ...form, current: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">
            New Password
          </label>
          <input
            type="password"
            className="w-full h-11 border rounded-lg px-3 mt-1"
            onChange={(e) =>
              setForm({ ...form, newPassword: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">
            Confirm New Password
          </label>
          <input
            type="password"
            className="w-full h-11 border rounded-lg px-3 mt-1"
            onChange={(e) =>
              setForm({ ...form, confirm: e.target.value })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="h-11 px-6 bg-indigo-600 text-white rounded-lg text-sm"
        >
          Update Password
        </button>
      </form>
    </>
  );
}
