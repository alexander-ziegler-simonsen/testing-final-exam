import { createMswHandlers } from "../../api/msw.gen";
import { mockStaff, mockStaffs } from "../fixtures/staff";

const { pick } = createMswHandlers();

// /count must be registered before /:id, otherwise "count" is matched as an id.
export const staffHandlers = [
    pick.staffGetStaffCount(),

    pick.staffGetAllStaffs({ body: mockStaffs }),
    pick.staffGet({ body: mockStaff }),
    pick.staffPost({ body: 100 }),
    pick.staffPut({ body: null }),
    pick.staffDelete({ body: null }),
];
