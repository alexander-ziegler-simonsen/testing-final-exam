import { http, HttpResponse } from "msw";
import { mockMedicationResponses } from "../fixtures/responses/MedicationFixture";

// a create answers with the id the new row would get
const NEW_MEDICATION_ID = mockMedicationResponses.length + 1;

const findMedication = (id: unknown) => mockMedicationResponses.find((medication) => medication.id === Number(id));

// the api route is spelled "Medicin"
export const medicationHandlers = [
  http.get("*/api/Medicin", () => {
    return HttpResponse.json(mockMedicationResponses);
  }),

  http.get("*/api/Medicin/:id", ({ params }) => {
    const medication = findMedication(params.id);

    if (medication) {
      return HttpResponse.json(medication);
    }
    return HttpResponse.json({ message: "Medication not found" }, { status: 404 });
  }),

  http.post("*/api/Medicin", () => {
    return HttpResponse.json(NEW_MEDICATION_ID);
  }),

  http.put("*/api/Medicin/:id", ({ params }) => {
    if (findMedication(params.id)) {
      return new HttpResponse(null, { status: 200 });
    }
    return HttpResponse.json({ message: "Medication not found" }, { status: 404 });
  }),

  http.delete("*/api/Medicin/:id", ({ params }) => {
    if (findMedication(params.id)) {
      return new HttpResponse(null, { status: 204 });
    }
    return HttpResponse.json({ message: "Medication not found" }, { status: 404 });
  }),
];
