import { http, HttpResponse } from "msw";
import { mockDepartmentResponses } from "../fixtures/responses/DepartmentFixture";

// a create answers with the id the new row would get
const NEW_DEPARTMENT_ID = mockDepartmentResponses.length + 1;

const findDepartment = (id: unknown) => mockDepartmentResponses.find((department) => department.id === Number(id));

export const departmentHandlers = [
  http.get("*/api/Department", () => {
    return HttpResponse.json(mockDepartmentResponses);
  }),

  http.get("*/api/Department/:id", ({ params }) => {
    const department = findDepartment(params.id);

    if (department) {
      return HttpResponse.json(department);
    }
    return HttpResponse.json({ message: "Department not found" }, { status: 404 });
  }),

  http.post("*/api/Department", () => {
    return HttpResponse.json(NEW_DEPARTMENT_ID);
  }),

  http.put("*/api/Department/:id", ({ params }) => {
    if (findDepartment(params.id)) {
      return new HttpResponse(null, { status: 200 });
    }
    return HttpResponse.json({ message: "Department not found" }, { status: 404 });
  }),

  http.delete("*/api/Department/:id", ({ params }) => {
    if (findDepartment(params.id)) {
      return new HttpResponse(null, { status: 204 });
    }
    return HttpResponse.json({ message: "Department not found" }, { status: 404 });
  }),
];
