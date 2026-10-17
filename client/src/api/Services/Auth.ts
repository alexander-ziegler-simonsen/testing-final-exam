import { fail, http, setAccessToken } from "../client";
import { type LoginRequest, LoginRequestSchema } from "../Requests/LoginRequest";
import { type LoginResponse, LoginResponseSchema } from "../Responses/LoginResponse";

export const AuthService = {
  login: async (input: LoginRequest): Promise<LoginResponse> => {
    const body = LoginRequestSchema.parse(input);
    const { data } = await http.post("/api/Auth/login", body).catch(fail("Login failed"));
    const login = LoginResponseSchema.parse(data);

    setAccessToken(login.token);

    return login;
  },

  verifyCredentials: async (input: LoginRequest): Promise<LoginResponse> => {
    const body = LoginRequestSchema.parse(input);
    const { data } = await http.post("/api/Auth/login", body).catch(fail("Invalid credentials"));
    return LoginResponseSchema.parse(data);
  },

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
