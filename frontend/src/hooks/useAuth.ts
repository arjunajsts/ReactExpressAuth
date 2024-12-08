import { getUser } from "@/lib/api";
import { UserResType } from "@/type";
import { useQuery } from "@tanstack/react-query";
export const AUTH = "auth";
export const useAuth = () => {
  const { data: user, ...rest } = useQuery<UserResType, unknown>({
    queryKey: [AUTH],
    queryFn: getUser,
    staleTime: Infinity,
  });

  return {
    user,
    ...rest,
  };
};
