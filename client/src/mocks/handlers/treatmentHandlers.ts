import { http, HttpResponse } from "msw";
import { mockTreatmentResponses } from "../fixtures/responses/TreatmentFixture";

const getParam = (request: Request, name: string) => new URL(request.url).searchParams.get(name);

// a create answers with the id the new row would get
const NEW_TREATMENT_ID = mockTreatmentResponses.length + 1;

const findTreatment = (id: unknown) => mockTreatmentResponses.find((treatment) => treatment.id === Number(id));

export const treatmentHandlers = [
  // same filters as the api: FkPatientId must match, Description must be contained (case-insensitive), Time is ignored.
  // sortBy/sortDir are ignored - the fixtures are already in the api's default order (by id)
  http.get("*/api/Treatment", ({ request }) => {
    const fkPatientId = Number(getParam(request, "FkPatientId") ?? 0);
    const description = getParam(request, "Description")?.toLowerCase();
    let treatments = mockTreatmentResponses;

    if (fkPatientId) {
      treatments = treatments.filter((treatment) => treatment.fkPatientId === fkPatientId);
    }
    if (description) {
      treatments = treatments.filter((treatment) => treatment.description?.toLowerCase().includes(description));
    }
    return HttpResponse.json(treatments);
  }),

  http.get("*/api/Treatment/:id", ({ params }) => {
    const treatment = findTreatment(params.id);

    if (treatment) {
      return HttpResponse.json(treatment);
    }
    return HttpResponse.json({ message: "Treatment not found" }, { status: 404 });
  }),

  // the optional ?staffId only links the treatment to a staff member on the api side
  http.post("*/api/Treatment", () => {
    return HttpResponse.json(NEW_TREATMENT_ID);
  }),

  http.put("*/api/Treatment/:id", ({ params }) => {
    if (findTreatment(params.id)) {
      return new HttpResponse(null, { status: 200 });
    }
    return HttpResponse.json({ message: "Treatment not found" }, { status: 404 });
  }),

  http.delete("*/api/Treatment/:id", ({ params }) => {
    if (findTreatment(params.id)) {
      return new HttpResponse(null, { status: 204 });
    }
    return HttpResponse.json({ message: "Treatment not found" }, { status: 404 });
  }),
];
