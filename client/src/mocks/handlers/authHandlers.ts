import { http, HttpResponse } from "msw";
import type { LoginRequest } from "../../api/Requests/LoginRequest";
import { mockLoginRequests } from "../fixtures/requests/LoginFixture";
import { mockLoginResponses } from "../fixtures/responses/LoginFixture";

// the api keeps the refresh token in an httpOnly cookie - msw stores mocked cookies and sends them back like a browser
const REFRESH_COOKIE = "refreshToken";

// every mock username is the role it logs in as ("doctor", "nurse", "patient", "admin")
const findLogin = (username: string | undefined) => mockLoginResponses.find((login) => login.role === username);

export const authHandlers = [
  http.post("*/api/Auth/login", async ({ request }) => {
    const { username, password } = (await request.json()) as LoginRequest;
    const known = mockLoginRequests.some((login) => login.username === username && login.password === password);

    if (known) {
      return HttpResponse.json(findLogin(username), {
        headers: { "Set-Cookie": `${REFRESH_COOKIE}=${username}; Path=/; HttpOnly` },
      });
    }
    return new HttpResponse(null, { status: 401 });
  }),

  http.post("*/api/Auth/refresh", ({ cookies }) => {
    const login = findLogin(cookies[REFRESH_COOKIE]);

    if (login) {
      return HttpResponse.json(login);
    }
    return new HttpResponse(null, { status: 401 });
  }),

  http.post("*/api/Auth/logout", () => {
    return new HttpResponse(null, {
      status: 204,
      headers: { "Set-Cookie": `${REFRESH_COOKIE}=; Path=/; Max-Age=0` },
    });
  }),
];
