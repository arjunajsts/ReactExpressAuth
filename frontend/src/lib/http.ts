import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { queryClient } from "@/config/queryClient";
import { navigate } from "@/lib/navigation";
import { env } from "@/config/env";
import { useNotifications } from "@/components/ui/notifications";

interface ErrorResponse {
  message?: string;
  errorCode?: string;
}

// Extend AxiosRequestConfig to track retry attempts
interface CustomInternalAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const options: AxiosRequestConfig = {
  baseURL: env.API_URL,
  withCredentials: true,
};

// Queue mechanics for concurrent 401 requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: boolean = true) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Helper to extract response data
const handleResponse = <T>(response: AxiosResponse<T>): T => response.data;

// Token refresh client: Separate instance to avoid interceptor loops
const TokenRefreshClient: AxiosInstance = axios.create(options);
TokenRefreshClient.interceptors.response.use(handleResponse);

// Main API client
const fetch: AxiosInstance = axios.create(options);

fetch.interceptors.response.use(
  handleResponse,
  async (error: AxiosError<ErrorResponse>) => {
    const config = error.config as CustomInternalAxiosRequestConfig;

    if (!error.response || !config) {
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Handle unauthorized errors with token refresh logic
    if (status === 401 && data?.errorCode === "InvalidAccessToken") {
      // Prevent infinite loop if the retry attempt fails again with 401
      if (config._retry) {
        handleLogout();
        return Promise.reject({ status, ...(data || {}) });
      }

      if (isRefreshing) {
        // Queue the request until token refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => fetch(config))
          .catch((err) => Promise.reject(err));
      }

      config._retry = true;
      isRefreshing = true;

      try {
        // Refresh access token
        await TokenRefreshClient.get("/auth/refresh");
        processQueue(null, true);

        // Retry original request (returns the unpacked data due to handleResponse)
        return fetch(config);
      } catch (refreshError) {
        processQueue(refreshError as Error, false);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Push errors globally to UI notifications safely
    useNotifications.getState().addNotification({
      type: "error",
      title: data?.message || "Error occurred",
    });

    // Reject other errors with enriched data
    return Promise.reject({ status, ...(data || {}) });
  },
);

// Centralized logout routine
const handleLogout = () => {
  queryClient.clear();
  // Avoid window object crash during SSR (Next.js context compatibility)
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/";
  navigate("/auth/login", {
    state: { redirectUrl: currentPath },
  });
};

export default fetch;
