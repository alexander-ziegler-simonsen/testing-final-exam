import { useEffect, useState } from "react"
import { Box, Heading, Spinner, Table, Tabs, Text, Badge } from "@chakra-ui/react"
import { patientService } from "../../services/PatientService"
import { shiftService } from "../../services/ShiftService"
import { authService } from "../../services/AuthService"
import type { Patient } from "../../entites/Patient"
import type { Shift } from "../../entites/Shift"

const fmt = (d: string) => new Date(d).toLocaleString()

export default function NurseDashboard() {
    const [patients, setPatients] = useState<Patient[]>([])
    const [shifts, setShifts] = useState<Shift[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([
            patientService.getAll(),
            shiftService.getAll(),
        ])
            .then(([p, s]) => {
                setPatients(p)
                setShifts(s)
            })
            .catch(() => setError("Failed to load data"))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <Box p={8}><Spinner /></Box>
    if (error)   return <Box p={8}><Text color="red.500">{error}</Text></Box>

    return (
        <Box p={8}>
            <Heading mb={1}>Nurse Dashboard</Heading>
            <Text mb={6} color="gray.500">
                Welcome, {authService.getFullName()}
            </Text>

            <Tabs.Root defaultValue="patients">
                <Tabs.List mb={4}>
                    <Tabs.Trigger value="patients">
                        Patients <Badge ml={2} colorPalette="blue">{patients.length}</Badge>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="shifts">
                        Shifts <Badge ml={2} colorPalette="green">{shifts.length}</Badge>
                    </Tabs.Trigger>
                </Tabs.List>

                {/* Patients tab */}
                <Tabs.Content value="patients">
                    <Table.Root size="sm">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>ID</Table.ColumnHeader>
                                <Table.ColumnHeader>Name</Table.ColumnHeader>
                                <Table.ColumnHeader>Gender</Table.ColumnHeader>
                                <Table.ColumnHeader>CPR</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {patients.map(p => (
                                <Table.Row key={p.id}>
                                    <Table.Cell>{p.id}</Table.Cell>
                                    <Table.Cell>{p.firstname} {p.lastname}</Table.Cell>
                                    <Table.Cell>{p.gender ?? "—"}</Table.Cell>
                                    <Table.Cell>{p.cprNumber ?? "—"}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Tabs.Content>

                {/* Shifts tab */}
                <Tabs.Content value="shifts">
                    <Table.Root size="sm">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>ID</Table.ColumnHeader>
                                <Table.ColumnHeader>Start</Table.ColumnHeader>
                                <Table.ColumnHeader>End</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {shifts.map(s => (
                                <Table.Row key={s.id}>
                                    <Table.Cell>{s.id}</Table.Cell>
                                    <Table.Cell>{fmt(s.startTime)}</Table.Cell>
                                    <Table.Cell>{fmt(s.endTime)}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    )
}
