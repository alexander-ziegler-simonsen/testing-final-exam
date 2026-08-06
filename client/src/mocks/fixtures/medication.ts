import type { HospitalApiDtosOutputsMedicationOutputDto } from "../../api";

export const mockMedication: HospitalApiDtosOutputsMedicationOutputDto = {
    id: 11,
    name: "Panodil",
    genericName: "Paracetamol",
    brand: "GSK",
    form: "Tablet",
    strength: "500 mg",
    category: "Analgesic",
    description: "For lettere smerter og feber.",
};

export const mockMedications: HospitalApiDtosOutputsMedicationOutputDto[] = [
    mockMedication,
    {
        id: 12,
        name: "Ibumetin",
        genericName: "Ibuprofen",
        brand: "Orifarm",
        form: "Tablet",
        strength: "400 mg",
        category: "NSAID",
        description: null,
    },
    {
        id: 19,
        name: "Amoxicillin \"Actavis\"",
        genericName: "Amoxicillin",
        brand: null,
        form: "Capsule",
        strength: "250 mg",
        category: "Antibiotic",
        description: "Bredspektret penicillin.",
    },
];
