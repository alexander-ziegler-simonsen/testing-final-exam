import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import { DataTable, type ColumnConfig } from "../../components/dashboards/DataTable";
import type {
    HospitalApiDtosOutputsPatientOutputDto,
    HospitalApiDtosOutputsTreatmentOutputDto,
} from "../../api";
import { PatientService } from "../../services/Patient";
import { TreatmentService } from "../../services/Treatment";

export default function OnePatient() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [patient, setPatient] = useState<HospitalApiDtosOutputsPatientOutputDto | null>(null);
    const [treatments, setTreatments] = useState<HospitalApiDtosOutputsTreatmentOutputDto[]>([]);
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

    const treatmentColumns: ColumnConfig<HospitalApiDtosOutputsTreatmentOutputDto>[] = [
        { key: "id", header: "Id" },
        { key: "description", header: "Description", enableSearch: true },
        {
            key: "time",
            header: "Time",
            render: (value) => (value ? new Date(String(value)).toLocaleString() : ""),
        },
    ];

    if (error) return <Text color="red.500">{error}</Text>;
    if (!patient) return <Text>Loading patient...</Text>;

    return (
        <Stack gap="4">
            <Button alignSelf="start" variant="outline" onClick={() => navigate("/app/patients")}>
                Back to patients
            </Button>

            <Heading size="lg">{patient.firstname} {patient.lastname}</Heading>

            <Stack gap="2">
                <Text><b>Id:</b> {patient.id}</Text>
                <Text><b>First name:</b> {patient.firstname}</Text>
                <Text><b>Last name:</b> {patient.lastname}</Text>
                <Text><b>Gender:</b> {patient.gender}</Text>
                <Text><b>CPR Number:</b> {patient.cprNumber}</Text>
            </Stack>

            <Heading size="md" mt="4">Treatments</Heading>
            <DataTable
                data={treatments}
                columns={treatmentColumns}
                pageSize={5}
                onRowClick={(treatment) => navigate(`/app/treatment/${treatment.id}`)}
            />
        </Stack>
    );
}
