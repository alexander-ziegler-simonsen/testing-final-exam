import { setupWorker } from "msw/browser"
import { createMswHandlers } from "../api/msw.gen"

const { all } = createMswHandlers();
export const worker = setupWorker(...all());