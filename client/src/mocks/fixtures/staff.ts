import type { HospitalApiDtosOutputsStaffOutputDto } from "../../api";

export const mockStaff: HospitalApiDtosOutputsStaffOutputDto = {
    id: 7,
    firstname: "Karen",
    lastname: "Holm",
    fkRoleId: 2,
};

export const mockStaffs: HospitalApiDtosOutputsStaffOutputDto[] = [
    mockStaff,
    { id: 3, firstname: "Mikkel", lastname: "Vang", fkRoleId: 1 },
    { id: 12, firstname: "Ida", lastname: null, fkRoleId: 3 },
];
