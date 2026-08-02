import type {
    HospitalApiDtosOutputsTreatmentOutputDto,
    HospitalApiDtosOutputsTreatmentStaffOutputDto,
} from "../../api";

export const mockTreatment: HospitalApiDtosOutputsTreatmentOutputDto = {
    id: 6,
    fkPatientId: 42,
    description: "Rutinetjek og blodprøve",
    time: "2026-08-04T09:00:00",
};

export const mockTreatments: HospitalApiDtosOutputsTreatmentOutputDto[] = [
    mockTreatment,
    { id: 7, fkPatientId: 43, description: null, time: "2026-08-05T11:30:00" },
];

export const mockTreatmentStaff: HospitalApiDtosOutputsTreatmentStaffOutputDto = {
    id: 1,
    fkTreatmentId: 6,
    fkStaffId: 7,
};

export const mockTreatmentStaffs: HospitalApiDtosOutputsTreatmentStaffOutputDto[] = [
    mockTreatmentStaff,
    { id: 2, fkTreatmentId: 6, fkStaffId: 3 },
];
