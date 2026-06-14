import { useEffect } from "react"; // 1. Import useEffect
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { useAuthFlag } from "@/hooks/useAuthFlag";
import { Outlet, useLocation, useNavigate } from "react-router-dom"; 

export const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuthFlag();
  const forceRefresh = !!isAuthenticated;
  const { user, isLoading } = useAuth(forceRefresh);

  // 2. Trigger the navigation hook safely inside a side-effect block
  useEffect(() => {
    if (!isLoading && !user) {
      navigate(`/auth/login?redirectTo=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [user, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  // 3. Prevent rendering the children components while waiting for the useEffect redirect to run
  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return children ? children : <Outlet />;
};
