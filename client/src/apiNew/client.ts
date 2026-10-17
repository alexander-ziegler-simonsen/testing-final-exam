import axios from "axios";

// The single axios instance every service in apiNew/Services sends its requests through.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // required so the httpOnly refresh-token cookie round-trips with every request
  withCredentials: true,
});

// Attaches the access token to every following request, or removes it again when given null.
export function setAccessToken(token: string | null) {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common.Authorization;
  }
}

// Swaps a failed request (network error, non-2xx status) for an Error with a readable message,
// keeping the original axios error as `cause`. Use as: await http.get(...).catch(fail("..."))
export const fail =
  (message: string) =>
  (error: unknown): never => {
    throw new Error(message, { cause: error });
  };
