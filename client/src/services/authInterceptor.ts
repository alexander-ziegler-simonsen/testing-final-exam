import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { client } from "../api/client.gen";
import { useAuthStore } from "../stores/AuthStore";
import { AuthService } from "./Auth";
import type { HospitalApiDtosOutputsLoginOutputDto } from "../api";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const REFRESH_URL = "/api/Auth/refresh";

// Coalesces concurrent 401s (e.g. several requests firing right as the access
// token expires) into a single refresh call instead of one per request.
let refreshPromise: Promise<HospitalApiDtosOutputsLoginOutputDto | null> | null = null;

function refreshOnce(): Promise<HospitalApiDtosOutputsLoginOutputDto | null> {
  if (!refreshPromise) {
    refreshPromise = AuthService.refresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// Registers a response interceptor so an expired access token is handled
// transparently: on a 401, refresh once via the httpOnly refresh-token cookie,
// then retry the original request with the new access token. Call once at app startup.
export function setupAuthInterceptor() {
  client.instance.interceptors.response.use(
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
        staffId: refreshed.staffId ?? null,
        patientId: refreshed.patientId ?? null,
        firstName: refreshed.firstname!,
        lastName: refreshed.lastname!,
        role: refreshed.role as "doctor" | "nurse" | "admin" | "patient",
      });

      originalRequest.headers.Authorization = `Bearer ${refreshed.token}`;
      return client.instance(originalRequest);
    },
  );
}
