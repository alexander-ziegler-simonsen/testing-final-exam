import { createMswHandlers } from "../../api/msw.gen";
import { mockPrescription, mockPrescriptions } from "../fixtures/prescription";

const { pick } = createMswHandlers();

export const prescriptionHandlers = [
    pick.prescriptionGetAllPrescriptions({ body: mockPrescriptions }),
    pick.prescriptionGet({ body: mockPrescription }),
    pick.prescriptionPost({ body: 100 }),
    pick.prescriptionPut({ body: null }),
    pick.prescriptionDelete({ body: null }),
];
