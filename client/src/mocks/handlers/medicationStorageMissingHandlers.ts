import { http, HttpResponse } from "msw";
import { mockMedicationStorageMissingResponses } from "../fixtures/responses/MedicationStorageMissingFixture";

// a create answers with the id the new row would get
const NEW_MISSING_ID = mockMedicationStorageMissingResponses.length + 1;

const findMissing = (id: unknown) => mockMedicationStorageMissingResponses.find((missing) => missing.id === Number(id));

// the api route is "MissingStorage" - /count must be registered before /:id, otherwise "count" is matched as an id
export const medicationStorageMissingHandlers = [
  http.get("*/api/MissingStorage/count", () => {
    return HttpResponse.json(mockMedicationStorageMissingResponses.length);
  }),

  http.get("*/api/MissingStorage", () => {
    return HttpResponse.json(mockMedicationStorageMissingResponses);
  }),

  http.get("*/api/MissingStorage/:id", ({ params }) => {
    const missing = findMissing(params.id);

    if (missing) {
      return HttpResponse.json(missing);
    }
    return HttpResponse.json({ message: "Missing medication storage not found" }, { status: 404 });
  }),

  http.post("*/api/MissingStorage", () => {
    return HttpResponse.json(NEW_MISSING_ID);
  }),

  http.put("*/api/MissingStorage/:id", ({ params }) => {
    if (findMissing(params.id)) {
      return new HttpResponse(null, { status: 200 });
    }
    return HttpResponse.json({ message: "Missing medication storage not found" }, { status: 404 });
  }),

  http.delete("*/api/MissingStorage/:id", ({ params }) => {
    if (findMissing(params.id)) {
      return new HttpResponse(null, { status: 204 });
    }
    return HttpResponse.json({ message: "Missing medication storage not found" }, { status: 404 });
  }),
];
