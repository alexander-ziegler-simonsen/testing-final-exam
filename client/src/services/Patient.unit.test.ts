import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { handlePatientGet, handlePatientGetAllPatients, handlePatientPost } from "../api/msw.gen";
import { mockPatient, mockPatients } from "../mocks/fixtures";
import { server } from "../mocks/Server";
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
});
