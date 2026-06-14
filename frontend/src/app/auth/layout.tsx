import { useAuthFlag } from "@/hooks/useAuthFlag";
import React from "react";
import { Navigate } from "react-router";

interface Props {
  children: React.ReactNode;
}

export const GuestLayout = ({ children }: Props) => {
  const { isAuthenticated } = useAuthFlag()

  // if (isLoading) {
  //   return (
  //     <div className="h-screen w-screen flex items-center justify-center">
  //       <Spinner size="xl" />
  //     </div>
  //   );
  // }


  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-slate-100">
      {children}
    </div>
  );
};