import { useEffect, useState } from "react";


const AUTH_FLAG = "isAuthenticated";

export const useAuthFlag = ()=>{
    const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem(AUTH_FLAG) === "true"
  );

    useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(
        localStorage.getItem(AUTH_FLAG) === "true"
      );
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

   const login = () => {
    localStorage.setItem(AUTH_FLAG, "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_FLAG);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    login,
    logout,
  };

}