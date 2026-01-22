import AccountSidebar from "./AccountSidebar";

export default function AccountLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* SIDEBAR */}
        <AccountSidebar />

        {/* CONTENT */}
        <main className="md:col-span-3 bg-white rounded-xl shadow p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
