import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import { DataTable, type ColumnConfig } from "../../../components/dashboards/DataTable";
import type { PatientResponse } from "../../../api/Responses/PatientResponse";
import type { TreatmentResponse } from "../../../api/Responses/TreatmentResponse";
import { TreatmentService } from "../../../api/Services/Treatment";
import { PatientService } from "../../../api/Services/Patient";

export default function OnePatient() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [patient, setPatient] = useState<PatientResponse | null>(null);
    const [treatments, setTreatments] = useState<TreatmentResponse[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        PatientService.getById(Number(id))
            .then(setPatient)
            .catch((err) => setError(err.message));
        TreatmentService.getAll({ fkPatientId: Number(id) })
            .then(setTreatments)
            .catch((err) => setError(err.message));
    }, [id]);

    const treatmentColumns: ColumnConfig<TreatmentResponse>[] = [
        { key: "id", header: "Id" },
        { key: "description", header: "Description", enableSearch: true },
        { key: "time", header: "Time", render: (_value, item) => item.time.toLocaleString(), },
    ];

    if (error) return <Text data-testid="one-patient-error" color="red.500">{error}</Text>;
    if (!patient) return <Text data-testid="one-patient-loading">Loading patient...</Text>;

    return (
        <Stack gap="4" data-testid="one-patient-page">
            <Button data-testid="one-patient-back-button" alignSelf="start" variant="outline" onClick={() => navigate("/app/patients")}>Back to patients</Button>

            <Heading data-testid="one-patient-heading" size="lg">{patient.firstname} {patient.lastname}</Heading>

            <Stack gap="2">
                <Text data-testid="one-patient-field-id"><b>Id:</b> {patient.id}</Text>
                <Text data-testid="one-patient-field-firstname"><b>First name:</b> {patient.firstname}</Text>
                <Text data-testid="one-patient-field-lastname"><b>Last name:</b> {patient.lastname}</Text>
                <Text data-testid="one-patient-field-gender"><b>Gender:</b> {patient.gender}</Text>
                <Text data-testid="one-patient-field-cpr"><b>CPR Number:</b> {patient.cprNumber}</Text>
                <Text data-testid="one-patient-field-date-of-birth"><b>Date of birth:</b> {patient.dateOfBirth?.toISOString().slice(0, 10)}</Text>
                <Text data-testid="one-patient-field-weight"><b>Weight:</b> {patient.weightKg != null ? `${patient.weightKg} kg` : ""}</Text>
                <Text data-testid="one-patient-field-height"><b>Height:</b> {patient.heightCm != null ? `${patient.heightCm} cm` : ""}</Text>
            </Stack>

            <Heading size="md" mt="4">Treatments</Heading>
            <DataTable testId="patient-treatments-table" data={treatments} columns={treatmentColumns} pageSize={5} onRowClick={(treatment) => navigate(`/app/treatment/${treatment.id}`)} />
        </Stack>
    );
}
