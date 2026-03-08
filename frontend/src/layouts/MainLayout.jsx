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
        <h1 className="text-xl font-bold text-nus-blue">NUS Marketplace</h1>

        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Welcome, {session.user.name} ({session.user.email})
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="rounded-md bg-nus-blue px-4 py-2 text-sm font-semibold text-white hover:bg-nus-blue-hover"
            >
              Log in
            </button>
          </div>
        )}
      </header>

      <main className="w-full">{children}</main>
    </div>
  )
}
