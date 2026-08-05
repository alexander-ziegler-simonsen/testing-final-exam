import { setupWorker } from "msw/browser"
import { e2eExternalMedicinHandlers } from "./e2eHandlers"

export const worker = setupWorker(...e2eExternalMedicinHandlers);
