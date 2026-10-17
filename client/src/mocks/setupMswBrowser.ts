import { afterAll, afterEach, beforeAll } from "vitest";
import { worker } from "./config/Browser";

beforeAll(() => worker.start({ onUnhandledRequest: "bypass" }));

afterEach(() => worker.resetHandlers());

afterAll(() => worker.stop());
