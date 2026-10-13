import { createMswHandlers } from "../../api/msw.gen";
import { mockStorage, mockStorages } from "../fixtures/medicationStorage";

const { pick } = createMswHandlers();

export const medicationStorageHandlers = [
    pick.storageGetAllMedicationStorages({ body: mockStorages }),
    pick.storageGet({ body: mockStorage }),
    pick.storagePost({ body: 100 }),
    pick.storagePut({ body: null }),
    pick.storageDelete({ body: null }),
];
