import { useEffect, useState } from "react"
import { Box, Button, Heading, HStack, Input, Spinner, Table, Text, VStack } from "@chakra-ui/react"
import { prescriptionService, type PrescriptionInput } from "../services/PrescriptionService"
import { medicationService } from "../services/MedicationService"
import { treatmentService } from "../services/TreatmentService"
import { staffService } from "../services/StaffService"
import type { Prescription } from "../entites/Prescription"
import type { Medication } from "../entites/Medication"
import type { Treatment } from "../entites/Treatment"
import type { Staff } from "../entites/Staff"

const emptyForm = (): PrescriptionInput => ({
    fkMedicationId: 0,
    fkTreatmentId: 0,
    fkPrescribedByStaffId: 0,
    doses: 0,
})

const selectStyle: React.CSSProperties = {
    width: "100%", padding: "8px 12px", borderRadius: "6px",
    border: "1px solid #e2e8f0", fontSize: "14px", background: "white",
}

export default function PrescriptionManagement() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
    const [medications, setMedications] = useState<Medication[]>([])
    const [treatments, setTreatments] = useState<Treatment[]>([])
    const [staff, setStaff] = useState<Staff[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    const [editing, setEditing] = useState<Prescription | null>(null)
    const [form, setForm] = useState<PrescriptionInput>(emptyForm())
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState<string | null>(null)

    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([
            prescriptionService.getAll(),
            medicationService.getAll(),
            treatmentService.getAll(),
            staffService.getAll(),
        ])
            .then(([ps, meds, treats, stf]) => {
                setPrescriptions(ps)
                setMedications(meds)
                setTreatments(treats)
                setStaff(stf)
            })
            .catch(() => setLoadError("Failed to load prescriptions."))
            .finally(() => setLoading(false))
    }, [])

    function medLabel(id: number) {
        const medication = medications.find(med => med.id === id)
        return medication ? (medication.name ?? medication.genericName ?? `#${id}`) : `#${id}`
    }

    function treatmentLabel(id: number) {
        const treatment = treatments.find(treatment => treatment.id === id)
        return treatment ? `#${id}${treatment.description ? ` — ${treatment.description.slice(0, 30)}` : ""}` : `#${id}`
    }

    function staffLabel(id: number) {
        const staffMember = staff.find(member => member.id === id)
        return staffMember ? `${staffMember.firstname ?? ""} ${staffMember.lastname ?? ""}`.trim() || `#${id}` : `#${id}`
    }

    function startEdit(prescription: Prescription) {
        setEditing(prescription)
        setForm({
            fkMedicationId: prescription.fkMedicationId,
            fkTreatmentId: prescription.fkTreatmentId,
            fkPrescribedByStaffId: prescription.fkPrescribedByStaffId,
            doses: prescription.doses,
        })
        setFormError(null)
        setFormSuccess(null)
    }

    function cancelEdit() {
        setEditing(null)
        setForm(emptyForm())
        setFormError(null)
        setFormSuccess(null)
    }

    async function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        if (!form.fkMedicationId || !form.fkTreatmentId || !form.fkPrescribedByStaffId) {
            setFormError("All fields are required.")
            return
        }
        if (form.doses <= 0) {
            setFormError("Doses must be greater than 0.")
            return
        }

        setSubmitting(true)
        setFormError(null)
        setFormSuccess(null)

        try {
            if (editing) {
                await prescriptionService.update(editing.id, form)
                setPrescriptions(prev => prev.map(prescription => prescription.id === editing.id ? { ...prescription, ...form } : prescription))
                setFormSuccess("Prescription updated.")
            } else {
                await prescriptionService.create(form)
                const updated = await prescriptionService.getAll()
                setPrescriptions(updated)
                setFormSuccess("Prescription created.")
            }
            setEditing(null)
            setForm(emptyForm())
        } catch {
            setFormError(editing ? "Failed to update prescription." : "Failed to create prescription.")
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(id: number) {
        setDeletingId(id)
        setDeleteError(null)
        try {
            await prescriptionService.delete(id)
            setPrescriptions(prev => prev.filter(prescription => prescription.id !== id))
        } catch {
            setDeleteError("Failed to delete prescription.")
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) return <Box p={4}><Spinner /></Box>
    if (loadError) return <Box p={4}><Text color="red.500">{loadError}</Text></Box>

    return (
        <Box>
            {/* Form */}
            <Box borderWidth={1} borderRadius="lg" p={6} mb={6}>
                <Heading size="sm" mb={4}>
                    {editing ? `Editing prescription #${editing.id}` : "Add Prescription"}
                </Heading>
                <form onSubmit={handleSubmit}>
                    <VStack align="stretch" gap={3}>
                        <HStack gap={4}>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Medication</Text>
                                <select value={form.fkMedicationId || ""} onChange={event => setForm(prevForm => ({ ...prevForm, fkMedicationId: Number(event.target.value) }))} style={selectStyle} required>
                                    <option value="">Select medication…</option>
                                    {medications.map(med => (
                                        <option key={med.id} value={med.id}>
                                            {med.name ?? med.genericName ?? `#${med.id}`}
                                            {med.strength ? ` — ${med.strength}` : ""}
                                        </option>
                                    ))}
                                </select>
                            </Box>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Treatment</Text>
                                <select value={form.fkTreatmentId || ""} onChange={event => setForm(prevForm => ({ ...prevForm, fkTreatmentId: Number(event.target.value) }))} style={selectStyle} required>
                                    <option value="">Select treatment…</option>
                                    {treatments.map(treatment => (
                                        <option key={treatment.id} value={treatment.id}>
                                            {treatmentLabel(treatment.id)}
                                        </option>
                                    ))}
                                </select>
                            </Box>
                        </HStack>

                        <HStack gap={4}>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Prescribed by</Text>
                                <select value={form.fkPrescribedByStaffId || ""} onChange={event => setForm(prevForm => ({ ...prevForm, fkPrescribedByStaffId: Number(event.target.value) }))} style={selectStyle} required>
                                    <option value="">Select staff…</option>
                                    {staff.map(member => (
                                        <option key={member.id} value={member.id}>
                                            {staffLabel(member.id)} (#{member.id})
                                        </option>
                                    ))}
                                </select>
                            </Box>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Doses</Text>
                                <Input type="number" min={0.01} step="any" value={form.doses || ""} onChange={event => setForm(prevForm => ({ ...prevForm, doses: parseFloat(event.target.value) || 0 }))} placeholder="e.g. 2" required />
                            </Box>
                        </HStack>

                        {formError && <Text color="red.500" fontSize="sm">{formError}</Text>}
                        {formSuccess && <Text color="green.500" fontSize="sm">{formSuccess}</Text>}

                        <HStack gap={3}>
                            <Button type="submit" bg="blue.500" color="white" disabled={submitting}>
                                {submitting ? <Spinner size="sm" /> : editing ? "Save Changes" : "Add Prescription"}
                            </Button>
                            {editing && (
                                <Button type="button" variant="outline" onClick={cancelEdit} disabled={submitting}>Cancel</Button>
                            )}
                        </HStack>
                    </VStack>
                </form>
            </Box>

            {/* Table */}
            {deleteError && <Text color="red.500" fontSize="sm" mb={2}>{deleteError}</Text>}
            {prescriptions.length === 0 ? (
                <Text color="gray.500">No prescriptions yet.</Text>
            ) : (
                <Table.Root size="sm">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>ID</Table.ColumnHeader>
                            <Table.ColumnHeader>Medication</Table.ColumnHeader>
                            <Table.ColumnHeader>Treatment</Table.ColumnHeader>
                            <Table.ColumnHeader>Prescribed by</Table.ColumnHeader>
                            <Table.ColumnHeader>Doses</Table.ColumnHeader>
                            <Table.ColumnHeader />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {prescriptions.map(prescription => (
                            <Table.Row key={prescription.id} bg={editing?.id === prescription.id ? "blue.50" : undefined}>
                                <Table.Cell>{prescription.id}</Table.Cell>
                                <Table.Cell>{medLabel(prescription.fkMedicationId)}</Table.Cell>
                                <Table.Cell>{treatmentLabel(prescription.fkTreatmentId)}</Table.Cell>
                                <Table.Cell>{staffLabel(prescription.fkPrescribedByStaffId)}</Table.Cell>
                                <Table.Cell>{prescription.doses}</Table.Cell>
                                <Table.Cell>
                                    <HStack gap={2} justify="flex-end">
                                        <Button size="xs" variant="outline" onClick={() => startEdit(prescription)} disabled={deletingId === prescription.id}>Edit</Button>
                                        <Button size="xs" colorPalette="red" variant="outline" disabled={deletingId === prescription.id} onClick={() => handleDelete(prescription.id)}>
                                            {deletingId === prescription.id ? <Spinner size="xs" /> : "Delete"}
                                        </Button>
                                    </HStack>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            )}
        </Box>
    )
}
