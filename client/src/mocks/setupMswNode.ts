import { afterAll, afterEach, beforeAll } from "vitest";
import { client } from "../api/client.gen";
import { server } from "./Server";

beforeAll(() => {
    // axios needs an absolute base URL in Node; the actual host is irrelevant
    // since msw/node intercepts the request before it ever leaves the process.
    client.setConfig({ baseURL: "http://localhost" });
    server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
