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
        navn: "Ipren",
        varenummer: "520247",
        firma: "Takeda Pharma A/S",
        styrke: "400 mg",
        detaljer: "28100423976",
        pakning: "30 stk. (blister)",
    },
    {
        navn: "Imacillin",
        varenummer: "046698",
        firma: "Meda AS",
        styrke: "500 mg",
        detaljer: "28100167476",
        pakning: "20 stk. (blister)",
    },
];
