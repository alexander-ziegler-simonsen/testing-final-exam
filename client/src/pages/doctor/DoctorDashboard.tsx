import { Box, Heading, Spinner, Table, Tabs, Text, Badge } from "@chakra-ui/react"
import { patientService } from "../../services/PatientService"
import { treatmentService } from "../../services/TreatmentService"
import { authService } from "../../services/AuthService"
import RoomBookings from "../../components/RoomBookings"
import MedicationStoragePage from "../MedicationStoragePage"
import SortHeader from "../../components/SortHeader"
import { useSortableData } from "../../hooks/useSortableData"

const fmt = (d: string) => new Date(d).toLocaleString()

export default function DoctorDashboard() {
    const patients   = useSortableData((q) => patientService.getAll(q))
    const treatments = useSortableData((q) => treatmentService.getAll(q), 'time')

    function patientName(id: number) {
        const p = patients.data.find(p => p.id === id)
        return p ? `${p.firstname ?? ""} ${p.lastname ?? ""}`.trim() || `Patient #${id}` : `Patient #${id}`
    }

    return (
        <Box p={8}>
            <Heading mb={1}>Doctor Dashboard</Heading>
            <Text mb={6} color="gray.500">
                Welcome, Dr. {authService.getFullName()}
            </Text>

            <Tabs.Root defaultValue="patients">
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
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {treatments.data.map(t => (
                                    <Table.Row key={t.id}>
                                        <Table.Cell>{t.id}</Table.Cell>
                                        <Table.Cell>{patientName(t.fkPatientId)}</Table.Cell>
                                        <Table.Cell>{t.description ?? "—"}</Table.Cell>
                                        <Table.Cell>{fmt(t.time)}</Table.Cell>
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
