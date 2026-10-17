import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { http } from "../client";
import { useAuthStore } from "../../stores/AuthStore";
import { AuthService } from "./Auth";
import type { LoginResponse } from "../Responses/LoginResponse";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
const REFRESH_URL = "/api/Auth/refresh";

let refreshPromise: Promise<LoginResponse | null> | null = null;

function refreshOnce(): Promise<LoginResponse | null> {
  if (!refreshPromise) {
    refreshPromise = AuthService.refresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export function setupAuthInterceptor() {
  http.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;

      if (error.response?.status !== 401 || !originalRequest || originalRequest.url?.includes(REFRESH_URL) || originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const refreshed = await refreshOnce();
      if (!refreshed) {
        useAuthStore.getState().clearSession();
        return Promise.reject(error);
      }

      useAuthStore.getState().setSession(refreshed.token, {
        staffId: refreshed.staffId,
        patientId: refreshed.patientId,
        firstName: refreshed.firstname!,
        lastName: refreshed.lastname!,
        role: refreshed.role as "doctor" | "nurse" | "admin" | "patient",
      });

      originalRequest.headers.Authorization = `Bearer ${refreshed.token}`;
      return http(originalRequest);
    },
  );
}
