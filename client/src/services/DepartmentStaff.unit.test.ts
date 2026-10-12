import { describe, expect, it } from "vitest";
import { handleTreatmentStaffGet, handleTreatmentStaffGetAll } from "../api/msw.gen";
import { mockDepartment, mockDepartmentStaff, mockDepartmentStaffs } from "../mocks/fixtures";
import { server } from "../mocks/Server";
import { placeholder } from "../test-utils/placeholder";
import { DepartmentStaffService } from "./DepartmentStaff";

describe("DepartmentStaffService", () => {
    it("getAll returns the mocked department staff list", async () => {
        server.use(handleTreatmentStaffGetAll({ body: mockDepartmentStaffs }));
        const departmentStaffs = await DepartmentStaffService.getAll();
        expect(departmentStaffs).toEqual(mockDepartmentStaffs);
    });

    it("getById returns a single mocked department staff", async () => {
        server.use(handleTreatmentStaffGet({ body: mockDepartmentStaff }));
        const departmentStaff = await DepartmentStaffService.getById(mockDepartment.id!);
        expect(departmentStaff).toEqual(mockDepartmentStaff);
    });

    // Placeholders: each test passes by default until it's implemented.
    it("getAll throws when the API errors", placeholder);
    it("getById throws when the department staff is missing", placeholder);
    it("create posts the input and returns the new id", placeholder);
    it("create throws when the API errors", placeholder);
    it("create throws when the API returns a non-number id", placeholder);
    it("create throws before sending a request when fkStaffId is not an integer", placeholder);
    it("update resolves without throwing on success", placeholder);
    it("update throws when the API errors", placeholder);
    it("update throws before sending a request when the input fails validation", placeholder);
    it("delete resolves without throwing on success", placeholder);
    it("delete throws when the API errors", placeholder);
});
