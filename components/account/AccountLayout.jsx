import AccountSidebar from "./AccountSidebar";

export default function AccountLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto flex gap-6">

        {/* Sidebar – fixed width */}
        <div className="w-64 flex-shrink-0">
          <AccountSidebar />
        </div>

        {/* Content – takes remaining space */}
        <div className="flex-1 bg-white rounded-xl shadow p-6">
          {children}
        </div>

      </div>
    </div>
  );
}
