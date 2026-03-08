import { useSession } from '../lib/auth'
import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ children }) {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!session) {
    return <Navigate to="/" replace />
  }

  return children
}
