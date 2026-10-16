import { Box, Button, Field, Heading, HStack, Input, NativeSelect, Stack, Text } from "@chakra-ui/react";
import { DataTable, type ColumnConfig } from "../../../../components/dashboards/DataTable";
import { TreatmentService } from "../../../../services/patients/Treatment";
import { useEffect, useMemo, useState } from "react";
import { PatientService } from "../../../../services/patients/Patient";
import { authLogin, zHospitalApiDtosInputsLoginInputDto, type HospitalApiDtosOutputsMedicationOutputDto, type HospitalApiDtosOutputsMedicationStorageOutputDto, type HospitalApiDtosOutputsPatientOutputDto, type HospitalApiDtosOutputsTreatmentOutputDto } from "../../../../api";
import { useNavigate, useParams } from "react-router";
import { toaster } from "../../../../components/ui/toaster";
import { MedicationService } from "../../../../services/medicin/Medication";
import { MedicationStorageService } from "../../../../services/medicin/MedicationStorage";
import { useAuthStore } from "../../../../stores/AuthStore";
import { PrescriptionService } from "../../../../services/patients/Prescription";

// give treatment
type ApprovalStep = "none" | "required" | "signing" | "approved";

const nowAsDatetimeLocal = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
};

// The API's zod schema requires a full ISO datetime (seconds + timezone),
// but datetime-local inputs only produce "YYYY-MM-DDTHH:mm".
const fromDatetimeLocal = (value: string): string | undefined => {
    if (!value) return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

export default function OnePatientPage() {
    // patient and treatment list
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

    // give treatment
    const staffId = useAuthStore((state) => state.user?.staffId);

    const [patients, setPatients] = useState<HospitalApiDtosOutputsPatientOutputDto[]>([]);
    const [medications, setMedications] = useState<HospitalApiDtosOutputsMedicationOutputDto[]>([]);
    const [storages, setStorages] = useState<HospitalApiDtosOutputsMedicationStorageOutputDto[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    // treatment fields
    const [patientId, setPatientId] = useState<number | "">("");
    const [description, setDescription] = useState("");
    const [time, setTime] = useState(nowAsDatetimeLocal);

    // optional prescription fields
    const [medicationId, setMedicationId] = useState<number | "">("");
    const [doses, setDoses] = useState("");

    // doctor sign-off, required whenever a medication is selected
    const [approvalStep, setApprovalStep] = useState<ApprovalStep>("none");
    const [doctorUsername, setDoctorUsername] = useState("");
    const [doctorPassword, setDoctorPassword] = useState("");
    const [approvedDoctorId, setApprovedDoctorId] = useState<number | null>(null);
    const [approvedDoctorName, setApprovedDoctorName] = useState("");
    const [approvalLoading, setApprovalLoading] = useState(false);
    const [approvalError, setApprovalError] = useState<string | null>(null);

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        Promise.all([PatientService.getAll(), MedicationService.getAll(), MedicationStorageService.getAll()])
            .then(([patientData, medicationData, storageData]) => {
                setPatients(patientData);
                setMedications(medicationData);
                setStorages(storageData);
            })
            .catch((error) => toaster.create({ type: "error", title: "Failed to load form data", description: error?.message }))
            .finally(() => setDataLoading(false));
    }, []);

    const storageFor = (medicationId: number) => storages.find((storage) => storage.fkMedicationId === medicationId);

    const patientOptions = useMemo(
        () =>
            patients.map((patient) => ({
                value: patient.id ?? 0,
                label: `${patient.firstname ?? ""} ${patient.lastname ?? ""} (#${patient.id})`,
            })),
        [patients],
    );

    const handleMedicationChange = (newMedicationId: number | "") => {
        setMedicationId(newMedicationId);
        setDoses("");
        setApprovedDoctorId(null);
        setApprovedDoctorName("");
        setApprovalError(null);
        setDoctorUsername("");
        setDoctorPassword("");
        setApprovalStep(newMedicationId !== "" ? "required" : "none");
    };

    const handleDoctorLogin = async () => {
        setApprovalLoading(true);
        setApprovalError(null);
        try {
            // Verify the doctor's credentials via the raw login endpoint - NOT
            // AuthService.login, which would overwrite the shared API client's
            // bearer token and hijack the current staff member's session.
            const body = zHospitalApiDtosInputsLoginInputDto.parse({ username: doctorUsername, password: doctorPassword });
            const { data, error } = await authLogin({ body });
            if (error || !data) {
                setApprovalError("Invalid credentials. Please try again.");
                return;
            }
            if ((data.role ?? "").toLowerCase() !== "doctor") {
                setApprovalError("Only a doctor can approve medication use.");
                return;
            }
            setApprovedDoctorId(data.staffId ?? null);
            setApprovedDoctorName(`${data.firstname ?? ""} ${data.lastname ?? ""}`.trim());
            setApprovalStep("approved");
            setDoctorUsername("");
            setDoctorPassword("");
        } catch {
            setApprovalError("Invalid credentials. Please try again.");
        } finally {
            setApprovalLoading(false);
        }
    };

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (patientId === "") {
            toaster.create({ type: "error", title: "Missing patient", description: "Please select a patient." });
            return;
        }

        const hasPrescription = medicationId !== "";
        const dosesNum = hasPrescription ? Number.parseFloat(doses) : 0;
        let storage: HospitalApiDtosOutputsMedicationStorageOutputDto | undefined;

        if (hasPrescription) {
            if (approvalStep !== "approved") {
                toaster.create({ type: "error", title: "Doctor sign-off required", description: "A doctor must sign off before this medication can be prescribed." });
                return;
            }
            storage = storageFor(medicationId as number);
            if (!storage || storage.id === undefined || (storage.amount ?? 0) <= 0) {
                toaster.create({ type: "error", title: "Out of stock", description: "Selected medication has no stock available." });
                return;
            }
            if (Number.isNaN(dosesNum) || dosesNum <= 0) {
                toaster.create({ type: "error", title: "Invalid dose", description: "Please enter a valid dose amount." });
                return;
            }
            if (dosesNum > (storage.amount ?? 0)) {
                toaster.create({ type: "error", title: "Not enough stock", description: `Available: ${storage.amount}.` });
                return;
            }
        }

        setSubmitting(true);
        try {
            const treatmentId = await TreatmentService.create(
                { fkPatientId: patientId as number, description: description.trim() || undefined, time: fromDatetimeLocal(time) },
                staffId,
            );

            if (hasPrescription && storage) {
                // The approving doctor is the prescriber of record.
                await PrescriptionService.create({
                    fkMedicationId: medicationId as number,
                    fkTreatmentId: treatmentId,
                    fkPrescribedByStaffId: approvedDoctorId ?? 0,
                    doses: dosesNum,
                });

                await MedicationStorageService.update(storage.id!, {
                    fkMedicationId: storage.fkMedicationId,
                    amount: (storage.amount ?? 0) - dosesNum,
                });

                const updatedStorage = storage;
                setStorages((prev) =>
                    prev.map((entry) => (entry.id === updatedStorage.id ? { ...entry, amount: (entry.amount ?? 0) - dosesNum } : entry)),
                );
            }

            toaster.create({
                type: "success",
                title: "Treatment recorded",
                description: hasPrescription ? "Treatment and prescription saved." : "Treatment saved.",
            });

            setPatientId("");
            setDescription("");
            setTime(nowAsDatetimeLocal());
            handleMedicationChange("");
        } catch (error: any) {
            toaster.create({ type: "error", title: "Failed to save treatment", description: error?.message ?? "Something went wrong." });
        } finally {
            setSubmitting(false);
        }
    };

    const needsDoctorSignOff = medicationId !== "" && approvalStep !== "approved";
    const canSubmit = !submitting && patientId !== "" && !needsDoctorSignOff;
    const selectedStorage = medicationId !== "" ? storageFor(medicationId as number) : undefined;

    const treatmentColumns: ColumnConfig<HospitalApiDtosOutputsTreatmentOutputDto>[] = [
        { key: "id", header: "Id" },
        { key: "description", header: "Description", enableSearch: true },
        { key: "time", header: "Time", render: (value) => (value ? new Date(String(value)).toLocaleString() : ""), },
    ];

    if (error) return <Text data-testid="one-patient-error" color="red.500">{error}</Text>;
    if (!patient) return <Text data-testid="one-patient-loading">Loading patient...</Text>;
    if (dataLoading) return <Text data-testid="give-treatment-loading">Loading...</Text>;

    return (
        <>
            <Text data-testid="placeholderText">OnePatientPage</Text>
            <Stack gap="4" data-testid="one-patient-page">
                <Button data-testid="one-patient-back-button" alignSelf="start" variant="outline" onClick={() => navigate("/app/patients")}>Back to patients</Button>

                <HStack gap="60" align="center" wrap="wrap">
                    <div>
                        <Heading data-testid="one-patient-heading" size="lg">{patient.firstname} {patient.lastname}</Heading>

                        <Stack gap="2">
                            <Text data-testid="one-patient-field-id"><b>Id:</b> {patient.id}</Text>
                            <Text data-testid="one-patient-field-firstname"><b>First name:</b> {patient.firstname}</Text>
                            <Text data-testid="one-patient-field-lastname"><b>Last name:</b> {patient.lastname}</Text>
                            <Text data-testid="one-patient-field-gender"><b>Gender:</b> {patient.gender}</Text>
                            <Text data-testid="one-patient-field-cpr"><b>CPR Number:</b> {patient.cprNumber}</Text>
                            <Text data-testid="one-patient-field-date-of-birth"><b>Date of birth:</b> {patient.dateOfBirth}</Text>
                            <Text data-testid="one-patient-field-weight"><b>Weight:</b> {patient.weightKg != null ? `${patient.weightKg} kg` : ""}</Text>
                            <Text data-testid="one-patient-field-height"><b>Height:</b> {patient.heightCm != null ? `${patient.heightCm} cm` : ""}</Text>
                        </Stack>
                    </div>
                    <div>
                        <Stack gap="4" data-testid="give-treatment-page" maxW="2xl">
                            <Text data-testid="give-treatment-page-heading" fontSize="xl" fontWeight="bold">Give Treatment</Text>

                            <form onSubmit={handleSubmit}>
                                <Stack gap="4">
                                    <Field.Root required>
                                        <Field.Label>Patient <Field.RequiredIndicator /></Field.Label>
                                        <NativeSelect.Root size="sm" width="full">
                                            <NativeSelect.Field data-testid="give-treatment-field-patient" value={patientId} onChange={(e) => setPatientId(e.target.value === "" ? "" : Number(e.target.value))}>
                                                <option value="" disabled>Select a patient… </option>
                                                {patientOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Description</Field.Label>
                                        <Input data-testid="give-treatment-field-description" placeholder="Describe the treatment…" value={description} onChange={(e) => setDescription(e.target.value)} />
                                    </Field.Root>

                                    <Field.Root required>
                                        <Field.Label>Time <Field.RequiredIndicator /></Field.Label>
                                        <Input data-testid="give-treatment-field-time" type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)}
                                        />
                                    </Field.Root>

                                    <Box borderWidth="1px" borderRadius="md" p="4" borderColor="border">
                                        <Text fontWeight="semibold" fontSize="sm" mb="3">Prescription (optional)</Text>

                                        <Stack gap="3">
                                            <Field.Root>
                                                <Field.Label>Medication</Field.Label>
                                                <NativeSelect.Root size="sm" width="full" disabled={approvalStep === "approved"}>
                                                    <NativeSelect.Field data-testid="give-treatment-field-medication" value={medicationId} onChange={(e) => handleMedicationChange(e.target.value === "" ? "" : Number(e.target.value))}>
                                                        <option value="">No medication</option>
                                                        {medications.map((medication) => {
                                                            const storage = storageFor(medication.id ?? -1);
                                                            const stock = storage?.amount ?? 0;
                                                            const outOfStock = stock <= 0;
                                                            return (
                                                                <option key={medication.id} value={medication.id} disabled={outOfStock}>
                                                                    {medication.name ?? medication.genericName ?? `Medication #${medication.id}`}
                                                                    {medication.strength ? ` — ${medication.strength}` : ""} ({outOfStock ? "out of stock" : `${stock} in stock`})
                                                                </option>
                                                            );
                                                        })}
                                                    </NativeSelect.Field>
                                                    <NativeSelect.Indicator />
                                                </NativeSelect.Root>
                                            </Field.Root>

                                            {medicationId !== "" && (
                                                <Field.Root required>
                                                    <Field.Label>Doses {selectedStorage && (
                                                        <Text as="span" fontSize="xs" color="fg.muted" ml="1">(max {selectedStorage.amount})</Text>)} <Field.RequiredIndicator />
                                                    </Field.Label>
                                                    <Input data-testid="give-treatment-field-doses" type="number" min={0.01} step="any" max={selectedStorage?.amount} placeholder="e.g. 2" value={doses} onChange={(e) => setDoses(e.target.value)} disabled={approvalStep === "approved"} />
                                                </Field.Root>
                                            )}
                                        </Stack>
                                    </Box>

                                    {medicationId !== "" && approvalStep === "required" && (
                                        <Box bg="orange.subtle" borderWidth="1px" borderColor="orange.muted" borderRadius="md" p="4">
                                            <Text color="orange.fg" fontWeight="medium" mb="3">This medication requires a doctor to sign off before it can be prescribed.</Text>
                                            <HStack gap="2">
                                                <Button size="sm" variant="outline" data-testid="give-treatment-remove-medication-button" onClick={() => handleMedicationChange("")}>Remove medication</Button>
                                                <Button size="sm" colorPalette="orange" data-testid="give-treatment-sign-off-button" onClick={() => setApprovalStep("signing")}>Doctor sign-off</Button>
                                            </HStack>
                                        </Box>
                                    )}

                                    {medicationId !== "" && approvalStep === "signing" && (
                                        <Box borderWidth="1px" borderColor="border" borderRadius="md" p="4">
                                            <Text fontWeight="medium" mb="3">Doctor authentication</Text>
                                            <Stack gap="3">
                                                <Input data-testid="give-treatment-doctor-username-input" placeholder="Doctor username" value={doctorUsername} onChange={(e) => setDoctorUsername(e.target.value)} autoComplete="off" />
                                                <Input data-testid="give-treatment-doctor-password-input" type="password" placeholder="Password" value={doctorPassword} onChange={(e) => setDoctorPassword(e.target.value)} autoComplete="off" onKeyDown={(e) => e.key === "Enter" && handleDoctorLogin()} />
                                                {approvalError && (
                                                    <Text data-testid="give-treatment-approval-error" color="red.500" fontSize="sm">{approvalError}</Text>
                                                )}
                                                <HStack gap="2">
                                                    <Button size="sm" variant="outline" onClick={() => {
                                                        setApprovalStep("required");
                                                        setApprovalError(null);
                                                        setDoctorUsername("");
                                                        setDoctorPassword("");
                                                    }}>Back</Button>
                                                    <Button size="sm" colorPalette="blue" data-testid="give-treatment-authenticate-button" onClick={handleDoctorLogin} loading={approvalLoading} disabled={!doctorUsername || !doctorPassword}>Authenticate</Button>
                                                </HStack>
                                            </Stack>
                                        </Box>
                                    )}

                                    {medicationId !== "" && approvalStep === "approved" && (
                                        <Box bg="green.subtle" borderWidth="1px" borderColor="green.muted" borderRadius="md" p="3">
                                            <Text color="green.fg" fontSize="sm" data-testid="give-treatment-approved-text">Approved by Dr. {approvedDoctorName}</Text>
                                        </Box>
                                    )}

                                    <Button type="submit" colorPalette="blue" alignSelf="start" data-testid="give-treatment-submit-button" loading={submitting} disabled={!canSubmit}>Give Treatment</Button>
                                </Stack>
                            </form>
                        </Stack>
                    </div>

                </HStack>

                <Heading size="md" mt="4">Treatments</Heading>
                <DataTable testId="patient-treatments-table" data={treatments} columns={treatmentColumns} pageSize={5} onRowClick={(treatment) => navigate(`/app/treatment/${treatment.id}`)} />
            </Stack>
        </>
    );
}
