import { useSession, signOut } from '../lib/auth'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { graphqlRequest } from '../services/graphqlClient'
import {
  Plus,
  ChevronDown,
  Package,
  ShoppingBag,
  User,
  LogOut,
  LayoutDashboard,
} from 'lucide-react'

const GET_ME_NAV = `
  query GetMeNav {
    me {
      name
      email
    }
  }
`

export default function MainLayout({ children }) {
  const { data: session } = useSession()
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [postMenuOpen, setPostMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (session?.user) {
      const fetchFreshData = async () => {
        try {
          const data = await graphqlRequest(GET_ME_NAV)
          if (data?.me) {
            setUserName(data.me.name)
          }
        } catch (err) {
          console.error('Failed to fetch nav user data:', err)
        }
      }
      fetchFreshData()
    }
  }, [session?.user])

  const displayName = userName || session?.user?.name || ''

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setPostMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate('/')
        },
      },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="flex justify-between items-center border-b border-gray-200 bg-white px-8 py-4 sticky top-0 z-50">
        <h1
          onClick={() => navigate('/')}
          className="text-2xl font-black text-nus-blue cursor-pointer tracking-tight"
        >
          NUS<span className="text-nus-orange">Market</span>
        </h1>

        {session ? (
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-400 hidden md:block">{displayName}</span>

            {/* Post Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setPostMenuOpen(!postMenuOpen)}
                className="btn-primary flex items-center gap-1.5 px-3 py-2"
                title="Create New"
              >
                <Plus className="w-5 h-5" />
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${postMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {postMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => {
                      navigate('/create-listing')
                      setPostMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Package className="w-4 h-4 text-nus-blue" />
                    Sell Items
                  </button>
                  <button
                    onClick={() => {
                      navigate('/create-request')
                      setPostMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-nus-orange" />
                    Buy Items
                  </button>
                </div>
              )}
            </div>

            <nav className="flex items-center gap-2">
              <button
                onClick={() => navigate('/my-listings')}
                className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-nus-blue focus:ring-offset-2 transition"
                title="My Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-nus-blue focus:ring-offset-2 transition"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-nus-blue focus:ring-offset-2 transition"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </nav>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="btn-primary">
              Log in
            </button>
          </div>
        )}
      </header>

      <main className="w-full">{children}</main>
    </div>
  )
}
