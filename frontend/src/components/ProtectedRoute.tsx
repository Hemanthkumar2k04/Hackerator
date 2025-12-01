import { authClient } from "@/lib/auth-client";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error || !session) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
