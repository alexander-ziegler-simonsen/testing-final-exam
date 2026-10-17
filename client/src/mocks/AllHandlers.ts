import { authHandlers } from "./handlers/authHandlers";
import { departmentHandlers } from "./handlers/departmentHandlers";
import { departmentStaffHandlers } from "./handlers/departmentStaffHandlers";
import { e2eExternalMedicinHandlers } from "./handlers/e2eHandlers";
import { locationHandlers } from "./handlers/locationHandlers";
import { medicationHandlers } from "./handlers/medicationHandlers";
import { medicationStorageHandlers } from "./handlers/medicationStorageHandlers";
import { medicationStorageMissingHandlers } from "./handlers/medicationStorageMissingHandlers";
import { patientHandlers } from "./handlers/patientHandlers";
import { prescriptionHandlers } from "./handlers/prescriptionHandlers";
import { roomBookingHandlers } from "./handlers/roomBookingHandlers";
import { staffHandlers } from "./handlers/staffHandlers";
import { treatmentHandlers } from "./handlers/treatmentHandlers";
import { treatmentStaffHandlers } from "./handlers/treatmentStaffHandlers";
import { userHandlers } from "./handlers/userHandlers";

export const AllHandlers = [
    ...authHandlers,
    ...departmentHandlers,
    ...departmentStaffHandlers,
    ...e2eExternalMedicinHandlers,
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
