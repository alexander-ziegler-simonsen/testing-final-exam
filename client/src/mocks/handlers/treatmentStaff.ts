import { createMswHandlers } from "../../api/msw.gen";
import { mockTreatmentStaff, mockTreatmentStaffs } from "../fixtures/treatment";

const { pick } = createMswHandlers();

export const treatmentStaffHandlers = [
    pick.treatmentStaffGetAll({ body: mockTreatmentStaffs }),
    pick.treatmentStaffGet({ body: mockTreatmentStaff }),
    pick.treatmentStaffPost({ body: 100 }),
    pick.treatmentStaffPut({ body: null }),
    pick.treatmentStaffDelete({ body: null }),
];
