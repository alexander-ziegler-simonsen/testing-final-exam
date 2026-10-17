import { http, HttpResponse } from "msw";
import type { RegisterUserRequest } from "../../api/Requests/RegisterUserRequest";
import { mockUserResponses } from "../fixtures/responses/UserFixture";

const findUser = (id: unknown) => mockUserResponses.find((user) => user.id === Number(id));

export const userHandlers = [
  http.get("*/api/User", () => {
    return HttpResponse.json(mockUserResponses);
  }),

  // a username that already exists is a 409, like the api
  http.post("*/api/User/register", async ({ request }) => {
    const { username } = (await request.json()) as RegisterUserRequest;

    if (mockUserResponses.some((user) => user.username === username)) {
      return HttpResponse.json("Username already taken.", { status: 409 });
    }
    return HttpResponse.json(true);
  }),

  http.put("*/api/User/:id/password", ({ params }) => {
    if (findUser(params.id)) {
      return new HttpResponse(null, { status: 200 });
    }
    return HttpResponse.json({ message: "User not found" }, { status: 404 });
  }),

  http.delete("*/api/User/:id", ({ params }) => {
    if (findUser(params.id)) {
      return new HttpResponse(null, { status: 200 });
    }
    return HttpResponse.json({ message: "User not found" }, { status: 404 });
  }),
];
