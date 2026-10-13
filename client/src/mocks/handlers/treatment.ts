import { createMswHandlers } from "../../api/msw.gen";
import { mockTreatment, mockTreatments } from "../fixtures/treatment";

const { pick } = createMswHandlers();

export const treatmentHandlers = [
    pick.treatmentGetAllTreatments({ body: mockTreatments }),
    pick.treatmentGet({ body: mockTreatment }),
    pick.treatmentPost({ body: 100 }),
    pick.treatmentPut({ body: null }),
    pick.treatmentDelete({ body: null }),
];
