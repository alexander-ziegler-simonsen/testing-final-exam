import type { HospitalApiDtosOutputsPatientOutputDto } from "../../api";

export const mockPatient: HospitalApiDtosOutputsPatientOutputDto = {
    id: 42,
    firstname: "Mette",
    lastname: "Sørensen",
    gender: "Female",
    cprNumber: "1503851234",
};

export const mockPatients: HospitalApiDtosOutputsPatientOutputDto[] = [
    mockPatient,
    { id: 43, firstname: "Jonas", lastname: "Berg", gender: "Male", cprNumber: "0711901987" },
    { id: 51, firstname: "Aisha", lastname: null, gender: null, cprNumber: "2202054567" },
];
