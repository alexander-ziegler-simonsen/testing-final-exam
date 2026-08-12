import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { handleTreatmentStaffPost, handleTreatmentStaffDelete, handleTreatmentStaffPut, handleTreatmentStaffGet, handleTreatmentStaffGetAll } from "../api/msw.gen";
import { mockDepartment, mockDepartmentStaff, mockDepartmentStaffs } from "../mocks/fixtures";
import { server } from "../mocks/Server";
import { DepartmentStaffService } from "./DepartmentStaff";

describe("DepartmentStaffService tests", () => {

    it("getAll", async () => {
        server.use(handleTreatmentStaffGetAll({ body: mockDepartmentStaffs }));

        const departmentStaffs = await DepartmentStaffService.getAll();

        expect(departmentStaffs).toEqual(mockDepartmentStaffs);
    });

    it("getById", async () => {
        server.use(handleTreatmentStaffGet({body: mockDepartmentStaff }));

        const departmentStaff = await DepartmentStaffService.getById(mockDepartment.id!);

        expect(departmentStaff).toEqual(mockDepartmentStaff);
    });
})