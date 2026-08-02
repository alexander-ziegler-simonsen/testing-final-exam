import { afterAll, afterEach, beforeAll } from "vitest";
import { worker } from "./Browser";

beforeAll(() => worker.start({ onUnhandledRequest: "bypass" }));

afterEach(() => worker.resetHandlers());

afterAll(() => worker.stop());
