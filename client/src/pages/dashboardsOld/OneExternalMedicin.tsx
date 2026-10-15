import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import type { HospitalApiDtosExternalMedicineDetailOutputDto } from "../../api";
import { ExternalMedicinePricesService } from "../../services/ExternalMedicinePrices";
import { useExternalMedicinStore } from "../../stores/ExternalMedicinStore";

export default function OneExternalMedicin() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [details, setDetails] = useState<HospitalApiDtosExternalMedicineDetailOutputDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const markDetailsMissing = useExternalMedicinStore((state) => state.markDetailsMissing);
    const markDetailsAvailable = useExternalMedicinStore((state) => state.markDetailsAvailable);

    useEffect(() => {
        if (!id) return;
        ExternalMedicinePricesService.productDetails(id)
            .then((data) => {
                setDetails(data);
                markDetailsAvailable(id);
            })
            .catch((err) => {
                setError(err.message);
                markDetailsMissing(id);
            });
    }, [id, markDetailsAvailable, markDetailsMissing]);

    if (error) return <Text data-testid="one-external-medicin-error" color="red.500">{error}</Text>;
    if (!details) return <Text data-testid="one-external-medicin-loading">Loading medicin details...</Text>;

    return (
        <Stack gap="4" data-testid="one-external-medicin-page">
            <Button data-testid="one-external-medicin-back-button" alignSelf="start" variant="outline" onClick={() => navigate("/app/external_medicin")}>Back to search</Button>

            <Heading data-testid="one-external-medicin-heading" size="lg">{details.navn}</Heading>

            <Stack gap="2">
                <Text data-testid="one-external-medicin-field-varenummer"><b>Item number:</b> {details.varenummer}</Text>
                <Text data-testid="one-external-medicin-field-styrke"><b>Strength:</b> {details.styrke}</Text>
                <Text data-testid="one-external-medicin-field-pakning"><b>Packaging:</b> {details.pakning}</Text>
                <Text data-testid="one-external-medicin-field-virksomt-stof"><b>Active substance:</b> {details.virksomtStof}</Text>
                <Text data-testid="one-external-medicin-field-firma"><b>Company:</b> {details.firma}</Text>
                <Text data-testid="one-external-medicin-field-atc-kode"><b>ATC code:</b> {details.atcKode}</Text>
                <Text data-testid="one-external-medicin-field-udleveringsgruppe"><b>Dispensing group:</b> {details.udleveringsgruppe}</Text>
                <Text data-testid="one-external-medicin-field-pris-pr-pakning"><b>Price per package:</b> {details.prisPrPakning}</Text>
                <Text data-testid="one-external-medicin-field-pris-pr-enhed"><b>Price per unit:</b> {details.prisPrEnhed}</Text>
                <Text data-testid="one-external-medicin-field-aip"><b>AIP:</b> {details.aip}</Text>
                <Text data-testid="one-external-medicin-field-tilskud-beregnes-af"><b>Subsidy calculated from:</b> {details.tilskudBeregnesAf}</Text>
                <Text data-testid="one-external-medicin-field-udgaaet"><b>Discontinued:</b> {details.udgaaet ? "Yes" : "No"}</Text>
                {details.udgaaet && (
                    <Text data-testid="one-external-medicin-field-udgaaet-dato"><b>Discontinued date:</b> {details.udgaaetDato}</Text>
                )}
                <Text data-testid="one-external-medicin-field-dosering"><b>Dosage:</b> {details.dosering}</Text>
                <Text data-testid="one-external-medicin-field-indikation"><b>Indication:</b> {details.indikation}</Text>
                <Text data-testid="one-external-medicin-field-trafik-advarsel"><b>Traffic warning:</b> {details.trafikAdvarsel ? "Yes" : "No"}</Text>
                <Text data-testid="one-external-medicin-field-ddd"><b>DDD:</b> {details.ddd}</Text>
                <Text data-testid="one-external-medicin-field-opbevaringsbetingelser"><b>Storage conditions:</b> {details.opbevaringsbetingelser}</Text>
                <Text data-testid="one-external-medicin-field-nbs-speciale"><b>NBS specialty:</b> {details.nbsSpeciale}</Text>
                <Text data-testid="one-external-medicin-field-haandkoeb"><b>Over the counter:</b> {details.haandkoeb ? "Yes" : "No"}</Text>
                <Text data-testid="one-external-medicin-field-tilskud-kode"><b>Subsidy code:</b> {details.tilskudKode}</Text>
                <Text data-testid="one-external-medicin-field-tilskud-tekst"><b>Subsidy text:</b> {details.tilskudTekst}</Text>
            </Stack>
        </Stack>
    );
}
