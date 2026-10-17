import { http, HttpResponse } from "msw";
import { mockDepartmentStaffResponses } from "../fixtures/responses/DepartmentStaffFixture";

// a create answers with the id the new row would get
const NEW_DEPARTMENT_STAFF_ID = mockDepartmentStaffResponses.length + 1;

const findDepartmentStaff = (id: unknown) => mockDepartmentStaffResponses.find((departmentStaff) => departmentStaff.id === Number(id));

export const departmentStaffHandlers = [
  http.get("*/api/DepartmentStaff", () => {
    return HttpResponse.json(mockDepartmentStaffResponses);
  }),

  http.get("*/api/DepartmentStaff/:id", ({ params }) => {
    const departmentStaff = findDepartmentStaff(params.id);

    if (departmentStaff) {
      return HttpResponse.json(departmentStaff);
    }
    return HttpResponse.json({ message: "Department staff not found" }, { status: 404 });
  }),

  http.post("*/api/DepartmentStaff", () => {
    return HttpResponse.json(NEW_DEPARTMENT_STAFF_ID);
  }),

  http.put("*/api/DepartmentStaff/:id", ({ params }) => {
    if (findDepartmentStaff(params.id)) {
      return new HttpResponse(null, { status: 200 });
    }
    return HttpResponse.json({ message: "Department staff not found" }, { status: 404 });
  }),

  http.delete("*/api/DepartmentStaff/:id", ({ params }) => {
    if (findDepartmentStaff(params.id)) {
      return new HttpResponse(null, { status: 204 });
    }
    return HttpResponse.json({ message: "Department staff not found" }, { status: 404 });
  }),
];
