import { setupWorker } from "msw/browser"
import { AllHandlers } from "../AllHandlers";

export const worker = setupWorker(...AllHandlers);