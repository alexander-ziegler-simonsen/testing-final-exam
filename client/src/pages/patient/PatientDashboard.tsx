import { useEffect, useState } from "react"
import { Box, Heading, Spinner, Table, Text } from "@chakra-ui/react"
import { patientService } from "../../services/PatientService"
import type { Patient } from "../../entites/Patient"

export default function PatientDashboard() {
    const [patients, setPatients] = useState<Patient[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        patientService.getAll()
            .then(setPatients)
            .catch(() => setError("Failed to load patients"))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <Box p={8}><Spinner /></Box>
    if (error)   return <Box p={8}><Text color="red.500">{error}</Text></Box>

    return (
        <Box p={8}>
            <Heading mb={6}>Patients</Heading>

            <Table.Root size="sm">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>ID</Table.ColumnHeader>
                        <Table.ColumnHeader>First Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Last Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Gender</Table.ColumnHeader>
                        <Table.ColumnHeader>CPR</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {patients.map(p => (
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
        </Box>
    )
}
