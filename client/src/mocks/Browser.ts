import { setupWorker } from "msw/browser"
import { Handlers } from "./Handler"

export const worker = setupWorker(...Handlers);