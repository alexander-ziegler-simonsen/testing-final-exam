import { useEffect, useState } from "react"
import { Box, Button, Heading, Input, Text, VStack, Spinner, HStack } from "@chakra-ui/react"
import { apiFetch } from "../api/client"
import { treatmentService } from "../services/TreatmentService"
import { prescriptionService } from "../services/PrescriptionService"
import { storageService } from "../services/StorageService"
import { medicationService } from "../services/MedicationService"
import type { Patient } from "../entites/Patient"
import type { Medication } from "../entites/Medication"
import type { MedicationStorage } from "../entites/MedicationStorage"
import type { LoginResponse } from "../entites/LoginResponse"

interface Props {
    patients: Patient[]
    onSuccess?: () => void
}

type ApprovalStep = "none" | "required" | "signing" | "approved"

function localDateTimeNow() {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
}

export default function GiveTreatment({ patients, onSuccess }: Props) {
    // data loaded on mount
    const [medications, setMedications] = useState<Medication[]>([])
    const [storages, setStorages] = useState<MedicationStorage[]>([])
    const [dataLoading, setDataLoading] = useState(true)

    // treatment form
    const [patientId, setPatientId] = useState<number | "">("")
    const [description, setDescription] = useState("")
    const [time, setTime] = useState(localDateTimeNow)

    // prescription form (optional)
    const [medicationId, setMedicationId] = useState<number | "">("")
    const [doses, setDoses] = useState("")

    // doctor approval flow
    const [approvalStep, setApprovalStep] = useState<ApprovalStep>("none")
    const [doctorUsername, setDoctorUsername] = useState("")
    const [doctorPassword, setDoctorPassword] = useState("")
    const [approvedDoctorId, setApprovedDoctorId] = useState<number | null>(null)
    const [approvedDoctorName, setApprovedDoctorName] = useState("")
    const [approvalLoading, setApprovalLoading] = useState(false)
    const [approvalError, setApprovalError] = useState<string | null>(null)

    // submit state
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        Promise.all([medicationService.getAll(), storageService.getAll()])
            .then(([meds, stors]) => {
                setMedications(meds)
                setStorages(stors)
            })
            .finally(() => setDataLoading(false))
    }, [])

    function storageFor(medId: number): MedicationStorage | undefined {
        return storages.find(s => s.fkMedicationId === medId)
    }

    function handleMedicationChange(newMedId: number | "") {
        setMedicationId(newMedId)
        setDoses("")
        setApprovedDoctorId(null)
        setApprovedDoctorName("")
        setApprovalError(null)
        setDoctorUsername("")
        setDoctorPassword("")
        setApprovalStep(newMedId !== "" ? "required" : "none")
    }

    async function handleDoctorLogin() {
        setApprovalLoading(true)
        setApprovalError(null)
        try {
            // Call login API directly — must NOT modify localStorage or the nurse's session
            const res = await apiFetch<LoginResponse>("/auth/login", {
                method: "POST",
                body: JSON.stringify({ username: doctorUsername, password: doctorPassword }),
            })
            if (res.role.toLowerCase() !== "doctor") {
                setApprovalError("Only a doctor can approve medication use.")
                return
            }
            setApprovedDoctorId(res.staffId)
            setApprovedDoctorName(`${res.firstname ?? ""} ${res.lastname ?? ""}`.trim())
            setApprovalStep("approved")
            setDoctorUsername("")
            setDoctorPassword("")
        } catch {
            setApprovalError("Invalid credentials. Please try again.")
        } finally {
            setApprovalLoading(false)
        }
    }

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()
        if (patientId === "") return

        const hasPrescription = medicationId !== ""
        const dosesNum = hasPrescription ? parseFloat(doses) : 0

        if (hasPrescription) {
            if (approvalStep !== "approved") {
                setError("A doctor must sign off before this medication can be prescribed.")
                return
            }
            const storage = storageFor(medicationId as number)
            if (!storage || storage.amount <= 0) {
                setError("Selected medication has no stock available.")
                return
            }
            if (isNaN(dosesNum) || dosesNum <= 0) {
                setError("Please enter a valid dose amount.")
                return
            }
            if (dosesNum > storage.amount) {
                setError(`Not enough stock. Available: ${storage.amount}.`)
                return
            }
        }

        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            // Step 1: create treatment, get back the new ID
            const treatmentId = await treatmentService.create({
                fkPatientId: patientId as number,
                description: description.trim() || undefined,
                time: new Date(time).toISOString(),
            })

            // Step 2: if medication selected, create prescription + deduct storage
            if (hasPrescription) {
                const storage = storageFor(medicationId as number)!

                // When doctor approval is required, use the approving doctor's ID;
                // otherwise (e.g. doctor dashboard) use the current logged-in staff's ID.
                const prescriberId = approvedDoctorId ?? 0

                await prescriptionService.create({
                    fkMedicationId: medicationId as number,
                    fkTreatmentId: treatmentId,
                    fkPrescribedByStaffId: prescriberId,
                    doses: dosesNum,
                })

                await storageService.update(storage.id, {
                    fkMedicationId: storage.fkMedicationId,
                    amount: storage.amount - dosesNum,
                })

                // keep local storage state in sync so amounts reflect immediately
                setStorages(prev =>
                    prev.map(s =>
                        s.id === storage.id ? { ...s, amount: s.amount - dosesNum } : s
                    )
                )
            }

            setSuccess(true)
            setDescription("")
            setTime(localDateTimeNow())
            handleMedicationChange("")
            onSuccess?.()
        } catch {
            setError("Something went wrong. The treatment may have been saved but the prescription or stock update failed.")
        } finally {
            setLoading(false)
        }
    }

    const needsDoctorSignOff = medicationId !== "" && approvalStep !== "approved"
    const canSubmit = !loading && patientId !== "" && !needsDoctorSignOff

    const selectStyle: React.CSSProperties = {
        width: "100%",
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #e2e8f0",
        fontSize: "14px",
        background: "white",
    }

    const selectStyleDisabled: React.CSSProperties = {
        ...selectStyle,
        background: "#f7fafc",
        color: "#718096",
        cursor: "not-allowed",
    }

    const textareaStyle: React.CSSProperties = {
        width: "100%",
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #e2e8f0",
        fontSize: "14px",
        resize: "vertical",
        minHeight: "80px",
        fontFamily: "inherit",
    }

    if (dataLoading) return <Box p={4}><Spinner /></Box>

    return (
        <Box borderWidth={1} borderRadius="lg" p={6}>
            <Heading size="md" mb={4}>Give Treatment</Heading>
            <form onSubmit={handleSubmit}>
                <VStack align="stretch" gap={4}>

                    {/* ── Treatment fields ── */}
                    <Box>
                        <Text fontWeight="medium" fontSize="sm" mb={1}>Patient</Text>
                        <select
                            value={patientId}
                            onChange={e => setPatientId(e.target.value === "" ? "" : Number(e.target.value))}
                            required
                            style={selectStyle}
                        >
                            <option value="">Select a patient…</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.firstname} {p.lastname} (#{p.id})
                                </option>
                            ))}
                        </select>
                    </Box>

                    <Box>
                        <Text fontWeight="medium" fontSize="sm" mb={1}>Description (optional)</Text>
                        <textarea
                            placeholder="Describe the treatment…"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            style={textareaStyle}
                        />
                    </Box>

                    <Box>
                        <Text fontWeight="medium" fontSize="sm" mb={1}>Time</Text>
                        <Input
                            type="datetime-local"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            required
                        />
                    </Box>

                    {/* ── Optional prescription ── */}
                    <Box borderWidth={1} borderRadius="md" p={4} bg="gray.50">
                        <Text fontWeight="semibold" fontSize="sm" mb={3}>
                            Prescription (optional)
                        </Text>

                        <VStack align="stretch" gap={3}>
                            <Box>
                                <Text fontSize="sm" mb={1}>Medication</Text>
                                <select
                                    value={medicationId}
                                    onChange={e => handleMedicationChange(
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )}
                                    style={approvalStep === "approved" ? selectStyleDisabled : selectStyle}
                                    disabled={approvalStep === "approved"}
                                >
                                    <option value="">No medication</option>
                                    {medications.map(m => {
                                        const storage = storageFor(m.id)
                                        const stock = storage?.amount ?? 0
                                        const outOfStock = stock <= 0
                                        return (
                                            <option key={m.id} value={m.id} disabled={outOfStock}>
                                                {m.name ?? m.genericName ?? `Medication #${m.id}`}
                                                {m.strength ? ` — ${m.strength}` : ""}
                                                {" "}({outOfStock ? "out of stock" : `${stock} in stock`})
                                            </option>
                                        )
                                    })}
                                </select>
                            </Box>

                            {medicationId !== "" && (
                                <Box>
                                    <HStack gap={2} align="center" mb={1}>
                                        <Text fontSize="sm">Doses</Text>
                                        {storageFor(medicationId as number) && (
                                            <Text fontSize="xs" color="gray.500">
                                                (max {storageFor(medicationId as number)!.amount})
                                            </Text>
                                        )}
                                    </HStack>
                                    <Input
                                        type="number"
                                        min={0.01}
                                        step="any"
                                        max={storageFor(medicationId as number)?.amount}
                                        placeholder="e.g. 2"
                                        value={doses}
                                        onChange={e => setDoses(e.target.value)}
                                        required={!!medicationId}
                                        disabled={approvalStep === "approved"}
                                    />
                                </Box>
                            )}
                        </VStack>
                    </Box>

                    {/* ── Doctor approval panel ── */}
                    {medicationId !== "" && (
                        <>
                            {approvalStep === "required" && (
                                <Box
                                    bg="orange.50"
                                    borderWidth={1}
                                    borderColor="orange.300"
                                    borderRadius="md"
                                    p={4}
                                >
                                    <Text color="orange.700" fontWeight="medium" mb={3}>
                                        This medication requires a doctor to sign off before it can be prescribed.
                                    </Text>
                                    <HStack gap={2}>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleMedicationChange("")}
                                        >
                                            Remove medication
                                        </Button>
                                        <Button
                                            size="sm"
                                            bg="orange.500"
                                            color="white"
                                            onClick={() => setApprovalStep("signing")}
                                        >
                                            Doctor sign-off
                                        </Button>
                                    </HStack>
                                </Box>
                            )}

                            {approvalStep === "signing" && (
                                <Box borderWidth={1} borderColor="blue.200" borderRadius="md" p={4}>
                                    <Text fontWeight="medium" mb={3}>Doctor authentication</Text>
                                    <VStack align="stretch" gap={3}>
                                        <Input
                                            placeholder="Doctor username"
                                            value={doctorUsername}
                                            onChange={e => setDoctorUsername(e.target.value)}
                                            autoComplete="off"
                                        />
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            value={doctorPassword}
                                            onChange={e => setDoctorPassword(e.target.value)}
                                            autoComplete="off"
                                            onKeyDown={e => e.key === "Enter" && handleDoctorLogin()}
                                        />
                                        {approvalError && (
                                            <Text color="red.500" fontSize="sm">{approvalError}</Text>
                                        )}
                                        <HStack gap={2}>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setApprovalStep("required")
                                                    setApprovalError(null)
                                                    setDoctorUsername("")
                                                    setDoctorPassword("")
                                                }}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                size="sm"
                                                bg="blue.500"
                                                color="white"
                                                onClick={handleDoctorLogin}
                                                disabled={approvalLoading || !doctorUsername || !doctorPassword}
                                            >
                                                {approvalLoading ? <Spinner size="sm" /> : "Authenticate"}
                                            </Button>
                                        </HStack>
                                    </VStack>
                                </Box>
                            )}

                            {approvalStep === "approved" && (
                                <Box
                                    bg="green.50"
                                    borderWidth={1}
                                    borderColor="green.300"
                                    borderRadius="md"
                                    p={3}
                                >
                                    <Text color="green.700" fontSize="sm">
                                        Approved by Dr. {approvedDoctorName}
                                    </Text>
                                </Box>
                            )}
                        </>
                    )}

                    {error && <Text color="red.500" fontSize="sm">{error}</Text>}
                    {success && <Text color="green.500" fontSize="sm">Treatment recorded successfully.</Text>}

                    <Button
                        type="submit"
                        bg="blue.500"
                        color="white"
                        disabled={!canSubmit}
                        alignSelf="flex-start"
                    >
                        {loading ? <Spinner size="sm" /> : "Give Treatment"}
                    </Button>
                </VStack>
            </form>
        </Box>
    )
}
