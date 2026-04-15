import { useEffect, useState } from "react"
import { Box, Heading, Spinner, Table, Tabs, Text, Badge } from "@chakra-ui/react"
import { patientService } from "../../services/PatientService"
import { treatmentService } from "../../services/TreatmentService"
import { authService } from "../../services/AuthService"
import type { Patient } from "../../entites/Patient"
import type { Treatment } from "../../entites/Treatment"

const fmt = (d: string) => new Date(d).toLocaleString()

export default function DoctorDashboard() {
    const [patients, setPatients] = useState<Patient[]>([])
    const [treatments, setTreatments] = useState<Treatment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([
            patientService.getAll(),
            treatmentService.getAll(),
        ])
            .then(([p, t]) => {
                setPatients(p)
                setTreatments(t)
            })
            .catch(() => setError("Failed to load data"))
            .finally(() => setLoading(false))
    }, [])

    const patientName = (id: number) => {
        const p = patients.find(p => p.id === id)
        return p ? `${p.firstname ?? ""} ${p.lastname ?? ""}`.trim() : `Patient #${id}`
    }

    if (loading) return <Box p={8}><Spinner /></Box>
    if (error)   return <Box p={8}><Text color="red.500">{error}</Text></Box>

    return (
        <Box p={8}>
            <Heading mb={1}>Doctor Dashboard</Heading>
            <Text mb={6} color="gray.500">
                Welcome, Dr. {authService.getFullName()}
            </Text>

            <Tabs.Root defaultValue="patients">
                <Tabs.List mb={4}>
                    <Tabs.Trigger value="patients">
                        Patients <Badge ml={2} colorPalette="blue">{patients.length}</Badge>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="treatments">
                        Treatments <Badge ml={2} colorPalette="purple">{treatments.length}</Badge>
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

                {/* Treatments tab */}
                <Tabs.Content value="treatments">
                    <Table.Root size="sm">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>ID</Table.ColumnHeader>
                                <Table.ColumnHeader>Patient</Table.ColumnHeader>
                                <Table.ColumnHeader>Description</Table.ColumnHeader>
                                <Table.ColumnHeader>Time</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {treatments.map(t => (
                                <Table.Row key={t.id}>
                                    <Table.Cell>{t.id}</Table.Cell>
                                    <Table.Cell>{patientName(t.fkPatientId)}</Table.Cell>
                                    <Table.Cell>{t.description ?? "—"}</Table.Cell>
                                    <Table.Cell>{fmt(t.time)}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    )
}
