import type { HospitalApiDtosOutputsPatientOutputDto } from "../../api";

export const mockPatient: HospitalApiDtosOutputsPatientOutputDto = {
    id: 42,
    firstname: "Mette",
    lastname: "Sørensen",
    gender: "Female",
    cprNumber: "1503851234",
    dateOfBirth: "1985-03-15",
    weightKg: 65,
    heightCm: 168,
};

export const mockPatients: HospitalApiDtosOutputsPatientOutputDto[] = [
    mockPatient,
    {
        id: 43,
        firstname: "Jonas",
        lastname: "Berg",
        gender: "Male",
        cprNumber: "0711901987",
        dateOfBirth: "1990-11-07",
        weightKg: 82,
        heightCm: 181,
    },
    {
        id: 51,
        firstname: "Aisha",
        lastname: null,
        gender: null,
        cprNumber: "2202054567",
        dateOfBirth: "2005-02-22",
        weightKg: null,
        heightCm: null,
    },
];
