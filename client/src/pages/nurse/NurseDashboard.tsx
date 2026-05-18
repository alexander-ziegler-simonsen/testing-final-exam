import { useNavigate } from "react-router"
import { Box, Button, Heading, HStack, Input, Spinner, Table, Tabs, Text, Badge } from "@chakra-ui/react"
import { patientService } from "../../services/PatientService"
import { shiftService } from "../../services/ShiftService"
import { authService } from "../../services/AuthService"
import GiveTreatment from "../../components/GiveTreatment"
import RoomBookings from "../../components/RoomBookings"
import MedicationStoragePage from "../MedicationStoragePage"
import SortHeader from "../../components/SortHeader"
import { useSortableData } from "../../hooks/useSortableData"

const formatDate = (dateString: string) => new Date(dateString).toLocaleString()

export default function NurseDashboard() {
    const navigate = useNavigate()
    const patients = useSortableData((query) => patientService.getAll(query))
    const shifts   = useSortableData((query) => shiftService.getAll(query), 'starttime')

    return (
        <Box p={8}>
            <Heading mb={1}>Nurse Dashboard</Heading>
            <Text mb={6} color="gray.500">Welcome, {authService.getFullName()}</Text>

            <Tabs.Root defaultValue="patients">
                <Tabs.List mb={4}>
                    <Tabs.Trigger value="patients">
                        Patients {!patients.loading && <Badge ml={2} colorPalette="blue">{patients.data.length}</Badge>}
                    </Tabs.Trigger>
                    <Tabs.Trigger value="shifts">
                        Shifts {!shifts.loading && <Badge ml={2} colorPalette="green">{shifts.data.length}</Badge>}
                    </Tabs.Trigger>
                    <Tabs.Trigger value="give-treatment">Give Treatment</Tabs.Trigger>
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
                                    <SortHeader col="id" label="ID" sortBy={patients.sortBy} sortDir={patients.sortDir} onSort={patients.onSort} />
                                    <SortHeader col="firstname" label="First Name" sortBy={patients.sortBy} sortDir={patients.sortDir} onSort={patients.onSort} filterValue={patients.filters.firstname} onFilter={patients.setFilter} />
                                    <SortHeader col="lastname" label="Last Name" sortBy={patients.sortBy} sortDir={patients.sortDir} onSort={patients.onSort} filterValue={patients.filters.lastname} onFilter={patients.setFilter} />
                                    <SortHeader col="gender" label="Gender" sortBy={patients.sortBy} sortDir={patients.sortDir} onSort={patients.onSort} filterValue={patients.filters.gender} onFilter={patients.setFilter} />
                                    <SortHeader col="cprnumber" label="CPR" sortBy={patients.sortBy} sortDir={patients.sortDir} onSort={patients.onSort} filterValue={patients.filters.cprnumber} onFilter={patients.setFilter} />
                                    <Table.ColumnHeader />
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {patients.data.map(patient => (
                                    <Table.Row key={patient.id}>
                                        <Table.Cell>{patient.id}</Table.Cell>
                                        <Table.Cell>{patient.firstname ?? "—"}</Table.Cell>
                                        <Table.Cell>{patient.lastname ?? "—"}</Table.Cell>
                                        <Table.Cell>{patient.gender ?? "—"}</Table.Cell>
                                        <Table.Cell>{patient.cprNumber ?? "—"}</Table.Cell>
                                        <Table.Cell>
                                            <Button size="xs" variant="outline" onClick={() => navigate(`/patients/${patient.id}`)}>View</Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    )}
                </Tabs.Content>

                {/* Shifts tab */}
                <Tabs.Content value="shifts">
                    <HStack mb={3} gap={4} align="center">
                        <Box>
                            <Text fontSize="xs" mb={1} color="gray.500">From</Text>
                            <Input type="date" size="sm" value={shifts.filters.from?.split('T')[0] ?? ''} onChange={event => shifts.setFilter('from', event.target.value ? `${event.target.value}T00:00:00` : '')} />
                        </Box>
                        <Box>
                            <Text fontSize="xs" mb={1} color="gray.500">To</Text>
                            <Input type="date" size="sm" value={shifts.filters.to?.split('T')[0] ?? ''} onChange={event => shifts.setFilter('to', event.target.value ? `${event.target.value}T23:59:59` : '')} />
                        </Box>
                    </HStack>
                    {shifts.loading ? <Spinner /> : shifts.error ? (
                        <Text color="red.500">{shifts.error}</Text>
                    ) : (
                        <Table.Root size="sm">
                            <Table.Header>
                                <Table.Row>
                                    <SortHeader col="id" label="ID" sortBy={shifts.sortBy} sortDir={shifts.sortDir} onSort={shifts.onSort} />
                                    <SortHeader col="starttime" label="Start" sortBy={shifts.sortBy} sortDir={shifts.sortDir} onSort={shifts.onSort} />
                                    <SortHeader col="endtime" label="End" sortBy={shifts.sortBy} sortDir={shifts.sortDir} onSort={shifts.onSort} />
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {shifts.data.map(shift => (
                                    <Table.Row key={shift.id}>
                                        <Table.Cell>{shift.id}</Table.Cell>
                                        <Table.Cell>{formatDate(shift.startTime)}</Table.Cell>
                                        <Table.Cell>{formatDate(shift.endTime)}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    )}
                </Tabs.Content>

                {/* Give Treatment tab */}
                <Tabs.Content value="give-treatment">
                    <GiveTreatment patients={patients.data} />
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
