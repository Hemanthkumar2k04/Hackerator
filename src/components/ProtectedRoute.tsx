import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LoadingAnimation } from './LoadingAnimation'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingAnimation fullScreen size="lg" />
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
