import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const { user, isLoading } = useAuth();
  console.log(user)
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={`/auth/login?redirectTo=${encodeURIComponent(location.pathname)}`}
        replace 
      />
    );
  }

  return children ? children : <Outlet />;
};
