import { http, HttpResponse } from "msw";
import { mockTreatmentStaffResponses } from "../fixtures/responses/TreatmentStaffFixture";

// a create answers with the id the new row would get
const NEW_TREATMENT_STAFF_ID = mockTreatmentStaffResponses.length + 1;

const findTreatmentStaff = (id: unknown) => mockTreatmentStaffResponses.find((treatmentStaff) => treatmentStaff.id === Number(id));

export const treatmentStaffHandlers = [
  http.get("*/api/TreatmentStaff", () => {
    return HttpResponse.json(mockTreatmentStaffResponses);
  }),

  http.get("*/api/TreatmentStaff/:id", ({ params }) => {
    const treatmentStaff = findTreatmentStaff(params.id);

    if (treatmentStaff) {
      return HttpResponse.json(treatmentStaff);
    }
    return HttpResponse.json({ message: "Treatment staff not found" }, { status: 404 });
  }),

  http.post("*/api/TreatmentStaff", () => {
    return HttpResponse.json(NEW_TREATMENT_STAFF_ID);
  }),

  http.put("*/api/TreatmentStaff/:id", ({ params }) => {
    if (findTreatmentStaff(params.id)) {
      return new HttpResponse(null, { status: 200 });
    }
    return HttpResponse.json({ message: "Treatment staff not found" }, { status: 404 });
  }),

  http.delete("*/api/TreatmentStaff/:id", ({ params }) => {
    if (findTreatmentStaff(params.id)) {
      return new HttpResponse(null, { status: 204 });
    }
    return HttpResponse.json({ message: "Treatment staff not found" }, { status: 404 });
  }),
];
