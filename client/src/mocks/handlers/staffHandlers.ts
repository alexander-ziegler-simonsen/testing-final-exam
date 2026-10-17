import { http, HttpResponse } from "msw";
import { mockStaffResponses } from "../fixtures/responses/StaffFixture";

// a create answers with the id the new row would get
const NEW_STAFF_ID = mockStaffResponses.length + 1;

const findStaff = (id: unknown) => mockStaffResponses.find((staff) => staff.id === Number(id));

// /count must be registered before /:id, otherwise "count" is matched as an id
export const staffHandlers = [
  http.get("*/api/Staff/count", () => {
    return HttpResponse.json(mockStaffResponses.length);
  }),

  http.get("*/api/Staff", () => {
    return HttpResponse.json(mockStaffResponses);
  }),

  http.get("*/api/Staff/:id", ({ params }) => {
    const staff = findStaff(params.id);

    if (staff) {
      return HttpResponse.json(staff);
    }
    return HttpResponse.json({ message: "Staff not found" }, { status: 404 });
  }),

  http.post("*/api/Staff", () => {
    return HttpResponse.json(NEW_STAFF_ID);
  }),

  http.put("*/api/Staff/:id", ({ params }) => {
    if (findStaff(params.id)) {
      return new HttpResponse(null, { status: 200 });
    }
    return HttpResponse.json({ message: "Staff not found" }, { status: 404 });
  }),

  http.delete("*/api/Staff/:id", ({ params }) => {
    if (findStaff(params.id)) {
      return new HttpResponse(null, { status: 204 });
    }
    return HttpResponse.json({ message: "Staff not found" }, { status: 404 });
  }),
];
