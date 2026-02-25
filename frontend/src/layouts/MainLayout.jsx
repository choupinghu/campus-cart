export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-indigo-600">NUS Marketplace</h1>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>

      <footer className="border-t border-gray-200 bg-white px-6 py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} NUS Campus Marketplace
      </footer>
    </div>
  )
}
