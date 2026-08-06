import type { HospitalApiDtosOutputsUserOutputDto } from "../../api";

export const mockUser: HospitalApiDtosOutputsUserOutputDto = {
    id: 7,
    username: "kholm",
    fkStaffId: 7,
};

export const mockUsers: HospitalApiDtosOutputsUserOutputDto[] = [
    mockUser,
    { id: 3, username: "mvang", fkStaffId: 3 },
];
