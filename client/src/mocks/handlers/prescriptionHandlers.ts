import { http, HttpResponse } from "msw";
import { mockPrescriptionResponses } from "../fixtures/responses/PrescriptionFixture";

// a create answers with the id the new row would get
const NEW_PRESCRIPTION_ID = mockPrescriptionResponses.length + 1;

const findPrescription = (id: unknown) => mockPrescriptionResponses.find((prescription) => prescription.id === Number(id));

export const prescriptionHandlers = [
  http.get("*/api/Prescription", () => {
    return HttpResponse.json(mockPrescriptionResponses);
  }),

  http.get("*/api/Prescription/:id", ({ params }) => {
    const prescription = findPrescription(params.id);

    if (prescription) {
      return HttpResponse.json(prescription);
    }
    return HttpResponse.json({ message: "Prescription not found" }, { status: 404 });
  }),

  http.post("*/api/Prescription", () => {
    return HttpResponse.json(NEW_PRESCRIPTION_ID);
  }),

  http.put("*/api/Prescription/:id", ({ params }) => {
    if (findPrescription(params.id)) {
      return new HttpResponse(null, { status: 200 });
    }
    return HttpResponse.json({ message: "Prescription not found" }, { status: 404 });
  }),

  http.delete("*/api/Prescription/:id", ({ params }) => {
    if (findPrescription(params.id)) {
      return new HttpResponse(null, { status: 204 });
    }
    return HttpResponse.json({ message: "Prescription not found" }, { status: 404 });
  }),
];
