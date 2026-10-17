import type { z } from "zod";
import type { PatientResponseSchema } from "../../../api/Responses/PatientResponse";

// wire format (what the api sends): dateOfBirth is a "yyyy-MM-dd" string, the schema turns it into a Date when parsing
type PatientResponseJson = z.input<typeof PatientResponseSchema>;

export const mockPatientResponse: PatientResponseJson = {
    id: 1,
    firstname: "Lars",
    lastname: "Jensen",
    gender: "Male",
    cprNumber: "0101801234",
    dateOfBirth: "1980-01-01",
    weightKg: 82.5,
    heightCm: 180,
};

export const mockPatientResponses: PatientResponseJson[] = [
    mockPatientResponse,
    {
        id: 2,
        firstname: "Mette",
        lastname: "Nielsen",
        gender: "Female",
        cprNumber: "1505925678",
        dateOfBirth: "1992-05-15",
        weightKg: 64,
        heightCm: 168,
    },
    {
        id: 3,
        firstname: "Alex",
        lastname: "Berg",
        gender: "Other",
        cprNumber: "2012009012",
        dateOfBirth: "2000-12-20",
        weightKg: 71.3,
        heightCm: 175,
    },
];

// one entry per nullable field, with only that field set to null
export const mockPatientResponsesWithNulls: PatientResponseJson[] = [
    { ...mockPatientResponse, id: 11, firstname: null },
    { ...mockPatientResponse, id: 12, lastname: null },
    { ...mockPatientResponse, id: 13, gender: null },
    { ...mockPatientResponse, id: 14, cprNumber: null },
    { ...mockPatientResponse, id: 15, dateOfBirth: null },
    { ...mockPatientResponse, id: 16, weightKg: null },
    { ...mockPatientResponse, id: 17, heightCm: null },
];
