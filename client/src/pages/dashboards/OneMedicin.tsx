import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { LuPencil } from "react-icons/lu";
import { CommandFormPopup, type FieldConfig } from "../../components/dashboards/CommandFormPopup";
import type {
    HospitalApiDtosInputsMedicationStorageInputDto,
    HospitalApiDtosOutputsMedicationOutputDto,
    HospitalApiDtosOutputsMedicationStorageOutputDto,
} from "../../api";
import { MedicationStorageService } from "../../services/MedicationStorage";
import { MedicationService } from "../../services/Medication";

const amountFields: FieldConfig<HospitalApiDtosInputsMedicationStorageInputDto>[] = [
    { key: "amount", label: "Amount", type: "number", required: true },
];

export default function OneMedicin() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const storageId = Number(id);

    const [storage, setStorage] = useState<HospitalApiDtosOutputsMedicationStorageOutputDto | null>(null);
    const [medication, setMedication] = useState<HospitalApiDtosOutputsMedicationOutputDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [popupOpen, setPopupOpen] = useState(false);

    const loadStorage = () => {
        if (!id) return;
        MedicationStorageService.getById(storageId)
            .then((s) => {
                setStorage(s);
                return MedicationService.getById(s.fkMedicationId ?? 0);
            })
            .then(setMedication)
            .catch((err) => setError(err.message));
    };

    useEffect(() => {
        loadStorage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (error) return <Text data-testid="one-medicin-error" color="red.500">{error}</Text>;
    if (!storage || !medication) return <Text data-testid="one-medicin-loading">Loading medicin storage...</Text>;

    return (
        <Stack gap="4" data-testid="one-medicin-page">
            <Button data-testid="one-medicin-back-button" alignSelf="start" variant="outline" onClick={() => navigate("/app/medicin_storage")}>
                Back to medicin storage
            </Button>

            <HStack justify="space-between">
                <Heading data-testid="one-medicin-heading" size="lg">{medication.name}</Heading>
                <Button data-testid="one-medicin-edit-amount-button" onClick={() => setPopupOpen(true)}>
                    <LuPencil /> Change Amount
                </Button>
            </HStack>

            <Stack gap="2">
                <Text data-testid="one-medicin-field-id"><b>Storage Id:</b> {storage.id}</Text>
                <Text data-testid="one-medicin-field-amount"><b>Amount:</b> {storage.amount}</Text>
            </Stack>

            <Heading size="md" mt="4">Medication</Heading>
            <Stack gap="2">
                <Text data-testid="one-medicin-field-name"><b>Name:</b> {medication.name}</Text>
                <Text data-testid="one-medicin-field-generic-name"><b>Generic name:</b> {medication.genericName}</Text>
                <Text data-testid="one-medicin-field-brand"><b>Brand:</b> {medication.brand}</Text>
                <Text data-testid="one-medicin-field-form"><b>Form:</b> {medication.form}</Text>
                <Text data-testid="one-medicin-field-strength"><b>Strength:</b> {medication.strength}</Text>
                <Text data-testid="one-medicin-field-category"><b>Category:</b> {medication.category}</Text>
                <Text data-testid="one-medicin-field-description"><b>Description:</b> {medication.description}</Text>
            </Stack>

            <CommandFormPopup<HospitalApiDtosInputsMedicationStorageInputDto>
                open={popupOpen}
                onOpenChange={setPopupOpen}
                mode="edit"
                title="Medicin Storage"
                fields={amountFields}
                itemId={storage.id}
                initialValues={storage}
                service={MedicationStorageService}
                onSuccess={loadStorage}
                testId="one-medicin-form"
            />
        </Stack>
    );
}
