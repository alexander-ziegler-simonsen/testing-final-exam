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
