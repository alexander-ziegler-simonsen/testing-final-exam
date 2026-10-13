import { createMswHandlers } from "../../api/msw.gen";
import { mockMissing, mockMissings } from "../fixtures/medicationStorageMissing";

const { pick } = createMswHandlers();

// /count must be registered before /:id, otherwise "count" is matched as an id.
export const medicationStorageMissingHandlers = [
    pick.missingStorageGetMissingCount(),

    pick.missingStorageGetAllMedicationStorageMissings({ body: mockMissings }),
    pick.missingStorageGet({ body: mockMissing }),
    pick.missingStoragePost({ body: 100 }),
    pick.missingStoragePut({ body: null }),
    pick.missingStorageDelete({ body: null }),
];
