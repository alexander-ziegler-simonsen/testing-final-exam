import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import { DataTable, type ColumnConfig } from "../../components/dashboards/DataTable";
import type {
    HospitalApiDtosOutputsMedicationOutputDto,
    HospitalApiDtosOutputsPatientOutputDto,
    HospitalApiDtosOutputsPrescriptionOutputDto,
    HospitalApiDtosOutputsStaffOutputDto,
    HospitalApiDtosOutputsTreatmentOutputDto,
} from "../../api";
import { TreatmentService } from "../../services/Treatment";
import { PatientService } from "../../services/Patient";
import { PrescriptionService } from "../../services/Prescription";
import { TreatmentStaffService } from "../../services/TreatmentStaff";
import { StaffService } from "../../services/Staff";
import { MedicationService } from "../../services/Medication";

interface PrescriptionRow {
    id?: number;
    medicationName: string;
    doses: number;
    prescribedByName: string;
}

export default function OneTreatment() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const treatmentId = Number(id);

    const [treatment, setTreatment] = useState<HospitalApiDtosOutputsTreatmentOutputDto | null>(null);
    const [patient, setPatient] = useState<HospitalApiDtosOutputsPatientOutputDto | null>(null);
    const [prescriptions, setPrescriptions] = useState<HospitalApiDtosOutputsPrescriptionOutputDto[]>([]);
    const [assignedStaff, setAssignedStaff] = useState<HospitalApiDtosOutputsStaffOutputDto[]>([]);
    const [staff, setStaff] = useState<HospitalApiDtosOutputsStaffOutputDto[]>([]);
    const [medications, setMedications] = useState<HospitalApiDtosOutputsMedicationOutputDto[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        TreatmentService.getById(treatmentId)
            .then((t) => {
                setTreatment(t);
                return PatientService.getById(t.fkPatientId ?? 0);
            })
            .then(setPatient)
            .catch((err) => setError(err.message));

        PrescriptionService.getAll()
            .then((all) => setPrescriptions(all.filter((p) => p.fkTreatmentId === treatmentId)))
            .catch((err) => setError(err.message));

        TreatmentStaffService.getAll()
            .then(async (all) => {
                const links = all.filter((ts) => ts.fkTreatmentId === treatmentId);
                const staffMembers = await Promise.all(links.map((ts) => StaffService.getById(ts.fkStaffId ?? 0)));
                setAssignedStaff(staffMembers);
            })
            .catch((err) => setError(err.message));

        StaffService.getAll().then(setStaff).catch((err) => setError(err.message));
        MedicationService.getAll().then(setMedications).catch((err) => setError(err.message));
    }, [id, treatmentId]);

    const staffMap = useMemo(() => new Map(staff.map((s) => [s.id, s])), [staff]);
    const medicationMap = useMemo(() => new Map(medications.map((m) => [m.id, m])), [medications]);

    const prescriptionRows: PrescriptionRow[] = useMemo(
        () =>
            prescriptions.map((p) => {
                const medication = medicationMap.get(p.fkMedicationId);
                const prescriber = staffMap.get(p.fkPrescribedByStaffId);
                return {
                    id: p.id,
                    medicationName: medication?.name ?? `Medication #${p.fkMedicationId}`,
                    doses: p.doses ?? 0,
                    prescribedByName: prescriber ? `${prescriber.firstname} ${prescriber.lastname}` : `Staff #${p.fkPrescribedByStaffId}`,
                };
            }),
        [prescriptions, medicationMap, staffMap],
    );

    const prescriptionColumns: ColumnConfig<PrescriptionRow>[] = [
        { key: "medicationName", header: "Medication", enableSearch: true },
        { key: "doses", header: "Doses" },
        { key: "prescribedByName", header: "Prescribed By", enableSearch: true },
    ];

    const staffColumns: ColumnConfig<HospitalApiDtosOutputsStaffOutputDto>[] = [
        { key: "id", header: "Id" },
        { key: "firstname", header: "First name", enableSearch: true },
        { key: "lastname", header: "Last name", enableSearch: true },
    ];

    if (error) return <Text color="red.500">{error}</Text>;
    if (!treatment || !patient) return <Text>Loading treatment...</Text>;

    return (
        <Stack gap="4">
            <Button alignSelf="start" variant="outline" onClick={() => navigate("/app/treatment")}>
                Back to treatments
            </Button>

            <Heading size="lg">Treatment #{treatment.id}</Heading>

            <Stack gap="2">
                <Text><b>Description:</b> {treatment.description}</Text>
                <Text><b>Time:</b> {treatment.time ? new Date(treatment.time).toLocaleString() : ""}</Text>
            </Stack>

            <Heading size="md" mt="4">Patient</Heading>
            <Stack gap="2">
                <Text>
                    <b>Name:</b>{" "}
                    <Text
                        as="span"
                        color="blue.600"
                        cursor="pointer"
                        onClick={() => navigate(`/app/patients/${patient.id}`)}
                    >
                        {patient.firstname} {patient.lastname}
                    </Text>
                </Text>
                <Text><b>CPR Number:</b> {patient.cprNumber}</Text>
                <Text><b>Gender:</b> {patient.gender}</Text>
            </Stack>

            <Heading size="md" mt="4">Assigned Staff</Heading>
            <DataTable data={assignedStaff} columns={staffColumns} pageSize={5} />

            <Heading size="md" mt="4">Prescriptions &amp; Medication</Heading>
            <DataTable data={prescriptionRows} columns={prescriptionColumns} pageSize={5} />
        </Stack>
    );
}
