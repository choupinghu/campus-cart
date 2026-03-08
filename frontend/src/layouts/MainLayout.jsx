import { XCircle } from 'lucide-react'

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="flex items-center justify-between px-8 py-4 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <XCircle className="w-8 h-8 text-[#003b73] fill-[#003b73] text-white" />
          <h1 className="text-2xl font-bold text-[#003b73] tracking-tight">CampusCart</h1>
        </div>
        <button className="bg-[#003b73] hover:bg-[#002f5c] text-white px-6 py-2 rounded-full font-medium transition-colors">
          Sign In
        </button>
      </header>

      <main className="w-full">{children}</main>
    </div>
  )
}
