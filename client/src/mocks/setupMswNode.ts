import { afterAll, afterEach, beforeAll } from "vitest";
import { http } from "../api/client";
import { server } from "./config/Server";

beforeAll(() => {
    http.defaults.baseURL = "http://localhost";
    server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
