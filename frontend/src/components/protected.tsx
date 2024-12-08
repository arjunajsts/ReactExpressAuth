import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const { user, isLoading } = useAuth()

  return isLoading ?
    <div className="h-screen w-screen  flex items-center justify-center">
      <Spinner size="xl" />
    </div>
    :
    user ? children :
      <Navigate
        to={`/auth/login?redirectTo=${encodeURIComponent(location.pathname)}`}
        replace
      />

};
