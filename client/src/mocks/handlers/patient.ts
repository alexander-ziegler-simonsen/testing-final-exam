import { createMswHandlers } from "../../api/msw.gen";
import { mockPatient, mockPatients } from "../fixtures/patient";

const { pick } = createMswHandlers();

// /count must be registered before /:id, otherwise "count" is matched as an id.
export const patientHandlers = [
    pick.patientGetPatientCount(),
    pick.patientRegisterBaby(),

    pick.patientGetAllPatients({ body: mockPatients }),
    pick.patientGet({ body: mockPatient }),
    pick.patientPost({ body: 100 }),
    pick.patientPut({ body: null }),
    pick.patientDelete({ body: null }),
];
