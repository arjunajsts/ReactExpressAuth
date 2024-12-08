import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import {queryClient} from "@/config/queryClient";
import { navigate } from "@/lib/navigation";
import { env } from "@/config/env";
import { useNotifications } from "@/components/ui/notifications";

interface ErrorResponse {
  message?: string;
  errorCode?: string;
}
const options: AxiosRequestConfig = {
  baseURL: env.API_URL,
  withCredentials: true,
};

// Helper to extract response data
const handleResponse = <T>(response: AxiosResponse<T>): T => response.data;

// Token refresh client: Separate instance to avoid interception loops
const TokenRefreshClient: AxiosInstance = axios.create(options);

TokenRefreshClient.interceptors.response.use(handleResponse);

// Main API client
const fetch: AxiosInstance = axios.create(options);

fetch.interceptors.response.use(
  handleResponse,
  async (error: AxiosError<ErrorResponse>) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    useNotifications.getState().addNotification({
      type: "error",
      title: error.response.data.message || "Error"
    });
    // Access the notification store directly if using Zustand or a similar state management tool

    const { config, response } = error;
    const { status, data } = response;

    // Handle unauthorized errors with token refresh logic
    if (status === 401 && data?.errorCode === "InvalidAccessToken") {
      try {
        // Refresh access token
        await TokenRefreshClient.get("/auth/refresh");
        // Retry original request
        return fetch.request(config as AxiosRequestConfig);
      } catch (error) {
        // Clear cache and redirect to login if refresh fails
        console.log(error);
        queryClient.clear();
        navigate("/auth/login", {
          state: { redirectUrl: window.location.pathname },
        });
      }
    }

    // Reject other errors with enriched data
    return Promise.reject({ status, ...(data || {}) });
  }
);

export default fetch;
