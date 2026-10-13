import { createMswHandlers } from "../../api/msw.gen";
import { mockMedication, mockMedications } from "../fixtures/medication";

const { pick } = createMswHandlers();

export const medicationHandlers = [
    pick.medicinGetAllMedicins({ body: mockMedications }),
    pick.medicinGet({ body: mockMedication }),
    pick.medicinPost({ body: 100 }),
    pick.medicinPut({ body: null }),
    pick.medicinDelete({ body: null }),
];
