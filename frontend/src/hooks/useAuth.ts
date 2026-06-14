import { getUser } from "@/lib/api";
import { UserResType } from "@/type";
import { useQuery } from "@tanstack/react-query";

export const AUTH = "auth";
 
interface ApiError {
  status: number;
  message?: string;
  error?: string;
}

export const useAuth = (forceRefresh = false) => {
  const { data: user, ...rest } = useQuery<UserResType, ApiError>({
    queryKey: [AUTH],
    queryFn: getUser,

    // 1. Keep cache data alive forever unless explicitly forced to clear
    staleTime: forceRefresh ? 0 : Infinity,
    refetchOnMount: forceRefresh,

    retry: false,

    retryOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    user,
    ...rest,
  };
};
