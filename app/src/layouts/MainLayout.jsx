import { useSession, signOut } from '../lib/auth'
import { useNavigate } from 'react-router-dom'

export default function MainLayout({ children }) {
  const { data: session } = useSession()
  const navigate = useNavigate()

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
      <header className="flex justify-between border-b border-gray-200 bg-white px-6 py-4">
        <h1
          onClick={() => navigate('/')}
          className="text-xl font-bold text-nus-blue cursor-pointer"
        >
          NUS Marketplace
        </h1>

        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Welcome, {session.user.name} ({session.user.email})
            </span>
            <button onClick={() => navigate('/create-listing')} className="btn-primary btn-sm">
              Sell an Item
            </button>
            <button onClick={() => navigate('/my-listings')} className="btn-secondary btn-sm">
              My Listings
            </button>
            <button onClick={handleLogout} className="btn-outline btn-sm">
              Sign out
            </button>
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
