"use client";

export default function AffiliatePage() {
  return (
    <>
      <h2 className="text-xl font-semibold mb-6">
        Become an Affiliate
      </h2>

      <div className="space-y-4 max-w-xl">
        <p className="text-gray-700">
          Join our affiliate program and earn commission by
          promoting Sridevi Herbal products.
        </p>

        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Earn commission on every successful referral</li>
          <li>Monthly payouts</li>
          <li>Dedicated affiliate dashboard</li>
        </ul>

        <div className="border rounded-xl p-4 bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">
            Affiliate Status
          </p>
          <p className="font-medium text-gray-900">
            Not Registered
          </p>
        </div>

        <button className="h-11 px-6 bg-indigo-600 text-white rounded-lg text-sm">
          Apply for Affiliate
        </button>
      </div>
    </>
  );
}
