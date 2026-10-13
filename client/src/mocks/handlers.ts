import { authHandlers } from "./handlers/auth";
import { departmentHandlers } from "./handlers/department";
import { departmentStaffHandlers } from "./handlers/departmentStaff";
import { externalMedicinePricesHandlers } from "./handlers/externalMedicinePrices";
import { locationHandlers } from "./handlers/location";
import { medicationHandlers } from "./handlers/medication";
import { medicationStorageHandlers } from "./handlers/medicationStorage";
import { medicationStorageMissingHandlers } from "./handlers/medicationStorageMissing";
import { patientHandlers } from "./handlers/patient";
import { prescriptionHandlers } from "./handlers/prescription";
import { roomBookingHandlers } from "./handlers/roomBooking";
import { staffHandlers } from "./handlers/staff";
import { treatmentHandlers } from "./handlers/treatment";
import { treatmentStaffHandlers } from "./handlers/treatmentStaff";
import { userHandlers } from "./handlers/user";

// Default fake responses for every endpoint, so the browser worker and the test
// server both serve realistic data out of the box. Override per-test with
// `server.use(handleX({ body: ... }))`.
export const handlers = [
    ...authHandlers,
    ...departmentHandlers,
    ...departmentStaffHandlers,
    ...externalMedicinePricesHandlers,
    ...locationHandlers,
    ...medicationHandlers,
    ...medicationStorageHandlers,
    ...medicationStorageMissingHandlers,
    ...patientHandlers,
    ...prescriptionHandlers,
    ...roomBookingHandlers,
    ...staffHandlers,
    ...treatmentHandlers,
    ...treatmentStaffHandlers,
    ...userHandlers,
];
