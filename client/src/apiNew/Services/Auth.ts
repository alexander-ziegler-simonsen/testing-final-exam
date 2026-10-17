import { fail, http, setAccessToken } from "../client";
import { type LoginRequest, LoginRequestSchema } from "../Requests/LoginRequest";
import { type LoginResponse, LoginResponseSchema } from "../Responses/LoginResponse";

export const AuthService = {
  login: async (input: LoginRequest): Promise<LoginResponse> => {
    const body = LoginRequestSchema.parse(input);
    const { data } = await http.post("/api/Auth/login", body).catch(fail("Login failed"));
    const login = LoginResponseSchema.parse(data);

    // attach the access token to the client instance so that it can be used for subsequent requests
    setAccessToken(login.token);

    return login;
  },

  // Checks someone's credentials WITHOUT attaching their token to the client, so the
  // logged-in user's session is left alone (used for a doctor's sign-off in GiveTreatment).
  verifyCredentials: async (input: LoginRequest): Promise<LoginResponse> => {
    const body = LoginRequestSchema.parse(input);
    const { data } = await http.post("/api/Auth/login", body).catch(fail("Invalid credentials"));
    return LoginResponseSchema.parse(data);
  },

  // The refresh token itself travels as an httpOnly cookie, sent automatically by
  // the browser (client is configured with withCredentials: true) - nothing to pass
  // in here. Returns null if the refresh token is missing, expired, or revoked.
  refresh: async (): Promise<LoginResponse | null> => {
    try {
      const { data } = await http.post("/api/Auth/refresh");
      const login = LoginResponseSchema.parse(data);
      setAccessToken(login.token);
      return login;
    } catch {
      return null;
    }
  },

  logout: async () => {
    try {
      await http.post("/api/Auth/logout");
    } finally {
      setAccessToken(null);
    }
  },
};
