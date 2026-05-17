import { useState } from "react"
import { Box, Button, Heading, HStack, Input, Spinner, Table, Tabs, Text, Badge, Textarea, VStack } from "@chakra-ui/react"
import { patientService } from "../../services/PatientService"
import { treatmentService, type TreatmentInput } from "../../services/TreatmentService"
import { authService } from "../../services/AuthService"
import RoomBookings from "../../components/RoomBookings"
import MedicationStoragePage from "../MedicationStoragePage"
import SortHeader from "../../components/SortHeader"
import { useSortableData } from "../../hooks/useSortableData"
import type { Treatment } from "../../entites/Treatment"

const formatDate = (dateString: string) => new Date(dateString).toLocaleString()

function toLocalInput(iso: string) {
    const date = new Date(iso)
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return date.toISOString().slice(0, 16)
}

export default function DoctorDashboard() {
    const patients   = useSortableData((query) => patientService.getAll(query))
    const treatments = useSortableData((query) => treatmentService.getAll(query), 'time')

    const [editing, setEditing]       = useState<Treatment | null>(null)
    const [form, setForm]             = useState<TreatmentInput>({ fkPatientId: 0, time: "" })
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError]   = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    function patientName(id: number) {
        const patient = patients.data.find(patient => patient.id === id)
        return patient ? `${patient.firstname ?? ""} ${patient.lastname ?? ""}`.trim() || `Patient #${id}` : `Patient #${id}`
    }

    function startEdit(treatment: Treatment) {
        setEditing(treatment)
        setForm({ fkPatientId: treatment.fkPatientId, description: treatment.description, time: toLocalInput(treatment.time) })
        setFormError(null)
    }

    function cancelEdit() {
        setEditing(null)
        setFormError(null)
    }

    async function handleSave(event: React.SyntheticEvent) {
        event.preventDefault()
        if (!editing) return
        setSubmitting(true)
        setFormError(null)
        try {
            const payload: TreatmentInput = { ...form, time: new Date(form.time).toISOString() }
            await treatmentService.update(editing.id, payload)
            treatments.setData(prev => prev.map(treatment => treatment.id === editing.id ? { ...treatment, ...payload } : treatment))
            setEditing(null)
        } catch {
            setFormError("Failed to update treatment.")
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(id: number) {
        setDeletingId(id)
        setDeleteError(null)
        try {
            await treatmentService.delete(id)
            treatments.setData(prev => prev.filter(treatment => treatment.id !== id))
        } catch {
            setDeleteError("Failed to delete treatment.")
        } finally {
            setDeletingId(null)
        }
    }

    const selectStyle: React.CSSProperties = {
        width: "100%", padding: "8px 12px", borderRadius: "6px",
        border: "1px solid #e2e8f0", fontSize: "14px", background: "white",
    }

    return (
        <Box p={8}>
            <Heading mb={1}>Doctor Dashboard</Heading>
            <Text mb={6} color="gray.500">
                Welcome, Dr. {authService.getFullName()}
            </Text>

            <Tabs.Root defaultValue="patients">
                {/* header tabs */}
                <Tabs.List mb={4}>
                    <Tabs.Trigger value="patients">
                        Patients {!patients.loading && <Badge ml={2} colorPalette="blue">{patients.data.length}</Badge>}
                    </Tabs.Trigger>
                    <Tabs.Trigger value="treatments">
                        Treatments {!treatments.loading && <Badge ml={2} colorPalette="purple">{treatments.data.length}</Badge>}
                    </Tabs.Trigger>
                    <Tabs.Trigger value="book-room">Book Room</Tabs.Trigger>
                    <Tabs.Trigger value="medication-storage">Medication Storage</Tabs.Trigger>
                </Tabs.List>

                {/* Patients tab */}
                <Tabs.Content value="patients">
                    {patients.loading ? <Spinner /> : patients.error ? (
                        <Text color="red.500">{patients.error}</Text>
                    ) : (
                        <Table.Root size="sm">
                            <Table.Header>
                                <Table.Row>
                                    <SortHeader col="id"        label="ID"        sortBy={patients.sortBy} sortDir={patients.sortDir} onSort={patients.onSort} />
                                    <SortHeader col="firstname" label="First Name" sortBy={patients.sortBy} sortDir={patients.sortDir} onSort={patients.onSort} filterValue={patients.filters.firstname}  onFilter={patients.setFilter} />
                                    <SortHeader col="lastname"  label="Last Name"  sortBy={patients.sortBy} sortDir={patients.sortDir} onSort={patients.onSort} filterValue={patients.filters.lastname}   onFilter={patients.setFilter} />
                                    <SortHeader col="gender"    label="Gender"     sortBy={patients.sortBy} sortDir={patients.sortDir} onSort={patients.onSort} filterValue={patients.filters.gender}     onFilter={patients.setFilter} />
                                    <SortHeader col="cprnumber" label="CPR"        sortBy={patients.sortBy} sortDir={patients.sortDir} onSort={patients.onSort} filterValue={patients.filters.cprnumber}  onFilter={patients.setFilter} />
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {patients.data.map(p => (
                                    <Table.Row key={p.id}>
                                        <Table.Cell>{p.id}</Table.Cell>
                                        <Table.Cell>{p.firstname ?? "—"}</Table.Cell>
                                        <Table.Cell>{p.lastname ?? "—"}</Table.Cell>
                                        <Table.Cell>{p.gender ?? "—"}</Table.Cell>
                                        <Table.Cell>{p.cprNumber ?? "—"}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    )}
                </Tabs.Content>

                {/* Treatments tab */}
                <Tabs.Content value="treatments">
                    {/* Inline edit form — only shown when a row's Edit button is clicked */}
                    {editing && (
                        <Box borderWidth={1} borderRadius="lg" p={5} mb={5}>
                            <Heading size="sm" mb={3}>Editing treatment #{editing.id}</Heading>
                            <form onSubmit={handleSave}>
                                <VStack align="stretch" gap={3}>
                                    <Box>
                                        <Text fontWeight="medium" fontSize="sm" mb={1}>Patient</Text>
                                        <select
                                            value={form.fkPatientId}
                                            onChange={event => setForm(prevForm => ({ ...prevForm, fkPatientId: Number(event.target.value) }))}
                                            style={selectStyle}
                                            required
                                        >
                                            {patients.data.map(patient => (
                                                <option key={patient.id} value={patient.id}>
                                                    {patient.firstname} {patient.lastname} (#{patient.id})
                                                </option>
                                            ))}
                                        </select>
                                    </Box>
                                    <Box>
                                        <Text fontWeight="medium" fontSize="sm" mb={1}>Description</Text>
                                        <Textarea
                                            value={form.description ?? ""}
                                            onChange={event => setForm(prevForm => ({ ...prevForm, description: event.target.value }))}
                                            rows={2}
                                        />
                                    </Box>
                                    <Box>
                                        <Text fontWeight="medium" fontSize="sm" mb={1}>Time</Text>
                                        <Input
                                            type="datetime-local"
                                            value={form.time}
                                            onChange={event => setForm(prevForm => ({ ...prevForm, time: event.target.value }))}
                                            required
                                        />
                                    </Box>
                                    {formError && <Text color="red.500" fontSize="sm">{formError}</Text>}
                                    <HStack gap={3}>
                                        <Button type="submit" bg="blue.500" color="white" disabled={submitting}>
                                            {submitting ? <Spinner size="sm" /> : "Save Changes"}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={cancelEdit} disabled={submitting}>
                                            Cancel
                                        </Button>
                                    </HStack>
                                </VStack>
                            </form>
                        </Box>
                    )}

                    {deleteError && <Text color="red.500" fontSize="sm" mb={2}>{deleteError}</Text>}

                    {treatments.loading ? <Spinner /> : treatments.error ? (
                        <Text color="red.500">{treatments.error}</Text>
                    ) : (
                        <Table.Root size="sm">
                            <Table.Header>
                                <Table.Row>
                                    <SortHeader col="id"          label="ID"          sortBy={treatments.sortBy} sortDir={treatments.sortDir} onSort={treatments.onSort} />
                                    <SortHeader col="fkpatientid" label="Patient"      sortBy={treatments.sortBy} sortDir={treatments.sortDir} onSort={treatments.onSort} />
                                    <SortHeader col="description" label="Description"  sortBy={treatments.sortBy} sortDir={treatments.sortDir} onSort={treatments.onSort} filterValue={treatments.filters.description} onFilter={treatments.setFilter} />
                                    <SortHeader col="time"        label="Time"         sortBy={treatments.sortBy} sortDir={treatments.sortDir} onSort={treatments.onSort} />
                                    <Table.ColumnHeader />
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {treatments.data.map(treatment => (
                                    <Table.Row key={treatment.id} bg={editing?.id === treatment.id ? "blue.50" : undefined}>
                                        <Table.Cell>{treatment.id}</Table.Cell>
                                        <Table.Cell>{patientName(treatment.fkPatientId)}</Table.Cell>
                                        <Table.Cell>{treatment.description ?? "—"}</Table.Cell>
                                        <Table.Cell>{formatDate(treatment.time)}</Table.Cell>
                                        <Table.Cell>
                                            <HStack gap={2} justify="flex-end">
                                                <Button size="xs" variant="outline" onClick={() => startEdit(treatment)} disabled={deletingId === treatment.id}>
                                                    Edit
                                                </Button>
                                                <Button size="xs" colorPalette="red" variant="outline" disabled={deletingId === treatment.id} onClick={() => handleDelete(treatment.id)}>
                                                    {deletingId === treatment.id ? <Spinner size="xs" /> : "Delete"}
                                                </Button>
                                            </HStack>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    )}
                </Tabs.Content>

                {/* Book Room tab */}
                <Tabs.Content value="book-room">
                    <RoomBookings />
                </Tabs.Content>

                {/* Medication Storage tab */}
                <Tabs.Content value="medication-storage">
                    <MedicationStoragePage />
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    )
}
