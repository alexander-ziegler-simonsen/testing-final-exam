import type {
    HospitalApiDtosExternalMedicineDetailOutputDto,
    HospitalApiDtosExternalMedicineProductOutputDto,
} from "../../api";

export const mockMedicineProduct: HospitalApiDtosExternalMedicineProductOutputDto = {
    navn: "Panodil",
    varenummer: "118420",
    firma: "GlaxoSmithKline Consumer Healthcare",
    styrke: "500 mg",
    detaljer: "Tabletter",
    pakning: "20 stk.",
};

export const mockMedicineProducts: HospitalApiDtosExternalMedicineProductOutputDto[] = [
    mockMedicineProduct,
    {
        navn: "Ibumetin",
        varenummer: "395112",
        firma: "Orifarm A/S",
        styrke: "400 mg",
        detaljer: "Filmovertrukne tabletter",
        pakning: "30 stk.",
    },
];

export const mockMedicineDetail: HospitalApiDtosExternalMedicineDetailOutputDto = {
    navn: "Panodil",
    varenummer: "118420",
    styrke: "500 mg",
    pakning: "20 stk.",
    virksomtStof: "Paracetamol",
    firma: "GlaxoSmithKline Consumer Healthcare",
    atcKode: "N02BE01",
    dosisdispensering: false,
    udleveringsgruppe: "HA",
    prisPrPakning: "24,95",
    prisPrEnhed: "1,25",
    aip: "18,40",
    tilskudBeregnesAf: null,
    udgaaet: false,
    udgaaetDato: null,
    dosering: "1-2 stk. ved behov, maks. 4 gange i døgnet",
    indikation: "Lettere smerter og feber",
    trafikAdvarsel: false,
    ddd: null,
    opbevaringsbetingelser: "Opbevares ved højst 25°C",
    nbsSpeciale: null,
    haandkoeb: true,
    tilskudKode: null,
    tilskudTekst: null,
};

// Fixtures for the e2e "external-only" MSW mode (see mocks/e2eHandlers.ts).
// Shaped to match what tests/e2e/tests/test-2.spec.ts already asserts on: a
// "panodi" search returning two products with real details and one
// (varenummer 008453) whose detail lookup 404s.
export const mockE2eExternalMedicinSearchResults: HospitalApiDtosExternalMedicineProductOutputDto[] = [
    {
        navn: "Panodil",
        varenummer: "118420",
        firma: "GlaxoSmithKline Consumer Healthcare",
        styrke: "500 mg",
        detaljer: "Tabletter",
        pakning: "10 stk. (blister)",
    },
    {
        navn: "Panodil Hot",
        varenummer: "118421",
        firma: "GlaxoSmithKline Consumer Healthcare",
        styrke: "500 mg",
        detaljer: "Pulver til oral opløsning",
        pakning: "10 stk. (blister)",
    },
    {
        navn: "Panodil Retard",
        varenummer: "008453",
        firma: "GlaxoSmithKline Consumer Healthcare",
        styrke: "665 mg",
        detaljer: "Depottabletter",
        pakning: "stk. tabl. m modif udløsn",
    },
];

export const mockE2eExternalMedicinDetail: HospitalApiDtosExternalMedicineDetailOutputDto = {
    ...mockMedicineDetail,
};
