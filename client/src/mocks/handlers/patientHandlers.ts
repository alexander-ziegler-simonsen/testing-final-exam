import { http, HttpResponse } from "msw";
import { mockPatientResponses } from "../fixtures/responses/PatientFixture";

const getParam = (request: Request, name: string) => new URL(request.url).searchParams.get(name);

// a create answers with the id the new row would get
const NEW_PATIENT_ID = mockPatientResponses.length + 1;

// query param -> field, the api keeps a patient when the field contains the value (case-insensitive)
const PATIENT_FILTERS = [
  ["Firstname", "firstname"],
  ["Lastname", "lastname"],
  ["Gender", "gender"],
  ["CprNumber", "cprNumber"],
] as const;

// the api can only build a cpr number for these genders, anything else is a 400
const CPR_GENDERS = ["male", "female"];

const findPatient = (id: unknown) => mockPatientResponses.find((patient) => patient.id === Number(id));

// /count and /register-baby must be registered before /:id, otherwise they are matched as an id
export const patientHandlers = [
  http.get("*/api/Patient/count", () => {
    return HttpResponse.json(mockPatientResponses.length);
  }),

  http.post("*/api/Patient/register-baby", async ({ request }) => {
    const { gender } = (await request.json()) as { gender: string | null };

    if (gender && CPR_GENDERS.includes(gender.trim().toLowerCase())) {
      return HttpResponse.json(NEW_PATIENT_ID);
    }
    return HttpResponse.json('Gender must be "male" or "female".', { status: 400 });
  }),

  // sortBy/sortDir are ignored - the fixtures are already in the api's default order (by id)
  http.get("*/api/Patient", ({ request }) => {
    let patients = mockPatientResponses;

    for (const [param, field] of PATIENT_FILTERS) {
      const value = getParam(request, param)?.toLowerCase();
      if (value) {
        patients = patients.filter((patient) => patient[field]?.toLowerCase().includes(value));
      }
    }
    return HttpResponse.json(patients);
  }),

  http.get("*/api/Patient/:id", ({ params }) => {
    const patient = findPatient(params.id);

    if (patient) {
      return HttpResponse.json(patient);
    }
    return HttpResponse.json({ message: "Patient not found" }, { status: 404 });
  }),

  http.post("*/api/Patient", () => {
    return HttpResponse.json(NEW_PATIENT_ID);
  }),

  http.put("*/api/Patient/:id", ({ params }) => {
    if (findPatient(params.id)) {
      return new HttpResponse(null, { status: 200 });
    }
    return HttpResponse.json({ message: "Patient not found" }, { status: 404 });
  }),

  http.delete("*/api/Patient/:id", ({ params }) => {
    if (findPatient(params.id)) {
      return new HttpResponse(null, { status: 204 });
    }
    return HttpResponse.json({ message: "Patient not found" }, { status: 404 });
  }),
];
