import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import axios from "axios";
import { useNotifications } from "../components/ui/notifications";
import { env } from "../config/env";
import { globalQueryClient } from "@/lib/react-query";
import { appRouterInstance } from "@/app/router";

interface ApiErrorPayload {
  message?: string;
  errorCode?: string;
  error?: string;
}
interface CustomRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const fetchHttp: AxiosInstance = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const tokenRefreshClient: AxiosInstance = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

const unpackResponse = <T>(res: AxiosResponse<T>): T => res.data;
tokenRefreshClient.interceptors.response.use(unpackResponse);

fetchHttp.interceptors.response.use(
  unpackResponse,
  async (error: AxiosError<ApiErrorPayload>) => {
    const originalConfig = error.config as CustomRequestConfig;
    if (!error.response || !originalConfig) return Promise.reject(error);

    const { status, data } = error.response;

    if (status === 401 && data?.errorCode === "InvalidAccessToken") {
      if (originalConfig._retry) {
        executeGlobalLogout();
        return Promise.reject({ status, ...data });
      }
      originalConfig._retry = true;
      try {
        await tokenRefreshClient.get("/auth/refresh");
        return fetchHttp(originalConfig);
      } catch (refreshError) {
        executeGlobalLogout();
        return Promise.reject(refreshError);
      }
    }

    useNotifications.getState().addNotification({
      type: "error",
      title: data?.message || "Server Request Error",
      reason: data?.error || "",
    });

    return Promise.reject({ status, ...data });
  },
);

export const executeGlobalLogout = () => {
  globalQueryClient.clear();
  const fallbackPath =
    typeof window !== "undefined" ? window.location.pathname : "/";
  appRouterInstance.navigate(
    `/auth/login?redirectTo=${encodeURIComponent(fallbackPath)}`,
    { replace: true },
  );
};


export default fetchHttp
