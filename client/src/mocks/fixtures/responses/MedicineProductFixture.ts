import type { MedicineProductResponse } from "../../../api/Responses/MedicineProductResponse";

// detaljer is the id passed on to the product details endpoint
export const mockMedicineProductResponse: MedicineProductResponse = {
    navn: "Panodil",
    varenummer: "014191",
    firma: "Haleon Denmark ApS",
    styrke: "500 mg",
    detaljer: "28100636175",
    pakning: "100 stk. (blister)",
};

export const mockMedicineProductResponses: MedicineProductResponse[] = [
    mockMedicineProductResponse,
    {
        navn: "Panodil Hot",
        varenummer: "118421",
        firma: "Haleon Denmark ApS",
        styrke: "500 mg",
        detaljer: "28100636276",
        pakning: "10 stk. (breve)",
    },
    {
        navn: "Panodil zap",
        varenummer: "008453",
        firma: "Haleon Denmark ApS",
        styrke: "665 mg",
        detaljer: "28100636377",
        pakning: "50 stk. (blister)",
    },
];
