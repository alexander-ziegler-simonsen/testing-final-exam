import { useEffect, useState } from "react"
import { Box, Heading, Spinner, Table, Tabs, Text, Badge } from "@chakra-ui/react"
import MedicationStoragePage from "../MedicationStoragePage"
import { staffService } from "../../services/StaffService"
import { departmentService } from "../../services/DepartmentService"
import { medicationService } from "../../services/MedicationService"
import { missingStorageService } from "../../services/MissingStorageService"
import type { Staff } from "../../entites/Staff"
import type { Department } from "../../entites/Department"
import type { Medication } from "../../entites/Medication"
import type { MedicationStorageMissing } from "../../entites/MedicationStorageMissing"

const fmt = (d: string) => new Date(d).toLocaleString()

// Map role ID to label and color (matches seed data: 1=doctor, 2=nurse)
const roleLabel = (id: number) => id === 1 ? "Doctor" : id === 2 ? "Nurse" : `Role ${id}`
const roleColor = (id: number) => id === 1 ? "blue" : id === 2 ? "green" : "gray"

export default function AdminDashboard() {
    const [staff, setStaff] = useState<Staff[]>([])
    const [departments, setDepartments] = useState<Department[]>([])
    const [medications, setMedications] = useState<Medication[]>([])
    const [missing, setMissing] = useState<MedicationStorageMissing[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([
            staffService.getAll(),
            departmentService.getAll(),
            medicationService.getAll(),
            missingStorageService.getAll(),
        ])
            .then(([s, d, m, ms]) => {
                setStaff(s)
                setDepartments(d)
                setMedications(m)
                setMissing(ms)
            })
            .catch(() => setError("Failed to load data"))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <Box p={8}><Spinner /></Box>
    if (error)   return <Box p={8}><Text color="red.500">{error}</Text></Box>

    return (
        <Box p={8}>
            <Heading mb={6}>Admin Dashboard</Heading>

            <Tabs.Root defaultValue="staff">
                <Tabs.List mb={4}>
                    <Tabs.Trigger value="staff">
                        Staff <Badge ml={2} colorPalette="blue">{staff.length}</Badge>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="departments">
                        Departments <Badge ml={2} colorPalette="teal">{departments.length}</Badge>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="medications">
                        Medications <Badge ml={2} colorPalette="purple">{medications.length}</Badge>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="missing">
                        Missing Stock <Badge ml={2} colorPalette="red">{missing.length}</Badge>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="medication-storage">Medication Storage</Tabs.Trigger>
                </Tabs.List>

                {/* Staff tab */}
                <Tabs.Content value="staff">
                    <Table.Root size="sm">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>ID</Table.ColumnHeader>
                                <Table.ColumnHeader>Name</Table.ColumnHeader>
                                <Table.ColumnHeader>Role</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {staff.map(s => (
                                <Table.Row key={s.id}>
                                    <Table.Cell>{s.id}</Table.Cell>
                                    <Table.Cell>{s.firstname} {s.lastname}</Table.Cell>
                                    <Table.Cell>
                                        <Badge colorPalette={roleColor(s.fkRoleId)}>
                                            {roleLabel(s.fkRoleId)}
                                        </Badge>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Tabs.Content>

                {/* Departments tab */}
                <Tabs.Content value="departments">
                    <Table.Root size="sm">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>ID</Table.ColumnHeader>
                                <Table.ColumnHeader>Name</Table.ColumnHeader>
                                <Table.ColumnHeader>Type</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {departments.map(d => (
                                <Table.Row key={d.id}>
                                    <Table.Cell>{d.id}</Table.Cell>
                                    <Table.Cell>{d.name ?? "—"}</Table.Cell>
                                    <Table.Cell>{d.type ?? "—"}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Tabs.Content>

                {/* Medications tab */}
                <Tabs.Content value="medications">
                    <Table.Root size="sm">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>ID</Table.ColumnHeader>
                                <Table.ColumnHeader>Name</Table.ColumnHeader>
                                <Table.ColumnHeader>Category</Table.ColumnHeader>
                                <Table.ColumnHeader>Form</Table.ColumnHeader>
                                <Table.ColumnHeader>Strength</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {medications.map(m => (
                                <Table.Row key={m.id}>
                                    <Table.Cell>{m.id}</Table.Cell>
                                    <Table.Cell>{m.name ?? "—"}</Table.Cell>
                                    <Table.Cell>{m.category ?? "—"}</Table.Cell>
                                    <Table.Cell>{m.form ?? "—"}</Table.Cell>
                                    <Table.Cell>{m.strength ?? "—"}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Tabs.Content>

                {/* Missing stock tab */}
                <Tabs.Content value="missing">
                    <Table.Root size="sm">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>ID</Table.ColumnHeader>
                                <Table.ColumnHeader>Storage ID</Table.ColumnHeader>
                                <Table.ColumnHeader>Amount Missing</Table.ColumnHeader>
                                <Table.ColumnHeader>Reported At</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {missing.map(ms => (
                                <Table.Row key={ms.id}>
                                    <Table.Cell>{ms.id}</Table.Cell>
                                    <Table.Cell>{ms.fkMedicationStorageId}</Table.Cell>
                                    <Table.Cell>{ms.amountMissing}</Table.Cell>
                                    <Table.Cell>{fmt(ms.wentMissingAt)}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Tabs.Content>
                {/* Medication Storage tab */}
                <Tabs.Content value="medication-storage">
                    <MedicationStoragePage />
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    )
}
