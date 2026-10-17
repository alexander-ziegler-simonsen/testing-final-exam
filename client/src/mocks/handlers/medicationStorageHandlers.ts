import { http, HttpResponse } from "msw";
import { mockMedicationStorageResponses } from "../fixtures/responses/MedicationStorageFixture";

// a create answers with the id the new row would get
const NEW_MEDICATION_STORAGE_ID = mockMedicationStorageResponses.length + 1;

const findMedicationStorage = (id: unknown) => mockMedicationStorageResponses.find((storage) => storage.id === Number(id));

// the api route is "Storage"
export const medicationStorageHandlers = [
  http.get("*/api/Storage", () => {
    return HttpResponse.json(mockMedicationStorageResponses);
  }),

  http.get("*/api/Storage/:id", ({ params }) => {
    const storage = findMedicationStorage(params.id);

    if (storage) {
      return HttpResponse.json(storage);
    }
    return HttpResponse.json({ message: "Medication storage not found" }, { status: 404 });
  }),

  http.post("*/api/Storage", () => {
    return HttpResponse.json(NEW_MEDICATION_STORAGE_ID);
  }),

  http.put("*/api/Storage/:id", ({ params }) => {
    if (findMedicationStorage(params.id)) {
      return new HttpResponse(null, { status: 200 });
    }
    return HttpResponse.json({ message: "Medication storage not found" }, { status: 404 });
  }),

  http.delete("*/api/Storage/:id", ({ params }) => {
    if (findMedicationStorage(params.id)) {
      return new HttpResponse(null, { status: 204 });
    }
    return HttpResponse.json({ message: "Medication storage not found" }, { status: 404 });
  }),
];
