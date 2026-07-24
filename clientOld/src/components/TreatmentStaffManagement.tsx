import { useEffect, useState } from "react"
import { Box, Button, Heading, HStack, Spinner, Table, Text, VStack } from "@chakra-ui/react"
import { treatmentStaffService, type TreatmentStaffInput } from "../services/TreatmentStaffService"
import { treatmentService } from "../services/TreatmentService"
import { staffService } from "../services/StaffService"
import type { TreatmentStaff } from "../entites/TreatmentStaff"
import type { Treatment } from "../entites/Treatment"
import type { Staff } from "../entites/Staff"

const emptyForm = (): TreatmentStaffInput => ({ fkTreatmentId: 0, fkStaffId: 0 })

const selectStyle: React.CSSProperties = {
    width: "100%", padding: "8px 12px", borderRadius: "6px",
    border: "1px solid rgba(128,128,128,0.4)", fontSize: "14px", colorScheme: "inherit",
}

export default function TreatmentStaffManagement() {
    const [assignments, setAssignments] = useState<TreatmentStaff[]>([])
    const [treatments, setTreatments] = useState<Treatment[]>([])
    const [staff, setStaff] = useState<Staff[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    const [editing, setEditing] = useState<TreatmentStaff | null>(null)
    const [form, setForm] = useState<TreatmentStaffInput>(emptyForm())
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState<string | null>(null)

    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([
            treatmentStaffService.getAll(),
            treatmentService.getAll(),
            staffService.getAll(),
        ])
            .then(([ts, treats, stf]) => {
                setAssignments(ts)
                setTreatments(treats)
                setStaff(stf)
            })
            .catch(() => setLoadError("Failed to load treatment staff assignments."))
            .finally(() => setLoading(false))
    }, [])

    function treatmentLabel(id: number) {
        const treatment = treatments.find(treatment => treatment.id === id)
        return treatment ? `#${id}${treatment.description ? ` — ${treatment.description.slice(0, 40)}` : ""}` : `#${id}`
    }

    function staffLabel(id: number) {
        const staffMember = staff.find(member => member.id === id)
        return staffMember ? `${staffMember.firstname ?? ""} ${staffMember.lastname ?? ""}`.trim() || `#${id}` : `#${id}`
    }

    function startEdit(ts: TreatmentStaff) {
        setEditing(ts)
        setForm({ fkTreatmentId: ts.fkTreatmentId, fkStaffId: ts.fkStaffId })
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
        if (!form.fkTreatmentId || !form.fkStaffId) {
            setFormError("Both treatment and staff are required.")
            return
        }

        setSubmitting(true)
        setFormError(null)
        setFormSuccess(null)

        try {
            if (editing) {
                await treatmentStaffService.update(editing.id, form)
                setAssignments(prev => prev.map(ts => ts.id === editing.id ? { ...ts, ...form } : ts))
                setFormSuccess("Assignment updated.")
            } else {
                await treatmentStaffService.create(form)
                const updated = await treatmentStaffService.getAll()
                setAssignments(updated)
                setFormSuccess("Staff assigned to treatment.")
            }
            setEditing(null)
            setForm(emptyForm())
        } catch {
            setFormError(editing ? "Failed to update assignment." : "Failed to assign staff.")
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(id: number) {
        setDeletingId(id)
        setDeleteError(null)
        try {
            await treatmentStaffService.delete(id)
            setAssignments(prev => prev.filter(ts => ts.id !== id))
        } catch {
            setDeleteError("Failed to remove assignment.")
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
                    {editing ? `Editing assignment #${editing.id}` : "Assign Staff to Treatment"}
                </Heading>
                <form onSubmit={handleSubmit}>
                    <VStack align="stretch" gap={3}>
                        <HStack gap={4}>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Treatment</Text>
                                <select value={form.fkTreatmentId || ""} onChange={event => setForm(prevForm => ({ ...prevForm, fkTreatmentId: Number(event.target.value) }))} style={selectStyle}>
                                    <option value="">Select treatment…</option>
                                    {treatments.map(treatment => (
                                        <option key={treatment.id} value={treatment.id}>
                                            {treatmentLabel(treatment.id)}
                                        </option>
                                    ))}
                                </select>
                            </Box>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Staff member</Text>
                                <select value={form.fkStaffId || ""} onChange={event => setForm(prevForm => ({ ...prevForm, fkStaffId: Number(event.target.value) }))} style={selectStyle}>
                                    <option value="">Select staff…</option>
                                    {staff.map(member => (
                                        <option key={member.id} value={member.id}>
                                            {staffLabel(member.id)} (#{member.id})
                                        </option>
                                    ))}
                                </select>
                            </Box>
                        </HStack>

                        {formError && <Text color="red.500" fontSize="sm">{formError}</Text>}
                        {formSuccess && <Text color="green.500" fontSize="sm">{formSuccess}</Text>}

                        <HStack gap={3}>
                            <Button type="submit" bg="blue.500" color="white" disabled={submitting}>
                                {submitting ? <Spinner size="sm" /> : editing ? "Save Changes" : "Assign"}
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
            {assignments.length === 0 ? (
                <Text color="gray.500">No assignments yet.</Text>
            ) : (
                <Table.Root size="sm">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>ID</Table.ColumnHeader>
                            <Table.ColumnHeader>Treatment</Table.ColumnHeader>
                            <Table.ColumnHeader>Staff</Table.ColumnHeader>
                            <Table.ColumnHeader />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {assignments.map(ts => (
                            <Table.Row key={ts.id} bg={editing?.id === ts.id ? "blue.50" : undefined}>
                                <Table.Cell>{ts.id}</Table.Cell>
                                <Table.Cell>{treatmentLabel(ts.fkTreatmentId)}</Table.Cell>
                                <Table.Cell id="staff-name-cell">{staffLabel(ts.fkStaffId)}</Table.Cell>
                                <Table.Cell>
                                    <HStack gap={2} justify="flex-end">
                                        <Button size="xs" variant="outline" onClick={() => startEdit(ts)} disabled={deletingId === ts.id}>Edit</Button>
                                        <Button size="xs" colorPalette="red" variant="outline" disabled={deletingId === ts.id} onClick={() => handleDelete(ts.id)}>
                                            {deletingId === ts.id ? <Spinner size="xs" /> : "Remove"}
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
