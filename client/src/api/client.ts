import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // required so the httpOnly refresh-token cookie round-trips with every request
  withCredentials: true,
});

export function setAccessToken(token: string | null) {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common.Authorization;
  }
}

export const fail =
  (message: string) =>
  (error: unknown): never => {
    throw new Error(message, { cause: error });
  };
