import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { handlePatientGet, handlePatientGetAllPatients, handlePatientPost } from "../api/msw.gen";
import { mockPatient, mockPatients } from "../mocks/fixtures";
import { server } from "../mocks/Server";
import { placeholder } from "../test-utils/placeholder";
import { PatientService } from "./Patient";

describe("PatientService", () => {
  it("getAll returns the mocked patient list", async () => {
    server.use(handlePatientGetAllPatients({ body: mockPatients }));

    const patients = await PatientService.getAll();

    expect(patients).toEqual(mockPatients);
  });

  it("getById returns a single mocked patient", async () => {
    server.use(handlePatientGet({ body: mockPatient }));

    const patient = await PatientService.getById(mockPatient.id!);

    expect(patient).toEqual(mockPatient);
  });

  it("create posts the input and returns the new id", async () => {
    server.use(handlePatientPost({ body: 77 }));

    const newId = await PatientService.create({
      firstname: "Test",
      lastname: "Patient",
      gender: "Female",
      cprNumber: "0101001234",
    });

    expect(newId).toBe(77);
  });

  it("getAll throws when the API errors", async () => {
    server.use(handlePatientGetAllPatients(() => HttpResponse.json({ title: "Internal Server Error" }, { status: 500 })));

    const result = PatientService.getAll();

    await expect(result).rejects.toThrow("Failed to load patients");
  });

  it("getById throws when the patient is missing", async () => {
    server.use(handlePatientGet(() => HttpResponse.json({ title: "Not Found" }, { status: 404 })));

    const result = PatientService.getById(999);

    await expect(result).rejects.toThrow("Failed to load patient 999");
  });

  // Placeholders: each test passes by default until it's implemented.
  it("getAll maps the filter to the Firstname, Lastname, Gender and CprNumber query params", placeholder);
  it("getAll sends sortBy and sortDir", placeholder);
  it("getAll leaves null filter fields out of the query", placeholder);
  it("create throws when the API errors", placeholder);
  it("create throws when the API returns a non-number id", placeholder);
  it("create throws before sending a request when the cprNumber is longer than 10 characters", placeholder);
  it("update resolves without throwing on success", placeholder);
  it("update throws when the API errors", placeholder);
  it("update throws before sending a request when the input fails validation", placeholder);
  it("delete resolves without throwing on success", placeholder);
  it("delete throws when the API errors", placeholder);
  it("registerBaby posts the input and returns the new id", placeholder);
  it("registerBaby throws when the API errors", placeholder);
  it("registerBaby throws when the API returns a non-number id", placeholder);
  it("registerBaby throws before sending a request when dateOfBirth is not an iso date", placeholder);
  it("getCount returns the mocked patient count", placeholder);
  it("getCount throws when the API errors", placeholder);
});
